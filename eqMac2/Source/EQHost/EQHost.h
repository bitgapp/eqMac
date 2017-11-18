#import "Devices.h"
#import "EQEngine.h"
#import "Utilities.h"

@interface EQHost : NSObject

+(void)createEQEngineWithOutputDevice:(AudioDeviceID)output;
+(void)deleteEQEngine;
+(BOOL)EQEngineExists;
+(void)setEQEngineFrequencyGains:(NSArray*)gains;
+(NSArray*)getEQEngineFrequencyGains;
+(AudioDeviceID)getSelectedOutputDeviceID;
@end
