//
//  NSImageExtensions.swift
//  eqMac
//
//  Created by Nodeful on 11/07/2021.
//  Copyright © 2021 Romans Kisils. All rights reserved.
//

import Foundation
import Cocoa

extension NSImage {
  func resize (with size: NSSize) -> NSImage {
    let newImage = NSImage(size: size)
    newImage.lockFocus()
    self.draw(
      in: NSMakeRect(0, 0, size.width, size.height),
      from: NSMakeRect(0, 0, self.size.width, self.size.height),
      operation: .sourceOver,
      fraction: CGFloat(1)
    )
    newImage.unlockFocus()
    newImage.size = size
    return newImage
  }
}
