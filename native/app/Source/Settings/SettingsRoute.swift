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
    
  }
}
