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
    if([event type] == NSKeyDown && [event keyCode] == 53){
        [[NSNotificationCenter defaultCenter] postNotificationName:@"escapePressed" object:nil];
    }
    
    [super sendEvent: event];
}


@end
