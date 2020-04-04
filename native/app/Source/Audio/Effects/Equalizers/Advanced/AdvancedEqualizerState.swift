//
//  AdvancedEqualizerState.swift
//  eqMac
//
//  Created by Roman Kisil on 06/01/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import SwiftyUserDefaults

struct AdvancedEqualizerState: State {
  var selectedPresetId: String = "flat"
  var showDefaultPresets: Bool = true
  var transition: Bool = false
}

enum AdvancedEqualizerAction: Action {
  case selectPreset(String, Bool)
  case setShowDefaultPresets(Bool)
}

func AdvancedEqualizerStateReducer(action: Action, state: AdvancedEqualizerState?) -> AdvancedEqualizerState {
  var state = state ?? AdvancedEqualizerState()
  
  switch action as? AdvancedEqualizerAction {
  case .selectPreset(let id, let transition)?:
    state.selectedPresetId = id
    state.transition = transition
  case .setShowDefaultPresets(let show)?:
    state.showDefaultPresets = show
    Utilities.delay(100) {
      AdvancedEqualizer.presetsChanged.emit(AdvancedEqualizer.presets)
    }
  case .none:
    break
  }
  
  return state
}
