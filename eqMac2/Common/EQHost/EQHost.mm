#import <Foundation/Foundation.h>
#import "EQHost.h"

@implementation EQHost

static EQEngine *mEngine;
static AudioDeviceID selectedOutputDeviceID;
static AudioDeviceID passthroughDeviceID;
static NSDate *runStart;
static NSNumber *bandMode;

+(void)createEQEngineWithOutputDevice:(AudioDeviceID)output{
    if([self EQEngineExists]) [self deleteEQEngine];
    if(!passthroughDeviceID) passthroughDeviceID = [self createPassthroughDevice];
    
    AudioDeviceID input = [Devices deviceIsBuiltIn:output] ? [Devices getEQMacDeviceID] : passthroughDeviceID;
    selectedOutputDeviceID = output;
    
    [Devices switchToDeviceWithID: passthroughDeviceID];
    
    bandMode = [Storage get: kStorageSelectedBandMode];
    if (!bandMode) {
        bandMode = @10;
        [Storage set: bandMode key: kStorageSelectedBandMode];
    }
    

    NSLog(@"%@", bandMode);
    mEngine = new EQEngine(input, output);
    mEngine->Start();
    
    NSMutableArray *savedGains = [Storage get:kStorageSelectedGains];
    if(!savedGains) {
        savedGains = [@[] mutableCopy];
        
        for (int i = 0; i < [bandMode intValue]; i++) [savedGains addObject: @0];
        
        [Storage set: savedGains key: kStorageSelectedGains];
    }
    [self setEQEngineFrequencyGains: savedGains];
    runStart = [NSDate date];
}


