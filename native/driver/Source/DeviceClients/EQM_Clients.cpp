//
//  EQM_Clients.cpp
//  EQMDriver
//
//  Copyright © 2017 Andrew Tonner
//

// Self Include
#include "EQM_Clients.h"

// Local Includes
#include "EQM_Types.h"
#include "EQM_PlugIn.h"

// PublicUtility Includes
#include "CAException.h"
#include "CACFDictionary.h"
#include "CADispatchQueue.h"


#pragma mark Construction/Destruction

EQM_Clients::EQM_Clients(AudioObjectID inOwnerDeviceID, EQM_TaskQueue* inTaskQueue)
:
    mOwnerDeviceID(inOwnerDeviceID),
    mClientMap(inTaskQueue)
{
    mRelativeVolumeCurve.AddRange(kAppRelativeVolumeMinRawValue,
                                  kAppRelativeVolumeMaxRawValue,
                                  kAppRelativeVolumeMinDbValue,
                                  kAppRelativeVolumeMaxDbValue);
}

#pragma mark Add/Remove Clients

void    EQM_Clients::AddClient(EQM_Client inClient)
{
    CAMutex::Locker theLocker(mMutex);

    // Check whether this is the music player's client
    bool pidMatchesMusicPlayerProperty =
        (mMusicPlayerProcessIDProperty != 0 && inClient.mProcessID == mMusicPlayerProcessIDProperty);
    bool bundleIDMatchesMusicPlayerProperty =
        (mMusicPlayerBundleIDProperty != "" &&
         inClient.mBundleID.IsValid() &&
         inClient.mBundleID == mMusicPlayerBundleIDProperty);
    
    inClient.mIsMusicPlayer = (pidMatchesMusicPlayerProperty || bundleIDMatchesMusicPlayerProperty);
    
    if(inClient.mIsMusicPlayer)
    {
        DebugMsg("EQM_Clients::AddClient: Adding music player client. mClientID = %u", inClient.mClientID);
    }
    
    mClientMap.AddClient(inClient);
    
    // If we're adding EQMApp, update our local copy of its client ID
//    if(inClient.mBundleID.IsValid() && inClient.mBundleID == kEQMAppBundleID)
//    {
//        mEQMAppClientID = inClient.mClientID;
//    }
}

void    EQM_Clients::RemoveClient(const UInt32 inClientID)
{
    CAMutex::Locker theLocker(mMutex);
    
    EQM_Client theRemovedClient = mClientMap.RemoveClient(inClientID);
    
    // If we're removing EQMApp, clear our local copy of its client ID
    if(theRemovedClient.mClientID == mEQMAppClientID)
    {
        mEQMAppClientID = -1;
    }
}

#pragma mark IO Status

bool    EQM_Clients::StartIONonRT(UInt32 inClientID)
{
    CAMutex::Locker theLocker(mMutex);
    
    bool didStartIO = false;
    
    EQM_Client theClient;
    bool didFindClient = mClientMap.GetClientNonRT(inClientID, &theClient);
    
    ThrowIf(!didFindClient, EQM_InvalidClientException(), "EQM_Clients::StartIO: Cannot start IO for client that was never added");
    
    bool sendIsRunningNotification = false;
    bool sendIsRunningSomewhereOtherThanEQMAppNotification = false;

    if(!theClient.mDoingIO)
    {
        // Make sure we can start
        ThrowIf(mStartCount == UINT64_MAX, CAException(kAudioHardwareIllegalOperationError), "EQM_Clients::StartIO: failed to start because the ref count was maxxed out already");
        
        DebugMsg("EQM_Clients::StartIO: Client %u (%s, %d) starting IO",
                 inClientID,
                 CFStringGetCStringPtr(theClient.mBundleID.GetCFString(), kCFStringEncodingUTF8),
                 theClient.mProcessID);
        
        mClientMap.StartIONonRT(inClientID);
        
        mStartCount++;
        
        // Update mStartCountExcludingEQMApp
        if(!IsEQMApp(inClientID))
        {
            ThrowIf(mStartCountExcludingEQMApp == UINT64_MAX, CAException(kAudioHardwareIllegalOperationError), "EQM_Clients::StartIO: failed to start because mStartCountExcludingEQMApp was maxxed out already");
            
            mStartCountExcludingEQMApp++;
            
            if(mStartCountExcludingEQMApp == 1)
            {
                sendIsRunningSomewhereOtherThanEQMAppNotification = true;
            }
        }
        
        // Return true if no other clients were running IO before this one started, which means the device should start IO
        didStartIO = (mStartCount == 1);
        sendIsRunningNotification = didStartIO;
    }
    
    Assert(mStartCountExcludingEQMApp == mStartCount - 1 || mStartCountExcludingEQMApp == mStartCount,
           "mStartCount and mStartCountExcludingEQMApp are out of sync");
    
    SendIORunningNotifications(sendIsRunningNotification, sendIsRunningSomewhereOtherThanEQMAppNotification);

    return didStartIO;
}

