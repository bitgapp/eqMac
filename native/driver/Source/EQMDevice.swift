//
// EQMDevice.swift
// eqMac
//
// Created by Nodeful on 12/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn
import Atomics

class EQMDevice: EQMObject {
  static let id = AudioObjectID(kDeviceUID)!
  static var name = kEQMDeviceDefaultName
  static var sampleRate = kDefaultSampleRate
  static var running = false
  static var shown = false
  static var latency: UInt32 = 0
  static var ioCounter = ManagedAtomic<UInt64>(0)
  static var anchorHostTime: UInt64 = 0
  static var anchorSampleTime: UInt64 = 0
  static var timestampCount: UInt64 = 0
  static let ioMutex = Mutex()

  static let ringBufferSize: UInt32 = 16384
  static var ringBuffer = UnsafeMutablePointer<Float32>.allocate(capacity: Int(ringBufferSize * kChannelCount))

  static func getDescription (for samplingRate: Float64) -> AudioStreamBasicDescription {
    return AudioStreamBasicDescription(
      mSampleRate: samplingRate,
      mFormatID: kAudioFormatLinearPCM,
      mFormatFlags: kAudioFormatFlagIsFloat | kAudioFormatFlagsNativeEndian | kAudioFormatFlagIsPacked,
      mBytesPerPacket: kBytesPerFrame,
      mFramesPerPacket: 1,
      mBytesPerFrame: kBytesPerFrame,
      mChannelsPerFrame: kChannelCount,
      mBitsPerChannel: kBitsPerChannel,
      mReserved: 0
    )
  }

