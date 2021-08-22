//
//  Misc.swift
//  eqMac
//
//  Created by Nodeful on 16/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

// MARK: - Pure Functions
func log (_ msg: String) {
  if DEBUG {
    let message = "coreaudiod: eqMac - \(msg)"
    Swift.print(message)
    NSLog(message)
  }
}

