//
//  Time.swift
//  eqMac
//
//  Created by Romans Kisils on 30/06/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation


class Time {
    static var stamp: UInt {
        get {
            return UInt(NSDate().timeIntervalSince1970 * 1000)
        }
    }
}
