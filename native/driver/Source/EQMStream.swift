//
//  EQMStream.swift
//  eqMac
//
//  Created by Nodeful on 15/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMStream: EQMObject {
  static var inputActive = true
  static var outputActive = true
  static var description: AudioStreamBasicDescription {
    return AudioStreamBasicDescription(
      mSampleRate: EQMDevice.sampleRate,
      mFormatID: kAudioFormatLinearPCM,
      mFormatFlags: kAudioFormatFlagIsFloat & kAudioFormatFlagsNativeEndian & kAudioFormatFlagIsPacked,
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
         kAudioObjectPropertyOwnedObjects,
         kAudioStreamPropertyIsActive,
         kAudioStreamPropertyDirection,
         kAudioStreamPropertyTerminalType,
         kAudioStreamPropertyStartingChannel,
         kAudioStreamPropertyLatency,
         kAudioStreamPropertyVirtualFormat,
         kAudioStreamPropertyPhysicalFormat,
         kAudioStreamPropertyAvailableVirtualFormats,
         kAudioStreamPropertyAvailablePhysicalFormats:
      return true
    default:
      return false
    }
  }

  static func isPropertySettable (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioStreamPropertyIsActive,
         kAudioStreamPropertyVirtualFormat,
         kAudioStreamPropertyPhysicalFormat:
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
    case kAudioObjectPropertyOwnedObjects: return 0 * sizeof(AudioObjectID.self)
    case kAudioStreamPropertyIsActive: return sizeof(UInt32.self)
    case kAudioStreamPropertyDirection: return sizeof(UInt32.self)
    case kAudioStreamPropertyTerminalType: return sizeof(UInt32.self)
    case kAudioStreamPropertyStartingChannel: return sizeof(UInt32.self)
    case kAudioStreamPropertyLatency: return sizeof(UInt32.self)
    case kAudioStreamPropertyVirtualFormat,
         kAudioStreamPropertyPhysicalFormat: return sizeof(AudioStreamBasicDescription.self)
    case kAudioStreamPropertyAvailableVirtualFormats,
         kAudioStreamPropertyAvailablePhysicalFormats: return UInt32(kSupportedSamplingRates.count) * sizeof(AudioStreamRangedDescription.self)
    default:
      return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty? {

    switch address.mSelector {
    case kAudioObjectPropertyBaseClass:
      //  The base class for kAudioStreamClassID is kAudioObjectClassID
      return .audioClassID(kAudioObjectClassID)
    case kAudioObjectPropertyClass:
      //  The class is always kAudioStreamClassID for streams created by drivers
      return .audioClassID(kAudioStreamClassID)
    case kAudioObjectPropertyOwner:
      //  The stream's owner is the device object
      return .integer(kObjectID_Device)
    case kAudioObjectPropertyOwnedObjects:
      //  Streams do not own any objects
      return .objectIDList([])
    case kAudioStreamPropertyIsActive:
      //  This property tells the device whether or not the given stream is going to
      //  be used for IO. Note that we need to take the state lock to examine this
      //  value.
      let active = objectID == kObjectID_Stream_Input ? inputActive : outputActive
      return .integer(active ? 1 : 0)
    case kAudioStreamPropertyDirection:
      //  This returns whether the stream is an input stream or an output stream.
      return .integer(objectID == kObjectID_Stream_Input ? 1 : 0)
    case kAudioStreamPropertyTerminalType:
      //  This returns a value that indicates what is at the other end of the stream
      //  such as a speaker or headphones, or a microphone. Values for this property
      //  are defined in <CoreAudio/AudioHardwareBase.h>
      switch objectID {
      case kObjectID_Stream_Input: return .integer(kAudioStreamTerminalTypeMicrophone)
      case kObjectID_Stream_Output: return .integer(kAudioStreamTerminalTypeSpeaker)
      default: return .integer(kAudioStreamTerminalTypeUnknown)
      }
    case kAudioStreamPropertyStartingChannel:
      //  This property returns the absolute channel number for the first channel in
      //  the stream. For exmaple, if a device has two output streams with two
      //  channels each, then the starting channel number for the first stream is 1
      //  and ths starting channel number fo the second stream is 3.
      return .integer(1)
    case kAudioStreamPropertyLatency:
      //  This property returns any additonal presentation latency the stream has.
      return .integer(0)
    case kAudioStreamPropertyVirtualFormat,
         kAudioStreamPropertyPhysicalFormat:
      //  This returns the current format of the stream in an
      //  AudioStreamBasicDescription. Note that we need to hold the state lock to get
      //  this value.
      //  Note that for devices that don't override the mix operation, the virtual
      //  format has to be the same as the physical format.

      return .streamDescription(
        AudioStreamBasicDescription(
          mSampleRate: EQMDevice.sampleRate,
          mFormatID: kAudioFormatLinearPCM,
          mFormatFlags: kAudioFormatFlagIsFloat | kAudioFormatFlagsNativeEndian | kAudioFormatFlagIsPacked,
          mBytesPerPacket: kBytesPerFrame,
          mFramesPerPacket: 1,
          mBytesPerFrame: kBytesPerFrame,
          mChannelsPerFrame: kChannelCount,
          mBitsPerChannel: kBitsPerChannel,
          mReserved: 0
        )
      )
    case kAudioStreamPropertyAvailableVirtualFormats,
         kAudioStreamPropertyAvailablePhysicalFormats:
      //  This returns an array of AudioStreamRangedDescriptions that describe what
      //  formats are supported.

      //  Calculate the number of items that have been requested. Note that this
      //  number is allowed to be smaller than the actual size of the list. In such
      //  case, only that number of items will be returned

      //  fill out the return array

      let formats = ContiguousArray(kSupportedSamplingRates.map { sampleRate in
        return AudioStreamRangedDescription(
          mFormat: AudioStreamBasicDescription(
            mSampleRate: sampleRate,
            mFormatID: kAudioFormatLinearPCM,
            mFormatFlags: kAudioFormatFlagIsFloat | kAudioFormatFlagsNativeEndian | kAudioFormatFlagIsPacked,
            mBytesPerPacket: kBytesPerFrame,
            mFramesPerPacket: 1,
            mBytesPerFrame: kBytesPerFrame,
            mChannelsPerFrame: kChannelCount,
            mBitsPerChannel: kBitsPerChannel,
            mReserved: 0
          ),
          mSampleRateRange: AudioValueRange(
            mMinimum: sampleRate,
            mMaximum: sampleRate
          )
        )
      })

      return .streamDescriptionList(formats)
    default: return nil
    }
  }

  static func setPropertyData(objectID: AudioObjectID?, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus {
    switch address.mSelector {
    case kAudioStreamPropertyIsActive:
      //  Changing the active state of a stream doesn't affect IO or change the structure
      //  so we can just save the state and send the notification.
      guard let activeInt = data.assumingMemoryBound(to: UInt32?.self).pointee else {
        return kAudioHardwareBadPropertySizeError
      }
      let active = activeInt == 1

      switch objectID {
      case kObjectID_Stream_Input:
        inputActive = active
        break
      case kObjectID_Stream_Output:
        outputActive = active
        break
      default: return kAudioHardwareBadObjectError
      }

      return noErr
    case kAudioStreamPropertyVirtualFormat,
         kAudioStreamPropertyPhysicalFormat:
      //  Changing the stream format needs to be handled via the
      //  RequestConfigChange/PerformConfigChange machinery. Note that because this
      //  device only supports 2 channel 32 bit float data, the only thing that can
      //  change is the sample rate.

      guard let newDescription = data.assumingMemoryBound(to: AudioStreamBasicDescription?.self).pointee else {
        return kAudioHardwareBadPropertySizeError
      }

      if kSupportedSamplingRates.contains(newDescription.mSampleRate) {
        return kAudioDeviceUnsupportedFormatError
      }

      //  If we made it this far, the requested format is something we support, so make sure the sample rate is actually different
      if EQMDevice.sampleRate != description.mSampleRate {
        //  we dispatch this so that the change can happen asynchronously
        DispatchQueue.main.async {
          _ = EQMDriver.host?.pointee.RequestDeviceConfigurationChange(
            EQMDriver.host!,
            kObjectID_Device,
            UInt64(description.mSampleRate),
            nil
          )
        }
      }
      return noErr
    default: return kAudioHardwareUnknownPropertyError
    }
  }
}
