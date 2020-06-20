//
//  Volume.swift
//  eqMac
//
//  Created by Roman Kisil on 14/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import EmitterKit
import AMCoreAudio
import AudioKit

class Volume: StoreSubscriber {
  // MARK: - Events
  var gainChanged = EmitterKit.Event<Double>()
  var balanceChanged = EmitterKit.Event<Double>()
  var mutedChanged = EmitterKit.Event<Bool>()
  
  // MARK: - Properties
  var gain: Double = 1 {
    didSet {
      let device: AudioDevice! = Application.selectedDevice
      let volumeSupported = device.outputVolumeSupported
      let balanceSupported = device.outputBalanceSupported
      
      var newLeftGain: Double = gain
      var newRightGain: Double = gain
      if (gain > 1) {
        if (volumeSupported) {
          device.setVirtualMasterVolume(1.0, direction: .playback)
          if (balanceSupported) {
            device.setVirtualMasterBalance(Float32(Utilities.mapValue(value: balance, inMin: -1, inMax: 1, outMin: 0, outMax: 1)), direction: .playback)
          } else {
            if (balance > 0) {
              newLeftGain = gain * (Utilities.mapValue(value: Double(balance), inMin: 0, inMax: 1, outMin: 1, outMax: 0))
            } else if (balance < 0) {
              newRightGain = gain * Utilities.mapValue(value: Double(balance), inMin: 0, inMax: -1, outMin: 1, outMax: 0)
            }
          }
          device.setVirtualMasterVolume(1.0, direction: .playback)
        } else {
          if (balance > 0) {
            newLeftGain = gain * (Utilities.mapValue(value: Double(balance), inMin: 0, inMax: 1, outMin: 1, outMax: 0))
          } else if (balance < 0) {
            newRightGain = gain * Utilities.mapValue(value: Double(balance), inMin: 0, inMax: -1, outMin: 1, outMax: 0)
          }
        }
        
        if let driver = Driver.device {
          driver.setVirtualMasterVolume(1, direction: .playback)
        }
      } else {
        if (volumeSupported) {
          device.setVirtualMasterVolume(Float32(gain), direction: .playback)
          if (balanceSupported) {
            device.setVirtualMasterBalance(Float32(Utilities.mapValue(value: balance, inMin: -1, inMax: 1, outMin: 0, outMax: 1)), direction: .playback)
            newRightGain = 1
            newLeftGain = 1
          } else {
            if (balance > 0) {
              newLeftGain = (Utilities.mapValue(value: Double(balance), inMin: 0, inMax: 1, outMin: 1, outMax: 0))
            } else if (balance < 0) {
              newRightGain = Utilities.mapValue(value: Double(balance), inMin: 0, inMax: -1, outMin: 1, outMax: 0)
            }
          }
        } else {
          if (balance > 0) {
            newLeftGain = gain * (Utilities.mapValue(value: Double(balance), inMin: 0, inMax: 1, outMin: 1, outMax: 0))
          } else if (balance < 0) {
            newRightGain = gain * Utilities.mapValue(value: Double(balance), inMin: 0, inMax: -1, outMin: 1, outMax: 0)
          }
        }
        
        Driver.device!.setVirtualMasterVolume(Float32(gain), direction: .playback)
      }
      
      leftGain = newLeftGain
      rightGain = newRightGain
      
      if (!volumeSupported) {
        Driver.device!.mute = false
        device.mute = false
      }
      
      let shouldMute = gain == 0.0
      Driver.device!.mute = shouldMute
      device.mute = shouldMute
      
      
      gainChanged.emit(gain)
      
    }
  }
  
  var muted: Bool = false {
    didSet {
      if (muted) {
        leftGain = 0
        rightGain = 0
      } else {
        (gain = gain)
      }
      mutedChanged.emit(muted)
    }
  }
  
  var balance: Double = 0 {
    didSet {
      if (balance > 1) {
        balance = 1
        return
      }
      if (balance < -1) {
        balance = -1
        return
      }
      (gain = gain)
      balanceChanged.emit(balance)
    }
  }
  
  // MARK: - Private Properties
  private var leftGain: Double = 1 {
    didSet {
      booster.leftGain = leftGain
    }
  }
  
  private var rightGain: Double = 1 {
    didSet {
      booster.rightGain = rightGain
    }
  }
  
  var booster: AKBooster!
  
  // MARK: - State
  typealias StoreSubscriberStateType = VolumeState
  
  func newState(state: VolumeState) {
    if (state.balance != balance) {
      if (state.transition) {
        Transition.perform(from: balance, to: state.balance) { balance in
          self.balance = balance
        }
      } else {
        balance = state.balance
      }
    }
    
    if (state.gain != gain) {
      if (state.transition) {
        Transition.perform(from: gain, to: state.gain) { gain in
          self.gain = gain
        }
      } else {
        gain = state.gain
      }
    }
    
    if (state.muted != muted) {
      muted = state.muted
    }
  }
  
  // MARK: - Initialization
  init () {
    Console.log("Creating Volume")
    booster = AKBooster()
    booster.detach()
    
    setupStateListener()
  }
  
  func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.effects.volume }
    }
  }
  
}
