//
//  EQMBox.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class EQMBox {
  static let id = AudioObjectID(kBoxUID)!
  static let name = "eqMac Box"

  static func hasProperty(address: AudioObjectPropertyAddress) -> Bool {
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
}
