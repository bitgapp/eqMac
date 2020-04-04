//
//  EQM_ClientMap.cpp
//  EQMDriver
//
//  Copyright © 2017 Andrew Tonner
//

// Self Include
#include "EQM_ClientMap.h"

// Local Includes
#include "EQM_Types.h"

// PublicUtility Includes
#include "CACFDictionary.h"
#include "CAException.h"


#pragma clang assume_nonnull begin

void    EQM_ClientMap::AddClient(EQM_Client inClient)
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    // If this client has been a client in the past (and has a bundle ID), copy its previous audio settings
    auto pastClientItr = inClient.mBundleID.IsValid() ? mPastClientMap.find(inClient.mBundleID) : mPastClientMap.end();
    if(pastClientItr != mPastClientMap.end())
    {
        DebugMsg("EQM_ClientMap::AddClient: Found previous volume %f and pan %d for client %u",
                 pastClientItr->second.mRelativeVolume,
                 pastClientItr->second.mPanPosition,
                 inClient.mClientID);
        inClient.mRelativeVolume = pastClientItr->second.mRelativeVolume;
        inClient.mPanPosition = pastClientItr->second.mPanPosition;
    }
    
    // Add the new client to the shadow maps
    AddClientToShadowMaps(inClient);
    
    // Swap the maps with their shadow maps
    SwapInShadowMaps();
    
    // The shadow maps (which were the main maps until we swapped them) are now missing the new client. Add it again to
    // keep the sets of maps identical.
    AddClientToShadowMaps(inClient);
    
  // Insert the client into the past clients map. We do this here rather than in RemoveClient
  // because some apps add multiple clients with the same bundle ID and we want to give them all
  // the same settings (volume, etc.).
  if(inClient.mBundleID.IsValid())
  {
    mPastClientMap[inClient.mBundleID] = inClient;
  }
}

void    EQM_ClientMap::AddClientToShadowMaps(EQM_Client inClient)
{
    ThrowIf(mClientMapShadow.count(inClient.mClientID) != 0,
            EQM_InvalidClientException(),
            "EQM_ClientMap::AddClientToShadowMaps: Tried to add client whose client ID was already in use");
    
    // Add to the client ID shadow map
    mClientMapShadow[inClient.mClientID] = inClient;
    
    // Get a reference to the client in the map so we can add it to the pointer maps
    EQM_Client& clientInMap = mClientMapShadow.at(inClient.mClientID);
    
    // Add to the PID shadow map
    mClientMapByPIDShadow[inClient.mProcessID].push_back(&clientInMap);
    
    // Add to the bundle ID shadow map
    if(inClient.mBundleID.IsValid())
    {
        mClientMapByBundleIDShadow[inClient.mBundleID].push_back(&clientInMap);
    }
}

EQM_Client    EQM_ClientMap::RemoveClient(UInt32 inClientID)
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theClientItr = mClientMapShadow.find(inClientID);
    
    // Removing a client that was never added is an error
    ThrowIf(theClientItr == mClientMapShadow.end(),
            EQM_InvalidClientException(),
            "EQM_ClientMap::RemoveClient: Could not find client to be removed");
    
    EQM_Client theClient = theClientItr->second;
    
    // Remove the client from the shadow maps
    mClientMapShadow.erase(theClientItr);
    mClientMapByPIDShadow.erase(theClient.mProcessID);
    if(theClient.mBundleID.IsValid())
    {
        mClientMapByBundleID.erase(theClient.mBundleID);
    }
    
    // Swap the maps with their shadow maps
    SwapInShadowMaps();
    
    // Erase the client again so the maps and their shadow maps are kept identical
    mClientMapShadow.erase(inClientID);
    mClientMapByPIDShadow.erase(theClient.mProcessID);
    if(theClient.mBundleID.IsValid())
    {
        mClientMapByBundleID.erase(theClient.mBundleID);
    }
    
    return theClient;
}

