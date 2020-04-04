//
//  RingBuffer.swift
//  WaveLabs
//
//  Created by Vlad Gorlov on 31.05.16.
//  Copyright © 2016 WaveLabs. All rights reserved.
//

import CoreAudio

public protocol DefaultInitializerType {
  init()
}

extension Float: DefaultInitializerType {}
extension Int32: DefaultInitializerType {}
extension Int: DefaultInitializerType {}
extension Double: DefaultInitializerType {}

public enum RingBufferError: Int {
  
  case noError = 0
  
  /// Fetch start time is earlier than buffer start time and fetch end time is later than buffer end time
  case tooMuch
  
  /// The reader is unable to get enough CPU cycles to capture a consistent snapshot of the time bounds
  case cpuOverload
}

public final class RingBuffer<T: DefaultInitializerType> {
  public private(set) var numberOfBuffers: Int
  public private(set) var numberOfElements: Int
  
  private var maxNumberOfElements: Int = 0
  let offsets: RingBufferOffsets
  
  private let bytesPerFrame: SampleTime = SampleTime(MemoryLayout<T>.stride)
  private var buffer: UnsafeMutablePointer<T>
  
  /// - parameter numberOfBuffers: Number of channels (non-interleaved).
  /// - parameter numberOfElements: Capacity per every channel.
  public init(numberOfBuffers: Int, numberOfElements: Int) {
    self.numberOfBuffers = numberOfBuffers
    self.numberOfElements = numberOfElements
    offsets = RingBufferOffsets(numberOfElements: Int64(numberOfElements))
    maxNumberOfElements = Int(Double(numberOfElements) * 1.5) // Reserving capacity.
    let capacity = maxNumberOfElements * numberOfBuffers
    buffer = UnsafeMutablePointer<T>.allocate(capacity: capacity)
    buffer.initialize(repeating: T(), count: capacity)
  }
  
  public convenience init(numberOfChannels: Int, capacityFrames: Int) {
    self.init(numberOfBuffers: numberOfChannels, numberOfElements: capacityFrames)
  }
  
  public convenience init() {
    self.init(numberOfBuffers: 0, numberOfElements: 0)
  }
  
  private init(other: RingBuffer) {
    numberOfBuffers = other.numberOfBuffers
    numberOfElements = other.numberOfElements
    maxNumberOfElements = other.maxNumberOfElements
    offsets = RingBufferOffsets(other: other.offsets)
    let capacity = maxNumberOfElements * numberOfBuffers
    buffer = UnsafeMutablePointer<T>.allocate(capacity: capacity)
    buffer.initialize(from: other.buffer, count: capacity)
  }
  
  deinit {
    buffer.deallocate()
  }
}

extension RingBuffer {
  
  /// Number of allocated elements in buffer for all channels.
  private var bufferLength: Int {
    return numberOfBuffers * maxNumberOfElements
  }
  
  /// Buffer pointer just for debug purpose.
  var bufferPointer: UnsafeMutableBufferPointer<T> {
    return UnsafeMutableBufferPointer(start: buffer, count: bufferLength)
  }
  
  public func clone() -> RingBuffer {
    return RingBuffer(other: self)
  }
  
  public func getTimeBounds() -> RingBufferTimeBounds.Result {
    return offsets.timeBounds.get()
  }
  
  /// Copy framesToWrite of data into the ring buffer at the specified sample time.
  /// The sample time should normally increase sequentially, though gaps
  /// are filled with zeroes. A sufficiently large gap effectively empties
  /// the buffer before storing the new data.
  /// If startWrite is less than the previous frame number, the behavior is undefined.
  /// Return false for failure (buffer not large enough).
  /// - parameter abl: Source AudioBufferList.
  /// - parameter framesToWrite: Frames to write.
  /// - parameter startWrite: Absolute time.
  /// - returns: Operation status code.
  public func store(_ abl: UnsafePointer<AudioBufferList>,
                    framesToWrite: SampleTime, startWrite: SampleTime) -> RingBufferError {
    return offsets.store(framesToWrite: framesToWrite, startWrite: startWrite, storeProcedure: { info in
      store(from: abl, into: buffer, info: info)
    }, zeroProcedure: { info in
      zero(info: info)
    })
  }
  
  public func fetch(_ abl: UnsafeMutablePointer<AudioBufferList>,
                    framesToRead: SampleTime, startRead: SampleTime) -> RingBufferError {
    return offsets.fetch(framesToRead: framesToRead, startRead: startRead, fetchProcedure: { info in
      fetch(into: abl, from: buffer, info: info)
    }, zeroProcedure: { info in
      zero(abl: abl, info: info)
    })
  }
  
