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
import AMCoreAudio

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate, SUUpdaterDelegate {
  var updater = SUUpdater(for: Bundle.main)!
  var updateProcessed = EmitterKit.Event<Void>()
  var willBeDownloadingUpdate = false
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    for window in NSApplication.shared.windows {
      window.resignFirstResponder()
      window.close()
    }

    updater.delegate = self
    updateProcessed.once { _ in
      Application.start()
    }

    if (Application.store.state.settings.doAutoCheckUpdates) {
      Networking.checkConnected { connected in
        if (connected) {
          self.updater.checkForUpdatesInBackground()
        } else {
          self.updateProcessed.emit()
        }
      }

      Utilities.delay(2000) {
        self.updateProcessed.emit()
      }
    } else {
      self.updateProcessed.emit()
    }

    NSWorkspace.shared.notificationCenter.addObserver(
        self, selector: #selector(didWakeUp(event:)),
        name: NSWorkspace.didWakeNotification, object: nil)

    NSWorkspace.shared.notificationCenter.addObserver(
        self, selector: #selector(willSleep(event:)),
        name: NSWorkspace.willSleepNotification, object: nil)
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
    if (UI.hasLoaded) {
      UI.show()
    }
  }
  
  func updaterDidNotFindUpdate(_ updater: SUUpdater) {
    updateProcessed.emit()
  }
  
  func updater(_ updater: SUUpdater, userDidSkipThisVersion item: SUAppcastItem) {
    updateProcessed.emit()
  }
  
  func updater(_ updater: SUUpdater, didCancelInstallUpdateOnQuit item: SUAppcastItem) {
    updateProcessed.emit()
  }
  
  func updater(_ updater: SUUpdater, willDownloadUpdate item: SUAppcastItem, with request: NSMutableURLRequest) {
    willBeDownloadingUpdate = true
  }
  
  func updater(_ updater: SUUpdater, didDismissUpdateAlertPermanently permanently: Bool, for item: SUAppcastItem) {
    Utilities.delay(500, completion: {
      if !self.willBeDownloadingUpdate {
        self.updateProcessed.emit()
      }
    })
  }
  
  func userDidCancelDownload(_ updater: SUUpdater) {
    updateProcessed.emit()
  }
  
  func updater(_ updater: SUUpdater, didAbortWithError error: Error) {
    updateProcessed.emit()
  }
  
  func updater(_ updater: SUUpdater, failedToDownloadUpdate item: SUAppcastItem, error: Error) {
    updateProcessed.emit()
  }

  @objc func willSleep(event: NSNotification) {
    Application.handleSleep()
  }

  @objc func didWakeUp(event: NSNotification) {
    Application.handleWakeUp()
  }
}


