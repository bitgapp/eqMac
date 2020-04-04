//
//  EQM_PlugInInterface.cpp
//  EQMDriver
//
//  Portions copyright (C) 2013 Apple Inc. All Rights Reserved.
//
//  Based largely on SA_PlugIn.cpp from Apple's SimpleAudioDriver Plug-In sample code.
//  https://developer.apple.com/library/mac/samplecode/AudioDriverExamples
//

//	System Includes
#include <CoreAudio/AudioServerPlugIn.h>

//	PublicUtility Includes
#include "CADebugMacros.h"
#include "CAException.h"

//  Local Includes
#include "EQM_Types.h"
#include "EQM_Object.h"
#include "EQM_PlugIn.h"
#include "EQM_Device.h"
#include "EQM_NullDevice.h"


#pragma mark COM Prototypes

//	Entry points for the COM methods
extern "C" void*	EQM_Create(CFAllocatorRef inAllocator, CFUUIDRef inRequestedTypeUUID);
static HRESULT		EQM_QueryInterface(void* inDriver, REFIID inUUID, LPVOID* outInterface);
static ULONG		EQM_AddRef(void* inDriver);
static ULONG		EQM_Release(void* inDriver);
static OSStatus		EQM_Initialize(AudioServerPlugInDriverRef inDriver, AudioServerPlugInHostRef inHost);
static OSStatus		EQM_CreateDevice(AudioServerPlugInDriverRef inDriver, CFDictionaryRef inDescription, const AudioServerPlugInClientInfo* inClientInfo, AudioObjectID* outDeviceObjectID);
static OSStatus		EQM_DestroyDevice(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID);
static OSStatus		EQM_AddDeviceClient(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo);
static OSStatus		EQM_RemoveDeviceClient(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo);
static OSStatus		EQM_PerformDeviceConfigurationChange(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo);
static OSStatus		EQM_AbortDeviceConfigurationChange(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo);
static Boolean		EQM_HasProperty(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress);
static OSStatus		EQM_IsPropertySettable(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable);
static OSStatus		EQM_GetPropertyDataSize(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize);
static OSStatus		EQM_GetPropertyData(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData);
static OSStatus		EQM_SetPropertyData(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData);
static OSStatus		EQM_StartIO(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID);
static OSStatus		EQM_StopIO(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID);
static OSStatus		EQM_GetZeroTimeStamp(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, Float64* outSampleTime, UInt64* outHostTime, UInt64* outSeed);
static OSStatus		EQM_WillDoIOOperation(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, Boolean* outWillDo, Boolean* outWillDoInPlace);
static OSStatus		EQM_BeginIOOperation(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo);
static OSStatus		EQM_DoIOOperation(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, AudioObjectID inStreamObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo, void* ioMainBuffer, void* ioSecondaryBuffer);
static OSStatus		EQM_EndIOOperation(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt32 inClientID, UInt32 inOperationID, UInt32 inIOBufferFrameSize, const AudioServerPlugInIOCycleInfo* inIOCycleInfo);

#pragma mark The COM Interface

static AudioServerPlugInDriverInterface	gAudioServerPlugInDriverInterface =
{
	NULL,
	EQM_QueryInterface,
	EQM_AddRef,
	EQM_Release,
	EQM_Initialize,
	EQM_CreateDevice,
	EQM_DestroyDevice,
	EQM_AddDeviceClient,
	EQM_RemoveDeviceClient,
	EQM_PerformDeviceConfigurationChange,
	EQM_AbortDeviceConfigurationChange,
	EQM_HasProperty,
	EQM_IsPropertySettable,
	EQM_GetPropertyDataSize,
	EQM_GetPropertyData,
	EQM_SetPropertyData,
	EQM_StartIO,
	EQM_StopIO,
	EQM_GetZeroTimeStamp,
	EQM_WillDoIOOperation,
	EQM_BeginIOOperation,
	EQM_DoIOOperation,
	EQM_EndIOOperation
};
static AudioServerPlugInDriverInterface*	gAudioServerPlugInDriverInterfacePtr	= &gAudioServerPlugInDriverInterface;
static AudioServerPlugInDriverRef			gAudioServerPlugInDriverRef				= &gAudioServerPlugInDriverInterfacePtr;
static UInt32								gAudioServerPlugInDriverRefCount		= 1;

