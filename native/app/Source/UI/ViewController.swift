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

class ViewController: NSViewController, WKNavigationDelegate {
  // MARK: - Properties
  @IBOutlet var webView: EQMWebView!
  @IBOutlet var draggableView: DraggableView!
  @IBOutlet var loadingView: NSView!
  @IBOutlet var loadingSpinner: NSProgressIndicator!
  
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
  override func viewDidLoad() {
    super.viewDidLoad()
    loadingSpinner.startAnimation(nil)
  }
  
  func load () {
    remoteReachable() { reachable in
      if (reachable) {
        Console.log("Remote UI Reachable")
        self.loadRemote()
      } else {
        Console.log("Remote UI Unreachable. Loading Local")
        self.loadLocal()
      }
      Utilities.delay(1000) {
        self.loadingView.isHidden = true
        self.loadingSpinner.stopAnimation(nil)
      }
      
    }
    if Constants.DEBUG {
      self.webView.configuration.preferences.setValue(true, forKey: "developerExtrasEnabled")
    }
  }
  
  private var isTryingToLoadRemote = false
  
  private var remoteReached = Event<Void>()
  private var remoteUnavailable = Event<Void>()
  
  private var testWebView: WKWebView!
  private func remoteReachable (_ callback: @escaping (Bool) -> Void) {
    testWebView = WKWebView()
    testWebView.navigationDelegate = self
    let url = URL(string: Constants.UI_ENDPOINT_URL)
    let request = URLRequest(url: url!)
    isTryingToLoadRemote = true
    testWebView.load(request)
    
    remoteReached.once {
      callback(true)
    }
    remoteUnavailable.once {
      callback(false)
    }
  }
  
  private func loadRemote () {
    let url = URL(string: Constants.UI_ENDPOINT_URL)
    let request = URLRequest(url: url!)
    isTryingToLoadRemote = true
    self.webView.load(request)
  }
  
  private func loadLocal () {
    let port = UI.startLocal()
    let request = URLRequest(url: URL(string: "http://localhost:\(port)/index.html")!)
    self.webView.load(request)
  }
  
  // MARK: - Listeners
  override func viewWillAppear() {
    super.viewWillAppear()
  }
  
  func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
    let cred = URLCredential(trust: challenge.protectionSpace.serverTrust!)
    completionHandler(.useCredential, cred)
  }
  
  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    if (isTryingToLoadRemote) {
      remoteUnavailable.emit()
    }
  }
  
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if (isTryingToLoadRemote) {
      remoteReached.emit()
    }
  }
}

class View: NSView {
  override func viewDidMoveToWindow() {
    
    //        guard let frameView = window?.contentView?.superview else {
    //            return
    //        }
    //
    //        let backgroundView = NSView(frame: frameView.bounds)
    //        backgroundView.wantsLayer = true
    //        backgroundView.layer?.backgroundColor = NSColor(red: 62 / 255, green: 62 / 255, blue: 62 / 255, alpha: 1).cgColor
    //        backgroundView.autoresizingMask = [.width, .height]
    //
    //        frameView.addSubview(backgroundView, positioned: .below, relativeTo: frameView)
    
  }
  
}
