//
//  ApplicationDataBus.swift
//  eqMac
//
//  Created by Romans Kisils on 19/10/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AppKit
import EmitterKit
import SwiftyJSON
import AudioToolbox

class ApplicationDataBus: DataBus {
  var errorListener: EventListener<String>?
  
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
      guard let urlString = (data["url"] as? String), let url = URL(string: urlString), let host = url.host else {
        throw "Invalid URL"
      }

      guard Constants.OPEN_URL_TRUSTED_DOMAINS.contains(host), Constants.TRUSTED_URL_PREFIXES.contains(where: { url.absoluteString.hasPrefix($0) }) else {
        throw "Untrusted URL"
      }

      NSWorkspace.shared.open(url)
      return "Openned"
    }

    var lastHaptic: UInt?
    self.on(.GET, "/haptic") { _, _ in
      if lastHaptic == nil || Time.stamp - lastHaptic! > 1000 {
        lastHaptic = Time.stamp
        NSHapticFeedbackManager.defaultPerformer.perform(NSHapticFeedbackManager.FeedbackPattern.alignment, performanceTime: NSHapticFeedbackManager.PerformanceTime.now)
        return "Haptic feedback performed"
      } else {
        return "Too much"
      }
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

    self.on(.GET, "/enabled") { _, _ in
      return [ "enabled": Application.store.state.enabled ]
    }

    self.on(.POST, "/enabled") { data, _ in
      if let enabled = data["enabled"] as? Bool {
        Application.dispatchAction(ApplicationAction.setEnabled(enabled))
        return "Enabled has been set"
      }
      throw "Invalid 'enabled' parameter, must be a boolean"
    }
    
    self.add(EngineDataBus.self)
    self.add("/transition", TransitionDataBus.self)
    self.add("/ui", UIDataBus.self)
    self.add("/settings", SettingsDataBus.self)
    
    errorListener = Application.error.on { error in
      self.send(to: "/error", data: [ "error": error ])
    }

    self.on(.GET, "/bundle-icon") { data, _ in
      guard let bundleId = data["bundleId"] as? String else {
        throw "Invalid 'bundleId' parameter, must be a string"
      }

      guard let path = NSWorkspace.shared.absolutePathForApplication(withBundleIdentifier: bundleId) else {
        return JSON.null
      }

      return [
        "base64": NSWorkspace.shared.icon(forFile: path).base64String ?? JSON.null
      ]
    }

    var lastSound: UInt?
    self.on(.GET, "/alert-sound") { _, _ in
      if lastSound == nil || Time.stamp - lastSound! > 100 {
        lastSound = Time.stamp
        AudioServicesPlayAlertSound(kSystemSoundID_UserPreferredAlert)
        return "Sound played"
      } else {
        return "Too much"
      }
    }

    self.on(.POST, "/system-sound") { data, _ in
      let sounds: [String] = [
        "Basso",
        "Blow",
        "Bottle",
        "From",
        "Funk",
        "Glass",
        "Hero",
        "Morse",
        "Ping",
        "Pop",
        "Purr",
        "Sosumi",
        "Submarine",
        "Tink",
      ]

      guard let sound = data["name"] as? String, sounds.contains(sound) else {
        throw "Invalid 'name' parameter, must be a string that is one of these: \(sounds)"
      }

      if lastSound == nil || Time.stamp - lastSound! > 100 {
        lastSound = Time.stamp
        NSSound(named: sound)?.play()
        return "Sound played"
      } else {
        return "Too much"
      }
    }
  }
}
