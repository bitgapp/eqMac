//
//  BasicEqualizerState.swift
//  eqMac
//
//  Created by Roman Kisil on 30/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import SwiftyUserDefaults

struct BasicEqualizerState: State {
  var selectedPresetId: String = "flat"
  var transition: Bool = false
}

enum BasicEqualizerAction: Action {
  case selectPreset(String, Bool)
}

func BasicEqualizerStateReducer(action: Action, state: BasicEqualizerState?) -> BasicEqualizerState {
  var state = state ?? BasicEqualizerState()
  
  switch action as? BasicEqualizerAction {
  case .selectPreset(let presetId, let transition)?:
    state.selectedPresetId = presetId
    state.transition = transition
  case .none:
    break
  }
  
  return state
}

