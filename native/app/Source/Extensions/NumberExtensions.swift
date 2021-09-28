//
//  IntExtensions.swift
//  eqMac
//
//  Created by Roman Kisil on 14/01/2019.
//  Copyright © 2019 Roman Kisil. All rights reserved.
//

import Foundation

extension Double {
  func round(to places: Int) -> Double {
    let divisor = pow(10.0, Double(places))
    return (self * divisor).rounded() / divisor
  }
}


extension Float {
  func round(to places: Int) -> Float {
    let divisor = pow(10.0, Float(places))
    return (self * divisor).rounded() / divisor
  }
}
