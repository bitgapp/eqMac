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
import BetterCodable

protocol State: Codable, DefaultsSerializable {}

fileprivate struct VolumeDefault: DefaultCodableStrategy {
  static var defaultValue = VolumeState()
}

struct ApplicationState: State {
  var settings = SettingsState()
  var ui = UIState()
  var effects = EffectsState()
  @DefaultCodable<VolumeDefault> var volume = VolumeDefault.value
  @DefaultTrue var enabled = true

  static func load () -> ApplicationState {
    guard let stateData = UserDefaults.standard.data(forKey: "state") else {
      return ApplicationState()
    }

    guard let state = ({ () -> ApplicationState? in 
      if Constants.DEBUG && false {
        return try! JSONDecoder().decode(ApplicationState.self, from: stateData)
      } else {
        return try? JSONDecoder().decode(ApplicationState.self, from: stateData)
      }
    })() else {
      return ApplicationState()
    }

    return state
  }
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
