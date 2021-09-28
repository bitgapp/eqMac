//
//  Mutex.swift
//  eqMac
//
//  Created by Nodeful on 24/09/2021.
//  Copyright © 2021 Romans Kisils. All rights reserved.
//

import Foundation

class Mutex {
  var mutex = pthread_mutex_t()

  init () {
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

  func lock () {
    pthread_mutex_lock(&mutex)
  }

  func unlock () {
    pthread_mutex_unlock(&mutex)
  }

  deinit {
    pthread_mutex_destroy(&mutex)
  }
}
