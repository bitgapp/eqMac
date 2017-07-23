//
//  FlatLevelIndicator.m
//  eqMac
//
//  Created by Romans Kisils on 01/02/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "FlatLevelIndicator.h"

CGFloat gap = 2;
CGFloat nTicks = 16;

@implementation FlatLevelIndicator

- (void)drawRect:(NSRect)dirtyRect {
    
    CGFloat size = (self.bounds.size.width - ((nTicks+1) * gap)) / nTicks;
    
    NSRect bgRect = dirtyRect;
    bgRect.size.width = (nTicks * size) + ((nTicks+1) * gap);
    bgRect.size.height = size + gap*2;
    NSColor *fillColor = [NSColor colorWithRed:0 green:0 blue:0 alpha:0.5];
    [fillColor set];
    NSRectFill(bgRect);
    
    for(int i = 0; i < self.intValue; i++){
        NSRect tick = NSMakeRect( (i*(size+gap)) + gap, gap, size, size);
        fillColor = [NSColor whiteColor];
        [fillColor set];
        NSRectFill(tick);
    }
}

@end
