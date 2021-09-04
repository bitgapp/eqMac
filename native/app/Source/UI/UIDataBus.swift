//
//  UIRoute.swift
//  eqMac
//
//  Created by Roman Kisil on 26/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import SwiftyJSON
import EmitterKit

class UIDataBus: DataBus {
  
  var state: UIState {
    return Application.store.state.ui
  }
  
  var isShownChangedListener: EventListener<Bool>?
  
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/close") { _, _  in
      UI.close()
      return "Closed"
    }
    
    self.on(.GET, "/hide") { _, _  in
      UI.hide()
      return "Hidden"
    }
    
    self.on(.GET, "/height") { _, res  in
      DispatchQueue.main.async {
        res.send([ "height": self.state.height ])
      }
      return nil
    }

    self.on(.POST, "/height") { data, _  in
      guard let height = data["height"] as? Double, height > 0 else {
        throw "Please provide a valid 'height' parameter."
      }
      Application.dispatchAction(UIAction.setHeight(height, true))
      return "UI Height has been set"
    }

    self.on(.GET, "/width") { _, res in
      DispatchQueue.main.async {
        res.send([ "width": self.state.width ])
      }
      return nil
    }
    
    self.on(.GET, "/width") { _, res in
      DispatchQueue.main.async {
        res.send([ "width": self.state.width ])
      }
      return nil
    }

    self.on(.POST, "/width") { data, _ in
      guard let width = data["width"] as? Double, width > 0 else {
        throw "Please provide a valid 'width' parameter."
      }

      Application.dispatchAction(UIAction.setWidth(width, true))
      return "UI Width has been set"
    }

    self.on(.GET, "/settings") { _, _ in
      return self.state.settings
    }
    
    self.on(.GET, "/settings") { _, _ in
      return self.state.settings
    }
    
    self.on(.POST, "/settings") { data, _ in
      if let newSettings = data {
        if let settings = try? self.state.settings.merged(with: newSettings) {
          Application.dispatchAction(UIAction.setSettings(settings))
          return settings
        }
      }
      return self.state.settings
    }
    
    self.on(.GET, "/mode") { data, _ in
      return [ "mode": Application.store.state.ui.mode.rawValue ]
    }
    
    self.on(.POST, "/mode") { data, _ in
      let uiModeRaw = data["mode"] as? String
      
      if uiModeRaw != nil, let uiMode = UIMode(rawValue: uiModeRaw!) {
        Application.dispatchAction(UIAction.setMode(uiMode))
        return "UI Mode has been set"
      }
      throw "Please provide a valid 'uiMode' parameter."
    }
    
    self.on(.GET, "/shown") { data, res in
      DispatchQueue.main.async {
        res.send([ "isShown": UI.isShown ])
      }
      return nil
    }
    
    self.on(.POST, "/loaded") { _, _ in
      UI.hasLoaded = true
      UI.loaded.emit()
      return "Thanks"
    }

    self.on(.GET, "/always-on-top") { _, _ in
      return [ "alwaysOnTop": self.state.alwaysOnTop ]
    }

    self.on(.POST, "/always-on-top") { data, _ in
      let alwaysOnTop = data["alwaysOnTop"] as? Bool
      if alwaysOnTop == nil {
        throw "Invalid 'alwaysOnTop' parameter, must be a boolean."
      }
      Application.dispatchAction(UIAction.setAlwaysOnTop(alwaysOnTop!))
      return "Always on top has been set."
    }

    self.on(.GET, "/status-item-icon-type") { _, _ in
      return [ "statusItemIconType": self.state.statusItemIconType.rawValue ]
    }

    self.on(.POST, "/status-item-icon-type") { data, _ in
      let typeRaw = data["statusItemIconType"] as? String
      if typeRaw != nil, let type = StatusItemIconType(rawValue: typeRaw!) {
        Application.dispatchAction(UIAction.setStatusItemIconType(type))
        return "Status Item Icon type has been set"
      }
      throw "Please provide a valid 'statusItemIconType' parameter"
    }

    self.on(.GET, "/min-height") { _, _ in
      return [ "minHeight": self.state.minHeight ]
    }

    self.on(.POST, "/min-height") { data, _ in
      guard let minHeight = data["minHeight"] as? Double else {
        throw "Please provide a valid 'minHeight' parameter, must be a Float value"
      }

      Application.dispatchAction(UIAction.setMinHeight(minHeight))
      return "Min Height has been set"
    }

    self.on(.GET, "/scale") { _, _ in
      return [ "scale": self.state.scale ]
    }

    self.on(.POST, "/scale") { data, _ in
      guard let scale = data["scale"] as? Double, (0.5...2.0).contains(scale) else {
        throw "Invalid 'scale' parameter, must be a Double in range 0.5...2.0"
      }

      Application.dispatchAction(UIAction.setScale(scale))

      return "UI Scale has been set"
    }

    self.isShownChangedListener = UI.isShownChanged.on { isShown in
      self.send(to: "/shown", data: JSON([ "isShown": isShown ]))
    }
    
  }
}
