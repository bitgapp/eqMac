//
//  EQM_AudibleState.h
//  EQMDriver
//
//
//  Inspects a stream of audio data and reports whether it's silent, silent except for the user's
//  music player, or audible.
//
//  See kAudioDeviceCustomPropertyDeviceAudibleState and the EQMDeviceAudibleState enum in
//  EQM_Types.h for more info.
//
//  Not thread-safe.
//

#ifndef EQMDriver__EQM_AudibleState
#define EQMDriver__EQM_AudibleState

// Local Includes
#include "EQM_Types.h"

// System Includes
#include <MacTypes.h>


#pragma clang assume_nonnull begin

class EQM_AudibleState
{

public:
                                EQM_AudibleState();

    /*!
     @return The current audible state of the device, to be used as the value of the
             kAudioDeviceCustomPropertyDeviceAudibleState property.
     */
    EQMDeviceAudibleState       GetState() const noexcept;

    /*! Set the audible state back to kEQMDeviceIsSilent and ignore all previous IO. */
    void                        Reset() noexcept;
    
    /*!
     Read an audio buffer sent by a single device client (i.e. a process playing audio) and update
     the audible state. The update will only affect the return value of GetState after the next
     call to UpdateWithMixedIO, when all IO for the cycle has been read.

     Real-time safe. Not thread safe.
     */
    void                        UpdateWithClientIO(bool inClientIsMusicPlayer,
                                                   UInt32 inIOBufferFrameSize,
                                                   Float64 inOutputSampleTime,
                                                   const Float32* inBuffer);
    /*!
     Read a fully mixed audio buffer and update the audible state. All client (unmixed) buffers for
     the same cycle must be read with UpdateWithClientIO before calling this function.

     Real-time safe. Not thread safe.

     @return True if the audible state changed.
     */
    bool                        UpdateWithMixedIO(UInt32 inIOBufferFrameSize,
                                                  Float64 inOutputSampleTime,
                                                  const Float32* inBuffer);

private:
    bool                        RecalculateState(Float64 inEndFrameSampleTime);

    static bool                 BufferIsAudible(UInt32 inIOBufferFrameSize,
                                                const Float32* inBuffer);

private:
    EQMDeviceAudibleState       mState;

    struct
    {
        Float64                 latestAudibleNonMusic;
        Float64                 latestSilent;
        Float64                 latestAudibleMusic;
        Float64                 latestSilentMusic;
    }                           mSampleTimes;

};

#pragma clang assume_nonnull end

#endif /* EQMDriver__EQM_AudibleState */

