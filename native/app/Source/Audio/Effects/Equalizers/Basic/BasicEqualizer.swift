//
//  BasicEqualizer.swift
//  eqMac
//
//  Created by Roman Kisil on 14/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import EmitterKit
import AVFoundation
import AMCoreAudio

let BasicEqualizerDefaultPresets: [BasicEqualizerPreset] = []
class BasicEqualizer: Equalizer, StoreSubscriber {
  
  static let defaultPresets: [BasicEqualizerPreset] = BASIC_EQUALIZER_DEFAULT_PRESETS.map { preset in
    let (name, gains) = preset
    return BasicEqualizerPreset(
      id: (name as String).camelCasedString,
      name: name,
      isDefault: true,
      peakLimiter: false,
      gains: gains
    )
  }
  
  static var userPresets: [BasicEqualizerPreset] {
    get {
      return Storage[.basicEqualizerPresets] ?? []
    }
    set (newPresets) {
      Storage[.basicEqualizerPresets] = newPresets
      presetsChanged.emit(presets)
    }
  }
  
  static var presets: [BasicEqualizerPreset] {
    get {
      var presets: [BasicEqualizerPreset] = self.userPresets
      let hasManual = presets.contains { $0.id == "manual" }
      if (!hasManual) {
        presets.append(BasicEqualizerPreset(
          id: "manual",
          name: "Manual",
          isDefault: true,
          peakLimiter: false,
          gains: BasicEqualizerPresetGains(bass: 0, mid: 0, treble: 0)
        ))
      }
      
      presets += self.defaultPresets
      return presets
    }
  }
  
  static func getPreset (id: String) -> BasicEqualizerPreset? {
    return self.presets.first(where: { $0.id == id })
  }
  
  static func createPreset (name: String, peakLimiter: Bool, gains: BasicEqualizerPresetGains) -> BasicEqualizerPreset {
    let preset = BasicEqualizerPreset(
      id: UUID().uuidString,
      name: name,
      isDefault: false,
      peakLimiter: peakLimiter,
      gains: gains
    )
    self.userPresets.append(preset)
    return preset
  }
  
  static func updatePreset (id: String, peakLimiter: Bool, gains: BasicEqualizerPresetGains) {
    var presets = self.userPresets
    if var preset = self.getPreset(id: id) {
      preset = BasicEqualizerPreset(
        id: id, name:
        preset.name,
        isDefault: false,
        peakLimiter: peakLimiter,
        gains: gains
      )
      presets.removeAll(where: { $0.id == preset.id })
      presets.append(preset)
      self.userPresets = presets
    }
    
  }
  
  static func deletePreset (_ preset: BasicEqualizerPreset) {
    self.userPresets.removeAll(where: { $0.id == preset.id })
  }
  
  var transition = false
  
  var selectedPreset: BasicEqualizerPreset = BasicEqualizer.getPreset(id: "flat")! {
    didSet {
      self.peakLimiter = selectedPreset.peakLimiter

      if (transition) {
        Transition.perform(from: bassGain, to: selectedPreset.gains.bass) { gain in
          self.bassGain = gain
        }
        
        Transition.perform(from: midGain, to: selectedPreset.gains.mid) { gain in
          self.midGain = gain
        }
        
        Transition.perform(from: trebleGain, to: selectedPreset.gains.treble) { gain in
          self.trebleGain = gain
        }
      } else {
        bassGain = selectedPreset.gains.bass
        midGain = selectedPreset.gains.mid
        trebleGain = selectedPreset.gains.treble
      }
      selectedPresetChanged.emit(selectedPreset)
    }
  }
  
  private let frequencies: [Double] = [32, 64, 125, 250, 500, 1_000, 2_000, 4_000, 8_000, 16_000]
  
  // MARK: - Events
  static var presetsChanged = EmitterKit.Event<[BasicEqualizerPreset]>()
  var selectedPresetChanged = EmitterKit.Event<BasicEqualizerPreset>()
  
  // MARK: - Properties
  var bassGain: Double = 0 {
    didSet {
      setGain(index: 0, gain: bassGain)
      setGain(index: 1, gain: bassGain)
      setGain(index: 2, gain: bassGain)
    }
  }
  
  var midGain: Double! = 0 {
    didSet {
      setGain(index: 3, gain: midGain)
      setGain(index: 4, gain: midGain)
      setGain(index: 5, gain: midGain)
      setGain(index: 6, gain: midGain)
    }
  }
  var trebleGain: Double! = 0 {
    didSet {
      setGain(index: 7, gain: trebleGain)
      setGain(index: 8, gain: trebleGain)
      setGain(index: 9, gain: trebleGain)
    }
  }
  
  var peakLimiter = false
  
  
  override func setGain (index: Int, gain: Double) {
    super.setGain(index: index, gain: gain)
    if (peakLimiter) {
      let highestGain = gains.max()!
      if (highestGain > 0) {
        globalGain = -highestGain
      } else {
        globalGain = 0
      }
    } else {
      globalGain = 0
    }
  }
  
  var selectedPresetId: String? = nil
  
  var state: BasicEqualizerState {
    return Application.store.state.effects.equalizers.basic
  }
  
  // MARK: - Initialization
  init () {
    Console.log("Creating Basic Equalizer")
    super.init(numberOfBands: frequencies.count)
    for (index, frequency) in frequencies.enumerated() {
      setFrequency(index: index, frequency: Double(frequency))
    }
    if let preset = BasicEqualizer.getPreset(id: self.state.selectedPresetId) {
      ({ self.selectedPreset = preset })()
    }
    setupStateListener()
  }
  
  // MARK: - State
  typealias StoreSubscriberStateType = BasicEqualizerState
  
  func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      return subscription.select { state in state.effects.equalizers.basic }
    }
  }
  
  func newState(state: BasicEqualizerState) {
    if let preset = BasicEqualizer.getPreset(id: state.selectedPresetId) {
      if (selectedPreset.id != preset.id || selectedPreset.gains != preset.gains || selectedPreset.peakLimiter != preset.peakLimiter ) {
        transition = state.transition
        selectedPreset = preset
      }
    }
  }
}

