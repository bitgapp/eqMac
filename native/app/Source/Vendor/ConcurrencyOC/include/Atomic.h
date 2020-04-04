//
//  Atomic.h
//  mcXCGen
//
//  Created by Vlad Gorlov on 18.11.18.
//  Copyright © 2018 WaveLabs. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface IntAtomic : NSObject

- (nonnull instancetype)init NS_UNAVAILABLE;
- (nonnull instancetype)initWithValue:(NSInteger)value;
- (NSInteger)load;
- (bool)compareExchangeStrongWithExpected:(nonnull NSInteger*)expected desired:(NSInteger)desired;

@end

@interface Int64Atomic : NSObject

- (nonnull instancetype)init NS_UNAVAILABLE;
- (nonnull instancetype)initWithValue:(int64_t)value;
- (int64_t)load;
- (bool)compareExchangeStrongWithExpected:(nonnull int64_t*)expected desired:(int64_t)desired;

@end
