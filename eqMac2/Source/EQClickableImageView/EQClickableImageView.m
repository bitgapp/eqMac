//
//  EQClickableImageView.m
//  eqMac2
//
//  Created by Romans Kisils on 15/11/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "EQClickableImageView.h"


@implementation EQClickableImageView

-(void)mouseDown:(NSEvent *)event{
    [self.target performSelectorOnMainThread:self.clickAction withObject:nil waitUntilDone:NO];
}

@end
