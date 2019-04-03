/*
     File: EQEngine.cpp 
 Abstract: CAPlayThough Classes. 
  Version: 1.2.2 
  
 Disclaimer: IMPORTANT:  This Apple software is supplied to you by Apple 
 Inc. ("Apple") in consideration of your agreement to the following 
 terms, and your use, installation, modification or redistribution of 
 this Apple software constitutes acceptance of these terms.  If you do 
 not agree with these terms, please do not use, install, modify or 
 redistribute this Apple software. 
  
 In consideration of your agreement to abide by the following terms, and 
 subject to these terms, Apple grants you a personal, non-exclusive 
 license, under Apple's copyrights in this original Apple software (the 
 "Apple Software"), to use, reproduce, modify and redistribute the Apple 
 Software, with or without modifications, in source and/or binary forms; 
 provided that if you redistribute the Apple Software in its entirety and 
 without modifications, you must retain this notice and the following 
 text and disclaimers in all such redistributions of the Apple Software. 
 Neither the name, trademarks, service marks or logos of Apple Inc. may 
 be used to endorse or promote products derived from the Apple Software 
 without specific prior written permission from Apple.  Except as 
 expressly stated in this notice, no other rights or licenses, express or 
 implied, are granted by Apple herein, including but not limited to any 
 patent rights that may be infringed by your derivative works or by other 
 works in which the Apple Software may be incorporated. 
  
 The Apple Software is provided by Apple on an "AS IS" basis.  APPLE 
 MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION 
 THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS 
 FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND 
 OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS. 
  
 IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL 
 OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION, 
 MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED 
 AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE), 
 STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE 
 POSSIBILITY OF SUCH DAMAGE. 
  
 Copyright (C) 2013 Apple Inc. All Rights Reserved. 
  
*/ 

#include "EQEngine.h"

#pragma mark -- EQEngine



#pragma mark ---Public Methods---


#pragma mark ---EQEngine Methods---
EQEngine::EQEngine(AudioDeviceID input, AudioDeviceID output):
mBuffer(NULL),
mFirstInputTime(-1),
mFirstOutputTime(-1),
mInToOutSampleOffset(0){
	OSStatus err = noErr;
	err = Init(input,output);
    if(err) {
		fprintf(stderr,"EQEngine ERROR: Cannot Init EQEngine");
		exit(1);
	}
}

EQEngine::~EQEngine(){
	Cleanup();
}

OSStatus EQEngine::Init(AudioDeviceID input, AudioDeviceID output){
    OSStatus err = noErr;
	//Note: You can interface to input and output devices with "output" audio units.
	//Please keep in mind that you are only allowed to have one output audio unit per graph (AUGraph).
	//As you will see, this sample code splits up the two output units.  The "output" unit that will
	//be used for device input will not be contained in a AUGraph, while the "output" unit that will 
	//interface the default output device will be in a graph.
    
    
	//Setup AUHAL for an input device
	err = SetupAUHAL(input);
	checkErr(err);

	//Setup Graph containing Varispeed Unit & Default Output Unit
	err = SetupGraph(output);
	checkErr(err);
	
	err = SetupBuffers();
	checkErr(err);
	
	// the varispeed unit should only be conected after the input and output formats have been set
	err = AUGraphConnectNodeInput(mGraph, mVarispeedNode, 0, mFormatNode, 0);
	checkErr(err);
    
    err = AUGraphConnectNodeInput(mGraph, mFormatNode, 0, mEqualizerNode1, 0);
    checkErr(err);
    
    err = AUGraphConnectNodeInput(mGraph, mEqualizerNode1, 0, mEqualizerNode2, 0);
    checkErr(err);
    
    err = AUGraphConnectNodeInput(mGraph, mEqualizerNode2, 0, mOutputNode, 0);
    checkErr(err);
	
	err = AUGraphInitialize(mGraph); 
	checkErr(err);
	
	//Add latency between the two devices
	ComputeThruOffset();
		
	return err;	
}

