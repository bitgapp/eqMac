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
  case null (Void? = nil)
  case audioClassID(AudioClassID)
  case audioObjectID(AudioObjectID)
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
  
  func write(to address: UnsafeMutableRawPointer, size: UnsafeMutablePointer<UInt32>, requestedSize: UInt32) -> OSStatus {
    switch self {
    case .null(_):
      return self.write(element: NSNull(), address: address, size: size, requestedSize: requestedSize)
    case .bool(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .string(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .float32(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .float64(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .url(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .integer(let data),
         .scope(let data),
         .element(let data),
         .audioClassID(let data),
         .audioObjectID(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
      
    case .streamDescription(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .channelLayout(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
    case .valueRange(let data):
      return self.write(element: data, address: address, size: size, requestedSize: requestedSize)
      
    case .objectIDList(let data):
      return self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .customPropertyInfoList(let data):
      return self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .streamDescriptionList(let data):
      return self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .valueRangeList(let data):
      return self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    case .integerList(let data):
      return self.write(array: data, address: address, size: size, requestedSize: requestedSize)
    }
  }
  
  private func write<T>(element: T, address: UnsafeMutableRawPointer, size: UnsafeMutablePointer<UInt32>, requestedSize: UInt32) -> OSStatus {

    guard T.self != NSNull.self else {
      size.pointee = 0
      return noErr
    }

    let outSize = sizeof(T.self)

    guard requestedSize == outSize else {
      log("​🚫​ Requested Size: \(requestedSize) != Out Size: \(outSize) (\(T.self))")
      return kAudioHardwareBadPropertySizeError
    }

    size.pointee = outSize
    address.assumingMemoryBound(to: T.self).pointee = element

    return noErr
  }

  private func write<T: Any>(array arr: ContiguousArray<T>, address: UnsafeMutableRawPointer, size: UnsafeMutablePointer<UInt32>, requestedSize: UInt32) -> OSStatus {
    var array = arr
    let elementSize = sizeof(ContiguousArray<T>.Element.self)

    let requestedCount = Int(requestedSize / elementSize)
    array = ContiguousArray(array[0..<requestedCount])
//    log("Data Count: \(arr.count) - Data Size: \(UInt32(arr.count) * elementSize) - Requested Size: \(requestedSize) - Resulting Count: \(array.count) - Resulting Size: \(UInt32(array.count) * elementSize)")

    let totalSize = UInt32(array.count) * elementSize
    
    // Write data size
    size.pointee = totalSize
    
    // Write data
    guard totalSize > 0 else {
      return noErr
    }

    var currentAddress = address.assumingMemoryBound(to: ContiguousArray<T>.Element.self)
    for element in array {
      currentAddress.pointee = element
      currentAddress = currentAddress.advanced(by: 1)
    }

    return noErr
  }
}
