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
  var button: NSStatusBarButton
  private let dummyMenu = NSMenu()
  let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
  
  // MARK - Initialization
  public init(image: NSImage) {
    self.button = item.button!
    image.isTemplate = true
    button.image = image
    button.appearsDisabled = false
    button.target = self
    button.action = #selector(StatusItem.wasClicked)
    NotificationCenter.default.addObserver(self, selector: #selector(NSApplicationDelegate.applicationWillResignActive(_:)), name: NSApplication.willResignActiveNotification, object: nil)
  }
  
  
  @IBAction private func wasClicked (event: Any?) {
    item.popUpMenu(dummyMenu)
    clicked.emit()
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

