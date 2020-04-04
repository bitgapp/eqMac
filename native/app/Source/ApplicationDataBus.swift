//
//  ApplicationDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 19/10/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AppKit

class ApplicationDataBus: DataBus {
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/quit") { _, _ in
      Application.quit()
      return "Application Quit"
    }
    
    self.on(.GET, "/info") { _, _ in
      let host = Host.current()
      return [
        "name": host.localizedName as AnyObject,
        "model": Sysctl.model as String,
        "version": Bundle.main.infoDictionary?["CFBundleVersion"] as Any
      ]
    }
    
    self.on(.GET, "/faq") { _, _ in
      NSWorkspace.shared.open(Constants.FAQ_URL)
      return "FAQ Openned"
    }
    
    self.on(.POST, "/bug") { _, _ in
      NSWorkspace.shared.open(Constants.BUG_REPORT_URL)
      return "Bug Report Openned"
    }
    
    self.on(.GET, "/haptic") { _, _ in
      NSHapticFeedbackManager.defaultPerformer.perform(NSHapticFeedbackManager.FeedbackPattern.alignment, performanceTime: NSHapticFeedbackManager.PerformanceTime.now)
      return "Haptic feedback performed"
    }
    
    self.on(.GET, "/uninstall") { _, res in
      Application.uninstall() { success in
        res.send([ "uninstalled": success ])
      }
      return nil
    }
    
    self.on(.GET, "/update") { _, _ in
      Application.checkForUpdates()
      return "Checking for updates."
    }
    
    self.add(EngineDataBus.self)
    self.add("/transition", TransitionDataBus.self)
    self.add("/ui", UIDataBus.self)
    self.add("/settings", SettingsDataBus.self)
  }
}
