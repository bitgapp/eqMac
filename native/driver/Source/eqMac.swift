//
//  eqMac.swift
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

@objc
class eqMac: NSObject {

  @objc
  static func create (allocator: CFAllocator!, requestedTypeUUID: CFUUID!) -> UnsafeMutablePointer<AudioServerPlugInDriverRef>? {
    return nil
  }

}
