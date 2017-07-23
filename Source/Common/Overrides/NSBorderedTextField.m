//
//  NSBorderedTextField.m
//  eqMac2
//
//  Created by Romans Kisils on 04/06/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "NSBorderedTextField.h"

@implementation NSBorderedTextField

NSColor* borderColor;

- (void)drawRect:(NSRect)dirtyRect {
    if(!borderColor) borderColor = [NSColor whiteColor];
    NSPoint origin = { 0.0,0.0 };
    NSRect rect;
    rect.origin = origin;
    rect.size.width  = [self bounds].size.width;
    rect.size.height = [self bounds].size.height;
    
    NSBezierPath * path;
    path = [NSBezierPath bezierPathWithRect:rect];
    [path setLineWidth:2];
    [borderColor set];
    [path stroke];
}

-(void)setBorderColor:(NSColor*)color{
    borderColor = color;
}

@end
