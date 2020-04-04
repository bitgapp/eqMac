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
  let numberOfBands: Int!
  var eqs: [AVAudioUnitEQ] = []
  var globalGain: Double {
    get {
      return Double(eqs[0].globalGain)
    }
    set {
      eqs[0].globalGain = Float(newValue)
    }
  }
  
  var gains: [Double] {
    var gains: [Double] = []
    for eq in eqs {
      for band in eq.bands {
        gains.append(Double(band.gain))
      }
    }
    return gains
  }
  
  init (numberOfBands: Int) {
    self.numberOfBands = numberOfBands
    let numberOfEQs = Int(ceil(Double(numberOfBands) / 16))
    let remainder = numberOfBands % 16
    for i in 1...numberOfEQs {
      let eq = AVAudioUnitEQ(numberOfBands: i == numberOfEQs ? remainder : 16)
      eq.globalGain = 0
      for band in eq.bands {
        band.filterType = .parametric
        band.bandwidth = 0.5
        band.bypass = false
      }
      eqs.append(eq)
    }
  }
  
  func getFrequency (index: Int) -> Double {
    return Double(getBandFromIndex(index: index)!.frequency)
  }
  
  func setFrequency (index: Int, frequency: Double) {
    let band = getBandFromIndex(index: index)
    band!.frequency = Float(frequency)
  }
  
  func getGain (index: Int) -> Double {
    return Double(getBandFromIndex(index: index)!.gain)
  }
  
  func setGain (index: Int, gain: Double) {
    let band = getBandFromIndex(index: index)
    band!.gain = Float(gain)
  }
  
  override func enabledDidSet() {
    for eq in eqs {
      eq.bypass = !enabled
    }
  }
  
  private func getBandFromIndex (index: Int) -> AVAudioUnitEQFilterParameters? {
    if (index >= numberOfBands) {
      Console.log("Trying to get out of bounds AppleEqualizer Band")
      return nil
    }
    let eqIndex = Int(floor(Double(index / 16)))
    let bandIndex = index % 16
    return eqs[eqIndex].bands[bandIndex]
  }
}
