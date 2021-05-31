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
  EqualizerType.advanced.rawValue
]

class Equalizers: Effect, StoreSubscriber {
  // MARK: - Events
  static let typeChanged = Event<EqualizerType>()
  
  // MARK: - Properties
  private var _type: EqualizerType! {
    didSet {
      setCorrectActiveEqualizer()
    }
  }
  var type: EqualizerType! {
    return Application.store.state.effects.equalizers.type
  }
  
  var state: EqualizersState {
    return Application.store.state.effects.equalizers
  }
  
  var active: Equalizer!
  var basic: BasicEqualizer!
  var advanced: AdvancedEqualizer!
  
  // MARK: - State
  typealias StoreSubscriberStateType = EqualizersState
  
  // MARK: - Initialization
  override init () {
    Console.log("Creating Equalizers")
    super.init()
    basic = BasicEqualizer()
    advanced = AdvancedEqualizer()
    
    enabled = state.enabled
    _type = state.type
    
    setCorrectActiveEqualizer()
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
    if (_type != state.type) {
      _type = state.type
      Equalizers.typeChanged.emit(_type)
    }
  }
  
  internal func setCorrectActiveEqualizer () {
    switch type {
    case .basic?:
      active = basic
    case .advanced?:
      active = advanced
    default: break
    }
  }
  
  override func enabledDidSet() {
    basic.enabled = enabled
    advanced.enabled = enabled
  }
}
