//
//  Volume.h
//  eqMac2
//
//  Created by Romans Kisils on 29/07/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Constants.h"

@interface Volume : NSObject

typedef enum {
    kVolumeStepTypeFull, kVolumeStepTypeQuarter
} VOLUME_STEP_TYPES;

typedef enum {
    kVolumeChangeDirectionUp, kVolumeChangeDirectionDown
} VOLUME_CHANGE_DIRECTION;

+(Float32)setVolume:(Float32)volume inDirection:(VOLUME_CHANGE_DIRECTION)direction toNearest:(VOLUME_STEP_TYPES)type;

@end
