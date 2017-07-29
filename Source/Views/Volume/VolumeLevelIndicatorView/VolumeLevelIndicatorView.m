//
//  VolumeLevelIndicatorView.m
//  eqMac2
//
//  Created by Romans Kisils on 29/07/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "VolumeLevelIndicatorView.h"

CGFloat gap = 2;
CGFloat nTicks = 16;
Float32 volume = 0;

@implementation VolumeLevelIndicatorView

-(void)setVolume:(Float32)vol{
    volume = vol;
}


- (void)drawRect:(NSRect)dirtyRect {
    [super drawRect:dirtyRect];
    
    NSColor *bgColor = [NSColor colorWithRed:0 green:0 blue:0 alpha:0.5];
    NSColor *indicatorColor = [NSColor whiteColor];
    CGFloat size = (self.bounds.size.width - ((nTicks+1) * gap)) / nTicks;
    
    NSRect bgRect = dirtyRect;
    bgRect.size.width = (nTicks * size) + ((nTicks+1) * gap);
    bgRect.size.height = size + gap*2;
    [bgColor set];
    NSRectFill(bgRect);
    
    for(int i = 0; i < 16; i++){
        NSRect tick = NSMakeRect( (i*(size+gap)) + gap, gap, size, size);
        [indicatorColor set];
        NSRectFill(tick);
    }
    
    [bgColor set];

    CGFloat width = self.bounds.size.width;
    CGFloat x = width * volume;
    width = width - x;
    NSRect fgRect = CGRectMake(x, 0, width, size + gap*2);
    
    NSRectFill(fgRect);

}

@end
