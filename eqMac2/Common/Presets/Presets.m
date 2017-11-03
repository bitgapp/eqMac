 //
//  Presets.m
//  eqMac2
//
//  Created by Romans Kisils on 08/05/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "Presets.h"

@implementation Presets


+(NSDictionary*)getDefaultPresets{
     NSMutableDictionary *defaultPresets = [[NSMutableDictionary alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"defaultPresets" ofType:@"plist"]];
    NSMutableDictionary* result = [[NSMutableDictionary alloc] init];
    for(id key in defaultPresets)
    {
        [result setObject:[defaultPresets objectForKey:key] forKey:NSLocalizedString(key, nil)];
    }
    return result;

}

+(NSArray*)getDefaultPresetsNames{
    return [[[self getDefaultPresets] allKeys] sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
}

+(NSDictionary*)getUserPresets{
    StorageKey presetStorageKey = [[Storage get: kStorageSelectedBandMode] intValue] == 10 ? kStoragePresets10Bands : kStoragePresets31Bands;
    NSDictionary *userPresets = [Storage get: presetStorageKey];
    if(!userPresets) {
        userPresets = @{};
        [Storage set:userPresets key: presetStorageKey];
    }
    return userPresets;
}

+(NSArray*)getUserPresetsNames{
    return [[[self getUserPresets] allKeys] sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
}

+(NSDictionary*)getAllPresets{
    NSMutableDictionary *defaultPresets = [[self getDefaultPresets] mutableCopy];
    [defaultPresets addEntriesFromDictionary:[self getUserPresets]];
    return defaultPresets;
}

+(NSArray*)getAllPresetsNames{
    return [[[self getDefaultPresetsNames] arrayByAddingObjectsFromArray:[self getUserPresetsNames]] sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
}

+(NSArray*)getShowablePresetsNames{
    NSDictionary *allPresets = [self getAllPresets];
    NSMutableArray *showablePresetsNames = [[NSMutableArray alloc] init];

    BOOL showDefaults = [[Storage get: kStorageSelectedBandMode] intValue] == 10 ? [self getShowDefaultPresets] : NO;
    
    for(NSString *presetName in [allPresets allKeys]){
        NSDictionary *preset = [allPresets objectForKey:presetName];
        if(![[preset objectForKey:@"default"] boolValue] || showDefaults)
            [showablePresetsNames addObject:presetName];
    }
    return [showablePresetsNames sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
}

+(NSArray*)getGainsForPreset:(NSString*)preset{
    return [[[self getAllPresets] objectForKey:preset] objectForKey:@"gains"];
}


+(void)savePreset:(NSArray*)gains withName:(NSString*)name{
    NSMutableDictionary *newPreset = [[NSMutableDictionary alloc] init];
    [newPreset setObject:[NSNumber numberWithBool:NO] forKey:@"default"];
    [newPreset setObject:gains forKey:@"gains"];
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets setObject:newPreset forKey:name];
    StorageKey presetStorageKey = [[Storage get: kStorageSelectedBandMode] intValue] == 10 ? kStoragePresets10Bands : kStoragePresets31Bands;

    [Storage set:userPresets key: presetStorageKey];
}

+(void)deletePresetWithName:(NSString*)name{
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets removeObjectForKey:name];
    StorageKey presetStorageKey = [[Storage get: kStorageSelectedBandMode] intValue] == 10 ? kStoragePresets10Bands : kStoragePresets31Bands;
    [Storage set:userPresets key: presetStorageKey];
}

+(void)setShowDefaultPresets:(BOOL)condition{
    [Storage set:[NSNumber numberWithBool:condition] key: kStorageShowDefaultPresets];
}

+(BOOL)getShowDefaultPresets{
    return [[Storage get: kStorageShowDefaultPresets] boolValue];
}

@end
