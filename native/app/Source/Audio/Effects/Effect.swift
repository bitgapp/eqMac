//
//  Effect.swift
//  eqMac
//
//  Created by Roman Kisil on 08/07/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import EmitterKit
import AVFoundation

class Effect {
  var node: AVAudioNode!
  var enabledChanged = Event<Bool>()
  var engine: Engine?
  var name: String {
    return String(describing: self)
  }
  
  var enabled: Bool = false {
    didSet {
      enabledDidSet()
      enabledChanged.emit(enabled)
    }
  }
  
  func enabledDidSet () {
    if (enabled) {
//      node.
    } else {
//      node.stop()
    }
  }
  
  func wasAttachedTo (engine: Engine) {
    self.engine = engine
  }
  
  func wasDetachedFrom (engine: Engine) {
    self.engine = nil
  }
  
}