bool    EQM_ClientMap::GetClientRT(UInt32 inClientID, EQM_Client* outClient) const
{
    CAMutex::Locker theMapsLocker(mMapsMutex);
    return GetClient(mClientMap, inClientID, outClient);
}

bool    EQM_ClientMap::GetClientNonRT(UInt32 inClientID, EQM_Client* outClient) const
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    return GetClient(mClientMapShadow, inClientID, outClient);
}

//static
bool    EQM_ClientMap::GetClient(const std::map<UInt32, EQM_Client>& inClientMap, UInt32 inClientID, EQM_Client* outClient)
{
    auto theClientItr = inClientMap.find(inClientID);
    
    if(theClientItr != inClientMap.end())
    {
        *outClient = theClientItr->second;
        return true;
    }
    
    return false;
}

std::vector<EQM_Client> EQM_ClientMap::GetClientsByPID(pid_t inPID) const
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    std::vector<EQM_Client> theClients;
    
    auto theMapItr = mClientMapByPIDShadow.find(inPID);
    if(theMapItr != mClientMapByPIDShadow.end())
    {
        // Found clients with the PID, so copy them into the return vector
        for(auto& theClientPtrsItr : theMapItr->second)
        {
            theClients.push_back(*theClientPtrsItr);
        }
    }
    
    return theClients;
}

#pragma mark Music Player

void    EQM_ClientMap::UpdateMusicPlayerFlags(pid_t inMusicPlayerPID)
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theIsMusicPlayerTest = [&] (EQM_Client theClient) {
        return (theClient.mProcessID == inMusicPlayerPID);
    };
    
    UpdateMusicPlayerFlagsInShadowMaps(theIsMusicPlayerTest);
    SwapInShadowMaps();
    UpdateMusicPlayerFlagsInShadowMaps(theIsMusicPlayerTest);
}

void    EQM_ClientMap::UpdateMusicPlayerFlags(CACFString inMusicPlayerBundleID)
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theIsMusicPlayerTest = [&] (EQM_Client theClient) {
        return (theClient.mBundleID.IsValid() && theClient.mBundleID == inMusicPlayerBundleID);
    };
    
    UpdateMusicPlayerFlagsInShadowMaps(theIsMusicPlayerTest);
    SwapInShadowMaps();
    UpdateMusicPlayerFlagsInShadowMaps(theIsMusicPlayerTest);
}

void    EQM_ClientMap::UpdateMusicPlayerFlagsInShadowMaps(std::function<bool(EQM_Client)> inIsMusicPlayerTest)
{
    for(auto& theItr : mClientMapShadow)
    {
        EQM_Client& theClient = theItr.second;
        theClient.mIsMusicPlayer = inIsMusicPlayerTest(theClient);
    }
}

#pragma mark App Volumes

CACFArray   EQM_ClientMap::CopyClientRelativeVolumesAsAppVolumes(CAVolumeCurve inVolumeCurve) const
{
    // Since this is a read-only, non-real-time operation, we can read from the shadow maps to avoid
    // locking the main maps.
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    CACFArray theAppVolumes(false);
    
    for(auto& theClientEntry : mClientMapShadow)
    {
        CopyClientIntoAppVolumesArray(theClientEntry.second, inVolumeCurve, theAppVolumes);
    }
    
    for(auto& thePastClientEntry : mPastClientMap)
    {
        CopyClientIntoAppVolumesArray(thePastClientEntry.second, inVolumeCurve, theAppVolumes);
    }
    
    return theAppVolumes;
}

