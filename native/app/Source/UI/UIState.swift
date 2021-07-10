//
//  ViewsState.swift
//  eqMac
//
//  Created by Roman Kisil on 07/07/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import SwiftyUserDefaults
import ReSwift
import SwiftyJSON

struct UIState: State {
  var height: Double = 400
  var width: Double = 400
  var windowPosition: NSPoint? = nil
  var alwaysOnTop = false
  var settings: JSON = JSON()
  var mode: UIMode = .window
}

enum UIAction: Action {
  case setHeight(Double)
  case setWidth(Double)
  case setWindowPosition(NSPoint)
  case setSettings(JSON)
  case setMode(UIMode)
}

func UIStateReducer(action: Action, state: UIState?) -> UIState {
  var state = state ?? UIState()
  
  switch action as? UIAction {
  case .setHeight(let height)?:
    state.height = height
  case .setWidth(let width)?:
    state.width = width
  case .setWindowPosition(let point)?:
    state.windowPosition = point
  case .setSettings(let settings)?:
    state.settings = settings
  case .setMode(let mode)?:
    state.mode = mode
  case .none:
    break
  }
  
  return state
}
