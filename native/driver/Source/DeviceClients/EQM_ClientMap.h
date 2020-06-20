//
//  EQM_ClientMap.h
//  EQMDriver
//
//

#ifndef __EQMDriver__EQM_ClientMap__
#define __EQMDriver__EQM_ClientMap__

// Local Includes
#include "EQM_Client.h"
#include "EQM_TaskQueue.h"

// PublicUtility Includes
#include "CAMutex.h"
#include "CACFString.h"
#include "CACFArray.h"
#include "CAVolumeCurve.h"

// STL Includes
#include <map>
#include <vector>
#include <functional>


// Forward Declarations
class EQM_ClientTasks;


#pragma clang assume_nonnull begin

//==================================================================================================
//	EQM_ClientMap
//
//  This class stores the clients (EQM_Client) that have been registered with EQMDevice by the HAL.
//  It also maintains maps from clients' PIDs and bundle IDs to the clients. When a client is
//  removed by the HAL we add it to a map of past clients to keep track of settings specific to that
//  client. (Currently only the client's volume.)
//
//  Since the maps are read from during IO, this class has to to be real-time safe when accessing
//  them. So each map has an identical "shadow" map, which we use to buffer updates.
//
//  To update the clients we lock the shadow maps, modify them, have EQM_TaskQueue's real-time
//  thread swap them with the main maps, and then repeat the modification to keep both sets of maps
//  identical. We have to swap the maps on a real-time thread so we can take the main maps' lock
//  without risking priority inversion, but this way the actual work doesn't need to be real-time
//  safe.
//
//  Methods that only read from the maps and are called on non-real-time threads will just read
//  from the shadow maps because it's easier.
//
//  Methods whose names end with "RT" and "NonRT" can only safely be called from real-time and
//  non-real-time threads respectively. (Methods with neither are most likely non-RT.)
//==================================================================================================

class EQM_ClientMap
{
  
  friend class EQM_ClientTasks;
  
  typedef std::vector<EQM_Client*> EQM_ClientPtrList;
  
public:
  EQM_ClientMap(EQM_TaskQueue* inTaskQueue) : mTaskQueue(inTaskQueue), mMapsMutex("Maps mutex"), mShadowMapsMutex("Shadow maps mutex") { };
  
  void                                                AddClient(EQM_Client inClient);
  
private:
  void                                                AddClientToShadowMaps(EQM_Client inClient);
  
public:
  // Returns the removed client
  EQM_Client                                          RemoveClient(UInt32 inClientID);
  
  // These methods are functionally identical except that GetClientRT must only be called from real-time threads and GetClientNonRT
  // must only be called from non-real-time threads. Both return true if a client was found.
  bool                                                GetClientRT(UInt32 inClientID, EQM_Client* outClient) const;
  bool                                                GetClientNonRT(UInt32 inClientID, EQM_Client* outClient) const;
  
private:
  static bool                                         GetClient(const std::map<UInt32, EQM_Client>& inClientMap,
                                                                UInt32 inClientID,
                                                                EQM_Client* outClient);
  
public:
  std::vector<EQM_Client>                             GetClientsByPID(pid_t inPID) const;
  
  // Set the isMusicPlayer flag for each client. (True if the client has the given bundle ID/PID, false otherwise.)
  void                                                UpdateMusicPlayerFlags(pid_t inMusicPlayerPID);
  void                                                UpdateMusicPlayerFlags(CACFString inMusicPlayerBundleID);
  
private:
  void                                                UpdateMusicPlayerFlagsInShadowMaps(std::function<bool(EQM_Client)> inIsMusicPlayerTest);
  
public:
  // Copies the current and past clients into an array in the format expected for
  // kAudioDeviceCustomPropertyAppVolumes. (Except that CACFArray and CACFDictionary are used instead
  // of unwrapped CFArray and CFDictionary refs.)
  CACFArray                                           CopyClientRelativeVolumesAsAppVolumes(CAVolumeCurve inVolumeCurve) const;
  
private:
  void                                                CopyClientIntoAppVolumesArray(EQM_Client inClient, CAVolumeCurve inVolumeCurve, CACFArray& ioAppVolumes) const;
  
public:
  // Using the template function hits LLVM Bug 23987
  // TODO Switch to template function
  
