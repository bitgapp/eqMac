//
//  VolumeConverter.swift
//  eqMac
//
//  Created by Nodeful on 10/09/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation

public class VolumeConverter {
  public static func toDecibel (_ volume: Float32) -> Float32 {
    if (volume <= powf(10.0, kMinVolumeDB / 20.0)) {
      return kMinVolumeDB
    } else {
      return 20.0 * log10f(volume)
    }
  }

  public static func fromDecibel (_ decibel: Float32) -> Float32 {
    if (decibel <= kMinVolumeDB) {
      return 0.0
    } else {
      return powf(10.0, decibel / 20.0)
    }
  }

  public static func toScalar (_ volume: Float32) -> Float32 {
    let decibel = toDecibel(volume);
    return (decibel - kMinVolumeDB) / (kMaxVolumeDB - kMinVolumeDB);
  }

  public static func fromScalar (_ scalar: Float32) -> Float32 {
    let decibel = scalar * (kMaxVolumeDB - kMinVolumeDB) + kMinVolumeDB
    return fromDecibel(decibel)
  }

  public static func toRelative (_ volume: Float32) -> Float32 {
    if volume == 0 { return 0 }
    return exp(4 * volume - 4)
  }
}

