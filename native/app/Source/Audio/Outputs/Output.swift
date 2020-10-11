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
  
  static func isDeviceAllowed(_ device: AudioDevice) -> Bool {
    return device.transportType != nil
      && Constants.SUPPORTED_TRANSPORT_TYPES.contains(device.transportType!)
      && !device.isInputOnlyDevice()
      && !device.name.contains("CADefaultDeviceAggregate")
  }
  
  static func autoSelect (_ device: AudioDevice) -> Bool {
    let types: [TransportType] = [.bluetooth, .bluetoothLE, .builtIn]
    return Output.isDeviceAllowed(device) && types.contains(device.transportType!)
  }
  
  static var allowedDevices: [AudioDevice] {
    return AudioDevice.allOutputDevices()
      .filter({ device in
        if let uid = device.uid {
          if (uid == Constants.PASSTHROUGH_DEVICE_UID || Constants.LEGACY_DRIVER_UIDS.contains(uid)) {
            return false
          }
        }
        return isDeviceAllowed(device)
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
    let inputDevice = Driver.device!
    let sampleTime = inTimeStamp.pointee.mSampleTime
    var currRate = output.varispeed.rate;
    
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
    } else {
      let Kp = 0.00001;
      //PID Loop, currently only P is used, can be tuned later
      //let Kd = 0.0;
      //let Ki = 0.0;
      //let Dt = 1.0 / output.device.actualSampleRate()! * Double(inNumberFrames);
      let temp =  (sampleTime  - output.inToOutSampleOffset) - Float64( engine.lastSampleTime);
      if(output.initialOffset == 0){
        output.initialOffset = temp;
        output.integral = 0;
        output.pre_error = 0;
      }
      let inp = Double(output.initialOffset) / Double(temp);
      let error = 1.0 - inp;
      var pOut = Kp * error;
      //Integral
      //output.integral += error * Dt;
      //let iOut = Ki * output.integral;
      //Derivative
      //let der = (error - output.pre_error) / Dt;
      //let dOut = Kd * der;
      let out = pOut// + iOut + dOut;
      output.pre_error = error;
      let diff = Float(out);
      var rate = currRate + diff;
      if(diff > 0.0002){//lets limit rate change per buffer
        rate = currRate + 0.0002;
      }else if(diff < -0.0002){
        rate = currRate - 0.0002;
      }
      output.varispeed.rate = rate;
      //Console.log("rate: " , rate, error) ;
    }
    
    let startRead = Int64(sampleTime - output.inToOutSampleOffset)
    //    Console.log("Reading: ", inNumberFrames, startRead)
    
    if engine.ringBuffer.fetch(ioData!, framesToRead: inNumberFrames, startRead: startRead) != .noError {
      makeBufferSilent(abl)
      //            var bufferStartTime: SampleTime = 0
      //            var bufferEndTime: SampleTime = 0
      //            _ = engine.ringBuffer.getTimeBounds(startTime: &bufferStartTime, endTime: &bufferEndTime)
      //            output.inToOutSampleOffset = sampleTime - bufferStartTime.doubleValue
      output.firstOutputTime = -1;
      output.initialOffset = 0;
      output.varispeed.rate = output.intialCalcRate;
      Console.log("ERROR");
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
  var initialOffset: Double = 0
  var integral: Double = 0
  var pre_error: Double = 0
  var intialCalcRate: Float = 1
  
  init(device: AudioDevice!, engine: Engine!) {
    Console.log("Creating Output for Device: " + device.name)
    self.device = device
    self.engine = engine
    
    computeThruOffset(inputDevice: Driver.device!, outputDevice: device)
    
    outputEngine.setOutputDevice(device)
    //Rates did not match what is set for in / out always used 44.1 (mainMixerNode)
    //Perhaps set the mainMixerNode to match the output?
    //Used old way you had except moved the format to after things are attached which seems
    //to prevent the occaional crash
    // let driverSampleRate = Driver.device!.actualSampleRate()!
    // let varispeedInputFormat = varispeed.inputFormat(forBus: 0)
    // let mainMixerSampleRate = outputEngine.mainMixerNode.outputFormat(forBus: 0).sampleRate
    // varispeed.rate = Float(driverSampleRate / mainMixerSampleRate)
    varispeed.rate = Float(Driver.device!.actualSampleRate()! / device.actualSampleRate()!)
    intialCalcRate = varispeed.rate;
    Console.log("Varispeed Rate: \(varispeed.rate)")
    outputEngine.attach(player)
    outputEngine.attach(varispeed)
    let  format = outputEngine.outputNode.outputFormat(forBus: 0)
    
    outputEngine.connect(player, to: varispeed, format: format)
    outputEngine.connect(varispeed, to: outputEngine.mainMixerNode, format: nil)
    initialOffset = 0;
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
