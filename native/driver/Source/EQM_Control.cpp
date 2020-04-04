//
//  EQM_Control.cpp
//  EQMDriver
//
//  
//  Portions copyright (C) 2013 Apple Inc. All Rights Reserved.
//

// Self Include
#include "EQM_Control.h"

// PublicUtility Includes
#include "CADebugMacros.h"
#include "CAException.h"

// System Includes
#include <CoreAudio/AudioHardwareBase.h>


#pragma clang assume_nonnull begin

EQM_Control::EQM_Control(AudioObjectID inObjectID,
                         AudioClassID inClassID,
                         AudioClassID inBaseClassID,
                         AudioObjectID inOwnerObjectID,
                         AudioObjectPropertyScope inScope,
                         AudioObjectPropertyElement inElement)
:
    EQM_Object(inObjectID, inClassID, inBaseClassID, inOwnerObjectID),
    mScope(inScope),
    mElement(inElement)
{
}

bool    EQM_Control::HasProperty(AudioObjectID inObjectID,
                                 pid_t inClientPID,
                                 const AudioObjectPropertyAddress& inAddress) const
{
    CheckObjectID(inObjectID);

    bool theAnswer = false;

    switch(inAddress.mSelector)
    {
        case kAudioControlPropertyScope:
        case kAudioControlPropertyElement:
            theAnswer = true;
            break;

        default:
            theAnswer = EQM_Object::HasProperty(inObjectID, inClientPID, inAddress);
            break;
    };

    return theAnswer;
}

bool    EQM_Control::IsPropertySettable(AudioObjectID inObjectID,
                                        pid_t inClientPID,
                                        const AudioObjectPropertyAddress& inAddress) const
{
    CheckObjectID(inObjectID);

    bool theAnswer = false;

    switch(inAddress.mSelector)
    {
        case kAudioControlPropertyScope:
        case kAudioControlPropertyElement:
            theAnswer = false;
            break;

        default:
            theAnswer = EQM_Object::IsPropertySettable(inObjectID, inClientPID, inAddress);
            break;
    };

    return theAnswer;
}

UInt32  EQM_Control::GetPropertyDataSize(AudioObjectID inObjectID,
                                         pid_t inClientPID,
                                         const AudioObjectPropertyAddress& inAddress,
                                         UInt32 inQualifierDataSize,
                                         const void* inQualifierData) const
{
    CheckObjectID(inObjectID);

    UInt32 theAnswer = 0;

    switch(inAddress.mSelector)
    {
        case kAudioControlPropertyScope:
            theAnswer = sizeof(AudioObjectPropertyScope);
            break;

        case kAudioControlPropertyElement:
            theAnswer = sizeof(AudioObjectPropertyElement);
            break;

        default:
            theAnswer = EQM_Object::GetPropertyDataSize(inObjectID,
                                                        inClientPID,
                                                        inAddress,
                                                        inQualifierDataSize,
                                                        inQualifierData);
            break;
    };

    return theAnswer;
}

void    EQM_Control::GetPropertyData(AudioObjectID inObjectID,
                                     pid_t inClientPID,
                                     const AudioObjectPropertyAddress& inAddress,
                                     UInt32 inQualifierDataSize,
                                     const void* inQualifierData,
                                     UInt32 inDataSize,
                                     UInt32& outDataSize,
                                     void* outData) const
{
    CheckObjectID(inObjectID);

    switch(inAddress.mSelector)
    {
        case kAudioControlPropertyScope:
            // This property returns the scope that the control is attached to.
            ThrowIf(inDataSize < sizeof(AudioObjectPropertyScope),
                    CAException(kAudioHardwareBadPropertySizeError),
                    "EQM_Control::GetPropertyData: not enough space for the return value of "
                    "kAudioControlPropertyScope for the control");
            *reinterpret_cast<AudioObjectPropertyScope*>(outData) = mScope;
            outDataSize = sizeof(AudioObjectPropertyScope);
            break;

        case kAudioControlPropertyElement:
            // This property returns the element that the control is attached to.
            ThrowIf(inDataSize < sizeof(AudioObjectPropertyElement),
                    CAException(kAudioHardwareBadPropertySizeError),
                    "EQM_Control::GetPropertyData: not enough space for the return value of "
                    "kAudioControlPropertyElement for the control");
            *reinterpret_cast<AudioObjectPropertyElement*>(outData) = mElement;
            outDataSize = sizeof(AudioObjectPropertyElement);
            break;

        default:
            EQM_Object::GetPropertyData(inObjectID,
                                        inClientPID,
                                        inAddress,
                                        inQualifierDataSize,
                                        inQualifierData,
                                        inDataSize,
                                        outDataSize,
                                        outData);
            break;
    };
}

void    EQM_Control::CheckObjectID(AudioObjectID inObjectID) const
{
    ThrowIf(inObjectID == kAudioObjectUnknown || inObjectID != GetObjectID(),
            CAException(kAudioHardwareBadObjectError),
            "EQM_Control::CheckObjectID: wrong audio object ID for the control");
}

#pragma clang assume_nonnull end

