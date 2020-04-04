//
//  LoadingViewController.swift
//  eqMac
//
//  Created by Romans Kisils on 16/02/2020.
//  Copyright © 2020 Romans Kisils. All rights reserved.
//

import Foundation
import Cocoa

class LoadingViewController: NSViewController {
  
  @IBOutlet var spinner: NSProgressIndicator!
  @IBOutlet var label: NSTextField!
  
  override func viewDidLoad() {
    spinner.usesThreadedAnimation = true
    spinner.startAnimation(nil)
  }
}
