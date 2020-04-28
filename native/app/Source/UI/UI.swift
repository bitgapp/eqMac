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
//import Swifter
import Criollo
import Alamofire

enum UIMode: String, DefaultsSerializable {
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
  static func unarchiveLocal () {
    // Unpack Archive
    let file = FileManager.default
    
    let appSupportUIZipPath = Application.supportPath.appendingPathComponent("ui.zip", isDirectory: false)
    
    if !file.fileExists(atPath: appSupportUIZipPath.path) {
      Console.log("\(appSupportUIZipPath.path) doesnt exist")
      let bundleUIZipPath = Bundle.main.url(forResource: "ui", withExtension: "zip")!
      try! file.copyItem(at: bundleUIZipPath, to: appSupportUIZipPath)
    }
    
    try! Zip.unzipFile(appSupportUIZipPath, destination: localPath, overwrite: true, password: nil) // Unzip
  }
  
  static var localPath: URL {
    return Application.supportPath.appendingPathComponent("ui")
  }
  
  static var server: CRHTTPServer?
  
  static func startLocalServer () -> UInt {
    unarchiveLocal()
    if (server != nil) {
      server!.stopListening()
    }
    server = CRHTTPServer()
    let port = Networking.getAvailabilePort(Constants.UI_SERVER_PREFERRED_PORT)
    server!.mount("/", directoryAtPath: localPath.path, options: .autoIndex)
    server!.startListening(nil, portNumber: port)
    Console.log("Started UI Local server on port: \(port). Sharing files: \(localPath.path)")
    return port
  }
  
  static let storyboard = NSStoryboard(name: "Main", bundle: nil)
  static let statusItem = StatusItem(image: NSImage(named: "statusBarIcon")!)
  
  static let windowController = storyboard.instantiateController(withIdentifier: "EQMWindow") as! NSWindowController
  static let viewController = (windowController.contentViewController as! ViewController)
  static let window = (windowController.window! as! Window)
  
  static let loadingWindowController = storyboard.instantiateController(withIdentifier: "LoadingWindow") as! NSWindowController
  static let loadingWindow = loadingWindowController.window!
  static let loadingViewController = (loadingWindowController.contentViewController as! LoadingViewController)
  //    var popover: Popover!
  
  static var isShown: Bool {
    get {
      return UI.window.isShown
    }
  }
  static var height: Double {
    get {
      return UI.window.height
    }
    set {
      UI.window.height = newValue
    }
  }
  
  static var width: Double {
    get {
      return UI.window.width
    }
    set {
      UI.window.width = newValue
    }
  }
  
  static var canHide: Bool {
    get {
      return UI.window.canHide
    }
    set {
      UI.window.canHide = newValue
    }
  }
  
  static func toggle () {
    show()
  }
  
  static func show () {
    UI.window.show()
    NSApp.activate(ignoringOtherApps: true)
  }
  
  static func hide () {
    UI.window.hide()
    NSApp.hide(self)
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
    
  }
  
  private func setupListeners () {
    statusItemClickedListener = UI.statusItem.clicked.on {_ in
      UI.toggle()
    }
  }
  
  private func load () {
    UI.viewController.load(Constants.UI_ENDPOINT_URL, { success in
      if success {
        Console.log("Remote UI loaded")
        self.cacheRemote()
      } else {
        let port = UI.startLocalServer()
        let url = URL(string: "http://localhost:\(port)/index.html")!
        UI.viewController.load(url, { success in
          if success {
            Console.log("Local UI loaded")
          } else {
            Console.log("Local UI failed to Load")
          }
        })
      }
    })
  }
  
  private func cacheRemote () {
    // Only download ui.zip when UI endpoint is remote
    if Constants.UI_ENDPOINT_URL.absoluteString.contains(Constants.DOMAIN) {
      let destination: DownloadRequest.Destination = { _, _ in
          let fileURL = Application.supportPath.appendingPathComponent("ui.zip", isDirectory: false)
          return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
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
