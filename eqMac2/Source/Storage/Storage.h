//
//  Defaults.h
//  eqMac
//
//  Created by Romans Kisils on 12/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Storage : NSObject

+(void)setShowDefaultPresets:(BOOL)show;
+(BOOL)getShowDefaultPresets;

+(void)setShowVolumeHUD:(BOOL)show;
+(BOOL)getShowVolumeHUD;


+(NSArray*)getPresetsNames;
+(void)savePresetWithName:(NSString*)name andGains:(NSArray*)gains;
+(void)deletePresetWithName:(NSString*)name;

+(BOOL)getAppAlreadyLaunchedBefore;

+(NSString*)getUUID;

+(NSArray*)getSelectedGains;
+(void)setSelectedGains:(NSArray*)gains;

+(NSString*)getSelectedPresetName;
+(void)setSelectedPresetName:(NSString*)name;

+(NSNumber*)getSelectedBandMode;
+(void)setSelectedBandMode:(NSNumber*)bandMode;

@end
