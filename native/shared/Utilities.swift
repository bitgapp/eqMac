//
// Utilities.swift
// eqMac
//
// Created by Nodeful on 15/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation

func sizeof <T> (_ type: T.Type) -> UInt32 {
  return UInt32(MemoryLayout<T>.stride)
}

func sizeof <T> (_ value: T) -> UInt32 {
  return UInt32(MemoryLayout.size(ofValue: value))
}

func clamp <T: Comparable> (value: T, min minimum: T, max maximum: T) -> T {
  return min(maximum, max(minimum, value))
}

func mapValue(value: Double, inMin: Double, inMax: Double, outMin: Double, outMax: Double) -> Double {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

func getValueFromInfoPlist (_ key: String) -> String {
  return Bundle.main.infoDictionary![key] as! String
}

func delay (_ milliseconds: UInt, completion: @escaping () -> ()) {
  DispatchQueue.main.asyncAfter(deadline: .now() + Double(milliseconds) / 1000) { completion() }
}

// Loopable allows to dynamically get static properties of a class/struct
protocol Loopable {
  var properties: [String: Any] { get }
}

extension Loopable {
  var properties: [String: Any] {
    var result: [String: Any] = [:]
    let mirror = Mirror(reflecting: self)

    for (property, value) in mirror.children {
      guard let property = property else {
        continue
      }

      result[property] = value
    }

    return result
  }
}