bool    EQM_Clients::StopIONonRT(UInt32 inClientID)
{
    CAMutex::Locker theLocker(mMutex);
    
    bool didStopIO = false;
    
    EQM_Client theClient;
    bool didFindClient = mClientMap.GetClientNonRT(inClientID, &theClient);
    
    ThrowIf(!didFindClient, EQM_InvalidClientException(), "EQM_Clients::StopIO: Cannot stop IO for client that was never added");
    
    bool sendIsRunningNotification = false;
    bool sendIsRunningSomewhereOtherThanEQMAppNotification = false;
    
    if(theClient.mDoingIO)
    {
        DebugMsg("EQM_Clients::StopIO: Client %u (%s, %d) stopping IO",
                 inClientID,
                 CFStringGetCStringPtr(theClient.mBundleID.GetCFString(), kCFStringEncodingUTF8),
                 theClient.mProcessID);
        
        mClientMap.StopIONonRT(inClientID);
        
        ThrowIf(mStartCount <= 0, CAException(kAudioHardwareIllegalOperationError), "EQM_Clients::StopIO: Underflowed mStartCount");
        
        mStartCount--;
        
        // Update mStartCountExcludingEQMApp
        if(!IsEQMApp(inClientID))
        {
            ThrowIf(mStartCountExcludingEQMApp <= 0, CAException(kAudioHardwareIllegalOperationError), "EQM_Clients::StopIO: Underflowed mStartCountExcludingEQMApp");
            
            mStartCountExcludingEQMApp--;
            
            if(mStartCountExcludingEQMApp == 0)
            {
                sendIsRunningSomewhereOtherThanEQMAppNotification = true;
            }
        }
        
        // Return true if we stopped IO entirely (i.e. there are no clients still running IO)
        didStopIO = (mStartCount == 0);
        sendIsRunningNotification = didStopIO;
    }
    
    Assert(mStartCountExcludingEQMApp == mStartCount - 1 || mStartCountExcludingEQMApp == mStartCount,
           "mStartCount and mStartCountExcludingEQMApp are out of sync");
    
    SendIORunningNotifications(sendIsRunningNotification, sendIsRunningSomewhereOtherThanEQMAppNotification);
    
    return didStopIO;
}

bool    EQM_Clients::ClientsRunningIO() const
{
    return mStartCount > 0;
}

bool    EQM_Clients::ClientsOtherThanEQMAppRunningIO() const
{
    return mStartCountExcludingEQMApp > 0;
}

