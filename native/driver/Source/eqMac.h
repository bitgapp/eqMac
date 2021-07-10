//
// eqMac.h
// eqMac Driver
//
// Created by Nodeful on 09/07/2021.
// Copyright © 2021 Apple. All rights reserved.
//

#ifndef eqMac_h
#define eqMac_h

#endif /* eqMac_h */

#include <CoreAudio/AudioServerPlugIn.h>
#include <dispatch/dispatch.h>
#include <mach/mach_time.h>
#include <pthread.h>
#include <stdint.h>
#include <sys/syslog.h>

//==================================================================================================
#pragma mark -
#pragma mark Macros
//==================================================================================================

#if TARGET_RT_BIG_ENDIAN
#define FourCCToCString(the4CC) { ((char*)&the4CC)[0], ((char*)&the4CC)[1], ((char*)&the4CC)[2], ((char*)&the4CC)[3], 0 }
#else
#define FourCCToCString(the4CC) { ((char*)&the4CC)[3], ((char*)&the4CC)[2], ((char*)&the4CC)[1], ((char*)&the4CC)[0], 0 }
#endif

#if DEBUG

#define DebugMsg(inFormat, ...) printf(inFormat "\n", ## __VA_ARGS__)

#define FailIf(inCondition, inHandler, inMessage) \
if (inCondition) { \
DebugMsg(inMessage); \
goto inHandler; \
}

#define FailWithAction(inCondition, inAction, inHandler, inMessage) \
if (inCondition) { \
DebugMsg(inMessage); \
{ inAction; } \
goto inHandler; \
}

#else

#define DebugMsg(inFormat, ...)

#define FailIf(inCondition, inHandler, inMessage) \
if (inCondition) { \
goto inHandler; \
}

#define FailWithAction(inCondition, inAction, inHandler, inMessage) \
if (inCondition) { \
{ inAction; } \
goto inHandler; \
}

#endif

//==================================================================================================
#pragma mark -
#pragma mark eqMac State
//==================================================================================================

// The purpose of the eqMac sample is to provide a bare bones implementations to
// illustrate the minimal set of things a driver has to do. The sample driver has the following
// qualities:
// - a plug-in
// - custom property with the selector kPlugIn_CustomPropertyID = 'PCst'
// - a box
// - a device
// - supports 44100 and 48000 sample rates
// - provides a rate scalar of 1.0 via hard coding
// - a single input stream
// - supports 2 channels of 32 bit float LPCM samples
// - always produces zeros
// - a single output stream
// - supports 2 channels of 32 bit float LPCM samples
// - data written to it is ignored
// - controls
// - master input volume
// - master output volume
// - master input mute
// - master output mute
// - master input data source
// - master output data source
// - master play-through data destination
// - all are for illustration purposes only and do not actually manipulate data


// Declare the internal object ID numbers for all the objects this driver implements. Note that
// this driver has a fixed set of objects that never grows or shrinks. If this were not the case,
// the driver would need to have a means to dynamically allocate these IDs. It's important to
// realize that a lot of the structure of this driver is vastly simpler when the IDs are all
// known a priori. Comments in the code will try to identify some of these simplifications and
// point out what a more complicated driver will need to do.
enum {
  kObjectID_PlugIn = kAudioObjectPlugInObject,
  kObjectID_Box = 2,
  kObjectID_Device = 3,
  kObjectID_Stream_Input = 4,
  kObjectID_Volume_Input_Master = 5,
  kObjectID_Mute_Input_Master = 6,
  kObjectID_DataSource_Input_Master = 7,
  kObjectID_Stream_Output = 8,
  kObjectID_Volume_Output_Master = 9,
  kObjectID_Mute_Output_Master = 10,
  kObjectID_DataSource_Output_Master = 11,
  //  kObjectID_DataDestination_PlayThru_Master = 12
};


// Custom Properties
enum {
  kAudioDeviceCustomPropertyLatency                                 = 'cltc',
  kAudioDeviceCustomPropertySafetyOffset                            = 'csfo',
  kAudioDeviceCustomPropertyShown                                   = 'shwn',
  kAudioDeviceCustomPropertyVersion                                 = 'vrsn'
};


// Declare the stuff that tracks the state of the plug-in, the device and its sub-objects.
// Note that we use global variables here because this driver only ever has a single device. If
// multiple devices were supported, this state would need to be encapsulated in one or more structs
// so that each object's state can be tracked individually.
// Note also that we share a single mutex across all objects to be thread safe for the same reason.

#define kChannelCount 2
#define kBitsPerChannel 32
#define kBytesPerChannel (kBitsPerChannel / 8)
#define kBytesPerFrame (kChannelCount * kBytesPerChannel)
#define kDevice_Name "eqMac"
#define kDevice_Manufacturer "Bitgapp Ltd"

static Float32* buffer;
#define kBufferSize (65536 * kChannelCount)

#define kPlugIn_BundleID "com.bitgapp.eqmac.driver"
static pthread_mutex_t gPlugIn_StateMutex = PTHREAD_MUTEX_INITIALIZER;
static UInt32 gPlugIn_RefCount = 0;
static AudioServerPlugInHostRef gPlugIn_Host = NULL;
static const AudioObjectPropertySelector kPlugIn_CustomPropertyID = 'PCst';

#define kBox_UID "eqMacBox_UID"
static CFStringRef gBox_Name = NULL;
static Boolean gBox_Acquired = true;

