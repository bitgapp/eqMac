//
//  Popover.swift
//  eqMac
//
//  Created by Roman Kisil on 25/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa

class Popover: NSObject, NSPopoverDelegate {
  let popover = NSPopover()
  var popoverTransiencyMonitor: Any?
  private var statusItem: StatusItem!

  var isShown: Bool {
    get {
      return popover.isShown
    }
    set {
      let show = newValue
      if (show) {
        self.show()
      } else {
        self.hide()
      }
    }
  }

  var isHidden: Bool {
    get {
      return !isShown
    }
    set {
      isShown = !newValue
    }
  }
  var height: Double {
    get {
      return Double(popover.contentSize.height)
    }
    set {
      let newHeight = CGFloat(newValue)
      let newSize = NSSize(width: CGFloat(width), height: newHeight)
      popover.contentSize = newSize
    }
  }

  var width: Double {
    get {
      return Double(popover.contentSize.width)
    }
    set {
      let newWidth = CGFloat(newValue)
      let newSize = NSSize(width: newWidth, height: CGFloat(height))
      popover.contentSize = newSize
    }
  }

  var canHide: Bool {
    get { return true }
    set {
      //
    }
  }

  init (_ statusItem: StatusItem) {
    self.statusItem = statusItem
    popover.animates = true
    super.init()
    popover.behavior = .transient
    popover.delegate = self
  }

  // MARK: -  Public functions
  @objc open func toggle() {
    isShown ? hide() : show()
  }

  func show() {
    popover.show(relativeTo: NSZeroRect, of: statusItem.button, preferredEdge: .minY)
    popover.becomeFirstResponder()
  }

  func hide() {
    popover.resignFirstResponder()
    popover.close()
    statusItem.highlighted = false
  }

  func popoverShouldClose(_ popover: NSPopover) -> Bool {
    return !File.isPanelVisible
  }
}
