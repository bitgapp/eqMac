//
//  EQM_Client.cpp
//  EQMDriver
//
//

// Self Include
#include "EQM_Client.h"


EQM_Client::EQM_Client(const AudioServerPlugInClientInfo* inClientInfo)
:
    mClientID(inClientInfo->mClientID),
    mProcessID(inClientInfo->mProcessID),
    mIsNativeEndian(inClientInfo->mIsNativeEndian),
    mBundleID(inClientInfo->mBundleID)
{
    // The bundle ID ref we were passed is only valid until our plugin returns control to the HAL, so we need to retain
    // it. (CACFString will handle the rest of its ownership/destruction.)
    if(inClientInfo->mBundleID != NULL)
    {
        CFRetain(inClientInfo->mBundleID);
    }
}

void    EQM_Client::Copy(const EQM_Client& inClient)
{
    mClientID = inClient.mClientID;
    mProcessID = inClient.mProcessID;
    mBundleID = inClient.mBundleID;
    mIsNativeEndian = inClient.mIsNativeEndian;
    mDoingIO = inClient.mDoingIO;
    mIsMusicPlayer = inClient.mIsMusicPlayer;
    mRelativeVolume = inClient.mRelativeVolume;
    mPanPosition = inClient.mPanPosition;
}

