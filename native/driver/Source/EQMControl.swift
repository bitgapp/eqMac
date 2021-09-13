//
// EQMControl.swift
// eqMac
//
// Created by Nodeful on 15/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMControl: EQMObject {
  static var volume: Float32 = 1
  static var muted = false

  static func hasProperty (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool {
    switch(objectID) {
    case kObjectID_Volume_Output_Master:
      switch(address.mSelector) {
      case kAudioObjectPropertyBaseClass,
           kAudioObjectPropertyClass,
           kAudioObjectPropertyOwner,
           kAudioObjectPropertyOwnedObjects,
           kAudioControlPropertyScope,
           kAudioControlPropertyElement,
           kAudioLevelControlPropertyScalarValue,
           kAudioLevelControlPropertyDecibelValue,
           kAudioLevelControlPropertyDecibelRange,
           kAudioLevelControlPropertyConvertScalarToDecibels,
           kAudioLevelControlPropertyConvertDecibelsToScalar:
        return true
      default: return false
      }

    case kObjectID_Mute_Output_Master:
      switch(address.mSelector) {
      case kAudioObjectPropertyBaseClass,
           kAudioObjectPropertyClass,
           kAudioObjectPropertyOwner,
           kAudioObjectPropertyOwnedObjects,
           kAudioControlPropertyScope,
           kAudioControlPropertyElement,
           kAudioBooleanControlPropertyValue:
        return true
      default: return false
      }
    case kObjectID_DataSource_Output_Master:
      switch(address.mSelector) {
      case kAudioObjectPropertyBaseClass,
           kAudioObjectPropertyClass,
           kAudioObjectPropertyOwner,
           kAudioObjectPropertyOwnedObjects,
           kAudioControlPropertyScope,
           kAudioControlPropertyElement,
           kAudioSelectorControlPropertyCurrentItem,
           kAudioSelectorControlPropertyAvailableItems,
           kAudioSelectorControlPropertyItemName:
        return true
      default: return false
      }
    default: return false
    }
  }

  static func isPropertySettable (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool {
    switch(objectID) {
    case kObjectID_Volume_Output_Master:
      switch(address.mSelector) {
      case kAudioLevelControlPropertyScalarValue,
           kAudioLevelControlPropertyDecibelValue:
        return true
      default: return false
      }

    case kObjectID_Mute_Output_Master:
      switch(address.mSelector) {
      case kAudioBooleanControlPropertyValue:
        return true
      default: return false
      }
    case kObjectID_DataSource_Output_Master:
      switch(address.mSelector) {
      case kAudioSelectorControlPropertyCurrentItem:
        return true
      default: return false
      }
    default: return false
    }
  }

  static func getPropertyDataSize (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> UInt32? {
    switch objectID {
    case kObjectID_Volume_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyOwner: return sizeof(AudioObjectID.self)
      case kAudioObjectPropertyOwnedObjects: return 0 * sizeof(AudioObjectID.self)
      case kAudioControlPropertyScope: return sizeof(AudioObjectPropertyScope.self)
      case kAudioControlPropertyElement: return sizeof(AudioObjectPropertyElement.self)
      case kAudioLevelControlPropertyScalarValue: return sizeof(Float32.self)
      case kAudioLevelControlPropertyDecibelValue: return sizeof(Float32.self)
      case kAudioLevelControlPropertyDecibelRange: return sizeof(AudioValueRange.self)
      case kAudioLevelControlPropertyConvertScalarToDecibels: return sizeof(Float32.self)
      case kAudioLevelControlPropertyConvertDecibelsToScalar: return sizeof(Float32.self)
      default:
        return nil
      }
    case kObjectID_Mute_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyOwner: return sizeof(AudioObjectID.self)
      case kAudioObjectPropertyOwnedObjects: return 0 * sizeof(AudioObjectID.self)
      case kAudioControlPropertyScope: return sizeof(AudioObjectPropertyScope.self)
      case kAudioControlPropertyElement: return sizeof(AudioObjectPropertyElement.self)
      case kAudioBooleanControlPropertyValue: return sizeof(UInt32.self)
      default:
        return nil
      }
    case kObjectID_DataSource_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyClass: return sizeof(AudioClassID.self)
      case kAudioObjectPropertyOwner: return sizeof(AudioObjectID.self)
      case kAudioObjectPropertyOwnedObjects: return 0 * sizeof(AudioObjectID.self)
      case kAudioControlPropertyScope: return sizeof(AudioObjectPropertyScope.self)
      case kAudioControlPropertyElement: return sizeof(AudioObjectPropertyElement.self)
      case kAudioSelectorControlPropertyCurrentItem: return sizeof(UInt32.self)
      case kAudioSelectorControlPropertyAvailableItems: return kDataSource_NumberItems * sizeof(UInt32.self)
      case kAudioSelectorControlPropertyItemName: return sizeof(CFString.self)
      default:
        return nil
      }
    default:
      return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty? {
    switch objectID {
    case kObjectID_Volume_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        // The base class for kAudioVolumeControlClassID is kAudioLevelControlClassID
        return .audioClassID(kAudioLevelControlClassID)
      case kAudioObjectPropertyClass:
        // Volume controls are of the class, kAudioVolumeControlClassID
        return .audioClassID(kAudioVolumeControlClassID)
      case kAudioObjectPropertyOwner:
        // The control's owner is the device object
        return .audioObjectID(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        // Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        // This property returns the scope that the control is attached to.
        switch objectID {
        case kObjectID_Volume_Output_Master: return .scope(kAudioObjectPropertyScopeOutput)
        default: return .scope(kAudioObjectPropertyScopeGlobal)
        }
      case kAudioControlPropertyElement:
        // This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)
      case kAudioLevelControlPropertyScalarValue:
        // This returns the value of the control in the normalized range of 0 to 1.
        // Note that we need to take the state lock to examine the value.
        let volume = ({ () -> Float32 in
          switch objectID {
          case kObjectID_Volume_Output_Master: return self.volume
          default: return 0
          }
        })()
        return .float32(VolumeConverter.toScalar(volume))
      case kAudioLevelControlPropertyDecibelValue:
        // This returns the dB value of the control.
        // Note that we need to take the state lock to examine the value.
        let volume = ({ () -> Float32 in
          switch objectID {
          case kObjectID_Volume_Output_Master: return self.volume
          default: return 0
          }
        })()
        return .float32(VolumeConverter.toDecibel(volume))
      case kAudioLevelControlPropertyDecibelRange:
        // This returns the dB range of the control.
        return .valueRange(
          AudioValueRange(
            mMinimum: Float64(kMinVolumeDB),
            mMaximum: Float64(kMaxVolumeDB)
          )
        )
      case kAudioLevelControlPropertyConvertScalarToDecibels:
        // This takes the scalar value in outData and converts it to dB.
        guard var scalar = inData?.assumingMemoryBound(to: Float32?.self).pointee else {
          return .float32(0)
        }

        scalar = clamp(value: scalar, min: 0, max: 1)

        let decibel = VolumeConverter.toDecibel(VolumeConverter.fromScalar(scalar))

        return .float32(decibel)
      case kAudioLevelControlPropertyConvertDecibelsToScalar:
        // This takes the dB value in outData and converts it to scalar.

        guard var decibel = inData?.assumingMemoryBound(to: Float32?.self).pointee else {
          return .float32(0)
        }

        decibel = clamp(value: decibel, min: kMinVolumeDB, max: kMaxVolumeDB)

        let scalar = VolumeConverter.toScalar(VolumeConverter.fromDecibel(decibel))

        return .float32(scalar)
      default: return nil
      }

    case kObjectID_Mute_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        // The base class for kAudioMuteControlClassID is kAudioBooleanControlClassID
        return .audioClassID(kAudioBooleanControlClassID)
      case kAudioObjectPropertyClass:
        // Mute controls are of the class, kAudioMuteControlClassID
        return .audioClassID(kAudioMuteControlClassID)
      case kAudioObjectPropertyOwner:
        // The control's owner is the device object
        return .audioObjectID(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        // Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        // This property returns the scope that the control is attached to.
        switch objectID {
        case kObjectID_Mute_Output_Master: return .scope(kAudioObjectPropertyScopeOutput)
        default: return .scope(kAudioObjectPropertyScopeGlobal)
        }
      case kAudioControlPropertyElement:
        // This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)
      case kAudioBooleanControlPropertyValue:
        // This returns the value of the mute control where 0 means that mute is off
        // and audio can be heard and 1 means that mute is on and audio cannot be heard.
        // Note that we need to take the state lock to examine this value.
        let muted = ({ () -> Bool in
          switch objectID {
          case kObjectID_Mute_Output_Master: return self.muted
          default: return false
          }
        })()
        return .integer(muted ? 1 : 0)
      default: return nil
      }
    case kObjectID_DataSource_Output_Master:
      //    case kObjectID_DataDestination_PlayThru_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        // The base class for kAudioDataSourceControlClassID is kAudioSelectorControlClassID
        return .audioClassID(kAudioSelectorControlClassID)
      case kAudioObjectPropertyClass:
        // Data Source controls are of the class, kAudioDataSourceControlClassID
        return .audioClassID(kAudioDataSourceControlClassID)
      case kAudioObjectPropertyOwner:
        // The control's owner is the device object
        return .audioObjectID(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        // Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        // This property returns the scope that the control is attached to.
        switch objectID {
        case kObjectID_DataSource_Output_Master:
          return .scope(kAudioObjectPropertyScopeOutput)
        default: return nil
        }

      case kAudioControlPropertyElement:
        // This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)

      case kAudioSelectorControlPropertyCurrentItem:
        // This returns the value of the data source selector.
        // Note that we need to take the state lock to examine this value.
        return .integer(0)
      case kAudioSelectorControlPropertyAvailableItems:
        // This returns the IDs for all the items the data source control supports.

        // Calculate the number of items that have been requested. Note that this
        // number is allowed to be smaller than the actual size of the list. In such
        // case, only that number of items will be returned

        // eqMac only has 1 Source
        return .integer(0)
      case kAudioSelectorControlPropertyItemName:
        // This returns the user-readable name for the selector item in the qualifier
        return .string(EQMDevice.name as CFString)
      default: return nil
      }
    default: return nil
    }
  }

  static func setPropertyData(client: EQMClient?, objectID: AudioObjectID?, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus {
    switch objectID {
    case kObjectID_Volume_Output_Master:
      switch address.mSelector {
      case kAudioLevelControlPropertyScalarValue:
        // For the scalar volume, we clamp the new value to [0, 1]. Note that if this
        // value changes, it implies that the dB value changed too.
        let scalar = data.load(as: Float32.self)

        var newVolume = VolumeConverter.fromScalar(scalar)
        newVolume = clamp(value: newVolume, min: 0.0, max: 1.0)

        if volume != newVolume {
          volume = newVolume
          changedProperties.append(
            AudioObjectPropertyAddress(
              mSelector: kAudioLevelControlPropertyScalarValue,
              mScope: kAudioObjectPropertyScopeGlobal,
              mElement: kAudioObjectPropertyElementMaster
            )
          )

          changedProperties.append(
            AudioObjectPropertyAddress(
              mSelector: kAudioLevelControlPropertyDecibelValue,
              mScope: kAudioObjectPropertyScopeGlobal,
              mElement: kAudioObjectPropertyElementMaster
            )
          )
        }

        return noErr

      case kAudioLevelControlPropertyDecibelValue:
        // For the dB value, we first convert it to a scalar value since that is how
        // the value is tracked. Note that if this value changes, it implies that the
        // scalar value changes as well.
        var decibel = data.load(as: Float32.self)
        decibel = clamp(value: decibel, min: kMinVolumeDB, max: kMaxVolumeDB)

        var newVolume = VolumeConverter.fromDecibel(decibel)
        newVolume = clamp(value: newVolume, min: 0.0, max: 1.0)

        if volume != newVolume {
          volume = newVolume

          changedProperties.append(
            AudioObjectPropertyAddress(
              mSelector: kAudioLevelControlPropertyScalarValue,
              mScope: kAudioObjectPropertyScopeGlobal,
              mElement: kAudioObjectPropertyElementMaster
            )
          )

          changedProperties.append(
            AudioObjectPropertyAddress(
              mSelector: kAudioLevelControlPropertyDecibelValue,
              mScope: kAudioObjectPropertyScopeGlobal,
              mElement: kAudioObjectPropertyElementMaster
            )
          )
        }

        return noErr

      default: return kAudioHardwareUnknownPropertyError
      }

    case kObjectID_Mute_Output_Master:
      switch address.mSelector {
      case kAudioBooleanControlPropertyValue:
        let mutedInt = data.load(as: UInt32.self)

        let newMuted = mutedInt == 1

        if (muted != newMuted) {
          muted = newMuted

          changedProperties.append(
            AudioObjectPropertyAddress(
              mSelector: kAudioBooleanControlPropertyValue,
              mScope: kAudioObjectPropertyScopeGlobal,
              mElement: kAudioObjectPropertyElementMaster
            )
          )
        }
        return noErr

      default: return kAudioHardwareUnknownPropertyError
      }

    case kObjectID_DataSource_Output_Master:
      //    case kObjectID_DataDestination_PlayThru_Master:
      switch address.mSelector {
      case kAudioSelectorControlPropertyCurrentItem:
        // For selector controls, we check to make sure the requested value is in the
        // available items list and just store the value.
        return noErr

      default: return kAudioHardwareUnknownPropertyError;
      }
    default: return kAudioHardwareBadObjectError
    }
  }
}
