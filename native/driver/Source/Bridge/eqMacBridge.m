//
//  eqMacBridge.m
//  eqMac
//
//  Created by Nodeful on 12/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

#import "eqMacBridge.h"
#import "eqMac-Swift.h"

void *eqMac_Create(CFAllocatorRef allocator, CFUUIDRef requestedTypeUUID) {
    return [eqMac createWithAllocator:allocator requestedTypeUUID:requestedTypeUUID];
}
