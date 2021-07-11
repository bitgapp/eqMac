//
//  PopStatusItem.swift
//  PopStatusItem
//
//  Created by Adam Hartford on 4/24/15.
//  Copyright (c) 2015 Adam Hartford. All rights reserved.
//

import Cocoa
import EmitterKit

enum StatusItemIconType: String, Codable {
  case classic = "classic"
  case colored = "colored"
  case macOS = "macOS"
}

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

  private static let iconSize = NSMakeSize(20, 14)
  private static let speakerIconImages: [NSImage] = [
    NSImage(named: "speaker0")!.resize(with: iconSize),
    NSImage(named: "speaker1")!.resize(with: iconSize),
    NSImage(named: "speaker2")!.resize(with: iconSize),
    NSImage(named: "speaker3")!.resize(with: iconSize)
  ]
  private static let classicIconImage = NSImage(named: "statusBarIcon")!.resize(with: NSMakeSize(20, 20))
  static func getNativeImageFor (volume: Double, muted: Bool) -> NSImage {
    if muted || volume <= 0.01 {
      return speakerIconImages[0]
    }
    if volume <= 0.33 {
      return speakerIconImages[1]
    }
    if volume <= 0.66 {
      return speakerIconImages[2]
    }

    return speakerIconImages[3]
  }

  var iconType: StatusItemIconType = .classic {
    didSet {
      DispatchQueue.main.async {
        var image = StatusItem.classicIconImage
        switch (self.iconType) {
        case .classic:
          image.isTemplate = true
          break
        case .colored:
          image.isTemplate = false
          break
        case .macOS:
          image = StatusItem.getNativeImageFor(
            volume: Application.store.state.effects.volume.gain,
            muted: Application.store.state.effects.volume.muted
          )
          image.isTemplate = true
          break
        }
        self.button.image = image
      }
    }
  }
  
  var clicked = Event<Void>()
  var rightClicked = Event<Void>()
  private let dummyMenu = NSMenu()
  private let rightClickMenu = NSMenu()
  let rightClickGesture = NSClickGestureRecognizer()
  private var volumeGainChangedListener: EventListener<Double>!
  private var mutedChangedListener: EventListener<Bool>!

  let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
  var button: NSStatusBarButton!

  // MARK - Initialization
  public init() {
    self.button = item.button!
    // Listen to volume changes and apply icon
    self.volumeGainChangedListener = Volume.gainChanged.on { [weak self] _ in
      if (self != nil && self!.iconType == .macOS) {
        (self!.iconType = self!.iconType)
      }
    }
    self.mutedChangedListener = Volume.mutedChanged.on { [weak self] _ in
      if (self != nil && self!.iconType == .macOS) {
        (self!.iconType = self!.iconType)
      }
    }

    button.appearsDisabled = false
    button.target = self
    button.action = #selector(StatusItem.wasClicked(sender:))
    
    button.sendAction(on: [.leftMouseDown, .rightMouseDown])
    
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

