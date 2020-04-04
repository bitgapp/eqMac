//
//  EQM_PlugIn.cpp
//  EQMDriver
//
//  Portions copyright (C) 2013 Apple Inc. All Rights Reserved.
//
//  Based largely on SA_PlugIn.cpp from Apple's SimpleAudioDriver Plug-In sample code.
//  https://developer.apple.com/library/mac/samplecode/AudioDriverExamples
//

//	Self Include
#include "EQM_PlugIn.h"

//  Local Includes
#include "EQM_Device.h"
#include "EQM_NullDevice.h"

//  PublicUtility Includes
#include "CAException.h"
#include "CADebugMacros.h"
#include "CAPropertyAddress.h"
#include "CADispatchQueue.h"


#pragma mark Construction/Destruction

pthread_once_t				EQM_PlugIn::sStaticInitializer = PTHREAD_ONCE_INIT;
EQM_PlugIn*					EQM_PlugIn::sInstance = NULL;
AudioServerPlugInHostRef	EQM_PlugIn::sHost = NULL;

EQM_PlugIn& EQM_PlugIn::GetInstance()
{
  pthread_once(&sStaticInitializer, StaticInitializer);
  return *sInstance;
}

void	EQM_PlugIn::StaticInitializer()
{
  try
  {
    sInstance = new EQM_PlugIn;
    sInstance->Activate();
  }
  catch(...)
  {
    DebugMsg("EQM_PlugIn::StaticInitializer: failed to create the plug-in");
    delete sInstance;
    sInstance = NULL;
  }
}

EQM_PlugIn::EQM_PlugIn()
:
EQM_Object(kAudioObjectPlugInObject, kAudioPlugInClassID, kAudioObjectClassID, 0),
mMutex("EQM_PlugIn")
{
}

EQM_PlugIn::~EQM_PlugIn()
{
}

void	EQM_PlugIn::Deactivate()
{
  CAMutex::Locker theLocker(mMutex);
  EQM_Object::Deactivate();
  // TODO:
  //_RemoveAllDevices();
}

#pragma mark Property Operations

bool	EQM_PlugIn::HasProperty(AudioObjectID inObjectID, pid_t inClientPID, const AudioObjectPropertyAddress& inAddress) const
{
  bool theAnswer = false;
  switch(inAddress.mSelector)
  {
    case kAudioObjectPropertyManufacturer:
    case kAudioPlugInPropertyDeviceList:
    case kAudioPlugInPropertyTranslateUIDToDevice:
    case kAudioPlugInPropertyResourceBundle:
    case kAudioObjectPropertyCustomPropertyInfoList:
    case kAudioPlugInCustomPropertyNullDeviceActive:
    case kAudioPlugInCustomPropertyDeviceActive:
    case kAudioPlugInCustomPropertyUIDeviceActive:
    theAnswer = true;
    break;
    
    default:
    theAnswer = EQM_Object::HasProperty(inObjectID, inClientPID, inAddress);
    
  };
  return theAnswer;
}

bool	EQM_PlugIn::IsPropertySettable(AudioObjectID inObjectID, pid_t inClientPID, const AudioObjectPropertyAddress& inAddress) const
{
  bool theAnswer = false;
  switch(inAddress.mSelector)
  {
    case kAudioObjectPropertyManufacturer:
    case kAudioPlugInPropertyDeviceList:
    case kAudioPlugInPropertyTranslateUIDToDevice:
    case kAudioPlugInPropertyResourceBundle:
    case kAudioObjectPropertyCustomPropertyInfoList:
    theAnswer = false;
    break;
    
    case kAudioPlugInCustomPropertyNullDeviceActive:
    case kAudioPlugInCustomPropertyDeviceActive:
    case kAudioPlugInCustomPropertyUIDeviceActive:
    theAnswer = true;
    break;
    
    default:
    theAnswer = EQM_Object::IsPropertySettable(inObjectID, inClientPID, inAddress);
  };
  return theAnswer;
}

