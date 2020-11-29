//
//  Console.swift
//  eqMac
//
//  Created by Roman Kisil on 29/04/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

class Console {
  static func log (_ somethings: Any..., fileAbsolutePath: String = #file, line: Int = #line) {
    let file = fileAbsolutePath[fileAbsolutePath.range(of: "/app/")!.upperBound...]
    let dataFormatter = DateFormatter()
    dataFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSSS"
    print("\(dataFormatter.string(from: Date())) eqMac (\(file):\(line)) \(somethings.map { ($0 as AnyObject).debugDescription }.joined(separator: " "))")
  }
}

