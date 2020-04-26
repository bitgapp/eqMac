//
//  SettingsState.swift
//  eqMac
//
//  Created by Romans Kisils on 15/07/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation

import SwiftyUserDefaults
import ReSwift

struct SettingsState: State {
  var iconMode: IconMode = .both
  //    var mode: UIMode = .popover
}

enum SettingsAction: Action {
  case setIconMode(IconMode)
  //    case setMode(UIMode)
}

func SettingsStateReducer(action: Action, state: SettingsState?) -> SettingsState {
  var state = state ?? SettingsState()
  switch action as? SettingsAction {
  case .setIconMode(let iconMode)?:
    state.iconMode = iconMode
    //    case .setMode(let mode)?:
  //        state.mode = mode
  case .none:
    break
  }
  
  return state
}
