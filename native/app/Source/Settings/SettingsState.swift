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
import BetterCodable

struct SettingsState: State {
  var iconMode: IconMode = .both
  @DefaultFalse var doCollectCrashReports = false
  @DefaultTrue var doAutoCheckUpdates = true
  @DefaultTrue var doOTAUpdates = true
  @DefaultFalse var doBetaUpdates = false
}

enum SettingsAction: Action {
  case setIconMode(IconMode)
  case setDoCollectCrashReports(Bool)
  case setDoAutoCheckUpdates(Bool)
  case setDoOTAUpdates(Bool)
  case setDoBetaUpdates(Bool)
}

func SettingsStateReducer(action: Action, state: SettingsState?) -> SettingsState {
  var state = state ?? SettingsState()
  switch action as? SettingsAction {
  case .setIconMode(let iconMode)?:
    state.iconMode = iconMode
  case .setDoCollectCrashReports(let doCollect)?:
    state.doCollectCrashReports = doCollect
  case .setDoAutoCheckUpdates(let doAutoCheckUpdates)?:
    state.doAutoCheckUpdates = doAutoCheckUpdates
  case .setDoOTAUpdates(let doOTAUpdates)?:
    state.doOTAUpdates = doOTAUpdates
  case .setDoBetaUpdates(let doBetaUpdates)?:
    state.doBetaUpdates = doBetaUpdates
  case .none:
    break
  }
  
  return state
}
