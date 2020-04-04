//
//  ServerEvent.swift
//  eqMac
//
//  Created by Romans Kisils on 24/04/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import SwiftyJSON

struct DataBusEvent: Codable {
    let route: String
    let event: String
    let data: JSON
}
