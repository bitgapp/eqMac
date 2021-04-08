//
//  Application.swift
//  eqMac
//
//  Created by Roman Kisil on 22/01/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa
import AMCoreAudio
import Dispatch
import Sentry
import EmitterKit
import AVFoundation
import SwiftyUserDefaults
import SwiftyJSON
import ServiceManagement
import ReSwift
import Sparkle

enum VolumeChangeDirection: String {
  case UP = "UP"
  case DOWN = "DOWN"
}

class Application {
  // Engine
  static var sources: Sources!
  static var effects: Effects!
  static var volume: Volume!
  static var engine: Engine!
  static var output: Output!
  static var selectedDevice: AudioDevice!
  static var selectedDeviceIsAliveListener: EventListener<AudioDevice>?
  static var selectedDeviceVolumeChangedListener: EventListener<AudioDevice>?
  static var selectedDeviceSampleRateChangedListener: EventListener<AudioDevice>?
  static var justChangedSelectedDeviceVolume = false
  
  static let audioPipelineIsRunning = EmitterKit.Event<Void>()
  static var audioPipelineIsRunningListener: EmitterKit.EventListener<Void>?
  
  static var settings: Settings!
  static var ui: UI!
  
  static var dataBus: DataBus!
  static var updater = SUUpdater(for: Bundle.main)!
  static func newState (_ state: ApplicationState) {}
  
  static var supportPath: URL {
    //Create App directory if not exists:
    let fileManager = FileManager()
    let urlPaths = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)
    
