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
import AudioToolbox

class Output {
  var device: AudioDevice
  let volume: Volume
  var outputEngine = AVAudioEngine()
  var player = AVAudioPlayerNode()
  var varispeed = AVAudioUnitVarispeed()
  let deviceChanged = EmitterKit.Event<AudioDevice>()
  
  var lastSampleTime: Double = -1
  var safetyOffset: Double = 0
  var sampleOffset: Double = 0

  var integral: Double = 0
  var prevError: Double = 0
  var initialVarispeedRate: Float
  var lowestVarispeedRate: Float
  var highestVarispeedRate: Float

  init(device: AudioDevice) {
    Console.log("Creating Output for Device: " + device.name)
    self.device = device
    self.volume = Volume()

    outputEngine.setOutputDevice(device)
    
    let format = AVAudioFormat.init(
      standardFormatWithSampleRate: device.nominalSampleRate()!,
      channels: 2
    )!

    varispeed.rate = Float(Driver.device!.actualSampleRate()! / device.actualSampleRate()!)
    initialVarispeedRate = varispeed.rate
    // Clamp new Rate to not exceed 0.2% in either direction
    let bounds = 0.002
    lowestVarispeedRate = initialVarispeedRate * Float(1.0 - bounds)
    highestVarispeedRate = initialVarispeedRate * Float(1.0 + bounds)
    Console.log("Varispeed Rate: \(varispeed.rate), Lowest: \(lowestVarispeedRate), Highest: \(highestVarispeedRate)")

    outputEngine.attach(player)
    outputEngine.attach(varispeed)
    outputEngine.attach(volume.mixer)

    outputEngine.connect(player, to: varispeed, format: format)
    outputEngine.connect(varispeed, to: volume.mixer, format: format)
    outputEngine.connect(volume.mixer, to: outputEngine.mainMixerNode, format: format)
    
    self.setupCallback()
    
    delay(200) { [weak self] in
      self?.start()
      self?.startComputeVarispeedRate()
    }
  }
  
  private func setupCallback () {
    var callbackStruct = AURenderCallbackStruct(
      inputProc: callback,
      inputProcRefCon: nil
    )
    
    AudioUnitSetProperty(
      varispeed.audioUnit,
      kAudioUnitProperty_SetRenderCallback,
      kAudioUnitScope_Input, 0,
      &callbackStruct,
      UInt32(MemoryLayout<AURenderCallbackStruct>.size)
    )
  }

