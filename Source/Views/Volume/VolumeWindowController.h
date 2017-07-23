//
//  VolumeWindowController.h
//  eqMac
//
//  Created by Romans Kisils on 01/02/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "FlatLevelIndicator.h"
#import "Devices.h"
#import "Utilities.h"

@interface VolumeWindowController : NSWindowController
-(void)showHUDforVolume:(Float32)volume;
@end
