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

+(void)runAppleScriptWithName:(NSString*)scriptName{
    NSString *resourcePath = [[NSBundle bundleForClass:[self class]] resourcePath];
    NSString *scriptExtension = @"scpt";
    NSString *scriptAbsolutePath = [NSString stringWithFormat:@"%@/%@.%@", resourcePath, scriptName, scriptExtension];
    NSURL* url = [NSURL fileURLWithPath:scriptAbsolutePath];
    NSDictionary* errors = [NSDictionary dictionary];
    NSAppleScript* appleScript = [[NSAppleScript alloc] initWithContentsOfURL:url error:&errors];
    [appleScript executeAndReturnError:nil];
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

+ (BOOL)launchOnLoginForBundlePath:(NSString*)bundlePath{
    LSSharedFileListRef loginItemsListRef = LSSharedFileListCreate(NULL, kLSSharedFileListSessionLoginItems, NULL);
    CFArrayRef snapshotRef = LSSharedFileListCopySnapshot(loginItemsListRef, NULL);
    NSArray* loginItems = (__bridge NSArray*) snapshotRef;
    NSURL *bundleURL = [NSURL fileURLWithPath: bundlePath];
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

+ (BOOL)launchOnLogin{
    return [self launchOnLoginForBundlePath: [[NSBundle mainBundle] bundlePath]];
}

+ (void)setLaunchOnLogin:(BOOL)launchOnLogin forBundlePath:(NSString*)bundlePath{
    NSURL *bundleURL = [NSURL fileURLWithPath: bundlePath];
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

+ (void)setLaunchOnLogin:(BOOL)launchOnLogin{
    [self setLaunchOnLogin:launchOnLogin forBundlePath: [[NSBundle mainBundle] bundlePath]];
}

+ (BOOL)appWithBundleIdentifierIsRunning:(NSString*)bundleIdentifier{
    NSArray *runningApplications = [[NSWorkspace sharedWorkspace] runningApplications];
    for (NSRunningApplication *application in runningApplications) {
        if ([[application bundleIdentifier] isEqualToString: bundleIdentifier]) return true;
    }
    return false;
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

+(NSString*)stringifyAnything:(id)anything{
    if ([@[NSArray.class, NSMutableArray.class, NSDictionary.class, NSMutableDictionary.class] containsObject: [anything class]] ){
        return [[NSString alloc] initWithData: [NSJSONSerialization dataWithJSONObject:anything options:(NSJSONWritingOptions) NSJSONWritingPrettyPrinted error:nil] encoding:NSUTF8StringEncoding];
    }
    return anything;
}

+(NSString*)hashString:(NSString*)string{
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    uint8_t digest[CC_SHA1_DIGEST_LENGTH];
    CC_SHA1(data.bytes, (CC_LONG) data.length, digest);
    NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++){
        [output appendFormat:@"%02x", digest[i]];
    }
    return output;
}

@end

