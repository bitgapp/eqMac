//
//  VolumeWindowController.m
//  eqMac
//
//  Created by Romans Kisils on 01/02/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "VolumeWindowController.h"

@interface VolumeWindowController ()
@property (strong) IBOutlet VolumeLevelIndicatorView *volumeLevelIndicator;

@end

CFTimeInterval lastShow;

@implementation VolumeWindowController

- (void)windowDidLoad {
    [super windowDidLoad];
}

-(void) showHUDforVolume:(Float32)volume{
    
    lastShow = CACurrentMediaTime();
    [_volumeLevelIndicator setVolume:volume];
    [_volumeLevelIndicator setNeedsDisplay:YES];
    
    float alpha = 1.0;
    [self.window setAlphaValue:alpha];
    [self.window makeKeyAndOrderFront:self];
    
    double fadeOutDelay = 1;
    [Utilities executeBlock:^{
        CFTimeInterval timeSinceLastShow = CACurrentMediaTime() - lastShow;
        
        if(timeSinceLastShow > fadeOutDelay){
            [NSAnimationContext beginGrouping];
            [[NSAnimationContext currentContext] setDuration:.7f];
            [[self.window animator] setAlphaValue:0.f];
            [NSAnimationContext endGrouping];
        }
    } after:1];
}


@end
