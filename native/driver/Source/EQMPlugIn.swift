//
//  EQMPlugIn.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMPlugIn: ObjectProtocol {
  static let id = AudioObjectID(kPlugInBundleId)!

  static func hasProperty(address: AudioObjectPropertyAddress) -> Bool {
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
         kAudioObjectPropertyCustomPropertyInfoList,
         kPlugIn_CustomPropertyID: return true
    default:
      return false
    }
  }
}
