//
//  MiscRoute.swift
//  eqMac
//
//  Created by Roman Kisil on 30/04/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import SwiftyJSON

class TransitionDataBus: DataBus {
  required init(route: String, bridge: Bridge) {
    super.init(route: route, bridge: bridge)
    
    self.on(.GET, "/") { data, _ in
      return [
        "fps": Constants.TRANSITION_FPS,
        "frameCount": Constants.TRANSITION_FRAME_COUNT,
        "frameDuration": Constants.TRANSITION_FRAME_DURATION,
        "duration": Constants.TRANSITION_DURATION
      ]
    }
  }
}

