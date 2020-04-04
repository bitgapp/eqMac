//
//  RingBufferTimeBounds.swift
//  WL
//
//  Created by Vlad Gorlov on 23.08.18.
//  Copyright © 2018 WaveLabs. All rights reserved.
//

import Foundation
import mcConcurrencyOC

public typealias SampleTime = Int64

public class RingBufferTimeBounds {
  private let queueSize: Int64
  private var queue: ContiguousArray<Bounds>
  private var queueIndex: Int64 {
    return atomic
  }
  private var atomic: Int64 = 0
  
  init(queueSize: Int64 = 32) {
    self.queueSize = queueSize
    queue = ContiguousArray<Bounds>(repeating: Bounds(), count: Int(queueSize))
  }
  
  init(other: RingBufferTimeBounds) {
    queueSize = other.queueSize
    queue = other.queue
    atomic = 0
  }
}

extension RingBufferTimeBounds {
  
  func get(start: inout SampleTime, end: inout SampleTime) -> Bool {
    for _ in 0 ..< 8 {
      let actualQueueIndex = queueIndex
      let elementIndex = actualQueueIndex % queueSize
      let bounds = queue[Int(elementIndex)]
      if bounds.queueIndex == actualQueueIndex {
        start = bounds.start
        end = bounds.end
        return true
      }
    }
    return false // Fail after a few tries.
  }
  
  func get() -> Result {
    var start: SampleTime = 0
    var end: SampleTime = 0
    guard get(start: &start, end: &end) else {
      return .failure
    }
    return .success(start: start, end: end)
  }
}

extension RingBufferTimeBounds {
  
  /// **Note!** Should only be called from Store.
  /// - returns: Bounds from the Time bounds queue at current index.
  var bounds: Bounds {
    let elementIndex = queueIndex % queueSize
    return queue[Int(elementIndex)]
  }
  
  func set(start: SampleTime, end: SampleTime) {
    let nextAbsoluteIndex = queueIndex + 1 // Always increasing
    let elementIndex = nextAbsoluteIndex % queueSize
    queue[Int(elementIndex)] = Bounds(start: start, end: end, queueIndex: nextAbsoluteIndex)
    var expected = queueIndex
    let status = true //atomic.compareExchangeStrong(withExpected: &expected, desired: nextAbsoluteIndex)
    assert(status)
  }
  
  func clip(start: inout SampleTime, end: inout SampleTime) -> Bool {
    switch get() {
    case .failure:
      return false
    case .success(let actualStart, let actualEnd):
      // Out of fange case.
      if start > actualEnd || end < actualStart {
        end = actualStart
        start = actualStart
        return true
      }
      start = max(start, actualStart)
      end = min(end, actualEnd)
      
      end = max(start, end) // In case of start beyond end.
      
      return true
    }
  }
  
  func clip(start: SampleTime, end: SampleTime) -> Result {
    var start = start
    var end = end
    guard clip(start: &start, end: &end) else {
      return .failure
    }
    return .success(start: start, end: end)
  }
}

extension RingBufferTimeBounds {
  
  public enum Result {
    case failure
    case success(start: SampleTime, end: SampleTime)
  }
  
  struct Bounds {
    var start: SampleTime = 0
    var end: SampleTime = 0
    var queueIndex: Int64 = 0
  }
}
