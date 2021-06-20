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

class Engine {
  private var equalizersTypeChangedListener: EventListener<EqualizerType>?

  let sources: Sources!
  let effects: Effects!
  var attachedEqualizer: Equalizer?
  
  var format: AVAudioFormat!
  var engine: AVAudioEngine!
  
  var lastSampleTime: Double = -1
  
  // Middleware
  var buffer: CircularBuffer<Float>!
  
  init (_ completion: @escaping () -> Void) {
    Console.log("Creating Engine")
    self.effects = Effects()
    self.sources = Sources()
    Sources.getInputPermission() {
      self.sources.initializeSystem()
      self.setupEngine()
      self.setupSink()
      self.setupBuffer()
      self.attach()
      self.chain()
      self.setupListeners()
      self.start()
      completion()
    }
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
    engine.setInputDevice(sources.system.device)
    format = engine.inputNode.inputFormat(forBus: 0)
    Console.log("Set Input Engine format to: \(format.description)")
  }
  
  private func attachEffects () {
    attachEqualizer()
  }
  
  private func attachEqualizer () {
    engine.attach(effects.equalizers.active.eq)
    attachedEqualizer = effects.equalizers.active
  }
  
  private func detachEqualizer () {
    if attachedEqualizer != nil {
      engine.detach(attachedEqualizer!.eq)
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
    Console.log("Chaining Source to Effects")
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
                                                   nil)) {
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
      if Application.engine == nil { return noErr }

      let sampleTime = inTimeStamp.pointee.mSampleTime

      let start = sampleTime.int64Value
      let end = start + Int64(inNumberFrames)
      if Application.engine!.buffer.write(from: ioData!, start: start, end: end) != .noError {
        return OSStatus()
      }
      Application.engine!.lastSampleTime = sampleTime
    }

    return noErr
  }
  
  private func setupListeners () {
    equalizersTypeChangedListener = Equalizers.typeChanged.on { [weak self] _ in
      if self == nil { return }
      self!.stop()
      Utilities.delay(100) { [weak self] in
        if self == nil { return }
        self!.reattachEqualizer()
        self!.chain()
        self!.start()
      }
    }
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

  deinit {
    equalizersTypeChangedListener?.isListening = false
    equalizersTypeChangedListener = nil
  }
}
