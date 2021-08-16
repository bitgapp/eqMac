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
    switch address.mSelector {

    default: return nil
    }
  }
}
