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
import Sentry

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
  static var iconMode: IconMode = .both {
    didSet {
      let showDockIcon = self.iconMode == .both || self.iconMode == .dock
      NSApp.setActivationPolicy(showDockIcon ? .regular : .accessory)
      let showStatusBarIcon = self.iconMode == .both || self.iconMode == .statusBar
      UI.statusItem.item.isVisible = showStatusBarIcon
    }
  }

  init() {
    self.setupStateListener()
    ({
      Settings.iconMode = Application.store.state.settings.iconMode
    })()
  }

  typealias StoreSubscriberStateType = SettingsState
  private func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.settings }
    }
  }

  func newState(state: SettingsState) {
    if (state.iconMode != Settings.iconMode) {
      Settings.iconMode = state.iconMode
    }
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
