//
//  DateExtensions.swift
//  eqMac
//
//  Created by Nodeful on 15/05/2021.
//  Copyright © 2021 Romans Kisils. All rights reserved.
//

import Foundation

extension Date {
  static func - (lhs: Date, rhs: Date) -> TimeInterval {
    return lhs.timeIntervalSinceReferenceDate - rhs.timeIntervalSinceReferenceDate
  }
  
  static func from (isoString: String) -> Date? {
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    return formatter.date(from: isoString)
  }
}
