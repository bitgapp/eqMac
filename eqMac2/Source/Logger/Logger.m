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
    if (LOG) [self logOnLevel:@"log" andString: [Utilities stringifyAnything: anything]];
}

+(void)error:(id)anything{
    if (LOG) [self logOnLevel:@"error" andString: [Utilities stringifyAnything: anything]];
}

+(void)logOnLevel:(NSString*)level andString:(NSString*)string{
    NSLog(@"Logger.%@: %@", level, string);
}
@end
