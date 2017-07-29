//
//  NSAppEventCatcher.h
//  eqMac
//
//  Created by Romans Kisils on 30/01/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface NSAppEventCatcher : NSApplication
typedef enum {
    UP,
    MUTE,
    DOWN
} VOLUME_CHANGE_KEY;
@end
