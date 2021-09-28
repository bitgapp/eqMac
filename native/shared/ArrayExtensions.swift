//
// ArrayExtensions.swift
// eqMac
//
// Created by Roman Kisil on 14/02/2018.
// Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

extension Array {
  func split() -> [[Element]] {
    let ct = self.count
    let half = ct / 2
    let leftSplit = self[0 ..< half]
    let rightSplit = self[half ..< ct]
    return [Array(leftSplit), Array(rightSplit)]
  }

  static func isArray (data: Any) -> Bool {
    if data is [Any] {
      return true
    }

    if data is [AnyObject] {
      return true
    }

    if data is NSArray {
      return true
    }

    return false
  }
}

extension Array where Element: Any {
  @discardableResult mutating func removeEveryOther () -> [Element] {
    self = self.enumerated().filter({ index, _ in
        index % 2 != 0
    }).map { $0.1 }
    return self
  }
}




