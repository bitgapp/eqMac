//
//  Equalizers.swift
//  eqMac
//
//  Created by Roman Kisil on 22/07/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

//
//  Equalizers.swift
//  eqMac
//
//  Created by Roman Kisil on 16/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import AVFoundation
import EmitterKit
import SwiftyUserDefaults

enum EqualizerType : String, Codable {
  case basic = "Basic"
  case advanced = "Advanced"
}

let AllEqualizerTypes = [
  EqualizerType.basic.rawValue,
  EqualizerType.advanced.rawValue,
]

class Equalizers: Effect, StoreSubscriber {
  // MARK: - Events
  static let typeChanged = Event<EqualizerType>()
  
  // MARK: - Properties
  var type: EqualizerType = Application.store.state.effects.equalizers.type {
    didSet {
      if oldValue != type {
        Equalizers.typeChanged.emit(type)
      }
    }
  }
  
  var state: EqualizersState {
    return Application.store.state.effects.equalizers
  }
  
  var active: Equalizer?

  // MARK: - State
  typealias StoreSubscriberStateType = EqualizersState
  
  // MARK: - Initialization
  override init () {
    Console.log("Creating Equalizers")
    super.init()

    ({
      type = state.type
      setCorrectActiveEqualizer()
      
      enabled = state.enabled
    })()

    setupStateListener()
  }
  
  private func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.effects.equalizers }
    }
  }
  
  internal func newState(state: EqualizersState) {
    if (state.enabled != enabled) {
      enabled = state.enabled
    }
    if (type != state.type) {
      type = state.type
    }
  }
    
  internal func setCorrectActiveEqualizer () {
    switch type {
    case .basic:
      active = BasicEqualizer()
    case .advanced:
      active = AdvancedEqualizer()
    }
  }

  override func enabledDidSet() {
    active?.enabled = enabled
  }

  deinit {
    Application.store.unsubscribe(self)
  }
}
