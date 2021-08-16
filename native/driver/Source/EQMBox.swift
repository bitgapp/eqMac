//
//  EQMBox.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMBox: EQMObjectProtocol {
  static let id = AudioObjectID(kBoxUID)!
  static let name = "eqMac Box"
  static var acquired = false

  static func hasProperty (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass,
         kAudioObjectPropertyClass,
         kAudioObjectPropertyOwner,
         kAudioObjectPropertyName,
         kAudioObjectPropertyModelName,
         kAudioObjectPropertyManufacturer,
         kAudioObjectPropertyOwnedObjects,
         kAudioObjectPropertyIdentify,
         kAudioObjectPropertySerialNumber,
         kAudioObjectPropertyFirmwareVersion,
         kAudioBoxPropertyBoxUID,
         kAudioBoxPropertyTransportType,
         kAudioBoxPropertyHasAudio,
         kAudioBoxPropertyHasVideo,
         kAudioBoxPropertyHasMIDI,
         kAudioBoxPropertyIsProtected,
         kAudioBoxPropertyAcquired,
         kAudioBoxPropertyAcquisitionFailed,
         kAudioBoxPropertyDeviceList: return true
    default:
      return false
    }
  }

  static func isPropertySettable (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioObjectPropertyName,
         kAudioObjectPropertyIdentify,
         kAudioBoxPropertyAcquired: return true
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
    case kAudioObjectPropertyModelName: return sizeof(CFString.self)
    case kAudioObjectPropertyManufacturer: return sizeof(CFString.self)
    case kAudioObjectPropertyOwnedObjects: return 0
    case kAudioObjectPropertyIdentify: return sizeof(UInt32.self)
    case kAudioObjectPropertySerialNumber: return sizeof(CFString.self)
    case kAudioObjectPropertyFirmwareVersion: return sizeof(CFString.self)
    case kAudioBoxPropertyBoxUID: return sizeof(CFString.self)
    case kAudioBoxPropertyTransportType: return sizeof(UInt32.self)
    case kAudioBoxPropertyHasAudio: return sizeof(UInt32.self)
    case kAudioBoxPropertyHasVideo: return sizeof(UInt32.self)
    case kAudioBoxPropertyHasMIDI: return sizeof(UInt32.self)
    case kAudioBoxPropertyIsProtected: return sizeof(UInt32.self)
    case kAudioBoxPropertyAcquired: return sizeof(UInt32.self)
    case kAudioBoxPropertyAcquisitionFailed: return sizeof(UInt32.self)
    case kAudioBoxPropertyDeviceList: return EQMBox.acquired ? sizeof(AudioObjectID.self) : 0

    default:
      return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> EQMObjectProperty? {

    switch address.mSelector {
    case kAudioObjectPropertyBaseClass:
      //  The base class for kAudioBoxClassID is kAudioObjectClassID
      return .audioClassID(kAudioObjectClassID)
    case kAudioObjectPropertyClass:
      //  The class is always kAudioBoxClassID for regular drivers
      return .audioClassID(kAudioBoxClassID)
    case kAudioObjectPropertyOwner:
      //  The owner is the plug-in object
      return .integer(kObjectID_PlugIn)
    case kAudioObjectPropertyName:
      //  This is the human readable name of the maker of the box.
      return .string(name as CFString)
    case kAudioObjectPropertyModelName:
      //  This is the human readable name of the maker of the box.
      return .string("eqMac Model" as CFString)
    case kAudioObjectPropertyManufacturer:
      //  This is the human readable name of the maker of the box.
      return .string(kDeviceManufacturer as CFString)
    case kAudioObjectPropertyOwnedObjects:
      //  This returns the objects directly owned by the object. Boxes don't own anything.
      return .objectIDList([])
    case kAudioObjectPropertyIdentify:
      //  This is used to highling the device in the UI, but it's value has no meaning
      return .integer(0)
    case kAudioObjectPropertySerialNumber:
      //  This is the human readable serial number of the box.
      return .string("00000001" as CFString)
    case kAudioObjectPropertyFirmwareVersion:
      //  This is the human readable firmware version of the box.
      return .string("1.0" as CFString)
    case kAudioBoxPropertyBoxUID:
      //  Boxes have UIDs the same as devices
      return .string(kBoxUID as CFString)
    case kAudioBoxPropertyTransportType:
      //  This value represents how the device is attached to the system. This can be
      //  any 32 bit integer, but common values for this property are defined in
      //  <CoreAudio/AudioHardwareBase.h>
      return .integer(kAudioDeviceTransportTypeVirtual)
    case kAudioBoxPropertyHasAudio:
      //  Indicates whether or not the box has audio capabilities
      return .integer(1)
    case kAudioBoxPropertyHasVideo:
      //  Indicates whether or not the box has video capabilities
      return .integer(0)
    case kAudioBoxPropertyHasMIDI:
      //  Indicates whether or not the box has MIDI capabilities
      return .integer(0)
    case kAudioBoxPropertyIsProtected:
      //  Indicates whether or not the box has requires authentication to use
      return .integer(0)
    case kAudioBoxPropertyAcquired:
      //  When set to a non-zero value, the device is acquired for use by the local machine
      return .integer(acquired ? 1 : 0)
    case kAudioBoxPropertyAcquisitionFailed:
      //  This is used for notifications to say when an attempt to acquire a device has failed.
      return .integer(0)
    case kAudioBoxPropertyDeviceList:
      //  This is used to indicate which devices came from this box
      return .integer(acquired ? kObjectID_Device : 0)
    default: return nil
    }
  }
}
