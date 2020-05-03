//
//  AppDelegate.swift
//  eqMac
//
//  Created by Roman Kisil on 27/11/2017.
//  Copyright © 2017 Roman Kisil. All rights reserved.
//

import Cocoa
import SwiftyJSON
import ServiceManagement
import Sparkle
import EmitterKit

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate, SUUpdaterDelegate {
  var updater = SUUpdater(for: Bundle.main)!
  var updateFound = Event<Void>()
  var updateNotFound = Event<Void>()
  var updateCanceled = Event<Void>()
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    updater.delegate = self
    updateFound.once { _ in
      self.updateCanceled.once { _ in
        Application.start()
      }
    }
    
    updateNotFound.once { _ in
      Application.start()
    }
    updater.checkForUpdatesInBackground()
  }
  
  func applicationWillTerminate(_ aNotification: Notification) {
    Application.quit()
  }
  
  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    UI.toggle()
    return true
  }
  
  func applicationWillBecomeActive(_ notification: Notification) {
    
  }
  
  func applicationDidBecomeActive(_ notification: Notification) {
    
  }
  
  func updaterDidNotFindUpdate(_ updater: SUUpdater) {
    updateNotFound.emit()
  }
  
  func updater(_ updater: SUUpdater, didFindValidUpdate item: SUAppcastItem) {
    updateFound.emit()
  }
  
  func updater(_ updater: SUUpdater, userDidSkipThisVersion item: SUAppcastItem) {
    updateCanceled.emit()
  }
  
  func updater(_ updater: SUUpdater, didCancelInstallUpdateOnQuit item: SUAppcastItem) {
    updateCanceled.emit()
  }
  
  func updater(_ updater: SUUpdater, didDismissUpdateAlertPermanently permanently: Bool, for item: SUAppcastItem) {
//    updateCanceled.emit()
  }
  
  func userDidCancelDownload(_ updater: SUUpdater) {
        updateCanceled.emit()
  }
    
}


