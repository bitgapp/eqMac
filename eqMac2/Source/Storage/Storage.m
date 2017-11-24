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
    return [[self getSelectedBandMode] intValue] == 10 ? @"kStoragePresets" : @"kStoragePresets31Bands";
}

+(NSString*)getSelectedPresetNameKey{
    return [[self getSelectedBandMode] intValue] == 10 ? @"kStorageSelectedPresetName" : @"kStorageSelectedPresetName31Bands";
}

+(NSString*)getSelectedGainsKey{
    return [[self getSelectedBandMode] intValue] == 10 ? @"kStorageSelectedGains" : @"kStorageSelectedGains31Bands";
}

+(NSString*)getAppAlreadyLaunchedBeforeKey{
    return @"SUHasLaunchedBefore";
}

+(NSString*)getUUIDKey{
    return @"kStorageUUID";
}

+(NSString*)getStashedVolumeKey{
    return @"kStorageStashedVolume";
}

// PUBLIC

// Show Default Presets
+(void)setShowDefaultPresets:(BOOL)show{
    [Logger log: [NSString stringWithFormat: @"Storage: setting show default presets to %hhd", show]];
    [self set: [NSNumber numberWithBool:show] key: [self getShowDefaultPresetsKey]];
}

+(BOOL)getShowDefaultPresets{
    NSNumber *showDefaultPresets = [self get: [self getShowDefaultPresetsKey]];
    if (!showDefaultPresets) {
        showDefaultPresets = @NO;
        [self setShowDefaultPresets: showDefaultPresets.boolValue];
    }
    return [showDefaultPresets boolValue];
}

// Show Volume HUD
+(void)setShowVolumeHUD:(BOOL)show{
    [Logger log: [NSString stringWithFormat: @"Storage: setting show volume hud to %hhd", show]];
    [self set: [NSNumber numberWithBool:show] key: [self getShowVolumeHUDKey]];
}
+(BOOL)getShowVolumeHUD{
    NSNumber *showVolumeHUD = [self get: [self getShowVolumeHUDKey]];
    if (!showVolumeHUD) {
        showVolumeHUD = @YES;
        [self setShowVolumeHUD: showVolumeHUD.boolValue];
    }
    return [showVolumeHUD boolValue];
}

// Selected Band Mode
+(void)setSelectedBandMode:(NSNumber*)bandMode{
    [Logger log: [NSString stringWithFormat: @"Storage: setting band mode to %@", bandMode]];
    [self set: bandMode key: [self getSelectedBandModeKey]];
}

+(NSNumber*)getSelectedBandMode{
    NSNumber *selectedBandMode = [self get: [self getSelectedBandModeKey]];
    [Logger log: [NSString stringWithFormat: @"Storage: selected band mode: %@", selectedBandMode]];
    if (!selectedBandMode) {
        selectedBandMode = @10;
        [self setSelectedBandMode: selectedBandMode];
    }
    return selectedBandMode;
}

// Presets
+(NSDictionary*)getDefaultPresets{
    NSMutableDictionary *defaultPresets = [[NSMutableDictionary alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"defaultPresets" ofType:@"plist"]];
    NSMutableDictionary* result = [[NSMutableDictionary alloc] init];
    for(NSString* key in defaultPresets){
        [result setObject:[defaultPresets objectForKey:key] forKey:key];
    }
    return result;
}

+(NSDictionary*)getUserPresets{
    NSDictionary *userPresets = [self get: [self getUserPresetsKey]];
    if (!userPresets) {
        userPresets = @{};
        [self setUserPresets: userPresets];
    }
    NSLog(@"%@", userPresets);
    return userPresets;
}

+(void)setUserPresets:(NSDictionary*)userPresets{
    [self set:userPresets key: [self getUserPresetsKey]];
}

+(NSDictionary*)getPresets{
    int bandMode = [[self getSelectedBandMode] intValue];
    NSMutableDictionary *presets = [@{} mutableCopy];
    BOOL showDefaultPresets = bandMode == 10 ? [self getShowDefaultPresets] : false;
    if (showDefaultPresets) [presets addEntriesFromDictionary: [self getDefaultPresets]];
    [presets addEntriesFromDictionary: [self getUserPresets]];
    NSMutableArray *flatGains = [@[] mutableCopy];
    for (int i = 0; i < bandMode; i++) [flatGains addObject:@0];
    [presets setObject:@{ @"gains": flatGains } forKey: @"Flat"];
    return presets;
}

+(NSArray*)getPresetsNames{
    return [[self getPresets] allKeys];
}

+(void)savePresetWithName:(NSString*)name andGains:(NSArray*)gains{
    [Logger log: [NSString stringWithFormat: @"Storage: saving preset with name: %@ and gains: %@", name, gains]];
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets setObject: @{ @"gains": gains, @"default" : @NO } forKey: name];
    [self setUserPresets: userPresets];
}
+(void)deletePresetWithName:(NSString*)name{
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets removeObjectForKey: name];
    [self setUserPresets: userPresets];
}

// Preset Gains
+(NSArray*)getGainsForPresetName:(NSString*)presetName{
    NSArray *gains = [[[self getPresets] objectForKey: presetName] objectForKey:@"gains"];
    if (!gains) {
        [Logger error: [NSString stringWithFormat: @"Storage: Could not find Preset gains for Preset Name: %@", presetName]];
        NSMutableArray *gains = [@[] mutableCopy];
        for (int i = 0; i < [[self getSelectedBandMode] intValue]; i++)
            [gains addObject:@0];
    }
    return gains;
}

// Selected Preset Name
+(NSString*)getSelectedPresetName{
    NSString *selectedPresetName = [self get: [self getSelectedPresetNameKey]];
    if (!selectedPresetName) {
        selectedPresetName = @"Flat";
        [self setSelectedPresetName: selectedPresetName];
    }
    return selectedPresetName;
}

+(void)setSelectedPresetName:(NSString*)presetName{
    [Logger log: [NSString stringWithFormat: @"Storage: setting selected preset name to: %@", presetName]];
    return [self set: presetName key: [self getSelectedPresetNameKey]];
}


+(NSArray*)getSelectedGains{
    NSArray *gains = [self get: [self getSelectedGainsKey]];
    [Logger log: [NSString stringWithFormat: @"Storage: selected gains: %@", gains]];
    if (!gains) {
        NSMutableArray *gains = [@[] mutableCopy];
        for (int i = 0; i < [[self getSelectedBandMode] intValue]; i++)
            [gains addObject:@0];
        [self setSelectedGains: gains];
    }
    return gains;
}

+(void)setSelectedGains:(NSArray*) gains{
    [Logger log: [NSString stringWithFormat: @"Storage: setting selected gains to: %@", gains]];
    [self set: gains key: [self getSelectedGainsKey]];
}


//kStorageAlreadyLaunched,
+(BOOL)getAppAlreadyLaunchedBefore{
    return [[self get: [self getAppAlreadyLaunchedBeforeKey]] boolValue];
}

//UUID
+(NSString*)getUUID{
    NSString *uuid = [self get: [self getUUIDKey]];
    if(!uuid){
        uuid = [[NSUUID UUID] UUIDString];;
        [self set: uuid key: [self getUUIDKey]];
    }
    return uuid;
}


// Stashed Volume

+(void)setStashedVolume:(Float32)volume{
    [self set: [NSNumber numberWithFloat:volume] key: [self getStashedVolumeKey]];
}

+(Float32)getStashedVolume{
    return [[self get: [self getStashedVolumeKey]] floatValue];
}



@end
