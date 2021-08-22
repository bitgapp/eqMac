//
//  EQMPlugIn.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMPlugIn: EQMObject {
  static let id = AudioObjectID(kPlugInBundleId)!

  static func hasProperty (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass,
         kAudioObjectPropertyClass,
         kAudioObjectPropertyOwner,
         kAudioObjectPropertyManufacturer,
         kAudioObjectPropertyOwnedObjects,
         kAudioPlugInPropertyBoxList,
         kAudioPlugInPropertyTranslateUIDToBox,
         kAudioPlugInPropertyDeviceList,
         kAudioPlugInPropertyTranslateUIDToDevice,
         kAudioPlugInPropertyResourceBundle,
         kAudioObjectPropertyCustomPropertyInfoList: return true
    default:
      return false
    }
  }

  static func isPropertySettable (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
      default: return false
    }
  }

  static func getPropertyDataSize (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress) -> UInt32? {
    switch address.mSelector {
    case kAudioObjectPropertyBaseClass: return sizeof(AudioClassID.self)
    case kAudioObjectPropertyClass: return sizeof(AudioClassID.self)
    case kAudioObjectPropertyOwner: return sizeof(AudioObjectID.self)
    case kAudioObjectPropertyManufacturer: return sizeof(CFString.self)
    case kAudioObjectPropertyOwnedObjects:
      if (EQMBox.acquired) {
        return 2 * sizeof(AudioClassID.self)
      } else {
        return sizeof(AudioClassID.self)
      }
    case kAudioPlugInPropertyBoxList: return sizeof(AudioClassID.self)
    case kAudioPlugInPropertyTranslateUIDToBox: return sizeof(AudioObjectID.self)
    case kAudioPlugInPropertyDeviceList:
      if (EQMBox.acquired) {
        return sizeof(AudioClassID.self)
      } else {
        return 0
      }
    case kAudioPlugInPropertyTranslateUIDToDevice: return sizeof(AudioObjectID.self)
    case kAudioPlugInPropertyResourceBundle: return  sizeof(CFString.self)
    case kAudioObjectPropertyCustomPropertyInfoList: return sizeof(AudioServerPlugInCustomPropertyInfo.self) * 0
    default: return nil
    }
  }

  static func getPropertyData (objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty? {
    switch address.mSelector {
      case kAudioObjectPropertyBaseClass:
        //  The base class for kAudioPlugInClassID is kAudioObjectClassID
        return .audioClassID(kAudioObjectClassID)
      case kAudioObjectPropertyClass:
        //  The class is always kAudioPlugInClassID for regular drivers
        return .audioClassID(kAudioPlugInClassID)
      case kAudioObjectPropertyOwner:
        //  The plug-in doesn't have an owning object
        return .audioClassID(kAudioObjectUnknown)
      case kAudioObjectPropertyManufacturer:
        //  This is the human readable name of the maker of the plug-in.
        return .string(kDeviceManufacturer as CFString)

      case kAudioObjectPropertyOwnedObjects:
        var objects = ContiguousArray<AudioObjectID>()
        objects.append(kObjectID_Box)
        if EQMBox.acquired {
          objects.append(kObjectID_Device)
        }
        return .objectIDList(objects)

      case kAudioPlugInPropertyBoxList:
        return .objectIDList([kObjectID_Box])

      case kAudioPlugInPropertyTranslateUIDToBox:
        let uid = inData?.assumingMemoryBound(to: CFString?.self).pointee

        if (CFStringCompare(uid, kBoxUID as CFString, .init(rawValue: 0)) == CFComparisonResult.compareEqualTo) {
          return .integer(kObjectID_Box)
        } else {
          return .integer(kAudioObjectUnknown)
        }
        
      case kAudioPlugInPropertyDeviceList:
        var devices = ContiguousArray<AudioObjectID>()

        if EQMBox.acquired {
          devices.append(kObjectID_Device)
        }
        return .objectIDList(devices)

      case kAudioPlugInPropertyTranslateUIDToDevice:
        //  This property takes the CFString passed in the qualifier and converts that
        //  to the object ID of the device it corresponds to. For this driver, there is
        //  just the one device. Note that it is not an error if the string in the
        //  qualifier doesn't match any devices. In such case, kAudioObjectUnknown is
        //  the object ID to return.
        let uid = inData?.assumingMemoryBound(to: CFString?.self).pointee
        if (CFStringCompare(uid, kDeviceUID as CFString, .init(rawValue: 0)) == CFComparisonResult.compareEqualTo) {
          return .integer(kObjectID_Device)
        } else {
          return .integer(kAudioObjectUnknown)
        }
      case kAudioPlugInPropertyResourceBundle:
        //  The resource bundle is a path relative to the path of the plug-in's bundle.
        //  To specify that the plug-in bundle itself should be used, we just return the
        //  empty string.
        return .string("" as CFString)
      case kAudioObjectPropertyCustomPropertyInfoList:
        //  This property returns an array of AudioServerPlugInCustomPropertyInfo's that
        //  describe the type of data used by any custom properties. For this example,
        //  the plug-in supports a single property whose data type is a CFString and
        //  whose qualifier is a CFString.
        return .customPropertyInfoList([])
      default:
        return nil
    }
  }

  static func setPropertyData(objectID: AudioObjectID? = nil, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus {
    switch address.mSelector {
    default: return kAudioHardwareUnknownPropertyError
    }
  }
}