#define kDevice_UID "EQMDevice"
#define kDevice_ModelUID "EQMDeviceModelUID"
static pthread_mutex_t gDevice_IOMutex = PTHREAD_MUTEX_INITIALIZER;
static Float64 gDevice_SampleRate = 44100.0;
static UInt64 gDevice_IOIsRunning = 0;
static const UInt32 kDevice_RingBufferSize = 16384;
static Float64 gDevice_HostTicksPerFrame = 0.0;
static UInt64 gDevice_NumberTimeStamps = 0;
static Float64 gDevice_AnchorSampleTime = 0.0;
static UInt64 gDevice_AnchorHostTime = 0;

static bool gStream_Input_IsActive = true;
static bool gStream_Output_IsActive = true;

static const Float32 kVolume_MinDB = -96.0;
static const Float32 kVolume_MaxDB = 0.0;
static Float32 gVolume_Input_Master_Value = 1.0;
static Float32 gVolume_Output_Master_Value = 1.0;

static bool gMute_Input_Master_Value = false;
static bool gMute_Output_Master_Value = false;

static const UInt32 kDataSource_NumberItems = 1;
#define kDataSource_ItemNamePattern kDevice_Name
static UInt32 gDataSource_Input_Master_Value = 0;
static UInt32 gDataSource_Output_Master_Value = 0;
//static UInt32 gDataDestination_PlayThru_Master_Value = 0;

static UInt32 mShown = 0;
static UInt32 mSafetyOffset = 0;
static UInt32 mLatency = 0;
#
//==================================================================================================
#pragma mark -
#pragma mark AudioServerPlugInDriverInterface Implementation
//==================================================================================================

#pragma mark Prototypes

// Entry points for the COM methods
void* eqMac_Create (CFAllocatorRef inAllocator, CFUUIDRef inRequestedTypeUUID);
static HRESULT eqMac_QueryInterface (void* inDriver, REFIID inUUID, LPVOID* outInterface);
static ULONG eqMac_AddRef (void* inDriver);
static ULONG eqMac_Release (void* inDriver);
static OSStatus eqMac_Initialize (AudioServerPlugInDriverRef inDriver, AudioServerPlugInHostRef inHost);
static OSStatus eqMac_CreateDevice (AudioServerPlugInDriverRef inDriver, CFDictionaryRef inDescription, const AudioServerPlugInClientInfo* inClientInfo, AudioObjectID* outDeviceObjectID);
static OSStatus eqMac_DestroyDevice (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID);
static OSStatus eqMac_AddDeviceClient (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo);
static OSStatus eqMac_RemoveDeviceClient (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo);
static OSStatus eqMac_PerformDeviceConfigurationChange (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo);
static OSStatus eqMac_AbortDeviceConfigurationChange (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo);
static Boolean eqMac_HasProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsPropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetPropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData);
static OSStatus eqMac_StartIO (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID);
static OSStatus eqMac_StopIO (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID);
static OSStatus eqMac_GetZeroTimeStamp (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, Float64* outSampleTime, UInt64* outHostTime, UInt64* outSeed);
static OSStatus eqMac_WillDoIOOperation (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, Boolean* outWillDo, Boolean* outWillDoInPlace);
static OSStatus eqMac_BeginIOOperation (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo);
static OSStatus eqMac_DoIOOperation (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, AudioObjectID inStreamObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo, void* ioMainBuffer, void* ioSecondaryBuffer);
static OSStatus eqMac_EndIOOperation (AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo);

// Implementation
static Boolean eqMac_HasPlugInProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsPlugInPropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetPlugInPropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetPlugInPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetPlugInPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData, UInt32* outNumberPropertiesChanged, AudioObjectPropertyAddress outChangedAddresses[2]);

static Boolean eqMac_HasBoxProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsBoxPropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetBoxPropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetBoxPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetBoxPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData, UInt32* outNumberPropertiesChanged, AudioObjectPropertyAddress outChangedAddresses[2]);

static Boolean eqMac_HasDeviceProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsDevicePropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetDevicePropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetDevicePropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetDevicePropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData, UInt32* outNumberPropertiesChanged, AudioObjectPropertyAddress outChangedAddresses[2]);

static Boolean eqMac_HasStreamProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsStreamPropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetStreamPropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetStreamPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetStreamPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData, UInt32* outNumberPropertiesChanged, AudioObjectPropertyAddress outChangedAddresses[2]);

static Boolean eqMac_HasControlProperty (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus eqMac_IsControlPropertySettable (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus eqMac_GetControlPropertyDataSize (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus eqMac_GetControlPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus eqMac_SetControlPropertyData (AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData, UInt32* outNumberPropertiesChanged, AudioObjectPropertyAddress outChangedAddresses[2]);

#pragma mark The Interface

static AudioServerPlugInDriverInterface gAudioServerPlugInDriverInterface = {
  NULL,
  eqMac_QueryInterface,
  eqMac_AddRef,
  eqMac_Release,
  eqMac_Initialize,
  eqMac_CreateDevice,
  eqMac_DestroyDevice,
  eqMac_AddDeviceClient,
  eqMac_RemoveDeviceClient,
  eqMac_PerformDeviceConfigurationChange,
  eqMac_AbortDeviceConfigurationChange,
  eqMac_HasProperty,
  eqMac_IsPropertySettable,
  eqMac_GetPropertyDataSize,
  eqMac_GetPropertyData,
  eqMac_SetPropertyData,
  eqMac_StartIO,
  eqMac_StopIO,
  eqMac_GetZeroTimeStamp,
  eqMac_WillDoIOOperation,
  eqMac_BeginIOOperation,
  eqMac_DoIOOperation,
  eqMac_EndIOOperation
};
static AudioServerPlugInDriverInterface* gAudioServerPlugInDriverInterfacePtr = &gAudioServerPlugInDriverInterface;
static AudioServerPlugInDriverRef gAudioServerPlugInDriverRef = &gAudioServerPlugInDriverInterfacePtr;
