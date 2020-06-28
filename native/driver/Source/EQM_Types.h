//
//  EQM_Types.h
//  SharedSource
//
//

#ifndef SharedSource__EQM_Types
#define SharedSource__EQM_Types

// STL Includes
#if defined(__cplusplus)
#include <stdexcept>
#endif

// System Includes
#include <CoreAudio/AudioServerPlugIn.h>


#pragma mark Project URLs

#pragma mark IDs

// TODO: Change these and the other defines to const strings?
#define kEQMDriverBundleID           "com.bitgapp.eqmac.driver"
#define kEQMAppBundleID              "com.bitgapp.eqmac"
#define kEQMXPCHelperBundleID        "com.bitgapp.eqmac.xpc"

#define kEQMDeviceUID                "EQMDevice"
#define kEQMDeviceModelUID           "EQMDeviceModelUID"
#define kEQMDeviceUID_UISounds       "EQMDevice_UISounds"
#define kEQMDeviceModelUID_UISounds  "EQMDeviceModelUID_UISounds"
#define kEQMNullDeviceUID            "EQMNullDevice"
#define kEQMNullDeviceModelUID       "EQMNullDeviceModelUID"

// The object IDs for the audio objects this driver implements.
//
// EQMDevice always publishes this fixed set of objects (except when EQMDevice's volume or mute
// controls are disabled). We might need to change that at some point, but so far it hasn't caused
// any problems and it makes the driver much simpler.
enum
{
  kObjectID_PlugIn                            = kAudioObjectPlugInObject,
  // EQMDevice
  kObjectID_Device                            = 2,   // Belongs to kObjectID_PlugIn
  kObjectID_Stream_Input                      = 3,   // Belongs to kObjectID_Device
  kObjectID_Stream_Output                     = 4,   // Belongs to kObjectID_Device
  kObjectID_Volume_Output_Master              = 5,   // Belongs to kObjectID_Device
  kObjectID_Mute_Output_Master                = 6,   // Belongs to kObjectID_Device
  // Null Device
  kObjectID_Device_Null                       = 7,   // Belongs to kObjectID_PlugIn
  kObjectID_Stream_Null                       = 8,   // Belongs to kObjectID_Device_Null
  // EQMDevice for UI sounds
  kObjectID_Device_UI_Sounds                  = 9,   // Belongs to kObjectID_PlugIn
  kObjectID_Stream_Input_UI_Sounds            = 10,  // Belongs to kObjectID_Device_UI_Sounds
  kObjectID_Stream_Output_UI_Sounds           = 11,  // Belongs to kObjectID_Device_UI_Sounds
  kObjectID_Volume_Output_Master_UI_Sounds    = 12,  // Belongs to kObjectID_Device_UI_Sounds
};

// AudioObjectPropertyElement docs: "Elements are numbered sequentially where 0 represents the
// master element."
static const AudioObjectPropertyElement kMasterChannel = kAudioObjectPropertyElementMaster;

#pragma EQM Plug-in Custom Properties

enum
{
  // A CFBoolean. True if the null device is enabled. Settable, false by default.
  kAudioPlugInCustomPropertyNullDeviceActive = 'nuld',
  kAudioPlugInCustomPropertyDeviceActive = 'deva',
  kAudioPlugInCustomPropertyUIDeviceActive = 'uida'
};

#pragma mark EQMDevice Custom Properties

enum
{
  // TODO: Combine the two music player properties
  
