//
//  EQM_WrappedAudioEngine.h
//  EQMDriver
//
//
//  The plan for this is to allow devices with IOAudioEngine drivers to be used as the output device
//  directly from EQMDriver, rather than going through EQMApp. That way we get roughly the same CPU
//  usage and latency as normal, and don't need to worry about pausing EQMApp's IO when no clients
//  are doing IO. It also lets EQMDriver mostly continue working without EQMApp running. I've written
//  a very experimental version that mostly works but the code needs a lot of clean up so I haven't
//  added it to this project yet.
//

#ifndef __EQMDriver__EQM_WrappedAudioEngine__
#define __EQMDriver__EQM_WrappedAudioEngine__

#include <CoreAudio/CoreAudioTypes.h>
#include <mach/kern_return.h>


class EQM_WrappedAudioEngine
{
    
public:
    UInt64          GetSampleRate() const;
    kern_return_t   SetSampleRate(Float64 inNewSampleRate);
    UInt32          GetSampleBufferFrameSize() const;
    
};

#endif /* __EQMDriver__EQM_WrappedAudioEngine__ */

