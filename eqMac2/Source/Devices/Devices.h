//
//  Devices.h
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#define checkErr( err) \
if(err) {\
OSStatus error = static_cast<OSStatus>(err);\
fprintf(stdout, "EQEngine Error: %ld ->  %s:  %d\n",  (long)error,\
__FILE__, \
__LINE__\
);\
fflush(stdout);\
return err; \
}

#import <Foundation/Foundation.h>
#import "AudioDevice.h"
#import "Constants.h"
#import "Utilities.h"
#import "EQHost.h"
@interface Devices : NSObject

+(NSArray*)getAllDevices;
+(NSArray*)getAllUsableDevices;

+(AudioDeviceID)getCurrentDeviceID;
+(AudioDeviceID)getEQMacDeviceID;
+(AudioDeviceID)getBuiltInDeviceID;
+(AudioDeviceID)getVolumeControllerDeviceID;

+(void)switchToDeviceWithID:(AudioDeviceID)ID;

+(NSString*)getDeviceNameByID:(UInt32)ID;
+(Float32)getVolumeForDeviceID:(AudioDeviceID)ID;
+(Float32)getBalanceForDeviceID:(AudioDeviceID)ID;
+(BOOL)getIsMutedForDeviceID:(AudioDeviceID)ID;
+(BOOL)getIsAliveForDeviceID:(AudioDeviceID)ID;
+(UInt32)getDeviceTransportTypeByID:(AudioDeviceID)ID;
+(AudioDeviceID)getDeviceIDByName:(NSString*)name;

+(BOOL)audioDeviceHasVolumeControls:(AudioDeviceID)ID;
+(void)setVolumeForDevice:(AudioDeviceID)ID to:(Float32)volume;
+(void)setBalanceForDevice:(AudioDeviceID)ID to:(Float32)balance;
+(void)setDevice:(AudioDeviceID)ID toMuted:(BOOL)condition;

+(BOOL)eqMacDriverInstalled;
+(BOOL)deviceIsBuiltIn:(AudioDeviceID)ID;
@end
