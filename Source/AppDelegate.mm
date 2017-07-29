//
//  AppDelegate.m
//  eqMac2
//
//  Created by Roman on 08/11/2015.
//  Copyright © 2015 bitgapp. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()
@property (strong) NSStatusItem *statusBar;
@end

//Views
eqViewController *eqVC;
SettingsViewController *settingsVC;
VolumeWindowController *volumeHUD;
eqMacStatusItemView *statusItemView;

//Windows
NSPopover *settingsPopover;
NSPopover *eqPopover;
NSEvent *eqPopoverTransiencyMonitor;
NSEvent *settingsPopoverTransiencyMonitor;


@implementation AppDelegate

#pragma mark Initialization

- (id)init {
    [NSApp activateIgnoringOtherApps:YES];
    [self setupStatusBar];
    return self;
}

-(void)setupStatusBar{
    statusItemView = [[eqMacStatusItemView alloc] init];
    statusItemView.target = self;
    
    statusItemView.action = @selector(openEQ); //Open EQ View on Left Click
    statusItemView.rightAction = @selector(openSettingsMenu); //Open Settings on Right Click
    
    _statusBar = [[NSStatusBar systemStatusBar] statusItemWithLength:NSSquareStatusItemLength];
    [_statusBar setView:statusItemView];
    [self setStatusItemIcon];
    [Utilities executeBlock:^{ [self setStatusItemIcon]; } every:1];
}

-(void)setStatusItemIcon{
    statusItemView.image = [NSImage imageNamed: [Utilities isDarkMode] ? @"statusItemLight" : @"statusItemDark"];
}

-(void)applicationDidFinishLaunching:(NSNotification *)notification{

    NSNotificationCenter *observer = [NSNotificationCenter defaultCenter];
    [observer addObserver:self selector:@selector(changeVolume:) name:@"changeVolume" object:nil];
    [observer addObserver:self selector:@selector(quitApplication) name:@"closeApp" object:nil];
    [observer addObserver:self selector:@selector(closePopovers) name:@"escapePressed" object:nil];
    
    
    [EQHost detectAndRemoveRoguePassthroughDevice];
    [self checkAndInstallDriver];
    
    eqVC = [[eqViewController alloc] initWithNibName:@"eqViewController" bundle:nil];
    settingsVC = [[SettingsViewController alloc] initWithNibName:@"SettingsViewController" bundle:nil];
    volumeHUD = [[VolumeWindowController alloc] initWithWindowNibName:@"VolumeWindowController"]; //Unfortunately have to use a custom Volume HUD as Aggregate Device Doesn't have master volume control :/
    
    eqPopover = [[NSPopover alloc] init];
    [eqPopover setDelegate:self];
    [eqPopover setContentViewController:eqVC];
    [eqPopover setBehavior:NSPopoverBehaviorTransient];
    
     settingsPopover = [[NSPopover alloc] init];
    [settingsPopover setDelegate:self];
    [settingsPopover setContentViewController:settingsVC];
    [settingsPopover setBehavior:NSPopoverBehaviorTransient];
    
    [volumeHUD.window setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorTransient];
    [volumeHUD.window setLevel:NSPopUpMenuWindowLevel];
    
    if(![Utilities appLaunchedBefore]){
        [Utilities setLaunchOnLogin:YES];
    }
    
    if(![Storage get: kStorageShowDefaultPresets]){
        [Storage set:[NSNumber numberWithBool:NO] key: kStorageShowDefaultPresets];
    }
    
    if(![Storage get: kStorageShowVolumeHUD]){
        [Storage set:[NSNumber numberWithBool:YES] key: kStorageShowVolumeHUD];
    }
    
    //Send anonymous analytics data to the API
    [API startPinging];
    [API sendPresets];
    
    [Utilities executeBlock:^{
        AudioDeviceID selectedDeviceID = [Devices getCurrentDeviceID];
        if(selectedDeviceID != [EQHost getPassthroughDeviceID]){
            [EQHost createEQEngineWithOutputDevice: selectedDeviceID];
        }
    } every:1];
}

