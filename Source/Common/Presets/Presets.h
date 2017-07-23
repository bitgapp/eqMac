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
+(void)setupPresets;

+(void)setShowDefaultPresets:(BOOL)condition;
+(BOOL)getShowDefaultPresets;

+(NSArray*)getPresets;
+(NSDictionary*)getUserPresets;
+(NSArray*)getGainsForPreset:(NSString*)preset;
+(void)savePreset:(NSArray*)gains withName:(NSString*)name;
+(void)deletePresetWithName:(NSString*)name;

@end
