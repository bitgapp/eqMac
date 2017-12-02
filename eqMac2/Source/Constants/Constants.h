#import <Foundation/Foundation.h>
#ifndef Constants_h
#define Constants_h

extern NSString * const HELPER_BUNDLE_IDENTIFIER;
extern NSString * const DRIVER_UID;
extern NSString * const API_URL;
extern NSString * const APP_URL;
extern NSString * const SUPPORT_URL;
extern NSString * const HELP_URL;
extern Float32    const FULL_VOLUME_STEP;
extern Float32    const QUARTER_VOLUME_STEP;
extern BOOL       const LOG;

@interface Constants : NSObject
+(NSArray*)getFrequenciesForBandMode:(NSString*)bandMode;
@end


#endif /* Constants_h */


