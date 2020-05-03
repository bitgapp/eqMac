//
//  BasicEqualizerDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 24/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyJSON

class BasicEqualizerDataBus: DataBus {
  
  var state: BasicEqualizerState {
    return Application.store.state.effects.equalizers.basic
  }
  
  required init (route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/presets") { data, _ in
      return JSON(BasicEqualizer.presets.map { $0.dictionary })
    }
    
    self.on(.GET, "/presets/selected") { data, _ in
      let preset = BasicEqualizer.getPreset(id: self.state.selectedPresetId)
      Console.log(preset)
      return JSON(preset!.dictionary)
    }
    
    self.on(.POST, "/presets") { data, _ in
      let gains = try self.getGains(data)
      let peakLimiter = data["peakLimiter"] as? Bool ?? false
      if let id = data["id"] as? String {
        // Update
        if (BASIC_EQUALIZER_DEFAULT_PRESETS.keys.contains(id)) {
          throw "Default Presets aren't updatable."
        }
        BasicEqualizer.updatePreset(id: id, peakLimiter: peakLimiter, gains: gains)
        let select = data["select"] as? Bool
        if select == true {
          let transition = data["transition"] as? Bool
          Application.dispatchAction(BasicEqualizerAction.selectPreset(id, transition ?? false))
        }
        return "Basic Equalizer Preset has been updated"
      } else {
        // Create
        let name = data["name"] as? String
        if (name == nil) {
          throw "Invalid 'name' parameter, must be a String"
        }
        let preset = BasicEqualizer.createPreset(name: name!, peakLimiter: peakLimiter, gains: gains)
        let select = data["select"] as? Bool
        if select == true {
          let transition = data["transition"] as? Bool
          Application.dispatchAction(BasicEqualizerAction.selectPreset(preset.id, transition ?? false))
        }
        return JSON(preset.dictionary)
      }
      
    }
    
    self.on(.POST, "/presets/select") { data, _ in
      let preset = try self.getPreset(data)
      Application.dispatchAction(BasicEqualizerAction.selectPreset(preset.id, true))
      return "Basic Equalizer Preset has been set."
      
    }
    
    self.on(.DELETE, "/presets") { data, _ in
      let preset = try self.getPreset(data)
      if (preset.isDefault) {
        throw "Default Presets aren't removable."
      }
      
      BasicEqualizer.deletePreset(preset)
      Application.dispatchAction(BasicEqualizerAction.selectPreset("flat", true))
      return "Basic Equalizer Preset has been deleted."
    }
  }
  
  private func getPreset (_ data: JSON?) throws -> BasicEqualizerPreset {
    let id = data["id"] as? String
    if id == nil {
      throw "Please provide a preset ID"
    }
    if let preset = BasicEqualizer.getPreset(id: id!) {
      return preset
    } else {
      throw "Could not find Preset with this ID"
    }
  }
  
  private func getGains (_ data: JSON?) throws -> BasicEqualizerPresetGains {
    if let gains = data["gains"] as? Dictionary<String, Double> {
      for band in ["bass", "mid", "treble"]  {
        if !(-24.0...24.0).contains(gains[band] ?? 9000) {
          throw "Invalid value in 'gains' parameter, " + String(band) + " must between -24.0 and 24.0"
        }
      }
      return BasicEqualizerPresetGains(
        bass: gains["bass"]!,
        mid: gains["mid"]!,
        treble: gains["treble"]!
      )
    } else {
      throw "Invalid 'gains' parameter, must be an object"
    }
  }
}
