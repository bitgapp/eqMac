//
//  eqMacStatusItemView.h
//  eqMac2
//
//  Created by Romans Kisils on 13/04/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface eqMacStatusItemView : NSView
@property NSImage* image;
@property NSImage* alternateImage;
@property BOOL clicked;
@property SEL action;
@property SEL rightAction;
@property (nonatomic, weak) id target;
- (void)setHighlightState:(BOOL)state;
@end
