//
//  EQMStream.swift
//  eqMac
//
//  Created by Nodeful on 15/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMStream: EQMObjectProtocol {
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
         kAudioStreamPropertyAvailablePhysicalFormats: return 6 * sizeof(AudioStreamRangedDescription.self)
    default:
      return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> EQMObjectProperty? {

    switch address.mSelector {

    default: return nil
    }
  }
}
