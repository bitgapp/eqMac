//
//  AppDelegate.swift
//  eqMac Driver Installer
//
//  Created by Nodeful on 08/07/2020.
//  Copyright © 2020 Bitgapp. All rights reserved.
//

import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

  var window: NSWindow!


  func applicationDidFinishLaunching(_ aNotification: Notification) {
    // Create the SwiftUI view that provides the window contents.
    let contentView = ContentView()
//
//    // Create the window and set the content view.
//    window = NSWindow(
//        contentRect: NSRect(x: 0, y: 0, width: 480, height: 300),
//        styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
//        backing: .buffered, defer: false)
//    window.center()
//    window.setFrameAutosaveName("Main Window")
//    window.contentView = NSHostingView(rootView: contentView)
//    window.makeKeyAndOrderFront(nil)
    
    Script.sudo("install_driver", started: {
      print("started")
    }, { finished in
      print("finished: \(finished)")
    })
  }

  func applicationWillTerminate(_ aNotification: Notification) {
    // Insert code here to tear down your application
  }


}

