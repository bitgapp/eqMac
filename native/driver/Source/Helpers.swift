//
//  Misc.swift
//  eqMac
//
//  Created by Nodeful on 16/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

// MARK: - Protocols, Enums

protocol EQMObjectProtocol {
  static func hasProperty (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func isPropertySettable (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func getPropertyDataSize (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> UInt32?
  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> EQMObjectProperty?
  static func setPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress, data: UnsafeRawPointer) -> OSStatus
}

enum EQMObjectProperty {
  // Primitives
  case audioClassID(AudioClassID)
  case bool(CFBoolean)
  case string(CFString)
  case integer(UInt32)
  case float32(Float32)
  case float64(Float64)
  case url(CFURL)
  case scope(AudioObjectPropertyScope)
  case element(AudioObjectPropertyElement)

  // Structs
  case streamDescription(AudioStreamBasicDescription)
  case channelLayout(AudioChannelLayout)
  case valueRange(AudioValueRange)

  // Arrays
  case objectIDList(ContiguousArray<AudioObjectID>)
  case customPropertyInfoList(ContiguousArray<AudioServerPlugInCustomPropertyInfo>)
  case streamDescriptionList(ContiguousArray<AudioStreamRangedDescription>)
  case valueRangeList(ContiguousArray<AudioValueRange>)
  case integerList(ContiguousArray<UInt32>)

  func write(to address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>) {
    switch self {
    case .bool(let data):                   self.write(element: data, address: address, size: size)
    case .string(let data):                 self.write(element: data, address: address, size: size)
    case .float32(let data):                self.write(element: data, address: address, size: size)
    case .float64(let data):                self.write(element: data, address: address, size: size)
    case .url(let data):                    self.write(element: data, address: address, size: size)
    case .integer(let data),
         .scope(let data),
         .element(let data),
         .audioClassID(let data):           self.write(element: data, address: address, size: size)

    case .streamDescription(let data):      self.write(element: data, address: address, size: size)
    case .channelLayout(let data):          self.write(element: data, address: address, size: size)
    case .valueRange(let data):             self.write(element: data, address: address, size: size)

    case .objectIDList(let data):           self.write(array: data, address: address, size: size)
    case .customPropertyInfoList(let data): self.write(array: data, address: address, size: size)
    case .streamDescriptionList(let data):  self.write(array: data, address: address, size: size)
    case .valueRangeList(let data):         self.write(array: data, address: address, size: size)
    case .integerList(let data):            self.write(array: data, address: address, size: size)
    }
  }


  private func write<T>(element: T, address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>) {
    // Write data size
    size.pointee = UInt32(MemoryLayout.size(ofValue: element))
    // Write data
    address?.assumingMemoryBound(to: T.self).pointee = element
  }

  private func write<T: Collection>(array: T, address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>) {
    // Write data size
    size.pointee = UInt32(array.count) * sizeof(T.Element.self)

    // Write data
    guard let address = address else {
      return
    }
    var currentAddress = address.assumingMemoryBound(to: T.Element.self)
    for element in array {
      currentAddress.pointee = element
      currentAddress = currentAddress.advanced(by: 1)
    }
  }
}

// MARK: - Pure Functions

func volumeToDecibel (_ volume: Float32) -> Float32 {
  if (volume <= powf(10.0, kMinVolumeDB / 20.0)) {
    return kMinVolumeDB
  } else {
    return 20.0 * log10f(volume)
  }
}

func decibelToVolume (_ decibel: Float32) -> Float32 {
  if (decibel <= kMinVolumeDB) {
    return 0.0
  } else {
    return powf(10.0, decibel / 20.0)
  }
}

func volumeToScalar (_ volume: Float32) -> Float32 {
  let decibel = volumeToDecibel(volume);
  return (decibel - kMinVolumeDB) / (kMaxVolumeDB - kMinVolumeDB);
}

func scalarToVolume (_ scalar: Float32) -> Float32 {
  let decibel = scalar * (kMaxVolumeDB - kMinVolumeDB) + kMinVolumeDB
  return decibelToVolume(decibel)
}

func clamp <T: Comparable> (value val: T, min: T, max: T) -> T {
  var value = val
  if value < min {
    value = min
  } else if value > min {
    value = max
  }
  return value
}

// MARK: - Extensions
