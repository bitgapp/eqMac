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

class Engine {
  private var eventListeners: [Any] = []
  let sources: Sources
  let effects: Effects
  var attachedEqualizer: Equalizer?
  
  var format: AVAudioFormat!
  var engine: AVAudioEngine!
  
  var lastSampleTime: Double = -1
  
  // Middleware
  var buffer: CircularBuffer<Float>!
  
  init (sources: Sources, effects: Effects) {
    Console.log("Creating Engine")
    self.sources = sources
    self.effects = effects
    setupEngine()
    setupSink()
    setupBuffer()
    attach()
    chain()
    setupListeners()
    start()
  }
  
  private func setupEngine () {
    engine = AVAudioEngine()
  }
  
  private func setupSink () {
    engine.mainMixerNode.outputVolume = 0
  }
  
  private func setupBuffer () {
    let framesPerSample = Driver.device!.bufferFrameSize(direction: .playback)
    buffer = CircularBuffer<Float>(channelCount: 2, capacity: Int(framesPerSample) * 64)
  }
  
  private func attach () {
    attachSource()
    attachEffects()
  }
  
  private func attachSource () {
    sources.system.setInputDevice(engine: engine)
    format = engine.inputNode.inputFormat(forBus: 0)
  }
  
  private func attachEffects () {
    attachEqualizer()
  }
  
  private func attachEqualizer () {
    engine.attach(effects.equalizers.active.eq)
    attachedEqualizer = effects.equalizers.active
    effects.equalizers.active.wasAttachedTo(engine: self)
  }
  
  private func detachEqualizer () {
    if attachedEqualizer != nil {
      engine.detach(attachedEqualizer!.eq)
      attachedEqualizer?.wasDetachedFrom(engine: self)
      attachedEqualizer = nil
    }
  }
  
  private func reattachEqualizer () {
    detachEqualizer()
    attachEqualizer()
  }
  
  private func chain () {
    chainSourceToEffects()
    chainEffects()
    chainEffectsToSink()
    setupRenderCallback()
  }
  
  private func chainSourceToEffects () {
    Console.log("Chaining Source to Volume")
    engine.connect(engine.inputNode, to: effects.equalizers.active.eq, format: format)
  }

  private func chainEffects () {
    Console.log("Chaining Effects")
  }
  
  private func chainEffectsToSink () {
    engine.connect(effects.equalizers.active.eq, to: engine.mainMixerNode, format: format)
  }
  
  private func setupRenderCallback () {
    Console.log("Setting up Input Render Callback")
    let lastAVUnit = effects.equalizers.active.eq as AVAudioUnit
    if let err = checkErr(AudioUnitAddRenderNotify(lastAVUnit.audioUnit,
                                                   renderCallback,
                                                   UnsafeMutableRawPointer(Unmanaged<Engine>.passUnretained(self).toOpaque()))) {
      Console.log(err)
      return
    }
  }

  let renderCallback: AURenderCallback = {
    (inRefCon: UnsafeMutableRawPointer,
    ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
    inTimeStamp:  UnsafePointer<AudioTimeStamp>,
    inBusNumber: UInt32,
    inNumberFrames: UInt32,
    ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in

    if ioActionFlags.pointee == AudioUnitRenderActionFlags.unitRenderAction_PostRender {
      let engine = Unmanaged<Engine>.fromOpaque(inRefCon).takeUnretainedValue()

      let sampleTime = inTimeStamp.pointee.mSampleTime

      let start = sampleTime.int64Value
      let end = start + Int64(inNumberFrames)
      if engine.buffer.write(from: ioData!, start: start, end: end) != .noError {
        return OSStatus()
      }
      engine.lastSampleTime = sampleTime
    }

    return noErr
  }
  
  private func setupListeners () {
    eventListeners.append(Equalizers.typeChanged.on { _ in
      self.stop()
      Utilities.delay(100) {
        self.reattachEqualizer()
        self.chain()
        self.start()
      }
    })
  }
  
  private func start () {
    engine.prepare()

    Console.log("Starting Input Engine")
    Console.log(engine)
    try! engine.start()
    Console.log("Input Engine started")
  }
  
  func stop () {
    self.engine.stop()
  }
  
}
