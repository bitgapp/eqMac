//
//  AppDelegate.m
//  eqMac2Helper
//
//  Created by Romans Kisils on 18/11/2017.
//  Copyright © 2017 Romans Kisils. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()
@end

AudioDeviceID previouslySelectedDeviceID;

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Insert code here to initialize your application
    [self executeBlock: ^{ [self checkDevice]; } every: 1];
}

-(NSTimer *)executeBlock:(void(^)(void))block every:(CGFloat)seconds{
    return [NSTimer scheduledTimerWithTimeInterval:seconds
                                            target:[NSBlockOperation blockOperationWithBlock:block]
                                          selector:@selector(main)
                                          userInfo:nil
                                           repeats:YES];
}

-(void)checkDevice{
    AudioDeviceID selectedDeviceID = [self getCurrentDeviceID];
    NSString *selectedDeviceName = [self getDeviceNameByID: selectedDeviceID];
    if ([selectedDeviceName isEqualToString:@"eqMac2"] && ![self eqMacAppIsRunning]) {
        AudioDeviceID switchDeviceID = previouslySelectedDeviceID;
        if (!previouslySelectedDeviceID) {
            switchDeviceID = [self getBuiltInDeviceID];
        }
        [self switchToDeviceWithID: switchDeviceID];
    } else {
        previouslySelectedDeviceID = [self getCurrentDeviceID];
    }
}

-(BOOL)eqMacAppIsRunning{
    NSArray *runningApplications = [[NSWorkspace sharedWorkspace] runningApplications];
    for (NSRunningApplication *application in runningApplications) {
        if ([[application bundleIdentifier] isEqualToString:@"com.bitgapp.eqMac2"]) {
            return true;
        }
    }
    return false;
}

-(AudioDeviceID)getCurrentDeviceID{
    AudioObjectPropertyAddress currentOutputDevicePropertyAddress = {
        kAudioHardwarePropertyDefaultOutputDevice,
        kAudioObjectPropertyScopeGlobal,
        kAudioObjectPropertyElementMaster
    };
    
    AudioDeviceID currentOutputDeviceID;
    UInt32 currentOutputDeviceIDSize = sizeof(currentOutputDeviceID);
    AudioObjectGetPropertyData(kAudioObjectSystemObject,
                               &currentOutputDevicePropertyAddress,
                               0, NULL,
                               &currentOutputDeviceIDSize, &currentOutputDeviceID);
    return currentOutputDeviceID;
}

-(NSString*)getDeviceNameByID:(UInt32)ID{
    AudioObjectPropertyAddress nameAddress = { kAudioDevicePropertyDeviceName, kAudioDevicePropertyScopeOutput, 0 };
    
    char name[64];
    UInt32 propsize = sizeof(name);
    AudioObjectGetPropertyData(ID, &nameAddress, 0, NULL, &propsize, &name);
    
    return [NSString stringWithFormat:@"%s", name];
}

-(AudioDeviceID)getBuiltInDeviceID{
    NSArray *devices = [self getAllOutputDevices];
    for (NSDictionary *device in devices) {
        AudioDeviceID deviceID = [[device objectForKey:@"id"] intValue];
        if ([self getDeviceTransportTypeByID: deviceID] == kAudioDeviceTransportTypeBuiltIn) {
            return deviceID;
        }
    }
    return 0;
}

-(NSArray*)getAllOutputDevices{
    //Get device IDs
    UInt32 propsize;
    
    //Get devices memory address
    AudioObjectPropertyAddress theAddress = {
        kAudioHardwarePropertyDevices,
        kAudioObjectPropertyScopeGlobal,
        kAudioObjectPropertyElementMaster
        
    };
    AudioObjectGetPropertyDataSize(kAudioObjectSystemObject, &theAddress, 0, NULL,&propsize); //Get property size of each device
    int nDevices = propsize / sizeof(AudioDeviceID); //Calculate the number of devices
    AudioDeviceID *devids = new AudioDeviceID[nDevices]; //Allocate new AudioDeviceID array
    AudioObjectGetPropertyData(kAudioObjectSystemObject, &theAddress, 0, NULL, &propsize, devids); //Get the device IDs
    
    //Convert C++ array to NSArray
    NSMutableArray *deviceIDs = [[NSMutableArray alloc] init];
    
    for(int i = 0; i < nDevices; ++i){
        if ([self deviceIsOutput: devids[i]]) {
            NSString *deviceName = [NSString stringWithFormat:@"%@",[self getDeviceNameByID:devids[i]]];
            [deviceIDs addObject:@{@"id": [NSNumber numberWithInt:devids[i]], @"name": deviceName}];
        }
    }
    
    delete[] devids;
    return deviceIDs;
}

-(BOOL)deviceIsOutput:(AudioDeviceID)ID{
    AudioObjectPropertyAddress propAddress;
    propAddress = { kAudioDevicePropertyStreams, kAudioDevicePropertyScopeOutput, 0 };
    UInt32 dataSize = 0;
    AudioObjectGetPropertyDataSize(ID, &propAddress, 0, NULL, &dataSize);
    UInt32 streamCount = dataSize / sizeof(AudioStreamID);
    return (streamCount > 0);
}

-(UInt32)getDeviceTransportTypeByID:(AudioDeviceID)ID{
    AudioObjectPropertyAddress transportAddress = { kAudioDevicePropertyTransportType, kAudioObjectPropertyScopeGlobal, 0};
    UInt32 transportSize = sizeof(UInt32);
    UInt32 transportType = 0;
    AudioObjectGetPropertyData(ID, &transportAddress, 0, NULL, &transportSize, &transportType);
    return transportType;
}

-(void)switchToDeviceWithID:(AudioDeviceID)ID{
    AudioObjectPropertyAddress devAddress = { kAudioHardwarePropertyDefaultOutputDevice, kAudioObjectPropertyScopeGlobal, kAudioObjectPropertyElementMaster };
    AudioObjectSetPropertyData(kAudioObjectSystemObject, &devAddress, 0, NULL, sizeof(ID), &ID);
}


- (void)applicationWillTerminate:(NSNotification *)aNotification {
    // Insert code here to tear down your application
}


@end
