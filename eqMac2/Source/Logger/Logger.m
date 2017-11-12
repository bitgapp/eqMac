//
//  Logger.m
//  eqMac2
//
//  Created by Romans Kisils on 05/11/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "Logger.h"

@implementation Logger
+(void)log:(id)anything{
    if (LOG) [self logOnLevel:@"log" andAnything: anything];
}

+(void)error:(id)anything{
    if (LOG) [self logOnLevel:@"error" andAnything: anything];
}

+(void)logOnLevel:(NSString*)level andAnything:(id)anything{
    NSLog(@"Logger.%@: %@", level, anything);
}
@end
