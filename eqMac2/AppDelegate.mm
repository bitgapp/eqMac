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
VolumeWindowController *volumeHUD;
eqMacStatusItemView *statusItemView;

//Windows
NSPopover *eqPopover;
NSEvent *eqPopoverTransiencyMonitor;
NSTimer *deviceChangeWatcher;
NSTimer *deviceActivityWatcher;


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
    statusItemView.rightAction = @selector(openEQ); //Open EQ on Right Click
    
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
    [observer addObserver:self selector:@selector(closePopover) name:@"escapePressed" object:nil];
    [observer addObserver:self selector:@selector(readjustPopover) name:@"readjustPopover" object:nil];
    
    
    [EQHost detectAndRemoveRoguePassthroughDevice];
    [self checkAndInstallDriver];
    
    eqVC = [[eqViewController alloc] initWithNibName:@"eqViewController" bundle:nil];

    volumeHUD = [[VolumeWindowController alloc] initWithWindowNibName:@"VolumeWindowController"]; //Unfortunately have to use a custom Volume HUD as Aggregate Device Doesn't have master volume control :/
    
    eqPopover = [[NSPopover alloc] init];
    [eqPopover setDelegate:self];
    [eqPopover setContentViewController:eqVC];
    [eqPopover setBehavior:NSPopoverBehaviorTransient];
    
    
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
    
    if(![Storage get: kStorageSelectedBandMode]){
        [Storage set:@10 key: kStorageSelectedBandMode];
    }
    
    //Send anonymous analytics data to the API
    [API startPinging];
    [API sendPresets];
    
    [self startWatchingDeviceChanges];
    
    [[[NSWorkspace sharedWorkspace] notificationCenter] addObserver:self selector:@selector(wakeUpFromSleep) name:NSWorkspaceDidWakeNotification object:NULL];
}

-(void)startWatchingDeviceChanges{
    deviceChangeWatcher = [Utilities executeBlock:^{
        AudioDeviceID selectedDeviceID = [Devices getCurrentDeviceID];
        if(selectedDeviceID != [EQHost getPassthroughDeviceID] && [Devices getIsAliveForDeviceID:selectedDeviceID]){
            [EQHost createEQEngineWithOutputDevice: selectedDeviceID];
            [self startWatchingActivityOfDeviceWithID:selectedDeviceID];
        }
    } every:1];
}

-(void)startWatchingActivityOfDeviceWithID:(AudioDeviceID)ID{
    deviceActivityWatcher = [Utilities executeBlock:^{
        if(![Devices getIsAliveForDeviceID:ID]){
            [EQHost deleteEQEngine];
            [EQHost detectAndRemoveRoguePassthroughDevice];
            [deviceActivityWatcher invalidate];
            deviceActivityWatcher = nil;
        }
    } every:1];
}

-(void)wakeUpFromSleep{
    [deviceChangeWatcher invalidate];
    deviceChangeWatcher = nil;
    
    [EQHost deleteEQEngine];
    [Devices switchToDeviceWithID:[EQHost getSelectedOutputDeviceID]];
    [EQHost detectAndRemoveRoguePassthroughDevice];
    
    //delay the start a little so os has time to catchup with the Audio Processing
    [Utilities executeBlock:^{
        [self startWatchingDeviceChanges];
    } after:3];
}

-(void)checkAndInstallDriver{
    if(![Devices eqMacDriverInstalled]){
        //Install only the new driver
        switch([Utilities showAlertWithTitle:NSLocalizedString(@"eqMac2 Requires a Driver",nil)
                                  andMessage:NSLocalizedString(@"In order to install the driver, the app will ask for your system password.",nil)
                                  andButtons:@[NSLocalizedString(@"Install",nil), NSLocalizedString(@"Quit",nil)]]){
            case NSAlertFirstButtonReturn:{
                if(![Utilities runShellScriptWithName:@"install_driver"]){
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

-(void)changeVolume:(NSNotification*)notification{
    if([EQHost EQEngineExists]){
        AudioDeviceID volDevice = [Devices getVolumeControllerDeviceID];
        NSInteger volumeChangeKey = [[notification.userInfo objectForKey:@"key"] intValue];
        Float32 newVolume = 0;
        if(volumeChangeKey == MUTE){
            BOOL mute = ![Devices getIsMutedForDeviceID:volDevice];
            [Devices setDevice:volDevice toMuted: mute];
            if(!mute) newVolume = [Devices getVolumeForDeviceID:volDevice];
        }else{
            Float32 currentVolume = [Devices getVolumeForDeviceID:volDevice];
            newVolume = [Volume setVolume:currentVolume
                                      inDirection:volumeChangeKey == UP ? kVolumeChangeDirectionUp : kVolumeChangeDirectionDown
                                toNearest:[[notification.userInfo objectForKey:@"SHIFT+ALT"] boolValue] ? kVolumeStepTypeQuarter : kVolumeStepTypeFull];
            [Devices setVolumeForDevice:volDevice to: newVolume];
        }
        
        if([[Storage get:kStorageShowVolumeHUD] integerValue] == 1){
            [volumeHUD showHUDforVolume: newVolume];
        }
    }
}

- (void)openEQ{
    if([eqPopover isShown]){
        [eqPopover close];
    }else{
        [eqPopover showRelativeToRect:statusItemView.bounds ofView:statusItemView preferredEdge:NSMaxYEdge];
        NSWindow *popoverWindow = eqPopover.contentViewController.view.window;
        [popoverWindow.parentWindow removeChildWindow:popoverWindow];
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

-(void)popoverWillShow:(NSNotification *)notification{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"popoverWillOpen" object:nil];
}

-(void)popoverDidShow:(NSNotification *)notification{
    [self readjustPopover];
}

-(void)readjustPopover{
    [eqPopover setContentSize: eqPopover.contentViewController.view.frame.size];
}

-(void)popoverWillClose:(NSNotification *)notification{
    [statusItemView setHighlightState:NO];
}

-(void)closePopover{
    [eqPopover close];
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
    
    [EQHost detectAndRemoveRoguePassthroughDevice];
    [Devices switchToDeviceWithID:[EQHost getSelectedOutputDeviceID]];
}

@end
