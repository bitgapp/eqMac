//
//  VolumeState.swift
//  eqMac
//
//  Created by Roman Kisil on 29/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import SwiftyUserDefaults

struct VolumeState: State {
  var gain: Double = 0.5
  var muted: Bool = false
  var balance: Double = 0
  var transition: Bool = false
  var boostEnabled: Bool = true
}

enum VolumeAction: Action {
  case setGain(Double, Bool)
  case setBalance(Double, Bool)
  case setMuted(Bool)
  case setBoostEnabled(Bool)
}

func VolumeStateReducer(action: Action, state: VolumeState?) -> VolumeState {
  var state = state ?? VolumeState()
  
  switch action as? VolumeAction {
  case .setGain(let gain, let transition)?:
    state.gain = gain
    state.transition = transition
  case .setBalance(let balance, let transition)?:
    state.balance = balance
    state.transition = transition
  case .setMuted(let muted)?:
    state.muted = muted
  case .setBoostEnabled(let enabled)?:
    state.boostEnabled = enabled
  case .none:
    break
  }
  
  return state
}
