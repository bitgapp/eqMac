/*
     File: EQEngine.h 
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

#ifndef __EQEngine_H__
#define __EQEngine_H__

#define checkErr( err) \
if(err) {\
	OSStatus error = static_cast<OSStatus>(err);\
		fprintf(stdout, "EQEngine Error: %ld ->  %s:  %d\n",  (long)error,\
			   __FILE__, \
			   __LINE__\
			   );\
				   fflush(stdout);\
		return err; \
}         

#include <CoreAudio/CoreAudio.h>
#include <AudioToolbox/AudioToolbox.h>
#include <AudioUnit/AudioUnit.h>
#include "CARingBuffer.h"
#include "AudioDevice.h"
#include "CAStreamBasicDescription.h"

class EQEngine {
    
public:
    EQEngine(AudioDeviceID input, AudioDeviceID output);
    ~EQEngine();
    
    OSStatus	Init(AudioDeviceID input, AudioDeviceID output);
    void		Cleanup();
    OSStatus	Start();
    OSStatus	Stop();
    Boolean		IsRunning();
    void        SetEqFrequencies(UInt32 frequencies[], UInt32 count);
    void        SetEqGains(Float32 gains[], UInt32 count);
    Float32*     GetEqGains();
    
    AudioDeviceID GetInputDeviceID()	{ return mInputDevice.mID;	}
    AudioDeviceID GetOutputDeviceID()	{ return mOutputDevice.mID; }
    
    AudioDeviceIOProcID mInputIOProcID;
    
private:
    OSStatus SetupGraph(AudioDeviceID out);
    OSStatus MakeGraph();
    
    OSStatus SetupAUHAL(AudioDeviceID in);
    OSStatus EnableIO();
    OSStatus CallbackSetup();
    OSStatus SetupBuffers();
    
    OSStatus ResetEqUnits();
    
    void ComputeThruOffset();
    
    
    static OSStatus InputProc(void *inRefCon,
                              AudioUnitRenderActionFlags *ioActionFlags,
                              const AudioTimeStamp *inTimeStamp,
                              UInt32				inBusNumber,
                              UInt32				inNumberFrames,
                              AudioBufferList *		ioData);
    
    static OSStatus OutputProc(void *inRefCon,
                               AudioUnitRenderActionFlags *ioActionFlags,
                               const AudioTimeStamp *inTimeStamp,
                               UInt32				inBusNumber,
                               UInt32				inNumberFrames,
                               AudioBufferList *	ioData);
    
    
    OSStatus SetOutputDeviceAsCurrent(AudioDeviceID out);
    OSStatus SetInputDeviceAsCurrent(AudioDeviceID in);
    
    AudioUnit mInputUnit;
    AudioBufferList *mInputBuffer;
    AudioDevice mInputDevice, mOutputDevice;
    CARingBuffer *mBuffer;
    
    CAStreamBasicDescription asbd;
    
    //AudioUnits and Graph
    AUGraph mGraph;
    AUNode mVarispeedNode;
    AudioUnit mVarispeedUnit;
    AUNode mFormatNode;
    AudioUnit mFormatUnit;
    AUNode mEqualizerNode1;
    AudioUnit mEqualizerUnit1;
    AUNode mEqualizerNode2;
    AudioUnit mEqualizerUnit2;
    AUNode mOutputNode;
    AudioUnit mOutputUnit;
    
    //Buffer sample info
    Float64 mFirstInputTime;
    Float64 mFirstOutputTime;
    Float64 mInToOutSampleOffset;
};

#endif //__EQEngine_H__