void EQEngine::Cleanup(){
	//clean up
	Stop();
									
	delete mBuffer;
	mBuffer = 0;
	if(mInputBuffer){
		for(UInt32 i = 0; i<mInputBuffer->mNumberBuffers; i++)
			free(mInputBuffer->mBuffers[i].mData);
		free(mInputBuffer);
		mInputBuffer = 0;
	}
	
	AudioUnitUninitialize(mInputUnit);
	AUGraphClose(mGraph);
	DisposeAUGraph(mGraph);
    AudioComponentInstanceDispose(mInputUnit);
}

#pragma mark --- Operation---

OSStatus EQEngine::Start()
{
	OSStatus err = noErr;
	if(!IsRunning()){		
		//Start pulling for audio data
		err = AudioOutputUnitStart(mInputUnit);
		checkErr(err);

        err = AUGraphStart(mGraph);
		checkErr(err);
		
		//reset sample times
		mFirstInputTime = -1;
		mFirstOutputTime = -1;
	}
	return err;	
}

OSStatus EQEngine::Stop()
{
	OSStatus err = noErr;
	if(IsRunning()){
		//Stop the AUHAL
		err = AudioOutputUnitStop(mInputUnit);
        checkErr(err);
        
		err = AUGraphStop(mGraph);
        checkErr(err);
        
		mFirstInputTime = -1;
		mFirstOutputTime = -1;
	}
	return err;
}

Boolean EQEngine::IsRunning()
{	
	OSStatus err = noErr;
	UInt32 auhalRunning = 0, size = 0;
	Boolean graphRunning = false;
	size = sizeof(auhalRunning);
	if(mInputUnit)
	{
		err = AudioUnitGetProperty(mInputUnit,
								kAudioOutputUnitProperty_IsRunning,
								kAudioUnitScope_Global,
								0, // input element
								&auhalRunning,
								&size);
        checkErr(err);
	}
	
	if(mGraph) {
		err = AUGraphIsRunning(mGraph,&graphRunning);
        checkErr(err);
    }
    
	return (auhalRunning || graphRunning);	
}


OSStatus EQEngine::SetOutputDeviceAsCurrent(AudioDeviceID out)
{
    UInt32 size = sizeof(AudioDeviceID);;
    OSStatus err = noErr;
    
    
    AudioObjectPropertyAddress theAddress = { kAudioHardwarePropertyDefaultOutputDevice,
                                              kAudioObjectPropertyScopeGlobal,
                                              kAudioObjectPropertyElementMaster };
	
	if(out == kAudioDeviceUnknown) //Retrieve the default output device
	{
		err = AudioObjectGetPropertyData(kAudioObjectSystemObject, &theAddress, 0, NULL, &size, &out);
        checkErr(err);
	}
    mOutputDevice.Init(out, false);
	
    
	//Set the Current Device to the Default Output Unit only if the devices are different
    if(out != mInputDevice.mID){
        err = AudioUnitSetProperty(mOutputUnit,
                                   kAudioOutputUnitProperty_CurrentDevice,
                                   kAudioUnitScope_Output,
                                   0,
                                   &mOutputDevice.mID, 
                                   sizeof(mOutputDevice.mID));
    }
    
	return err;
}

OSStatus EQEngine::SetInputDeviceAsCurrent(AudioDeviceID in)
{
    UInt32 size = sizeof(AudioDeviceID);
    OSStatus err = noErr;
    
    AudioObjectPropertyAddress theAddress = { kAudioHardwarePropertyDefaultInputDevice,
                                              kAudioObjectPropertyScopeGlobal,
                                              kAudioObjectPropertyElementMaster };
	
	if(in == kAudioDeviceUnknown) //get the default input device if device is unknown
	{  
		err = AudioObjectGetPropertyData(kAudioObjectSystemObject, &theAddress, 0, NULL, &size, &in);
		checkErr(err);
	}
	mInputDevice.Init(in, true);
	
	//Set the Current Device to the AUHAL.
	//this should be done only after IO has been enabled on the AUHAL.
    err = AudioUnitSetProperty(mInputUnit,
							  kAudioOutputUnitProperty_CurrentDevice, 
							  kAudioUnitScope_Input,
							  0, 
							  &mInputDevice.mID, 
							  sizeof(mInputDevice.mID));
	checkErr(err);
	return err;
}

