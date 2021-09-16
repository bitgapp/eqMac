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
  var statusItemIconType: StatusItemIconType = .classic
  var scale: Double = 1
  var minHeight: Double = 400
  var minWidth: Double = 400
  var maxHeight: Double?
  var maxWidth: Double?
  var fromUI = false
}

enum UIAction: Action {
  case setHeight(Double, Bool? = nil)
  case setWidth(Double, Bool? = nil)
  case setWindowPosition(NSPoint)
  case setAlwaysOnTop(Bool)
  case setSettings(JSON)
  case setMode(UIMode)
  case setStatusItemIconType(StatusItemIconType)
  case setScale(Double)
  case setMinHeight(Double)
  case setMinWidth(Double)
  case setMaxHeight(Double?)
  case setMaxWidth(Double?)
}

func UIStateReducer(action: Action, state: UIState?) -> UIState {
  var state = state ?? UIState()
  
  switch action as? UIAction {
  case .setHeight(let height, let fromUI)?:
    state.height = height
    state.fromUI = fromUI == true
  case .setWidth(let width, let fromUI)?:
    state.width = width
    state.fromUI = fromUI == true
  case .setWindowPosition(let point)?:
    state.windowPosition = point
  case .setAlwaysOnTop(let alwaysOnTop)?:
    state.alwaysOnTop = alwaysOnTop
  case .setSettings(let settings)?:
    state.settings = settings
  case .setMode(let mode)?:
    state.mode = mode
  case .setStatusItemIconType(let type)?:
    state.statusItemIconType = type
  case .setScale(let scale)?:
    state.scale = scale
  case .setMinHeight(let minHeight)?:
    state.minHeight = minHeight
  case .setMinWidth(let minWidth)?:
    state.minWidth = minWidth
  case .setMaxHeight(let maxHeight)?:
    state.maxHeight = maxHeight
  case .setMaxWidth(let maxWidth)?:
    state.maxWidth = maxWidth
  case .none:
    break
  }
  
  return state
}
