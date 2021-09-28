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
import BetterCodable

fileprivate struct ScaleDefault: DefaultCodableStrategy {
  static var defaultValue: Double = 1
}

fileprivate struct MinWidthDefault: DefaultCodableStrategy {
  static var defaultValue: Double = 400
}

fileprivate struct MinHeightDefault: DefaultCodableStrategy {
  static var defaultValue: Double = 400
}

fileprivate struct StatusItemIconTypeDefault: DefaultCodableStrategy {
  static var defaultValue: StatusItemIconType = .classic
}

struct UIState: State {
  var height: Double = 400
  var width: Double = 400
  var windowPosition: NSPoint? = nil
  @DefaultFalse var alwaysOnTop = false
  var settings: JSON = JSON()
  var mode: UIMode = .window
  @DefaultCodable<StatusItemIconTypeDefault> var statusItemIconType = StatusItemIconTypeDefault.value
  @DefaultCodable<ScaleDefault> var scale = ScaleDefault.value
  @DefaultCodable<MinHeightDefault> var minHeight = MinHeightDefault.value
  @DefaultCodable<MinWidthDefault> var minWidth = MinWidthDefault.value
  var maxHeight: Double?
  var maxWidth: Double?
  @DefaultFalse var fromUI = false
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
