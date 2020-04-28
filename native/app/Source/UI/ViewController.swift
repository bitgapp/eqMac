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
  @IBOutlet weak var webView: WKWebView!
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
  
  private var testWebView: WKWebView?
  var tryingToLoad = false
  var loadFinished = Event<Bool>()
  func load (_ url: URL, _ callback: ((Bool) -> Void)? = nil) {
    let request = URLRequest(url: url)
    
    if callback != nil {
      tryingToLoad = true
      testWebView = WKWebView()
      testWebView!.navigationDelegate = self
      loadFinished.once { success in
        self.testWebView!.stopLoading()
        self.testWebView!.removeFromSuperview()
        self.testWebView!.navigationDelegate = nil
        self.testWebView = nil
        callback!(success)
      }
      self.testWebView!.load(request)
    }
  
    if self.webView.isLoading {
      self.webView.stopLoading()
    }
    self.webView.load(request)

    
    Utilities.delay(1000) {
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
  
  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    if (tryingToLoad) {
      tryingToLoad = false
      loadFinished.emit(false)
    }
  }
  
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if (tryingToLoad) {
      tryingToLoad = false
      loadFinished.emit(true)
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
