//
//  Presets.h
//  eqMac2
//
//  Created by Romans Kisils on 08/05/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Storage.h"
#import "Constants.h"

@interface Presets : NSObject

+(void)setShowDefaultPresets:(BOOL)condition;
+(BOOL)getShowDefaultPresets;

+(NSDictionary*)getDefaultPresets;
+(NSArray*)getDefaultPresetsNames;
+(NSDictionary*)getUserPresets;
+(NSArray*)getUserPresetsNames;
+(NSDictionary*)getAllPresets;
+(NSArray*)getAllPresetsNames;
+(NSArray*)getShowablePresetsNames;

+(NSArray*)getGainsForPreset:(NSString*)preset;
+(void)savePreset:(NSArray*)gains withName:(NSString*)name;
+(void)deletePresetWithName:(NSString*)name;

@end
