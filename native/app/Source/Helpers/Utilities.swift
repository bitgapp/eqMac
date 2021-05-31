//
//  Utilities.swift
//  eqMac
//
//  Created by Roman Kisil on 13/02/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

class Utilities {
  static func mapValue(value: Double, inMin: Double, inMax: Double, outMin: Double, outMax: Double) -> Double {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }
  
  static func getValueFromInfoPlist (_ key: String) -> String {
    return Bundle.main.infoDictionary![key] as! String
  }
  
  static func delay (_ milliseconds: UInt, completion: @escaping () -> ()) {
    DispatchQueue.main.asyncAfter(deadline: .now() + Double(milliseconds) / 1000) { completion() }
  }
}
