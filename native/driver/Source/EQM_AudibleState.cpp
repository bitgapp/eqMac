//
//  EQM_AudibleState.cpp
//  EQMDriver
//
//  Copyright © 2016 Josh Junon
//

// Self Include
#include "EQM_AudibleState.h"

// PublicUtility Includes
#include "CADebugMacros.h"
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wsign-conversion"
#include "CAAtomic.h"
#pragma clang diagnostic pop

// STL Includes
#include <algorithm>  // For std::min and std::max.


// TODO: This is just the first value I tried.
static const Float32 kSampleVolumeMarginRaw = 0.0001f;

EQM_AudibleState::EQM_AudibleState()
:
    mState(kEQMDeviceIsSilent),
    mSampleTimes({0, 0, 0, 0})
{
}

EQMDeviceAudibleState   EQM_AudibleState::GetState() const noexcept
{
    CAMemoryBarrier();  // Probably unnecessary.
    return mState;
}

void    EQM_AudibleState::Reset() noexcept
{
    mState = kEQMDeviceIsSilent;

    mSampleTimes.latestSilent = 0;
    mSampleTimes.latestAudibleNonMusic = 0;
    mSampleTimes.latestSilentMusic = 0;
    mSampleTimes.latestAudibleMusic = 0;
}

void    EQM_AudibleState::UpdateWithClientIO(bool inClientIsMusicPlayer,
                                             UInt32 inIOBufferFrameSize,
                                             Float64 inOutputSampleTime,
                                             const Float32* inBuffer)
{
    // Update the sample times of the most recent audible music, silent music and audible non-music
    // samples we've received.

    Float64 endFrameSampleTime = inOutputSampleTime + inIOBufferFrameSize - 1;

    if(inClientIsMusicPlayer)
    {
        if(BufferIsAudible(inIOBufferFrameSize, inBuffer))
        {
            mSampleTimes.latestAudibleMusic = std::max(mSampleTimes.latestAudibleMusic,
                                                       endFrameSampleTime);
        }
        else
        {
            mSampleTimes.latestSilentMusic = std::max(mSampleTimes.latestSilentMusic,
                                                      endFrameSampleTime);
        }
    }
    else if(endFrameSampleTime > mSampleTimes.latestAudibleNonMusic &&  // Don't bother checking the
                                                                        // buffer if it won't change
                                                                        // anything.
            BufferIsAudible(inIOBufferFrameSize, inBuffer))
    {
        mSampleTimes.latestAudibleNonMusic = std::max(mSampleTimes.latestAudibleNonMusic,
                                                      endFrameSampleTime);
    }
}

bool    EQM_AudibleState::UpdateWithMixedIO(UInt32 inIOBufferFrameSize,
                                            Float64 inOutputSampleTime,
                                            const Float32* inBuffer)
{
    // Update the sample time of the most recent silent sample we've received. (The music player
    // client is not considered separate for the latest silent sample.)

    bool audible = BufferIsAudible(inIOBufferFrameSize, inBuffer);

    // The sample time of the last frame we're looking at.
    Float64 endFrameSampleTime = inOutputSampleTime + inIOBufferFrameSize - 1;

    if(!audible)
    {
        mSampleTimes.latestSilent = std::max(mSampleTimes.latestSilent, endFrameSampleTime);
    }

    return RecalculateState(endFrameSampleTime);
}

