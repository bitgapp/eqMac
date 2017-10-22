//
//  Utilities.m
//  eqMac
//
//  Created by Romans Kisils on 11/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "Utilities.h"
#import <IOKit/IOKitLib.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/sysctl.h>
#import <CommonCrypto/CommonDigest.h>

@implementation Utilities

+(BOOL)runShellScriptWithName:(NSString*)scriptName{
    NSString *resourcePath = [[NSBundle bundleForClass:[self class]] resourcePath];
    NSString *scriptExtension = @"sh";
    NSString *scriptAbsolutePath = [NSString stringWithFormat:@"%@/%@.%@", resourcePath, scriptName, scriptExtension];
    NSArray *argv = [NSArray arrayWithObjects:nil];
    
    STPrivilegedTask *task = [[STPrivilegedTask alloc] init];
    [task setLaunchPath:scriptAbsolutePath];
    NSLog(@"%@", scriptAbsolutePath);
    [task setArguments:argv];
    OSStatus err = [task launch];
    [task waitUntilExit];
    return err == errAuthorizationSuccess;
}

+(NSString*)generateUUID{
    return [[NSUUID UUID] UUIDString];
}

+ (NSImage *)flipImage:(NSImage *)image
{
    NSImage *existingImage = image;
    NSSize existingSize = [existingImage size];
    NSSize newSize = NSMakeSize(existingSize.width, existingSize.height);
    NSImage *flipedImage = [[NSImage alloc] initWithSize:newSize];
    
    [flipedImage lockFocus];
    [[NSGraphicsContext currentContext] setImageInterpolation:NSImageInterpolationHigh];
    
    NSAffineTransform *t = [NSAffineTransform transform];
    [t translateXBy:existingSize.width yBy:existingSize.height];
    [t scaleXBy:-1 yBy:-1];
    [t concat];
    
    [existingImage drawAtPoint:NSZeroPoint fromRect:NSMakeRect(0, 0, newSize.width, newSize.height) operation:NSCompositeSourceOver fraction:1.0];
    
    [flipedImage unlockFocus];
    
    return flipedImage;
}


+ (NSString *)getUUID{
    NSString *existingUUID = [Storage get:kStorageUUID];
    if(!existingUUID){
        NSString *newUUID = [self generateUUID];
        [Storage set:newUUID key:kStorageUUID];
        return newUUID;
    }else{
        return existingUUID;
    }
}

+(NSString*)getOSXVersion{
    NSProcessInfo *pInfo = [NSProcessInfo processInfo];
    NSArray *versionArray = [[pInfo operatingSystemVersionString] componentsSeparatedByString:@" "];
    if([versionArray count] >= 2) return [versionArray objectAtIndex:1];
    
    return @"Unidentified";
}

+(NSString*)getMacModel{
    size_t len = 0;
    sysctlbyname("hw.model", NULL, &len, NULL, 0);
    
    if (len){
        char *model = malloc(len*sizeof(char));
        sysctlbyname("hw.model", model, &len, NULL, 0);
        NSString *model_ns = [NSString stringWithUTF8String:model];
        free(model);
        return model_ns;
    }
    
    return @"Unidentified Apple Computer"; //incase model name can't be read
}

+(NSString*)getAppVersion{
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
}

+(CGFloat)mapValue:(CGFloat) x withInMin:(CGFloat) in_min InMax:(CGFloat) in_max OutMin:(CGFloat) out_min OutMax:(CGFloat) out_max{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

+(NSModalResponse)showAlertWithTitle:(NSString*) title andMessage:(NSString *)message andButtons:(NSArray*)buttons{
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText: title];
    [alert setInformativeText: message];
    for(NSString *buttonTitle in buttons){
        [alert addButtonWithTitle:buttonTitle];
    }
    return alert.runModal;
}

+(NSString *)showAlertWithInputAndTitle:(NSString*) title{
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText: title];
    [alert addButtonWithTitle:NSLocalizedString(@"Save",nil)];
    [alert addButtonWithTitle:NSLocalizedString(@"Cancel",nil)];
    NSTextField *input = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 0, 200, 24)];
    [input setStringValue:@""];
    [alert setAccessoryView:input];
    [alert runModal];
    [input becomeFirstResponder];
    [input validateEditing];
    return input.stringValue;
}

+(void)openBrowserWithURL:(NSString*)url{
    [[NSWorkspace sharedWorkspace] openURL:[NSURL URLWithString:url]];
}

+(BOOL)isDarkMode{
    NSDictionary *dict = [[NSUserDefaults standardUserDefaults] persistentDomainForName:NSGlobalDomain];
    id style = [dict objectForKey:@"AppleInterfaceStyle"];
    BOOL darkModeOn = ( style && [style isKindOfClass:[NSString class]] && NSOrderedSame == [style caseInsensitiveCompare:@"dark"] );
    return darkModeOn;
}

