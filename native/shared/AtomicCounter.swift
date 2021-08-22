//
//  AtomicCounter.swift
//  eqMac
//
//  Created by Romans Kisils on 20/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation

struct AtomicCounter<T: FixedWidthInteger> {
  private let serialQueue: DispatchQueue
  
  private var _value: T
  var value: T {
    get {
      return self.serialQueue.sync {
        self._value
      }
    }
    set {
      self.serialQueue.sync {
        self._value = newValue
      }
    }
  }
  
  init(_ initialValue: T = 0) {
    self._value = initialValue
    let uuid = CFUUIDCreateString(nil, CFUUIDCreate(nil)) as String
    self.serialQueue = DispatchQueue(label: "eqMac.AtomicCounter.\(uuid)")
  }
  
  mutating func increment() {
    self.serialQueue.sync {
      guard self._value < T.max else { return }
      self._value += 1
    }
  }
  
  mutating func decrement() {
    self.serialQueue.sync {
      guard self._value > T.min else { return }
      self._value -= 1
    }
  }
}
