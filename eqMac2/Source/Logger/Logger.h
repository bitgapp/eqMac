//
//  Logger.h
//  eqMac2
//
//  Created by Romans Kisils on 05/11/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Constants.h"
#import "Utilities.h"

@interface Logger : NSObject
+(void)log:(id)anything;
+(void)error:(id)anything;
@end
