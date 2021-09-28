//
//  AdvancedEqualizer.swift
//  eqMac
//
//  Created by Roman Kisil on 06/01/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import EmitterKit
import SwiftyUserDefaults

class AdvancedEqualizer: Equalizer, StoreSubscriber {
  static let frequencies: [Double] = [32, 64, 125, 250, 500, 1_000, 2_000, 4_000, 8_000, 16_000]
  
  static let defaultPresets: [AdvancedEqualizerPreset] = ADVANCED_EQUALIZER_DEFAULT_PRESETS.map { preset in
    let (name, bands) = preset
    return AdvancedEqualizerPreset(
      id: (name as String).camelCasedString,
      name: name,
      isDefault: true,
      gains: AdvancedEqualizerPresetGains(global: 0, bands: bands)
    )
  }
  
  static var userPresets: [AdvancedEqualizerPreset] {
    get {
      return Storage[.advancedEqualizerPresets] ?? []
    }
    set (newPresets) {
      Storage[.advancedEqualizerPresets] = newPresets
      presetsChanged.emit(presets)
    }
  }
  
  static var presets: [AdvancedEqualizerPreset] {
    get {
      var presets: [AdvancedEqualizerPreset] = self.userPresets
      let hasManual = presets.contains { $0.id == "manual" }
      if (!hasManual) {
        presets.append(AdvancedEqualizerPreset(
          id: "manual",
          name: "Manual",
          isDefault: true,
          gains: AdvancedEqualizerPresetGains(
            global: 0,
            bands: Array(repeating: 0, count: 10)
          )
        ))
      }
      if (Application.store.state.effects.equalizers.advanced.showDefaultPresets) {
        presets += self.defaultPresets
      } else {
        let flatPreset = self.defaultPresets.first { $0.id == "flat" }
        presets.append(flatPreset!)
      }
      
      return presets
    }
  }
  
  static func getPreset (id: String) -> AdvancedEqualizerPreset? {
    return self.presets.first(where: { $0.id == id })
  }
  
  static func createPreset (name: String, gains: AdvancedEqualizerPresetGains) -> AdvancedEqualizerPreset {
    let preset = AdvancedEqualizerPreset(
      id: UUID().uuidString,
      name: name,
      isDefault: false,
      gains: gains
    )
    self.userPresets.append(preset)
    presetsChanged.emit(presets)
    return preset
  }
  
  static func updatePreset (id: String, gains: AdvancedEqualizerPresetGains) {
    var presets = self.userPresets
    if var preset = self.getPreset(id: id) {
      preset = AdvancedEqualizerPreset(id: id, name: preset.name, isDefault: false, gains: gains)
      presets.removeAll(where: { $0.id == preset.id })
      presets.append(preset)
      self.userPresets = presets
      presetsChanged.emit(presets)
    }
    
  }
  
  static func deletePreset (_ preset: AdvancedEqualizerPreset) {
    self.userPresets.removeAll(where: { $0.id == preset.id })
    presetsChanged.emit(presets)
  }
  
  static var presetsChanged = Event<[AdvancedEqualizerPreset]>()
  var selectedPresetChanged = Event<AdvancedEqualizerPreset>()
  
  var transition = false
  
  var selectedPreset: AdvancedEqualizerPreset = AdvancedEqualizer.getPreset(id: "flat")! {
    didSet {
      if (transition) {
        Transition.perform(from: globalGain, to: selectedPreset.gains.global) { gainStep in
          self.globalGain = gainStep
        }
      } else {
        globalGain = selectedPreset.gains.global
      }
      for (index, gain) in selectedPreset.gains.bands.enumerated() {
        if (transition) {
          Transition.perform(from: getGain(index: index), to: gain) { gainStep in
            self.setGain(index: index, gain: gainStep)
          }
        } else {
          setGain(index: index, gain: gain)
        }
      }
      selectedPresetChanged.emit(selectedPreset)
    }
  }
  
  var state: AdvancedEqualizerState {
    return Application.store.state.effects.equalizers.advanced
  }
  
  init () {
    Console.log("Creating Advanced Equalizer")
    
    super.init(numberOfBands: AdvancedEqualizer.frequencies.count)
    
    for (index, frequency) in AdvancedEqualizer.frequencies.enumerated() {
      setFrequency(index: index, frequency: frequency)
    }
    
    if let preset = AdvancedEqualizer.getPreset(id: self.state.selectedPresetId) {
      ({ self.selectedPreset = preset })()
    }
    setupStateListener()
  }
  
  func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.effects.equalizers.advanced }
    }
  }
  
  func newState(state: AdvancedEqualizerState) {
    if let preset = AdvancedEqualizer.getPreset(id: state.selectedPresetId) {
      if (selectedPreset.id != state.selectedPresetId || selectedPreset.gains != preset.gains) {
        transition = state.transition
        selectedPreset = preset
      }
    }
    
  }
  typealias StoreSubscriberStateType = AdvancedEqualizerState
  
  deinit {
    Application.store.unsubscribe(self)
  }
}
