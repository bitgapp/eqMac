#import <Foundation/Foundation.h>
#import "EQHost.h"

@implementation EQHost

static EQEngine *mEngine;
static AudioDeviceID selectedOutputDeviceID;
static NSNumber *bandMode;

+(void)createEQEngineWithOutputDevice:(AudioDeviceID)output{
    if([self EQEngineExists]) [self deleteEQEngine];
    
    AudioDeviceID input = [Devices getEQMacDeviceID];
    selectedOutputDeviceID = output;
    
    Float32 stashedVolume = [Devices getVolumeForDeviceID: output];
    [Storage setStashedVolume: stashedVolume];
    [Devices setVolumeForDevice:output to: 0]; //silence the output for now
    [Devices setVolumeForDevice: input to: stashedVolume];
    [Devices switchToDeviceWithID: input];

    mEngine = new EQEngine(input, output);
    
    bandMode = [Storage getSelectedBandMode];
    NSArray *frequenciesArray = [Constants getFrequenciesForBandMode: bandMode.stringValue];
    UInt32 *frequencies = new UInt32[frequenciesArray.count]();
    for (int i = 0; i < frequenciesArray.count; i++) {
        frequencies[i] = [[[frequenciesArray objectAtIndex: i] objectForKey:@"frequency"] intValue];
    }
    
    mEngine->SetEqFrequencies(frequencies, (UInt32)frequenciesArray.count);
    mEngine->Start();
    
    NSArray *savedGains = [Storage getSelectedGains];
    [self setEQEngineFrequencyGains: savedGains];
    [Devices setVolumeForDevice:output to: 1]; //full blast
}


+(void)deleteEQEngine{
    if(mEngine){
        [Devices setVolumeForDevice:[EQHost getSelectedOutputDeviceID] to: 0]; //silence the output for now
        mEngine->Stop();
        Float32 volumeToReach = [Devices getVolumeForDeviceID: [Devices getEQMacDeviceID]];
        [Devices switchToDeviceWithID:[EQHost getSelectedOutputDeviceID]];

        delete mEngine;
        mEngine = NULL;
        [Devices setVolumeForDevice: [self getSelectedOutputDeviceID] to: volumeToReach];
    }
}

+(BOOL)EQEngineExists{
    return (mEngine != NULL) ? true : false;
}

+(void)setEQEngineFrequencyGains:(NSArray*)gains{
    Float32 *array = new Float32[[gains count]];
    
    for(int i = 0; i < [gains count]; i++){
        array[i] = [[gains objectAtIndex:i] floatValue];
    }
    
    if(mEngine){
        mEngine->SetEqGains(array, (UInt32)gains.count);
    }
}

+(NSArray*)getEQEngineFrequencyGains{
    Float32 *gains = mEngine->GetEqGains();
    int nGains = bandMode.intValue;
    NSMutableArray *convertedGains = [[NSMutableArray alloc] init];
    for(int i = 0; i < nGains; i++){
        [convertedGains addObject: mEngine ? [NSNumber numberWithFloat:gains[i]] : @0];
    }
    return convertedGains;
}


+(AudioDeviceID)getSelectedOutputDeviceID{
    if(selectedOutputDeviceID){
        return selectedOutputDeviceID;
    }
    return 0;
}



@end