UInt32	EQM_PlugIn::GetPropertyDataSize(AudioObjectID inObjectID, pid_t inClientPID, const AudioObjectPropertyAddress& inAddress, UInt32 inQualifierDataSize, const void* inQualifierData) const
{
  UInt32 theAnswer = 0;
  switch(inAddress.mSelector)
  {
    case kAudioObjectPropertyManufacturer:
    theAnswer = sizeof(CFStringRef);
    break;
    
    case kAudioObjectPropertyOwnedObjects:
    case kAudioPlugInPropertyDeviceList:
    // The plug-in owns the main EQM_Device, the instance of EQM_Device that handles UI
    // sounds and, if it's enabled, the null device.
    theAnswer = (EQM_NullDevice::GetInstance().IsActive() ? 3 : 2) * sizeof(AudioObjectID);
    break;
    
    case kAudioPlugInPropertyTranslateUIDToDevice:
    theAnswer = sizeof(AudioObjectID);
    break;
    
    case kAudioPlugInPropertyResourceBundle:
    theAnswer = sizeof(CFStringRef);
    break;
    
    case kAudioObjectPropertyCustomPropertyInfoList:
    theAnswer = sizeof(AudioServerPlugInCustomPropertyInfo);
    break;
    
    case kAudioPlugInCustomPropertyNullDeviceActive:
    case kAudioPlugInCustomPropertyDeviceActive:
    case kAudioPlugInCustomPropertyUIDeviceActive:
    theAnswer = sizeof(CFBooleanRef);
    break;
    
    
    default:
    theAnswer = EQM_Object::GetPropertyDataSize(inObjectID, inClientPID, inAddress, inQualifierDataSize, inQualifierData);
  };
  return theAnswer;
}

