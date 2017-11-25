//
//  Defaults.h
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Logger.h"

@interface Storage : NSObject

+(void)load;
+(void)save;

+(id)get:(NSString*)key;
+(void)set:(id)object key:(NSString*)key;

+(void)setShowDefaultPresets:(BOOL)show;
+(BOOL)getShowDefaultPresets;

+(NSArray*)getSelectedGains;
+(void)setSelectedGains:(NSArray*)gains;
+(void)setSelectedCustomGains:(NSArray*)customGains;

+(NSString*)getSelectedPresetName;
+(void)setSelectedPresetName:(NSString*)name;

+(NSNumber*)getSelectedBandMode;
+(void)setSelectedBandMode:(NSNumber*)bandMode;

+(BOOL)getAppAlreadyLaunchedBefore;
+(NSString*)getUUID;

+(NSArray*)getPresetsNames;
+(void)savePresetWithName:(NSString*)name andGains:(NSArray*)gains;
+(void)deletePresetWithName:(NSString*)name;

+(NSArray*)getGainsForPresetName:(NSString*)presetName;

@end
