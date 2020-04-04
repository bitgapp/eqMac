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
  
  var gainChangedListener: EventListener<Double>?
  
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
      Application.dispatchAction(VolumeAction.setGain(gain!, transition))
      return "Volume Gain has been set"
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
      Application.dispatchAction(VolumeAction.setBalance(balance!, transition))
      return "Volume Balance has been set"
    }
    
    gainChangedListener = Application.volume.gainChanged.on { gain in
      self.send(to: "/gain", data: JSON([ "gain": gain ]))
    }
  }
}
