//
//  User.swift
//  eqMac
//
//  Created by Roman Kisil on 24/12/2017.
//  Copyright © 2017 Roman Kisil. All rights reserved.
//

import Cocoa

class User: NSObject {
  static public var isFirstLaunch: Bool {
    let firstLaunch = Storage[.isFirstLaunch] ?? true
    Storage[.isFirstLaunch] = false
    return firstLaunch
  }
}
