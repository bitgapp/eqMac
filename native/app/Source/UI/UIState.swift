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

struct UIState: State {
    var height: Double = 400
    var width: Double = 400
    var windowPosition: NSPoint? = nil
    var iconMode: IconMode = .both

//    var mode: UIMode = .popover
}

enum UIAction: Action {
    case setHeight(Double)
    case setWidth(Double)
    case setWindowPosition(NSPoint)
    case setIconMode(IconMode)
//    case setMode(UIMode)
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
    case .setIconMode(let iconMode)?:
        state.iconMode = iconMode
//    case .setMode(let mode)?:
//        state.mode = mode
    case .none:
        break
    }
    
    return state
}
