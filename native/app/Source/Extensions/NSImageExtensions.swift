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

  var base64String: String? {
    guard let rep = NSBitmapImageRep(
      bitmapDataPlanes: nil,
      pixelsWide: Int(size.width),
      pixelsHigh: Int(size.height),
      bitsPerSample: 8,
      samplesPerPixel: 4,
      hasAlpha: true,
      isPlanar: false,
      colorSpaceName: .calibratedRGB,
      bytesPerRow: 0,
      bitsPerPixel: 0
    ) else {
      print("Couldn't create bitmap representation")
      return nil
    }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    draw(at: NSZeroPoint, from: NSZeroRect, operation: .sourceOver, fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()

    guard let data = rep.representation(using: NSBitmapImageRep.FileType.png, properties: [NSBitmapImageRep.PropertyKey.compressionFactor: 0.0]) else {
      print("Couldn't create PNG")
      return nil
    }

    // With prefix
     return "data:image/png;base64,\(data.base64EncodedString(options: []))"
    // Without prefix
//    return data.base64EncodedString(options: [])
  }
}
