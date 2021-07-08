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
  static var engine: Engine?
  static var output: Output?
  static var engineCreated = EmitterKit.Event<Void>()
  static var outputCreated = EmitterKit.Event<Void>()

  static var selectedDevice: AudioDevice?
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
  
  static let store: Store = Store(
    reducer: ApplicationStateReducer,
    state: Storage[.state] ?? ApplicationState(),
    middleware: []
  )

  static public func start () {
    if (!Constants.DEBUG) {
      setupCrashReporting()
    }
    
    self.settings = Settings()
    
    Networking.startMonitor()
    
    checkDriver {
      Sources.getInputPermission {
        AudioDevice.register = true
        audioPipelineIsRunningListener = audioPipelineIsRunning.once {
          self.setupUI {
            if (User.isFirstLaunch || Constants.DEBUG) {
              UI.show()
            } else {
              UI.close()
            }
          }
        }
        setupAudio()
      }
    }
  }
  
  private static func setupCrashReporting () {
    // Create a Sentry client and start crash handler
    SentrySDK.start { options in
      options.dsn = Constants.SENTRY_ENDPOINT
      options.sampleRate = 0.1

      // Only send crash reports if user gave consent
      options.beforeSend = { event in
        if (store.state.settings.doCollectCrashReports) {
          return event
        }
        return nil
      }
    }
  }
  
  private static func checkDriver (_ completion: @escaping() -> Void) {
    if !Driver.isInstalled || !Driver.isCompatible {
      let isIncompatable = Driver.isInstalled && !Driver.isCompatible
      let message = isIncompatable ?
        "For unknown reason the version of Audio Driver needed for eqMac to work corrently is not compatable. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
        : "For unknown reason the Audio Driver needed for eqMac to work corrently is not installed. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
      let title = isIncompatable ? "The eqMac Audio Driver is Incompatable" : "The eqMac Audio Driver is not installed"
      Alert.withButtons(
        title: title,
        message: message,
        buttons: ["Restart Mac", "Re-install eqMac", "Quit"]
      ) { buttonPressed in
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
    showDriver {
      // Make sure the Driver is not currently selected
      if (AudioDevice.currentOutputDevice.id == Driver.device!.id) {
        AudioDevice.builtInOutputDevice.setAsDefaultOutputDevice()
      }
      setupDeviceEvents()
      startPassthrough()
    }
  }
  
  private static var showDriverChecks: Int = 0
  private static var showDriverCheckQueue: DispatchQueue?
  private static func showDriver (_ completion: @escaping() -> Void) {
    if (Driver.hidden) {
      Driver.shown = true
      showDriverChecks = 0
      showDriverCheckQueue = DispatchQueue(label: "check-driver-shown", qos: .userInteractive)
      showDriverCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForDriverShown(completion)
      }
    } else {
      completion()
    }
  }
  private static func waitAndCheckForDriverShown (_ completion: @escaping() -> Void) {
    showDriverChecks += 1
    if (Driver.device == nil) {
      if (showDriverChecks > 5) {
        return driverFailedToActivatePrompt()
      }
      showDriverCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForDriverShown(completion)
      }
      return
    }
    showDriverCheckQueue = nil
    completion()
  }
  
  private static func driverFailedToActivatePrompt () {
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
  
  static func setupDeviceEvents () {
    AudioDeviceEvents.on(.outputChanged) { device in
      if device.id == Driver.device!.id { return }
      if Outputs.isDeviceAllowed(device) {
        Console.log("outputChanged: ", device, " starting PlayThrough")
        startPassthrough()
      } else {
        // TODO: Tell the user eqMac doesn't support this device
      }
    }
    
    AudioDeviceEvents.onDeviceListChanged { list in
      Console.log("listChanged", list)
      
      if list.added.count > 0 {
        for added in list.added {
          if Outputs.shouldAutoSelect(added) {
            selectOutput(device: added)
            break
          }
        }
      } else if (list.removed.count > 0) {
        
        let currentDeviceRemoved = list.removed.contains(where: { $0.id == selectedDevice?.id })
        
        if (currentDeviceRemoved) {
          removeEngines()
          try! AudioDeviceEvents.recreateEventEmitters([.isAliveChanged, .volumeChanged, .nominalSampleRateChanged])
          self.setupDriverDeviceEvents()
          Utilities.delay(500) {
            selectOutput(device: AudioDevice.builtInOutputDevice) // TODO: Replace with a known device from a stack
          }
        }
      }
      
    }
    AudioDeviceEvents.on(.isJackConnectedChanged) { device in
      let connected = device.isJackConnected(direction: .playback)
      Console.log("isJackConnectedChanged", device, connected)
      if (connected == true && device.id != selectedDevice?.id) {
        selectOutput(device: device)
      }
    }
    
    setupDriverDeviceEvents()
  }
  
  static var ignoreNextDriverMuteEvent = false
  static func setupDriverDeviceEvents () {
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
    stopRemoveEngines()
    Utilities.delay(500) {
      AudioDevice.currentOutputDevice = device
    }
  }
  
  static func startPassthrough () {
    selectedDevice = AudioDevice.currentOutputDevice

    if (selectedDevice!.id == Driver.device!.id) {
      selectOutput(device: AudioDevice.builtInOutputDevice) // TODO: Replace with a known device from a stack
      return
    }
    var volume: Double = Application.store.state.effects.volume.gain
    if (AudioDevice.currentOutputDevice.outputVolumeSupported) {
      volume = Double(AudioDevice.currentOutputDevice.virtualMasterVolume(direction: .playback)!)
    }
    
    Application.dispatchAction(VolumeAction.setGain(volume, false))
    Application.dispatchAction(VolumeAction.setBalance(Application.store.state.effects.volume.balance, false))
    
    Driver.device!.setVirtualMasterVolume(volume > 1 ? 1 : Float32(volume), direction: .playback)
    Driver.latency = selectedDevice!.latency(direction: .playback) ?? 0 // Set driver latency to mimic device
//    Driver.safetyOffset = selectedDevice.safetyOffset(direction: .playback) ?? 0 // Set driver latency to mimic device
    self.matchDriverSampleRateToOutput()
    
    Console.log("Driver new Latency: \(Driver.latency)")
    Console.log("Driver new Safety Offset: \(Driver.safetyOffset)")
    Console.log("Driver new Sample Rate: \(Driver.device!.actualSampleRate())")
    
    AudioDevice.currentOutputDevice = Driver.device!
    // TODO: Figure out a better way
    Utilities.delay(1000) {
      createAudioPipeline()
    }
  }

  private static func matchDriverSampleRateToOutput () {
    let outputSampleRate = selectedDevice!.actualSampleRate()!
    let driverSampleRates = Driver.sampleRates
    let closestSampleRate = driverSampleRates.min( by: { abs($0 - outputSampleRate) < abs($1 - outputSampleRate) } )!
    Driver.device!.setNominalSampleRate(closestSampleRate)
  }
  
  private static func createAudioPipeline () {
    engine = nil
    engine = Engine {
      engineCreated.emit()
      output = nil
      output = Output(device: selectedDevice!)
      outputCreated.emit()

      selectedDeviceIsAliveListener = AudioDeviceEvents.on(
        .isAliveChanged,
        onDevice: selectedDevice!,
        retain: false
      ) {
        // If device that we are sending audio to goes offline we need to stop and switch to a different device
        if (selectedDevice!.isAlive() == false) {
          Console.log("Current device dies so switching to built it")
          selectOutput(device: AudioDevice.builtInOutputDevice) // TODO: Replace with a known device from stack
        }
      }
      
      selectedDeviceSampleRateChangedListener = AudioDeviceEvents.on(
        .nominalSampleRateChanged,
        onDevice: selectedDevice!,
        retain: false
      ) {
        stopRemoveEngines()
        Utilities.delay(1000) {
          // need a delay, because emitter should finish it's work at first
          try! AudioDeviceEvents.recreateEventEmitters([.isAliveChanged, .volumeChanged, .nominalSampleRateChanged])
          setupDriverDeviceEvents()
          matchDriverSampleRateToOutput()
          createAudioPipeline()
        }
      }
      
      selectedDeviceVolumeChangedListener = AudioDeviceEvents.on(
        .volumeChanged,
        onDevice: selectedDevice!,
        retain: false
      ) {
        let deviceVolume = selectedDevice!.virtualMasterVolume(direction: .playback)!
        let driverVolume = Driver.device!.virtualMasterVolume(direction: .playback)!
        if (deviceVolume != driverVolume) {
          Driver.device!.setVirtualMasterVolume(deviceVolume, direction: .playback)
        }
      }
      audioPipelineIsRunning.emit()
    }
  }
  
  private static func setupUI (_ completion: @escaping () -> Void) {
    Console.log("Setting up UI")
    ui = UI {
      setupDataBus()
      completion()
    }
  }
  
  static func stopEngines () {
    output?.stop()
    engine?.stop()
  }

  static func removeEngines () {
    output = nil
    engine = nil
  }

  static func stopRemoveEngines () {
    stopEngines()
    removeEngines()
  }
  
  private static func setupDataBus () {
    Console.log("Setting up Data Bus")
    dataBus = ApplicationDataBus(bridge: UI.bridge)
  }
  
  static var overrideNextVolumeEvent = false
  static func volumeChangeButtonPressed (direction: VolumeChangeDirection, quarterStep: Bool = false) {
    if engine == nil || output == nil {
      return
    }
    if direction == .UP {
      ignoreNextDriverMuteEvent = true
      Utilities.delay(100) {
        ignoreNextDriverMuteEvent = false
      }
    }
    let gain = output!.volume.gain
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
      
      var newGain = steps[stepIndex]
      
      if (newGain <= 1) {
        Utilities.delay(100) {
          Driver.device!.setVirtualMasterVolume(Float(newGain), direction: .playback)
        }
      } else {
        if (!Application.store.state.effects.volume.boostEnabled) {
          newGain = 1
        }
      }
      Application.dispatchAction(VolumeAction.setGain(newGain, false))
    }
  }
  
  static func muteButtonPressed () {
    ignoreNextDriverMuteEvent = false
  }
  
  private static func switchBackToLastKnownDevice () {
    // If the active equalizer global gain hass been lowered we need to equalize the volume to avoid blowing people ears our
    if (engine == nil || selectedDevice == nil) { return }
    if (engine!.effects != nil && engine!.effects.equalizers.active.globalGain < 0) {
      if (selectedDevice!.canSetVirtualMasterVolume(direction: .playback)) {
        var decibels = selectedDevice!.virtualMasterVolumeInDecibels(direction: .playback)!
        decibels = decibels + Float(engine!.effects.equalizers.active.globalGain)
        selectedDevice!.setVirtualMasterVolume(selectedDevice!.decibelsToScalar(volume: decibels, channel: 1, direction: .playback)!, direction: .playback)
      } else if (selectedDevice!.canSetVolume(channel: 1, direction: .playback)) {
        var decibels = selectedDevice!.volumeInDecibels(channel: 1, direction: .playback)!
        decibels = decibels + Float(engine!.effects.equalizers.active.globalGain)
        for channel in 1...selectedDevice!.channels(direction: .playback) {
          selectedDevice!.setVolume(selectedDevice!.decibelsToScalar(volume: decibels, channel: channel, direction: .playback)!, channel: channel, direction: .playback)
        }
      }
    }
    AudioDevice.currentOutputDevice = selectedDevice!
  }

  static func stopSave () {
    stopListeners()
    switchBackToLastKnownDevice()
    stopRemoveEngines()
    Storage.synchronize()
  }
  
  static func quit () {
    stopSave()
    Driver.hidden = true
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
  
  static func uninstall () {
    // TODO: Implement uninstaller
    Console.log("// TODO: Download Uninstaller")
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
}