// TODO: This name is a bit misleading because the devices are actually owned by the plug-in.
static EQM_Object& EQM_LookUpOwnerObject(AudioObjectID inObjectID)
{
    switch(inObjectID)
    {
        case kObjectID_PlugIn:
            return EQM_PlugIn::GetInstance();
            
        case kObjectID_Device:
        case kObjectID_Stream_Input:
        case kObjectID_Stream_Output:
        case kObjectID_Volume_Output_Master:
        case kObjectID_Mute_Output_Master:
            return EQM_Device::GetInstance();

        case kObjectID_Device_UI_Sounds:
        case kObjectID_Stream_Input_UI_Sounds:
        case kObjectID_Stream_Output_UI_Sounds:
        case kObjectID_Volume_Output_Master_UI_Sounds:
            return EQM_Device::GetUISoundsInstance();

        case kObjectID_Device_Null:
        case kObjectID_Stream_Null:
            return EQM_NullDevice::GetInstance();
    }
    
    DebugMsg("EQM_LookUpOwnerObject: unknown object");
    Throw(CAException(kAudioHardwareBadObjectError));
}

static EQM_AbstractDevice& EQM_LookUpDevice(AudioObjectID inObjectID)
{
    switch(inObjectID)
    {
        case kObjectID_Device:
            return EQM_Device::GetInstance();

        case kObjectID_Device_UI_Sounds:
            return EQM_Device::GetUISoundsInstance();

        case kObjectID_Device_Null:
            return EQM_NullDevice::GetInstance();
    }

    DebugMsg("EQM_LookUpDevice: unknown device");
    Throw(CAException(kAudioHardwareBadDeviceError));
}

#pragma mark Factory

extern "C"
void*	EQM_Create(CFAllocatorRef inAllocator, CFUUIDRef inRequestedTypeUUID)
{
	//	This is the CFPlugIn factory function. Its job is to create the implementation for the given
	//	type provided that the type is supported. Because this driver is simple and all its
	//	initialization is handled via static initalization when the bundle is loaded, all that
	//	needs to be done is to return the AudioServerPlugInDriverRef that points to the driver's
	//	interface. A more complicated driver would create any base line objects it needs to satisfy
	//	the IUnknown methods that are used to discover that actual interface to talk to the driver.
	//	The majority of the driver's initilization should be handled in the Initialize() method of
	//	the driver's AudioServerPlugInDriverInterface.
	
	#pragma unused(inAllocator)
    
    void* theAnswer = NULL;
    if(CFEqual(inRequestedTypeUUID, kAudioServerPlugInTypeUUID))
    {
		theAnswer = gAudioServerPlugInDriverRef;
        
        EQM_PlugIn::GetInstance();
    }
    return theAnswer;
}

#pragma mark Inheritence