+(AudioDeviceID)createPassthroughDevice{
    OSStatus osErr = noErr;
    UInt32 outSize;
    Boolean outWritable;
    
    //-----------------------
    // Start to create a new aggregate by getting the base audio hardware plugin
    //-----------------------
    
    osErr = AudioHardwareGetPropertyInfo(kAudioHardwarePropertyPlugInForBundleID, &outSize, &outWritable);
    if (osErr != noErr) return osErr;
    
    AudioValueTranslation pluginAVT;
    
    CFStringRef inBundleRef = CFSTR("com.apple.audio.CoreAudio");
    AudioObjectID pluginID;
    
    pluginAVT.mInputData = &inBundleRef;
    pluginAVT.mInputDataSize = sizeof(inBundleRef);
    pluginAVT.mOutputData = &pluginID;
    pluginAVT.mOutputDataSize = sizeof(pluginID);
    
    osErr = AudioHardwareGetProperty(kAudioHardwarePropertyPlugInForBundleID, &outSize, &pluginAVT);
    if (osErr != noErr) return osErr;
    
    //-----------------------
    // Create a CFDictionary for our aggregate device
    //-----------------------
    
    CFMutableDictionaryRef aggDeviceDict = CFDictionaryCreateMutable(NULL, 0, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
    
    CFStringRef passthroughDeviceNameRef = (__bridge CFStringRef) DEVICE_NAME;
    CFStringRef passthroughDeviceUIDRef = CFSTR("com.bitgapp.eqMac2MOD");
    
    // add the name of the device to the dictionary
    CFDictionaryAddValue(aggDeviceDict, CFSTR(kAudioAggregateDeviceNameKey), passthroughDeviceNameRef);
    
    // add our choice of UID for the passthrough device to the dictionary
    
    CFDictionaryAddValue(aggDeviceDict, CFSTR(kAudioAggregateDeviceUIDKey), passthroughDeviceUIDRef);
    
    //-----------------------
    // Create a CFMutableArray for our sub-device list
    //-----------------------
    
    // this example assumes that you already know the UID of the device to be added
    // you can find this for a given AudioDeviceID via AudioDeviceGetProperty for the kAudioDevicePropertyDeviceUID property
    // obviously the example deviceUID below won't actually work!
    
    CFStringRef deviceUID = (__bridge CFStringRef )DRIVER_UID;
    
    // we need to append the UID for each device to a CFMutableArray, so create one here
    CFMutableArrayRef subDevicesArray = CFArrayCreateMutable(NULL, 0, &kCFTypeArrayCallBacks);
    
    // just the one sub-device in this example, so append the sub-device's UID to the CFArray
    CFArrayAppendValue(subDevicesArray, deviceUID);
    
    // if you need to add more than one sub-device, then keep calling CFArrayAppendValue here for the other sub-device UIDs
    
    //-----------------------
    // Feed the dictionary to the plugin, to create a blank passthrough device
    //-----------------------
    
    AudioObjectPropertyAddress pluginAOPA;
    pluginAOPA.mSelector = kAudioPlugInCreateAggregateDevice;
    pluginAOPA.mScope = kAudioObjectPropertyScopeGlobal;
    pluginAOPA.mElement = kAudioObjectPropertyElementMaster;
    UInt32 outDataSize;
    
    osErr = AudioObjectGetPropertyDataSize(pluginID, &pluginAOPA, 0, NULL, &outDataSize);
    if (osErr != noErr) return osErr;
    
    AudioDeviceID outPassthroughDevice;
    
    osErr = AudioObjectGetPropertyData(pluginID, &pluginAOPA, sizeof(aggDeviceDict), &aggDeviceDict, &outDataSize, &outPassthroughDevice);
    if (osErr != noErr) return osErr;
    
    // pause for a bit to make sure that everything completed correctly
    // this is to work around a bug in the HAL where a new passthrough device seems to disappear briefly after it is created
    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.1, false);
    
    //-----------------------
    // Set the sub-device list
    //-----------------------
    
    
    
    pluginAOPA.mSelector = kAudioAggregateDevicePropertyFullSubDeviceList;
    pluginAOPA.mScope = kAudioObjectPropertyScopeGlobal;
    pluginAOPA.mElement = kAudioObjectPropertyElementMaster;
    outDataSize = sizeof(CFMutableArrayRef);
    osErr = AudioObjectSetPropertyData(outPassthroughDevice, &pluginAOPA, 0, NULL, outDataSize, &subDevicesArray);
    if (osErr != noErr) return osErr;
    
    // pause again to give the changes time to take effect
    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.1, false);
    
    //-----------------------
    // Set the master device
    //-----------------------
    
    // set the master device manually (this is the device which will act as the master clock for the passthrough device)
    // pass in the UID of the device you want to use
    pluginAOPA.mSelector = kAudioAggregateDevicePropertyMasterSubDevice;
    pluginAOPA.mScope = kAudioObjectPropertyScopeGlobal;
    pluginAOPA.mElement = kAudioObjectPropertyElementMaster;
    outDataSize = sizeof(deviceUID);
    osErr = AudioObjectSetPropertyData(outPassthroughDevice, &pluginAOPA, 0, NULL, outDataSize, &deviceUID);
    if (osErr != noErr) return osErr;
    
    // pause again to give the changes time to take effect
    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.1, false);
    
    //-----------------------
    // Set drift correction for each device
    //-----------------------
    
    AudioObjectPropertyAddress subDevicesAddress = { kAudioObjectPropertyOwnedObjects, kAudioObjectPropertyScopeGlobal, kAudioObjectPropertyElementMaster };
    UInt32 theQualifierDataSize = sizeof(AudioObjectID);
    AudioClassID inClass = kAudioSubDeviceClassID;
    void* theQualifierData = &inClass;
    // Get the property data size
    osErr = AudioObjectGetPropertyDataSize(outPassthroughDevice, &subDevicesAddress, theQualifierDataSize, theQualifierData, &outSize);
    if (osErr != noErr) return osErr;

    
    //	Calculate the number of object IDs
    UInt32 subDevicesNum = outSize / sizeof(AudioObjectID);
    AudioObjectID subDevices[subDevicesNum];
    outSize = sizeof(subDevices);
    
    osErr = AudioObjectGetPropertyData(outPassthroughDevice, &subDevicesAddress, theQualifierDataSize, theQualifierData, &outSize, subDevices);
    if (osErr != noErr) return osErr;

    
    // Set kAudioSubDevicePropertyDriftCompensation property...
    AudioObjectPropertyAddress theAddressDrift = { kAudioSubDevicePropertyDriftCompensation, kAudioObjectPropertyScopeGlobal, kAudioObjectPropertyElementMaster };
    for (UInt32 index = 0; index < subDevicesNum; ++index) {
        UInt32 theDriftCompensationValue = 1;
        osErr = AudioObjectSetPropertyData(subDevices[index], &theAddressDrift, 0, NULL, sizeof(UInt32), &theDriftCompensationValue);
        if (osErr != noErr) return osErr;
    }
    
    // pause again to give the changes time to take effect
    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.1, false);
    
    //-----------------------
    // Clean up
    //-----------------------
    
    // release the CF objects we have created - we don't need them any more
    CFRelease(aggDeviceDict);
    CFRelease(subDevicesArray);
    
    // release the device UID
    CFRelease(deviceUID);
    
    checkErr(noErr);
    return outPassthroughDevice;
    
}


