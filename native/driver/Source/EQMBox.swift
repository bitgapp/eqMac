//
//  EQMBox.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMBox: EQMObject {
  static let id = AudioObjectID(kBoxUID)!
  static var name: String? = kBoxDefaultName
  static var acquired = true

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

  static func getPropertyData (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty? {
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
      return .string((name ?? kBoxDefaultName) as CFString)
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
      var devices = ContiguousArray<AudioObjectID>()

      if EQMBox.acquired {
        devices.append(kObjectID_Device)
      }
      return .objectIDList(devices)
    default: return nil
    }
  }

  static func setPropertyData(objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus {
    switch address.mSelector {
    case kAudioObjectPropertyName:
      //  Boxes should allow their name to be editable
      guard let newName = data.assumingMemoryBound(to: CFString?.self).pointee else {
        return kAudioHardwareBadPropertySizeError
      }
      name = newName as String
      return noErr
    case kAudioObjectPropertyIdentify:
      return noErr
    case kAudioBoxPropertyAcquired:
      //  When the box is acquired, it means the contents, namely the device, are available to the system
      guard let wasAcquiredInt = data.assumingMemoryBound(to: UInt32?.self).pointee else {
        return kAudioHardwareBadPropertySizeError
      }
      let wasAcquired = wasAcquiredInt == 1
      if (acquired != wasAcquired) {
        //  the new value is different from the old value, so save it
        acquired = wasAcquired
        
        _ = EQMDriver.host?.pointee.WriteToStorage(EQMDriver.host!, "box acquired" as CFString, acquired ? kCFBooleanTrue : kCFBooleanFalse)
        
        //  and it means that this property and the device list property have changed
        changedProperties.append(
          AudioObjectPropertyAddress(
            mSelector: kAudioBoxPropertyAcquired,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMaster
          )
        )
        
        changedProperties.append(
          AudioObjectPropertyAddress(
            mSelector: kAudioBoxPropertyDeviceList,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMaster
          )
        )
        
        //  but it also means that the device list has changed for the plug-in too
        DispatchQueue.global(qos: .default).async {
          var address = AudioObjectPropertyAddress(
            mSelector: kAudioPlugInPropertyDeviceList,
            mScope: kAudioObjectPropertyScopeGlobal,
            mElement: kAudioObjectPropertyElementMaster
          )
          _ = EQMDriver.host?.pointee.PropertiesChanged(EQMDriver.host!, kObjectID_PlugIn, 1, &address);
        }
      }
      
      return noErr
    default: return kAudioHardwareUnknownPropertyError
    }
  }
}