bool    EQM_AudibleState::RecalculateState(Float64 inEndFrameSampleTime)
{
    Float64 sinceLatestSilent = inEndFrameSampleTime - mSampleTimes.latestSilent;
    Float64 sinceLatestMusicSilent = inEndFrameSampleTime - mSampleTimes.latestSilentMusic;
    Float64 sinceLatestAudible = inEndFrameSampleTime - mSampleTimes.latestAudibleNonMusic;
    Float64 sinceLatestMusicAudible = inEndFrameSampleTime - mSampleTimes.latestAudibleMusic;

    bool didChangeState = false;

    // Update mState

    // Change from silent/silentExceptMusic to audible
    if(mState != kEQMDeviceIsAudible &&
       sinceLatestSilent >= kDeviceAudibleStateMinChangedFramesForUpdate &&
       // Check that non-music audio is currently playing
       sinceLatestAudible <= 0 && mSampleTimes.latestAudibleNonMusic != 0)
    {
        DebugMsg("EQM_AudibleState::RecalculateState: Changing "
                 "kAudioDeviceCustomPropertyDeviceAudibleState to audible");
        mState = kEQMDeviceIsAudible;
        CAMemoryBarrier();
        didChangeState = true;
    }
    // Change from silent to silentExceptMusic
    else if(((mState == kEQMDeviceIsSilent &&
              sinceLatestMusicSilent >= kDeviceAudibleStateMinChangedFramesForUpdate) ||
             // ...or from audible to silentExceptMusic
             (mState == kEQMDeviceIsAudible &&
              sinceLatestAudible >= kDeviceAudibleStateMinChangedFramesForUpdate &&
              sinceLatestMusicSilent >= kDeviceAudibleStateMinChangedFramesForUpdate)) &&
            // In case we haven't seen any music samples yet (either audible or silent), check that
            // music is currently playing
            sinceLatestMusicAudible <= 0 && mSampleTimes.latestAudibleMusic != 0)
    {
        DebugMsg("EQM_AudibleState::RecalculateState: Changing "
                 "kAudioDeviceCustomPropertyDeviceAudibleState to silent except music");
        mState = kEQMDeviceIsSilentExceptMusic;
        CAMemoryBarrier();
        didChangeState = true;
    }
    // Change from audible/silentExceptMusic to silent
    else if(mState != kEQMDeviceIsSilent &&
            sinceLatestAudible >= kDeviceAudibleStateMinChangedFramesForUpdate &&
            sinceLatestMusicAudible >= kDeviceAudibleStateMinChangedFramesForUpdate)
    {
        DebugMsg("EQM_AudibleState::RecalculateState: Changing "
                 "kAudioDeviceCustomPropertyDeviceAudibleState to silent");
        mState = kEQMDeviceIsSilent;
        CAMemoryBarrier();
        didChangeState = true;
    }

    return didChangeState;
}

// static
bool    EQM_AudibleState::BufferIsAudible(UInt32 inIOBufferFrameSize, const Float32* inBuffer)
{
    // Check each frame to see if any are audible. This could be much more accurate, but seems to
    // work well enough for now.
    //
    // The trade off here is between pausing the music player at the wrong time and unpausing it at
    // the wrong time. If a short sound (e.g. a UI alert) plays but has a long, barely-audible tail,
    // we might not detect the silence quickly enough and pause the music player. Similarly, if
    // we've paused the music player and there's a period of near-silence in the new audio, we might
    // unpause the music and briefly interrupt the new audio.
    //
    // A fairly long period of silence before unpausing the music player isn't a big problem, which
    // means EQMApp can wait much longer before unpausing than before pausing. So this function errs
    // toward considering the buffer silent, which helps EQMApp ignore short sounds.
    if(inIOBufferFrameSize > 0)
    {
        // Bounds for the left channel samples.
        Float32 firstSampleLLower = inBuffer[0] - kSampleVolumeMarginRaw;
        Float32 firstSampleLUpper = inBuffer[0] + kSampleVolumeMarginRaw;
        // Bounds for the right channel samples.
        Float32 firstSampleRLower = inBuffer[1] - kSampleVolumeMarginRaw;
        Float32 firstSampleRUpper = inBuffer[1] + kSampleVolumeMarginRaw;

        for(UInt32 i = 0; i < inIOBufferFrameSize * 2; i += 2)
        {
            bool audibleL =
                    (inBuffer[i] < firstSampleLLower) || (inBuffer[i] > firstSampleLUpper);
            bool audibleR =
                    (inBuffer[i + 1] < firstSampleRLower) || (inBuffer[i + 1] > firstSampleRUpper);

            if(audibleL || audibleR)
            {
                return true;
            }
        }
    }

    return false;
}