+(void)detectAndRemoveRoguePassthroughDevice{
    for(NSDictionary *device in [Devices getAllDevices]){
        if([[device objectForKey:@"name"] isEqualToString:DEVICE_NAME]){
            [self removePassthroughDeviceWithID:[[device objectForKey:@"id"] intValue]];
            return;
        }
    }
}

+(void)removePassthroughDeviceWithID:(AudioDeviceID)ID{
    //-----------------------
    // Start by getting the base audio hardware plugin
    //-----------------------
    
    UInt32 outSize;
    Boolean outWritable;
    AudioHardwareGetPropertyInfo(kAudioHardwarePropertyPlugInForBundleID, &outSize, &outWritable);
    
    AudioValueTranslation pluginAVT;
    
    CFStringRef inBundleRef = CFSTR("com.apple.audio.CoreAudio");
    AudioObjectID pluginID;
    
    pluginAVT.mInputData = &inBundleRef;
    pluginAVT.mInputDataSize = sizeof(inBundleRef);
    pluginAVT.mOutputData = &pluginID;
    pluginAVT.mOutputDataSize = sizeof(pluginID);
    
    AudioHardwareGetProperty(kAudioHardwarePropertyPlugInForBundleID, &outSize, &pluginAVT);
    
    //-----------------------
    // Feed the AudioDeviceID to the plugin, to destroy the passthrough device
    //-----------------------
    
    AudioObjectPropertyAddress pluginAOPA;
    pluginAOPA.mSelector = kAudioPlugInDestroyAggregateDevice;
    pluginAOPA.mScope = kAudioObjectPropertyScopeGlobal;
    pluginAOPA.mElement = kAudioObjectPropertyElementMaster;
    UInt32 outDataSize;
    
    AudioObjectGetPropertyDataSize(pluginID, &pluginAOPA, 0, NULL, &outDataSize);
    
    AudioObjectGetPropertyData(pluginID, &pluginAOPA, 0, NULL, &outDataSize, &ID);
    passthroughDeviceID = 0;
    return;
}

+(void)deleteEQEngine{
    if(mEngine){
        [Storage set:[EQHost getEQEngineFrequencyGains] key:kStorageSelectedGains];
        
        mEngine->Stop();
            
        delete mEngine;
        mEngine = NULL;
        
        [self stopTimer];
    }
}

+(void)stopTimer{
    NSTimeInterval currentRun = -[runStart timeIntervalSinceNow];
    int overallRuntime = [[Storage get: kStorageOverallRuntime] intValue];
    [Storage set:[NSNumber numberWithInt:overallRuntime + currentRun] key:kStorageOverallRuntime];
}

+(BOOL)EQEngineExists{
    return (mEngine != NULL) ? true : false;
}

+(void)setEQEngineFrequencyGains:(NSArray*)gains{
    Float32 *array = new Float32[[gains count]];
    
    for(int i = 0; i < [gains count]; i++){
        array[i] = [[gains objectAtIndex:i] floatValue];
    }
    
    if(mEngine){
        mEngine->SetEqGains(array);
    }
}

+(NSArray*)getEQEngineFrequencyGains{
        Float32 *gains = mEngine->GetEqGains();
        int nGains = bandMode.intValue;
        NSMutableArray *convertedGains = [[NSMutableArray alloc] init];
        for(int i = 0; i < nGains; i++){
            [convertedGains addObject: mEngine ? [NSNumber numberWithFloat:gains[i]] : @0];
        }
        return convertedGains;
}


+(AudioDeviceID)getSelectedOutputDeviceID{
    if(selectedOutputDeviceID){
        return selectedOutputDeviceID;
    }
    return 0;
}

+(AudioDeviceID)getPassthroughDeviceID{
    if(passthroughDeviceID){
        return passthroughDeviceID;
    }
    return 0;
}

@end
