//
//Misc.swift
//eqMac
//
//Created by Nodeful on 16/08/2021.
//Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

class Volume {
  static func toDecibel (_ volume: Float32) -> Float32 {
    if (volume <= powf(10.0, kMinVolumeDB / 20.0)) {
      return kMinVolumeDB
    } else {
      return 20.0 * log10f(volume)
    }
  }

  static func fromDecibel (_ decibel: Float32) -> Float32 {
    if (decibel <= kMinVolumeDB) {
      return 0.0
    } else {
      return powf(10.0, decibel / 20.0)
    }
  }

  static func toScalar (_ volume: Float32) -> Float32 {
    let decibel = toDecibel(volume);
    return (decibel - kMinVolumeDB) / (kMaxVolumeDB - kMinVolumeDB);
  }

  static func fromScalar (_ scalar: Float32) -> Float32 {
    let decibel = scalar * (kMaxVolumeDB - kMinVolumeDB) + kMinVolumeDB
    return fromDecibel(decibel)
  }
}

// MARK: - Pure Functions
func log (_ msg: String) {
  if DEBUG {
    let message = "coreaudiod: eqMac - \(msg)"
    NSLog(message)
  }
}

// Debug helpers

func propertyName (_ property: AudioObjectPropertySelector) -> String {
  var props: [String] = AudioProperties.filter { $0.0 == property }.map { $0.1 }
  if props.count == 0 { props.append(property.code) }
  return "\(props.joined(separator: " | "))"
}

func scopeName (_ scope: AudioObjectPropertyScope) -> String {
  return AudioPropertyScopes[scope] ?? "Unknown"
}

let AudioPropertyScopes: [AudioObjectPropertyScope: String] = [
  kAudioObjectPropertyScopeGlobal: "Global",
  kAudioObjectPropertyScopeInput: "Input",
  kAudioObjectPropertyScopeOutput: "Output"
]

