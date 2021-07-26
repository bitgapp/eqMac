//
//  Popover.swift
//  eqMac
//
//  Created by Roman Kisil on 25/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa

class Window: NSWindow, NSWindowDelegate {
  override init(contentRect: NSRect, styleMask style: NSWindow.StyleMask, backing backingStoreType: NSWindow.BackingStoreType, defer flag: Bool) {
    super.init(contentRect: contentRect, styleMask: style, backing: backingStoreType, defer: flag)
    
    self.delegate = self
    self.isOneShot = false
    self.titleVisibility = .hidden
    self.titlebarAppearsTransparent = true
    self.isMovableByWindowBackground = true
    
    Utilities.delay(1000, completion: {
      for subview in self.contentView!.superview!.subviews {
        if subview.isKind(of: NSClassFromString("NSTitlebarContainerView")!) {
          let titleBarView = subview.subviews[0]
          for button in titleBarView.subviews {
            if button.isKind(of: NSButton.self) {
              button.isHidden = true
            }
          }
        }
      }
    })
  }
  
  func windowDidChangeOcclusionState(_ notification: Notification) {
    // occlusionState.contains(.visible)
  }
  var isShown: Bool {
    get {
      return self.isVisible && self.occlusionState.contains(.visible)
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
  
  var position: NSPoint {
    get {
      return frame.origin
    }
    set {
      let newPosition = newValue
      setFrameOrigin(newPosition)
    }
  }
  var height: Double {
    get {
      return Double(self.frame.height)
    }
    set {
      let newHeight = CGFloat(newValue)
      
      var frame = self.frame
      let oldHeight = frame.size.height
      let diff = newHeight - oldHeight
      
      frame.origin.y -= diff
      frame.size.height += diff
      
      var origin = self.contentView!.frame.origin
      origin.y -= diff
      self.setFrame(frame, display: false, animate: true)
      self.contentView?.setFrameOrigin(NSPoint(x: 0, y: 0))
    }
  }
  
  var width: Double {
    get {
      return Double(self.frame.width)
    }
    set {
      let newWidth = CGFloat(newValue)
      var frame = self.frame
      frame.size.width = newWidth
      self.setFrame(frame, display: false, animate: true)
    }
  }
  
  // MARK: -  Public functions
  
  func show() {
    self.makeKeyAndOrderFront(nil)
    self.becomeFirstResponder()
  }
  
  func hide() {
    self.resignFirstResponder()
    self.orderOut(self)
  }
  
  func windowShouldClose(_ sender: NSWindow) -> Bool {
    return !File.isPanelVisible
  }
  
  override var isMainWindow: Bool {
    return super.isMainWindow || (self.parent?.isMainWindow ?? true)
  }
  
  override var canBecomeKey: Bool {
    return true
  }
  
  override var isKeyWindow: Bool {
    return super.isKeyWindow || (self.parent?.isKeyWindow ?? true)
  }
  
  override func performDrag(with event: NSEvent) {
    super.performDrag(with: event)
    Application.dispatchAction(UIAction.setWindowPosition(position))
  }
  
}
