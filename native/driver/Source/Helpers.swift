//
//  Misc.swift
//  eqMac
//
//  Created by Nodeful on 16/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

protocol EQMObjectProtocol {
  static func hasProperty (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func isPropertySettable (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func getPropertyDataSize (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> UInt32?
  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> EQMObjectProperty?
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

  /// Writes the property and the property's size to memory
  ///
  /// - Parameters:
  ///   - address: A pointer to the address for the property data to be written to.
  ///   - size: A pointer to the address for the property size to be written to.
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
      //print("Wrote", array.count, "Elements of", self, "(size only)")
      return
    }
    var currentAddress = address.assumingMemoryBound(to: T.Element.self)
    for element in array {
      currentAddress.pointee = element
      currentAddress = currentAddress.advanced(by: 1)
    }
  }
}
