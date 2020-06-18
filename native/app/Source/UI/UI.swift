//
//  UI.swift
//  eqMac
//
//  Created by Roman Kisil on 24/12/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import Cocoa
import EmitterKit
import SwiftyUserDefaults
import WebKit
import Zip
import Alamofire

enum UIMode: String, Codable {
  case window = "window"
  case popover = "popover"
}

extension UIMode {
  static let allValues = [
    window.rawValue,
    popover.rawValue
  ]
}

class UI: StoreSubscriber {
  static var domain = Constants.UI_ENDPOINT_URL.host!
  static func unarchiveLocal () {
    // Unpack Archive
    let file = FileManager.default
        
    if !file.fileExists(atPath: appSupportUIZipPath.path) {
      Console.log("\(appSupportUIZipPath.path) doesnt exist")
      let bundleUIZipPath = Bundle.main.url(forResource: "ui", withExtension: "zip")!
      try! file.copyItem(at: bundleUIZipPath, to: appSupportUIZipPath)
    }
    
    try! Zip.unzipFile(appSupportUIZipPath, destination: localPath, overwrite: true, password: nil) // Unzip
  }
  
  static var appSupportUIZipPath: URL {
    return Application.supportPath.appendingPathComponent(
      "ui-\(Application.version).zip",
      isDirectory: false
    )
  }
  static var localPath: URL {
    return Application.supportPath.appendingPathComponent("ui")
  }
  
  static let storyboard = NSStoryboard(name: "Main", bundle: nil)
  static let statusItem = StatusItem(image: NSImage(named: "statusBarIcon")!)
  
  static var windowController: NSWindowController = (storyboard.instantiateController(withIdentifier: "EQMWindowController") as! NSWindowController)
  static var window: Window = (windowController.window! as! Window)
  static var viewController: ViewController = window.contentViewController as! ViewController

  static var popover = Popover(statusItem, viewController)

  
  static let loadingWindowController = storyboard.instantiateController(withIdentifier: "LoadingWindow") as! NSWindowController
  static let loadingWindow = loadingWindowController.window!
  static let loadingViewController = (loadingWindowController.contentViewController as! LoadingViewController)
  //    var popover: Popover!
  
  static var isShown: Bool {
    get {
      if (mode == .popover) {
        return popover.isShown
      } else {
        return UI.window.isShown
      }
    }
  }
  static var height: Double {
    get {
      if (mode == .popover) {
        return popover.height
      } else {
        return UI.window.height
      }
    }
    set {
      if (mode == .popover) {
        UI.popover.height = newValue
      } else {
        UI.window.height = newValue
      }
    }
  }
  
  static var width: Double {
    get {
      if (mode == .popover) {
        return popover.width
      } else {
        return UI.window.width
      }
    }
    set {
      if (mode == .popover) {
        UI.popover.width = newValue
      } else {
        UI.window.width = newValue
      }
    }
  }
  
  static var mode: UIMode = .window {
    willSet {
      if (newValue == .popover) {
        window.close()
        window.contentViewController = nil
        popover.popover.contentViewController = viewController
        popover.show()
      } else {
        popover.hide()
        popover.popover.contentViewController = nil
        window.contentViewController = viewController
        window.show()
      }
    }
  }
  
  static var canHide: Bool {
    get {
      if (mode == .popover) {
        return popover.canHide
      } else {
        return UI.window.canHide
      }
    }
    set {
      if (mode == .popover) {
        UI.popover.canHide = newValue
      } else {
        UI.window.canHide = newValue
      }
    }
  }
  
  static func toggle () {
    show()
  }
  
  static func show () {
    if (mode == .popover) {
      popover.show()
    } else {
      UI.window.show()
    }
    NSApp.activate(ignoringOtherApps: true)
  }
  
  static func close () {
    if (mode == .popover) {
      popover.hide()
    } else {
      UI.window.close()
    }
    NSApp.hide(self)
  }

  static func hide () {
    if (mode == .popover) {
      popover.hide()
    } else {
      UI.window.performMiniaturize(nil)
    }
  }
  
  static func showLoadingWindow (_ text: String) {
    UI.loadingViewController.label.stringValue = text
    UI.loadingWindow.makeKeyAndOrderFront(self)
    UI.loadingWindow.orderFrontRegardless()
    NSApp.activate(ignoringOtherApps: true)
  }
  
  static func hideLoadingWindow () {
    UI.loadingWindow.orderOut(self)
    NSApp.hide(self)
  }
  
  // Instance
  var statusItemClickedListener: EventListener<Void>!
  var bridge: Bridge!
  
  init () {
    UI.window.contentView = UI.viewController.view

    ({
      UI.mode = Application.store.state.ui.mode
      UI.width = Application.store.state.ui.width
      UI.height = Application.store.state.ui.height
    })()
    
    // TODO: Fix window position state saving (need to look if the current position is still accessible, what if the monitor isn't there anymore)
    //        if let windowPosition = Application.store.state.ui.windowPosition {
    //            window.position = windowPosition
    //        }
    setupStateListener()
    setupBridge()
    setupListeners()
    load()
  }
  
  func setupBridge () {
    bridge = Bridge(webView: UI.viewController.webView)
  }
  
  // MARK: - State
  public typealias StoreSubscriberStateType = UIState
  
  private func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.ui }
    }
  }
  
  func newState(state: UIState) {
    if (state.height != UI.height) {
      UI.height = state.height
    }
    if (state.width != UI.width) {
      UI.width = state.width
    }
    if (state.mode != UI.mode) {
      UI.mode = state.mode
    }
  }
  
  private func setupListeners () {
    statusItemClickedListener = UI.statusItem.clicked.on {_ in
      UI.toggle()
    }
  }
  
  private func load () {
    Networking.isReachable(UI.domain) { reachable in
      if reachable {
        Console.log("Loading Remote UI")
        UI.viewController.load(Constants.UI_ENDPOINT_URL)
        self.cacheRemote()
      } else {
        Console.log("Loading Local UI")
        UI.unarchiveLocal()
        let url = URL(string: "\(UI.localPath)/index.html")!
        UI.viewController.load(url)
      }
    }
    
  }
  
  private func cacheRemote () {
    // Only download ui.zip when UI endpoint is remote
    if Constants.UI_ENDPOINT_URL.absoluteString.contains(Constants.DOMAIN) {
      let destination: DownloadRequest.Destination = { _, _ in
        return (UI.appSupportUIZipPath, [.removePreviousFile, .createIntermediateDirectories])
      }
      AF.download("\(Constants.UI_ENDPOINT_URL)/ui.zip", to: destination).response { resp in
        if resp.error == nil {
          Console.log("Remote UI cached successfuly")
        } else {
          Console.log("Failed to cache Remote UI. Error: ", resp.error as Any)
        }
      }
    }
  }
}
