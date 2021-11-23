

public protocol IntRepresentable {
  var intValue: Int { get }
}

public protocol Int32Representable {
  var int32Value: Int32 { get }
}

public protocol Int64Representable {
  var int64Value: Int64 { get }
}

public protocol UIntRepresentable {
  var uintValue: UInt { get }
}

public protocol UInt32Representable {
  var uint32Value: UInt32 { get }
}

public protocol UInt64Representable {
  var uint64Value: UInt64 { get }
}

public protocol FloatRepresentable {
  var floatValue: Float { get }
}

public protocol DoubleRepresentable {
  var doubleValue: Double { get }
}

// region MARK: Implementations

extension Int: UInt32Representable, DoubleRepresentable, Int32Representable {
  public var uint32Value: UInt32 {
    return UInt32(self)
  }
  
  
  public var doubleValue: Double {
    return Double(self)
  }
  
  public var int32Value: Int32 {
    return Int32(self)
  }
}

extension Int32: UInt32Representable {
  public var uint32Value: UInt32 {
    return UInt32(self)
  }
}

extension Int64: DoubleRepresentable {
  public var doubleValue: Double {
    return Double(self)
  }
}

extension UInt: IntRepresentable, UInt32Representable {
  public var intValue: Int {
    return Int(self)
  }
  
  public var uint32Value: UInt32 {
    return UInt32(self)
  }
}

extension UInt32: IntRepresentable, Int32Representable, UIntRepresentable, DoubleRepresentable {
  public var intValue: Int {
    return Int(self)
  }
  
  public var int32Value: Int32 {
    return Int32(self)
  }
  
  public var uintValue: UInt {
    return UInt(self)
  }
  
  public var doubleValue: Double {
    return Double(self)
  }
  
  init (from array: [UInt8]) {
    let bigEndianValue = array.withUnsafeBufferPointer {
      ($0.baseAddress!.withMemoryRebound(to: UInt32.self, capacity: 1) { $0 })
    }.pointee
    let value = UInt32(bigEndian: bigEndianValue)
    self = value
  }
}

extension UInt64: DoubleRepresentable, Int64Representable {
  public var doubleValue: Double {
    return Double(self)
  }
  
  public var int64Value: Int64 {
    return Int64(self)
  }
}

extension Float: IntRepresentable {
  
  
  public var intValue: Int {
    return Int(self)
  }
}

extension Double: FloatRepresentable, Int64Representable, UInt64Representable {
  public func remap (inMin: Double, inMax: Double, outMin: Double, outMax: Double) -> Double {
    return (self - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }

  public var floatValue: Float {
    return Float(self)
  }
  
  public var int64Value: Int64 {
    return Int64(self)
  }
  
  public var uint64Value: UInt64 {
    return UInt64(self)
  }
}

extension Comparable {
  public func clamp <T: Comparable> (min minimum: T, max maximum: T) -> T {
    return min(maximum, max(minimum, self as! T))
  }
}

// endregion