  @discardableResult
  public func sizeToFitCapacity() -> Bool {
    return resize(numberOfElements: maxNumberOfElements)
  }
  
  @discardableResult
  public func resize(numberOfElements: Int) -> Bool {
    if self.numberOfElements != numberOfElements {
      offsets.resize(numberOfElements: SampleTime(numberOfElements))
      let result = reserveCapacity(newNumberOfElements: numberOfElements)
      self.numberOfElements = numberOfElements
      return result
    }
    return false
  }
  
  @discardableResult
  public func resize(numberOfBuffers: Int) -> Bool {
    if self.numberOfBuffers != numberOfBuffers {
      let result = reserveCapacity(newNumberOfBuffers: numberOfBuffers)
      self.numberOfBuffers = numberOfBuffers
      return result
    }
    return false
  }
  
  @discardableResult
  public func resize(numberOfBuffers: Int, numberOfElements: Int) -> Bool {
    var isUpdated = resize(numberOfBuffers: numberOfBuffers)
    isUpdated = resize(numberOfElements: numberOfElements) || isUpdated
    return isUpdated
  }
  
  @discardableResult
  public func reserveCapacity(numberOfElements: Int) -> Bool {
    if numberOfElements > self.numberOfElements {
      let result = reserveCapacity(newNumberOfElements: numberOfElements)
      return result
    }
    return false
  }
  
  @discardableResult
  public func reserveCapacity(numberOfBuffers: Int) -> Bool {
    if numberOfBuffers > self.numberOfBuffers {
      let result = reserveCapacity(newNumberOfBuffers: numberOfBuffers)
      return result
    }
    return false
  }
  
  @discardableResult
  public func reserveCapacity(numberOfBuffers: Int, numberOfElements: Int) -> Bool {
    var isUpdated = reserveCapacity(numberOfBuffers: numberOfBuffers)
    isUpdated = reserveCapacity(numberOfElements: numberOfElements) || isUpdated
    return isUpdated
  }
}

// MARK: - Private

extension RingBuffer {
  
  private func reserveCapacity(newNumberOfElements: Int) -> Bool {
    var isUpdated = false
    if newNumberOfElements > maxNumberOfElements {
      isUpdated = true
      let newMaxNumberOfElements = Int(Double(newNumberOfElements) * 1.5) // Reserving capacity.
      let capacity = numberOfBuffers * newMaxNumberOfElements
      let newBuffer = UnsafeMutablePointer<T>.allocate(capacity: capacity)
      newBuffer.initialize(repeating: T(), count: capacity)
      for index in 0 ..< numberOfBuffers {
        let positionRead = buffer.advanced(by: index * maxNumberOfElements)
        let positionWrite = newBuffer.advanced(by: index * newMaxNumberOfElements)
        positionWrite.moveInitialize(from: positionRead, count: numberOfElements)
      }
      buffer.deallocate()
      buffer = newBuffer
      maxNumberOfElements = newMaxNumberOfElements
    } else if newNumberOfElements < numberOfElements {
      isUpdated = true
      let lengthDifference = numberOfElements - newNumberOfElements
      for index in 0 ..< numberOfBuffers {
        let positionRead = buffer.advanced(by: index * maxNumberOfElements + lengthDifference)
        let positionWrite = buffer.advanced(by: index * maxNumberOfElements)
        positionWrite.moveInitialize(from: positionRead, count: newNumberOfElements)
      }
      // FIXME: Check and restore deinitialization routine.
      // let numberOfElementsToDeinitialize = numberOfElements - newNumberOfElements
      // for index in 0 ..< numberOfBuffers {
      //    let position = buffer.advanced(by: index * numberOfElements + newNumberOfElements)
      //    position.deinitialize(count: numberOfElementsToDeinitialize)
      // }
    }
    return isUpdated
  }
  
  private func reserveCapacity(newNumberOfBuffers: Int) -> Bool {
    var isUpdated = false
    if newNumberOfBuffers > numberOfBuffers {
      isUpdated = true
      let capacity = newNumberOfBuffers * maxNumberOfElements
      let newBuffer = UnsafeMutablePointer<T>.allocate(capacity: capacity)
      newBuffer.initialize(repeating: T(), count: capacity)
      newBuffer.moveInitialize(from: buffer, count: bufferLength)
      buffer.deallocate()
      buffer = newBuffer
    } else if numberOfBuffers < newNumberOfBuffers {
      isUpdated = true
      let numberOfBuffersToDeinitialize = numberOfBuffers - newNumberOfBuffers
      let position = buffer.advanced(by: newNumberOfBuffers * maxNumberOfElements)
      position.deinitialize(count: numberOfBuffersToDeinitialize * maxNumberOfElements)
    }
    return isUpdated
  }
  
