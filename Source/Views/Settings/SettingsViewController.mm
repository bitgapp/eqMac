//
//  SettingsViewController.m
//  eqMac2
//
//  Created by Romans Kisils on 10/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "SettingsViewController.h"

@interface SettingsViewController ()
@property (strong) IBOutlet NSButton *launchOnStartupCheckbox;
@property (strong) IBOutlet NSButton *showDefaultPresetsCheckbox;

@property (strong) IBOutlet NSSlider *volumeSlider;
@property (strong) IBOutlet NSSlider *balanceSlider;
@property (strong) IBOutlet NSImageView *volumeBars;
@property (strong) IBOutlet NSImageView *leftSpeaker;
@property (strong) IBOutlet NSImageView *rightSpeaker;
@end


@implementation SettingsViewController

-(void)viewDidLoad{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(readjustSettings) name:@"settingsPopoverWillOpen" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(readjustSettings) name:@"changeVolume" object:nil];
}

-(void)viewWillAppear{
    [self readjustSettings];
}


-(void)readjustSettings{
    [Utilities executeBlock:^{
        
        //VOLUME
        Float32 currentVolume = [Devices getVolumeForDeviceID:[Devices getVolumeControllerDeviceID]];
        [_volumeSlider setFloatValue:currentVolume];
        [self changeVolumeIcons:currentVolume];
        
        //BALANCE
        Float32 currentBalance = [Devices getBalanceForDeviceID:[Devices getBalanceControllerDeviceID]];
        [_balanceSlider setFloatValue:currentBalance];
        [self changeBalanceIcons:currentBalance];
        
    } after:0.01];
    
    [_launchOnStartupCheckbox setState: [Utilities launchOnLogin] ? NSOnState : NSOffState];
    [_showDefaultPresetsCheckbox setState:[[Storage get:kStorageShowDefaultPresets] integerValue]];
}

- (IBAction)switchShowDefaultPresets:(NSButton *)sender {
    [Storage set:[NSNumber numberWithInteger:[sender state]] key:kStorageShowDefaultPresets];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"showDefaultPresetsChanged" object:nil];
}

- (IBAction)checkForUpdates:(id)sender {
}

- (IBAction)reportBug:(id)sender {
    [Utilities openBrowserWithURL:REPO_ISSUES_URL];
}

- (IBAction)supportProject:(id)sender {
    [Utilities openBrowserWithURL:SUPPORT_URL];
}

- (IBAction)changeBalance:(NSSlider *)sender {
    Float32 balance = [sender floatValue];
    [Devices setBalanceForDevice:[Devices getBalanceControllerDeviceID] to:balance];
    [self changeBalanceIcons: [sender floatValue]];
}
- (IBAction)changeVolume:(id)sender {
    Float32 volume = [sender floatValue];
    [Devices setVolumeForDevice:[Devices getVolumeControllerDeviceID] to:volume];
    [self changeVolumeIcons:volume];
}

-(void)changeVolumeIcons:(CGFloat)volume{
    [_volumeBars setHidden:NO];
    if (volume == 0) {
        [_volumeBars setHidden:YES];
    }else if(volume >= VOLUME_STEP && volume <= 0.25){
        [_volumeBars setImage: [NSImage imageNamed:@"vol1.png"]];
    }else if(volume >0.25 && volume <= 0.5){
        [_volumeBars setImage: [NSImage imageNamed:@"vol2.png"]];
    }else if(volume >0.5 && volume <= 0.75){
        [_volumeBars setImage: [NSImage imageNamed:@"vol3.png"]];
    }else if(volume >0.75 && volume <= 1){
        [_volumeBars setImage: [NSImage imageNamed:@"vol4.png"]];
    }
}

-(void)changeBalanceIcons:(CGFloat)balance{
    if (balance == -1) {
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol4.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol1.png"]];
    }else if(balance >-1 && balance <= -0.5){
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol4.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol2.png"]];

    }else if(balance > -0.5 && balance < 0){
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol4.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol3.png"]];

    }else if(balance == 0){
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol4.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol4.png"]];

    }else if(balance >0 && balance <= 0.5){
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol3.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol4.png"]];

    }else if(balance >0.5 && balance < 1){
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol2.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol4.png"]];
    }else{
        [_leftSpeaker setImage: [Utilities flipImage:[NSImage imageNamed:@"vol1.png"]]];
        [_rightSpeaker setImage: [NSImage imageNamed:@"vol4.png"]];
    }

}

- (IBAction)quitApplication:(id)sender {
     [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
}

- (IBAction)uninstallApplication:(id)sender {
    if([Utilities showAlertWithTitle:@"Uninstall eqMac2?"
                          andMessage:@"Are you sure about this?"
                          andButtons:@[@"Yes, uninstall", @"No, cancel"]] == NSAlertFirstButtonReturn){
        
        if([EQHost EQEngineExists]) [EQHost deleteEQEngine];
        [Utilities runShellScriptWithName:@"uninstall_app"];
        [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
    }
}
- (IBAction)changeLaunchOnStartup:(NSButton*)sender {
    [Utilities setLaunchOnLogin:[sender state] == NSOnState ? true : false];
}




@end