static HRESULT	EQM_QueryInterface(void* inDriver, REFIID inUUID, LPVOID* outInterface)
{
	//	This function is called by the HAL to get the interface to talk to the plug-in through.
	//	AudioServerPlugIns are required to support the IUnknown interface and the
	//	AudioServerPlugInDriverInterface. As it happens, all interfaces must also provide the
	//	IUnknown interface, so we can always just return the single interface we made with
	//	gAudioServerPlugInDriverInterfacePtr regardless of which one is asked for.

	HRESULT theAnswer = 0;
	CFUUIDRef theRequestedUUID = NULL;
	
	try
	{
		//	validate the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_QueryInterface: bad driver reference");
		ThrowIfNULL(outInterface, CAException(kAudioHardwareIllegalOperationError), "EQM_QueryInterface: no place to store the returned interface");

    	//	make a CFUUIDRef from inUUID
    	theRequestedUUID = CFUUIDCreateFromUUIDBytes(NULL, inUUID);
    	ThrowIf(theRequestedUUID == NULL, CAException(kAudioHardwareIllegalOperationError), "EQM_QueryInterface: failed to create the CFUUIDRef");

		//	AudioServerPlugIns only support two interfaces, IUnknown (which has to be supported by all
		//	CFPlugIns and AudioServerPlugInDriverInterface (which is the actual interface the HAL will
		//	use).
		ThrowIf(!CFEqual(theRequestedUUID, IUnknownUUID) && !CFEqual(theRequestedUUID, kAudioServerPlugInDriverInterfaceUUID), CAException(E_NOINTERFACE), "EQM_QueryInterface: requested interface is unsupported");
		ThrowIf(gAudioServerPlugInDriverRefCount == UINT32_MAX, CAException(E_NOINTERFACE), "EQM_QueryInterface: the ref count is maxxed out");
		
		//	do the work
		++gAudioServerPlugInDriverRefCount;
		*outInterface = gAudioServerPlugInDriverRef;
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
    
    if(theRequestedUUID != NULL)
    {
    	CFRelease(theRequestedUUID);
    }
		
	return theAnswer;
}

static ULONG	EQM_AddRef(void* inDriver)
{
	//	This call returns the resulting reference count after the increment.
	
	ULONG theAnswer = 0;
	
	//	check the arguments
	FailIf(inDriver != gAudioServerPlugInDriverRef, Done, "EQM_AddRef: bad driver reference");
	FailIf(gAudioServerPlugInDriverRefCount == UINT32_MAX, Done, "EQM_AddRef: out of references");

	//	increment the refcount
	++gAudioServerPlugInDriverRefCount;
	theAnswer = gAudioServerPlugInDriverRefCount;

Done:
	return theAnswer;
}

static ULONG	EQM_Release(void* inDriver)
{
	//	This call returns the resulting reference count after the decrement.

	ULONG theAnswer = 0;
	
	//	check the arguments
	FailIf(inDriver != gAudioServerPlugInDriverRef, Done, "EQM_Release: bad driver reference");
	FailIf(gAudioServerPlugInDriverRefCount == UINT32_MAX, Done, "EQM_Release: out of references");

	//	decrement the refcount
	//	Note that we don't do anything special if the refcount goes to zero as the HAL
	//	will never fully release a plug-in it opens. We keep managing the refcount so that
	//	the API semantics are correct though.
	--gAudioServerPlugInDriverRefCount;
	theAnswer = gAudioServerPlugInDriverRefCount;

Done:
	return theAnswer;
}

#pragma mark Basic Operations

static OSStatus	EQM_Initialize(AudioServerPlugInDriverRef inDriver, AudioServerPlugInHostRef inHost)
{
	//	The job of this method is, as the name implies, to get the driver initialized. One specific
	//	thing that needs to be done is to store the AudioServerPlugInHostRef so that it can be used
	//	later. Note that when this call returns, the HAL will scan the various lists the driver
	//	maintains (such as the device list) to get the inital set of objects the driver is
	//	publishing. So, there is no need to notifiy the HAL about any objects created as part of the
	//	execution of this method.

	OSStatus theAnswer = 0;
	
	try
	{
		// Check the arguments.
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_Initialize: bad driver reference");
		
		// Store the AudioServerPlugInHostRef.
		EQM_PlugIn::GetInstance().SetHost(inHost);
        
        // Init/activate the devices.
        EQM_Device::GetInstance();
        EQM_Device::GetUISoundsInstance();
        EQM_NullDevice::GetInstance();
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}

	return theAnswer;
}

static OSStatus	EQM_CreateDevice(AudioServerPlugInDriverRef inDriver, CFDictionaryRef inDescription, const AudioServerPlugInClientInfo* inClientInfo, AudioObjectID* outDeviceObjectID)
{
	//	This method is used to tell a driver that implements the Transport Manager semantics to
	//	create an AudioEndpointDevice from a set of AudioEndpoints. Since this driver is not a
	//	Transport Manager, we just return kAudioHardwareUnsupportedOperationError.
	
	#pragma unused(inDriver, inDescription, inClientInfo, outDeviceObjectID)
	
	return kAudioHardwareUnsupportedOperationError;
}

static OSStatus	EQM_DestroyDevice(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID)
{
	//	This method is used to tell a driver that implements the Transport Manager semantics to
	//	destroy an AudioEndpointDevice. Since this driver is not a Transport Manager, we just check
	//	the arguments and return kAudioHardwareUnsupportedOperationError.
	
	#pragma unused(inDriver, inDeviceObjectID)
	
	return kAudioHardwareUnsupportedOperationError;
}

static OSStatus	EQM_AddDeviceClient(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo)
{
	//	This method is used to inform the driver about a new client that is using the given device.
	//	This allows the device to act differently depending on who the client is.
	
	OSStatus theAnswer = 0;
	
	try
	{
		// Check the arguments.
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_AddDeviceClient: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadObjectError),
                "EQM_AddDeviceClient: unknown device");
		
		// Inform the device.
        EQM_LookUpDevice(inDeviceObjectID).AddClient(inClientInfo);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
    catch(EQM_InvalidClientException)
    {
        theAnswer = kAudioHardwareIllegalOperationError;
    }
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_RemoveDeviceClient(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo)
{
	//	This method is used to inform the driver about a client that is no longer using the given
	//	device.
	
	OSStatus theAnswer = 0;
	
	try
	{
		// Check the arguments.
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_RemoveDeviceClient: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadObjectError),
                "EQM_RemoveDeviceClient: unknown device");
		
        // Inform the device.
        EQM_LookUpDevice(inDeviceObjectID).RemoveClient(inClientInfo);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
    }
    catch(EQM_InvalidClientException)
    {
        theAnswer = kAudioHardwareIllegalOperationError;
    }
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_PerformDeviceConfigurationChange(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo)
{
	//	This method is called to tell the device that it can perform the configuation change that it
	//	had requested via a call to the host method, RequestDeviceConfigurationChange(). The
	//	arguments, inChangeAction and inChangeInfo are the same as what was passed to
	//	RequestDeviceConfigurationChange().
	//
	//	The HAL guarantees that IO will be stopped while this method is in progress. The HAL will
	//	also handle figuring out exactly what changed for the non-control related properties. This
	//	means that the only notifications that would need to be sent here would be for either
	//	custom properties the HAL doesn't know about or for controls.

	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_PerformDeviceConfigurationChange: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_PerformDeviceConfigurationChange: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).PerformConfigChange(inChangeAction, inChangeInfo);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_AbortDeviceConfigurationChange(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, UInt64 inChangeAction, void* inChangeInfo)
{
	//	This method is called to tell the driver that a request for a config change has been denied.
	//	This provides the driver an opportunity to clean up any state associated with the request.

	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_PerformDeviceConfigurationChange: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_PerformDeviceConfigurationChange: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).AbortConfigChange(inChangeAction, inChangeInfo);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

