//
//  EQM_Clients.h
//  EQMDriver
//
//

#ifndef __EQMDriver__EQM_Clients__
#define __EQMDriver__EQM_Clients__

// Local Includes
#include "EQM_Client.h"
#include "EQM_ClientMap.h"

// PublicUtility Includes
#include "CAVolumeCurve.h"
#include "CAMutex.h"
#include "CACFArray.h"

// System Includes
#include <CoreAudio/AudioServerPlugIn.h>


// Forward Declations
class EQM_ClientTasks;


#pragma clang assume_nonnull begin

//==================================================================================================
//	EQM_Clients
//
//  Holds information about the clients (of the host) of the EQMDevice, i.e. the apps registered
//  with the HAL, generally so they can do IO at some point. EQMApp and the music player are special
//  case clients.
//
//  Methods whose names end with "RT" should only be called from real-time threads.
//==================================================================================================

class EQM_Clients
{
    
    friend class EQM_ClientTasks;
    
public:
                                        EQM_Clients(AudioObjectID inOwnerDeviceID, EQM_TaskQueue* inTaskQueue);
                                        ~EQM_Clients() = default;
    // Disallow copying. (It could make sense to implement these in future, but we don't need them currently.)
                                        EQM_Clients(const EQM_Clients&) = delete;
                                        EQM_Clients& operator=(const EQM_Clients&) = delete;
    
    void                                AddClient(EQM_Client inClient);
    void                                RemoveClient(const UInt32 inClientID);
    
private:
    // Only EQM_TaskQueue is allowed to call these (through the EQM_ClientTasks interface). We get notifications
    // from the HAL when clients start/stop IO and they have to be processed in the order we receive them to
    // avoid race conditions. If these methods could be called directly those calls would skip any queued calls.
    bool                                StartIONonRT(UInt32 inClientID);
    bool                                StopIONonRT(UInt32 inClientID);

public:
    bool                                ClientsRunningIO() const;
    bool                                ClientsOtherThanEQMAppRunningIO() const;
    
private:
    void                                SendIORunningNotifications(bool sendIsRunningNotification, bool sendIsRunningSomewhereOtherThanEQMAppNotification) const;
public:
    EQM_ClientMap                       mClientMap;
    bool                                IsEQMApp(UInt32 inClientID) const { return inClientID == mEQMAppClientID; }
    bool                                EQMAppHasClientRegistered() const { return mEQMAppClientID != -1; }
    
    inline pid_t                        GetMusicPlayerProcessIDProperty() const { return mMusicPlayerProcessIDProperty; }
    inline CFStringRef                  CopyMusicPlayerBundleIDProperty() const { return mMusicPlayerBundleIDProperty.CopyCFString(); }
    
    // Returns true if the PID was changed
    bool                                SetMusicPlayer(const pid_t inPID);
    // Returns true if the bundle ID was changed
    bool                                SetMusicPlayer(const CACFString inBundleID);
    
    bool                                IsMusicPlayerRT(const UInt32 inClientID) const;
    
    Float32                             GetClientRelativeVolumeRT(UInt32 inClientID) const;
    SInt32                              GetClientPanPositionRT(UInt32 inClientID) const;
    
    // Copies the current and past clients into an array in the format expected for
    // kAudioDeviceCustomPropertyAppVolumes. (Except that CACFArray and CACFDictionary are used instead
    // of unwrapped CFArray and CFDictionary refs.)
    CACFArray                           CopyClientRelativeVolumesAsAppVolumes() const { return mClientMap.CopyClientRelativeVolumesAsAppVolumes(mRelativeVolumeCurve); };
    
    // inAppVolumes is an array of dicts with the keys kEQMAppVolumesKey_ProcessID,
    // kEQMAppVolumesKey_BundleID and optionally kEQMAppVolumesKey_RelativeVolume and
    // kEQMAppVolumesKey_PanPosition. This method finds the client for
    // each app by PID or bundle ID, sets the volume and applies mRelativeVolumeCurve to it.
    //
    // Returns true if any clients' relative volumes were changed.
    bool                                SetClientsRelativeVolumes(const CACFArray inAppVolumes);
    
private:
    AudioObjectID                       mOwnerDeviceID;
    
    // Counters for the number of clients that are doing IO. These are used to tell whether any clients
    // are currently doing IO without having to check every client's mDoingIO.
    //
    // We need to reference count this rather than just using a bool because the HAL might (but usually
    // doesn't) call our StartIO/StopIO functions for clients other than the first to start and last to
    // stop.
    UInt64                              mStartCount = 0;
    UInt64                              mStartCountExcludingEQMApp = 0;
    
    CAMutex                             mMutex { "Clients" };
    
    SInt64                              mEQMAppClientID = -1;
    
    // The value of the kAudioDeviceCustomPropertyMusicPlayerProcessID property, or 0 if it's unset/null.
    // We store this separately because the music player might not always be a client, but could be added
    // as one at a later time.
    pid_t                               mMusicPlayerProcessIDProperty = 0;
    
    // The value of the kAudioDeviceCustomPropertyMusicPlayerBundleID property, or the empty string it it's
    // unset/null. UTF8 encoding.
    //
    // As with mMusicPlayerProcessID, we keep a copy of the bundle ID the user sets for the music player
    // because there might be no client with that bundle ID. In that case we need to be able to give the
    // property's value if the HAL asks for it, and to recognise the music player if it's added a client.
    CACFString                          mMusicPlayerBundleIDProperty { "" };
    
    // The volume curve we apply to raw client volumes before they're used
    CAVolumeCurve                       mRelativeVolumeCurve;
    
};

#pragma clang assume_nonnull end

#endif /* __EQMDriver__EQM_Clients__ */

