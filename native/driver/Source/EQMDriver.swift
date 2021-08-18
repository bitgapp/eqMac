//
// EQMDriver.swift
// eqMac
//
// Created by Nodeful on 12/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn
import Atomics

@objc
class EQMDriver: NSObject {
  static var host: AudioServerPlugInHostRef?
  static var hostTicksPerFrame: Float64?

  static private var _interface: AudioServerPlugInDriverInterface?
  static private var _interfacePtr: UnsafeMutablePointer<AudioServerPlugInDriverInterface>?

  static private var _ref: AudioServerPlugInDriverRef?
  static let refCounter = ManagedAtomic<UInt32>(0)
  static var ref: AudioServerPlugInDriverRef {
    if let ref = _ref {
      return ref
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
    let ref = withUnsafeMutablePointer(to: &_interfacePtr) { $0 }
    _ref = ref

    return ref
  }

  @objc
  static func create (allocator: CFAllocator!, requestedTypeUUID: CFUUID!) -> UnsafeMutableRawPointer? {
    // This is the CFPlugIn factory function. Its job is to create the implementation for the given
    // type provided that the type is supported. Because this driver is simple and all its
    // initialization is handled via static iniitalization when the bundle is loaded, all that
    // needs to be done is to return the AudioServerPlugInDriverRef that points to the driver's
    // interface. A more complicated driver would create any base line objects it needs to satisfy
    // the IUnknown methods that are used to discover that actual interface to talk to the driver.
    // The majority of the driver's initilization should be handled in the Initialize() method of
    // the driver's AudioServerPlugInDriverInterface.

    if (requestedTypeUUID != kAudioServerPluginTypeUUID) {
      return nil
    }

    return UnsafeMutableRawPointer(ref)
  }
}

func validate (_ driverPointer: UnsafeMutableRawPointer?, reference: AudioServerPlugInDriverRef = EQMDriver.ref) -> Bool {
  if let driverPointer = driverPointer {
    let driver = driverPointer.assumingMemoryBound(to: (UnsafeMutablePointer<AudioServerPlugInDriverInterface>?).self)
    return reference == driver
  }
  return false
}

func calculateHostTicksPerFrame () -> Float64 {
  //  calculate the host ticks per frame
  var theTimeBaseInfo = mach_timebase_info()
  mach_timebase_info(&theTimeBaseInfo)
  var theHostClockFrequency = Float64(theTimeBaseInfo.denom) / Float64(theTimeBaseInfo.numer)
  theHostClockFrequency *= 1000000000.0
  return theHostClockFrequency / EQMDevice.sampleRate
}

// MARK: - Inheritance
func EQM_QueryInterface (inDriver: UnsafeMutableRawPointer?, inUUID: REFIID, outInterface: UnsafeMutablePointer<LPVOID?>?) -> HRESULT {
  // This function is called by the HAL to get the interface to talk to the plug-in through.
  // AudioServerPlugIns are required to support the IUnknown interface and the
  // AudioServerPlugInDriverInterface. As it happens, all interfaces must also provide the
  // IUnknown interface, so we can always just return the single interface we made with
  // gAudioServerPlugInDriverInterfacePtr regardless of which one is asked for.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }


  guard let uuid = CFUUIDCreateFromUUIDBytes(nil, inUUID), let interface = outInterface else {
    return kAudioHardwareIllegalOperationError
  }

  guard uuid == IUnknownUUID || uuid == kAudioServerPluginTypeUUID else { return HRESULT.noInterface }

  EQMDriver.refCounter.wrappingIncrement(ordering: .relaxed)
  interface.pointee = UnsafeMutableRawPointer(EQMDriver.ref)

  return HRESULT.ok
}

func EQM_AddRef (inDriver: UnsafeMutableRawPointer?) -> ULONG {
  // This call returns the resulting reference count after the increment.
  guard validate(inDriver) else { return ULONG(kAudioHardwareBadObjectError) }
  return EQMDriver.refCounter.wrappingIncrementThenLoad(ordering: .relaxed)
}

func EQM_Release (inDriver: UnsafeMutableRawPointer?) -> ULONG {
  // This call returns the resulting reference count after the decrement.
  guard validate(inDriver) else { return ULONG(kAudioHardwareBadObjectError) }
  return EQMDriver.refCounter.wrappingDecrementThenLoad(ordering: .relaxed)

}


// MARK: - Basic Operations
func EQM_Initialize (inDriver: AudioServerPlugInDriverRef, inHost: AudioServerPlugInHostRef) -> OSStatus {
  // This method is called to initialize the instance of the plug-in.
  // The job of this method is, as the name implies, to get the driver initialized. One specific
  // thing that needs to be done is to store the AudioServerPlugInHostRef so that it can be used
  // later. Note that when this call returns, the HAL will scan the various lists the driver
  // maintains (such as the device list) to get the inital set of objects the driver is
  // publishing. So, there is no need to notifiy the HAL about any objects created as part of the
  // execution of this method.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  EQMDriver.host = inHost
  EQMBox.acquired = true
  EQMDriver.hostTicksPerFrame = calculateHostTicksPerFrame()

  return kAudioHardwareNoError
}

func EQM_CreateDevice (inDriver: AudioServerPlugInDriverRef, inDescription: CFDictionary, inClientInfo: UnsafePointer<AudioServerPlugInClientInfo>, outDeviceObjectID: UnsafeMutablePointer<AudioObjectID>) -> OSStatus {
  // Tells the plug-in to create a new device based on the given description.
  // This method is used to tell a driver that implements the Transport Manager semantics to
  // create an AudioEndpointDevice from a set of AudioEndpoints. Since this driver is not a
  // Transport Manager, we just check the arguments and return
  // kAudioHardwareUnsupportedOperationError.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  return kAudioHardwareUnsupportedOperationError
}

func EQM_DestroyDevice (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID) -> OSStatus {
  // Called to tell the plug-in about to destroy the given device.
  // This method is used to tell a driver that implements the Transport Manager semantics to
  // destroy an AudioEndpointDevice. Since this driver is not a Transport Manager, we just check
  // the arguments and return kAudioHardwareUnsupportedOperationError.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  return kAudioHardwareUnsupportedOperationError
}

func EQM_AddDeviceClient (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientInfo: UnsafePointer<AudioServerPlugInClientInfo>) -> OSStatus {
  // Called to tell the plug-in about a new client of the Host for a particular device.
  // This method is used to inform the driver about a new client that is using the given device.
  // This allows the device to act differently depending on who the client is. This driver does
  // not need to track the clients using the device, so we just check the arguments and return
  // successfully.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  return noErr
}

func EQM_RemoveDeviceClient (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientInfo: UnsafePointer<AudioServerPlugInClientInfo>) -> OSStatus {
  // Called to tell the plug-in about a client that is no longer using the device.
  // This method is used to inform the driver about a client that is no longer using the given
  // device. This driver does not track clients, so we just check the arguments and return
  // successfully.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  return noErr
}

func EQM_PerformDeviceConfigurationChange (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inChangeAction: UInt64, inChangeInfo: UnsafeMutableRawPointer?) -> OSStatus {
  // This is called by the Host to allow the device to perform a configuration change that had been previously requested via a call to the Host method, RequestDeviceConfigurationChange().
  // This method is called to tell the device that it can perform the configuation change that it
  // had requested via a call to the host method, RequestDeviceConfigurationChange(). The
  // arguments, inChangeAction and inChangeInfo are the same as what was passed to
  // RequestDeviceConfigurationChange().
  //
  // The HAL guarantees that IO will be stopped while this method is in progress. The HAL will
  // also handle figuring out exactly what changed for the non-control related properties. This
  // means that the only notifications that would need to be sent here would be for either
  // custom properties the HAL doesn't know about or for controls.
  //
  // For the device implemented by this driver, only sample rate changes go through this process
  // as it is the only state that can be changed for the device that isn't a control. For this
  // change, the new sample rate is passed in the inChangeAction argument.

  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  if !kSupportedSamplingRates.contains(where: { UInt64($0) == inChangeAction }) { return kAudioHardwareBadObjectError }

  EQMDevice.sampleRate = Float64(inChangeAction)
  EQMDriver.hostTicksPerFrame = calculateHostTicksPerFrame()

  return kAudioHardwareNoError
}

func EQM_AbortDeviceConfigurationChange (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inChangeAction: UInt64, inChangeInfo: UnsafeMutableRawPointer?) -> OSStatus {
  // This is called by the Host to tell the plug-in not to perform a configuration change that had been requested via a call to the Host method, RequestDeviceConfigurationChange().
  // This method is called to tell the driver that a request for a config change has been denied.
  // This provides the driver an opportunity to clean up any state associated with the request.
  // For this driver, an aborted config change requires no action. So we just check the arguments
  // and return
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  return noErr
}

// MARK: - Property Operations
//  Note that for each object, this driver implements all the required properties plus a few
//  extras that are useful but not required. There is more detailed commentary about each
//  property in the EQMPlugin.getPropertyData() and EQMDevice.getPropertyData() methods.

func EQM_HasProperty (inDriver: AudioServerPlugInDriverRef, inObjectID: AudioObjectID, inClientProcessID: pid_t, inAddress: UnsafePointer<AudioObjectPropertyAddress>) -> DarwinBoolean {
  // This method returns whether or not the given object has the given property.
  guard validate(inDriver) else { return false }

  return DarwinBoolean(({
    switch inObjectID {

    case kObjectID_PlugIn: return EQMPlugIn.hasProperty(address: inAddress.pointee)
    case kObjectID_Box: return EQMBox.hasProperty(address: inAddress.pointee)
    case kObjectID_Device: return EQMDevice.hasProperty(address: inAddress.pointee)

    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return EQMStream.hasProperty(address: inAddress.pointee)

    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master,
         kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master: return EQMControl.hasProperty(objectID: inObjectID, address: inAddress.pointee)
      
    default:
      return false
    }
  })())

}

func EQM_IsPropertySettable (inDriver: AudioServerPlugInDriverRef, inObjectID: AudioObjectID, inClientProcessID: pid_t, inAddress: UnsafePointer<AudioObjectPropertyAddress>, outIsSettable: UnsafeMutablePointer<DarwinBoolean>) -> OSStatus {
  // This method returns whether or not the given property on the object can have its value changed.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  let isSettable = DarwinBoolean(({
    switch inObjectID {

    case kObjectID_PlugIn: return EQMPlugIn.isPropertySettable(address: inAddress.pointee)
    case kObjectID_Box: return EQMBox.isPropertySettable(address: inAddress.pointee)
    case kObjectID_Device: return EQMDevice.isPropertySettable(address: inAddress.pointee)

    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return EQMStream.isPropertySettable(address: inAddress.pointee)

    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master,
         kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master: return EQMControl.isPropertySettable(objectID: inObjectID, address: inAddress.pointee)

    default:
      return false
    }
  })())

  outIsSettable.pointee = isSettable

  return noErr
}

