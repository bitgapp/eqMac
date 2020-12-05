//
//  DraggableView.swift
//  eqMac
//
//  Created by Romans Kisils on 13/07/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import Cocoa

class DraggableView: NSView {
    override func mouseDragged(with event: NSEvent) {
      if #available(macOS 10.11, *) {
        event.window?.performDrag(with: event)
      }
    }
}