  static func hasProperty (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass,
         kAudioObjectPropertyClass,
         kAudioObjectPropertyOwner,
         kAudioObjectPropertyName,
         kAudioObjectPropertyManufacturer,
         kAudioObjectPropertyOwnedObjects,
         kAudioDevicePropertyDeviceUID,
         kAudioDevicePropertyModelUID,
         kAudioDevicePropertyTransportType,
         kAudioDevicePropertyRelatedDevices,
         kAudioDevicePropertyClockDomain,
         kAudioDevicePropertyDeviceIsAlive,
         kAudioDevicePropertyDeviceIsRunning,
         kAudioObjectPropertyControlList,
         kAudioDevicePropertyNominalSampleRate,
         kAudioDevicePropertyAvailableNominalSampleRates,
         kAudioDevicePropertyIsHidden,
         kAudioDevicePropertyZeroTimeStampPeriod,
         kAudioDevicePropertyIcon,
         kAudioDevicePropertyStreams,
         kAudioObjectPropertyCustomPropertyInfoList,
         EQMDeviceCustom.properties.shown,
         EQMDeviceCustom.properties.version,
         EQMDeviceCustom.properties.latency,
         EQMDeviceCustom.properties.name:
      return true

    case kAudioDevicePropertyDeviceCanBeDefaultDevice,
         kAudioDevicePropertyDeviceCanBeDefaultSystemDevice,
         kAudioDevicePropertyLatency,
         kAudioDevicePropertySafetyOffset,
         kAudioDevicePropertyPreferredChannelsForStereo,
         kAudioDevicePropertyPreferredChannelLayout:
      return address.mScope == kAudioObjectPropertyScopeInput || address.mScope == kAudioObjectPropertyScopeOutput

    default:
      return false
    }
  }

  static func isPropertySettable (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioDevicePropertyNominalSampleRate,
         EQMDeviceCustom.properties.shown,
         EQMDeviceCustom.properties.latency,
         EQMDeviceCustom.properties.name:
      return true

    default:
      return false
    }
  }

  static func getPropertyDataSize (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> UInt32? {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass: return sizeof(AudioClassID.self)
    case kAudioObjectPropertyClass: return sizeof(AudioClassID.self)
    case kAudioObjectPropertyOwner: return sizeof(AudioObjectID.self)
    case kAudioObjectPropertyName: return sizeof(CFString.self)
    case kAudioObjectPropertyManufacturer: return sizeof(CFString.self)
    case kAudioObjectPropertyOwnedObjects:
      switch (address.mScope) {
      case kAudioObjectPropertyScopeGlobal: return 8 * sizeof(AudioObjectID.self)
      case kAudioObjectPropertyScopeInput: return 4 * sizeof(AudioObjectID.self)
      case kAudioObjectPropertyScopeOutput: return 4 * sizeof(AudioObjectID.self)
      default:
        return nil
      }
    case kAudioDevicePropertyDeviceUID: return sizeof(CFString.self)
    case kAudioDevicePropertyModelUID: return sizeof(CFString.self)
    case kAudioDevicePropertyTransportType: return sizeof(UInt32.self)
    case kAudioDevicePropertyRelatedDevices: return sizeof(AudioObjectID.self)
    case kAudioDevicePropertyClockDomain: return sizeof(UInt32.self)
    case kAudioDevicePropertyDeviceIsAlive: return sizeof(AudioClassID.self)
    case kAudioDevicePropertyDeviceIsRunning: return sizeof(UInt32.self)
    case kAudioDevicePropertyDeviceCanBeDefaultDevice: return sizeof(UInt32.self)
    case kAudioDevicePropertyDeviceCanBeDefaultSystemDevice: return sizeof(UInt32.self)
    case kAudioDevicePropertyLatency: return sizeof(UInt32.self)
    case kAudioDevicePropertyStreams:
      switch(address.mScope) {
      case kAudioObjectPropertyScopeGlobal: return 2 * sizeof(AudioObjectID.self)
      case kAudioObjectPropertyScopeInput: return sizeof(AudioObjectID.self)
      case kAudioObjectPropertyScopeOutput: return sizeof(AudioObjectID.self)
      default:
        return nil
      }
    case kAudioObjectPropertyControlList: return 3 * sizeof(AudioObjectID.self)
    case kAudioDevicePropertySafetyOffset: return sizeof(UInt32.self)
    case kAudioDevicePropertyNominalSampleRate: return sizeof(Float64.self)
    case kAudioDevicePropertyAvailableNominalSampleRates: return UInt32(kEQMDeviceSupportedSampleRates.count) * sizeof(AudioValueRange.self)
    case kAudioDevicePropertyIsHidden: return sizeof(UInt32.self)
    case kAudioDevicePropertyPreferredChannelsForStereo: return 2 * sizeof(UInt32.self)
    case kAudioDevicePropertyPreferredChannelLayout:
      let layoutSize = sizeof(AudioChannelLayout.self)
      // Layout will already contain size for 1 channel description
      let channelsSize = sizeof(AudioChannelDescription.self) * kChannelCount - 1
      return layoutSize + channelsSize

    case kAudioDevicePropertyZeroTimeStampPeriod: return sizeof(UInt32.self)
    case kAudioDevicePropertyIcon: return sizeof(CFURL.self)

    case kAudioObjectPropertyCustomPropertyInfoList: return sizeof(AudioServerPlugInCustomPropertyInfo.self) * EQMDeviceCustom.properties.count
    case EQMDeviceCustom.properties.latency: return sizeof(CFNumber.self)
    case EQMDeviceCustom.properties.shown: return sizeof(CFBoolean.self)
    case EQMDeviceCustom.properties.version: return sizeof(CFString.self)
    case EQMDeviceCustom.properties.name: return sizeof(CFString.self)

    default:
      return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty? {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass:
      // The base class for kAudioDeviceClassID is kAudioObjectClassID
      return .audioClassID(kAudioObjectClassID)
    case kAudioObjectPropertyClass:
      // The class is always kAudioDeviceClassID for devices created by drivers
      return .audioClassID(kAudioDeviceClassID)
    case kAudioObjectPropertyOwner:
      // The device's owner is the plug-in object
      return .audioObjectID(kObjectID_PlugIn)
    case kAudioObjectPropertyName:
      // This is the human readable name of the device.
      return .string(name as CFString)
    case kAudioObjectPropertyManufacturer:
      // This is the human readable name of the maker of the plug-in.
      return .string(kDeviceManufacturer as CFString)
    case kAudioObjectPropertyOwnedObjects:
      // Calculate the number of items that have been requested. Note that this
      // number is allowed to be smaller than the actual size of the list. In such
      // case, only that number of items will be returned

      // The device owns its streams and controls. Note that what is returned here
      // depends on the scope requested.
      switch address.mScope {
      case kAudioObjectPropertyScopeGlobal:
        return .objectIDList([
          kObjectID_Stream_Input,

          kObjectID_Stream_Output,
          kObjectID_Volume_Output_Master,
          kObjectID_Mute_Output_Master,
          kObjectID_DataSource_Output_Master,
        ])
      case kAudioObjectPropertyScopeInput:
        return .objectIDList([
          kObjectID_Stream_Input,
        ])
      case kAudioObjectPropertyScopeOutput:
        return .objectIDList([
          kObjectID_Stream_Output,
          kObjectID_Volume_Output_Master,
          kObjectID_Mute_Output_Master,
          kObjectID_DataSource_Output_Master,
        ])
      default: return .null()
      }
    case kAudioDevicePropertyDeviceUID:
      // This is a CFString that is a persistent token that can identify the same
      // audio device across boot sessions. Note that two instances of the same
      // device must have different values for this property.
      return .string(kDeviceUID as CFString)
    case kAudioDevicePropertyModelUID:
      // This is a CFString that is a persistent token that can identify audio
      // devices that are the same kind of device. Note that two instances of the
      // save device must have the same value for this property.
      return .string(kDeviceModelUID as CFString)
    case kAudioDevicePropertyTransportType:
      // This value represents how the device is attached to the system. This can be
      // any 32 bit integer, but common values for this property are defined in
      // <CoreAudio/AudioHardwareBase.h>
      return .integer(kAudioDeviceTransportTypeVirtual)
    case kAudioDevicePropertyRelatedDevices:
      // The related devices property identifys device objects that are very closely
      // related. Generally, this is for relating devices that are packaged together
      // in the hardware such as when the input side and the output side of a piece
      // of hardware can be clocked separately and therefore need to be represented
      // as separate AudioDevice objects. In such case, both devices would report
      // that they are related to each other. Note that at minimum, a device is
      // related to itself, so this list will always be at least one item long.

      // Calculate the number of items that have been requested. Note that this
      // number is allowed to be smaller than the actual size of the list. In such
      // case, only that number of items will be returned
      return .objectIDList([ kObjectID_Device ])
    case kAudioDevicePropertyClockDomain:
      // This property allows the device to declare what other devices it is
      // synchronized with in hardware. The way it works is that if two devices have
      // the same value for this property and the value is not zero, then the two
      // devices are synchronized in hardware. Note that a device that either can't
      // be synchronized with others or doesn't know should return 0 for this
      // property.
      return .integer(0)
    case kAudioDevicePropertyDeviceIsAlive:
      // This property returns whether or not the device is alive. Note that it is
      // note uncommon for a device to be dead but still momentarily availble in the
      // device list. In the case of this device, it will always be alive.
      return .integer(1)
    case kAudioDevicePropertyDeviceIsRunning:
      // This property returns whether or not IO is running for the device. Note that
      // we need to take both the state lock to check this value for thread safety.
      return .integer(running ? 1 : 0)
    case kAudioDevicePropertyDeviceCanBeDefaultDevice:
      // This property returns whether or not the device wants to be able to be the
      // default device for content. This is the device that iTunes and QuickTime
      // will use to play their content on and FaceTime will use as it's microhphone.
      // Nearly all devices should allow for this.
      if address.mScope == kAudioObjectPropertyScopeInput {
        return .integer(0)
      } else {
        return .integer(shown ? 1 : 0)
      }
    case kAudioDevicePropertyDeviceCanBeDefaultSystemDevice:
      // This property returns whether or not the device wants to be the system
      // default device. This is the device that is used to play interface sounds and
      // other incidental or UI-related sounds on. Most devices should allow this
      // although devices with lots of latency may not want to.
      return .integer(shown ? 1 : 0)
    case kAudioDevicePropertyLatency:
      // This property returns the presentation latency of the device. For this,
      // device, the value is 0 due to the fact that it always vends silence.
      if address.mScope == kAudioObjectPropertyScopeInput {
        return .integer(0)
      } else {
        return .integer(latency)
      }
    case kAudioDevicePropertyStreams:
      // Calculate the number of items that have been requested. Note that this
      // number is allowed to be smaller than the actual size of the list. In such
      // case, only that number of items will be returned

      // Note that what is returned here depends on the scope requested.
      switch address.mScope {
      case kAudioObjectPropertyScopeGlobal:
        // global scope means return all streams
        return .objectIDList([ kObjectID_Stream_Input, kObjectID_Stream_Output ])
      case kAudioObjectPropertyScopeInput:
        // input scope means just the objects on the input side
        return .audioObjectID(kObjectID_Stream_Input)
      case kAudioObjectPropertyScopeOutput:
        // output scope means just the objects on the output side
        return .audioObjectID(kObjectID_Stream_Output)
      default:
        return .null()
      }

    case kAudioObjectPropertyControlList:
      // Calculate the number of items that have been requested. Note that this
      // number is allowed to be smaller than the actual size of the list. In such
      // case, only that number of items will be returned
      return .objectIDList([
        kObjectID_Volume_Output_Master,
        kObjectID_Mute_Output_Master,
        kObjectID_DataSource_Output_Master
      ])
    case kAudioDevicePropertySafetyOffset:
      // This property returns the how close to now the HAL can read and write. For
      // this, device, the value is 0 due to the fact that it always vends silence.
      return .integer(0)

    case kAudioDevicePropertyNominalSampleRate:
      // This property returns the nominal sample rate of the device. Note that we
      // only need to take the state lock to get this value.
      return .float64(sampleRate)

    case kAudioDevicePropertyAvailableNominalSampleRates:
      // This returns all nominal sample rates the device supports as an array of
      // AudioValueRangeStructs. Note that for discrete sampler rates, the range
      // will have the minimum value equal to the maximum value.

      return .valueRangeList(
        ContiguousArray(kEQMDeviceSupportedSampleRates.map { freq -> AudioValueRange in
          let frequency = Float64(freq)
          let range = AudioValueRange(mMinimum: frequency, mMaximum: frequency)
          return range
        })
      )

    case kAudioDevicePropertyIsHidden:
      // This returns whether or not the device is visible to clients.
      return .integer(0)

    case kAudioDevicePropertyPreferredChannelsForStereo:
      // This property returns which two channesl to use as left/right for stereo
      // data by default. Note that the channel numbers are 1-based.xz
      return .integerList([ 1, 2 ])

    case kAudioDevicePropertyPreferredChannelLayout:
      // This property returns the default AudioChannelLayout to use for the device
      // by default. For this device, we return a stereo ACL.
      // calcualte how big the
      let channelDescriptionsPtr = UnsafeMutablePointer<AudioChannelDescription>.allocate(capacity: Int(kChannelCount))

      for channelNumber in 0 ..< Int(kChannelCount) {
        channelDescriptionsPtr[channelNumber] = AudioChannelDescription(
          mChannelLabel: AudioChannelLabel(channelNumber),
          mChannelFlags: AudioChannelFlags(rawValue: 0),
          mCoordinates: (0, 0, 0)
        )
      }

      let channelLayout = AudioChannelLayout(
        mChannelLayoutTag: kAudioChannelLayoutTag_UseChannelDescriptions,
        mChannelBitmap: AudioChannelBitmap(rawValue: 0),
        mNumberChannelDescriptions: kChannelCount,
        mChannelDescriptions: channelDescriptionsPtr.pointee
      )

      return .channelLayout(channelLayout)
    case kAudioDevicePropertyZeroTimeStampPeriod:
      // This property returns how many frames the HAL should expect to see between
      // successive sample times in the zero time stamps this device provides.
      return .integer(ringBufferSize)
    case kAudioDevicePropertyIcon:
      // This is a CFURL that points to the device's Icon in the plug-in's resource bundle.
      let bundle = CFBundleGetBundleWithIdentifier(DRIVER_BUNDLE_ID as CFString)
      let url = CFBundleCopyResourceURL(bundle, "icon.icns" as CFString, nil, nil)
      return .url(url!)
    case kAudioObjectPropertyCustomPropertyInfoList:
      // This property returns an array of AudioServerPlugInCustomPropertyInfo's that
      // describe the type of data used by any custom properties.
      let customProperties = ContiguousArray([
        AudioServerPlugInCustomPropertyInfo(
          mSelector: EQMDeviceCustom.properties.version,
          mPropertyDataType: kAudioServerPlugInCustomPropertyDataTypeCFString,
          mQualifierDataType: kAudioServerPlugInCustomPropertyDataTypeNone
        ),
        AudioServerPlugInCustomPropertyInfo(
          mSelector: EQMDeviceCustom.properties.shown,
          mPropertyDataType: kAudioServerPlugInCustomPropertyDataTypeCFPropertyList,
          mQualifierDataType: kAudioServerPlugInCustomPropertyDataTypeNone
        ),
        AudioServerPlugInCustomPropertyInfo(
          mSelector: EQMDeviceCustom.properties.latency,
          mPropertyDataType: kAudioServerPlugInCustomPropertyDataTypeCFPropertyList,
          mQualifierDataType: kAudioServerPlugInCustomPropertyDataTypeNone
        ),
        AudioServerPlugInCustomPropertyInfo(
          mSelector: EQMDeviceCustom.properties.name,
          mPropertyDataType: kAudioServerPlugInCustomPropertyDataTypeCFString,
          mQualifierDataType: kAudioServerPlugInCustomPropertyDataTypeNone
        )
      ])

      return .customPropertyInfoList(customProperties)
    case EQMDeviceCustom.properties.version:
      let version = CFCopyDescription(
        CFBundleGetValueForInfoDictionaryKey(
          CFBundleGetBundleWithIdentifier(DRIVER_BUNDLE_ID as CFString),
          kCFBundleVersionKey
        )
      )
      return .string(version!)
    case EQMDeviceCustom.properties.shown:
      return .bool(shown ? kCFBooleanTrue : kCFBooleanFalse)
    default: return nil
    }
  }

  static func setPropertyData(client: EQMClient?, objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus {
    switch address.mSelector {

    case kAudioDevicePropertyNominalSampleRate:
      // Changing the sample rate needs to be handled via the
      // RequestConfigChange/PerformConfigChange machinery.

      // check the arguments
      let newSampleRate = data.load(as: Float64.self)

      if !kEQMDeviceSupportedSampleRates.contains(newSampleRate) {
        return kAudioHardwareIllegalOperationError
      }

      // make sure that the new value is different than the old value
      if (sampleRate != newSampleRate) {
        // we dispatch this so that the change can happen asynchronously
        DispatchQueue.global(qos: .default).async {
          _ = EQMDriver.host?.pointee.RequestDeviceConfigurationChange(
            EQMDriver.host!,
            kObjectID_Device,
            UInt64(newSampleRate),
            nil
          )
        }
      }
      return noErr

    // Custom Properties
    case EQMDeviceCustom.properties.shown:
      // Only allow eqMac app to set this property
      guard client?.bundleId == APP_BUNDLE_ID else { return noErr }

      let shownRef = data.load(as: CFBoolean.self)

      shown = CFBooleanGetValue(shownRef)
      return noErr

    case EQMDeviceCustom.properties.latency:
      // Only allow eqMac app to set this property
      guard client?.bundleId == APP_BUNDLE_ID else { return noErr }

      let newLatencyRef = data.load(as: CFNumber.self)
      var newLatency: Int32 = 0
      CFNumberGetValue(newLatencyRef, .sInt32Type, &newLatency)

      if latency != newLatency {
        latency = UInt32(newLatency)
      }
      return noErr
    case EQMDeviceCustom.properties.name:
      // Only allow eqMac app to set this property
      guard client?.bundleId == APP_BUNDLE_ID else { return noErr }

      var newName = data.load(as: CFString.self) as String

      if name != newName {
        if newName == "" {
          newName = kEQMDeviceDefaultName
        }
        name = newName

        changedProperties.append(
          .init(
            mSelector: kAudioObjectPropertyName,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMaster
          )
        )
      }

      return noErr
    default: return kAudioHardwareUnknownPropertyError
    }
  }

  static func startIO () -> OSStatus {
    let ioCount = ioCounter.load(ordering: .relaxed)

    // Reached max amount of possible IOs
    if ioCount == UInt64.max {
      return kAudioHardwareIllegalOperationError
    }

    // If IO is not running we need start it and init all the important vars
    if ioCount == 0 {
      running = true
      timestampCount = 0
      anchorSampleTime = 0
      anchorHostTime = mach_absolute_time()
      ringBuffer = UnsafeMutablePointer<Float32>.allocate(capacity: Int(ringBufferSize * kChannelCount))
    } else {
      // IO already running so increment the counter
      ioCounter.wrappingIncrement(ordering: .relaxed)
    }

    return noErr
  }

  static func stopIO () -> OSStatus {
    // If IO is not running it's an invalid call
    if !running {
      return kAudioHardwareIllegalOperationError
    }

    var ioCount = ioCounter.load(ordering: .relaxed)

    if ioCount > 0 {
      ioCount = ioCounter.wrappingDecrementThenLoad(ordering: .relaxed)
    }

    // If IO reached zero deinit
    if ioCount == 0 {
      running = false
      ringBuffer.deallocate()
    }

    return noErr
  }

  static func getZeroTimeStamp (outSampleTime: UnsafeMutablePointer<Float64>, outHostTime: UnsafeMutablePointer<UInt64>, outSeed: UnsafeMutablePointer<UInt64>) -> OSStatus {

    ioMutex.lock()

    // get the current host time
    let currentHostTime = mach_absolute_time()

    // calculate the next host time
    let hostTicksPerRingBuffer = EQMDriver.hostTicksPerFrame! * Float64(ringBufferSize)
    let hostTicksOffset = Float64(timestampCount + 1) * hostTicksPerRingBuffer
    let nextHostTime = anchorHostTime + UInt64(hostTicksOffset)

    if nextHostTime <= currentHostTime {
      timestampCount += 1
    }

    outSampleTime.pointee = Float64(timestampCount * UInt64(ringBufferSize))
    outHostTime.pointee = anchorHostTime + timestampCount * UInt64(hostTicksPerRingBuffer)
    outSeed.pointee = 1

    ioMutex.unlock()

    return noErr
  }

  static func doIO (clientID: UInt32, operationID: UInt32, sample: UnsafeMutablePointer<Float32>, cycleInfo: AudioServerPlugInIOCycleInfo, frameSize: UInt32) -> OSStatus {

    ioMutex.lock()

    switch operationID {
    // Store
    case AudioServerPlugInIOOperation.writeMix.rawValue:
      let sampleTime = Int(cycleInfo.mOutputTime.mSampleTime)
      for frame in 0 ..< frameSize {
        for channel in 0 ..< kChannelCount {
          let readFrame = Int(frame * kChannelCount + channel)
          if EQMControl.muted {
            // Muted
            sample[readFrame] = 0
          } else {
            let nextSampleTime = sampleTime + Int(frame)
            let remainder = nextSampleTime % Int(ringBufferSize)
            let writeFrame = remainder * Int(kChannelCount) + Int(channel)
            ringBuffer[writeFrame] += sample[readFrame]
          }

          // Clean up buffer
          let cleanFromFrame = sampleTime + Int(frame) + 8192
          let remainder = cleanFromFrame % Int(ringBufferSize)
          let cleanFrame = remainder * Int(kChannelCount) + Int(channel)
          ringBuffer[cleanFrame] = 0
        }
      }

      // Make output buffer silent
      sample.assign(repeating: 0, count: Int(frameSize * kChannelCount))

      break
    // Read
    case AudioServerPlugInIOOperation.readInput.rawValue:
      let sampleTime = Int(cycleInfo.mInputTime.mSampleTime)
      for frame in 0 ..< frameSize {
        for channel in 0 ..< kChannelCount {
          let writeFrame = Int(frame * kChannelCount + channel)
          if EQMControl.muted {
            sample[writeFrame] = 0
          } else {
            let nextSampleTime = sampleTime + Int(frame)
            let remainder = nextSampleTime % Int(ringBufferSize)
            let readFrame = remainder * Int(kChannelCount) + Int(channel)
            sample[writeFrame] = ringBuffer[readFrame]
          }

          // Clean up buffer
          let cleanFromFrame = sampleTime + Int(frame) - 16384
          let remainder = cleanFromFrame % Int(ringBufferSize)
          let cleanFrame = remainder * Int(kChannelCount) + Int(channel)
          ringBuffer[cleanFrame] = 0
        }
      }
      break
    default: break
    }

    ioMutex.unlock()

    return noErr
  }
}