void    EQM_Clients::SendIORunningNotifications(bool sendIsRunningNotification, bool sendIsRunningSomewhereOtherThanEQMAppNotification) const
{
    if(sendIsRunningNotification || sendIsRunningSomewhereOtherThanEQMAppNotification)
    {
        CADispatchQueue::GetGlobalSerialQueue().Dispatch(false, ^{
            AudioObjectPropertyAddress theChangedProperties[2];
            UInt32 theNotificationCount = 0;

            if(sendIsRunningNotification)
            {
                DebugMsg("EQM_Clients::SendIORunningNotifications: Sending kAudioDevicePropertyDeviceIsRunning");
                theChangedProperties[0] = { kAudioDevicePropertyDeviceIsRunning, kAudioObjectPropertyScopeGlobal, kAudioObjectPropertyElementMaster };
                theNotificationCount++;
            }

            if(sendIsRunningSomewhereOtherThanEQMAppNotification)
            {
                DebugMsg("EQM_Clients::SendIORunningNotifications: Sending kAudioDeviceCustomPropertyDeviceIsRunningSomewhereOtherThanEQMApp");
                theChangedProperties[theNotificationCount] = kEQMRunningSomewhereOtherThanEQMAppAddress;
                theNotificationCount++;
            }

            EQM_PlugIn::Host_PropertiesChanged(mOwnerDeviceID, theNotificationCount, theChangedProperties);
        });
    }
}

#pragma mark Music Player

bool    EQM_Clients::SetMusicPlayer(const pid_t inPID)
{
    ThrowIf(inPID < 0, EQM_InvalidClientPIDException(), "EQM_Clients::SetMusicPlayer: Invalid music player PID");
    
    CAMutex::Locker theLocker(mMutex);
    
    if(mMusicPlayerProcessIDProperty == inPID)
    {
        // We're not changing the properties, so return false
        return false;
    }
    
    mMusicPlayerProcessIDProperty = inPID;
    // Unset the bundle ID property
    mMusicPlayerBundleIDProperty = "";
    
    DebugMsg("EQM_Clients::SetMusicPlayer: Setting music player by PID. inPID=%d", inPID);
    
    // Update the clients' mIsMusicPlayer fields
    mClientMap.UpdateMusicPlayerFlags(inPID);
    
    return true;
}

bool    EQM_Clients::SetMusicPlayer(const CACFString inBundleID)
{
    Assert(inBundleID.IsValid(), "EQM_Clients::SetMusicPlayer: Invalid CACFString given as bundle ID");
    
    CAMutex::Locker theLocker(mMutex);
    
    if(mMusicPlayerBundleIDProperty == inBundleID)
    {
        // We're not changing the properties, so return false
        return false;
    }
    
    mMusicPlayerBundleIDProperty = inBundleID;
    // Unset the PID property
    mMusicPlayerProcessIDProperty = 0;
    
    DebugMsg("EQM_Clients::SetMusicPlayer: Setting music player by bundle ID. inBundleID=%s",
             CFStringGetCStringPtr(inBundleID.GetCFString(), kCFStringEncodingUTF8));
    
    // Update the clients' mIsMusicPlayer fields
    mClientMap.UpdateMusicPlayerFlags(inBundleID);
    
    return true;
}

bool    EQM_Clients::IsMusicPlayerRT(const UInt32 inClientID) const
{
    EQM_Client theClient;
    bool didGetClient = mClientMap.GetClientRT(inClientID, &theClient);
    return didGetClient && theClient.mIsMusicPlayer;
}

#pragma mark App Volumes

Float32 EQM_Clients::GetClientRelativeVolumeRT(UInt32 inClientID) const
{
    EQM_Client theClient;
    bool didGetClient = mClientMap.GetClientRT(inClientID, &theClient);
    return (didGetClient ? theClient.mRelativeVolume : 1.0f);
}

SInt32 EQM_Clients::GetClientPanPositionRT(UInt32 inClientID) const
{
    EQM_Client theClient;
    bool didGetClient = mClientMap.GetClientRT(inClientID, &theClient);
    return (didGetClient ? theClient.mPanPosition : kAppPanCenterRawValue);
}