  let callback: AURenderCallback = {
    (inRefCon: UnsafeMutableRawPointer,
     ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
     inTimeStamp:  UnsafePointer<AudioTimeStamp>,
     inBusNumber: UInt32,
     inNumberFrames: UInt32,
     ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in
    let abl = UnsafeMutableAudioBufferListPointer(ioData)!

    // Nothing to work with...
    if (Application.output == nil
          || Application.engine == nil
          || !Application.engine!.engine.isRunning
          || Application.engine!.lastSampleTime == -1
    ) {
      makeBufferSilent(abl)
      return noErr
    }

    let sampleTime = inTimeStamp.pointee.mSampleTime

    // If first run, compute offset
    if (Application.output!.lastSampleTime == -1) {
      Application.output!.lastSampleTime = sampleTime
      Application.output!.computeOffset()
      makeBufferSilent(abl)
      return noErr
    } else {
      Application.output!.lastSampleTime = sampleTime
    }

    let from = Int64(sampleTime + Application.output!.sampleOffset - Application.output!.safetyOffset)
    let to = from + Int64(inNumberFrames)
    let err = Application.engine!.buffer.read(into: ioData!, from: from, to: to)

    if err != .noError {
      makeBufferSilent(abl)
      Console.log("ERROR: \(err)")
      Application.output!.resetOffsets()
      return noErr
    }
    
    return noErr
  }
  
  private func start () {
    outputEngine.prepare()
    Console.log("Starting Output Engine")
    Console.log(outputEngine)
    try! outputEngine.start()
    Console.log("Output Engine started")
  }
  
  private func computeOffset() {
    let inputDevice = Driver.device!
    let inputOffset = inputDevice.safetyOffset(direction: .recording)
    let inputBuffer = inputDevice.bufferFrameSize(direction: .recording)
    let outputOffset = device.safetyOffset(direction: .playback)
    let outputBuffer = device.bufferFrameSize(direction: .playback)
    safetyOffset = Double(inputOffset! + outputOffset! + inputBuffer + outputBuffer)// + pow(2, 12)
    sampleOffset = Application.engine!.lastSampleTime - lastSampleTime
    Console.log("Last Input Time: ", Application.engine!.lastSampleTime)
    Console.log("Last Output Time: ", lastSampleTime)
    Console.log("Safety Offset: ", safetyOffset)
    Console.log("Sample Offset: ", sampleOffset)
  }

  // PID Controller to adjust Varispeed rate so we never go beyond Safety Offset
  private let computeVarispeedCyclesPerSecond = 10
  private func startComputeVarispeedRate () {
    stopComputeVarispeedRate()
    computeVarispeedRateTimer = DispatchSource.makeTimerSource(queue: DispatchQueue.global(qos: .utility))
    computeVarispeedRateTimer!.setEventHandler { [weak self] in
      self?.computeVarispeedRate()
    }
    computeVarispeedRateTimer!.schedule(deadline: .now(), repeating: .milliseconds(1000 / computeVarispeedCyclesPerSecond))
    computeVarispeedRateTimer!.resume()
  }
  private func stopComputeVarispeedRate () {
    computeVarispeedRateTimer?.cancel()
  }
  private var computeVarispeedRateTimer: DispatchSourceTimer?
  private var safetyOffsetsHistory: [Double] = []
  private func computeVarispeedRate () {
    //    let benchmark = Benchmark()
    if Application.engine == nil || lastSampleTime == -1 { return }

    // Calculate the Latest Safety offset and filter it by averaging with last second of data
    let lastSafetyOffset = Application.engine!.lastSampleTime - (lastSampleTime + sampleOffset - safetyOffset)
    safetyOffsetsHistory.insert(lastSafetyOffset, at: 0)
    let historyMaxLength = computeVarispeedCyclesPerSecond
    if (safetyOffsetsHistory.count > historyMaxLength) {
      safetyOffsetsHistory.removeLast(safetyOffsetsHistory.count - historyMaxLength)
    }
    let safetyOffsetAverage = safetyOffsetsHistory.reduce(0, +) / Double(safetyOffsetsHistory.count)

    // Calculate Imperfection/Error
    let errorRatio = safetyOffset / safetyOffsetAverage
    let error = 1.0 - errorRatio

    // PID Controls
    let Kp = 0.0001
    let Ki = 0.0
    let Kd = 0.0001

    let Dt = 1.0 / Double(computeVarispeedCyclesPerSecond)

    // Proportional
    let p = Kp * error

    // Integral
    integral += error * Dt
    let i = Ki * integral

    // Derivative
    let der = (error - prevError) / Dt
    let d = Kd * der

    prevError = error

    let change = Float(p + i + d)
    var newRate = varispeed.rate + change

    if newRate < lowestVarispeedRate {
      newRate = lowestVarispeedRate
    } else if newRate > highestVarispeedRate {
      newRate = highestVarispeedRate
    }

    varispeed.rate = newRate
    //        Console.log("Took \(benchmark.end())ms to recalculate Varispeed rate: \(varispeed.rate)")
    //    print("\n\nInput Last: \(engine.lastSampleTime)\nOutput Last: \(lastSampleTime)\nSafety Offset: \(safetyOffset)\nLast Safety Offset: \(lastSafetyOffset)\nSafety Offset Avg: \(safetyOffsetAverage)\nError: \(String(format: "%.3f", error * 100))%\nDt: \(Dt)\nIntegral: \(integral)\nPID: \(p), \(i), \(d)\nRate Change: \(change)\nNew Varispeed Rate: \(varispeed.rate)\n")
  }

  func resetOffsets () {
    integral = 0
    varispeed.rate = initialVarispeedRate
    computeOffset()
  }
  
  func stop () {
    outputEngine.stop()
  }
}
