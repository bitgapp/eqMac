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

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    Application.start()
//    print(Driver.latency)
//    Driver.latency = 1000
//    print(Driver.latency)
//
//    print(Driver.safetyOffset)
//    Driver.safetyOffset = 1000
//    print(Driver.safetyOffset)
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
    
}


