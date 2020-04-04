//
//  UIRoute.swift
//  eqMac
//
//  Created by Roman Kisil on 26/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import SwiftyJSON

class UIDataBus: DataBus {
  
  var state: UIState {
    return Application.store.state.ui
  }
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/hide") { _, _  in
      UI.hide()
      return "Hidden"
    }
    
    self.on(.GET, "/height") { _, _  in
      return [ "height": self.state.height ]
    }
    
    self.on(.POST, "/height") { data, _  in
      let height = data["height"] as? Double
      if height == nil || height! < 0 {
        throw "Please provide a valid 'height' parameter."
      }
      Application.dispatchAction(UIAction.setHeight(height!))
      return "UI Height has been set"
    }
    
    self.on(.GET, "/width") { data, _ in
      return [ "width": self.state.width ]
    }
    
    self.on(.POST, "/width") { data, _ in
      let width = data["width"] as? Double

      if width == nil || width! < 0 {
        throw "Please provide a valid 'width' parameter."
      }
      Application.dispatchAction(UIAction.setWidth(width!))
      return "UI Width has been set"
    }
    
    self.on(.GET, "/settings") { data, _ in
      return [ "iconMode": self.state.iconMode.rawValue ]
    }
    
    self.on(.POST, "/settings") { data, _ in
      let iconModeRaw = data["iconMode"] as? String
      if iconModeRaw != nil, let iconMode = IconMode(rawValue: iconModeRaw!) {
        Application.dispatchAction(UIAction.setIconMode(iconMode))
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