#pragma mark Property Operations

static Boolean	EQM_HasProperty(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress)
{
	//	This method returns whether or not the given object has the given property.
	Boolean theAnswer = false;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_HasProperty: bad driver reference");
		ThrowIfNULL(inAddress, CAException(kAudioHardwareIllegalOperationError), "EQM_HasProperty: no address");
		theAnswer = EQM_LookUpOwnerObject(inObjectID).HasProperty(inObjectID, inClientProcessID, *inAddress);
	}
	catch(const CAException& inException)
	{
		theAnswer = false;
	}
	catch(...)
	{
		LogError("EQM_PlugInInterface::EQM_HasProperty: unknown exception. (object: %u, address: %u)",
				 inObjectID,
				 inAddress ? inAddress->mSelector : 0);
		theAnswer = false;
	}

	return theAnswer;
}

static OSStatus	EQM_IsPropertySettable(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, Boolean* outIsSettable)
{
	//	This method returns whether or not the given property on the object can have its value
	//	changed.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_IsPropertySettable: bad driver reference");
		ThrowIfNULL(inAddress, CAException(kAudioHardwareIllegalOperationError), "EQM_IsPropertySettable: no address");
		ThrowIfNULL(outIsSettable, CAException(kAudioHardwareIllegalOperationError), "EQM_IsPropertySettable: no place to put the return value");
        
        EQM_Object& theAudioObject = EQM_LookUpOwnerObject(inObjectID);
		if(theAudioObject.HasProperty(inObjectID, inClientProcessID, *inAddress))
		{
			*outIsSettable = theAudioObject.IsPropertySettable(inObjectID, inClientProcessID, *inAddress);
		}
		else
		{
			theAnswer = kAudioHardwareUnknownPropertyError;
		}
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		LogError("EQM_PlugInInterface::EQM_IsPropertySettable: unknown exception. (object: %u, address: %u)",
				 inObjectID,
				 inAddress ? inAddress->mSelector : 0);
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_GetPropertyDataSize(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32* outDataSize)
{
	//	This method returns the byte size of the property's data.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_GetPropertyDataSize: bad driver reference");
		ThrowIfNULL(inAddress, CAException(kAudioHardwareIllegalOperationError), "EQM_GetPropertyDataSize: no address");
		ThrowIfNULL(outDataSize, CAException(kAudioHardwareIllegalOperationError), "EQM_GetPropertyDataSize: no place to put the return value");
        
        EQM_Object& theAudioObject = EQM_LookUpOwnerObject(inObjectID);
		if(theAudioObject.HasProperty(inObjectID, inClientProcessID, *inAddress))
		{
			*outDataSize = theAudioObject.GetPropertyDataSize(inObjectID, inClientProcessID, *inAddress, inQualifierDataSize, inQualifierData);
		}
		else
		{
			theAnswer = kAudioHardwareUnknownPropertyError;
		}
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		LogError("EQM_PlugInInterface::EQM_GetPropertyDataSize: unknown exception. (object: %u, address: %u)",
				 inObjectID,
				 inAddress ? inAddress->mSelector : 0);
		theAnswer = kAudioHardwareUnspecifiedError;
	}

	return theAnswer;
}

