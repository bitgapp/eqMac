//
//  EventInterceptor.swift
//  eqMac
//
//  Created by Roman Kisil on 18/01/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa

@objc(EventInterceptor)
class EventInterceptor: NSApplication {
  
  override func sendEvent (_ event: NSEvent) {
    if (event.type == .systemDefined && event.subtype.rawValue == 8) {
      let keyCode = ((event.data1 & 0xFFFF0000) >> 16)
      let keyFlags = (event.data1 & 0x0000FFFF)
      // Get the key state. 0xA is KeyDown, OxB is KeyUp
      let keyDown = (((keyFlags & 0xFF00) >> 8)) == 0xA
      
      if (keyDown) {
        switch Int32(keyCode) {
        case NX_KEYTYPE_SOUND_UP:
          Application.volumeChangeButtonPressed(direction: .UP, quarterStep: shiftPressed(event: event) && optionPressed(event: event))
          return
        case NX_KEYTYPE_SOUND_DOWN:
          Application.volumeChangeButtonPressed(direction: .DOWN, quarterStep: shiftPressed(event: event) && optionPressed(event: event))
          return
        case NX_KEYTYPE_MUTE:
          Application.muteButtonPressed()
          return
        default: break
        }
      }
    }
    if (event.type == .keyDown) {
      switch (event.characters) {
      case "w":
        if (commandPressed(event: event)) {
          UI.close()
        }
        break
      default:
        break
      }
    }
    super.sendEvent(event)
  }
  
  func shiftPressed (event: NSEvent) -> Bool {
    return event.modifierFlags.contains(.shift)
  }
  
  func optionPressed (event: NSEvent) -> Bool {
    return event.modifierFlags.contains(.option)
  }
  
  func commandPressed (event: NSEvent) -> Bool {
    return event.modifierFlags.contains(.command)
  }
  
}

