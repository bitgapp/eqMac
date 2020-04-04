//
//  EffectsState.swift
//  eqMac
//
//  Created by Roman Kisil on 29/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import SwiftyUserDefaults

struct EffectsState: State {
  var volume = VolumeState()
  var equalizers = EqualizersState()
}

func EffectsStateReducer(action: Action, state: EffectsState?) -> EffectsState {
  var state = state ?? EffectsState()
  
  state.volume = VolumeStateReducer(action: action, state: state.volume)
  state.equalizers = EqualizersStateReducer(action: action, state: state.equalizers)
  
  return state
}
