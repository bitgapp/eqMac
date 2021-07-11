//
//  VolumeDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 25/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import EmitterKit
import SwiftyJSON

class VolumeDataBus: DataBus {
  var state: VolumeState {
    return Application.store.state.effects.volume
  }

  var outputCreatedListener: EventListener<Void>?
  var gainChangedListener: EventListener<Double>?
  var boostEnabledChangedListener: EventListener<Bool>?
  
  required init (route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/gain") { _, _ in
      return [ "gain": self.state.gain ]
    }
    
    self.on(.POST, "/gain") { data, _ in
      let gain = data["gain"] as? Double
      if (gain == nil || gain!.isNaN || gain! < 0.0) {
        throw "Invalid 'gain' value, must be a positive number"
      }
      let transition = data["transition"] as? Bool ?? false
      Application.ignoreNextVolumeEvent = true
      Application.ignoreNextDriverMuteEvent = true
      Application.dispatchAction(VolumeAction.setGain(gain!, transition))
      return "Volume Gain has been set"
    }

    self.on(.GET, "/gain/boost/enabled") { _, _ in
      return [ "enabled": self.state.boostEnabled ]
    }

    self.on(.POST, "/gain/boost/enabled") { data, _ in
      let boostEnabled = data["enabled"] as? Bool
      if boostEnabled == nil {
        throw "Invalid 'enabled' value, must be a boolean"
      }

      Application.dispatchAction(VolumeAction.setBoostEnabled(boostEnabled!))
      return "Set"
    }
    
    self.on(.GET, "/balance") { _, _ in
      return [ "balance": self.state.balance ]
    }
    
    self.on(.POST, "/balance") { data, _ in
      let balance = data["balance"] as? Float64
      if (balance == nil || balance!.isNaN || balance! < -1 || balance! > 1.0) {
        throw "Invalid 'balance' value, must be a floating point number"
      }
      let transition = data["transition"] as? Bool ?? false
      Application.ignoreNextVolumeEvent = true
      Application.ignoreNextDriverMuteEvent = true
      Application.dispatchAction(VolumeAction.setBalance(balance!, transition))
      return "Volume Balance has been set"
    }
    
    self.on(.GET, "/muted") { _, _ in
      return [ "muted": self.state.muted ]
    }
    
    self.on(.POST, "/muted") { data, _ in
      let muted = data["muted"] as? Bool
      if (muted == nil) {
        throw "Invalid 'muted' value, must be a boolean"
      }
      Application.ignoreNextVolumeEvent = true
      Application.ignoreNextDriverMuteEvent = true
      Application.dispatchAction(VolumeAction.setMuted(muted!))
      return "Volume mute has been set"
    }


    gainChangedListener = Volume.gainChanged.on { gain in
      self.send(to: "/gain", data: JSON([ "gain": gain ]))
    }

    boostEnabledChangedListener = Volume.boostEnabledChanged.on { enabled in
      self.send(to: "/gain/boost/enabled", data: JSON([ "enabled": enabled ]))
    }
  }
}
