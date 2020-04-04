//
//  Events.swift
//  eqMac
//
//  Created by Romans Kisils on 24/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyJSON

class EngineDataBus: DataBus {
    required init (route: String, bridge: Bridge) {
        super.init(route: route, bridge: bridge)
        
        self.add("/volume", VolumeDataBus.self)
        self.add("/effects", EffectsDataBus.self)
        self.add("/outputs", OutputsDataBus.self)
    }
}
