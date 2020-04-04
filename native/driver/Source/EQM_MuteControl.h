//
//  EQM_MuteControl.h
//  EQMDriver
//
//  
//

#ifndef EQMDriver__EQM_MuteControl
#define EQMDriver__EQM_MuteControl

// Superclass Includes
#include "EQM_Control.h"

// PublicUtility Includes
#include "CAMutex.h"

// System Includes
#include <MacTypes.h>
#include <CoreAudio/CoreAudio.h>


#pragma clang assume_nonnull begin

class EQM_MuteControl
:
    public EQM_Control
{

#pragma mark Construction/Destruction

public:
                              EQM_MuteControl(AudioObjectID inObjectID,
                                              AudioObjectID inOwnerObjectID,
                                              AudioObjectPropertyScope inScope = kAudioObjectPropertyScopeOutput,
                                              AudioObjectPropertyElement inElement =
                                                      kAudioObjectPropertyElementMaster);

#pragma mark Property Operations

    bool                      HasProperty(AudioObjectID inObjectID,
                                          pid_t inClientPID,
                                          const AudioObjectPropertyAddress& inAddress) const;

    bool                      IsPropertySettable(AudioObjectID inObjectID,
                                                 pid_t inClientPID,
                                                 const AudioObjectPropertyAddress& inAddress) const;

    UInt32                    GetPropertyDataSize(AudioObjectID inObjectID,
                                                  pid_t inClientPID,
                                                  const AudioObjectPropertyAddress& inAddress,
                                                  UInt32 inQualifierDataSize,
                                                  const void* inQualifierData) const;

    void                      GetPropertyData(AudioObjectID inObjectID,
                                              pid_t inClientPID,
                                              const AudioObjectPropertyAddress& inAddress,
                                              UInt32 inQualifierDataSize,
                                              const void* inQualifierData,
                                              UInt32 inDataSize,
                                              UInt32& outDataSize,
                                              void* outData) const;

    void                      SetPropertyData(AudioObjectID inObjectID,
                                              pid_t inClientPID,
                                              const AudioObjectPropertyAddress& inAddress,
                                              UInt32 inQualifierDataSize,
                                              const void* inQualifierData,
                                              UInt32 inDataSize,
                                              const void* inData);

#pragma mark Implementation

private:
    CAMutex                   mMutex;
    bool                      mMuted;

};

#pragma clang assume_nonnull end

#endif /* EQMDriver__EQM_MuteControl */

