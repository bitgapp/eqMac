//
//  Defaults.h
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Storage : NSObject

typedef enum {
    kStorageShowDefaultPresets,
    kStorageShowVolumeHUD,
    kStoragePresets10Bands,
    kStoragePresets31Bands,
    kStorageAlreadyLaunched,
    kStorageOverallRuntime,
    kStorageLastRuntimeCheck,
    kStorageUUID,
    kStorageSelectedGains10Bands,
    kStorageSelectedGains31Bands,
    kStorageSelectedPresetName10Bands,
    kStorageSelectedPresetName31Bands,
    kStorageSelectedBandMode
} StorageKey;

+(id)get:(StorageKey)key;
+(void)set:(id)object key:(StorageKey)key;
@end
