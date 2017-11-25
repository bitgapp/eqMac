//
//  Defaults.m
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "Storage.h"
#import "Constants.h"

@implementation Storage

static NSString* appAlreadyLaunchedBeforeKey = @"SUHasLaunchedBefore";
static NSString* UUIDKey = @"kStorageUUID";
static NSString* showDefaultPresetsKey =  @"kStorageShowDefaultPresets";
static NSString* selectedBandModeKey = @"kStorageSelectedBandMode";
static NSString* userPresets10BandsKey = @"kStoragePresets";
static NSString* userPresets31BandsKey = @"kStoragePresets31Bands";
static NSString* selectedPresetName10BandsKey = @"kStorageSelectedPresetName";
static NSString* selectedPresetName31BandsKey = @"kStorageSelectedPresetName31Bands";
static NSString* selectedGains10BandsKey = @"kStorageSelectedGains";
static NSString* selectedGains31BandsKey = @"kStorageSelectedGains31Bands";
static NSString* selectedCustomGains10BandsKey = @"kStorageSelectedCustomGains";
static NSString* selectedCustomGains31BandsKey = @"kStorageSelectedCustomGains31Bands";

static NSArray* defaultFlatGains10Bands;
static NSArray* defaultFlatGains31Bands;

static BOOL appAlreadyLaunchedBefore;
static NSString* UUID;
static BOOL showDefaultPresets;
static NSNumber* selectedBandMode;
static NSDictionary* userPresets10Bands;
static NSDictionary* userPresets31Bands;
static NSString* selectedPresetName10Bands;
static NSString* selectedPresetName31Bands;
static NSArray* selectedGains10Bands;
static NSArray* selectedGains31Bands;
static NSArray* selectedCustomGains10Bands;
static NSArray* selectedCustomGains31Bands;

+(id)get:(NSString*)key{
    return [[NSUserDefaults standardUserDefaults] objectForKey: key];
}
+(void)set:(id)object key:(NSString*)key{
    [[NSUserDefaults standardUserDefaults] setObject:object forKey:key];
}

+(void)load{
    [[NSUserDefaults standardUserDefaults] synchronize];
    defaultFlatGains10Bands = @[@0,@0,@0,@0,@0,@0,@0,@0,@0,@0];
    defaultFlatGains31Bands = @[@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0,@0];
    
    // appAlreadyLaunchedBefore
    NSNumber* appAlreadyLaunchedBeforeNumber = [self get: appAlreadyLaunchedBeforeKey];
    if (appAlreadyLaunchedBeforeNumber == nil){
        appAlreadyLaunchedBeforeNumber = @NO;
    }
    appAlreadyLaunchedBefore = [appAlreadyLaunchedBeforeNumber boolValue];
    
    // UUID
    UUID = [self get: UUIDKey];
    if(UUID == nil){
        UUID = [[NSUUID UUID] UUIDString];
    }
    
    // showDefaultPresets
    NSNumber* showDefaultPresetsNumber = [self get: showDefaultPresetsKey];
    if (showDefaultPresetsNumber == nil){
        showDefaultPresetsNumber = @NO;
    }
    showDefaultPresets = [showDefaultPresetsNumber boolValue];
    
    // selectedBandMode
    selectedBandMode = [self get: selectedBandModeKey];
    if (selectedBandMode == nil) selectedBandMode = @10;
    
    //userPresets10Bands;
    userPresets10Bands = [self get: userPresets10BandsKey];
    if (userPresets10Bands == nil) userPresets10Bands = @{};
    
    //userPresets31Bands;
    userPresets31Bands = [self get: userPresets31BandsKey];
    if (userPresets31Bands == nil) userPresets31Bands = @{};
    
    //selectedPresetName10Bands;
    selectedPresetName10Bands = [self get: selectedPresetName10BandsKey];
    if (selectedPresetName10Bands == nil) selectedPresetName10Bands = @"Flat";
    
    //selectedPresetName31Bands;
    selectedPresetName31Bands = [self get: selectedPresetName31BandsKey];
    if (selectedPresetName31Bands == nil) selectedPresetName31Bands = @"Flat";
    
    //selectedGains10Bands;
    selectedGains10Bands = [self get: selectedGains10BandsKey];
    if (selectedGains10Bands == nil) selectedGains10Bands = [defaultFlatGains10Bands copy];
    
    //selectedGains10Bands;
    selectedGains31Bands = [self get: selectedGains31BandsKey];
    if (selectedGains31Bands == nil) selectedGains31Bands = [defaultFlatGains31Bands copy];
    
    //selectedCustomGains10Bands;
    selectedCustomGains10Bands = [self get: selectedCustomGains10BandsKey];
    if (selectedCustomGains10Bands == nil) selectedCustomGains10Bands = [defaultFlatGains10Bands copy];
    
    //selectedCustomGains10Bands;
    selectedCustomGains31Bands = [self get: selectedCustomGains31BandsKey];
    if (selectedCustomGains31Bands == nil) selectedCustomGains31Bands = [defaultFlatGains31Bands copy];
    [self save];
}

