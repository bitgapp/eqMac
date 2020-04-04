//  EQM_Stream.h
//  EQMDriver
//
//  
//
//  An input or output audio stream. Each stream belongs to a device (see EQM_AbstractDevice), which
//  in turn belongs to a plug-in (see EQM_PlugIn).
//
//  This class only handles the stream's HAL properties, i.e. the metadata about the stream, not the
//  audio data itself.
//

#ifndef EQMDriver__EQM_Stream
#define EQMDriver__EQM_Stream

// SuperClass Includes
#include "EQM_Object.h"

// PublicUtility Includes
#include "CAMutex.h"

// System Includes
#include <CoreAudio/AudioHardwareBase.h>


#pragma clang assume_nonnull begin

class EQM_Stream
:
    public EQM_Object
{

#pragma mark Construction/Destruction

public:
                                EQM_Stream(AudioObjectID inObjectID,
                                           AudioObjectID inOwnerDeviceID,
                                           bool inIsInput,
                                           Float64 inSampleRate,
                                           UInt32 inStartingChannel = 1);
    virtual                     ~EQM_Stream();

#pragma mark Property Operations

public:
    bool                        HasProperty(AudioObjectID inObjectID,
                                            pid_t inClientPID,
                                            const AudioObjectPropertyAddress& inAddress) const;
    bool                        IsPropertySettable(AudioObjectID inObjectID,
                                                   pid_t inClientPID,
                                                   const AudioObjectPropertyAddress& inAddress) const;
    UInt32                      GetPropertyDataSize(AudioObjectID inObjectID,
                                                    pid_t inClientPID,
                                                    const AudioObjectPropertyAddress& inAddress,
                                                    UInt32 inQualifierDataSize,
                                                    const void* __nullable inQualifierData) const;
    void                        GetPropertyData(AudioObjectID inObjectID,
                                                pid_t inClientPID,
                                                const AudioObjectPropertyAddress& inAddress,
                                                UInt32 inQualifierDataSize,
                                                const void* __nullable inQualifierData,
                                                UInt32 inDataSize,
                                                UInt32& outDataSize,
                                                void* outData) const;
    void                        SetPropertyData(AudioObjectID inObjectID,
                                                pid_t inClientPID,
                                                const AudioObjectPropertyAddress& inAddress,
                                                UInt32 inQualifierDataSize,
                                                const void* __nullable inQualifierData,
                                                UInt32 inDataSize,
                                                const void* inData);

#pragma mark Accessors

    void                        SetSampleRate(Float64 inSampleRate);

private:
    CAMutex                     mStateMutex;

    bool                        mIsInput;
    Float64                     mSampleRate;
    /*! True if the stream is enabled and doing IO. See kAudioStreamPropertyIsActive. */
    bool                        mIsStreamActive;
    /*! 
     The absolute channel number for the first channel in the stream. For example, if a device has
     two output streams with two channels each, then the starting channel number for the first 
     stream is 1 and the starting channel number for the second stream is 3. See 
     kAudioStreamPropertyStartingChannel.
     */
    UInt32                      mStartingChannel;

};

#pragma clang assume_nonnull end

#endif /* EQMDriver__EQM_Stream */

