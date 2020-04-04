//
//  NSObject.swift
//  eqMac
//
//  Created by Roman Kisil on 06/10/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

extension NSObject {
    var theClassName: String {
        return NSStringFromClass(type(of: self))
    }
}