  // Returns true if a client for the key was found and its relative volume changed.
  //template <typename T>
  //bool                                                SetClientsRelativeVolume(T _Null_unspecified searchKey, Float32 inRelativeVolume);
  //
  //template <typename T>
  //bool                                                SetClientsPanPosition(T _Null_unspecified searchKey, SInt32 inPanPosition);
  
  // Returns true if a client for PID inAppPID was found and its relative volume changed.
  bool                                                SetClientsRelativeVolume(pid_t inAppPID, Float32 inRelativeVolume);
  // Returns true if a client for bundle ID inAppBundleID was found and its relative volume changed.
  bool                                                SetClientsRelativeVolume(CACFString inAppBundleID, Float32 inRelativeVolume);
  
  // Returns true if a client for PID inAppPID was found and its pan position changed.
  bool                                                SetClientsPanPosition(pid_t inAppPID, SInt32 inPanPosition);
  // Returns true if a client for bundle ID inAppBundleID was found and its pan position changed.
  bool                                                SetClientsPanPosition(CACFString inAppBundleID, SInt32 inPanPosition);
  
  void                                                StartIONonRT(UInt32 inClientID) { UpdateClientIOStateNonRT(inClientID, true); }
  void                                                StopIONonRT(UInt32 inClientID) { UpdateClientIOStateNonRT(inClientID, false); }
  
  // Client lookup for PID inAppPID
  std::vector<EQM_Client*> * _Nullable                GetClients(pid_t inAppPid);
  // Client lookup for bundle ID inAppBundleID
  std::vector<EQM_Client*> * _Nullable                GetClients(CACFString inAppBundleID);
private:
  void                                                UpdateClientIOStateNonRT(UInt32 inClientID, bool inDoingIO);
  
  // Has a real-time thread call SwapInShadowMapsRT. (Synchronously queues the call as a task on mTaskQueue.)
  // The shadow maps mutex must be locked when calling this method.
  void                                                SwapInShadowMaps();
  // Note that this method is called by EQM_TaskQueue through the EQM_ClientTasks interface. The shadow maps
  // mutex must be locked when calling this method.
  void                                                SwapInShadowMapsRT();
  
  
  
private:
  EQM_TaskQueue*                                      mTaskQueue;
  
  // Must be held to access mClientMap or mClientMapByPID. Code that runs while holding this mutex needs
  // to be real-time safe. Should probably not be held for most operations on mClientMapByBundleID because,
  // as far as I can tell, code that works with CFStrings is unlikely to be real-time safe.
  CAMutex                                             mMapsMutex;
  // Should only be locked by non-real-time threads. Should not be released until the maps have been
  // made identical to their shadow maps.
  CAMutex                                             mShadowMapsMutex;
  
  // The clients currently registered with EQMDevice. Indexed by client ID.
  std::map<UInt32, EQM_Client>                        mClientMap;
  // We keep this in sync with mClientMap so it can be modified outside of real-time safe sections and
  // then swapped in on a real-time thread, which is safe.
  std::map<UInt32, EQM_Client>                        mClientMapShadow;
  
  // These maps hold lists of pointers to clients in mClientMap/mClientMapShadow. Lists because a process
  // can have multiple clients and clients can have the same bundle ID.
  
  std::map<pid_t, EQM_ClientPtrList>                  mClientMapByPID;
  std::map<pid_t, EQM_ClientPtrList>                  mClientMapByPIDShadow;
  
  std::map<CACFString, EQM_ClientPtrList>             mClientMapByBundleID;
  std::map<CACFString, EQM_ClientPtrList>             mClientMapByBundleIDShadow;
  
  // Clients are added to mPastClientMap so we can restore settings specific to them if they get
  // added again.
  std::map<CACFString, EQM_Client>                    mPastClientMap;
  
};

#pragma clang assume_nonnull end

#endif /* __EQMDriver__EQM_ClientMap__ */

