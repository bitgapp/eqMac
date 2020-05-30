//
//  AppleEqualizer.swift
//  eqMac
//
//  Created by Roman Kisil on 14/01/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation
import AVFoundation

class Equalizer: Effect {
  var eq: AVAudioUnitEQ
  var globalGain: Double {
    get {
      return Double(eq.globalGain)
    }
    set {
      eq.globalGain = Float(newValue)
    }
  }
  
  var gains: [Double] {
    var gains: [Double] = []
    for band in eq.bands {
      gains.append(Double(band.gain))
    }
    return gains
  }
  
  init (numberOfBands: Int) {
    eq = AVAudioUnitEQ(numberOfBands: numberOfBands)
    eq.globalGain = 0
    for band in eq.bands {
      band.filterType = .parametric
      band.bandwidth = 0.5
      band.bypass = false
    }
  }
  
  func getFrequency (index: Int) -> Double {
    return Double(eq.bands[index].frequency)
  }
  
  func setFrequency (index: Int, frequency: Double) {
    let band = eq.bands[index]
    band.frequency = Float(frequency)
  }
  
  func getGain (index: Int) -> Double {
    return Double(eq.bands[index].gain)
  }
  
  func setGain (index: Int, gain: Double) {
    let band = eq.bands[index]
    band.gain = Float(gain)
  }
  
  override func enabledDidSet() {
    eq.bypass = !enabled
  }
}