void    EQM_ClientMap::CopyClientIntoAppVolumesArray(EQM_Client inClient, CAVolumeCurve inVolumeCurve, CACFArray& ioAppVolumes) const
{
    // Only include clients set to a non-default volume or pan
    if(inClient.mRelativeVolume != 1.0 || inClient.mPanPosition != 0)
    {
        CACFDictionary theAppVolume(false);
        
        theAppVolume.AddSInt32(CFSTR(kEQMAppVolumesKey_ProcessID), inClient.mProcessID);
        theAppVolume.AddString(CFSTR(kEQMAppVolumesKey_BundleID), inClient.mBundleID.CopyCFString());
        // Reverse the volume conversion from SetClientsRelativeVolumes
        theAppVolume.AddSInt32(CFSTR(kEQMAppVolumesKey_RelativeVolume),
                               inVolumeCurve.ConvertScalarToRaw(inClient.mRelativeVolume / 4));
        theAppVolume.AddSInt32(CFSTR(kEQMAppVolumesKey_PanPosition),
                               inClient.mPanPosition);
        
        ioAppVolumes.AppendDictionary(theAppVolume.GetDict());
    }
}

template <typename T>
std::vector<EQM_Client*> * _Nullable GetClientsFromMap(std::map<T, std::vector<EQM_Client*>> & map, T key) {
    auto theClientItr = map.find(key);
    if(theClientItr != map.end()) {
        return &theClientItr->second;
    }
    return nullptr;
}

std::vector<EQM_Client*> * _Nullable EQM_ClientMap::GetClients(pid_t inAppPid) {
    return GetClientsFromMap(mClientMapByPIDShadow, inAppPid);
}

std::vector<EQM_Client*> * _Nullable EQM_ClientMap::GetClients(CACFString inAppBundleID) {
    return GetClientsFromMap(mClientMapByBundleIDShadow, inAppBundleID);
}

void ShowSetRelativeVolumeMessage(pid_t inAppPID, EQM_Client* theClient);
void ShowSetRelativeVolumeMessage(CACFString inAppBundleID, EQM_Client* theClient);

void ShowSetRelativeVolumeMessage(pid_t inAppPID, EQM_Client* theClient) {
    (void)inAppPID;
    (void)theClient;
    DebugMsg("EQM_ClientMap::ShowSetRelativeVolumeMessage: Set volume %f for client %u by pid (%d)",
             theClient->mRelativeVolume,
             theClient->mClientID,
             inAppPID);
}

void ShowSetRelativeVolumeMessage(CACFString inAppBundleID, EQM_Client* theClient) {
    (void)inAppBundleID;
    (void)theClient;
    DebugMsg("EQM_ClientMap::ShowSetRelativeVolumeMessage: Set volume %f for client %u by bundle ID (%s)",
             theClient->mRelativeVolume,
             theClient->mClientID,
             CFStringGetCStringPtr(inAppBundleID.GetCFString(), kCFStringEncodingUTF8));
}

// Template method declarations are running into LLVM bug 23987
// TODO: template these.

//bool EQM_ClientMap::SetClientsRelativeVolume(pid_t inAppPID, Float32 inRelativeVolume) {
//    return SetClientsRelativeVolumeT<pid_t>(inAppPID, inRelativeVolume);
//}

//bool EQM_ClientMap::SetClientsRelativeVolume(CACFString inAppBundleID, Float32 inRelativeVolume) {
//    return SetClientsRelativeVolumeT<CACFString>(inAppBundleID, inRelativeVolume)
//}

//template <typename T>
//bool EQM_ClientMap::SetClientsRelativeVolume(T searchKey, Float32 inRelativeVolume)

bool EQM_ClientMap::SetClientsRelativeVolume(pid_t searchKey, Float32 inRelativeVolume)
{
    bool didChangeVolume = false;
    
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theSetVolumesInShadowMapsFunc = [&] {
        // Look up the clients for the key and update their volumes
        
        auto theClients = GetClients(searchKey);
        if(theClients != nullptr)
        {
            for(EQM_Client* theClient : *theClients)
            {
                theClient->mRelativeVolume = inRelativeVolume;
                
                ShowSetRelativeVolumeMessage(searchKey, theClient);
                
                didChangeVolume = true;
            }
        }
    };
    
    theSetVolumesInShadowMapsFunc();
    SwapInShadowMaps();
    theSetVolumesInShadowMapsFunc();
    
    return didChangeVolume;
}

