//
//  Atomic.m
//  mcXCGen
//
//  Created by Vlad Gorlov on 18.11.18.
//  Copyright © 2018 WaveLabs. All rights reserved.
//

#import "Atomic.h"
#import <stdatomic.h>

// See:
// - Understanding C11 and C++11 Atomics | Understanding C11 and C++11 Atomics | InformIT: http://bit.ly/2Ftqh7Y
// - You Can Do Any Kind of Atomic Read-Modify-Write Operation: http://bit.ly/2FttwfE
// - Semaphores are Surprisingly Versatile: http://bit.ly/2FuHQEK


@implementation IntAtomic {
   _Atomic(NSInteger) atomic;
}

- (instancetype)initWithValue:(NSInteger)value {
   self = [super init];
   if (self) {
      atomic_init(&atomic, value);
   }
   return self;
}

/// Operation returns the value of atomic variable object.
- (NSInteger)load {
   return atomic_load(&atomic);
}

/// Operation stores the *desired* value into atomic variable object, but only if the atomic variable is equal to the *expected*
/// value. Upon success, the operation returns true. Upon failure, the *expected* value is overwritten with the contents of
/// the atomic variable and false is returned.
- (bool)compareExchangeStrongWithExpected:(nonnull NSInteger*)expected desired:(NSInteger)desired {
   bool result = atomic_compare_exchange_strong(&atomic, expected, desired);
   return result;
}

@end


@implementation Int64Atomic {
   _Atomic(int64_t) atomic;
}

- (instancetype)initWithValue:(int64_t)value {
   self = [super init];
   if (self) {
      atomic_init(&atomic, value);
   }
   return self;
}

/// Operation returns the value of atomic variable object.
- (int64_t)load {
   return atomic_load(&atomic);
}

/// Operation stores the *desired* value into atomic variable object, but only if the atomic variable is equal to the *expected*
/// value. Upon success, the operation returns true. Upon failure, the *expected* value is overwritten with the contents of
/// the atomic variable and false is returned.
- (bool)compareExchangeStrongWithExpected:(nonnull int64_t*)expected desired:(int64_t)desired {
   bool result = atomic_compare_exchange_strong(&atomic, expected, desired);
   return result;
}

@end
