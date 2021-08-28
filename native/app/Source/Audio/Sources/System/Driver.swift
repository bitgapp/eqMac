//
//  Driver.swift
//  eqMac
//
//  Created by Roman Kisil on 30/10/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AMCoreAudio
import CoreFoundation
import Version

class Driver {
  static func check (_ completion: @escaping() -> Void) {
    if !Driver.isInstalled || !Driver.isCompatible {
      let isIncompatable = Driver.isInstalled && !Driver.isCompatible
      let message = isIncompatable ?
        "For unknown reason the version of Audio Driver needed for eqMac to work currently is not compatable. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
        : "For unknown reason the Audio Driver needed for eqMac to work currently is not installed. Try restarting your computer and run eqMac again. In that doesn't work, try re-installing eqMac from our website."
      let title = isIncompatable ? "The eqMac Audio Driver is Incompatable" : "The eqMac Audio Driver is not installed"
      Alert.withButtons(
        title: title,
        message: message,
        buttons: ["Restart Mac", "Re-install eqMac", "Quit"]
      ) { buttonPressed in
        switch NSApplication.ModalResponse(buttonPressed) {
          case .alertFirstButtonReturn:
            Application.restartMac()
            break
          case .alertSecondButtonReturn:
            NSWorkspace.shared.open(Constants.WEBSITE_URL)
          default: break
        }
        return Application.quit()
      }
    } else {
      completion()
    }
  }

  private static var showChecks: Int = 0
  private static var showCheckQueue: DispatchQueue?

  static func show (_ completion: @escaping() -> Void) {
    if (hidden) {
      shown = true
      showChecks = 0
      showCheckQueue = DispatchQueue(label: "check-driver-shown", qos: .userInteractive)
      showCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForShown(completion)
      }
    } else {
      completion()
    }
  }
  private static func waitAndCheckForShown (_ completion: @escaping() -> Void) {
    showChecks += 1
    if (device == nil) {
      if (showChecks > 5) {
        return failedToShowPrompt()
      }
      showCheckQueue!.asyncAfter(deadline: .now() + .milliseconds(500)) {
        return waitAndCheckForShown(completion)
      }
      return
    }
    showCheckQueue = nil
    completion()
  }

  private static func failedToShowPrompt () {
    Alert.confirm(
    title: "Driver failed to activate", message: "Unfortunately the audio driver has failed to active. You can restart eqMac and try again or quit.", okText: "Try again", cancelText: "Quit") { restart in
      if restart {
        return Application.restart()
      } else {
        return Application.quit()
      }
    }
  }

  static var pluginId: AudioObjectID? {
    return AudioDevice.lookupIDByPluginBundleID(by: Constants.DRIVER_BUNDLE_ID)
  }
  
  static var isInstalled: Bool {
    get {
      return self.device != nil || self.pluginId != nil
    }
  }

  static var name: String {
    get {
      return device!.name
    }
    set {
      var address = AudioObjectPropertyAddress(
        mSelector: EQMDeviceCustom.properties.name,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMaster
      )

      let size = sizeof(CFString.self)
      var name = newValue as CFString
      checkErr(AudioObjectSetPropertyData(Driver.device!.id, &address, 0, nil, size, &name))
    }
  }

  static var latency: UInt32 {
    get {
      return Driver.device!.latency(direction: .playback)!
    }
    set {
      var address = AudioObjectPropertyAddress(
        mSelector: EQMDeviceCustom.properties.latency,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMaster
      )
      
      let size = sizeof(UInt32.self)
      var latency: UInt32 = newValue
      checkErr(AudioObjectSetPropertyData(Driver.device!.id, &address, 0, nil, size, &latency))
    }
  }

  static var shown: Bool {
    get {
      if Driver.device == nil { return false }
      var address = AudioObjectPropertyAddress(
        mSelector: EQMDeviceCustom.properties.shown,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMaster
      )
      
      var size: UInt32 = UInt32(MemoryLayout<CFBoolean>.size)
      
      var shownBool = kCFBooleanFalse
      
      let err = AudioObjectGetPropertyData(Driver.device!.id, &address, 0, nil, &size, &shownBool)
      if err == noErr {
        return CFBooleanGetValue(shownBool!)
      }
      
      // Workaround around a bug in the Driver where it wasn't aware of address
      return Driver.device!.canBeDefaultDevice(direction: .playback)
    }
    set {
      if Driver.device == nil { return }

      var address = AudioObjectPropertyAddress(
        mSelector: EQMDeviceCustom.properties.shown,
        mScope: kAudioObjectPropertyScopeGlobal,
        mElement: kAudioObjectPropertyElementMaster
      )
      
      let size: UInt32 = UInt32(MemoryLayout<CFBoolean>.size)
      var shownBool: CFBoolean = newValue.cfBooleanValue
      
      checkErr(AudioObjectSetPropertyData(Driver.device!.id, &address, 0, nil, size, &shownBool))
    }
  }
  
  static var installedVersion: Version {
    if Driver.device == nil { return .null }
    var address = AudioObjectPropertyAddress(
      mSelector: EQMDeviceCustom.properties.version,
      mScope: kAudioObjectPropertyScopeGlobal,
      mElement: kAudioObjectPropertyElementMaster
    )
    
    var size: UInt32 = UInt32(MemoryLayout<CFString>.size)
    
    var version: CFString? = nil
    
    checkErr(AudioObjectGetPropertyData(Driver.device!.id, &address, 0, nil, &size, &version))

    let verStr = version as String?
    return verStr != nil ? (Version(tolerant: verStr!) ?? .null) : .null
  }
  
  static var isCompatible: Bool {
    let compatibleRange = Constants.DRIVER_MINIMUM_VERSION ..< Version(2, 0, 0)
    return compatibleRange.contains(installedVersion)
  }
  
  static var hidden: Bool {
    get { return !shown }
    set { shown = !newValue }
  }
  
  static var device: AudioDevice? {
    return AudioDevice.lookup(by: Constants.DRIVER_DEVICE_UID)
  }
  
}