void	EQM_PlugIn::GetPropertyData(AudioObjectID inObjectID, pid_t inClientPID, const AudioObjectPropertyAddress& inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, UInt32& outDataSize, void* outData) const
{
  switch(inAddress.mSelector)
  {
    case kAudioObjectPropertyManufacturer:
    //	This is the human readable name of the maker of the plug-in.
    ThrowIf(inDataSize < sizeof(CFStringRef), CAException(kAudioHardwareBadPropertySizeError), "EQM_PlugIn::GetPropertyData: not enough space for the return value of kAudioObjectPropertyManufacturer");
    *reinterpret_cast<CFStringRef*>(outData) = CFSTR("Bitgapp");
    outDataSize = sizeof(CFStringRef);
    break;
    
    case kAudioObjectPropertyOwnedObjects:
    // Fall through because this plug-in object only owns the devices.
    case kAudioPlugInPropertyDeviceList:
    {
      AudioObjectID* theReturnedDeviceList = reinterpret_cast<AudioObjectID*>(outData);
      UInt32 added = 0;
      
      if(inDataSize >= 3 * sizeof(AudioObjectID))
      {
        if(EQM_NullDevice::GetInstance().IsActive())
        {
          theReturnedDeviceList[added] = kObjectID_Device_Null;
          outDataSize += sizeof(AudioObjectID);
          added++;
        }
        
        if (EQM_Device::GetInstance().IsActive()) {
          theReturnedDeviceList[added] = kObjectID_Device;
          outDataSize += sizeof(AudioObjectID);
          added++;
        }
        
        if (EQM_Device::GetUISoundsInstance().IsActive()) {
          theReturnedDeviceList[added] = kObjectID_Device_UI_Sounds;
          added++;
        }
        
      }
      else if(inDataSize >= 2 * sizeof(AudioObjectID))
      {
        if (EQM_Device::GetInstance().IsActive()) {
          theReturnedDeviceList[added] = kObjectID_Device;
          outDataSize += sizeof(AudioObjectID);
          added++;
        }
        
        if (EQM_Device::GetUISoundsInstance().IsActive()) {
          theReturnedDeviceList[added] = kObjectID_Device_UI_Sounds;
          added++;
        }
      }
      else if(inDataSize >= sizeof(AudioObjectID))
      {
        if (EQM_Device::GetInstance().IsActive()) {
          theReturnedDeviceList[added] = kObjectID_Device;
          outDataSize += sizeof(AudioObjectID);
          added++;
        }
      }
      outDataSize = added * sizeof(AudioObjectID);
      
    }
    break;
    
    case kAudioPlugInPropertyTranslateUIDToDevice:
    {
      //	This property translates the UID passed in the qualifier as a CFString into the
      //	AudioObjectID for the device the UID refers to or kAudioObjectUnknown if no device
      //	has the UID.
      ThrowIf(inQualifierDataSize < sizeof(CFStringRef), CAException(kAudioHardwareBadPropertySizeError), "EQM_PlugIn::GetPropertyData: the qualifier size is too small for kAudioPlugInPropertyTranslateUIDToDevice");
      ThrowIf(inDataSize < sizeof(AudioObjectID), CAException(kAudioHardwareBadPropertySizeError), "EQM_PlugIn::GetPropertyData: not enough space for the return value of kAudioPlugInPropertyTranslateUIDToDevice");
      
      CFStringRef theUID = *reinterpret_cast<const CFStringRef*>(inQualifierData);
      AudioObjectID* outID = reinterpret_cast<AudioObjectID*>(outData);
      
      if(CFEqual(theUID, EQM_Device::GetInstance().CopyDeviceUID()))
      {
        DebugMsg("EQM_PlugIn::GetPropertyData: Returning EQMDevice for "
                 "kAudioPlugInPropertyTranslateUIDToDevice");
        *outID = kObjectID_Device;
      }
      else if(CFEqual(theUID, EQM_Device::GetUISoundsInstance().CopyDeviceUID()))
      {
        DebugMsg("EQM_PlugIn::GetPropertyData: Returning EQMUISoundsDevice for "
                 "kAudioPlugInPropertyTranslateUIDToDevice");
        *outID = kObjectID_Device_UI_Sounds;
      }
      else if(EQM_NullDevice::GetInstance().IsActive() &&
              CFEqual(theUID, EQM_NullDevice::GetInstance().CopyDeviceUID()))
      {
        DebugMsg("EQM_PlugIn::GetPropertyData: Returning null device for "
                 "kAudioPlugInPropertyTranslateUIDToDevice");
        *outID = kObjectID_Device_Null;
      }
      else
      {
        LogWarning("EQM_PlugIn::GetPropertyData: Returning kAudioObjectUnknown for "
                   "kAudioPlugInPropertyTranslateUIDToDevice");
        *outID = kAudioObjectUnknown;
      }
      
      outDataSize = sizeof(AudioObjectID);
    }
    break;
    
    case kAudioPlugInPropertyResourceBundle:
    //	The resource bundle is a path relative to the path of the plug-in's bundle.
    //	To specify that the plug-in bundle itself should be used, we just return the
    //	empty string.
    ThrowIf(inDataSize < sizeof(AudioObjectID), CAException(kAudioHardwareBadPropertySizeError), "EQM_GetPlugInPropertyData: not enough space for the return value of kAudioPlugInPropertyResourceBundle");
    *reinterpret_cast<CFStringRef*>(outData) = CFSTR("");
    outDataSize = sizeof(CFStringRef);
    break;
    
    case kAudioObjectPropertyCustomPropertyInfoList:
    if(inDataSize >= sizeof(AudioServerPlugInCustomPropertyInfo))
    {
      AudioServerPlugInCustomPropertyInfo* outCustomProperties =
      reinterpret_cast<AudioServerPlugInCustomPropertyInfo*>(outData);
      
      UInt32 propertyType = kAudioServerPlugInCustomPropertyDataTypeCFPropertyList;
      UInt32 qualifierType = kAudioServerPlugInCustomPropertyDataTypeNone;
      
      outCustomProperties[0].mSelector = kAudioPlugInCustomPropertyNullDeviceActive;
      outCustomProperties[0].mPropertyDataType = propertyType;
      outCustomProperties[0].mQualifierDataType = qualifierType;
      
      outCustomProperties[1].mSelector = kAudioPlugInCustomPropertyDeviceActive;
      outCustomProperties[1].mPropertyDataType = propertyType;
      outCustomProperties[1].mQualifierDataType = qualifierType;
      
      outCustomProperties[2].mSelector = kAudioPlugInCustomPropertyUIDeviceActive;
      outCustomProperties[2].mPropertyDataType = propertyType;
      outCustomProperties[2].mQualifierDataType = qualifierType;
      
      outDataSize = 3 * sizeof(AudioServerPlugInCustomPropertyInfo);
    }
    else
    {
      outDataSize = 0;
    }
    break;
    
    case kAudioPlugInCustomPropertyNullDeviceActive:
    ThrowIf(inDataSize < sizeof(CFBooleanRef),
            CAException(kAudioHardwareBadPropertySizeError),
            "EQM_PlugIn::GetPropertyData: not enough space for the return value of "
            "kAudioPlugInCustomPropertyNullDeviceActive");
    *reinterpret_cast<CFBooleanRef*>(outData) =
    EQM_NullDevice::GetInstance().IsActive() ? kCFBooleanTrue : kCFBooleanFalse;
    outDataSize = sizeof(CFBooleanRef);
    break;
    
    case kAudioPlugInCustomPropertyDeviceActive:
    ThrowIf(inDataSize < sizeof(CFBooleanRef),
            CAException(kAudioHardwareBadPropertySizeError),
            "EQM_PlugIn::GetPropertyData: not enough space for the return value of "
            "kAudioPlugInCustomPropertyDevicesActive");
    *reinterpret_cast<CFBooleanRef*>(outData) =
    EQM_Device::GetInstance().IsActive() ? kCFBooleanTrue : kCFBooleanFalse;
    outDataSize = sizeof(CFBooleanRef);
    break;
    
    case kAudioPlugInCustomPropertyUIDeviceActive:
    ThrowIf(inDataSize < sizeof(CFBooleanRef),
            CAException(kAudioHardwareBadPropertySizeError),
            "EQM_PlugIn::GetPropertyData: not enough space for the return value of "
            "kAudioPlugInCustomPropertyDevicesActive");
    *reinterpret_cast<CFBooleanRef*>(outData) =
    EQM_Device::GetUISoundsInstance().IsActive() ? kCFBooleanTrue : kCFBooleanFalse;
    outDataSize = sizeof(CFBooleanRef);
    break;
    
    default:
    EQM_Object::GetPropertyData(inObjectID, inClientPID, inAddress, inQualifierDataSize, inQualifierData, inDataSize, outDataSize, outData);
    break;
  };
}

