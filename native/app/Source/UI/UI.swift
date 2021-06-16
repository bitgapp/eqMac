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
import SwiftHTTP

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

  static func unarchiveZip () {
    // Unpack Archive
    let fs = FileManager.default
    
    if fs.fileExists(atPath: remoteZipPath.path) {
      try! Zip.unzipFile(remoteZipPath, destination: localPath, overwrite: true, password: nil) // Unzip
    } else {
      if !fs.fileExists(atPath: localZipPath.path) {
        Console.log("\(localZipPath.path) doesnt exist")
        let bundleUIZipPath = Bundle.main.url(forResource: "ui", withExtension: "zip", subdirectory: "Embedded")!
        try! fs.copyItem(at: bundleUIZipPath, to: localZipPath)
      }
      try! Zip.unzipFile(localZipPath, destination: localPath, overwrite: true, password: nil) // Unzip
    }
  }
  
  static var localZipPath: URL {
    return Application.supportPath.appendingPathComponent(
      "ui-\(Application.version) (Local).zip",
      isDirectory: false
    )
  }
  
  static var remoteZipPath: URL {
    return Application.supportPath.appendingPathComponent(
      "ui-\(Application.version) (Remote).zip",
      isDirectory: false
    )
  }
  static var localPath: URL {
    return Application.supportPath.appendingPathComponent("ui")
  }
  
  static let statusItem = StatusItem(image: NSImage(named: "statusBarIcon")!)

  static let storyboard = NSStoryboard(name: "Main", bundle: Bundle.main)

  static var windowController: NSWindowController = (
    storyboard.instantiateController(
      withIdentifier: "EQMWindowController"
    ) as! NSWindowController)
  static var window: Window = (windowController.window! as! Window)
  static var popover = Popover(statusItem)

  static var viewController = (
    storyboard.instantiateController(
      withIdentifier: "EQMViewController"
    ) as! ViewController)


  static var cachedIsShown: Bool = false
  static var isShownChanged = Event<Bool>()
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
      DispatchQueue.main.async {
        if (newValue == .popover) {
          window.close()
          window.resignFirstResponder()
          window.contentViewController = nil
          popover.popover.contentViewController = viewController
          popover.popover.becomeFirstResponder()
        } else {
          popover.hide()
          popover.popover.resignFirstResponder()
          popover.popover.contentViewController = nil
          window.contentViewController = viewController
          window.becomeFirstResponder()
        }
        UI.show()
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
    DispatchQueue.main.async {
      if (mode == .popover) {
        popover.show()
      } else {
        window.show()
      }
      NSApp.activate(ignoringOtherApps: true)
    }
  }
  
  static func close () {
    DispatchQueue.main.async {
      if (mode == .popover) {
        popover.hide()
      } else {
        window.close()
      }
      NSApp.hide(self)
    }
  }

  static func hide () {
    DispatchQueue.main.async {
      if (mode == .popover) {
        popover.hide()
      } else {
        window.performMiniaturize(nil)
      }
    }
  }
  
  // Instance
  static var statusItemClickedListener: EventListener<Void>!
  static var bridge: Bridge!
  
  init (_ completion: @escaping () -> Void) {
    DispatchQueue.main.async {

      func setup () {
        ({
          UI.mode = Application.store.state.ui.mode
          UI.width = Application.store.state.ui.width
          UI.height = Application.store.state.ui.height
        })()

        // TODO: Fix window position state saving (need to look if the current position is still accessible, what if the monitor isn't there anymore)
        //        if let windowPosition = Application.store.state.ui.windowPosition {
        //            window.position = windowPosition
        //        }
        self.setupStateListener()
        UI.setupBridge()
        UI.setupListeners()
        UI.load()

        func checkIfVisible () {
          let shown = UI.isShown
          if (UI.cachedIsShown != shown) {
            UI.cachedIsShown = shown
            UI.isShownChanged.emit(shown)
          }
          Utilities.delay(1000) { checkIfVisible() }
        }

        checkIfVisible()
        completion()
      }

      if (!UI.viewController.isViewLoaded) {
        UI.viewController.loaded.once {
          setup()
        }
        let _ = UI.viewController.view
      } else {
        setup()
      }


    }

  }
  
  static func reload () {
    viewController.webView.reload()
  }
  
  static func setupBridge () {
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
  
  private static func setupListeners () {
    statusItemClickedListener = UI.statusItem.clicked.on {_ in
      UI.toggle()
    }
  }
  
  static var hasLoaded = false
  static var loaded = Event<Void>()
  
  static func whenLoaded (_ completion: @escaping () -> Void) {
    if hasLoaded { return completion() }
    UI.loaded.once {
      completion()
    }
  }
  
  private static func load () {
    hasLoaded = false
    
    func startUILoad (_ url: URL) {
      DispatchQueue.main.async {
        UI.viewController.load(url)
      }
    }
    
    remoteIsReachable() { reachable in
      if reachable {
        Console.log("Loading Remote UI")
        startUILoad(Constants.UI_ENDPOINT_URL)
        self.getRemoteVersion { remoteVersion in
          if remoteVersion != nil {
            let fs = FileManager.default
            if fs.fileExists(atPath: UI.remoteZipPath.path) {
              UI.unarchiveZip()
              let currentVersion = try? String(contentsOf: UI.localPath.appendingPathComponent("version.txt"))
              if (currentVersion?.trim() != remoteVersion?.trim()) {
                self.cacheRemote()
              }
            } else {
              self.cacheRemote()
            }
          }
        }
      } else {
        Console.log("Loading Local UI")
        UI.unarchiveZip()
        let url = URL(string: "\(UI.localPath)/index.html")!
        startUILoad(url)
      }
    }
  }
  
  private static func getRemoteVersion (_ completion: @escaping (String?) -> Void) {
    HTTP.GET("\(Constants.UI_ENDPOINT_URL)/version.txt") { resp in
      completion(resp.error != nil ? nil : resp.text?.trim())
    }
  }
  
  private static func remoteIsReachable (_ completion: @escaping (Bool) -> Void) {
    var returned = false
    Networking.checkConnected { reachable in
      if (!reachable) {
        returned = true
        return completion(false)
      }

      HTTP.GET(Constants.UI_ENDPOINT_URL.absoluteString) { response in
        returned = true
        completion(response.error == nil)
      }
    }
    
    Utilities.delay(1000) {
      if (!returned) {
        returned = true
        completion(false)
      }
    }
  }
  
  private static func cacheRemote () {
    // Only download ui.zip when UI endpoint is remote
    if Constants.UI_ENDPOINT_URL.absoluteString.contains(Constants.DOMAIN) {
      let remoteZipUrl = "\(Constants.UI_ENDPOINT_URL)/ui.zip"
      Console.log("Caching Remote UI from \(remoteZipUrl)")
      let download = HTTP(URLRequest(urlString: remoteZipUrl)!)
      
      download.run() { resp in
        Console.log("Finished caching Remote UI")
        if resp.error == nil {
          do {
            try resp.data.write(to: UI.remoteZipPath, options: .atomic)
          } catch {
            print(error)
          }
        }
      }

    }
  }
}
