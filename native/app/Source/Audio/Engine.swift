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
import CircularBuffer

class Engine {
  private var eventListeners: [Any] = []
  let sources: Sources
  let effects: Effects
  let volume: Volume
  var attachedEqualizer: Equalizer?
  
  var format: AVAudioFormat!
  var engine: AVAudioEngine!
  
  var lastSampleTime: Double = -1

  let inputRenderedNotification: AURenderCallback = {
    (inRefCon: UnsafeMutableRawPointer,
    ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
    inTimeStamp:  UnsafePointer<AudioTimeStamp>,
    inBusNumber: UInt32,
    inNumberFrames: UInt32,
    ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in
    
    if ioActionFlags.pointee == AudioUnitRenderActionFlags.unitRenderAction_PostRender {
//      Console.log("Input started")
      let engine = Unmanaged<Engine>.fromOpaque(inRefCon).takeUnretainedValue()
      
      let sampleTime = inTimeStamp.pointee.mSampleTime
      
//      Console.log("Writing: ", inNumberFrames, sampleTime)

      if engine.ringBuffer.store(ioData!, framesToWrite: CircularBufferTimeBounds.SampleTime(inNumberFrames), startWrite: sampleTime.int64Value) != .noError {
        return OSStatus()
      }
      engine.lastSampleTime = sampleTime
      
//      Console.log("Input Finished! Silence", bufferSilencePercent(ioData!))
    }
    
    return noErr
  }
  
  // Middleware
  var ringBuffer: CircularBuffer<Float>!
  
  init (sources: Sources, effects: Effects, volume: Volume) {
    Console.log("Creating Engine")
    self.sources = sources
    self.effects = effects
    self.volume = volume
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
    ringBuffer = CircularBuffer<Float>(numberOfBuffers: 2, numberOfElements: Int(framesPerSample) * 64)
  }
  
  private func attach () {
    attachSource()
    attachEffects()
    attachVolume()
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
  
  private func attachVolume () {
//    engine.attach(volume.booster.avAudioNode)
    engine.attach(volume.leftInput)
    engine.attach(volume.rightInput)
    engine.attach(volume.mixer)
    engine.attach(volume.output)
    engine.connect(volume.leftInput, to: volume.mixer, format: format)
    engine.connect(volume.rightInput, to: volume.mixer, format: format)
    engine.connect(volume.mixer, to: volume.output, format: format)
  }
  
  private func chain () {
    chainSourceToVolume()
    chainVolumeToEffects()
    chainEffects()
    chainEffectsToSink()
    setupRenderCallback()
  }
  
  private func chainSourceToVolume () {
    Console.log("Chaining Source to Volume")
    engine.connect(engine.inputNode, to: volume.leftInput, format: format)
    engine.connect(engine.inputNode, to: volume.rightInput, format: format)
  }
  
  private func chainVolumeToEffects () {
    engine.connect(volume.output, to: effects.equalizers.active.eq, format: format)
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
                                                   inputRenderedNotification,
                                                   UnsafeMutableRawPointer(Unmanaged<Engine>.passUnretained(self).toOpaque()))) {
      Console.log(err)
      return
    }
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
