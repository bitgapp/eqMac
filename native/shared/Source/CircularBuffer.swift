import CoreAudio
import Atomics

public protocol CircularBufferType { init() }
extension Float: CircularBufferType {}
extension Int32: CircularBufferType {}
extension Int: CircularBufferType {}
extension Double: CircularBufferType {}


public enum CircularBufferError {
  case noError
  case tooMuch
  case cpuOverload
}

public class CircularBuffer<T: CircularBufferType> {
  private(set) var channelCount: Int
  private(set) var capacity: Int
  private let timeBounds: CircularBufferTimeBounds
  private let bytesPerFrame: Int64 = Int64(MemoryLayout<T>.stride)
  private var buffer: UnsafeMutablePointer<T>

  public init(channelCount: Int, capacity: Int) {
    self.channelCount = channelCount
    self.capacity = capacity
    timeBounds = CircularBufferTimeBounds()
    let bufferLength = channelCount * capacity
    buffer = UnsafeMutablePointer<T>.allocate(capacity: bufferLength)
    buffer.initialize(repeating: T(), count: bufferLength)
  }
  
  // Number of allocated elements in buffer for all channels.
  private var bufferLength: Int {
    return channelCount * capacity
  }
  
  // Buffer pointer just for debug purpose.
  var bufferPointer: UnsafeMutableBufferPointer<T> {
    return UnsafeMutableBufferPointer(start: buffer, count: bufferLength)
  }

  public func write(from abl: UnsafePointer<AudioBufferList>,
             start: Int64, end: Int64) -> CircularBufferError {
    let toWrite = end - start

    if toWrite == 0 { return .noError }
    if toWrite > capacity { return .tooMuch }

    // Adjusting bounds.
    do {
      if start < timeBounds.bounds.end {
        // Going backwards, throw everything out
        timeBounds.set(start: start, end: start)
      } else if end - timeBounds.bounds.start <= capacity {
        // The buffer has not yet wrapped and will not need to
      } else {
        // Advance the start time past the region we are about to overwrite
        let newStart = end - Int64(capacity) // One buffer of time behind where we're writing
        let newEnd = max(newStart, timeBounds.bounds.end)
        timeBounds.set(start: newStart, end: newEnd)
      }
    }

    let last = timeBounds.bounds.end
    var offset0: Int64
    var offset1: Int64
    if start > last {
      // We are skipping some samples, so zero the range we are skipping
      offset0 = last % Int64(capacity)
      offset1 = start % Int64(capacity)
      if offset0 < offset1 {
        zero(offset: offset0, count: offset1 - offset0)
      } else {
        zero(offset: offset0, count: Int64(capacity) - offset0)
        zero(offset: 0, count: offset1)
      }
      offset0 = offset1
    } else {
      offset0 = start % Int64(capacity)
    }

    offset1 = end % Int64(capacity)

    if offset0 < offset1 {
      store(source: abl, sourceOffset: 0, offset: offset0, count: offset1 - offset0)
    } else {
      let count = Int64(capacity) - offset0
      store(source: abl, sourceOffset: 0, offset: offset0, count: count)
      store(source: abl, sourceOffset: count, offset: 0, count: offset1)
    }

    // Updating the end time
    timeBounds.set(start: timeBounds.bounds.start, end: end)

    return .noError
  }

  private func store (source abl: UnsafePointer<AudioBufferList>, sourceOffset: Int64, offset: Int64, count: Int64) {
    let bufferList = UnsafeMutableAudioBufferListPointer(UnsafeMutablePointer(mutating: abl))
    let numOfChannels = max(bufferList.count, channelCount)
    for channel in 0 ..< numOfChannels {
      guard channel < channelCount else { // Ring buffer has less channels than input buffer
        continue
      }
      let positionWrite = buffer.advanced(by: Int(offset) + channel * capacity)

      if channel < bufferList.count {
        let channelBuffer = bufferList[channel]
        guard let channelBufferData = channelBuffer.mData else {
          continue
        }
        assert(channelBuffer.mNumberChannels == 1) // Supporting non interleaved channels at the moment
        let channelData = channelBufferData.assumingMemoryBound(to: T.self)

        let channelCapacity = Int64(channelBuffer.mDataByteSize) / bytesPerFrame
        if sourceOffset > channelCapacity {
          continue
        }

        let positionRead = channelData.advanced(by: Int(sourceOffset))
        let numberOfElements = min(count, channelCapacity - sourceOffset)
        positionWrite.assign(from: positionRead, count: Int(numberOfElements))
      } else {
        // ABL has less channels than expected. So we filling buffer with zeroes.
        positionWrite.initialize(repeating: T(), count: Int(capacity))
      }
    }
  }

  private struct Location {
    var start: Int64
    var end: Int64

    init(start: Int64, end: Int64) {
      self.start = start
      self.end = end
    }

    init(start: Int64, length: Int64) {
      self.start = start
      end = start + length
    }

    init(location: Location) {
      start = location.start
      end = location.end
    }

    var length: Int64 {
      return end - start
    }

    var isEmpty: Bool {
      return end == start
    }
  }

