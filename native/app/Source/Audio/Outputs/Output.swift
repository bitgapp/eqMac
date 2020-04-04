//
//  Output.swift
//  eqMac
//
//  Created by Roman Kisil on 05/11/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AMCoreAudio
import SwiftyUserDefaults
import EmitterKit
import AVFoundation

class Output {
  static var allowedDevices: [AudioDevice] {
    return AudioDevice.allOutputDevices()
      .filter({ device in
        if let uid = device.uid {
          if (uid == Constants.PASSTHROUGH_DEVICE_UID || Constants.LEGACY_DRIVER_UIDS.contains(uid)) {
            return false
          }
        }
        return device.transportType != nil && Constants.SUPPORTED_TRANSPORT_TYPES.contains(device.transportType!)
      })
  }

  let outputRenderCallback: AURenderCallback = {
    (inRefCon: UnsafeMutableRawPointer,
    ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
    inTimeStamp:  UnsafePointer<AudioTimeStamp>,
    inBusNumber: UInt32,
    inNumberFrames: UInt32,
    ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in
//    Console.log("Output Started")

    let abl = UnsafeMutableAudioBufferListPointer(ioData)!
    let output = Unmanaged<Output>.fromOpaque(inRefCon).takeUnretainedValue()
    let engine: Engine! = output.engine!
    var inTS = AudioTimeStamp()
    var outTS = AudioTimeStamp()
    let inputDevice = Driver.device!

    if AudioDeviceGetCurrentTime(inputDevice.id, &inTS) != noErr {
      makeBufferSilent(abl)
      return noErr
    }

    if AudioDeviceGetCurrentTime(output.device.id, &outTS) != noErr {
      makeBufferSilent(abl)
      return noErr
    }

    output.varispeed.rate = Float(inTS.mRateScalar / outTS.mRateScalar)

    let sampleTime = inTimeStamp.pointee.mSampleTime
    if output.firstOutputTime < 0 {
      output.firstOutputTime = sampleTime
      let delta = engine.lastSampleTime - output.firstOutputTime
      Console.log("Last Input Time: ", engine.lastSampleTime)
      Console.log("First Output Time: ", output.firstOutputTime)
      Console.log("Delta: ", delta)
      output.computeThruOffset(inputDevice: inputDevice, outputDevice: output.device)

      Console.log("Initial Offset: ", output.inToOutSampleOffset)
      if delta < 0 {
        output.inToOutSampleOffset -= delta
      } else {
        output.inToOutSampleOffset += -delta
      }
      Console.log("Adjusted Offset: ", output.inToOutSampleOffset)
      makeBufferSilent(abl)
      return noErr
    }

    let startRead = Int64(sampleTime - output.inToOutSampleOffset)
//    Console.log("Reading: ", inNumberFrames, startRead)

    if engine.ringBuffer.fetch(ioData!, framesToRead: inNumberFrames, startRead: startRead) != .noError {
      makeBufferSilent(abl)
      var bufferStartTime: SampleTime = 0
      var bufferEndTime: SampleTime = 0
      _ = engine.ringBuffer.getTimeBounds(startTime: &bufferStartTime, endTime: &bufferEndTime)
      output.inToOutSampleOffset = sampleTime - bufferStartTime.doubleValue

      return noErr
    }
//    Console.log("Output Finished! Silence", bufferSilencePercent(ioData!))

    return noErr
  }

  var device: AudioDevice!
  var engine: Engine!
  var outputEngine = AVAudioEngine()
  var player = AVAudioPlayerNode()
  var varispeed = AVAudioUnitVarispeed()
  let deviceChanged = EmitterKit.Event<AudioDevice>()

  var firstOutputTime: Double = -1
  var inToOutSampleOffset: Double = 0

  init(device: AudioDevice!, engine: Engine!) {
    Console.log("Creating Output for Device: " + device.name)
    self.device = device
    self.engine = engine
    
    computeThruOffset(inputDevice: Driver.device!, outputDevice: device)
    
    outputEngine.setOutputDevice(device)

    outputEngine.attach(player)
    outputEngine.attach(varispeed)
    outputEngine.connect(player, to: varispeed, format: nil)
    outputEngine.connect(varispeed, to: outputEngine.mainMixerNode, format: nil)

    self.setRenderCallback()
    
    Utilities.delay(200) {
      self.start()
    }
  }
  
  private func setRenderCallback () {
    var renderCallbackStruct = AURenderCallbackStruct(
      inputProc: outputRenderCallback,
      inputProcRefCon: UnsafeMutableRawPointer(Unmanaged<Output>.passUnretained(self).toOpaque())
    )
    
    checkErr(AudioUnitSetProperty(varispeed.audioUnit, kAudioUnitProperty_SetRenderCallback,
                                  kAudioUnitScope_Input, 0, &renderCallbackStruct,
                                  UInt32(MemoryLayout<AURenderCallbackStruct>.size)))
  }
  
  private func start () {
    outputEngine.prepare()
    
    Console.log("Starting Output Engine")
    Console.log(outputEngine)
    try! outputEngine.start()
    Console.log("Output Engine started")
  }

  func computeThruOffset(inputDevice : AudioDevice,
                         outputDevice: AudioDevice) {
    let inputOffset = inputDevice.safetyOffset(direction: .recording)
    let outputOffset = outputDevice.safetyOffset(direction: .playback)
    let inputBuffer = inputDevice.bufferFrameSize(direction: .recording)
    let outputBuffer = outputDevice.bufferFrameSize(direction: .playback)
    inToOutSampleOffset = Double(inputOffset! + outputOffset! + inputBuffer + outputBuffer)
  }

  func stop () {
    outputEngine.stop()
  }
}
