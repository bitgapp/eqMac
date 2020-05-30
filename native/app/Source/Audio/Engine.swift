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

class Engine {
  private var eventListeners: [Any] = []
  let sources: Sources
  let effects: Effects
  let volume: Volume
  var equalizerNodes: [AVAudioNode] = []
  
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

      if engine.ringBuffer.store(ioData!, framesToWrite: inNumberFrames, startWrite: sampleTime.int64Value) != .noError {
        return OSStatus()
      }
      engine.lastSampleTime = sampleTime
      
//      Console.log("Input Finished! Silence", bufferSilencePercent(ioData!))
    }
    
    return noErr
  }
  
  // Middleware
  var ringBuffer: CARingBuffer<Float>!
  
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
    ringBuffer = CARingBuffer<Float>(numberOfChannels: 2, capacityFrames: UInt32(framesPerSample * 2048))
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
    attachEqualizers()
  }
  
  private func attachEqualizers () {
    equalizerNodes = []
    engine.attach(effects.equalizers.active.eq)
  }
  
  private func detachEqualizers () {
    for node in equalizerNodes {
      engine.detach(node)
    }
    equalizerNodes = []
  }
  
  private func reattachEqualizers () {
    detachEqualizers()
    attachEqualizers()
  }
  
  private func attachVolume () {
    engine.attach(volume.booster.avAudioNode)
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
    engine.connect(engine.inputNode, to: volume.booster.avAudioNode, format: format)
  }
  
  private func chainVolumeToEffects () {
    engine.connect(volume.booster.avAudioNode, to: effects.equalizers.active.eq, format: format)
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
    eventListeners.append(effects.equalizers.typeChanged.on { _ in
      self.stop()
      Utilities.delay(100) {
        self.reattachEqualizers()
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
