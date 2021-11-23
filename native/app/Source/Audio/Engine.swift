//
//  Engine.swift
//  eqMac
//
//  Created by Roman Kisil on 10/01/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Cocoa
import AMCoreAudio
//import EventKit
import AVFoundation
import Foundation
import AudioToolbox
import EmitterKit
import Shared

class Engine {

  let engine: AVAudioEngine
  let sources: Sources
  let equalizers: Equalizers
  let format: AVAudioFormat

  var lastSampleTime: Double = -1
  var buffer: CircularBuffer<Float>
  
  init () {
    Console.log("Creating Engine")
    engine = AVAudioEngine()
    sources = Sources()
    equalizers = Equalizers()

    // Sink audio into void
    engine.mainMixerNode.outputVolume = 0

    // Setup Buffer
    let framesPerSample = Driver.device!.bufferFrameSize(direction: .playback)
    buffer = CircularBuffer<Float>(channelCount: 2, capacity: Int(framesPerSample) * 2048)

    // Attach Source
    engine.setInputDevice(sources.system.device)
    format = engine.inputNode.inputFormat(forBus: 0)
    Console.log("Set Input Engine format to: \(format.description)")

    // Attach Effects
    engine.attach(equalizers.active!.eq)

    // Chain
    engine.connect(engine.inputNode, to: equalizers.active!.eq, format: format)
    engine.connect(equalizers.active!.eq, to: engine.mainMixerNode, format: format)

    // Render callback
    let lastAVUnit = equalizers.active!.eq as AVAudioUnit
    if let err = checkErr(AudioUnitAddRenderNotify(lastAVUnit.audioUnit,
                                                   renderCallback,
                                                   nil)) {
      Console.log(err)
      return
    }

    // Start Engine
    engine.prepare()
    Console.log(engine)
    try! engine.start()
  }

  let renderCallback: AURenderCallback = {
    (inRefCon: UnsafeMutableRawPointer,
     ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
     inTimeStamp:  UnsafePointer<AudioTimeStamp>,
     inBusNumber: UInt32,
     inNumberFrames: UInt32,
     ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in

    if ioActionFlags.pointee == AudioUnitRenderActionFlags.unitRenderAction_PostRender {
      if Application.engine == nil { return noErr }

      let sampleTime = inTimeStamp.pointee.mSampleTime

      let start = sampleTime.int64Value
      let end = start + Int64(inNumberFrames)
      if Application.engine?.buffer.write(from: ioData!, start: start, end: end) != .noError {
        return noErr
      }
      Application.engine?.lastSampleTime = sampleTime
    }

    return noErr
  }
  
  func stop () {
    self.engine.stop()
  }

  deinit {
  }
}
