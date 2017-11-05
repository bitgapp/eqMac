//
//  Utilities.h
//  eqMac
//
//  Created by Romans Kisils on 11/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "STPrivilegedTask.h"
#import "Storage.h"


@interface Utilities : NSObject
+(BOOL)runShellScriptWithName:(NSString*)scriptName;
+(NSImage *)flipImage:(NSImage *)image;
+(NSString*)generateRandString;
+(CGFloat)mapValue:(CGFloat) x withInMin:(CGFloat) in_min InMax:(CGFloat) in_max OutMin:(CGFloat) out_min OutMax:(CGFloat) out_max;
+(NSString*)getOSXVersion;
+(NSString*)getMacModel;
+(NSString*)getAppVersion;
+(NSModalResponse)showAlertWithTitle:(NSString*) title andMessage:(NSString *)message andButtons:(NSArray*)buttons;
+(NSString*)showAlertWithInputAndTitle:(NSString*) title;
+(void)openBrowserWithURL:(NSString*)url;
+(BOOL)isDarkMode;
+(void)executeBlock:(void(^)(void))block after:(CGFloat)seconds;
+(NSTimer *)executeBlock:(void(^)(void))block every:(CGFloat)seconds;
+ (BOOL)launchOnLogin;
+ (void)setLaunchOnLogin:(BOOL)launchOnLogin;
+(NSArray*)orderedStringArrayFromStringArray:(NSArray*)stringArray;
@end