func EQM_GetPropertyDataSize (inDriver: AudioServerPlugInDriverRef, inObjectID: AudioObjectID, inClientProcessID: pid_t, inAddress: UnsafePointer<AudioObjectPropertyAddress>, inQualifierDataSize: UInt32, inQualifierData: UnsafeRawPointer?, outDataSize: UnsafeMutablePointer<UInt32>) -> OSStatus {
  // This method returns the byte size of the property's data.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  if let size = ({ () -> UInt32? in
    switch inObjectID {

    case kObjectID_PlugIn: return EQMPlugIn.getPropertyDataSize(address: inAddress.pointee)
    case kObjectID_Box: return EQMBox.getPropertyDataSize(address: inAddress.pointee)
    case kObjectID_Device: return EQMDevice.getPropertyDataSize(address: inAddress.pointee)

    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return EQMStream.getPropertyDataSize(address: inAddress.pointee)

    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master,
         kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master: return EQMControl.getPropertyDataSize(objectID: inObjectID, address: inAddress.pointee)

    default:
      return nil
    }
  })() {
    outDataSize.pointee = size
    return noErr
  } else {
    return kAudioHardwareUnknownPropertyError
  }
}

func EQM_GetPropertyData (inDriver: AudioServerPlugInDriverRef, inObjectID: AudioObjectID, inClientProcessID: pid_t, inAddress: UnsafePointer<AudioObjectPropertyAddress>, inQualifierDataSize: UInt32, inQualifierData: UnsafeRawPointer?, inDataSize: UInt32, outDataSize: UnsafeMutablePointer<UInt32>, outData: UnsafeMutableRawPointer) -> OSStatus {
  // Fetches the data of the given property and places it in the provided buffer.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  if let data = ({ () -> EQMObjectProperty? in
    switch inObjectID {

    case kObjectID_PlugIn: return EQMPlugIn.getPropertyData(address: inAddress.pointee)
    case kObjectID_Box: return EQMBox.getPropertyData(address: inAddress.pointee)
    case kObjectID_Device: return EQMDevice.getPropertyData(address: inAddress.pointee)

    case kObjectID_Stream_Input,
         kObjectID_Stream_Output: return EQMStream.getPropertyData(objectID: inObjectID, address: inAddress.pointee)

    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master,
         kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master,
         kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master: return EQMControl.getPropertyData(objectID: inObjectID, address: inAddress.pointee)

    default:
      return nil
    }
  })() {
    data.write(to: outData, size: outDataSize)
    return noErr
  } else {
    outDataSize.pointee = 0
    return kAudioHardwareUnknownPropertyError
  }
}

