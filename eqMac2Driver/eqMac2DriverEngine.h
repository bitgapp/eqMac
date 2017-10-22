/*
	File:eqMac2DriverEngine.h

	Version: 1.0.1, ma++ ingalls
    
	Copyright (c) 2004 Cycling '74

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

#ifndef _eqMac2DriverENGINE_H
#define _eqMac2DriverENGINE_H

#include <IOKit/audio/IOAudioEngine.h>
#include "eqMac2DriverDevice.h"


class eqMac2DriverEngine : public IOAudioEngine
{
    OSDeclareDefaultStructors(eqMac2DriverEngine)
    
	UInt32				mBufferSize;
	void*				mBuffer;				// input/output buffer
    float*				mThruBuffer;			// intermediate buffer to pass in-->out
	
	IOAudioStream*		outputStream;
	IOAudioStream*		inputStream;
    	
	UInt32				mLastValidSampleFrame;
    
    IOTimerEventSource*	timerEventSource;
    
    UInt32				blockSize;				// In sample frames -- fixed, as defined in the Info.plist (e.g. 8192)
    UInt32				numBlocks;
    UInt32				currentBlock;
    
    UInt64				blockTimeoutNS;
    UInt64				nextTime;				// the estimated time the timer will fire next

    bool				duringHardwareInit;
    
	float             logTable[100] ; // Lookup for logarithmic volume scaling.

	
public:

    virtual bool init(OSDictionary *properties);
    virtual void free();
    
    virtual bool initHardware(IOService *provider);
    
    virtual bool createAudioStreams(IOAudioSampleRate *initialSampleRate);

    virtual IOReturn performAudioEngineStart();
    virtual IOReturn performAudioEngineStop();
    
    virtual UInt32 getCurrentSampleFrame();
    
    virtual IOReturn performFormatChange(IOAudioStream *audioStream, const IOAudioStreamFormat *newFormat, const IOAudioSampleRate *newSampleRate);

    virtual IOReturn clipOutputSamples(const void *mixBuf, void *sampleBuf, UInt32 firstSampleFrame, UInt32 numSampleFrames, const IOAudioStreamFormat *streamFormat, IOAudioStream *audioStream);
    virtual IOReturn convertInputSamples(const void *sampleBuf, void *destBuf, UInt32 firstSampleFrame, UInt32 numSampleFrames, const IOAudioStreamFormat *streamFormat, IOAudioStream *audioStream);
    
    virtual OSString *getGlobalUniqueID();

    
    static void ourTimerFired(OSObject *target, IOTimerEventSource *sender);
    
};


#endif /* _eqMac2DriverENGINE_H */
