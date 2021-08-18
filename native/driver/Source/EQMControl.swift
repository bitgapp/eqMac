//
//  EQMControl.swift
//  eqMac
//
//  Created by Nodeful on 15/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMControl: EQMObjectProtocol {
  static var outputVolume: Float32 = 1
  static var outputMuted = false
  static var inputDataSource: UInt32 = 0
  static var outputDataSource: UInt32 = 0

  static func hasProperty (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool {
    switch(objectID) {
    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master:
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

    case kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master:
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
    case kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master:
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
    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master:
      switch(address.mSelector) {
      case kAudioLevelControlPropertyScalarValue,
           kAudioLevelControlPropertyDecibelValue:
        return true
      default: return false
      }

    case kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master:
      switch(address.mSelector) {
      case kAudioBooleanControlPropertyValue:
        return true
      default: return false
      }
    case kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master:
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
    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master:
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
    case kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master:
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
    case kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master:
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

  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> EQMObjectProperty? {
    switch objectID {
    case kObjectID_Volume_Input_Master,
         kObjectID_Volume_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        //  The base class for kAudioVolumeControlClassID is kAudioLevelControlClassID
        return .audioClassID(kAudioLevelControlClassID)
      case kAudioObjectPropertyClass:
        //  Volume controls are of the class, kAudioVolumeControlClassID
        return .audioClassID(kAudioVolumeControlClassID)
      case kAudioObjectPropertyOwner:
        //  The control's owner is the device object
        return .integer(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        //  Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        //  This property returns the scope that the control is attached to.
        switch objectID {
        case kObjectID_Volume_Input_Master: return .scope(kAudioObjectPropertyScopeInput)
        case kObjectID_Volume_Output_Master: return .scope(kAudioObjectPropertyScopeOutput)
        default: return .scope(kAudioObjectPropertyScopeGlobal)
        }
      case kAudioControlPropertyElement:
        //  This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)
      case kAudioLevelControlPropertyScalarValue:
        //  This returns the value of the control in the normalized range of 0 to 1.
        //  Note that we need to take the state lock to examine the value.
        let volume = ({ () -> Float32 in
          switch objectID {
          case kObjectID_Volume_Input_Master: return 0
          case kObjectID_Volume_Output_Master: return outputVolume
          default: return 0
          }
        })()
        return .float32(volumeToScalar(volume))
      case kAudioLevelControlPropertyDecibelValue:
        //  This returns the dB value of the control.
        //  Note that we need to take the state lock to examine the value.
        let volume = ({ () -> Float32 in
          switch objectID {
          case kObjectID_Volume_Input_Master: return 0
          case kObjectID_Volume_Output_Master: return outputVolume
          default: return 0
          }
        })()
        return .float32(volumeToDecibel(volume))
      case kAudioLevelControlPropertyDecibelRange:
        //  This returns the dB range of the control.
        return .valueRange(
          AudioValueRange(
            mMinimum: Float64(kMinVolumeDB),
            mMaximum: Float64(kMaxVolumeDB)
          )
        )
      case kAudioLevelControlPropertyConvertScalarToDecibels:
        // This takes the scalar value in outData and converts it to dB.
        // TODO: eqMac does not implement this function for now
        return .float32(0)
      case kAudioLevelControlPropertyConvertDecibelsToScalar:
        //  This takes the dB value in outData and converts it to scalar.
        // TODO: eqMac does not implement this function for now
        return .float32(0)
      default: return nil
      }

    case kObjectID_Mute_Input_Master,
         kObjectID_Mute_Output_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        //  The base class for kAudioMuteControlClassID is kAudioBooleanControlClassID
        return .audioClassID(kAudioBooleanControlClassID)
      case kAudioObjectPropertyClass:
        //  Mute controls are of the class, kAudioMuteControlClassID
        return .audioClassID(kAudioMuteControlClassID)
      case kAudioObjectPropertyOwner:
        //  The control's owner is the device object
        return .integer(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        //  Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        //  This property returns the scope that the control is attached to.
        switch objectID {
          case kObjectID_Mute_Input_Master: return .scope(kAudioObjectPropertyScopeInput)
          case kObjectID_Mute_Output_Master: return .scope(kAudioObjectPropertyScopeOutput)
          default: return .scope(kAudioObjectPropertyScopeGlobal)
        }
      case kAudioControlPropertyElement:
        //  This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)
      case kAudioBooleanControlPropertyValue:
        //  This returns the value of the mute control where 0 means that mute is off
        //  and audio can be heard and 1 means that mute is on and audio cannot be heard.
        //  Note that we need to take the state lock to examine this value.
        let muted = ({ () -> Bool in
          switch objectID {
            case kObjectID_Mute_Input_Master: return false
            case kObjectID_Mute_Output_Master: return outputMuted
            default: return false
          }
        })()
        return .integer(muted ? 1 : 0)
      default: return nil
      }
    case kObjectID_DataSource_Input_Master,
         kObjectID_DataSource_Output_Master:
      //    case kObjectID_DataDestination_PlayThru_Master:
      switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        //  The base class for kAudioDataSourceControlClassID is kAudioSelectorControlClassID
        return .audioClassID(kAudioSelectorControlClassID)
      case kAudioObjectPropertyClass:
        //  Data Source controls are of the class, kAudioDataSourceControlClassID
        return .audioClassID(kAudioDataSourceControlClassID)
      case kAudioObjectPropertyOwner:
        //  The control's owner is the device object
        return .integer(kObjectID_Device)
      case kAudioObjectPropertyOwnedObjects:
        //  Controls do not own any objects
        return .objectIDList([])
      case kAudioControlPropertyScope:
        //  This property returns the scope that the control is attached to.
        switch objectID {
        case kObjectID_DataSource_Input_Master:
          return .scope(kAudioObjectPropertyScopeInput)
        case kObjectID_DataSource_Output_Master:
          return .scope(kAudioObjectPropertyScopeOutput)
        default: return nil
        }

      case kAudioControlPropertyElement:
        //  This property returns the element that the control is attached to.
        return .element(kAudioObjectPropertyElementMaster)

      case kAudioSelectorControlPropertyCurrentItem:
        //  This returns the value of the data source selector.
        //  Note that we need to take the state lock to examine this value.
        switch objectID {
        case kObjectID_DataSource_Input_Master: return .integer(inputDataSource)
        case kObjectID_DataSource_Output_Master: return .integer(outputDataSource)
        default: return nil
        }
      case kAudioSelectorControlPropertyAvailableItems:
        //  This returns the IDs for all the items the data source control supports.

        //  Calculate the number of items that have been requested. Note that this
        //  number is allowed to be smaller than the actual size of the list. In such
        //  case, only that number of items will be returned

        // eqMac only has 1 Source
        return .integer(0)
      case kAudioSelectorControlPropertyItemName:
        //  This returns the user-readable name for the selector item in the qualifier
        return .string(kDeviceName as CFString)
      default: return nil
      }
    default: return nil
    }
  }

  static func setPropertyData(objectID: AudioObjectID?, address: AudioObjectPropertyAddress, data: UnsafeRawPointer) -> OSStatus {
    switch objectID {
      case kObjectID_Volume_Input_Master,
           kObjectID_Volume_Output_Master:
        switch address.mSelector {
          case kAudioLevelControlPropertyScalarValue:
            //  For the scalar volume, we clamp the new value to [0, 1]. Note that if this
            //  value changes, it implies that the dB value changed too.
            guard let scalar = data.assumingMemoryBound(to: Float32?.self).pointee else {
              return kAudioHardwareBadPropertySizeError
            }

            var newVolume = scalarToVolume(scalar)
            newVolume = clamp(value: newVolume, min: 0.0, max: 1.0)

            switch objectID {
            case kObjectID_Volume_Input_Master:
              break
            case kObjectID_Volume_Output_Master:
              if outputVolume != newVolume {
                outputVolume = newVolume
              }
              break
            default: return kAudioHardwareBadObjectError
            }

            return noErr

          case kAudioLevelControlPropertyDecibelValue:
            //  For the dB value, we first convert it to a scalar value since that is how
            //  the value is tracked. Note that if this value changes, it implies that the
            //  scalar value changes as well.
            guard var decibel = data.assumingMemoryBound(to: Float32?.self).pointee else {
              return kAudioHardwareBadPropertySizeError
            }
            decibel = clamp(value: decibel, min: kMinVolumeDB, max: kMaxVolumeDB)

            var newVolume = decibelToVolume(decibel)
            newVolume = clamp(value: newVolume, min: 0.0, max: 1.0)

            switch objectID {
            case kObjectID_Volume_Input_Master:
              break
            case kObjectID_Volume_Output_Master:
              if outputVolume != newVolume {
                outputVolume = newVolume
              }
              break
            default: return kAudioHardwareBadObjectError
            }

            return noErr

          default: return kAudioHardwareUnknownPropertyError
        }

      case kObjectID_Mute_Input_Master,
           kObjectID_Mute_Output_Master:
        switch address.mSelector {
          case kAudioBooleanControlPropertyValue:
            guard let mutedInt = data.assumingMemoryBound(to: UInt32?.self).pointee else {
              return kAudioHardwareBadPropertySizeError
            }

            let muted = mutedInt == 1
            switch objectID {
              case kObjectID_DataSource_Input_Master:
                return noErr

              case kObjectID_DataSource_Output_Master:
                if (outputMuted != muted) {
                  outputMuted = muted
                }
                return noErr
            default: return kAudioHardwareBadObjectError
            }

          default: return kAudioHardwareUnknownPropertyError
        }

      case kObjectID_DataSource_Input_Master,
           kObjectID_DataSource_Output_Master:
        //    case kObjectID_DataDestination_PlayThru_Master:
        switch address.mSelector {
          case kAudioSelectorControlPropertyCurrentItem:
            //  For selector controls, we check to make sure the requested value is in the
            //  available items list and just store the value.
            return noErr

          default: return kAudioHardwareUnknownPropertyError;
        }
    default: return kAudioHardwareBadObjectError
    }
  }
}
