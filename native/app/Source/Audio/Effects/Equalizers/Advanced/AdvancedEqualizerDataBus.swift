//
//  AdvancedEqualizerDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 24/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import Foundation
import SwiftyJSON
import EmitterKit

class AdvancedEqualizerDataBus: DataBus {
  
  var state: AdvancedEqualizerState {
    return Application.store.state.effects.equalizers.advanced
  }
  var presetsChangedListener: EventListener<[AdvancedEqualizerPreset]>?
  
  required init (route: String, bridge: Bridge) {
    super.init(
      route: route,
      bridge: bridge
    )
    
    self.on(.GET, "/settings/show-default-presets") { _, _ in
      return [ "show": self.state.showDefaultPresets ]
    }
    
    self.on(.POST, "/settings/show-default-presets") { data, _ in
      let show = data["show"] as? Bool
      if (show == nil) {
        throw "Invalid 'show' parameter. Must be a boolean."
      }
      
      Application.dispatchAction(AdvancedEqualizerAction.setShowDefaultPresets(show!))
      
      return "Launch on Startup has been set"
    }
    
    self.on(.GET, "/presets") { _, _ in
      return JSON(AdvancedEqualizer.presets.map { $0.dictionary })
    }
    
    self.on(.GET, "/presets/selected") { _, _ in
      let preset = AdvancedEqualizer.getPreset(id: self.state.selectedPresetId)
      return JSON(preset!.dictionary)
    }
    
    self.on(.POST, "/presets") { data, _ in
      let gains = try self.getGains(data)
      if let id = data["id"] as? String {
        // Update
        if (ADVANCED_EQUALIZER_DEFAULT_PRESETS.keys.contains(id)) {
          throw "Default Presets aren't updatable."
        }
        AdvancedEqualizer.updatePreset(id: id, gains: gains)
        let select = data["select"] as? Bool
        if select == true {
          let transition = data["transition"] as? Bool
          Application.dispatchAction(AdvancedEqualizerAction.selectPreset(id, transition ?? false))
        }
        return "Advanced Equalizer Preset has been updated"
      } else {
        // Create
        let name = data["name"] as? String
        if (name == nil) {
          throw "Invalid 'name' parameter, must be a String"
        }
        let preset = AdvancedEqualizer.createPreset(name: name!, gains: gains)
        let select = data["select"] as? Bool
        if select == true {
          let transition = data["transition"] as? Bool
          Application.dispatchAction(AdvancedEqualizerAction.selectPreset(preset.id, transition ?? false))
        }
        return JSON(preset.dictionary)
      }
      
    }
    
    self.on(.POST, "/presets/select") { data, _ in
      let preset = try self.getPreset(data)
      Application.dispatchAction(AdvancedEqualizerAction.selectPreset(preset.id, true))
      return "Advanced Equalizer Preset has been set."
    }
    
    self.on(.DELETE, "/presets") { data, _ in
      let preset = try self.getPreset(data)
      if (preset.isDefault) {
        throw "Default Presets aren't removable."
      }
      
      AdvancedEqualizer.deletePreset(preset)
      Application.dispatchAction(AdvancedEqualizerAction.selectPreset("flat", true))
      return "Advanced Equalizer Preset has been deleted."
      
    }
    
    self.on(.GET, "/presets/export") { data, res in
      File.save(extensions: ["json"]) { file in
        if file != nil {
          let presets = JSON(AdvancedEqualizer.userPresets.map { $0.dictionary })
          let json = presets.rawString()!
          do {
            try json.write(to: file!, atomically: true, encoding: .utf8)
            res.send("Presets exported")
          } catch {
            res.error("Something went wrong")
          }
        } else {
          res.error("Cancelled")
        }
      }
      return nil
    }
    
    self.on(.GET, "/presets/import") { data, res in
      File.select() { file in
        if file == nil {
          res.error("No file selected")
          return
        }
        if file!.pathExtension != "json" {
          res.error("Invalid File format, must be a JSON")
          return
        }
        
        if let json = try? String(contentsOf: file!) {
          let presets = JSON(parseJSON: json).arrayValue
          for preset in presets {
            if let gains = preset["gains"].dictionary, let name = preset["name"].string {
              let global = gains["global"]?.double
              if let bands = gains["bands"]?.arrayObject as? [Double] {
                if preset["id"].string == "manual" {
                  AdvancedEqualizer.updatePreset(id: "manual", gains: AdvancedEqualizerPresetGains(
                    global: global ?? 0, bands: bands
                  ))
                } else {
                  _ = AdvancedEqualizer.createPreset(name: name, gains: AdvancedEqualizerPresetGains(
                    global: global ?? 0, bands: bands
                  ))
                }
                
              }
            }
          }
          res.send("Presets imported.")
        } else {
          res.error("File is not readable format.")
        }
        
        
      }
      return nil
    }
    
    self.on(.GET, "/presets/import-legacy") { data, _ in
      // TODO: Implement
      return "Imported"
    }
    
    presetsChangedListener = AdvancedEqualizer.presetsChanged.on { presets in
      self.send(to: "/presets", data: JSON(AdvancedEqualizer.presets.map { $0.dictionary }))
    }
    
  }
  
  private func getPreset (_ data: JSON?) throws -> AdvancedEqualizerPreset {
    if let id = data["id"] as? String {
      if let preset = AdvancedEqualizer.getPreset(id: id) {
        return preset
      } else {
        throw "Could not find Preset with this ID"
      }
    } else {
      throw "Please provide a preset ID"
    }
  }
  
  private func getGains (_ data: JSON?) throws -> AdvancedEqualizerPresetGains {
    if let gains = data["gains"] as? [String: Any] {
      if let bands = gains["bands"] as? [Double], let global = gains["global"] as? Double {
        let length = AdvancedEqualizer.frequencies.count
        if bands.count != length {
          throw "Invalid length of 'gains' parameter, must equal to " + String(length)
        }
        if bands.first(where: { !(-24.0...24.0).contains($0) }) != nil {
          throw "Invalid value in 'gains' parameter, must between -24.0 and 24.0"
        }
        return AdvancedEqualizerPresetGains(global: global, bands: bands)
      }
    }
    throw "Invalid 'gains' parameter, must be a JSON with 'bands' Double Array and 'global' Double"
  }
}