Float32 map(Float32 x, Float32 in_min, Float32 in_max, Float32 out_min, Float32 out_max)
{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

OSStatus EQEngine::ResetEqUnits(){
    OSStatus err = noErr;
    for (int i = 0; i < 16; i++) {
        AudioUnitParameterID frequencyParamID = kAUNBandEQParam_Frequency + i;
        err = AudioUnitSetParameter(mEqualizerUnit1, frequencyParamID, kAudioUnitScope_Global, 0, (AudioUnitParameterValue)0, 0);
        checkErr(err);
        err = AudioUnitSetParameter(mEqualizerUnit2, frequencyParamID, kAudioUnitScope_Global, 0, (AudioUnitParameterValue)0, 0);
        checkErr(err);
        
        AudioUnitParameterID bypassBandParamID = kAUNBandEQParam_BypassBand + i;
        err = AudioUnitSetParameter(mEqualizerUnit1, bypassBandParamID, kAudioUnitScope_Global, 0, (AudioUnitParameterValue)0, 0);
        checkErr(err);
        err = AudioUnitSetParameter(mEqualizerUnit2, bypassBandParamID, kAudioUnitScope_Global, 0,(AudioUnitParameterValue) 0, 0);
        checkErr(err);
        
        AudioUnitParameterID gainParamID = kAUNBandEQParam_Gain + i;
        err = AudioUnitSetParameter(mEqualizerUnit1, gainParamID, kAudioUnitScope_Global, 0, 0, 0);
        checkErr(err);
        err = AudioUnitSetParameter(mEqualizerUnit2, gainParamID, kAudioUnitScope_Global, 0, 0, 0);
        checkErr(err);
    }
    return err;
}

void EQEngine::SetEqFrequencies(UInt32 *frequencies, UInt32 count){
    ResetEqUnits();
    
    for (int i = 0; i < count; i++) {
        int incrementor = i;
        AudioUnit eqUnit = mEqualizerUnit1;
        if (i >= 16) {
            incrementor = i - 16;
            eqUnit = mEqualizerUnit2;
        }

        AudioUnitParameterID parameterID = kAUNBandEQParam_Frequency + incrementor;
        AudioUnitSetParameter(eqUnit, parameterID, kAudioUnitScope_Global, 0, (AudioUnitParameterValue)frequencies[i], 0);
        parameterID = kAUNBandEQParam_BypassBand + incrementor;
        AudioUnitSetParameter(eqUnit, parameterID, kAudioUnitScope_Global, 0, (AudioUnitParameterValue)0, 0);
    }
}

void EQEngine::SetEqGains(Float32 *gains, UInt32 count){
    
    for (int i = 0; i < count; i++) {
        int incrementor = i;
        AudioUnit eqUnit = mEqualizerUnit1;
        if (i >= 16) {
            incrementor = i - 16;
            eqUnit = mEqualizerUnit2;
        }
        
        AudioUnitParameterID parameterID = kAUNBandEQParam_Gain + incrementor;
        AudioUnitSetParameter(eqUnit, parameterID, kAudioUnitScope_Global, 0, map(gains[i], -1.0, 1.0, -24.0, 24.0),0);
    }
}

Float32* EQEngine::GetEqGains(){
    Float32 *gains = new Float32[32]();
    for (int i = 0; i < 32; i++) {
        
        int incrementor = i;
        if (this == NULL){
            return NULL;
        }
        AudioUnit eqUnit = mEqualizerUnit1;
        if (i >= 16) {
            incrementor = i - 16;
            eqUnit = mEqualizerUnit2;
        }
        
        AudioUnitParameterID parameterID = kAUNBandEQParam_Gain + incrementor;
        AudioUnitGetParameter(eqUnit, parameterID, kAudioUnitScope_Global, 0, &gains[i]);
        gains[i] = map(gains[i], -24, 24, -1, 1);
    }
    return gains;
}

#pragma mark -
#pragma mark --Private methods---
OSStatus EQEngine::SetupGraph(AudioDeviceID out)
{
	OSStatus err = noErr;
	AURenderCallbackStruct output;
	
	//Make a New Graph
    err = NewAUGraph(&mGraph);  
	checkErr(err);
 
	//Open the Graph, AudioUnits are opened but not initialized    
    err = AUGraphOpen(mGraph);
	checkErr(err);
	
	err = MakeGraph();
	checkErr(err);
		
	err = SetOutputDeviceAsCurrent(out);
	checkErr(err);
	
	//Tell the output unit not to reset timestamps 
	//Otherwise sample rate changes will cause sync los
	UInt32 startAtZero = 0;
	err = AudioUnitSetProperty(mOutputUnit, 
							  kAudioOutputUnitProperty_StartTimestampsAtZero, 
							  kAudioUnitScope_Global,
							  0,
							  &startAtZero, 
							  sizeof(startAtZero));
	checkErr(err);
	
	output.inputProc = OutputProc;
	output.inputProcRefCon = this;
    
    UInt32 nBands = 16;
    
    err = AudioUnitSetProperty(mEqualizerUnit1, kAUNBandEQProperty_NumberOfBands, kAudioUnitScope_Global, 0, &nBands, sizeof(nBands));
    checkErr(err);
    
    err = AudioUnitSetProperty(mEqualizerUnit2, kAUNBandEQProperty_NumberOfBands, kAudioUnitScope_Global, 0, &nBands, sizeof(nBands));
    checkErr(err);
    
    ResetEqUnits();
    
    AudioUnitSetProperty(mFormatUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &asbd, sizeof(asbd));

	err = AudioUnitSetProperty(mVarispeedUnit, 
							  kAudioUnitProperty_SetRenderCallback, 
							  kAudioUnitScope_Input,
							  0,
							  &output, 
							  sizeof(output));
	checkErr(err);

	return err;
}

OSStatus EQEngine::MakeGraph(){
	OSStatus err = noErr;
	AudioComponentDescription varispeedDesc,outDesc, eqDesc1, eqDesc2, formatDesc;
	
	//Q:Why do we need a varispeed unit?
	//A:If the input device and the output device are running at different sample rates
	//we will need to move the data coming to the graph slower/faster to avoid a pitch change.
	varispeedDesc.componentType = kAudioUnitType_FormatConverter;
	varispeedDesc.componentSubType = kAudioUnitSubType_Varispeed;
	varispeedDesc.componentManufacturer = kAudioUnitManufacturer_Apple;
	varispeedDesc.componentFlags = 0;        
	varispeedDesc.componentFlagsMask = 0;
    
    formatDesc.componentType = kAudioUnitType_FormatConverter;
    formatDesc.componentSubType = kAudioUnitSubType_AUConverter;
    formatDesc.componentManufacturer = kAudioUnitManufacturer_Apple;
    formatDesc.componentFlags = 0;
    formatDesc.componentFlagsMask = 0;
    
    eqDesc1.componentType = kAudioUnitType_Effect;
    eqDesc1.componentSubType = kAudioUnitSubType_NBandEQ;
    eqDesc1.componentManufacturer = kAudioUnitManufacturer_Apple;
    eqDesc1.componentFlags = 0;
    eqDesc1.componentFlagsMask = 0;
    
    eqDesc2.componentType = kAudioUnitType_Effect;
    eqDesc2.componentSubType = kAudioUnitSubType_NBandEQ;
    eqDesc2.componentManufacturer = kAudioUnitManufacturer_Apple;
    eqDesc2.componentFlags = 0;
    eqDesc2.componentFlagsMask = 0;
    
	outDesc.componentType = kAudioUnitType_Output;
	outDesc.componentSubType = kAudioUnitSubType_HALOutput;
	outDesc.componentManufacturer = kAudioUnitManufacturer_Apple;
	outDesc.componentFlags = 0;
	outDesc.componentFlagsMask = 0;
	
	//////////////////////////
	///MAKE NODES
	//This creates a node in the graph that is an AudioUnit, using
	//the supplied ComponentDescription to find and open that unit	
	err = AUGraphAddNode(mGraph, &varispeedDesc, &mVarispeedNode);
	checkErr(err);
    err = AUGraphAddNode(mGraph, &formatDesc, &mFormatNode);
    checkErr(err);
    err = AUGraphAddNode(mGraph, &eqDesc1, &mEqualizerNode1);
    checkErr(err);
    err = AUGraphAddNode(mGraph, &eqDesc2, &mEqualizerNode2);
    checkErr(err);
	err = AUGraphAddNode(mGraph, &outDesc, &mOutputNode);
	checkErr(err);
	
	//Get Audio Units from AUGraph node
	err = AUGraphNodeInfo(mGraph, mVarispeedNode, NULL, &mVarispeedUnit);   
	checkErr(err);
    err = AUGraphNodeInfo(mGraph, mFormatNode, NULL, &mFormatUnit);
    checkErr(err);
    err = AUGraphNodeInfo(mGraph, mEqualizerNode1, NULL, &mEqualizerUnit1);
    checkErr(err);
    err = AUGraphNodeInfo(mGraph, mEqualizerNode2, NULL, &mEqualizerUnit2);
    checkErr(err);
	err = AUGraphNodeInfo(mGraph, mOutputNode, NULL, &mOutputUnit);   
	checkErr(err);
	
	// don't connect nodes until the varispeed unit has input and output formats set

	return err;
}

OSStatus EQEngine::SetupAUHAL(AudioDeviceID in){
	OSStatus err = noErr;
    
    AudioComponent comp;
    AudioComponentDescription desc;
	
	//There are several different types of Audio Units.
	//Some audio units serve as Outputs, Mixers, or DSP
	//units. See AUComponent.h for listing
	desc.componentType = kAudioUnitType_Output;
	
	//Every Component has a subType, which will give a clearer picture
	//of what this components function will be.
	desc.componentSubType = kAudioUnitSubType_HALOutput;
	
	//all Audio Units in AUComponent.h must use 
	//"kAudioUnitManufacturer_Apple" as the Manufacturer
	desc.componentManufacturer = kAudioUnitManufacturer_Apple;
	desc.componentFlags = 0;
	desc.componentFlagsMask = 0;
	
	//Finds a component that meets the desc spec's
    comp = AudioComponentFindNext(NULL, &desc);
	if (comp == NULL) exit (-1);
	
	//gains access to the services provided by the component
    err = AudioComponentInstanceNew(comp, &mInputUnit);
    checkErr(err);
    
	//AUHAL needs to be initialized before anything is done to it
	err = AudioUnitInitialize(mInputUnit);
	checkErr(err);
	
	err = EnableIO();
	checkErr(err);
	
	err= SetInputDeviceAsCurrent(in);
	checkErr(err);
	
	err = CallbackSetup();
	checkErr(err);
	
	//Don't setup buffers until you know what the 
	//input and output device audio streams look like.

	err = AudioUnitInitialize(mInputUnit);

	return err;
}

OSStatus EQEngine::EnableIO(){
	OSStatus err = noErr;
	UInt32 enableIO;
	
	///////////////
	//ENABLE IO (INPUT)
	//You must enable the Audio Unit (AUHAL) for input and disable output 
	//BEFORE setting the AUHAL's current device.
	
	//Enable input on the AUHAL
	enableIO = 1;
	err =  AudioUnitSetProperty(mInputUnit,
								kAudioOutputUnitProperty_EnableIO,
								kAudioUnitScope_Input,
								1, // input element
								&enableIO,
								sizeof(enableIO));
	checkErr(err);
	
	//disable Output on the AUHAL
	enableIO = 1;
	err = AudioUnitSetProperty(mInputUnit,
							  kAudioOutputUnitProperty_EnableIO,
							  kAudioUnitScope_Output,
							  0,   //output element
							  &enableIO,
							  sizeof(enableIO));
	return err;
}

OSStatus EQEngine::CallbackSetup(){
	OSStatus err = noErr;
    AURenderCallbackStruct input;
	
    input.inputProc = InputProc;
    input.inputProcRefCon = this;
	
	//Setup the input callback. 
	err = AudioUnitSetProperty(mInputUnit, 
							  kAudioOutputUnitProperty_SetInputCallback, 
							  kAudioUnitScope_Global,
							  0,
							  &input, 
							  sizeof(input));
	checkErr(err);
	return err;
}

//Allocate Audio Buffer List(s) to hold the data from input.
OSStatus EQEngine::SetupBuffers(){
	OSStatus err = noErr;
	UInt32 bufferSizeFrames,bufferSizeBytes,propsize;
	
	CAStreamBasicDescription asbd_dev1_in,asbd_dev2_out;
	Float64 rate=0;
	
	//Get the size of the IO buffer(s)
	UInt32 propertySize = sizeof(bufferSizeFrames);
	err = AudioUnitGetProperty(mInputUnit, kAudioDevicePropertyBufferFrameSize, kAudioUnitScope_Global, 0, &bufferSizeFrames, &propertySize);
	checkErr(err);
    bufferSizeBytes = bufferSizeFrames * sizeof(Float32);
		
	//Get the Stream Format (Output client side)
	propertySize = sizeof(asbd_dev1_in);
	err = AudioUnitGetProperty(mInputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 1, &asbd_dev1_in, &propertySize);
	checkErr(err);
    printf("=====Input DEVICE stream format\n" );
    asbd_dev1_in.Print();
	
	//Get the Stream Format (client side)
	propertySize = sizeof(asbd);
	err = AudioUnitGetProperty(mInputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 1, &asbd, &propertySize);		
	checkErr(err);
    printf("=====current Input (Client) stream format\n");
	asbd.Print();

	//Get the Stream Format (Output client side)
	propertySize = sizeof(asbd_dev2_out);
	err = AudioUnitGetProperty(mOutputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 0, &asbd_dev2_out, &propertySize);
	checkErr(err);
    printf("=====Output (Device) stream format\n");
	asbd_dev2_out.Print();
	
	//////////////////////////////////////
	//Set the format of all the AUs to the input/output devices channel count
	//For a simple case, you want to set this to the lower of count of the channels
	//in the input device vs output device
	//////////////////////////////////////
	asbd.mChannelsPerFrame =((asbd_dev1_in.mChannelsPerFrame < asbd_dev2_out.mChannelsPerFrame) ?asbd_dev1_in.mChannelsPerFrame :asbd_dev2_out.mChannelsPerFrame) ;

	// We must get the sample rate of the input device and set it to the stream format of AUHAL
	propertySize = sizeof(Float64);
    AudioObjectPropertyAddress theAddress = { kAudioDevicePropertyNominalSampleRate,
                                              kAudioObjectPropertyScopeGlobal,
                                              kAudioObjectPropertyElementMaster };
                                              
    err = AudioObjectGetPropertyData(mInputDevice.mID, &theAddress, 0, NULL, &propertySize, &rate);
	checkErr(err);
    
    asbd.mSampleRate =rate;
	propertySize = sizeof(asbd);
	
	//Set the new formats to the AUs...
	err = AudioUnitSetProperty(mInputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 1, &asbd, propertySize);
	checkErr(err);	
	err = AudioUnitSetProperty(mVarispeedUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &asbd, propertySize);
	checkErr(err);
	
	//Set the correct sample rate for the output device, but keep the channel count the same
	propertySize = sizeof(Float64);
    
    err = AudioObjectGetPropertyData(mOutputDevice.mID, &theAddress, 0, NULL, &propertySize, &rate);
    checkErr(err);
	
    asbd.mSampleRate =rate;
	propertySize = sizeof(asbd);
	
    //Set the new audio stream formats for the rest of the AUs...
	err = AudioUnitSetProperty(mVarispeedUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 0, &asbd, propertySize);
	checkErr(err);	
	err = AudioUnitSetProperty(mOutputUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &asbd, propertySize);
	checkErr(err);

	//calculate number of buffers from channels
	propsize = offsetof(AudioBufferList, mBuffers[0]) + (sizeof(AudioBuffer) *asbd.mChannelsPerFrame);

	//malloc buffer lists
	mInputBuffer = (AudioBufferList *)malloc(propsize);
	mInputBuffer->mNumberBuffers = asbd.mChannelsPerFrame;
	
	//pre-malloc buffers for AudioBufferLists
	for(UInt32 i =0; i< mInputBuffer->mNumberBuffers ; i++) {
		mInputBuffer->mBuffers[i].mNumberChannels = 1;
		mInputBuffer->mBuffers[i].mDataByteSize = bufferSizeBytes;
		mInputBuffer->mBuffers[i].mData = malloc(bufferSizeBytes);
	}
	
	//Alloc ring buffer that will hold data between the two audio devices
	mBuffer = new CARingBuffer();	
	mBuffer->Allocate(asbd.mChannelsPerFrame, asbd.mBytesPerFrame, bufferSizeFrames * 20);
	
    return err;
}

void	EQEngine::ComputeThruOffset(){
	//The initial latency will at least be the saftey offset's of the devices + the buffer sizes
	mInToOutSampleOffset = SInt32(mInputDevice.mSafetyOffset +  mInputDevice.mBufferSizeFrames +
						mOutputDevice.mSafetyOffset + mOutputDevice.mBufferSizeFrames);
}


#pragma mark -
#pragma mark -- IO Procs --
OSStatus EQEngine::InputProc(void *inRefCon,
									AudioUnitRenderActionFlags *ioActionFlags,
									const AudioTimeStamp *inTimeStamp,
									UInt32 inBusNumber,
									UInt32 inNumberFrames,
									AudioBufferList * ioData){
    OSStatus err = noErr;
	EQEngine *This = (EQEngine *)inRefCon;
	if (This->mFirstInputTime < 0.)
		This->mFirstInputTime = inTimeStamp->mSampleTime;
	//Get the new audio data
    
	err = AudioUnitRender(This->mInputUnit,
						 ioActionFlags,
						 inTimeStamp, 
						 inBusNumber,     
						 inNumberFrames, //# of frames requested
						 This->mInputBuffer);// Audio Buffer List to hold data
	checkErr(err);
	if(!err) {
		err = This->mBuffer->Store(This->mInputBuffer, Float64(inNumberFrames), SInt64(inTimeStamp->mSampleTime));
	}
    return err;
}

inline void MakeBufferSilent (AudioBufferList * ioData){
	for(UInt32 i=0; i<ioData->mNumberBuffers;i++)
		memset(ioData->mBuffers[i].mData, 0, ioData->mBuffers[i].mDataByteSize);	
}


OSStatus EQEngine::OutputProc(void *inRefCon,
									 AudioUnitRenderActionFlags *ioActionFlags,
									 const AudioTimeStamp *TimeStamp,
									 UInt32 inBusNumber,
									 UInt32 inNumberFrames,
									 AudioBufferList * ioData){
    OSStatus err = noErr;
    EQEngine *This = (EQEngine *)inRefCon;

	Float64 rate = 0.0;
	AudioTimeStamp inTS, outTS;
	if (This->mFirstInputTime < 0.) {
		// input hasn't run yet -> silence
		MakeBufferSilent (ioData);
		return noErr;
	}

    //use the varispeed playback rate to offset small discrepancies in sample rate
	//first find the rate scalars of the input and output devices
	err = AudioDeviceGetCurrentTime(This->mInputDevice.mID, &inTS);
	// this callback may still be called a few times after the device has been stopped
	if (err)
	{
		MakeBufferSilent (ioData);
		return noErr;
	}
		
	err = AudioDeviceGetCurrentTime(This->mOutputDevice.mID, &outTS);
    
	checkErr(err);
	
    rate = inTS.mRateScalar / outTS.mRateScalar;
	err = AudioUnitSetParameter(This->mVarispeedUnit,kVarispeedParam_PlaybackRate,kAudioUnitScope_Global,0, rate,0);
	checkErr(err);
	
	//get Delta between the devices and add it to the offset
	if (This->mFirstOutputTime < 0.) {
		This->mFirstOutputTime = TimeStamp->mSampleTime;
		Float64 delta = (This->mFirstInputTime - This->mFirstOutputTime);
		This->ComputeThruOffset();   
		//changed: 3865519 11/10/04
		if (delta < 0.0)
			This->mInToOutSampleOffset -= delta;
		else
			This->mInToOutSampleOffset = -delta + This->mInToOutSampleOffset;
					
		MakeBufferSilent (ioData);
		return noErr;
	}
    
	//copy the data from the buffers	
	err = This->mBuffer->Fetch(ioData, inNumberFrames, SInt64(TimeStamp->mSampleTime - This->mInToOutSampleOffset));
    
    checkErr(err);
	if(err != kCARingBufferError_OK)
	{
		MakeBufferSilent (ioData);
		SInt64 bufferStartTime, bufferEndTime;
		This->mBuffer->GetTimeBounds(bufferStartTime, bufferEndTime);
		This->mInToOutSampleOffset = TimeStamp->mSampleTime - bufferStartTime;
	}

	return noErr;
}



