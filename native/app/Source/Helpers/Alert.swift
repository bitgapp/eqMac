//
//  Alert.swift
//  eqMac
//
//  Created by Roman Kisil on 30/10/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AppKit

class Alert {
  static func info (title: String, message: String) {
    DispatchQueue.main.async {
      let alert = getAlert(title, message)
      alert.addButton(withTitle: "Ok")
      alert.runModal()
    }
  }
  
  static func confirm (
    title: String,
    message: String,
    okText: String = "Ok",
    cancelText: String = "Cancel",
    callback: @escaping (Bool) -> Void
  ) {
    withButtons(title: title, message: message, buttons: [okText, cancelText]) { buttonPressed in
      let result = NSApplication.ModalResponse(buttonPressed) == .alertFirstButtonReturn
      callback(result)
    }
  }
  
  static func prompt (
    title: String,
    message: String,
    okText: String = "Save",
    cancelText: String = "Cancel",
    callback: @escaping (String?) -> Void
  ) {
    DispatchQueue.main.async {
      let alert = getAlert(title, message)
      alert.addButton(withTitle: okText)
      alert.addButton(withTitle: cancelText)
      let input = NSTextField(frame: NSMakeRect(0, 0, 200, 24))
      input.stringValue = ""
      alert.accessoryView = input
      if (alert.runModal() == .alertFirstButtonReturn) {
        input.validateEditing()
        callback(input.stringValue == "" ? nil : input.stringValue)
      }
      callback(nil)
    }
    
  }
  
  static func withButtons (
    title: String,
    message: String,
    buttons: [String],
    callback: @escaping (Int) -> Void
  ) {
    DispatchQueue.main.async {
      let alert = getAlert(title, message)
      for text in buttons {
        alert.addButton(withTitle: text)
      }
      let result = alert.runModal()
      callback(result.rawValue)
    }
    
  }
  
  static private func getAlert (_ title: String, _ message: String) -> NSAlert {
    let alert = NSAlert()
    alert.messageText = title
    alert.informativeText = message
    return alert
  }
}
