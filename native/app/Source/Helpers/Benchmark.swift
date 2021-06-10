//
//  Benchmark.swift
//  eqMac
//
//  Created by Nodeful on 09/06/2021.
//  Copyright © 2021 Romans Kisils. All rights reserved.
//

import CoreFoundation

class Benchmark {
  let startTime:CFAbsoluteTime
  var endTime:CFAbsoluteTime?

  init () {
    startTime = CFAbsoluteTimeGetCurrent()
  }

  func end () -> CFAbsoluteTime {
    endTime = CFAbsoluteTimeGetCurrent()

    return duration!
  }

  var duration: CFAbsoluteTime? {
    if let endTime = endTime {
      return (endTime - startTime) * 1000
    } else {
      return nil
    }
  }
}
