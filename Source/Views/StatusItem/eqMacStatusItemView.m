//
//  eqMacStatusItemView.m
//  eqMac2
//
//  Created by Romans Kisils on 13/04/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "eqMacStatusItemView.h"

@implementation eqMacStatusItemView

@synthesize image = _image;
@synthesize alternateImage = _alternateImage;
@synthesize clicked = _clicked;
@synthesize action = _action;
@synthesize rightAction = _rightAction;
@synthesize target = _target;

- (void)setHighlightState:(BOOL)state{
    if(self.clicked != state){
        self.clicked = state;
        [self setNeedsDisplay:YES];
    }
}

- (void)drawImage:(NSImage *)aImage centeredInRect:(NSRect)aRect{
    NSRect imageRect = NSMakeRect((CGFloat)round(aRect.size.width*0.5f-aImage.size.width*0.5f),
                                  (CGFloat)round(aRect.size.height*0.5f-aImage.size.height*0.5f),
                                  aImage.size.width,
                                  aImage.size.height);
    [aImage drawInRect:imageRect fromRect:NSZeroRect operation:NSCompositeSourceOver fraction:1.0f];
}

- (void)drawRect:(NSRect)rect{
    if(self.clicked){
        [[NSColor selectedMenuItemColor] set];
        NSRectFill(rect);
        if(self.alternateImage){
            [self drawImage:self.alternateImage centeredInRect:rect];
        }else if(self.image){
            [self drawImage:self.image centeredInRect:rect];
        }
    }else if(self.image){
        [self drawImage:self.image centeredInRect:rect];
    }
}

- (void)mouseDown:(NSEvent *)theEvent{
    [super mouseDown:theEvent];
    [self setHighlightState:!self.clicked];
    if ([theEvent modifierFlags] & NSCommandKeyMask){
        [self.target performSelectorOnMainThread:self.rightAction withObject:nil waitUntilDone:NO];
    }else{
        [self.target performSelectorOnMainThread:self.action withObject:nil waitUntilDone:NO];
    }
}

- (void)rightMouseDown:(NSEvent *)theEvent{
    [super rightMouseDown:theEvent];
    [self setHighlightState:!self.clicked];
    [self.target performSelectorOnMainThread:self.rightAction withObject:nil waitUntilDone:NO];
}

- (void)dealloc{
    self.target = nil;
    self.action = nil;
    self.rightAction = nil;
}

@end
