
#import <Foundation/Foundation.h>

BOOL const DEBUGGING = NO;

NSString * const LEGACY_DRIVER_NAME = @"eqMac";
NSString * const DEVICE_NAME = @"eqMac2";
NSString * const DRIVER_UID = @"EQMAC2_DRIVER_ENGINE";
NSString * const API_URL = DEBUGGING ? @"http://localhost:3000" : @"https://eqmac-api.bitgapp.com";
NSString * const APP_URL = DEBUGGING ? @"http://localhost:8080/eqmac/" : @"https://bitgapp.com/eqmac/";
NSString * const SUPPORT_URL = DEBUGGING ? @"http://localhost:8080/eqmac/#/donate" : @"https://bitgapp.com/eqmac/#/donate";
NSString * const REPO_ISSUES_URL = @"https://github.com/romankisil/eqMac2/issues";
Float32    const VOLUME_STEP = 0.065;

