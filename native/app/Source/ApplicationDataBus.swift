//
//  ApplicationDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 19/10/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AppKit
import SwiftyJSON

class ApplicationDataBus: DataBus {
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/quit") { _, res in
      Application.quit {
        res.send(JSON("Application Quit"))
      }
      return nil
    }
    
    self.on(.GET, "/info") { _, _ in
      let host = Host.current()
      return [
        "name": host.localizedName as AnyObject,
        "model": Sysctl.model as String,
        "version": Bundle.main.infoDictionary?["CFBundleVersion"] as Any,
        "isOpenSource": Constants.OPEN_SOURCE,
        "driverVersion": Driver.installedVersion.description
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
    
    self.on(.POST, "/open-url") { data, _ in
      if let urlString = data["url"] as? String {
        if let url = URL(string: urlString) {
          NSWorkspace.shared.open(url)
          return "Openned"
        }
      }
      throw "Invalid URL"
    }
    
    self.on(.GET, "/haptic") { _, _ in
      NSHapticFeedbackManager.defaultPerformer.perform(NSHapticFeedbackManager.FeedbackPattern.alignment, performanceTime: NSHapticFeedbackManager.PerformanceTime.now)
      return "Haptic feedback performed"
    }
    
    self.on(.GET, "/uninstall") { _, res in
      let url = URL(string: "#uninstall", relativeTo: Constants.FAQ_URL)!
      NSWorkspace.shared.open(url)
      return "FAQ Openned"
    }
    
    self.on(.GET, "/driver/reinstall/available") { _, res in
      return false
    }
    
//    self.on(.GET, "/driver/reinstall") { _, res in
//      Application.reinstallDriver { success in
//        res.send([ "reinstalled": success ])
//      }
//      return nil
//    }
//
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
