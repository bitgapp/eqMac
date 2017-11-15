
#import <Foundation/Foundation.h>
#import "Constants.h"

NSString * const LEGACY_DRIVER_NAME = @"eqMac";
NSString * const DEVICE_NAME = @"eqMac2";
NSString * const BUILTIN_DEVICE_NAME = @"Built-in Speaker or Line out";
NSString * const DRIVER_UID = @"EQMAC2_DRIVER_ENGINE";
NSString * const API_URL = @"https://eqmac-api.bitgapp.com";
NSString * const APP_URL = @"https://bitgapp.com/eqmac/";
NSString * const SUPPORT_URL = @"https://bitgapp.com/eqmac/#/donate";
NSString * const REPO_ISSUES_URL = @"https://github.com/romankisil/eqMac2/blob/master/CONTRIBUTING.md";
NSString * const HELP_URL = @"https://go.crisp.chat/chat/embed/?website_id=d43e2906-97e3-4c50-82ea-6fa04383b983";
Float32 const FULL_VOLUME_STEP = 0.0625;
Float32 const QUARTER_VOLUME_STEP = 0.015625;
BOOL const LOG = NO;


@implementation Constants

+(NSArray*)getFrequenciesForBandMode:(NSString*)bandMode{
    
    NSDictionary *frequencies = @{
                                  @"10": @[
                                          @{
                                              @"frequency": @32,
                                              @"label": @"32"
                                              },
                                          @{
                                              @"frequency": @64,
                                              @"label": @"64"
                                              },
                                          @{
                                              @"frequency": @125,
                                              @"label": @"125"
                                              },
                                          @{
                                              @"frequency": @250,
                                              @"label": @"250"
                                              },
                                          @{
                                              @"frequency": @500,
                                              @"label": @"500"
                                              },
                                          @{
                                              @"frequency": @1000,
                                              @"label": @"1K"
                                              },
                                          @{
                                              @"frequency": @2000,
                                              @"label": @"2K"
                                              },
                                          @{
                                              @"frequency": @4000,
                                              @"label": @"4K"
                                              },
                                          @{
                                              @"frequency": @8000,
                                              @"label": @"8K"
                                              },
                                          @{
                                              @"frequency": @16000,
                                              @"label": @"16K"
                                              }
                                          ],
                                  @"31": @[
                                          @{
                                              @"frequency": @20,
                                              @"label": @"20"
                                              },
                                          @{
                                              @"frequency": @25,
                                              @"label": @"25"
                                              },
                                          @{
                                              @"frequency": @31.5,
                                              @"label": @"31.5"
                                              },
                                          @{
                                              @"frequency": @40,
                                              @"label": @"40"
                                              },
                                          @{
                                              @"frequency": @50,
                                              @"label": @"50"
                                              },
                                          @{
                                              @"frequency": @63,
                                              @"label": @"63"
                                              },
                                          @{
                                              @"frequency": @80,
                                              @"label": @"80"
                                              },
                                          @{
                                              @"frequency": @100,
                                              @"label": @"100"
                                              },
                                          @{
                                              @"frequency": @125,
                                              @"label": @"125"
                                              },
                                          @{
                                              @"frequency": @160,
                                              @"label": @"160"
                                              },
                                          @{
                                              @"frequency": @200,
                                              @"label": @"200"
                                              },
                                          @{
                                              @"frequency": @250,
                                              @"label": @"250"
                                              },
                                          @{
                                              @"frequency": @315,
                                              @"label": @"315"
                                              },
                                          @{
                                              @"frequency": @400,
                                              @"label": @"400"
                                              },
                                          @{
                                              @"frequency": @500,
                                              @"label": @"500"
                                              },
                                          @{
                                              @"frequency": @630,
                                              @"label": @"630"
                                              },
                                          @{
                                              @"frequency": @800,
                                              @"label": @"800"
                                              },
                                          @{
                                              @"frequency": @1000,
                                              @"label": @"1K"
                                              },
                                          @{
                                              @"frequency": @1250,
                                              @"label": @"1.25K"
                                              },
                                          @{
                                              @"frequency": @1600,
                                              @"label": @"1.6K"
                                              },
                                          @{
                                              @"frequency": @2000,
                                              @"label": @"2K"
                                              },
                                          @{
                                              @"frequency": @2500,
                                              @"label": @"2.5K"
                                              },
                                          @{
                                              @"frequency": @3150,
                                              @"label": @"3.15K"
                                              },
                                          @{
                                              @"frequency": @4000,
                                              @"label": @"4K"
                                              },
                                          @{
                                              @"frequency": @5000,
                                              @"label": @"5K"
                                              },
                                          @{
                                              @"frequency": @6300,
                                              @"label": @"6.3K"
                                              },
                                          @{
                                              @"frequency": @8000,
                                              @"label": @"8K"
                                              },
                                          @{
                                              @"frequency": @10000,
                                              @"label": @"10K"
                                              },
                                          @{
                                              @"frequency": @12500,
                                              @"label": @"12.5K"
                                              },
                                          @{
                                              @"frequency": @16000,
                                              @"label": @"16K"
                                              },
                                          @{
                                              @"frequency": @20000,
                                              @"label": @"20K"
                                              }
                                          ]
                                  };
    return [frequencies objectForKey: bandMode];

}
@end
