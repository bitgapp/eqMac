//
//  Mutex.swift
//  eqMac
//
//  Created by Nodeful on 24/09/2021.
//  Copyright © 2021 Romans Kisils. All rights reserved.
//

import Foundation

public class Mutex {
  public var mutex = pthread_mutex_t()

  public init () {
    var attributes = pthread_mutexattr_t()
    guard pthread_mutexattr_init(&attributes) == 0 else {
      preconditionFailure()
    }

    pthread_mutexattr_settype(&attributes, PTHREAD_MUTEX_NORMAL)

    guard pthread_mutex_init(&mutex, &attributes) == 0 else {
      preconditionFailure()
    }

    pthread_mutexattr_destroy(&attributes)
  }

  public func lock () {
    pthread_mutex_lock(&mutex)
  }

  public func unlock () {
    pthread_mutex_unlock(&mutex)
  }

  deinit {
    pthread_mutex_destroy(&mutex)
  }
}