-(void)checkAndInstallDriver{
    if([Devices legacyDriverInstalled]){
        if(![Devices eqMacDriverInstalled]){
            //Delete old and install new device
            switch([Utilities showAlertWithTitle:@"eqMac Driver requires an update"
                                      andMessage:@"In order to update the driver, the eqMac will ask for your system password."
                                      andButtons:@[@"Update", @"Quit"]]){
                case NSAlertFirstButtonReturn:{
                    if(![Utilities runShellScriptWithName:@"uninstall_old_install_new"]){
                        [self checkAndInstallDriver];
                    };
                    break;
                }
                case NSAlertSecondButtonReturn:{
                    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
                    break;
                }
            }
        }else{
            //Delete old driver only
            switch([Utilities showAlertWithTitle:@"Old eqMac Driver was detected"
                                      andMessage:@"Old driver needs to be uninstalled for eqMac2 to function properly."
                                      andButtons:@[@"Uninstall", @"Quit"]]){
                case NSAlertFirstButtonReturn:{
                    if(![Utilities runShellScriptWithName:@"uninstall_old"]){
                        [self checkAndInstallDriver];
                    };
                    break;
                }
                case NSAlertSecondButtonReturn:{
                    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
                    break;
                }
            }
        }
    }else{
        if(![Devices eqMacDriverInstalled]){
            //Install only the new driver
            switch([Utilities showAlertWithTitle:@"eqMac2 Requires a Driver"
                                      andMessage:@"In order to install the driver, the eqMac will ask for your system password."
                                      andButtons:@[@"Install", @"Quit"]]){
                case NSAlertFirstButtonReturn:{
                    if(![Utilities runShellScriptWithName:@"install_new"]){
                        [self checkAndInstallDriver];
                    };
                    break;
                }
                case NSAlertSecondButtonReturn:{
                    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
                    break;
                }
            }
        }
    }

}

-(void)changeVolume:(NSNotification*)notification{
    if([EQHost EQEngineExists]){
        AudioDeviceID volDevice = [Devices getVolumeControllerDeviceID];
        if([[notification.userInfo objectForKey:@"key"] intValue] == MUTE){
            [Devices setDevice:volDevice toMuted:![Devices getIsMutedForDeviceID:volDevice]];
        }else{
            Float32 volumeChange = 0.0;
            switch( [[notification.userInfo objectForKey:@"key"] intValue]){
                case UP:{
                    volumeChange = VOLUME_STEP;
                    break;
                }
                case DOWN:{
                    volumeChange = -VOLUME_STEP;
                    break;
                }
            }
                
            Float32 newVolume = [Devices getVolumeForDeviceID:volDevice] + volumeChange;
            if(newVolume < 0) newVolume = 0;
            if(newVolume > 1) newVolume = 1;

            [Devices setVolumeForDevice:volDevice to: newVolume];
        }
        
        [Utilities executeBlock:^{
            if([[Storage get:kStorageShowVolumeHUD] integerValue] == 1){
                [volumeHUD showHUDforVolume: [Devices getIsMutedForDeviceID:volDevice] ? 0 : [Devices getVolumeForDeviceID:volDevice]];
            }
        } after:0.01];
    }
}

- (void)openEQ{
    [statusItemView setHighlightState:NO];
    if([eqPopover isShown]){
        [eqPopover close];
    }else{
        if([settingsPopover isShown]) [settingsPopover close];
        [eqPopover showRelativeToRect:statusItemView.bounds ofView:statusItemView preferredEdge:NSMaxYEdge];
        [[NSRunningApplication currentApplication] activateWithOptions:NSApplicationActivateIgnoringOtherApps];
        if (eqPopoverTransiencyMonitor == nil) {
            eqPopoverTransiencyMonitor = [NSEvent addGlobalMonitorForEventsMatchingMask:(NSLeftMouseDownMask | NSRightMouseDownMask | NSKeyUpMask) handler:^(NSEvent* event) {
                [NSEvent removeMonitor:eqPopoverTransiencyMonitor];
                eqPopoverTransiencyMonitor = nil;
                [eqPopover close];
            }];
        }
    }
}

-(void)openSettingsMenu{
    [statusItemView setHighlightState:NO];
    if([settingsPopover isShown]){
        [settingsPopover close];
    }else{
        if([eqPopover isShown]) [eqPopover close];
        [settingsPopover showRelativeToRect:statusItemView.bounds ofView:statusItemView preferredEdge:NSMaxYEdge];
        [[NSRunningApplication currentApplication] activateWithOptions:NSApplicationActivateIgnoringOtherApps];
        if (settingsPopoverTransiencyMonitor == nil) {
            settingsPopoverTransiencyMonitor = [NSEvent addGlobalMonitorForEventsMatchingMask:(NSLeftMouseDownMask | NSRightMouseDownMask | NSKeyUpMask) handler:^(NSEvent* event) {
                [NSEvent removeMonitor:settingsPopoverTransiencyMonitor];
                settingsPopoverTransiencyMonitor = nil;
                [settingsPopover close];
            }];
        }
    }
}

-(void)closePopovers{
    if([eqPopover isShown]) [eqPopover close];
    if([settingsPopover isShown]) [settingsPopover close];
}
-(void)popoverWillShow:(NSNotification *)notification{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"settingsPopoverWillOpen" object:nil];
}

- (void)quitApplication{
    [self tearDownEQEngine];
    [NSApp terminate:nil];
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    [self tearDownEQEngine];
}

-(void)tearDownEQEngine{
    if([EQHost EQEngineExists]){
        [EQHost deleteEQEngine];
    }
    
    [Storage set:[eqVC getSelectedPresetName] key:kStorageSelectedPresetName];
    [EQHost detectAndRemoveRoguePassthroughDevice];
    [Devices switchToDeviceWithID:[EQHost getSelectedOutputDeviceID]];
}

@end
