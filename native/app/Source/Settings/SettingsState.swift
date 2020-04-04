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
}

enum SettingsAction: Action {
}

func SettingsStateReducer(action: Action, state: SettingsState?) -> SettingsState {
    let state = state ?? SettingsState()
    switch action as? SettingsAction {
    
    case .none:
        break
    }
    
    return state
}