bool EQM_ClientMap::SetClientsRelativeVolume(CACFString searchKey, Float32 inRelativeVolume)
{
    bool didChangeVolume = false;
    
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theSetVolumesInShadowMapsFunc = [&] {
        // Look up the clients for the key and update their volumes
        
        auto theClients = GetClients(searchKey);
        if(theClients != nullptr)
        {
            for(EQM_Client* theClient : *theClients)
            {
                theClient->mRelativeVolume = inRelativeVolume;
                
                ShowSetRelativeVolumeMessage(searchKey, theClient);
                
                didChangeVolume = true;
            }
        }
    };
    
    theSetVolumesInShadowMapsFunc();
    SwapInShadowMaps();
    theSetVolumesInShadowMapsFunc();
    
    return didChangeVolume;
}

bool EQM_ClientMap::SetClientsPanPosition(pid_t searchKey, SInt32 inPanPosition)
{
    bool didChangePanPosition = false;
    
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theSetPansInShadowMapsFunc = [&] {
        // Look up the clients for the key and update their pan positions
        auto theClients = GetClients(searchKey);
        if(theClients != nullptr) {
            for(auto theClient: *theClients) {
                theClient->mPanPosition = inPanPosition;
                didChangePanPosition = true;
            }
        }
    };
    
    theSetPansInShadowMapsFunc();
    SwapInShadowMaps();
    theSetPansInShadowMapsFunc();
    
    return didChangePanPosition;
}

bool EQM_ClientMap::SetClientsPanPosition(CACFString searchKey, SInt32 inPanPosition)
{
    bool didChangePanPosition = false;
    
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    auto theSetPansInShadowMapsFunc = [&] {
        // Look up the clients for the key and update their pan positions
        auto theClients = GetClients(searchKey);
        if(theClients != nullptr) {
            for(auto theClient: *theClients) {
                theClient->mPanPosition = inPanPosition;
                didChangePanPosition = true;
            }
        }
    };
    
    theSetPansInShadowMapsFunc();
    SwapInShadowMaps();
    theSetPansInShadowMapsFunc();
    
    return didChangePanPosition;
}

void    EQM_ClientMap::UpdateClientIOStateNonRT(UInt32 inClientID, bool inDoingIO)
{
    CAMutex::Locker theShadowMapsLocker(mShadowMapsMutex);
    
    mClientMapShadow[inClientID].mDoingIO = inDoingIO;
    SwapInShadowMaps();
    mClientMapShadow[inClientID].mDoingIO = inDoingIO;
}

void    EQM_ClientMap::SwapInShadowMaps()
{
    mTaskQueue->QueueSync_SwapClientShadowMaps(this);
}

void    EQM_ClientMap::SwapInShadowMapsRT()
{
#if DEBUG
    // This method should only be called by the realtime worker thread in EQM_TaskQueue. The only safe way to call it is on a realtime
    // thread while a non-realtime thread is holding the shadow maps mutex. (These assertions assume that the realtime worker thread is
    // the only thread we'll call this on, but we could decide to change that at some point.)
    mTaskQueue->AssertCurrentThreadIsRTWorkerThread("EQM_ClientMap::SwapInShadowMapsRT");
    
    Assert(!mShadowMapsMutex.IsFree(), "Can't swap in the shadow maps while the shadow maps mutex is free");
    Assert(!mShadowMapsMutex.IsOwnedByCurrentThread(), "The shadow maps mutex should not be held by a realtime thread");
#endif
    
    CAMutex::Locker theMapsLocker(mMapsMutex);
    
    mClientMap.swap(mClientMapShadow);
    mClientMapByPID.swap(mClientMapByPIDShadow);
    mClientMapByBundleID.swap(mClientMapByBundleIDShadow);
}

#pragma clang assume_nonnull end

