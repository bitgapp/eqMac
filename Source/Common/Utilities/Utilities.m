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
    [alert addButtonWithTitle:@"Save"];
    [alert addButtonWithTitle:@"Cancel"];
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

+(NSImage *)invertedImageFromImage:(NSImage*)image{
    // get width and height as integers, since we'll be using them as
    // array subscripts, etc, and this'll save a whole lot of casting
    CGSize size = image.size;
    int width = size.width;
    int height = size.height;
    
    // Create a suitable RGB+alpha bitmap context in BGRA colour space
    CGColorSpaceRef colourSpace = CGColorSpaceCreateDeviceRGB();
    unsigned char *memoryPool = (unsigned char *)calloc(width*height*4, 1);
    CGContextRef context = CGBitmapContextCreate(memoryPool, width, height, 8, width * 4, colourSpace, kCGBitmapByteOrder32Big | kCGImageAlphaPremultipliedLast);
    CGColorSpaceRelease(colourSpace);
    
    // draw the current image to the newly created context
    NSRect imageRect = NSMakeRect(0, 0, image.size.width, image.size.height);
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), [image CGImageForProposedRect:&imageRect context:NULL hints:nil]);
    
    // run through every pixel, a scan line at a time...
    for(int y = 0; y < height; y++)
    {
        // get a pointer to the start of this scan line
        unsigned char *linePointer = &memoryPool[y * width * 4];
        
        // step through the pixels one by one...
        for(int x = 0; x < width; x++)
        {
            // get RGB values. We're dealing with premultiplied alpha
            // here, so we need to divide by the alpha channel (if it
            // isn't zero, of course) to get uninflected RGB. We
            // multiply by 255 to keep precision while still using
            // integers
            int r, g, b;
            if(linePointer[3])
            {
                r = linePointer[0] * 255 / linePointer[3];
                g = linePointer[1] * 255 / linePointer[3];
                b = linePointer[2] * 255 / linePointer[3];
            }
            else
                r = g = b = 0;
            
            // perform the colour inversion
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            
            // multiply by alpha again, divide by 255 to undo the
            // scaling before, store the new values and advance
            // the pointer we're reading pixel data from
            linePointer[0] = r * linePointer[3] / 255;
            linePointer[1] = g * linePointer[3] / 255;
            linePointer[2] = b * linePointer[3] / 255;
            linePointer += 4;
        }
    }
    
    // get a CG image from the context, wrap that into a
    // NSImage
    CGImageRef cgImage = CGBitmapContextCreateImage(context);
    NSImage *returnImage = [[NSImage alloc] initWithCGImage:cgImage size:size];
    
    // clean up
    CGImageRelease(cgImage);
    CGContextRelease(context);
    free(memoryPool);
    
    // and return
    return returnImage;
}

@end

