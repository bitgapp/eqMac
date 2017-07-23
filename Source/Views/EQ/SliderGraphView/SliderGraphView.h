//
//  SliderGraphView.h
//  eqMac2
//
//  Created by Roman on 06/03/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>

@interface SliderGraphView : NSView

-(void)animateBandsToValues:(NSArray*)values;
-(NSArray*)getBandValues;
@end
