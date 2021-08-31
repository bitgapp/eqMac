//
//  Popover.swift
//  eqMac
//
//  Created by Roman Kisil on 25/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa

class Popover: NSPopover, NSPopoverDelegate {
  private var statusItem: StatusItem!

  let SIDES_HIT = CGFloat(4)
  let BOTTOM_HIT = CGFloat(4)
  let CORNER_HIT = CGFloat(10)

  private enum Region {
    case none
    case left
    case leftBottom
    case bottom
    case right
    case rightBottom
  }

  private var bottomHeight = CGFloat(0)
  private var region: Region = .none
  private var down: NSPoint?
  private var size: NSSize?
  private var trackLeft: NSView.TrackingRectTag?
  private var trackRight: NSView.TrackingRectTag?
  private var trackLeftBottom: NSView.TrackingRectTag?
  private var trackRightBottom: NSView.TrackingRectTag?
  private var trackBottom: NSView.TrackingRectTag?

  init (_ statusItem: StatusItem) {
    self.statusItem = statusItem
    super.init()
    animates = true
    behavior = .transient
    delegate = self
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }

  var height: Double {
    get {
      return Double(contentSize.height)
    }
    set {
      let newHeight = CGFloat(newValue)
      let newSize = NSSize(width: CGFloat(width), height: newHeight)
      contentSize = newSize
    }
  }

  var width: Double {
    get {
      return Double(contentSize.width)
    }
    set {
      let newWidth = CGFloat(newValue)
      let newSize = NSSize(width: newWidth, height: CGFloat(height))
      contentSize = newSize
    }
  }

  var minSize: NSSize {
    get {
      return UI.minSize
    }
    set {}
  }

  var maxSize: NSSize {
    get {
      return UI.maxSize
    }
    set {}
  }

  var canHide: Bool {
    get { return true }
    set {
      //
    }
  }

  // MARK: -  functions
  @objc open func toggle() {
    isShown ? hide() : show()
  }

  func show () {
    super.show(relativeTo: NSZeroRect, of: statusItem.button, preferredEdge: .minY)
    becomeFirstResponder()
  }

  func hide () {
    resignFirstResponder()
    close()
    statusItem.highlighted = false
  }

  func popoverShouldClose(_ popover: NSPopover) -> Bool {
    return !File.isPanelVisible
  }

  // Call this to get notified anytime the popover is resized
  func resized() {

  }

  override var contentViewController: NSViewController? {
    get {
      return super.contentViewController
    }
    set {
      super.contentViewController = newValue

      if let controller = contentViewController {
        contentSize = NSSize(
          width: controller.view.bounds.width,
          height: controller.view.bounds.height
        )

        if bottomHeight == 0 {
          bottomHeight = contentSize.height
        }

        setTrackers()
      } else {
        clearTrackers()
      }
    }
  }

  private func setTrackers() {
    clearTrackers()

    if let view = contentViewController?.view {
      var bounds = NSRect(
        x: 0, y: CORNER_HIT,
        width: SIDES_HIT, height: bottomHeight - CORNER_HIT
      )
      trackLeft = view.addTrackingRect(bounds, owner: self, userData: nil, assumeInside: false)

      bounds = NSRect(
        x: contentSize.width - SIDES_HIT, y: CORNER_HIT,
        width: SIDES_HIT, height: bottomHeight - CORNER_HIT
      )
      trackRight = view.addTrackingRect(bounds, owner: self, userData: nil, assumeInside: false)

      bounds = NSRect(
        x: 0, y: 0,
        width: CORNER_HIT, height: CORNER_HIT
      )
      trackLeftBottom = view.addTrackingRect(bounds, owner: self, userData: nil, assumeInside: false)

      bounds = NSRect(
        x: contentSize.width - CORNER_HIT, y: 0,
        width: CORNER_HIT, height: CORNER_HIT
      )
      trackRightBottom = view.addTrackingRect(bounds, owner: self, userData: nil, assumeInside: false)

      bounds = NSRect(x: CORNER_HIT, y: 0, width: contentSize.width - CORNER_HIT * 2, height: BOTTOM_HIT)
      trackBottom = view.addTrackingRect(bounds, owner: self, userData: nil, assumeInside: false)
    }
  }

  override func mouseEntered(with event: NSEvent) {

  }

  override func mouseDown(with event: NSEvent) {
    self.size = contentSize
    self.down = NSEvent.mouseLocation

    //        print("REGION: \(String(describing: region))")
    //        print("DOWN: \(String(describing: down))")
    //        print("SIZE: \(String(describing: self.contentSize))")
  }

  override func mouseMoved(with event: NSEvent) {
    Console.log("mouseMoved")
    if region == .none {
      switch event.trackingNumber {
      case trackLeft:
        region = .left
        break
      case trackRight:
        region = .right
        break
      case trackLeftBottom:
        region = .leftBottom
        break
      case trackRightBottom:
        region = .rightBottom
        break
      case trackBottom:
        region = .bottom
        break
      default:
        region = .none
      }
      Console.log(region)
      setCursor()
    }
  }

  override func mouseDragged(with event: NSEvent) {
    if region == .none {
      return
    }

    guard let size = size else { return }
    guard let down = down else { return }

    let location = NSEvent.mouseLocation

    var movedX = (location.x - down.x) * 2
    let movedY = location.y - down.y
    //        print("MOVE x: \(movedX), y: \(movedY)")

    if region == .left || region == .leftBottom {
      movedX = -movedX
    }

    var newWidth = size.width + movedX
    if newWidth < minSize.width {
      newWidth = minSize.width
    } else if newWidth > maxSize.width {
      newWidth = maxSize.width
    }

    var newHeight = size.height - movedY
    if newHeight < minSize.height {
      newHeight = minSize.height
    } else if newHeight > maxSize.height {
      newHeight = maxSize.height
    }

    switch region {
    case .left: fallthrough
    case .right:
      contentSize = NSSize(width: newWidth, height: contentSize.height)
    case .leftBottom: fallthrough
    case .rightBottom:
      contentSize = NSSize(width: newWidth, height: newHeight)
    case .bottom:
      contentSize = NSSize(width: contentSize.width, height: newHeight)
    default:
      ()
    }

    setCursor()
  }

  override func mouseUp(with event: NSEvent) {
    if region != .none {
      region = .none
      setCursor()
      setTrackers()
      down = nil

      resized()
    }
  }

  override func mouseExited(with event: NSEvent) {
    if down == nil {
      region = .none
      setCursor()
    }
  }

  private func setCursor(){
    let cursor = ({ () -> NSCursor in
      switch region {
      case .left,
           .right:
        return NSCursor.resizeLeftRight

      case .leftBottom,
           .rightBottom:
        return NSCursor.crosshair
      case .bottom:
        return NSCursor.resizeUpDown

      default: return NSCursor.arrow
      }
    })()

    cursor.set()
  }

  private func clearTrackers() {
    if let view = contentViewController?.view, let left = trackLeft, let right = trackRight, let leftBottom = trackLeftBottom, let rightBottom = trackRightBottom, let bottom = trackBottom {
      view.removeTrackingRect(left)
      view.removeTrackingRect(right)
      view.removeTrackingRect(rightBottom)
      view.removeTrackingRect(leftBottom)
      view.removeTrackingRect(bottom)
    }
  }

  deinit {
    clearTrackers()
  }
}
