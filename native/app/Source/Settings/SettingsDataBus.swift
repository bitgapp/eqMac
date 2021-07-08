//
//  SettingsRoute.swift
//  eqMac
//
//  Created by Roman Kisil on 07/03/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation
import SwiftyJSON

class SettingsDataBus: DataBus {
  
  var state: SettingsState {
    return Application.store.state.settings
  }
  
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/launch-on-startup") { data, _ in
      return [ "state": Settings.launchOnStartup ]
    }
    
    self.on(.POST, "/launch-on-startup") { data, _ in
      let state = data["state"] as? Bool
      if (state == nil) {
        throw "Invalid 'state' parameter. Must be a boolean."
      }
      
      Settings.launchOnStartup = state!
      
      return "Launch on Startup has been set"
    }
    
    self.on(.GET, "/icon-mode") { data, _ in
      return [ "mode": self.state.iconMode.rawValue ]
    }
    
    self.on(.POST, "/icon-mode") { data, _ in
      let iconModeRaw = data["mode"] as? String
      if iconModeRaw != nil, let iconMode = IconMode(rawValue: iconModeRaw!) {
        Application.dispatchAction(SettingsAction.setIconMode(iconMode))
      }
      
      return "Settings have been set"
    }

    self.on(.GET, "/collect-crash-reports") { data, _ in
      return [ "doCollectCrashReports": self.state.doCollectCrashReports ]
    }

    self.on(.POST, "/collect-crash-reports") { data, _ in
      let doCollectCrashReports = data["doCollectCrashReports"] as? Bool
      if doCollectCrashReports == nil {
        throw "Invalid 'doCollectCrashReports' parameter, must be a Boolean"
      }
      Application.dispatchAction(SettingsAction.setDoCollectCrashReports(doCollectCrashReports!))

      return "Crash Report collection consent has been set"
    }
    
  }
}
