//
//  NSAppEventCatcher.m
//  eqMac
//
//  Created by Romans Kisils on 30/01/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "NSAppEventCatcher.h"

@implementation NSAppEventCatcher

- (void)sendEvent: (NSEvent*)event{
    if( [event type] == NSSystemDefined && [event subtype] == 8 ){
        int keyCode = (([event data1] & 0xFFFF0000) >> 16);
        int keyFlags = ([event data1] & 0x0000FFFF);
        int keyState = (((keyFlags & 0xFF00) >> 8)) == 0xA;
        
        
        
        if(keyState == 1 && (keyCode == NX_KEYTYPE_SOUND_UP || keyCode == NX_KEYTYPE_SOUND_DOWN || keyCode == NX_KEYTYPE_MUTE)){
            NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
            
            //Detect SHIFT+ALT
            [userInfo setObject:
                [NSNumber numberWithBool:[event modifierFlags] & NSShiftKeyMask && [event modifierFlags] & NSAlternateKeyMask]
                            forKey:@"SHIFT+ALT"];
            
            switch(keyCode){
                case NX_KEYTYPE_SOUND_UP:{
                    [userInfo setObject:[NSNumber numberWithInt:UP] forKey:@"key"];
                    break;
                }
                case NX_KEYTYPE_SOUND_DOWN:{
                    [userInfo setObject:[NSNumber numberWithInt:DOWN] forKey:@"key"];
                    break;
                }
                case NX_KEYTYPE_MUTE:{
                    [userInfo setObject:[NSNumber numberWithInt:MUTE] forKey:@"key"];
                    break;
                }
            }
            [[NSNotificationCenter defaultCenter] postNotificationName:@"changeVolume" object:nil userInfo:userInfo];
        }
    }
    
    if([event type] == NSKeyDown && [event keyCode] == 53){
        [[NSNotificationCenter defaultCenter] postNotificationName:@"escapePressed" object:nil];
    }
    
    [super sendEvent: event];
}


@end