void	EQM_PlugIn::SetPropertyData(AudioObjectID inObjectID, pid_t inClientPID, const AudioObjectPropertyAddress& inAddress, UInt32 inQualifierDataSize, const void* inQualifierData, UInt32 inDataSize, const void* inData)
{
  switch(inAddress.mSelector)
  {
    case kAudioPlugInCustomPropertyNullDeviceActive:
    {
      ThrowIf(inDataSize < sizeof(CFBooleanRef),
              CAException(kAudioHardwareBadPropertySizeError),
              "EQM_PlugIn::SetPropertyData: wrong size for the data for "
              "kAudioPlugInCustomPropertyNullDeviceActive");
      
      CFBooleanRef theIsActiveRef = *reinterpret_cast<const CFBooleanRef*>(inData);
      
      ThrowIfNULL(theIsActiveRef,
                  CAException(kAudioHardwareIllegalOperationError),
                  "EQM_PlugIn::SetPropertyData: null reference given for "
                  "kAudioPlugInCustomPropertyNullDeviceActive");
      ThrowIf(CFGetTypeID(theIsActiveRef) != CFBooleanGetTypeID(),
              CAException(kAudioHardwareIllegalOperationError),
              "EQM_PlugIn::SetPropertyData: CFType given for "
              "kAudioPlugInCustomPropertyNullDeviceActive was not a CFBoolean");
      
      bool theIsActive = CFBooleanGetValue(theIsActiveRef);
      
      if(theIsActive != EQM_NullDevice::GetInstance().IsActive())
      {
        // Activate/deactivate the Null Device. We only make it active for a short
        // period, while changing output device in EQMApp, so it can be hidden from the
        // user.
        if(theIsActive)
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Activating null device");
          EQM_NullDevice::GetInstance().Activate();
        }
        else
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Deactivating null device");
          EQM_NullDevice::GetInstance().Deactivate();
        }
        
        // Send notifications.
        CADispatchQueue::GetGlobalSerialQueue().Dispatch(false, ^{
          AudioObjectPropertyAddress theChangedProperties[] = {
            CAPropertyAddress(kAudioObjectPropertyOwnedObjects),
            CAPropertyAddress(kAudioPlugInPropertyDeviceList)
          };
          
          Host_PropertiesChanged(GetObjectID(), 2, theChangedProperties);
        });
      }
    }
    break;
    case kAudioPlugInCustomPropertyDeviceActive:
    {
      ThrowIf(inDataSize < sizeof(CFBooleanRef),
              CAException(kAudioHardwareBadPropertySizeError),
              "EQM_PlugIn::SetPropertyData: wrong size for the data for "
              "kAudioPlugInCustomPropertyNullDeviceActive");
      
      CFBooleanRef theIsActiveRef = *reinterpret_cast<const CFBooleanRef*>(inData);
      
      ThrowIfNULL(theIsActiveRef,
                  CAException(kAudioHardwareIllegalOperationError),
                  "EQM_PlugIn::SetPropertyData: null reference given for "
                  "kAudioPlugInCustomPropertyNullDeviceActive");
      ThrowIf(CFGetTypeID(theIsActiveRef) != CFBooleanGetTypeID(),
              CAException(kAudioHardwareIllegalOperationError),
              "EQM_PlugIn::SetPropertyData: CFType given for "
              "kAudioPlugInCustomPropertyNullDeviceActive was not a CFBoolean");
      
      bool theIsActive = CFBooleanGetValue(theIsActiveRef);
      
      if(theIsActive != EQM_Device::GetInstance().IsActive())
      {
        if(theIsActive)
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Activating Device");
          EQM_Device::GetInstance().Activate();
        }
        else
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Deactivating Device");
          EQM_Device::GetInstance().Deactivate();
        }
        
        // Send notifications.
        CADispatchQueue::GetGlobalSerialQueue().Dispatch(false, ^{
          AudioObjectPropertyAddress theChangedProperties[] = {
            CAPropertyAddress(kAudioObjectPropertyOwnedObjects),
            CAPropertyAddress(kAudioPlugInPropertyDeviceList)
          };
          
          Host_PropertiesChanged(GetObjectID(), 2, theChangedProperties);
        });
      }
    }
    break;
    case kAudioPlugInCustomPropertyUIDeviceActive: {
      ThrowIf(inDataSize < sizeof(CFBooleanRef),
              CAException(kAudioHardwareBadPropertySizeError),
              "EQM_PlugIn::SetPropertyData: wrong size for the data for "
              "kAudioPlugInCustomPropertyNullDeviceActive");
      
      CFBooleanRef theIsActiveRef = *reinterpret_cast<const CFBooleanRef*>(inData);
      
      ThrowIfNULL(theIsActiveRef,
                  CAException(kAudioHardwareIllegalOperationError),
                  "EQM_PlugIn::SetPropertyData: null reference given for "
                  "kAudioPlugInCustomPropertyNullDeviceActive");
      ThrowIf(CFGetTypeID(theIsActiveRef) != CFBooleanGetTypeID(),
              CAException(kAudioHardwareIllegalOperationError),
              "EQM_PlugIn::SetPropertyData: CFType given for "
              "kAudioPlugInCustomPropertyNullDeviceActive was not a CFBoolean");
      
      bool theIsActive = CFBooleanGetValue(theIsActiveRef);
      
      if(theIsActive != EQM_Device::GetUISoundsInstance().IsActive())
      {
        if(theIsActive)
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Activating Device");
          EQM_Device::GetUISoundsInstance().Activate();
        }
        else
        {
          DebugMsg("EQM_PlugIn::SetPropertyData: Deactivating Device");
          EQM_Device::GetUISoundsInstance().Deactivate();
        }
        
        // Send notifications.
        CADispatchQueue::GetGlobalSerialQueue().Dispatch(false, ^{
          AudioObjectPropertyAddress theChangedProperties[] = {
            CAPropertyAddress(kAudioObjectPropertyOwnedObjects),
            CAPropertyAddress(kAudioPlugInPropertyDeviceList)
          };
          
          Host_PropertiesChanged(GetObjectID(), 2, theChangedProperties);
        });
      }
    }
    break;
    
    default:
    EQM_Object::SetPropertyData(inObjectID, inClientPID, inAddress, inQualifierDataSize, inQualifierData, inDataSize, inData);
    break;
  };
}