    let appDirectory = urlPaths.first!.appendingPathComponent(Bundle.main.bundleIdentifier! ,isDirectory: true)
    var objCTrue: ObjCBool = true
    let path = appDirectory.path
    if !fileManager.fileExists(atPath: path, isDirectory: &objCTrue) {
      try! fileManager.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
    }
    return appDirectory
  }
  
  static private let dispatchActionQueue = DispatchQueue(label: "dispatchActionQueue", qos: .userInitiated)
  // Custom dispatch function. Need to execute all dispatches on the main thread
  static func dispatchAction(_ action: Action, onMainThread: Bool = true) {
    if (onMainThread) {
      DispatchQueue.main.async {
        store.dispatch(action)
      }
    } else {
      dispatchActionQueue.async {
        store.dispatch(action)
      }
    }
  }
  static let store: Store = Store(reducer: ApplicationStateReducer, state: Storage[.state] ?? ApplicationState(), middleware: [])
  
  
  static public func start () {
    setupSettings()
    Networking.startMonitor()

    if (!Constants.DEBUG) {
      setupCrashReporting()
    }
    
    checkDriver {
      AudioDevice.register = true
      audioPipelineIsRunningListener = audioPipelineIsRunning.once {
        self.setupUI()
        if (User.isFirstLaunch || Constants.DEBUG) {
          UI.show()
        } else {
          UI.close()
        }
        
      }
      setupAudio()
    }
  }
  
  private static func setupSettings () {
    self.settings = Settings()
    updater.automaticallyChecksForUpdates = true
  }
  
  private static func setupCrashReporting () {
    // Create a Sentry client and start crash handler
    SentrySDK.start { options in
      options.dsn = Constants.SENTRY_ENDPOINT
      options.sampleRate = 0.1
    }
  }
  
  private static func checkDriver (_ completion: @escaping() -> Void) {
    if !Driver.isInstalled || Driver.isMismatched {
      let isJustMismatched = Driver.isInstalled && Driver.isMismatched
      let message = isJustMismatched ?
        "For unknown reason the version of Audio Driver needed for eqMac to work corrently is not correct. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
        : "For unknown reason the Audio Driver needed for eqMac to work corrently is not installed. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
      let title = isJustMismatched ? "The eqMac Audio Driver is Outdated" : "The eqMac Audio Driver is not installed"
      Alert.withButtons(
        title: title,
        message: message,
        buttons: ["Restart Mac", "Re-install eqMac", "Quit"]
      ) { buttonPressed in
        Console.log(buttonPressed)
        switch NSApplication.ModalResponse(buttonPressed) {
          case .alertFirstButtonReturn:
            self.restartMac()
            break
          case .alertSecondButtonReturn:
            NSWorkspace.shared.open(Constants.WEBSITE_URL)
          default: break
        }
        return self.quit()
      }
    } else {
      completion()
    }
  }
  
  private static func setupAudio () {
    Console.log("Setting up Audio Engine")
    showPassthroughDevice() {
      // Make sure the Driver is not currently selected
      if (AudioDevice.currentOutputDevice.id == Driver.device!.id) {
        AudioDevice.builtInOutputDevice.setAsDefaultOutputDevice()
      }
      setupDeviceEvents()
      startPassthrough()
    }
  }
  
  private static var showPasshtroughDeviceChecks: Int = 0
  private static var showPassthroughDeviceCheckQueue: DispatchQueue?
  private static func showPassthroughDevice (_ completion: @escaping() -> Void) {
    if (Driver.hidden) {
      Driver.shown = true
      showPasshtroughDeviceChecks = 0
      showPassthroughDeviceCheckQueue = DispatchQueue(label: "check-driver-shown", qos: .userInteractive)
      showPassthroughDeviceCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForPasshtroughDeviceShown(completion)
      }
    } else {
      completion()
    }
  }
  private static func waitAndCheckForPasshtroughDeviceShown (_ completion: @escaping() -> Void) {
    showPasshtroughDeviceChecks += 1
    if (Driver.device == nil) {
      if (showPasshtroughDeviceChecks > 5) {
        return passthroughDeviceFailedToActivatePrompt()
      }
      showPassthroughDeviceCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForPasshtroughDeviceShown(completion)
      }
      return
    }
    showPassthroughDeviceCheckQueue = nil
    completion()
  }
  
  private static func passthroughDeviceFailedToActivatePrompt () {
    Alert.confirm(
    title: "Driver failed to activate", message: "Unfortunately the audio driver has failed to active. You can restart eqMac and try again or quit.", okText: "Try again", cancelText: "Quit") { restart in
      if restart {
        return self.restart()
      } else {
        return self.quit()
      }
    }
  }
  
  static var ignoreNextVolumeEvent = false
  
  private static func setupDeviceEvents () {
    AudioDeviceEvents.on(.outputChanged) { device in
      if device.isHardware {
        Console.log("outputChanged: ", device, " starting PlayThrough")
        startPassthrough()
      }
    }
    
    AudioDeviceEvents.onDeviceListChanged { list in
      Console.log("listChanged", list)
      
      if list.added.count > 0 {
        for added in list.added {
          if Output.autoSelect(added) {
            selectOutput(device: added)
            break
          }
        }
      } else if (list.removed.count > 0) {
        
        var currentDeviceRemoved = false
        for removed in list.removed {
          if removed.id == selectedDevice.id {
            currentDeviceRemoved = true
            break
          }
        }
        
        stopEngines()
        if (!currentDeviceRemoved) {
          try! AudioDeviceEvents.recreateEventEmitters([.isAliveChanged, .volumeChanged, .nominalSampleRateChanged])
          self.setupDriverDeviceEvents()
          Utilities.delay(500) {
            createAudioPipeline()
          }
        }
      }
      
    }
    AudioDeviceEvents.on(.isJackConnectedChanged) { device in
      Console.log("isJackConnectedChanged", device, device.isJackConnected(direction: .playback))
      if (device.id != selectedDevice.id) {
        selectOutput(device: device)
      }
    }
    
    setupDriverDeviceEvents()
  }
  
  static var ignoreNextDriverMuteEvent = false
  private static func setupDriverDeviceEvents () {
    AudioDeviceEvents.on(.volumeChanged, onDevice: Driver.device!) {
      if ignoreNextVolumeEvent {
        ignoreNextVolumeEvent = false
        return
      }
      if (overrideNextVolumeEvent) {
        overrideNextVolumeEvent = false
        ignoreNextVolumeEvent = true
        Driver.device!.setVirtualMasterVolume(1, direction: .playback)
        return
      }
      let gain = Double(Driver.device!.virtualMasterVolume(direction: .playback)!)
      if (gain <= 1 && gain != Application.store.state.effects.volume.gain) {
        Application.dispatchAction(VolumeAction.setGain(gain, false))
      }

    }
    
    AudioDeviceEvents.on(.muteChanged, onDevice: Driver.device!) {
      if (ignoreNextDriverMuteEvent) {
        ignoreNextDriverMuteEvent = false
        return
      }
      Application.dispatchAction(VolumeAction.setMuted(Driver.device!.mute))
    }
  }
  
  static func selectOutput (device: AudioDevice) {
    stopEngines()
    Utilities.delay(500) {
      AudioDevice.currentOutputDevice = device
    }
  }
  
  private static func startPassthrough () {
    selectedDevice = AudioDevice.currentOutputDevice
    
    var volume: Double = Application.store.state.effects.volume.gain
    if (AudioDevice.currentOutputDevice.outputVolumeSupported) {
      volume = Double(AudioDevice.currentOutputDevice.virtualMasterVolume(direction: .playback)!)
    }
    
    Application.dispatchAction(VolumeAction.setGain(volume, false))
    Application.dispatchAction(VolumeAction.setBalance(Application.store.state.effects.volume.balance, false))
    
    Driver.device!.setVirtualMasterVolume(volume > 1 ? 1 : Float32(volume), direction: .playback)
    Driver.latency = selectedDevice.latency(direction: .playback) ?? 0 // Set driver latency to mimic device
    Driver.safetyOffset = selectedDevice.safetyOffset(direction: .playback) ?? 0 // Set driver latency to mimic device
    self.matchDriverSampleRateTo48000()
    
    Console.log("Driver new Latency: \(Driver.latency)")
    Console.log("Driver new Safety Offset: \(Driver.safetyOffset)")
    Console.log("Driver new Sample Rate: \(Driver.device!.actualSampleRate())")
    
    AudioDevice.currentOutputDevice = Driver.device!
    // TODO: Figure out a better way
    Utilities.delay(1000) {
      self.createAudioPipeline()
    }
  }
  
  private static func matchDriverSampleRateTo48000 () {
    // Makes correct processing of EQ for different Input formats
    Driver.device!.setNominalSampleRate(48_000)
  }
  
  private static func matchDriverSampleRateToOutput () {
    let outputSampleRate = selectedDevice.actualSampleRate()!
    let driverSampleRates = Driver.sampleRates
    let closestSampleRate = driverSampleRates.min( by: { abs($0 - outputSampleRate) < abs($1 - outputSampleRate) } )!
    Driver.device!.setNominalSampleRate(closestSampleRate)
  }
  
  private static func createAudioPipeline () {
    _ = Sources() { sources in
      self.sources = sources
      effects = Effects()
      volume = Volume()
      engine = Engine(
        sources: sources,
        effects: effects,
        volume: volume
      )
      output = Output(device: selectedDevice, engine: engine)
      
      selectedDeviceIsAliveListener = AudioDeviceEvents.on(
        .isAliveChanged,
        onDevice: selectedDevice,
        retain: false
      ) {
        // If device that we are sending audio to goes offline we need to stop and switch to a different device
        if (selectedDevice.isAlive() == false) {
          Console.log("Current device dies so switching to built it")
          selectOutput(device: AudioDevice.builtInOutputDevice)
        }
      }
      
      selectedDeviceSampleRateChangedListener = AudioDeviceEvents.on(
        .nominalSampleRateChanged,
        onDevice: selectedDevice,
        retain: false
      ) {
        //        selectOutput(device: selectedDevice)
        Utilities.delay(100) {
          // need a delay, because emitter should finish it's work at first
          try! AudioDeviceEvents.recreateEventEmitters([.isAliveChanged, .volumeChanged, .nominalSampleRateChanged])
          self.setupDriverDeviceEvents()
          stopEngines()
          createAudioPipeline()
        }
      }
      
      selectedDeviceVolumeChangedListener = AudioDeviceEvents.on(
        .volumeChanged,
        onDevice: selectedDevice,
        retain: false
      ) {
        let deviceVolume = selectedDevice.virtualMasterVolume(direction: .playback)!
        let driverVolume = Driver.device!.virtualMasterVolume(direction: .playback)!
        if (deviceVolume != driverVolume) {
          Driver.device!.setVirtualMasterVolume(deviceVolume, direction: .playback)
        }
      }
      audioPipelineIsRunning.emit()
    }
  }
  
  private static func setupUI () {
    Console.log("Setting up UI")
    ui = UI()
    setupDataBus()
  }
  
  private static func stopEngines () {
    if (output != nil) {
      output.stop()
    }
    if (engine != nil) {
      engine.stop()
    }
  }
  
  private static func setupDataBus () {
    Console.log("Setting up Data Bus")
    dataBus = ApplicationDataBus(bridge: self.ui.bridge)
  }
  
  static var overrideNextVolumeEvent = false
  static func volumeChangeButtonPressed (direction: VolumeChangeDirection, quarterStep: Bool = false) {
    if volume == nil || engine == nil {
      return
    }
    if direction == .UP {
      ignoreNextDriverMuteEvent = true
      Utilities.delay(100) {
        ignoreNextDriverMuteEvent = false
      }
    }
    let gain = volume.gain
    if (gain >= 1) {
      if direction == .DOWN {
        overrideNextVolumeEvent = true
      }
      
      let steps = quarterStep ? Constants.QUARTER_VOLUME_STEPS : Constants.FULL_VOLUME_STEPS
      
      var stepIndex: Int
      
      if direction == .UP {
        stepIndex = steps.index(where: { $0 > gain }) ?? steps.count - 1
      } else {
        stepIndex = steps.index(where: { $0 >= gain }) ?? 0
        stepIndex -= 1
        if (stepIndex < 0) {
          stepIndex = 0
        }
      }
      
      let newGain = steps[stepIndex]
      
      if (newGain <= 1) {
        Utilities.delay(100) {
          Driver.device!.setVirtualMasterVolume(Float(newGain), direction: .playback)
        }
      }
      Application.dispatchAction(VolumeAction.setGain(newGain, false))
    }
  }
  
  static func muteButtonPressed () {
    ignoreNextDriverMuteEvent = false
  }
  
  private static func killEngine () {
    engine = nil
  }
  
  private static func switchBackToLastKnownDevice () {
    // If the active equalizer global gain hass been lowered we need to equalize the volume to avoid blowing people ears our
    if (effects != nil && effects.equalizers.active.globalGain < 0) {
      if (selectedDevice.canSetVirtualMasterVolume(direction: .playback)) {
        var decibels = selectedDevice.virtualMasterVolumeInDecibels(direction: .playback)!
        decibels = decibels + Float(self.effects.equalizers.active.globalGain)
        selectedDevice.setVirtualMasterVolume(selectedDevice.decibelsToScalar(volume: decibels, channel: 1, direction: .playback)!, direction: .playback)
      } else if (selectedDevice.canSetVolume(channel: 1, direction: .playback)) {
        var decibels = selectedDevice.volumeInDecibels(channel: 1, direction: .playback)!
        decibels = decibels + Float(self.effects.equalizers.active.globalGain)
        for channel in 1...selectedDevice.channels(direction: .playback) {
          selectedDevice.setVolume(selectedDevice.decibelsToScalar(volume: decibels, channel: channel, direction: .playback)!, channel: channel, direction: .playback)
        }
      }
    }
    if (selectedDevice != nil) {
      AudioDevice.currentOutputDevice = selectedDevice
    }
  }
  
  static func quit () {
    stopListeners()
    stopEngines()
    switchBackToLastKnownDevice()
    Driver.hidden = true
    Storage.synchronize()
    NSApp.terminate(nil)
  }
  
  static func restart () {
    let url = URL(fileURLWithPath: Bundle.main.resourcePath!)
    let path = url.deletingLastPathComponent().deletingLastPathComponent().absoluteString
    let task = Process()
    task.launchPath = "/usr/bin/open"
    task.arguments = [path]
    task.launch()
    quit()
  }
  
  static func restartMac () {
    Script.apple("restart_mac")
  }
  
  static func checkForUpdates () {
    updater.checkForUpdates(nil)
  }
  
  static func uninstall (_ completion: @escaping (Bool) -> Void) {
    Driver.uninstall(started: {
      self.stopListeners()
      self.stopEngines()
      self.switchBackToLastKnownDevice()
      UI.close()
      Utilities.delay(100) { UI.showLoadingWindow("Uninstalling eqMac\nIf this process takes too long,\nplease restart your Mac") }
    }) { success in
      completion(success)
      if (success) {
        UI.hideLoadingWindow()
        try! FileManager.default.removeItem(atPath: Bundle.main.bundlePath)
        NSApp.terminate(nil)
      }
    }
  }
  
  static func stopListeners () {
    AudioDeviceEvents.stop()
    selectedDeviceIsAliveListener?.isListening = false
    selectedDeviceIsAliveListener = nil
    
    audioPipelineIsRunningListener?.isListening = false
    audioPipelineIsRunningListener = nil
    
    selectedDeviceVolumeChangedListener?.isListening = false
    selectedDeviceVolumeChangedListener = nil
    
    selectedDeviceSampleRateChangedListener?.isListening = false
    selectedDeviceSampleRateChangedListener = nil
  }
  
  static var version: String {
    return Bundle.main.infoDictionary!["CFBundleVersion"] as! String
  }
}