  private func store(from abl: UnsafePointer<AudioBufferList>, into buffer: UnsafeMutablePointer<T>,
                     info: RingBufferOffsets.UpdateProcedure) {
    
    let bufferList = UnsafeMutableAudioBufferListPointer(unsafePointer: abl)
    let numOfChannels = max(bufferList.count, numberOfBuffers)
    for channel in 0 ..< numOfChannels {
      guard channel < numberOfBuffers else { // Ring buffer has less channels than input buffer
        continue
      }
      let positionWrite = buffer.advanced(by: Int(info.destinationOffset) + channel * maxNumberOfElements)
      
      if channel < bufferList.count {
        let channelBuffer = bufferList[channel]
        guard let channelBufferData = channelBuffer.mData else {
          continue
        }
        assert(channelBuffer.mNumberChannels == 1) // Supporting non interleaved channels at the moment
        let channelData = channelBufferData.assumingMemoryBound(to: T.self)
        
        let channelCapacity = SampleTime(channelBuffer.mDataByteSize) / bytesPerFrame
        if info.sourceOffset > channelCapacity {
          continue
        }
        
        let positionRead = channelData.advanced(by: Int(info.sourceOffset))
        let numberOfElements = min(info.numberOfElements, channelCapacity - info.sourceOffset)
        positionWrite.assign(from: positionRead, count: Int(numberOfElements))
      } else {
        // ABL has less channels than expected. So we filling buffer with zeroes.
        positionWrite.initialize(repeating: T(), count: Int(info.numberOfElements))
      }
    }
  }
  
  private func fetch(into abl: UnsafeMutablePointer<AudioBufferList>, from buffer: UnsafeMutablePointer<T>,
                     info: RingBufferOffsets.UpdateProcedure) {
    
    let bufferList = UnsafeMutableAudioBufferListPointer(abl)
    for channel in 0 ..< bufferList.count {
      let channelBuffer = bufferList[channel]
      guard let channelBufferData = channelBuffer.mData else {
        continue
      }
      assert(channelBuffer.mNumberChannels == 1) // Supporting non interleaved channels at the moment
      let channelData = channelBufferData.assumingMemoryBound(to: T.self)
      
      let channelCapacity = SampleTime(channelBuffer.mDataByteSize) / bytesPerFrame
      if info.destinationOffset > channelCapacity {
        continue
      }
      
      let positionWrite = channelData.advanced(by: Int(info.destinationOffset))
      let numberOfElements = min(info.numberOfElements, channelCapacity - info.destinationOffset)
      if channel < numberOfBuffers { // Ring buffer has less channels than output buffer
        let positionRead = buffer.advanced(by: Int(info.sourceOffset) + channel * maxNumberOfElements)
        positionWrite.assign(from: positionRead, count: Int(numberOfElements))
      } else {
        positionWrite.initialize(repeating: T(), count: Int(numberOfElements))
      }
    }
  }
  
  private func zero(abl: UnsafeMutablePointer<AudioBufferList>, info: RingBufferOffsets.ZeroProcedure) {
    let bufferList = UnsafeMutableAudioBufferListPointer(abl)
    for channel in 0 ..< bufferList.count {
      let channelBuffer = bufferList[channel]
      guard let channelBufferData = channelBuffer.mData else {
        continue
      }
      let channelData = channelBufferData.assumingMemoryBound(to: T.self)
      assert(channelBuffer.mNumberChannels == 1) // Supporting non interleaved channels at the moment
      
      let channelCapacity = SampleTime(channelBuffer.mDataByteSize) / bytesPerFrame
      if info.offset > channelCapacity {
        continue
      }
      
      let positionWrite = channelData.advanced(by: Int(info.offset))
      let numberOfElements = min(info.numberOfElements, channelCapacity - info.offset)
      positionWrite.initialize(repeating: T(), count: Int(numberOfElements))
    }
  }
  
  private func zero(info: RingBufferOffsets.ZeroProcedure) {
    assert(Int(info.offset + info.numberOfElements) <= numberOfElements)
    for channel in 0 ..< numberOfBuffers {
      let positionWrite = buffer.advanced(by: Int(info.offset) + channel * maxNumberOfElements)
      positionWrite.initialize(repeating: T(), count: Int(info.numberOfElements))
    }
  }
}

// MARK: -

extension RingBuffer: CustomReflectable {
  
  public var customMirror: Mirror {
    var children: [(String?, Any)] = [("numberOfBuffers", numberOfBuffers), ("numberOfElements", numberOfElements)]
    switch offsets.timeBounds.get() {
    case .failure:
      break
    case .success(let start, let end):
      children += [("timeBounds", "\(start) ... \(end) [\(end - start)]")]
    }
    return Mirror(self, children: children)
  }
}
