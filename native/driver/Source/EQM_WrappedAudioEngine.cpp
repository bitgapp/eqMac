//
//  EQM_WrappedAudioEngine.cpp
//  EQMDriver
//
//

// Self Include
#include "EQM_WrappedAudioEngine.h"


// TODO: Register to be notified when the IO Registry values for these change so we can cache them

UInt64	EQM_WrappedAudioEngine::GetSampleRate() const
{
    return 0;
}

kern_return_t EQM_WrappedAudioEngine::SetSampleRate(Float64 inNewSampleRate)
{
    #pragma unused (inNewSampleRate)
    
    return 0;
}

UInt32 EQM_WrappedAudioEngine::GetSampleBufferFrameSize() const
{
    return 0;
}

