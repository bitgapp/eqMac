//
//  State.swift
//  eqMac
//
//  Created by Roman Kisil on 25/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import SwiftyUserDefaults

protocol State: StateType, Codable, DefaultsSerializable {}

struct ApplicationState: State {
  var settings = SettingsState()
  var ui = UIState()
  var effects = EffectsState()
  var volume = VolumeState()
  var enabled = true
}

enum ApplicationAction: Action {
  case setEnabled(Bool)
}

func ApplicationStateReducer(action: Action, state: ApplicationState?) -> ApplicationState {
  var state = state ?? ApplicationState()
  state.settings = SettingsStateReducer(action: action, state: state.settings)
  state.ui = UIStateReducer(action: action, state: state.ui)
  state.effects = EffectsStateReducer(action: action, state: state.effects)
  state.volume = VolumeStateReducer(action: action, state: state.volume)

  switch action as? ApplicationAction {
  case .setEnabled(let enabled)?:
    state.enabled = enabled
  case .none:
    break
  }

  Application.newState(state) // Notify
  Storage[.state] = state // Store
  
  return state
}