  public func read(into abl: UnsafeMutablePointer<AudioBufferList>,
            from: Int64, to: Int64) -> CircularBufferError {

    let count = to - from
    if count == 0 { return .noError }

    var location = Location(start: max(0, from), length: count)
    let originalLocation = Location(location: location)

    if timeBounds.clip(start: &location.start, end: &location.end) == false {
      return .cpuOverload
    }

    // Out of range case.
    if location.isEmpty {
      zero(offset: 0, count: count)
      return .noError
    }

    let destinationOffset = max(0, location.start - originalLocation.start)
    if destinationOffset > 0 {
      zero(offset: 0, count: min(count, destinationOffset))
    }

    let destEndSize = max(0, originalLocation.end - location.end)
    if destEndSize > 0 {
      zero(offset: destinationOffset + location.length, count: destEndSize)
    }

    let indexes = Location(start: location.start % Int64(capacity), end: location.end % Int64(capacity))
    var numOfElements: Int64 = 0

    if indexes.start < indexes.end {
      numOfElements = indexes.length
      fetch(into: abl, sourceOffset: indexes.start, offset: destinationOffset,
                                     count: numOfElements)
    } else {
      numOfElements = Int64(capacity) - indexes.start
      fetch(into: abl, sourceOffset: indexes.start, offset: destinationOffset, count: numOfElements)
      if indexes.end > 0 {
        fetch(into: abl, sourceOffset: 0, offset: destinationOffset + numOfElements, count: indexes.end)
        numOfElements += indexes.end
      }
    }

    return .noError
  }

  private func fetch (
    into abl: UnsafeMutablePointer<AudioBufferList>,
    sourceOffset: Int64,
    offset: Int64,
    count: Int64
  ) {
    let bufferList = UnsafeMutableAudioBufferListPointer(abl)
    for channel in 0 ..< bufferList.count {
      let channelBuffer = bufferList[channel]
      guard let channelBufferData = channelBuffer.mData else {
        continue
      }
      assert(channelBuffer.mNumberChannels == 1) // Suterleaved channels at the moment
      let channelData = channelBufferData.assumingMemoryBound(to: T.self)

      let channelCapacity = Int64(channelBuffer.mDataByteSize) / bytesPerFrame
      if offset > channelCapacity {
        continue
      }

      let positionWrite = channelData.advanced(by: Int(offset))
      let numberOfElements = min(count, channelCapacity - offset)
      if channel < channelCount { // Ring buffer has less channels than output buffer
        let positionRead = buffer.advanced(by: Int(sourceOffset) + channel * capacity)
        positionWrite.assign(from: positionRead, count: Int(numberOfElements))
      } else {
        positionWrite.initialize(repeating: T(), count: Int(numberOfElements))
      }
    }
  }

  func zero(offset: Int64, count: Int64) {
    assert(Int(offset + count) <= capacity)
    for channel in 0 ..< channelCount {
      let positionWrite = buffer.advanced(by: Int(offset) + channel * capacity)
      positionWrite.initialize(repeating: T(), count: Int(count))
    }
  }

  deinit {
    buffer.deallocate()
  }

}

fileprivate class CircularBufferTimeBounds {
   private let queueSize: Int64
   private var queue: ContiguousArray<Bounds>
   private var queueIndex: Int64 {
    return atomic.load(ordering: .relaxed)
   }

   private var atomic = ManagedAtomic<Int64>(0)

   init(queueSize: Int64 = 32) {
      self.queueSize = queueSize
      queue = ContiguousArray<Bounds>(repeating: Bounds(), count: Int(queueSize))
   }

   func get(start: inout Int64, end: inout Int64) -> Bool {
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
      var start: Int64 = 0
      var end: Int64 = 0
      guard get(start: &start, end: &end) else {
         return .failure
      }
      return .success(start: start, end: end)
   }

   /// **Note!** Should only be called from Store.
   /// - returns: Bounds from the Time bounds queue at current index.
   var bounds: Bounds {
      let elementIndex = queueIndex % queueSize
      return queue[Int(elementIndex)]
   }

   func set(start: Int64, end: Int64) {
      let nextAbsoluteIndex = queueIndex + 1 // Always increasing
      let elementIndex = nextAbsoluteIndex % queueSize
      queue[Int(elementIndex)] = Bounds(start: start, end: end, queueIndex: nextAbsoluteIndex)
      let expected = queueIndex
//      let status = atomic.compareExchangeStrong(withExpected: &expected, desired: nextAbsoluteIndex)
      let status = atomic.compareExchange(expected: expected, desired: nextAbsoluteIndex, ordering: .relaxed)
      assert(status.exchanged)
   }

   func clip(start: inout Int64, end: inout Int64) -> Bool {
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

   func clip(start: Int64, end: Int64) -> Result {
      var start = start
      var end = end
      guard clip(start: &start, end: &end) else {
         return .failure
      }
      return .success(start: start, end: end)
   }

   enum Result {
      case failure
      case success(start: Int64, end: Int64)
   }

   struct Bounds {
      var start: Int64 = 0
      var end: Int64 = 0
      var queueIndex: Int64 = 0
   }
}