func EQM_SetPropertyData (inDriver: AudioServerPlugInDriverRef, inObjectID: AudioObjectID, inClientProcessID: pid_t, inAddress: UnsafePointer<AudioObjectPropertyAddress>, inQualifierDataSize: UInt32, inQualifierData: UnsafeRawPointer?, inDataSize: UInt32, inData: UnsafeRawPointer) -> OSStatus {
  // Tells an object to change the value of the given property.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
  switch inObjectID {

  case kObjectID_PlugIn: return EQMPlugIn.setPropertyData(address: inAddress.pointee, data: inData)
  case kObjectID_Box: return EQMBox.setPropertyData(address: inAddress.pointee, data: inData)
  case kObjectID_Device: return EQMDevice.setPropertyData(address: inAddress.pointee, data: inData)

  case kObjectID_Stream_Input,
       kObjectID_Stream_Output: return EQMStream.setPropertyData(objectID: inObjectID, address: inAddress.pointee, data: inData)

  case kObjectID_Volume_Input_Master,
       kObjectID_Volume_Output_Master,
       kObjectID_Mute_Input_Master,
       kObjectID_Mute_Output_Master,
       kObjectID_DataSource_Input_Master,
       kObjectID_DataSource_Output_Master: return EQMControl.setPropertyData(objectID: inObjectID, address: inAddress.pointee, data: inData)

  default:
    return kAudioHardwareBadObjectError
  }
}

