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
  var doCollectCrashReports = false
}

enum SettingsAction: Action {
  case setIconMode(IconMode)
  case setDoCollectCrashReports(Bool)
}

func SettingsStateReducer(action: Action, state: SettingsState?) -> SettingsState {
  var state = state ?? SettingsState()
  switch action as? SettingsAction {
  case .setIconMode(let iconMode)?:
    state.iconMode = iconMode
  case .setDoCollectCrashReports(let doCollect)?:
    state.doCollectCrashReports = doCollect
  case .none:
    break
  }
  
  return state
}
