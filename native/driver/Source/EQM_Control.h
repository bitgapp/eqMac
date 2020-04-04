//
//  EQM_Control.h
//  EQMDriver
//
//  
//
//  An AudioObject that represents a user-controllable aspect of a device or stream, such as volume
//  or balance.
//
//

#ifndef EQMDriver__EQM_Control
#define EQMDriver__EQM_Control

// Superclass Includes
#include "EQM_Object.h"


#pragma clang assume_nonnull begin

class EQM_Control
:
    public EQM_Object
{

protected:
                        EQM_Control(AudioObjectID inObjectID,
                                    AudioClassID inClassID,
                                    AudioClassID inBaseClassID,
                                    AudioObjectID inOwnerObjectID,
                                    AudioObjectPropertyScope inScope = kAudioObjectPropertyScopeOutput,
                                    AudioObjectPropertyElement inElement = kAudioObjectPropertyElementMaster
                        );

#pragma mark Property Operations

public:
    virtual bool        HasProperty(AudioObjectID inObjectID,
                                    pid_t inClientPID,
                                    const AudioObjectPropertyAddress& inAddress) const;
    virtual bool        IsPropertySettable(AudioObjectID inObjectID,
                                           pid_t inClientPID,
                                           const AudioObjectPropertyAddress& inAddress) const;
    virtual UInt32      GetPropertyDataSize(AudioObjectID inObjectID,
                                            pid_t inClientPID,
                                            const AudioObjectPropertyAddress& inAddress,
                                            UInt32 inQualifierDataSize,
                                            const void* inQualifierData) const;
    virtual void        GetPropertyData(AudioObjectID inObjectID,
                                        pid_t inClientPID,
                                        const AudioObjectPropertyAddress& inAddress,
                                        UInt32 inQualifierDataSize,
                                        const void* inQualifierData,
                                        UInt32 inDataSize,
                                        UInt32& outDataSize,
                                        void* outData) const;

#pragma mark Implementation

protected:
    void                CheckObjectID(AudioObjectID inObjectID) const;

protected:
    const AudioObjectPropertyScope      mScope;
    const AudioObjectPropertyElement    mElement;

};

#pragma clang assume_nonnull end

#endif /* EQMDriver__EQM_Control */

