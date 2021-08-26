//
// EQMDriver.swift
// eqMac
//
// Created by Nodeful on 12/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

@objc class EQMDriver: NSObject {
  static var host: AudioServerPlugInHostRef?
  static var hostTicksPerFrame: Float64?
  
  static private var _interface: AudioServerPlugInDriverInterface?
  static private var _interfacePtr: UnsafeMutablePointer<AudioServerPlugInDriverInterface>?
  
  static var refCounter = AtomicCounter<UInt32>()
  
  @objc public static var ref: AudioServerPlugInDriverRef?
  
  @objc
  public static func create (allocator: CFAllocator!, requestedTypeUUID: CFUUID!) -> UnsafeMutableRawPointer? {
    // This is the CFPlugIn factory function. Its job is to create the implementation for the given
    // type provided that the type is supported. Because this driver is simple and all its
    // initialization is handled via static iniitalization when the bundle is loaded, all that
    // needs to be done is to return the AudioServerPlugInDriverRef that points to the driver's
    // interface. A more complicated driver would create any base line objects it needs to satisfy
    // the IUnknown methods that are used to discover that actual interface to talk to the driver.
    // The majority of the driver's initilization should be handled in the Initialize() method of
    // the driver's AudioServerPlugInDriverInterface.
    
    if !CFEqual(requestedTypeUUID, kAudioServerPluginTypeUUID) {
      return nil
    }
    
    return UnsafeMutableRawPointer(createRef())
  }
  
  private static func createRef () -> AudioServerPlugInDriverRef {
    if ref != nil {
      return ref!
    }
    
    _interface = AudioServerPlugInDriverInterface(
      _reserved: nil,
      QueryInterface: EQM_QueryInterface,
      AddRef: EQM_AddRef,
      Release: EQM_Release,
      Initialize: EQM_Initialize,
      CreateDevice: EQM_CreateDevice,
      DestroyDevice: EQM_DestroyDevice,
      AddDeviceClient: EQM_AddDeviceClient,
      RemoveDeviceClient: EQM_RemoveDeviceClient,
      PerformDeviceConfigurationChange: EQM_PerformDeviceConfigurationChange,
      AbortDeviceConfigurationChange: EQM_AbortDeviceConfigurationChange,
      HasProperty: EQM_HasProperty,
      IsPropertySettable: EQM_IsPropertySettable,
      GetPropertyDataSize: EQM_GetPropertyDataSize,
      GetPropertyData: EQM_GetPropertyData,
      SetPropertyData: EQM_SetPropertyData,
      StartIO: EQM_StartIO,
      StopIO: EQM_StopIO,
      GetZeroTimeStamp: EQM_GetZeroTimeStamp,
      WillDoIOOperation: EQM_WillDoIOOperation,
      BeginIOOperation: EQM_BeginIOOperation,
      DoIOOperation: EQM_DoIOOperation,
      EndIOOperation: EQM_EndIOOperation
    )
    
    _interfacePtr = withUnsafeMutablePointer(to: &_interface!) { $0 }
    ref = withUnsafeMutablePointer(to: &_interfacePtr) { $0 }
    
    return ref!
  }
  
  static func validateDriver (_ driverPointer: UnsafeMutableRawPointer?, reference: AudioServerPlugInDriverRef = EQMDriver.ref!) -> Bool {
    guard driverPointer != nil else { return false }
    let driver = driverPointer!.assumingMemoryBound(to: (UnsafeMutablePointer<AudioServerPlugInDriverInterface>?).self)
    let valid = reference == driver
    return valid
  }

  static func validateObject (_ objectID: AudioObjectID) -> Bool {
    if getEQMObject(from: objectID) != nil {
      return true
    }
    log("Invalid object for ID: \(objectID)")
    return false
  }

  static func getEQMObject(from objectID: AudioObjectID) -> EQMObject.Type? {
    switch objectID {
    case kObjectID_PlugIn: return EQMPlugIn.self
    case kObjectID_Device: return EQMDevice.self
    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return EQMStream.self
    case kObjectID_Volume_Output_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Output_Master: return EQMControl.self
    default: return nil
    }
  }
  
  static func getEQMObjectClassName (from objectID: AudioObjectID) -> String {
    switch objectID {
    case kObjectID_PlugIn: return "🟢 PlugIn"
    case kObjectID_Device: return "​🔴​​ Device"
    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return "🟠 Stream"
    case kObjectID_Volume_Output_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Output_Master: return "🔵​ Control"
    default: return "⚫️ Unknown"
    }
  }
  
  static func calculateHostTicksPerFrame () {
    //  calculate the host ticks per frame
    var theTimeBaseInfo = mach_timebase_info()
    mach_timebase_info(&theTimeBaseInfo)
    var theHostClockFrequency = Float64(theTimeBaseInfo.denom) / Float64(theTimeBaseInfo.numer)
    theHostClockFrequency *= 1000000000.0
    hostTicksPerFrame = theHostClockFrequency / EQMDevice.sampleRate
  }
}