+(void)save{
    [self set: UUID key: UUIDKey];
    [self set: [NSNumber numberWithBool: showDefaultPresets] key: showDefaultPresetsKey];
    [self set: selectedBandMode key: selectedBandModeKey];
    [self set: userPresets10Bands key: userPresets10BandsKey];
    [self set: userPresets31Bands key: userPresets31BandsKey];
    [self set: selectedPresetName10Bands key: selectedPresetName10BandsKey];
    [self set: selectedPresetName31Bands key: selectedPresetName31BandsKey];
    [self set: selectedGains10Bands key: selectedGains10BandsKey];
    [self set: selectedGains31Bands key: selectedGains31BandsKey];
    [self set: selectedCustomGains10Bands key: selectedCustomGains10BandsKey];
    [self set: selectedCustomGains31Bands key: selectedCustomGains31BandsKey];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

//kStorageAlreadyLaunched,
+(BOOL)getAppAlreadyLaunchedBefore{
    return appAlreadyLaunchedBefore;
}

//UUID
+(NSString*)getUUID{
    return UUID;
}

// Show Default Presets
+(void)setShowDefaultPresets:(BOOL)show{
    showDefaultPresets = show;
}

+(BOOL)getShowDefaultPresets{
    return showDefaultPresets;
}

// Selected Band Mode
+(void)setSelectedBandMode:(NSNumber*)mode{
    selectedBandMode = mode;
}

+(NSNumber*)getSelectedBandMode{
    return selectedBandMode;
}


// Selected Preset Name
+(NSString*)getSelectedPresetName{
    return [selectedBandMode intValue] == 10 ? selectedPresetName10Bands : selectedPresetName31Bands;
}

+(void)setSelectedPresetName:(NSString*)presetName{
    if ([selectedBandMode intValue] == 10){
        selectedPresetName10Bands = presetName;
    } else {
        selectedPresetName31Bands = presetName;
    }
}


+(NSArray*)getSelectedGains{
    return [selectedBandMode intValue] == 10 ? selectedGains10Bands : selectedGains31Bands;
}

+(void)setSelectedGains:(NSArray*)gains{
    if ([selectedBandMode intValue] == 10){
        selectedGains10Bands = gains;
    } else {
        selectedGains31Bands = gains;
    }
}

+(NSArray*)getFlatGains{
    return [selectedBandMode intValue] == 10 ? defaultFlatGains10Bands : defaultFlatGains31Bands;
}

+(NSArray*)getSelectedCustomGains{
    return [selectedBandMode intValue] == 10 ? selectedCustomGains10Bands : selectedCustomGains31Bands;
}

+(void)setSelectedCustomGains:(NSArray*)customGains{
    if ([selectedBandMode intValue] == 10){
        selectedCustomGains10Bands = customGains;
    } else {
        selectedCustomGains31Bands = customGains;
    }
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
    return [selectedBandMode intValue] == 10 ? userPresets10Bands : userPresets31Bands;
}

+(void)setUserPresets:(NSDictionary*)presets{
    if ([selectedBandMode intValue] == 10) {
        userPresets10Bands = presets;
    } else {
        userPresets31Bands = presets;
    }
}
+(NSDictionary*)getPresets{
    int bandMode = [[self getSelectedBandMode] intValue];
    NSMutableDictionary *presets = [@{} mutableCopy];
    BOOL showDefaultPresets = bandMode == 10 ? [self getShowDefaultPresets] : false;
    if (showDefaultPresets) [presets addEntriesFromDictionary: [self getDefaultPresets]];
    [presets addEntriesFromDictionary: [self getUserPresets]];
    [presets setObject: [self getFlatGains] forKey:@"Flat"];
    [presets setObject: [self getSelectedCustomGains] forKey:@"Custom"];
    return presets;
}

+(NSArray*)getPresetsNames{
    return [[self getPresets] allKeys];
}

+(void)savePresetWithName:(NSString*)name andGains:(NSArray*)gains{
    [Logger log: [NSString stringWithFormat: @"Storage: saving preset with name: %@ and gains: %@", name, gains]];
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets setObject: @{ @"gains": gains, @"default" : @NO } forKey: name];
    [self setUserPresets:userPresets];
}
+(void)deletePresetWithName:(NSString*)name{
    NSMutableDictionary *userPresets = [[self getUserPresets] mutableCopy];
    [userPresets removeObjectForKey: name];
    [self setUserPresets: userPresets];
}

// Preset Gains
+(NSArray*)getGainsForPresetName:(NSString*)presetName{
    if ([presetName isEqualToString:@"Custom"]) return [self getSelectedCustomGains];
    if ([presetName isEqualToString:@"Flat"]) return [self getFlatGains];
    NSArray *gains = [[[self getPresets] objectForKey: presetName] objectForKey:@"gains"];
    if (gains == nil) {
        [Logger error: [NSString stringWithFormat: @"Storage: Could not find Preset gains for Preset Name: %@", presetName]];
        NSMutableArray *gains = [@[] mutableCopy];
        for (int i = 0; i < [[self getSelectedBandMode] intValue]; i++)
            [gains addObject:@0];
    }
    return gains;
}




@end
