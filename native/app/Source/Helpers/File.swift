//
//  File.swift
//  eqMac
//
//  Created by Romans Kisils on 16/06/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AppKit

class File {
  static var openPanel = NSOpenPanel()
  static var savePanel = NSSavePanel()
  
  static func select (_ callback: @escaping (URL?) -> Void) {
    DispatchQueue.main.async {
      openPanel.selectSingleFile() { response in
        if response == .OK {
          callback(openPanel.url)
        } else {
          callback(nil)
        }
      }
    }
  }
  
  static func save (extensions: [String]?, _ callback: @escaping (URL?) -> Void) {
      DispatchQueue.main.async {
        savePanel.saveFile(extensions: extensions) { response in
          if response == .OK {
            callback(savePanel.url)
          } else {
            callback(nil)
          }
        }
      }
  }
  
  static var isPanelVisible: Bool {
    return File.openPanel.isVisible || File.savePanel.isVisible
  }
}
