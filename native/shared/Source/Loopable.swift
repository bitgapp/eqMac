//
//  File.swift
//  
//
//  Created by Romans Kisils on 23/11/2021.
//

import Foundation

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
