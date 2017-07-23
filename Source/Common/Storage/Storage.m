//
//  Defaults.m
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "Storage.h"
#import "Constants.h"

static NSUserDefaults *defaults;

@implementation Storage

+(id)get:(StorageKey)key{
    [[NSUserDefaults standardUserDefaults] synchronize];
    return [[NSUserDefaults standardUserDefaults] objectForKey:[self convertKey:key]];
}

+(void)set:(id)object key:(StorageKey)key{
    [[NSUserDefaults standardUserDefaults] setObject:object forKey:[self convertKey:key]];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+(NSString*)convertKey:(StorageKey)key{
    switch(key){
        case kStorageShowDefaultPresets: return @"kStorageShowDefaultPresets";
        case kStoragePresets: return @"kStoragePresets";
        case kStorageAlreadyLaunched: return @"kStorageAlreadyLaunched";
        case kStorageOverallRuntime: return @"kStorageOverallRuntime";
        case kStorageLastRuntimeCheck: return @"kStorageLastRuntimeCheck";
        case kStorageUUID: return @"kStorageUUID";
        case kStorageSelectedGains: return @"kStorageSelectedGains";
        case kStorageSelectedPresetName: return @"kStorageSelectedPresetName";
            
        default: return @"temp";
    }
}
@end