+(void)executeBlock:(void(^)(void))block after:(CGFloat)seconds{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, seconds * NSEC_PER_SEC), dispatch_get_main_queue(), block);
}

+(NSTimer *)executeBlock:(void(^)(void))block every:(CGFloat)seconds{
    return [NSTimer scheduledTimerWithTimeInterval:seconds
                            target:[NSBlockOperation blockOperationWithBlock:block]
                            selector:@selector(main)
                            userInfo:nil
                            repeats:YES];
}

+ (BOOL)launchOnLogin
{
    LSSharedFileListRef loginItemsListRef = LSSharedFileListCreate(NULL, kLSSharedFileListSessionLoginItems, NULL);
    CFArrayRef snapshotRef = LSSharedFileListCopySnapshot(loginItemsListRef, NULL);
    NSArray* loginItems = (__bridge NSArray*) snapshotRef;
    NSURL *bundleURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] bundlePath]];
    for (id item in loginItems) {
        LSSharedFileListItemRef itemRef = (__bridge LSSharedFileListItemRef)item;
        CFURLRef itemURLRef;
        if (LSSharedFileListItemResolve(itemRef, 0, &itemURLRef, NULL) == noErr) {
            NSURL *itemURL = (__bridge NSURL *)itemURLRef;
            if ([itemURL isEqual:bundleURL]) {
                return YES;
            }
        }
    }
    return NO;
}

+ (void)setLaunchOnLogin:(BOOL)launchOnLogin
{
    NSURL *bundleURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] bundlePath]];
    LSSharedFileListRef loginItemsListRef = LSSharedFileListCreate(NULL, kLSSharedFileListSessionLoginItems, NULL);
    
    if (launchOnLogin) {
        NSDictionary *properties;
        properties = [NSDictionary dictionaryWithObject:[NSNumber numberWithBool:YES] forKey:@"com.apple.loginitem.HideOnLaunch"];
        LSSharedFileListItemRef itemRef = LSSharedFileListInsertItemURL(loginItemsListRef, kLSSharedFileListItemLast, NULL, NULL, (__bridge CFURLRef)bundleURL, (__bridge CFDictionaryRef)properties,NULL);
        if (itemRef) {
            CFRelease(itemRef);
        }
    } else {
        LSSharedFileListRef loginItemsListRef = LSSharedFileListCreate(NULL, kLSSharedFileListSessionLoginItems, NULL);
        CFArrayRef snapshotRef = LSSharedFileListCopySnapshot(loginItemsListRef, NULL);
        NSArray* loginItems = (__bridge NSArray*) snapshotRef;
        
        for (id item in loginItems) {
            LSSharedFileListItemRef itemRef = (__bridge LSSharedFileListItemRef)item;
            CFURLRef itemURLRef;
            if (LSSharedFileListItemResolve(itemRef, 0, &itemURLRef, NULL) == noErr) {
                NSURL *itemURL = (__bridge NSURL *) itemURLRef;
                if ([itemURL isEqual:bundleURL]) {
                    LSSharedFileListItemRemove(loginItemsListRef, itemRef);
                }
            }
        }
    }
}

+(BOOL)appLaunchedBefore{
    if([[Storage get: kStorageAlreadyLaunched] boolValue]){
        return true;
    }else{
        [Storage set:[NSNumber numberWithBool:YES] key:kStorageAlreadyLaunched];
        return false;
    }
}
+(NSString *) md5:(NSString *) input{
    const char *cStr = [input UTF8String];
    unsigned char digest[16];
    CC_MD5( cStr, strlen(cStr), digest ); // This is the md5 call
    
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    
    for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++)
        [output appendFormat:@"%02x", digest[i]];
    
    return  output;
    
}

+(int)getDaysUntilDate:(NSDate*)date{
    NSCalendar *gregorianCalendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSDateComponents *components = [gregorianCalendar components:NSCalendarUnitDay
                                                        fromDate:[NSDate date]
                                                          toDate:date
                                                         options:0];
    return (int)[components day];
}

+(NSDate*)NSDateFromISO:(NSString*)iso{
    NSDateFormatter* dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setTimeZone:[NSTimeZone timeZoneWithName:@"GMT"]];
    [dateFormat setLocale:[[NSLocale alloc] initWithLocaleIdentifier:@"en_US"]];
    [dateFormat setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZ"];
    NSDate *date = [dateFormat dateFromString:iso];
    return date;
}

+(NSString*)readableDateFromNSDate:(NSDate*)date{
    return [NSDateFormatter localizedStringFromDate:date
                                          dateStyle:NSDateFormatterShortStyle
                                          timeStyle:NSDateFormatterFullStyle];
}

+(NSArray*)orderedStringArrayFromStringArray:(NSArray*)stringArray{
    return [stringArray sortedArrayUsingComparator:^NSComparisonResult(NSString *firstString, NSString *secondString) {
        return [[firstString lowercaseString] compare:[secondString lowercaseString]];
    }];
}

@end

