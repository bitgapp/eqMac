//
//  Presets.m
//  eqMac2
//
//  Created by Romans Kisils on 08/05/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "Presets.h"

@implementation Presets

+(void)setupPresets{
    if(![Storage get: kStoragePresets] || DEBUGGING){
        NSMutableDictionary *defaultPresets = [[NSMutableDictionary alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"defaultPresets" ofType:@"plist"]];
        [Storage set:defaultPresets key: kStoragePresets];
    }
    
    if(![Storage get: kStorageShowDefaultPresets]){
        [Storage set:[NSNumber numberWithBool:NO] key: kStorageShowDefaultPresets];
    }
}

+(NSArray*)getPresets{
    NSMutableDictionary *allPresets = [[Storage get: kStoragePresets] mutableCopy];
    
    if([self getShowDefaultPresets]){
        return [allPresets allKeys];
    }
    
    NSMutableArray *result = [[NSMutableArray alloc] init];
    
    for(NSString *presetName in allPresets){
        NSDictionary *preset = [allPresets objectForKey:presetName];
        if(![[preset objectForKey:@"default"] boolValue]){
            [result addObject:presetName];
        }
    }
    return result;
}

+(NSDictionary*)getUserPresets{
    NSMutableDictionary *userPresets = [[NSMutableDictionary alloc] init];
    NSDictionary *allPresets = [Storage get: kStoragePresets];
    for(NSString *presetName in allPresets){
        NSDictionary *preset = [allPresets objectForKey:presetName];
        if(![[preset objectForKey:@"default"] boolValue]){
            [userPresets setObject:[preset objectForKey:@"gains"] forKey:presetName];
        }
    }
    [userPresets removeObjectForKey:@"Flat"];
    return userPresets;
}

+(NSArray*)getGainsForPreset:(NSString*)preset{
    return [[[Storage get: kStoragePresets] objectForKey:preset] objectForKey:@"gains"];
}


+(void)savePreset:(NSArray*)gains withName:(NSString*)name{
    NSMutableDictionary *newPreset = [[NSMutableDictionary alloc] init];
    [newPreset setObject:[NSNumber numberWithBool:NO] forKey:@"default"];
    [newPreset setObject:gains forKey:@"gains"];
    NSMutableDictionary *presets = [[Storage get: kStoragePresets] mutableCopy];
    [presets setObject:newPreset forKey:name];
    [Storage set:presets key: kStoragePresets];
}

+(void)deletePresetWithName:(NSString*)name{
    NSMutableDictionary *allPresets = [[Storage get: kStoragePresets] mutableCopy];
    [allPresets removeObjectForKey:name];
    [Storage set:allPresets key: kStoragePresets];
}

+(void)setShowDefaultPresets:(BOOL)condition{
    [Storage set:[NSNumber numberWithBool:condition] key: kStorageShowDefaultPresets];
}

+(BOOL)getShowDefaultPresets{
    return [[Storage get: kStorageShowDefaultPresets] boolValue];
}

@end