bool    EQM_Clients::SetClientsRelativeVolumes(const CACFArray inAppVolumes)
{
    bool didChangeAppVolumes = false;
    
    // Each element in appVolumes is a CFDictionary containing the process id and/or bundle id of an app, and its
    // new relative volume
    for(UInt32 i = 0; i < inAppVolumes.GetNumberItems(); i++)
    {
        CACFDictionary theAppVolume(false);
        inAppVolumes.GetCACFDictionary(i, theAppVolume);
        
        // Get the app's PID from the dict
        pid_t theAppPID;
        bool didFindPID = theAppVolume.GetSInt32(CFSTR(kEQMAppVolumesKey_ProcessID), theAppPID);
        
        // Get the app's bundle ID from the dict
        CACFString theAppBundleID;
        theAppBundleID.DontAllowRelease();
        theAppVolume.GetCACFString(CFSTR(kEQMAppVolumesKey_BundleID), theAppBundleID);
        
        ThrowIf(!didFindPID && !theAppBundleID.IsValid(),
                EQM_InvalidClientRelativeVolumeException(),
                "EQM_Clients::SetClientsRelativeVolumes: App volume was sent without PID or bundle ID for app");
        
      bool didGetVolume;
      {
        SInt32 theRawRelativeVolume;
        didGetVolume = theAppVolume.GetSInt32(CFSTR(kEQMAppVolumesKey_RelativeVolume), theRawRelativeVolume);
        
        if (didGetVolume) {
          ThrowIf(didGetVolume && (theRawRelativeVolume < kAppRelativeVolumeMinRawValue || theRawRelativeVolume > kAppRelativeVolumeMaxRawValue),
                  EQM_InvalidClientRelativeVolumeException(),
                  "EQM_Clients::SetClientsRelativeVolumes: Relative volume for app out of valid range");
          
          // Apply the volume curve to the raw volume
          //
          // mRelativeVolumeCurve uses the default kPow2Over1Curve transfer function, so we also multiply by 4 to
          // keep the middle volume equal to 1 (meaning apps' volumes are unchanged by default).
          Float32 theRelativeVolume = mRelativeVolumeCurve.ConvertRawToScalar(theRawRelativeVolume) * 4;
          
          // Try to update the client's volume, first by PID and then by bundle ID. Always try
          // both because apps can have multiple clients.
          if(mClientMap.SetClientsRelativeVolume(theAppPID, theRelativeVolume))
          {
            didChangeAppVolumes = true;
          }
          
          if(mClientMap.SetClientsRelativeVolume(theAppBundleID, theRelativeVolume))
          {
            didChangeAppVolumes = true;
          }
          
          // TODO: If the app isn't currently a client, we should add it to the past clients
          //       map, or update its past volume if it's already in there.
        }
      }
      
      bool didGetPanPosition;
      {
        SInt32 thePanPosition;
        didGetPanPosition = theAppVolume.GetSInt32(CFSTR(kEQMAppVolumesKey_PanPosition), thePanPosition);
        if (didGetPanPosition) {
          ThrowIf(didGetPanPosition && (thePanPosition < kAppPanLeftRawValue || thePanPosition > kAppPanRightRawValue),
                  EQM_InvalidClientPanPositionException(),
                  "EQM_Clients::SetClientsRelativeVolumes: Pan position for app out of valid range");
          
          if(mClientMap.SetClientsPanPosition(theAppPID, thePanPosition))
          {
            didChangeAppVolumes = true;
          }
          
          if(mClientMap.SetClientsPanPosition(theAppBundleID, thePanPosition))
          {
            didChangeAppVolumes = true;
          }
          
          // TODO: If the app isn't currently a client, we should add it to the past clients
          //       map, or update its past pan position if it's already in there.
        }
      }
        
        ThrowIf(!didGetVolume && !didGetPanPosition,
                EQM_InvalidClientRelativeVolumeException(),
                "EQM_Clients::SetClientsRelativeVolumes: No volume or pan position in request");
    }
    
    return didChangeAppVolumes;
}