  // The process ID of the music player as a CFNumber. Setting this property will also clear the value of
  // kAudioDeviceCustomPropertyMusicPlayerBundleID. We use 0 to mean unset.
  //
  // There is currently no way for a client to tell whether the process it has set as the music player is a
  // client of the EQMDevice.
  kAudioDeviceCustomPropertyMusicPlayerProcessID                    = 'mppi',
  // The music player's bundle ID as a CFString (UTF8), or the empty string if it's unset/null. Setting this
  // property will also clear the value of kAudioDeviceCustomPropertyMusicPlayerProcessID.
  kAudioDeviceCustomPropertyMusicPlayerBundleID                     = 'mpbi',
  // A CFNumber that specifies whether the device is silent, playing only music (i.e. the client set as the
  // music player is the only client playing audio) or audible. See enum values below. This property is only
  // updated after the audible state has been different for kDeviceAudibleStateMinChangedFramesForUpdate
  // consecutive frames. (To avoid excessive CPU use if for some reason the audible state starts changing
  // very often.)
  kAudioDeviceCustomPropertyDeviceAudibleState                      = 'daud',
  // A CFBoolean similar to kAudioDevicePropertyDeviceIsRunning except it ignores whether IO is running for
  // EQMApp. This is so EQMApp knows when it can stop doing IO to save CPU.
  kAudioDeviceCustomPropertyDeviceIsRunningSomewhereOtherThanEQMApp = 'runo',
  // A CFArray of CFDictionaries that each contain an app's pid, bundle ID and volume relative to other
  // running apps. See the dictionary keys below for more info.
  //
  // Getting this property will only return apps with volumes other than the default. Setting this property
  // will add new app volumes or replace existing ones, but there's currently no way to delete an app from
  // the internal collection.
  kAudioDeviceCustomPropertyAppVolumes                              = 'apvs',
  // A CFArray of CFBooleans indicating which of EQMDevice's controls are enabled. All controls are enabled
  // by default. This property is settable. See the array indices below for more info.
  kAudioDeviceCustomPropertyEnabledOutputControls                   = 'bgct',
  kAudioDeviceCustomPropertyLatency                                 = 'cltc',
  kAudioDeviceCustomPropertySafetyOffset                            = 'csfo',
  kAudioDeviceCustomPropertyShown                                   = 'shwn'
};

// The number of silent/audible frames before EQMDriver will change kAudioDeviceCustomPropertyDeviceAudibleState
#define kDeviceAudibleStateMinChangedFramesForUpdate (2 << 11)

enum EQMDeviceAudibleState : SInt32
{
  // kAudioDeviceCustomPropertyDeviceAudibleState values
  //
  // No audio is playing on the device's streams (regardless of whether IO is running or not)
  kEQMDeviceIsSilent              = 'silt',
  // The client whose bundle ID matches the current value of kCustomAudioDevicePropertyMusicPlayerBundleID is the
  // only audible client
  kEQMDeviceIsSilentExceptMusic   = 'olym',
  kEQMDeviceIsAudible             = 'audi'
};

// kAudioDeviceCustomPropertyAppVolumes keys
//
// A CFNumber<SInt32> between kAppRelativeVolumeMinRawValue and kAppRelativeVolumeMaxRawValue. A value greater than
// the midpoint increases the client's volume and a value less than the midpoint decreases it. A volume curve is
// applied to kEQMAppVolumesKey_RelativeVolume when it's first set and then each of the app's samples are multiplied
// by it.
#define kEQMAppVolumesKey_RelativeVolume    "rvol"
// A CFNumber<SInt32> between kAppPanLeftRawValue and kAppPanRightRawValue. A negative value has a higher proportion
// of left channel, and a positive value has a higher proportion of right channel.
#define kEQMAppVolumesKey_PanPosition       "ppos"
// The app's pid as a CFNumber. May be omitted if kEQMAppVolumesKey_BundleID is present.
#define kEQMAppVolumesKey_ProcessID         "pid"
// The app's bundle ID as a CFString. May be omitted if kEQMAppVolumesKey_ProcessID is present.
#define kEQMAppVolumesKey_BundleID          "bid"

// Volume curve range for app volumes
#define kAppRelativeVolumeMaxRawValue   100
#define kAppRelativeVolumeMinRawValue   0
#define kAppRelativeVolumeMinDbValue    -96.0f
#define kAppRelativeVolumeMaxDbValue	0.0f

