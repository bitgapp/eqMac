//
//  EQMDevice.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

let kEQMDeviceCustomPropertyLatency = Utilities.getPropertySelector(from: "cltc")
let kEQMDeviceCustomPropertySafetyOffset =  Utilities.getPropertySelector(from: "csfo")
let kEQMDeviceCustomPropertyShown =  Utilities.getPropertySelector(from: "shwn")
let kEQMDeviceCustomPropertyVersion =  Utilities.getPropertySelector(from: "vrsn")

class EQMDevice {
  static let id = AudioObjectID(kDeviceUID)!
  static var name = kDeviceName
  static var sampleRate = kDefaultSampleRate

  static func hasProperty(address: AudioObjectPropertyAddress) -> Bool {
    switch address.mSelector {
     case kAudioObjectPropertyBaseClass,
     kAudioObjectPropertyClass,
     kAudioObjectPropertyOwner,
     kAudioObjectPropertyName,
     kAudioObjectPropertyManufacturer,
     kAudioObjectPropertyOwnedObjects,
     kAudioDevicePropertyDeviceUID,
     kAudioDevicePropertyModelUID,
     kAudioDevicePropertyTransportType,
     kAudioDevicePropertyRelatedDevices,
     kAudioDevicePropertyClockDomain,
     kAudioDevicePropertyDeviceIsAlive,
     kAudioDevicePropertyDeviceIsRunning,
     kAudioObjectPropertyControlList,
     kAudioDevicePropertyNominalSampleRate,
     kAudioDevicePropertyAvailableNominalSampleRates,
     kAudioDevicePropertyIsHidden,
     kAudioDevicePropertyZeroTimeStampPeriod,
     kAudioDevicePropertyIcon,
     kAudioDevicePropertyStreams,
     kAudioObjectPropertyCustomPropertyInfoList,
     kAudioDeviceCustomPropertyShown,
     kAudioDeviceCustomPropertyVersion,
     kAudioDeviceCustomPropertyLatency,
     kAudioDeviceCustomPropertySafetyOffset:
      return true

     case kAudioDevicePropertyDeviceCanBeDefaultDevice,
     kAudioDevicePropertyDeviceCanBeDefaultSystemDevice,
     kAudioDevicePropertyLatency,
     kAudioDevicePropertySafetyOffset,
     kAudioDevicePropertyPreferredChannelsForStereo,
     kAudioDevicePropertyPreferredChannelLayout:
      return address.mScope == kAudioObjectPropertyScopeInput || address.mScope == kAudioObjectPropertyScopeOutput
    default:
      return false
    }
  }
}
