//
//  RingBufferOffsets.swift
//  WL
//
//  Created by Vlad Gorlov on 23.08.18.
//  Copyright © 2018 WaveLabs. All rights reserved.
//

import Foundation

class RingBufferOffsets {
  let timeBounds: RingBufferTimeBounds
  
  private(set) var numberOfElements: SampleTime
  
  init(numberOfElements: SampleTime) {
    timeBounds = RingBufferTimeBounds()
    self.numberOfElements = numberOfElements
  }
  
  init(other: RingBufferOffsets) {
    numberOfElements = other.numberOfElements
    timeBounds = RingBufferTimeBounds(other: other.timeBounds)
  }
}

extension RingBufferOffsets {
  
  func resize(numberOfElements newNumberOfElements: SampleTime) {
    let difference = numberOfElements - newNumberOfElements
    if difference > 0 {
      let bounds = timeBounds.bounds
      var newStart = bounds.start + difference
      newStart = min(newStart, bounds.end)
      timeBounds.set(start: newStart, end: bounds.end)
    }
    numberOfElements = newNumberOfElements
  }
  
  func store(framesToWrite: SampleTime, startWrite: SampleTime,
             storeProcedure: (UpdateProcedure) -> Void, zeroProcedure: (ZeroProcedure) -> Void) -> RingBufferError {
    
    if framesToWrite == 0 {
      return .noError
    }
    
    if framesToWrite > numberOfElements {
      return .tooMuch
    }
    
    let endWrite = startWrite + framesToWrite
    
    // Adjusting bounds.
    do {
      if startWrite < timeBounds.bounds.end {
        // Going backwards, throw everything out
        timeBounds.set(start: startWrite, end: startWrite)
      } else if endWrite - timeBounds.bounds.start <= numberOfElements {
        // The buffer has not yet wrapped and will not need to
      } else {
        // Advance the start time past the region we are about to overwrite
        let newStart = endWrite - numberOfElements // One buffer of time behind where we're writing
        let newEnd = max(newStart, timeBounds.bounds.end)
        timeBounds.set(start: newStart, end: newEnd)
      }
    }
    
    let curEnd = timeBounds.bounds.end
    var offset0: SampleTime
    var offset1: SampleTime
    if startWrite > curEnd {
      // We are skipping some samples, so zero the range we are skipping
      offset0 = curEnd % numberOfElements
      offset1 = startWrite % numberOfElements
      if offset0 < offset1 {
        zeroProcedure(ZeroProcedure(offset: offset0, numberOfElements: offset1 - offset0))
      } else {
        zeroProcedure(ZeroProcedure(offset: offset0, numberOfElements: numberOfElements - offset0))
        zeroProcedure(ZeroProcedure(offset: 0, numberOfElements: offset1))
      }
      offset0 = offset1
    } else {
      offset0 = startWrite % numberOfElements
    }
    
    offset1 = endWrite % numberOfElements
    if offset0 < offset1 {
      storeProcedure(UpdateProcedure(sourceOffset: 0, destinationOffset: offset0, numberOfElements: offset1 - offset0))
    } else {
      let numOfElements = numberOfElements - offset0
      storeProcedure(UpdateProcedure(sourceOffset: 0, destinationOffset: offset0, numberOfElements: numOfElements))
      storeProcedure(UpdateProcedure(sourceOffset: numOfElements, destinationOffset: 0, numberOfElements: offset1))
    }
    
    // Updating the end time
    timeBounds.set(start: timeBounds.bounds.start, end: endWrite)
    
    return .noError
  }
  
  func fetch(framesToRead: SampleTime, startRead: SampleTime,
             fetchProcedure: (UpdateProcedure) -> Void, zeroProcedure: (ZeroProcedure) -> Void) -> RingBufferError {
    
    if framesToRead == 0 {
      return .noError
    }
    
    var location = Location(start: max(0, startRead), length: framesToRead)
    let originalLocation = Location(location: location)
    
    if timeBounds.clip(start: &location.start, end: &location.end) == false {
      return .cpuOverload
    }
    
    // Out of range case.
    if location.isEmpty {
      zeroProcedure(ZeroProcedure(offset: 0, numberOfElements: framesToRead))
      return .noError
    }
    
    let destinationOffset = max(0, location.start - originalLocation.start)
    if destinationOffset > 0 {
      let procedure = ZeroProcedure(offset: 0, numberOfElements: min(framesToRead, destinationOffset))
      zeroProcedure(procedure)
    }
    
    let destEndSize = max(0, originalLocation.end - location.end)
    if destEndSize > 0 {
      let procedure = ZeroProcedure(offset: destinationOffset + location.length, numberOfElements: destEndSize)
      zeroProcedure(procedure)
    }
    
    let indexes = Location(start: location.start % numberOfElements, end: location.end % numberOfElements)
    var numOfElements: SampleTime = 0
    
    if indexes.start < indexes.end {
      numOfElements = indexes.length
      fetchProcedure(UpdateProcedure(sourceOffset: indexes.start, destinationOffset: destinationOffset,
                                     numberOfElements: numOfElements))
    } else {
      numOfElements = numberOfElements - indexes.start
      let procedure = UpdateProcedure(sourceOffset: indexes.start, destinationOffset: destinationOffset,
                                      numberOfElements: numOfElements)
      fetchProcedure(procedure)
      if indexes.end > 0 {
        let procedure = UpdateProcedure(sourceOffset: 0, destinationOffset: destinationOffset + numOfElements,
                                        numberOfElements: indexes.end)
        fetchProcedure(procedure)
        numOfElements += indexes.end
      }
    }
    
    // FIXME: Do we really need to update mDataByteSize?.
    //      let ablPointer = UnsafeMutableAudioBufferListPointer(abl)
    //      for channel in 0..<ablPointer.count {
    //         var dest = ablPointer[channel]
    //         if dest.mData != nil {
    // FIXME: This should be in sync with AVAudioPCMBuffer (Vlad Gorlov, 2016-06-12).
    //            dest.mDataByteSize = UInt32(numberOfElements)
    //         }
    //      }
    
    return .noError
  }
}

extension RingBufferOffsets {
  
  struct UpdateProcedure {
    let sourceOffset: SampleTime
    let destinationOffset: SampleTime
    let numberOfElements: SampleTime
  }
  
  struct ZeroProcedure {
    let offset: SampleTime
    let numberOfElements: SampleTime
  }
  
  struct Location {
    
    var start: SampleTime
    var end: SampleTime
    
    init(start: SampleTime, end: SampleTime) {
      self.start = start
      self.end = end
    }
    
    init(start: SampleTime, length: SampleTime) {
      self.start = start
      end = start + length
    }
    
    init(location: Location) {
      start = location.start
      end = location.end
    }
    
    var length: SampleTime {
      return end - start
    }
    
    var isEmpty: Bool {
      return end == start
    }
  }
}
