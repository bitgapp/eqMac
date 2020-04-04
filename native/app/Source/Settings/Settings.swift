//
//  Settings.swift
//  eqMac
//
//  Created by Romans Kisils on 24/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import Cocoa
import ServiceManagement
import LaunchAtLogin
import SwiftyUserDefaults
import ReSwift

enum IconMode: String, Codable {
    case dock = "dock"
    case statusBar = "statusBar"
    case both = "both"
}

extension IconMode {
    static let allValues = [
        dock.rawValue,
        statusBar.rawValue,
        both.rawValue
    ]
}

class Settings: StoreSubscriber {
    typealias StoreSubscriberStateType = SettingsState
    private func setupStateListener () {
        Application.store.subscribe(self) { subscription in
            subscription.select { state in state.settings }
        }
    }
    
    func newState(state: SettingsState) {
    }
    
    init() {
        self.setupStateListener()
    }
    
    static var launchOnStartup: Bool {
        get {
            return LaunchAtLogin.isEnabled
        }
        set {
            LaunchAtLogin.isEnabled = newValue
        }
    }
    
    var launchOnStartup: Bool {
        get {
            return LaunchAtLogin.isEnabled
        }
        set {
            LaunchAtLogin.isEnabled = newValue
        }
    }
    
}