static OSStatus	EQM_GetPropertyData(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32* outDataSize, void* outData)
{
	//	This method fetches the data for a given property
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_GetPropertyData: bad driver reference");
		ThrowIfNULL(inAddress, CAException(kAudioHardwareIllegalOperationError), "EQM_GetPropertyData: no address");
		ThrowIfNULL(outDataSize, CAException(kAudioHardwareIllegalOperationError), "EQM_GetPropertyData: no place to put the return value size");
		ThrowIfNULL(outData, CAException(kAudioHardwareIllegalOperationError), "EQM_GetPropertyData: no place to put the return value");
		
        EQM_Object& theAudioObject = EQM_LookUpOwnerObject(inObjectID);
		if(theAudioObject.HasProperty(inObjectID, inClientProcessID, *inAddress))
		{
			theAudioObject.GetPropertyData(inObjectID, inClientProcessID, *inAddress, inQualifierDataSize, inQualifierData, inDataSize, *outDataSize, outData);
		}
		else
		{
			theAnswer = kAudioHardwareUnknownPropertyError;
		}
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		LogError("EQM_PlugInInterface::EQM_GetPropertyData: unknown exception. (object: %u, address: %u)",
                 inObjectID,
				 inAddress ? inAddress->mSelector : 0);
		theAnswer = kAudioHardwareUnspecifiedError;
	}

	return theAnswer;
}

static OSStatus	EQM_SetPropertyData(AudioServerPlugInDriverRef inDriver, AudioObjectID inObjectID, pid_t inClientProcessID, const AudioObjectPropertyAddress* inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData)
{
	//	This method changes the value of the given property

	OSStatus theAnswer = 0;

	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef, CAException(kAudioHardwareBadObjectError), "EQM_SetPropertyData: bad driver reference");
        ThrowIfNULL(inAddress, CAException(kAudioHardwareIllegalOperationError), "EQM_SetPropertyData: no address");
        ThrowIfNULL(inData, CAException(kAudioHardwareIllegalOperationError), "EQM_SetPropertyData: no data");
		
        EQM_Object& theAudioObject = EQM_LookUpOwnerObject(inObjectID);
		if(theAudioObject.HasProperty(inObjectID, inClientProcessID, *inAddress))
		{
			if(theAudioObject.IsPropertySettable(inObjectID, inClientProcessID, *inAddress))
			{
				theAudioObject.SetPropertyData(inObjectID, inClientProcessID, *inAddress, inQualifierDataSize, inQualifierData, inDataSize, inData);
			}
			else
			{
				theAnswer = kAudioHardwareUnsupportedOperationError;
			}
		}
		else
		{
			theAnswer = kAudioHardwareUnknownPropertyError;
		}
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		LogError("EQM_PlugInInterface::EQM_SetPropertyData: unknown exception. (object: %u, address: %u)",
				 inObjectID,
				 inAddress ? inAddress->mSelector : 0);
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