// This is a hashmap of all properties for debug loggin purposes
let AudioProperties: [(AudioObjectPropertySelector, String)] = [
  // Shared
  (kAudioObjectPropertyBaseClass, "kAudioObjectPropertyBaseClass"),
  (kAudioObjectPropertyClass, "kAudioObjectPropertyClass"),
  (kAudioObjectPropertyOwner, "kAudioObjectPropertyOwner"),
  (kAudioObjectPropertyName, "kAudioObjectPropertyName"),
  (kAudioObjectPropertyModelName, "kAudioObjectPropertyModelName"),
  (kAudioObjectPropertyManufacturer, "kAudioObjectPropertyManufacturer"),
  (kAudioObjectPropertyElementName, "kAudioObjectPropertyElementName"),
  (kAudioObjectPropertyElementCategoryName, "kAudioObjectPropertyElementCategoryName"),
  (kAudioObjectPropertyElementNumberName, "kAudioObjectPropertyElementNumberName"),
  (kAudioObjectPropertyOwnedObjects, "kAudioObjectPropertyOwnedObjects"),
  (kAudioObjectPropertyIdentify, "kAudioObjectPropertyIdentify"),
  (kAudioObjectPropertySerialNumber, "kAudioObjectPropertySerialNumber"),
  (kAudioObjectPropertyFirmwareVersion, "kAudioObjectPropertyFirmwareVersion"),
  (kAudioObjectPropertyCustomPropertyInfoList, "kAudioObjectPropertyCustomPropertyInfoList"),

  // Plug-in
  (kAudioPlugInPropertyBundleID, "kAudioPlugInPropertyBundleID"),
  (kAudioPlugInPropertyDeviceList, "kAudioPlugInPropertyDeviceList"),
  (kAudioPlugInPropertyTranslateUIDToDevice, "kAudioPlugInPropertyTranslateUIDToDevice"),
  (kAudioPlugInPropertyBoxList, "kAudioPlugInPropertyBoxList"),
  (kAudioPlugInPropertyTranslateUIDToBox, "kAudioPlugInPropertyTranslateUIDToBox"),
  (kAudioPlugInPropertyClockDeviceList, "kAudioPlugInPropertyClockDeviceList"),
  (kAudioPlugInPropertyTranslateUIDToClockDevice, "kAudioPlugInPropertyTranslateUIDToClockDevice"),
  (kAudioPlugInPropertyResourceBundle, "kAudioPlugInPropertyResourceBundle"),

  // Transport Manager
  (kAudioTransportManagerPropertyEndPointList, "kAudioTransportManagerPropertyEndPointList"),
  (kAudioTransportManagerPropertyTranslateUIDToEndPoint, "kAudioTransportManagerPropertyTranslateUIDToEndPoint"),
  (kAudioTransportManagerPropertyTransportType, "kAudioTransportManagerPropertyTransportType"),

  // Box
  (kAudioBoxPropertyBoxUID, "kAudioBoxPropertyBoxUID"),
  (kAudioBoxPropertyTransportType, "kAudioBoxPropertyTransportType"),
  (kAudioBoxPropertyHasAudio, "kAudioBoxPropertyHasAudio"),
  (kAudioBoxPropertyHasVideo, "kAudioBoxPropertyHasVideo"),
  (kAudioBoxPropertyHasMIDI, "kAudioBoxPropertyHasMIDI"),
  (kAudioBoxPropertyIsProtected, "kAudioBoxPropertyIsProtected"),
  (kAudioBoxPropertyAcquired, "kAudioBoxPropertyAcquired"),
  (kAudioBoxPropertyAcquisitionFailed, "kAudioBoxPropertyAcquisitionFailed"),
  (kAudioBoxPropertyDeviceList, "kAudioBoxPropertyDeviceList"),
  (kAudioBoxPropertyClockDeviceList, "kAudioBoxPropertyClockDeviceList"),

  // Device
  (kAudioDevicePropertyConfigurationApplication, "kAudioDevicePropertyConfigurationApplication"),
  (kAudioDevicePropertyDeviceUID, "kAudioDevicePropertyDeviceUID"),
  (kAudioDevicePropertyModelUID, "kAudioDevicePropertyModelUID"),
  (kAudioDevicePropertyTransportType, "kAudioDevicePropertyTransportType"),
  (kAudioDevicePropertyRelatedDevices, "kAudioDevicePropertyRelatedDevices"),
  (kAudioDevicePropertyClockDomain, "kAudioDevicePropertyClockDomain"),
  (kAudioDevicePropertyDeviceIsAlive, "kAudioDevicePropertyDeviceIsAlive"),
  (kAudioDevicePropertyDeviceIsRunning, "kAudioDevicePropertyDeviceIsRunning"),
  (kAudioDevicePropertyDeviceCanBeDefaultDevice, "kAudioDevicePropertyDeviceCanBeDefaultDevice"),
  (kAudioDevicePropertyDeviceCanBeDefaultSystemDevice, "kAudioDevicePropertyDeviceCanBeDefaultSystemDevice"),
  (kAudioDevicePropertyLatency, "kAudioDevicePropertyLatency"),
  (kAudioDevicePropertyStreams, "kAudioDevicePropertyStreams"),
  (kAudioObjectPropertyControlList, "kAudioObjectPropertyControlList"),
  (kAudioDevicePropertySafetyOffset, "kAudioDevicePropertySafetyOffset"),
  (kAudioDevicePropertyNominalSampleRate, "kAudioDevicePropertyNominalSampleRate"),
  (kAudioDevicePropertyAvailableNominalSampleRates, "kAudioDevicePropertyAvailableNominalSampleRates"),
  (kAudioDevicePropertyIcon, "kAudioDevicePropertyIcon"),
  (kAudioDevicePropertyIsHidden, "kAudioDevicePropertyIsHidden"),
  (kAudioDevicePropertyPreferredChannelsForStereo, "kAudioDevicePropertyPreferredChannelsForStereo"),
  (kAudioDevicePropertyPreferredChannelLayout, "kAudioDevicePropertyPreferredChannelLayout"),

  // Custom EQMDevice Properties
  (kEQMDeviceCustomPropertyShown, "kEQMDeviceCustomPropertyShown"),
  (kEQMDeviceCustomPropertyLatency, "kEQMDeviceCustomPropertyLatency"),
  (kEQMDeviceCustomPropertyVersion, "kEQMDeviceCustomPropertyVersion"),

  // Clock Device
  (kAudioClockDevicePropertyDeviceUID, "kAudioClockDevicePropertyDeviceUID"),
  (kAudioClockDevicePropertyTransportType, "kAudioClockDevicePropertyTransportType"),
  (kAudioClockDevicePropertyClockDomain, "kAudioClockDevicePropertyClockDomain"),
  (kAudioClockDevicePropertyDeviceIsAlive, "kAudioClockDevicePropertyDeviceIsAlive"),
  (kAudioClockDevicePropertyDeviceIsRunning, "kAudioClockDevicePropertyDeviceIsRunning"),
  (kAudioClockDevicePropertyLatency, "kAudioClockDevicePropertyLatency"),
  (kAudioClockDevicePropertyControlList, "kAudioClockDevicePropertyControlList"),
  (kAudioClockDevicePropertyNominalSampleRate, "kAudioClockDevicePropertyNominalSampleRate"),
  (kAudioClockDevicePropertyAvailableNominalSampleRates, "kAudioClockDevicePropertyAvailableNominalSampleRates"),

  // End Point Device
  (kAudioEndPointDevicePropertyComposition, "kAudioEndPointDevicePropertyComposition"),
  (kAudioEndPointDevicePropertyEndPointList, "kAudioEndPointDevicePropertyEndPointList"),
  (kAudioEndPointDevicePropertyIsPrivate, "kAudioEndPointDevicePropertyIsPrivate"),

  // Stream
  (kAudioStreamPropertyIsActive, "kAudioStreamPropertyIsActive"),
  (kAudioStreamPropertyDirection, "kAudioStreamPropertyDirection"),
  (kAudioStreamPropertyTerminalType, "kAudioStreamPropertyTerminalType"),
  (kAudioStreamPropertyStartingChannel, "kAudioStreamPropertyStartingChannel"),
  (kAudioStreamPropertyLatency, "kAudioStreamPropertyLatency"),
  (kAudioStreamPropertyVirtualFormat, "kAudioStreamPropertyVirtualFormat"),
  (kAudioStreamPropertyAvailableVirtualFormats, "kAudioStreamPropertyAvailableVirtualFormats"),
  (kAudioStreamPropertyPhysicalFormat, "kAudioStreamPropertyPhysicalFormat"),
  (kAudioStreamPropertyAvailablePhysicalFormats, "kAudioStreamPropertyAvailablePhysicalFormats"),

  // Control
  (kAudioControlPropertyScope, "kAudioControlPropertyScope"),
  (kAudioControlPropertyElement, "kAudioControlPropertyElement"),
  (kAudioSliderControlPropertyValue, "kAudioSliderControlPropertyValue"),
  (kAudioSliderControlPropertyRange, "kAudioSliderControlPropertyRange"),
  (kAudioLevelControlPropertyScalarValue, "kAudioLevelControlPropertyScalarValue"),
  (kAudioLevelControlPropertyDecibelValue, "kAudioLevelControlPropertyDecibelValue"),
  (kAudioLevelControlPropertyDecibelRange, "kAudioLevelControlPropertyDecibelRange"),
  (kAudioLevelControlPropertyConvertScalarToDecibels, "kAudioLevelControlPropertyConvertScalarToDecibels"),
  (kAudioLevelControlPropertyConvertDecibelsToScalar, "kAudioLevelControlPropertyConvertDecibelsToScalar"),
  (kAudioBooleanControlPropertyValue, "kAudioBooleanControlPropertyValue"),
  (kAudioSelectorControlPropertyCurrentItem, "kAudioSelectorControlPropertyCurrentItem"),
  (kAudioSelectorControlPropertyAvailableItems, "kAudioSelectorControlPropertyAvailableItems"),
  (kAudioSelectorControlPropertyItemName, "kAudioSelectorControlPropertyItemName"),
  (kAudioSelectorControlPropertyItemKind, "kAudioSelectorControlPropertyItemKind"),
  (kAudioStereoPanControlPropertyValue, "kAudioStereoPanControlPropertyValue"),
  (kAudioStereoPanControlPropertyPanningChannels, "kAudioStereoPanControlPropertyPanningChannels")
]
