////
////  Output.swift
////  eqMac
////
////  Created by Roman Kisil on 05/11/2018.
////  Copyright © 2018 Roman Kisil. All rights reserved.
////
//
//import Foundation
//import AMCoreAudio
//import SwiftyUserDefaults
//import AudioKit
//import EmitterKit
//
//class Output {
//    static var allowedDevices: [AudioDevice] {
//        return AudioDevice.allOutputDevices()
//            .filter({ device in
//                if let uid = device.uid {
//                    if (uid == Constants.PASSTHROUGH_DEVICE_UID || Constants.LEGACY_DRIVER_UIDS.contains(uid)) {
//                        return false
//                    }
//                }
//                return device.transportType != nil && Constants.SUPPORTED_TRANSPORT_TYPES.contains(device.transportType!)
//            })
//    }
//  
//    let outputRenderCallback: AURenderCallback = {
//        (inRefCon: UnsafeMutableRawPointer,
//        ioActionFlags: UnsafeMutablePointer<AudioUnitRenderActionFlags>,
//        inTimeStamp:  UnsafePointer<AudioTimeStamp>,
//        inBusNumber: UInt32,
//        inNumberFrames: UInt32,
//        ioData: UnsafeMutablePointer<AudioBufferList>?) -> OSStatus in
//      
//        let abl = UnsafeMutableAudioBufferListPointer(ioData)!
//        let output = Unmanaged<Output>.fromOpaque(inRefCon).takeUnretainedValue()
//        let engine: Engine! = output.engine!
//        var inTS = AudioTimeStamp()
//        var outTS = AudioTimeStamp()
//        let inputDevice = Driver.device!
//        if engine.firstInputTime < 0 {
//            makeBufferSilent(abl)
//            return noErr
//        }
//      
//        if AudioDeviceGetCurrentTime(inputDevice.id, &inTS) != noErr {
//            makeBufferSilent(abl)
//            return noErr
//        }
//      
//        if AudioDeviceGetCurrentTime(output.device.id, &outTS) != noErr {
//            makeBufferSilent(abl)
//            return noErr
//        }
//      
//        let rate = inTS.mRateScalar / outTS.mRateScalar
//        if let err = checkErr(AudioUnitSetParameter(output.varispeedUnit!, kVarispeedParam_PlaybackRate, kAudioUnitScope_Global, 0, AudioUnitParameterValue(rate), 0)) {
//            return err
//        }
//      
//        let sampleTime = inTimeStamp.pointee.mSampleTime
//        if output.firstOutputTime < 0 {
//            output.firstOutputTime = sampleTime
//            let delta = engine.firstInputTime - output.firstOutputTime
//            output.computeThruOffset(inputDevice: inputDevice, outputDevice: output.device)
//          
//            if delta < 0 {
//                output.inToOutSampleOffset -= delta
//            } else {
//                output.inToOutSampleOffset = -delta + output.inToOutSampleOffset
//            }
//          
//            makeBufferSilent(abl)
//            return noErr
//        }
//      
//        let err = engine.ringBuffer.fetch(ioData!, framesToRead: inNumberFrames, startRead: Int64(sampleTime - output.inToOutSampleOffset))
//        if err != CARingBufferError.noError {
//            makeBufferSilent(abl)
//            var bufferStartTime: SampleTime = 0
//            var bufferEndTime: SampleTime = 0
//            _ = engine.ringBuffer.getTimeBounds(startTime: &bufferStartTime, endTime: &bufferEndTime)
//            output.inToOutSampleOffset = sampleTime - bufferStartTime.doubleValue
//            return noErr
//        }
//      
//        return noErr
//    }
//  
//    var device: AudioDevice!
//    var engine: Engine!
//
//    var graph: AUGraph? = nil
//    var varispeedNode: AUNode = 0
//    var varispeedUnit: AudioUnit? = nil
//    var formatNode: AUNode = 0
//    var formatUnit: AudioUnit? = nil
//    var outputNode: AUNode = 0
//    var outputUnit: AudioUnit? = nil
//  
//    var firstOutputTime: Double = -1
//    var inToOutSampleOffset: Double = 0
//  
//    let deviceChanged = EmitterKit.Event<AudioDevice>()
//
//    init(device: AudioDevice!, engine: Engine!) {
//        Console.log("Creating Output for Device: " + device.name)
//        self.device = device
//        self.engine = engine
//      
//        computeThruOffset(inputDevice: Driver.device!, outputDevice: device)
//      
//        // Setup Graph containing Varispeed Unit & Default Output Unit
//        Console.log("Setting up AUGraph")
//        if let _ = checkErr(setupGraph()) {
//            exit(1)
//        }
//      
//        Console.log("Setting up Buffers")
//        if let _ = checkErr(setupBuffers()) {
//            exit(1)
//        }
//      
//        Console.log("Connecting Nodes")
//        // the varispeed unit should only be conected after the input and output formats have been set
//        if let _ = checkErr(AUGraphConnectNodeInput(graph!, varispeedNode, 0, formatNode, 0)) {
//            exit(1)
//        }
//      
//        if let _ = checkErr(AUGraphConnectNodeInput(graph!, formatNode, 0, outputNode, 0)) {
//            exit(1)
//        }
//      
//        Console.log("Initializing AUGraph")
//        if let _ = checkErr(AUGraphInitialize(graph!)) {
//            exit(1)
//        }
//      
//        // Add latency between the two devices
//        computeThruOffset(inputDevice: Driver.device!, outputDevice: device)
//      
//        CAShow(UnsafeMutablePointer(graph!))
//      
//        start()
//
//    }
//  
//    private func setupGraph () -> OSStatus {
//        // Make a New Graph
//        Console.log("Creating new AUGraph")
//        if let err = checkErr(NewAUGraph(&graph)) {
//            return err
//        }
//      
//        Console.log("Openning AUGraph")
//        // Open the Graph, AudioUnits are opened but not initialized
//        if let err = checkErr(AUGraphOpen(graph!)) {
//            return err
//        }
//      
//        Console.log("Making AUGraph")
//        if let err = checkErr(makeGraph()) {
//            return err
//        }
//      
//        Console.log("Setting Output Device")
//        if let err = checkErr(setOutputDeviceAsCurrent()) {
//            return err
//        }
//      
//        // Tell the output unit not to reset timestamps
//        // Otherwise sample rate changes will cause sync los
//        var startAtZero : UInt32 = 0
//        if let err = checkErr(AudioUnitSetProperty(outputUnit!, kAudioOutputUnitProperty_StartTimestampsAtZero,
//                                                   kAudioUnitScope_Global, 0, &startAtZero, UInt32(MemoryLayout<UInt32>.size))) {
//            return err
//        }
//      
//      
//        var output = AURenderCallbackStruct(
//            inputProc: outputRenderCallback,
//            inputProcRefCon: UnsafeMutableRawPointer(Unmanaged<Output>.passUnretained(self).toOpaque())
//        )
//      
//        if let err = checkErr(AudioUnitSetProperty(varispeedUnit!, kAudioUnitProperty_SetRenderCallback,
//                                                   kAudioUnitScope_Input, 0, &output, UInt32(MemoryLayout<AURenderCallbackStruct>.size))) {
//            return err
//        }
//        return noErr
//    }
//  
//    private func makeGraph() -> OSStatus {
//        var varispeedDesc = AudioComponentDescription()
//        var formatDesc = AudioComponentDescription()
//        var outDesc = AudioComponentDescription()
//      
//        // Q:Why do we need a varispeed unit?
//        // A:If the input device and the output device are running at different sample rates
//        // we will need to move the data coming to the graph slower/faster to avoid a pitch change.
//        varispeedDesc.componentType = kAudioUnitType_FormatConverter
//        varispeedDesc.componentSubType = kAudioUnitSubType_Varispeed
//        varispeedDesc.componentManufacturer = kAudioUnitManufacturer_Apple
//        varispeedDesc.componentFlags = 0
//        varispeedDesc.componentFlagsMask = 0
//      
//        formatDesc.componentType = kAudioUnitType_FormatConverter
//        formatDesc.componentSubType = kAudioUnitSubType_AUConverter
//        formatDesc.componentManufacturer = kAudioUnitManufacturer_Apple
//        formatDesc.componentFlags = 0
//        formatDesc.componentFlagsMask = 0
//      
//        outDesc.componentType = kAudioUnitType_Output
//        outDesc.componentSubType = kAudioUnitSubType_HALOutput
//        outDesc.componentManufacturer = kAudioUnitManufacturer_Apple
//        outDesc.componentFlags = 0
//        outDesc.componentFlagsMask = 0
//      
//        //////////////////////////
//        /// MAKE NODES
//        // This creates a node in the graph that is an AudioUnit, using
//        // the supplied ComponentDescription to find and open that unit
//        if let err = checkErr(AUGraphAddNode(graph!, &varispeedDesc, &varispeedNode)) {
//            return err
//        }
//      
//        if let err = checkErr(AUGraphAddNode(graph!, &formatDesc, &formatNode)) {
//            return err
//        }
//      
//        if let err = checkErr(AUGraphAddNode(graph!, &outDesc, &outputNode)) {
//            return err
//        }
//      
//        // Get Audio Units from AUGraph node
//        if let err = checkErr(AUGraphNodeInfo(graph!, varispeedNode, nil, &varispeedUnit)) {
//            return err
//        }
//      
//        if let err = checkErr(AUGraphNodeInfo(graph!, formatNode, nil, &formatUnit)) {
//            return err
//        }
//      
//        if let err = checkErr(AUGraphNodeInfo(graph!, outputNode, nil, &outputUnit)) {
//            return err
//        }
//      
//        // don't connect nodes until the varispeed unit has input and output formats set
//      
//        return noErr
//    }
//  
//    func setOutputDeviceAsCurrent() -> OSStatus {
//        var id = device.id
//        // Set the Current Device to the Default Output Unit.
//        return AudioUnitSetProperty(outputUnit!, kAudioOutputUnitProperty_CurrentDevice, kAudioUnitScope_Output, 0,
//                                    &id, UInt32(MemoryLayout<AudioDeviceID>.size))
//    }
//  
//    func setupBuffers() -> OSStatus {
//        let input = Driver.device!
//        let inputUnit = engine.engine.inputNode.audioUnit!
//      
//        var inputFormat = AudioStreamBasicDescription()
//        // Get the Input Format
//        var propertySize = UInt32(MemoryLayout<AudioStreamBasicDescription>.size);
//        if let err = checkErr(AudioUnitGetProperty(inputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &inputFormat, &propertySize)) {
//            return err;
//        }
//      
//        var outputFormat = inputFormat
//        outputFormat.mSampleRate = device.nominalSampleRate()!
//        outputFormat.mChannelsPerFrame = ((input.channels(direction: .recording) < device.channels(direction: .playback)) ? input.channels(direction: .recording) :device.channels(direction: .playback))
//      
////        inputFormat.mFormatFlags = 9
////        outputFormat.mFormatFlags = 9
//
//        //WIRE AudioStreamBasicDescription(mSampleRate: 44100.0, mFormatID: 1819304813, mFormatFlags: 41, mBytesPerPacket: 4, mFramesPerPacket: 1, mBytesPerFrame: 4, mChannelsPerFrame: 2, mBitsPerChannel: 32, mReserved: 0)
//        //BT   AudioStreamBasicDescription(mSampleRate: 48000.0, mFormatID: 1819304813, mFormatFlags: 41, mBytesPerPacket: 4, mFramesPerPacket: 1, mBytesPerFrame: 4, mChannelsPerFrame: 2, mBitsPerChannel: 32, mReserved: 0)
//        Console.log(inputFormat)
//        Console.log(outputFormat)
//      
//        if let err = checkErr(AudioUnitSetProperty(varispeedUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &inputFormat, propertySize)) {
//            return err
//        }
//      
//        if let err = checkErr(AudioUnitSetProperty(varispeedUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 0, &outputFormat, propertySize)) {
//            return err
//        }
////
////        if let err = checkErr(AudioUnitSetProperty(formatUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &outputFormat, propertySize)) {
////            return err
////        }
////
////        if let err = checkErr(AudioUnitSetProperty(formatUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 0, &outputFormat, propertySize)) {
////            return err
////        }
////
//        if let err = checkErr(AudioUnitSetProperty(outputUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &outputFormat, propertySize)) {
//            return err
//        }
//      
//        return noErr
//      
//    }
//  
//        // Alloc rin
//  
//    func computeThruOffset(inputDevice : AudioDevice,
//                           outputDevice: AudioDevice) {
//        let inputOffset = inputDevice.safetyOffset(direction: .recording)
//        let outputOffset = outputDevice.safetyOffset(direction: .playback)
//        let inputBuffer = inputDevice.bufferFrameSize(direction: .recording)
//        let outputBuffer = outputDevice.bufferFrameSize(direction: .playback)
//        inToOutSampleOffset = Double(inputOffset! + outputOffset! + inputBuffer + outputBuffer)
//    }
//  
//    deinit {
//        cleanup()
//    }
//  
//    private func cleanup () {
//        stop()
//    }
//  
//    func start() {
//        if isRunning {
//            return
//        }
//      
//        if let _ = checkErr(AUGraphStart(graph!)) {
//            return
//        }
//      
//        // reset sample times
//        firstOutputTime = -1
//    }
//  
//    func stop() {
//        if !isRunning {
//            return
//        }
//
//        if let _ = checkErr(AUGraphStop(graph!)) {
//            return
//        }
//        firstOutputTime = -1
//    }
//  
//    var isRunning: Bool {
//        var running : DarwinBoolean = false
//      
//        if let _ = checkErr(AUGraphIsRunning(graph!, &running)) {
//            return false
//        }
//      
//        return running.boolValue
//    }
//}
