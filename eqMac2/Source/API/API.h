//
//  API.h
//  eqMac2
//
//  Created by Romans Kisils on 14/05/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFNetworking.h"
#import "Constants.h"
#import "Utilities.h"
#import "Storage.h"

@interface API : NSObject
+(void)startPinging;
+(void)getPromotionWithCallback: (void (^)(id _Nullable resp, NSError * _Nullable err)) cb;
@end