#pragma mark IO Operations

static OSStatus	EQM_StartIO(AudioServerPlugInDriverRef inDriver,
                            AudioObjectID inDeviceObjectID,
                            UInt32 inClientID)
{
	//	This call tells the device that IO is starting for the given client. When this routine
	//	returns, the device's clock is running and it is ready to have data read/written. It is
	//	important to note that multiple clients can have IO running on the device at the same time.
	//	So, work only needs to be done when the first client starts. All subsequent starts simply
	//	increment the counter.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_StartIO: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_StartIO: unknown device");
		
		//	tell the device to do the work
        EQM_LookUpDevice(inDeviceObjectID).StartIO(inClientID);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_StopIO(AudioServerPlugInDriverRef inDriver,
                           AudioObjectID inDeviceObjectID,
                           UInt32 inClientID)
{
	//	This call tells the device that the client has stopped IO. The driver can stop the hardware
	//	once all clients have stopped.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_StopIO: bad driver reference");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_StopIO: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).StopIO(inClientID);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_GetZeroTimeStamp(AudioServerPlugInDriverRef inDriver,
                                     AudioObjectID inDeviceObjectID,
                                     UInt32 inClientID,
                                     Float64* outSampleTime,
                                     UInt64* outHostTime,
                                     UInt64* outSeed)
{
    #pragma unused(inClientID)
	//	This method returns the current zero time stamp for the device. The HAL models the timing of
	//	a device as a series of time stamps that relate the sample time to a host time. The zero
	//	time stamps are spaced such that the sample times are the value of
	//	kAudioDevicePropertyZeroTimeStampPeriod apart. This is often modeled using a ring buffer
	//	where the zero time stamp is updated when wrapping around the ring buffer.

	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_GetZeroTimeStamp: bad driver reference");
		ThrowIfNULL(outSampleTime,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_GetZeroTimeStamp: no place to put the sample time");
		ThrowIfNULL(outHostTime,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_GetZeroTimeStamp: no place to put the host time");
		ThrowIfNULL(outSeed,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_GetZeroTimeStamp: no place to put the seed");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_GetZeroTimeStamp: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).GetZeroTimeStamp(*outSampleTime, *outHostTime, *outSeed);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_WillDoIOOperation(AudioServerPlugInDriverRef inDriver,
                                      AudioObjectID inDeviceObjectID,
                                      UInt32 inClientID,
                                      UInt32 inOperationID,
                                      Boolean* outWillDo,
                                      Boolean* outWillDoInPlace)
{
	#pragma unused(inClientID)
	//	This method returns whether or not the device will do a given IO operation.

	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_WillDoIOOperation: bad driver reference");
		ThrowIfNULL(outWillDo,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_WillDoIOOperation: no place to put the will-do return value");
		ThrowIfNULL(outWillDoInPlace,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_WillDoIOOperation: no place to put the in-place return value");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_WillDoIOOperation: unknown device");
		
		//	tell the device to do the work
		bool willDo = false;
		bool willDoInPlace = false;
		EQM_LookUpDevice(inDeviceObjectID).WillDoIOOperation(inOperationID, willDo, willDoInPlace);
		
		//	set the return values
		*outWillDo = willDo;
		*outWillDoInPlace = willDoInPlace;
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		theAnswer = kAudioHardwareUnspecifiedError;
	}

	return theAnswer;
}

static OSStatus	EQM_BeginIOOperation(AudioServerPlugInDriverRef inDriver,
                                     AudioObjectID inDeviceObjectID,
                                     UInt32 inClientID,
                                     UInt32 inOperationID,
                                     UInt32 inIOBufferFrameSize,
                                     const AudioServerPlugInIOCycleInfo* inIOCycleInfo)
{
	// This is called at the beginning of an IO operation.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_BeginIOOperation: bad driver reference");
		ThrowIfNULL(inIOCycleInfo,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_BeginIOOperation: no cycle info");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_BeginIOOperation: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).BeginIOOperation(inOperationID,
                                                            inIOBufferFrameSize,
                                                            *inIOCycleInfo,
                                                            inClientID);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		DebugMsg("EQM_PlugInInterface::EQM_BeginIOOperation: unknown exception. (device: %s, operation: %u)",
				 (inDeviceObjectID == kObjectID_Device ? "EQMDevice" : "other"),
				 inOperationID);
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

static OSStatus	EQM_DoIOOperation(AudioServerPlugInDriverRef inDriver,
                                  AudioObjectID inDeviceObjectID,
                                  AudioObjectID inStreamObjectID,
                                  UInt32 inClientID,
                                  UInt32 inOperationID,
                                  UInt32 inIOBufferFrameSize,
                                  const AudioServerPlugInIOCycleInfo* inIOCycleInfo,
                                  void* ioMainBuffer,
                                  void* ioSecondaryBuffer)
{
	//	This is called to actually perform a given IO operation.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_EndIOOperation: bad driver reference");
		ThrowIfNULL(inIOCycleInfo,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_EndIOOperation: no cycle info");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_EndIOOperation: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).DoIOOperation(inStreamObjectID,
                                                         inClientID,
                                                         inOperationID,
                                                         inIOBufferFrameSize,
                                                         *inIOCycleInfo,
                                                         ioMainBuffer,
                                                         ioSecondaryBuffer);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		DebugMsg("EQM_PlugInInterface::EQM_DoIOOperation: unknown exception. (device: %s, operation: %u)",
				 (inDeviceObjectID == kObjectID_Device ? "EQMDevice" : "other"),
				 inOperationID);
		theAnswer = kAudioHardwareUnspecifiedError;
	}

	return theAnswer;
}

static OSStatus	EQM_EndIOOperation(AudioServerPlugInDriverRef inDriver,
                                   AudioObjectID inDeviceObjectID,
                                   UInt32 inClientID,
                                   UInt32 inOperationID,
                                   UInt32 inIOBufferFrameSize,
                                   const AudioServerPlugInIOCycleInfo* inIOCycleInfo)
{
	// This is called at the end of an IO operation.
	
	OSStatus theAnswer = 0;
	
	try
	{
		//	check the arguments
		ThrowIf(inDriver != gAudioServerPlugInDriverRef,
                CAException(kAudioHardwareBadObjectError),
                "EQM_EndIOOperation: bad driver reference");
		ThrowIfNULL(inIOCycleInfo,
                    CAException(kAudioHardwareIllegalOperationError),
                    "EQM_EndIOOperation: no cycle info");
		ThrowIf(inDeviceObjectID != kObjectID_Device && inDeviceObjectID != kObjectID_Device_UI_Sounds && inDeviceObjectID != kObjectID_Device_Null,
                CAException(kAudioHardwareBadDeviceError),
                "EQM_EndIOOperation: unknown device");
		
		//	tell the device to do the work
		EQM_LookUpDevice(inDeviceObjectID).EndIOOperation(inOperationID,
                                                          inIOBufferFrameSize,
                                                          *inIOCycleInfo,
                                                          inClientID);
	}
	catch(const CAException& inException)
	{
		theAnswer = inException.GetError();
	}
	catch(...)
	{
		DebugMsg("EQM_PlugInInterface::EQM_EndIOOperation: unknown exception. (device: %s, operation: %u)",
				 (inDeviceObjectID == kObjectID_Device ? "EQMDevice" : "other"),
				 inOperationID);
		theAnswer = kAudioHardwareUnspecifiedError;
	}
	
	return theAnswer;
}

