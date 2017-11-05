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

// PRIVATE
+(id)get:(NSString*)key{
    return [[NSUserDefaults standardUserDefaults] objectForKey: key];
}
+(void)set:(id)object key:(NSString*)key{
    [[NSUserDefaults standardUserDefaults] setObject:object forKey:key];
}

+(NSString*)getShowDefaultPresetsKey{
    return @"kStorageShowDefaultPresets";
}

+(NSString*)getShowVolumeHUDKey{
    return @"kStorageShowVolumeHUD";
}

+(NSString*)getSelectedBandModeKey{
    return @"kStorageSelectedBandMode";
}

+(NSString*)getUserPresetsKey{
    return [[self getSelectedBandMode] intValue] == 10 ? @"kStoragePresets10Bands" : @"kStoragePresets31Bands";
}

+(NSString*)getAppAlreadyLaunchedBeforeKey{
    return @"SUHasLaunchedBefore";
}

+(NSString*)getUUIDKey{
    return @"kStorageUUID";
}

// PUBLIC

// Show Default Presets
+(void)setShowDefaultPresets:(BOOL)show{
    [self set: [NSNumber numberWithBool:show] key: [self getShowDefaultPresetsKey]];
}

+(BOOL)getShowDefaultPresets{
    return [[self get: [self getShowDefaultPresetsKey]] boolValue];
}

// Show Volume HUD
+(void)setShowVolumeHUD:(BOOL)show{
    [self set: [NSNumber numberWithBool:show] key: [self getShowVolumeHUDKey]];
}
+(BOOL)getShowVolumeHUD{
    return [[self get: [self getShowVolumeHUDKey]] boolValue];
}

// Selected Band Mode
+(void)setSelectedBandMode:(NSNumber*)bandMode{
    [self set: bandMode key: [self getSelectedBandModeKey]];
}

+(NSNumber*)getSelectedBandMode{
    NSNumber *selectedBandMode = [self get: [self getSelectedBandModeKey]];
    if (!selectedBandMode) {
        [self setSelectedBandMode:@10];
        return [self getSelectedBandMode];
    }
    return selectedBandMode;
}

// Presets

+(NSDictionary*)getDefaultPresets{
    NSMutableDictionary *defaultPresets = [[NSMutableDictionary alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"defaultPresets" ofType:@"plist"]];
    NSMutableDictionary* result = [[NSMutableDictionary alloc] init];
    for(NSString* key in defaultPresets){
        [result setObject:[defaultPresets objectForKey:key] forKey:NSLocalizedString(key, nil)];
    }
    return result;
}

+(NSDictionary*)getUserPresets{
    NSDictionary *userPresets = [self get: [self getUserPresetsKey]];
    if (!userPresets) {
        [self setUserPresets: @{}];
        return [self getUserPresets];
    }
    return userPresets;
}

+(void)setUserPresets:(NSDictionary*)userPresets{
    [self set:userPresets key: [self getUserPresetsKey]];
}

+(NSDictionary*)getPresets{
    NSMutableDictionary *presets = [@{} mutableCopy];
    BOOL showDefaultPresets = [[self getSelectedBandMode] intValue] == 10 ? [self getShowDefaultPresets] : false;
    if (showDefaultPresets) [presets addEntriesFromDictionary: [self getDefaultPresets]];
    [presets addEntriesFromDictionary: [self getUserPresets]];
    return presets;
}

+(NSArray*)getPresetsNames{
    return [[self getPresets] allKeys];
}

+(NSArray*)getGainsForPresetName:(NSString*)presetName{
    NSArray *gains = [[[self getPresets] objectForKey: presetName] objectForKey:@"gains"];
    if (!gains) {
        NSLog(@"Could not find Preset gains for Preset Name: %@", presetName);
        NSMutableArray *gains = [@[] mutableCopy];
        for (int i = 0; i < [[self getSelectedBandMode] intValue]; i++)
            [gains addObject:@0];
    }
    return gains;
}

+(void)savePresetWithName:(NSString*)name andGains:(NSArray*)gains{
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets setObject: @{ @"gains": gains, @"default" : @NO } forKey: name];
    [self setUserPresets: userPresets];
}
+(void)deletePresetWithName:(NSString*)name{
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets removeObjectForKey: name];
    [self setUserPresets: userPresets];
}

//kStorageAlreadyLaunched,
+(BOOL)getAppAlreadyLaunchedBefore{
    return [[self get: [self getAppAlreadyLaunchedBeforeKey]] boolValue];
}

// UUID
+(NSString*)getUUID{
    
}

//kStorageSelectedGains10Bands,
//kStorageSelectedGains31Bands,
+(NSArray*)getSelectedGains{
    
}

//kStorageSelectedPresetName10Bands,
//kStorageSelectedPresetName31Bands,
+(NSString*)getSelectedPresetName{
    
}

@end
