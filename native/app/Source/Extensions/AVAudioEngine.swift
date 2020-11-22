//
//  AVAudioEngine.swift
//  eqMac
//
//  Created by Romans Kisils on 29/12/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AVFoundation
import AMCoreAudio
import AudioToolbox

extension AVAudioEngine {
  func setInputDevice (_ device: AudioDevice) {
    var id = device.id
    checkErr(
      AudioUnitSetProperty(
        inputNode.audioUnit!,
        kAudioOutputUnitProperty_CurrentDevice,
        kAudioUnitScope_Input,
        0,
        &id,
        UInt32(MemoryLayout<AudioDeviceID>.size)
      )
    )
  }
  
  func setOutputDevice (_ device: AudioDevice) {
    var id = device.id
    checkErr(
      AudioUnitSetProperty(
        outputNode.audioUnit!,
        kAudioOutputUnitProperty_CurrentDevice,
        kAudioUnitScope_Output,
        0,
        &id,
        UInt32(MemoryLayout<AudioDeviceID>.size)
      )
    )
  }
}
