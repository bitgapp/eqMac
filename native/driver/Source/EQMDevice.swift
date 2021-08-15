//
//  EQMDevice.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

let kEQMDeviceCustomPropertyLatency = AudioObjectPropertySelector.fromString("cltc")
let kEQMDeviceCustomPropertySafetyOffset =  AudioObjectPropertySelector.fromString("csfo")
let kEQMDeviceCustomPropertyShown =  AudioObjectPropertySelector.fromString("shwn")
let kEQMDeviceCustomPropertyVersion =  AudioObjectPropertySelector.fromString("vrsn")

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
     kEQMDeviceCustomPropertyShown,
     kEQMDeviceCustomPropertyVersion,
     kEQMDeviceCustomPropertyLatency,
     kEQMDeviceCustomPropertySafetyOffset:
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
