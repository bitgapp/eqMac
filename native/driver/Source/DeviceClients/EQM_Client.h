//
//  EQM_Client.h
//  EQMDriver
//
//

#ifndef __EQMDriver__EQM_Client__
#define __EQMDriver__EQM_Client__

// PublicUtility Includes
#include "CACFString.h"

// System Includes
#include <CoreAudio/AudioServerPlugIn.h>


#pragma clang assume_nonnull begin

//==================================================================================================
//	EQM_Client
//
//  Client meaning a client (of the host) of the EQMDevice, i.e. an app registered with the HAL,
//  generally so it can do IO at some point.
//==================================================================================================

class EQM_Client
{
    
public:
                                  EQM_Client() = default;
                                  EQM_Client(const AudioServerPlugInClientInfo* inClientInfo);
                                  ~EQM_Client() = default;
                                  EQM_Client(const EQM_Client& inClient) { Copy(inClient); };
                                  EQM_Client& operator=(const EQM_Client& inClient) { Copy(inClient); return *this; }
    
private:
    void                          Copy(const EQM_Client& inClient);
    
public:
    // These fields are duplicated from AudioServerPlugInClientInfo (except the mBundleID CFStringRef is
    // wrapped in a CACFString here).
    UInt32                        mClientID;
    pid_t                         mProcessID;
    Boolean                       mIsNativeEndian = true;
    CACFString                    mBundleID;
    
    // Becomes true when the client triggers the plugin host to call StartIO or to begin
    // kAudioServerPlugInIOOperationThread, and false again on StopIO or when
    // kAudioServerPlugInIOOperationThread ends
    bool                          mDoingIO = false;
    
    // True if EQMApp has set this client as belonging to the music player app
    bool                          mIsMusicPlayer = false;
    
    // The client's volume relative to other clients. In the range [0.0, 4.0], defaults to 1.0 (unchanged).
    // mRelativeVolumeCurve is applied to this value when it's set.
    Float32                       mRelativeVolume = 1.0;
    
    // The client's pan position, in the range [-100, 100] where -100 is left and 100 is right
    SInt32                        mPanPosition = 0;
    
};

#pragma clang assume_nonnull end

#endif /* __EQMDriver__EQM_Client__ */

