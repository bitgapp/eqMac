//
// EQMDriverBridge.m
// eqMac
//
// Created by Nodeful on 12/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

#import "EQMDriverBridge.h"
#import "eqMac-Swift.h"

void *EQM_Create(CFAllocatorRef allocator, CFUUIDRef requestedTypeUUID) {
  return [EQMDriver createWithAllocator:allocator requestedTypeUUID:requestedTypeUUID];
}
