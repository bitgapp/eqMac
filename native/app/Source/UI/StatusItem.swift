//
//  PopStatusItem.swift
//  PopStatusItem
//
//  Created by Adam Hartford on 4/24/15.
//  Copyright (c) 2015 Adam Hartford. All rights reserved.
//

import Cocoa
import EmitterKit

class StatusItem {
  // MARK: - Properties
  
  var highlighted: Bool {
    get {
      return button.isHighlighted
    }
    set {
      DispatchQueue.main.async {
        self.button.isHighlighted = newValue
      }
    }
  }
  
  var clicked = Event<Void>()
  var rightClicked = Event<Void>()
  var button: NSStatusBarButton
  private let dummyMenu = NSMenu()
  private let rightClickMenu = NSMenu()
  let rightClickGesture = NSClickGestureRecognizer()
  
  let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
  
  // MARK - Initialization
  public init(image: NSImage) {
    self.button = item.button!
    image.isTemplate = true
    button.image = image
    button.appearsDisabled = false
    button.target = self
    button.action = #selector(StatusItem.wasClicked(sender:))
    
    button.sendAction(on: [.leftMouseDown, .rightMouseDown])
//    // Add right click functionality
//    rightClickGesture.buttonMask = 0x2 // right mouse
//    rightClickGesture.target = self
//    rightClickGesture.action = #selector(StatusItem.wasClicked)
//    button.addGestureRecognizer(rightClickGesture)
    
    let quitMenuItem = NSMenuItem()
    quitMenuItem.target = self
    quitMenuItem.title = "Quit eqMac"
    quitMenuItem.action = #selector(StatusItem.quit(sender:))
    quitMenuItem.isEnabled = true
    rightClickMenu.addItem(quitMenuItem)
    
    NotificationCenter.default.addObserver(self, selector: #selector(NSApplicationDelegate.applicationWillResignActive(_:)), name: NSApplication.willResignActiveNotification, object: nil)
  }
  
  @IBAction private func quit (sender: NSStatusItem) {
    Application.quit()
  }
  
  @IBAction private func wasClicked (sender: NSStatusItem) {
    highlighted = false

    let event = NSApp.currentEvent!
    
    if (event.type == .rightMouseDown) {
      item.popUpMenu(rightClickMenu)
      rightClicked.emit()
    } else if (event.type == .leftMouseDown) {
      item.popUpMenu(dummyMenu)
      clicked.emit()
    }
    
  }
  
  // MARK: - Listeners
  @objc open func applicationWillResignActive(_ notification: Notification) {
    highlighted = false
  }
  
  // MARK: - Deinit
  deinit {
    NotificationCenter.default.removeObserver(self)
  }
}

