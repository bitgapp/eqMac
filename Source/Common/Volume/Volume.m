//
//  Volume.m
//  eqMac2
//
//  Created by Romans Kisils on 29/07/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "Volume.h"




@implementation Volume

+(NSArray*)getFullSteps{
    NSMutableArray *steps = [[NSMutableArray alloc] init];
    Float32 step = .0;
    for(NSInteger i = 0; step <= 1; i++){
        [steps addObject: [NSNumber numberWithFloat:step]];
        step += FULL_VOLUME_STEP;
    }
    return steps;
}

+(NSArray*)getQuarterSteps{
    NSMutableArray *steps = [[NSMutableArray alloc] init];
    Float32 step = .0;
    for(NSInteger i = 0; step <= 1; i++){
        [steps addObject: [NSNumber numberWithFloat:step]];
        step += QUARTER_VOLUME_STEP;
    }
    return steps;
}

+(Float32)setVolume:(Float32)volume inDirection:(VOLUME_CHANGE_DIRECTION)direction toNearest:(VOLUME_STEP_TYPES)type{
    volume = [self roundVolume:volume toNearestStepOfType:type];

    if(volume == 0 && direction == kVolumeChangeDirectionDown) return 0;
    if(volume == 1 && direction == kVolumeChangeDirectionUp) return 1;
    
    NSArray *steps = type == kVolumeStepTypeFull ? [self getFullSteps] : [self getQuarterSteps];
    for(NSInteger i = 0; i < [steps count] - 1; i++){
        Float32 step = [[steps objectAtIndex:i] floatValue];
        if(step == volume)
            return [[steps objectAtIndex:i + (direction == kVolumeChangeDirectionUp ? 1 : -1)] floatValue];
    }
    
    Float32 step = type == kVolumeStepTypeFull ? FULL_VOLUME_STEP : QUARTER_VOLUME_STEP;
    volume += direction == kVolumeChangeDirectionUp ? step : -step;
    
    if(volume < 0)return 0;
    if(volume > 1)return 1;
    
    return volume;
}

+(Float32)roundVolume:(Float32)volume toNearestStepOfType:(VOLUME_STEP_TYPES)type{
    if(volume < 0)volume = 0;
    if(volume > 1)volume = 1;
    NSArray *steps = type == kVolumeStepTypeFull ? [self getFullSteps] : [self getQuarterSteps];
    for(NSInteger i = 0; i < [steps count] - 1; i++){
        Float32 lower = [[steps objectAtIndex:i] floatValue];
        Float32 higher = [[steps objectAtIndex:i+1] floatValue];
        if(lower <= volume && volume < higher){
            return ((volume - lower) < (higher - volume)) ? lower : higher;
        }
    }
    return volume;
}

@end
