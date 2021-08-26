import Foundation

let kMinVolumeDB: Float32 = -96
let kMaxVolumeDB: Float32 = 0

class Volume {
  static func toDecibel (_ volume: Float32) -> Float32 {
    if (volume <= powf(10.0, kMinVolumeDB / 20.0)) {
      return kMinVolumeDB
    } else {
      return 20.0 * log10f(volume)
    }
  }

  static func fromDecibel (_ decibel: Float32) -> Float32 {
    if (decibel <= kMinVolumeDB) {
      return 0.0
    } else {
      return powf(10.0, decibel / 20.0)
    }
  }

  static func toScalar (_ volume: Float32) -> Float32 {
    let decibel = toDecibel(volume);
    return (decibel - kMinVolumeDB) / (kMaxVolumeDB - kMinVolumeDB);
  }

  static func fromScalar (_ scalar: Float32) -> Float32 {
    let decibel = scalar * (kMaxVolumeDB - kMinVolumeDB) + kMinVolumeDB
    return fromDecibel(decibel)
  }
}

func clamp <T: Comparable> (value: T, min minimum: T, max maximum: T) -> T {
  return min(maximum, max(minimum, value))
}


Volume.fromScalar(0.1)
Volume.fromDecibel(-96)
Volume.toDecibel(0.1)
Volume.toScalar(0.2)

clamp(value: 0.1, min: 0, max: 1)