// MARK: - IO Operations
func EQM_StartIO (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32) -> OSStatus {
  // This call tells the device that IO is starting for the given client. When this routine
  // returns, the device's clock is running and it is ready to have data read/written. It is
  // important to note that multiple clients can have IO running on the device at the same time.
  // So, work only needs to be done when the first client starts. All subsequent starts simply
  // increment the counter.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  return EQMDevice.startIO()
}

func EQM_StopIO (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32) -> OSStatus {
  // This call tells the device that the client has stopped IO. The driver can stop the hardware
  // once all clients have stopped.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }

  return EQMDevice.stopIO()
}

func EQM_GetZeroTimeStamp (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32, outSampleTime: UnsafeMutablePointer<Float64>, outHostTime: UnsafeMutablePointer<UInt64>, outSeed: UnsafeMutablePointer<UInt64>) -> OSStatus {
  // This method returns the current zero time stamp for the device. The HAL models the timing of
  // a device as a series of time stamps that relate the sample time to a host time. The zero
  // time stamps are spaced such that the sample times are the value of
  // kAudioDevicePropertyZeroTimeStampPeriod apart. This is often modeled using a ring buffer
  // where the zero time stamp is updated when wrapping around the ring buffer.
  //
  // For this device, the zero time stamps' sample time increments every kDevice_RingBufferSize
  // frames and the host time increments by kDevice_RingBufferSize * gDevice_HostTicksPerFrame.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
}

func EQM_WillDoIOOperation (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32, inOperationID: UInt32, outWillDo: UnsafeMutablePointer<DarwinBoolean>, outWillDoInPlace: UnsafeMutablePointer<DarwinBoolean>) -> OSStatus {
  // Asks the plug-in whether or not the device will perform the given phase of the IO cycle for a particular device.
  // This method returns whether or not the device will do a given IO operation. For this device,
  // we only support reading input data and writing output data.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
}

func EQM_BeginIOOperation (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32, inOperationID: UInt32, inIOBufferFrameSize: UInt32, inIOCycleInfo: UnsafePointer<AudioServerPlugInIOCycleInfo>) -> OSStatus {
  // Tells the plug-in that the Host is about to begin a phase of the IO cycle for a particular device.
  // This is called at the beginning of an IO operation. This device doesn't do anything, so just
  // check the arguments and return.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
}

func EQM_DoIOOperation (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inStreamObjectID: AudioObjectID, inClientID: UInt32, inOperationID: UInt32, inIOBufferFrameSize: UInt32, inIOCycleInfo: UnsafePointer<AudioServerPlugInIOCycleInfo>, ioMainBuffer: UnsafeMutableRawPointer?, ioSecondaryBuffer: UnsafeMutableRawPointer?) -> OSStatus {
  // This is called to actuall perform a given operation.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
}

func EQM_EndIOOperation (inDriver: AudioServerPlugInDriverRef, inDeviceObjectID: AudioObjectID, inClientID: UInt32, inOperationID: UInt32, inIOBufferFrameSize: UInt32, inIOCycleInfo: UnsafePointer<AudioServerPlugInIOCycleInfo>) -> OSStatus {
  // This is called at the end of an IO operation. This device doesn't do anything, so just check
  // the arguments and return.
  guard validate(inDriver) else { return kAudioHardwareBadObjectError }
}