// Pan position values
#define kAppPanLeftRawValue   -100
#define kAppPanCenterRawValue 0
#define kAppPanRightRawValue  100

// kAudioDeviceCustomPropertyEnabledOutputControls indices
enum
{
  // True if EQMDevice's master output volume control is enabled.
  kEQMEnabledOutputControlsIndex_Volume = 0,
  // True if EQMDevice's master output mute control is enabled.
  kEQMEnabledOutputControlsIndex_Mute   = 1
};

#pragma mark EQMDevice Custom Property Addresses

// For convenience.

static const AudioObjectPropertyAddress kEQMMusicPlayerProcessIDAddress = {
  kAudioDeviceCustomPropertyMusicPlayerProcessID,
  kAudioObjectPropertyScopeGlobal,
  kAudioObjectPropertyElementMaster
};

static const AudioObjectPropertyAddress kEQMMusicPlayerBundleIDAddress = {
  kAudioDeviceCustomPropertyMusicPlayerBundleID,
  kAudioObjectPropertyScopeGlobal,
  kAudioObjectPropertyElementMaster
};

static const AudioObjectPropertyAddress kEQMAudibleStateAddress = {
  kAudioDeviceCustomPropertyDeviceAudibleState,
  kAudioObjectPropertyScopeGlobal,
  kAudioObjectPropertyElementMaster
};

static const AudioObjectPropertyAddress kEQMRunningSomewhereOtherThanEQMAppAddress = {
  kAudioDeviceCustomPropertyDeviceIsRunningSomewhereOtherThanEQMApp,
  kAudioObjectPropertyScopeGlobal,
  kAudioObjectPropertyElementMaster
};

static const AudioObjectPropertyAddress kEQMAppVolumesAddress = {
  kAudioDeviceCustomPropertyAppVolumes,
  kAudioObjectPropertyScopeGlobal,
  kAudioObjectPropertyElementMaster
};

static const AudioObjectPropertyAddress kEQMEnabledOutputControlsAddress = {
  kAudioDeviceCustomPropertyEnabledOutputControls,
  kAudioObjectPropertyScopeOutput,
  kAudioObjectPropertyElementMaster
};

#pragma mark XPC Return Codes

enum {
  kEQMXPC_Success,
  kEQMXPC_MessageFailure,
  kEQMXPC_Timeout,
  kEQMXPC_EQMAppStateError,
  kEQMXPC_HardwareError,
  kEQMXPC_ReturningEarlyError,
  kEQMXPC_InternalError
};

#pragma mark Exceptions

#if defined(__cplusplus)

class EQM_InvalidClientException : public std::runtime_error {
public:
  EQM_InvalidClientException() : std::runtime_error("InvalidClient") { }
};

class EQM_InvalidClientPIDException : public std::runtime_error {
public:
  EQM_InvalidClientPIDException() : std::runtime_error("InvalidClientPID") { }
};

class EQM_InvalidClientRelativeVolumeException : public std::runtime_error {
public:
  EQM_InvalidClientRelativeVolumeException() : std::runtime_error("InvalidClientRelativeVolume") { }
};

class EQM_InvalidClientPanPositionException : public std::runtime_error {
public:
  EQM_InvalidClientPanPositionException() : std::runtime_error("InvalidClientPanPosition") { }
};

class EQM_DeviceNotSetException : public std::runtime_error {
public:
  EQM_DeviceNotSetException() : std::runtime_error("DeviceNotSet") { }
};

#endif

// Assume we've failed to start the output device if it isn't running IO after this timeout expires.
//
// Currently set to 30s because some devices, e.g. AirPlay, can legitimately take that long to start.
//
// TODO: Should we have a timeout at all? Is there a notification we can subscribe to that will tell us whether the
//       device is still making progress? Should we regularly poll mOutputDevice.IsAlive() while we're waiting to
//       check it's still responsive?
static const UInt64 kStartIOTimeoutNsec = 30 * NSEC_PER_SEC;

#endif /* SharedSource__EQM_Types */

