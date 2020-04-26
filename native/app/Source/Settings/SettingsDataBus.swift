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
    
    //        self.on(.GET, "/mode") { data, _ in
    //            return[ "mode": Application.store.state.ui.mode.rawValue ])
    //        }
    //
    //        self.on(.POST, "/mode") { data, _ in
    //            let uiMode: UIMode? = Server.getParamFromRequestBody(req, "mode", UIMode.self)
    //            if uiMode == nil || !UIMode.allValues.contains(uiMode!.rawValue) {
    //                throw "Please provide a valid 'uiMode' parameter."
    //            }
    //            Application.dispatchAction(UIAction.setMode(uiMode!))
    //            return "UI Mode has been set")
    //        }
    
  }
}
