//
//  EQMObject.swift
//  eqMac
//
//  Created by Romans Kisils on 21/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

protocol EQMObject: class {
  static func hasProperty (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func isPropertySettable (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> Bool
  static func getPropertyDataSize (objectID: AudioObjectID?, address: AudioObjectPropertyAddress) -> UInt32?
  static func getPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress, inData: UnsafeRawPointer?) -> EQMObjectProperty?
  static func setPropertyData (objectID: AudioObjectID?, address: AudioObjectPropertyAddress, data: UnsafeRawPointer, changedProperties: inout [AudioObjectPropertyAddress]) -> OSStatus
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
  
  func write(to address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>, requestedSize: UInt32?) {
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
      
    case .objectIDList(let data):           self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .customPropertyInfoList(let data): self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .streamDescriptionList(let data):  self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .valueRangeList(let data):         self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .integerList(let data):            self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    }
  }
  
  
  private func write<T>(element: T, address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>) {
    // Write data size
    size.pointee = UInt32(MemoryLayout.size(ofValue: element))
    // Write data
    address?.assumingMemoryBound(to: T.self).pointee = element
  }
  
  private func write<T: Any>(array arr: ContiguousArray<T>, address: UnsafeMutableRawPointer?, size: UnsafeMutablePointer<UInt32>, requestedSize: UInt32?) {
    var array = arr
    let elementSize = sizeof(ContiguousArray<T>.Element.self)

    if requestedSize != nil {
      let requestedCount = Int(requestedSize! / elementSize)
      array = ContiguousArray(array[0..<requestedCount])
      log("Data Count: \(arr.count) - Data Size: \(UInt32(arr.count) * elementSize) - Requested Size: \(requestedSize!) - Resulting Count: \(array.count) - Resulting Size: \(UInt32(array.count) * elementSize)")
    }
    
    let totalSize = UInt32(array.count) * elementSize
    
    // Write data size
    size.pointee = totalSize
    
    // Write data
    guard let address = address, totalSize > 0 else {
      return
    }
    var currentAddress = address.assumingMemoryBound(to: ContiguousArray<T>.Element.self)
    for element in array {
      currentAddress.pointee = element
      currentAddress = currentAddress.advanced(by: 1)
    }
  }
}
