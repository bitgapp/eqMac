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
import AVFoundation

class Volume: StoreSubscriber {
  var state: VolumeState {
    return Application.store.state.volume
  }

  // MARK: - Events
  static var gainChanged = EmitterKit.Event<Double>()
  static var balanceChanged = EmitterKit.Event<Double>()
  static var mutedChanged = EmitterKit.Event<Bool>()
  static let boostEnabledChanged = EmitterKit.Event<Bool>()

  var mixer = AVAudioMixerNode()

  // MARK: - Properties
  var gain: Double = 1 {
    didSet {
      let device: AudioDevice! = Application.selectedDevice
      let volumeSupported = device.outputVolumeSupported
      let balanceSupported = device.outputBalanceSupported
      var virtualVolume: Double = 1
      if (gain <= 1) {
        if (volumeSupported) {
          Application.ignoreNextVolumeEvent = true
          device.setVirtualMasterVolume(Float32(gain), direction: .playback)
        } else {
          virtualVolume = gain
        }

        if (balanceSupported) {
          device.setVirtualMasterBalance(Float32(mapValue(value: balance, inMin: -1, inMax: 1, outMin: 0, outMax: 1)), direction: .playback)
          mixer.pan = 0
        } else {
          mixer.pan = Float(balance)
        }

        Driver.device!.setVirtualMasterVolume(Float32(gain), direction: .playback)
      } else { // gain > 1
        if (!boostEnabled) {
          Application.dispatchAction(VolumeAction.setGain(1, false))
          return
        }
        if (volumeSupported) {
          Application.ignoreNextVolumeEvent = true
          device.setVirtualMasterVolume(1.0, direction: .playback)
        }
        virtualVolume = mapValue(value: gain, inMin: 1, inMax: 2, outMin: 1, outMax: 6)

        if (balanceSupported) {
          device.setVirtualMasterBalance(Float32(mapValue(value: balance, inMin: -1, inMax: 1, outMin: 0, outMax: 1)), direction: .playback)
          mixer.pan = 0
        } else {
          mixer.pan = Float(balance)
        }

        Application.ignoreNextVolumeEvent = true
        Driver.device!.setVirtualMasterVolume(1, direction: .playback)
      }

      mixer.outputVolume = Float(virtualVolume)
      Volume.gainChanged.emit(gain)
      Application.ignoreNextVolumeEvent = false
      
      if (gain == 0) {
        Application.dispatchAction(VolumeAction.setMuted(true))
      } else if (muted) {
        Application.dispatchAction(VolumeAction.setMuted(false))
      }
    }
  }
  
  var muted: Bool = false {
    didSet {
      Driver.device!.mute = muted
      Application.selectedDevice!.mute = muted
      if (muted) {
        mixer.outputVolume = 0
      } else {
        (gain = gain)
      }
      Application.ignoreNextDriverMuteEvent = false
      Volume.mutedChanged.emit(muted)
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
      Volume.balanceChanged.emit(balance)
    }
  }

  var boostEnabled: Bool = true {
    didSet {
      if (boostEnabled != oldValue) {
        Volume.boostEnabledChanged.emit(boostEnabled)
        (gain = gain)
      }
    }
  }

  // MARK: - State
  typealias StoreSubscriberStateType = VolumeState
  
  private let changeGainThread = DispatchQueue(label: "change-volume", qos: .background)
  private var latestChangeGainTask: DispatchWorkItem?
  private func performOnChangeGainThread (_ code: @escaping () -> Void) {
    latestChangeGainTask?.cancel()
    latestChangeGainTask = DispatchWorkItem(block: code)
    changeGainThread.async(execute: latestChangeGainTask!)
  }

  func newState(state: VolumeState) {
    if (state.balance != balance) {
      performOnChangeGainThread { [weak self] in
        guard self != nil else { return }
        if (state.transition) {
          Transition.perform(from: self!.balance, to: state.balance) { balance in
            self!.balance = balance
          }
        } else {
          self!.balance = state.balance
        }
      }
    }
    
    if (state.gain != gain) {
      performOnChangeGainThread { [weak self] in
        guard self != nil else { return }
        if (state.transition) {
          Transition.perform(from: self!.gain, to: state.gain) { [weak self] gain in
            self?.gain = gain
          }
        } else {
          self!.gain = state.gain
        }
      }
    }
    
    if (state.muted != muted) {
      performOnChangeGainThread { [weak self] in
        guard self != nil else { return }
        self!.muted = state.muted
      }
    }

    if (state.boostEnabled != boostEnabled) {
      self.boostEnabled = state.boostEnabled
    }
  }
  
  // MARK: - Initialization
  init () {
    Console.log("Creating Volume")
    ({
      self.boostEnabled = state.boostEnabled
      self.balance = state.balance
      self.gain = state.gain
      self.muted = state.muted
    })()
    setupStateListener()
  }
  
  func setupStateListener () {
    Application.store.subscribe(self) { subscription in
      subscription.select { state in state.volume }
    }
  }

  func postSetup () {
    (gain = gain)
  }
  
}
