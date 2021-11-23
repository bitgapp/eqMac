//
//  ViewController.swift
//  eqMac
//
//  Created by Roman Kisil on 10/12/2017.
//  Copyright © 2017 Roman Kisil. All rights reserved.
//

import Cocoa
import WebKit
import EmitterKit
import Shared

class ViewController: NSViewController, WKNavigationDelegate {
  // MARK: - Properties
  @IBOutlet var parentView: View!
  @IBOutlet var webView: WKWebView!
  @IBOutlet var draggableView: DraggableView!
  @IBOutlet var loadingView: NSView!
  @IBOutlet var loadingSpinner: NSProgressIndicator!
  let loaded = Event<Void>()

  var height: Double {
    get {
      return Double(webView.frame.size.height)
    }
    set {
      let newHeight = CGFloat(newValue)
      let newSize = NSSize(width: webView.frame.size.width, height: newHeight)
      self.view.setFrameSize(newSize)
    }
  }
  
  var width: Double {
    get {
      return Double(webView.frame.size.width)
    }
    set {
      let newWidth = CGFloat(newValue)
      let newSize = NSSize(width: newWidth, height: CGFloat(height))
      self.view.setFrameSize(newSize)
    }
  }

  // MARK: - Initialization
  override func viewDidLoad () {
    super.viewDidLoad()
    loadingSpinner.startAnimation(nil)
    loaded.emit()
  }

  func load (_ url: URL) {
    let request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalAndRemoteCacheData)
    if self.webView.isLoading {
      self.webView.stopLoading()
    }
    self.webView.load(request)

    
    Async.delay(1000) {
      self.loadingView.isHidden = true
      self.loadingSpinner.stopAnimation(nil)
    }

    if Constants.DEBUG {
      Console.log("Enabling DevTools")
      self.webView.configuration.preferences.setValue(true, forKey: "developerExtrasEnabled")
    }
  }
  
  // MARK: - Listeners
  override func viewWillAppear() {
    super.viewWillAppear()
  }
  
  func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
    let cred = URLCredential(trust: challenge.protectionSpace.serverTrust!)
    completionHandler(.useCredential, cred)
  }
  
}

class View: NSView {
  override var acceptsFirstResponder: Bool { true }
  override func keyDown(with event: NSEvent) {
    // This is an override to disable OS sound effects (beeps and boops) when pressing keys inside the view
  }
  
}
