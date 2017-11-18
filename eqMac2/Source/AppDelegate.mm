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
EQViewController *eqVC;
eqMacStatusItemView *statusItemView;

//Windows
NSPopover *eqPopover;
NSEvent *eqPopoverTransiencyMonitor;
NSTimer *deviceChangeWatcher;
NSTimer *deviceActivityWatcher;
EQPromotionWindowController *promotionWindowController;

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
    [observer addObserver:self selector:@selector(quitApplication) name:@"closeApp" object:nil];
    [observer addObserver:self selector:@selector(closePopover) name:@"escapePressed" object:nil];
    [observer addObserver:self selector:@selector(readjustPopover) name:@"readjustPopover" object:nil];
    
    [self checkAndInstallDriver];
    
    eqVC = [[EQViewController alloc] initWithNibName:@"EQViewController" bundle:nil];
    
    eqPopover = [[NSPopover alloc] init];
    [eqPopover setDelegate:self];
    [eqPopover setContentViewController:eqVC];
    [eqPopover setBehavior:NSPopoverBehaviorTransient];
    
    if([Storage getAppAlreadyLaunchedBefore]){
        promotionWindowController = [[EQPromotionWindowController alloc] initWithWindowNibName:@"EQPromotionWindowController"];
        [promotionWindowController window];
    }
    
    //Send anonymous analytics data to the API
    [API startPinging];
    
    [self startWatchingDeviceChanges];
    
    [[[NSWorkspace sharedWorkspace] notificationCenter] addObserver:self selector:@selector(wakeUpFromSleep) name:NSWorkspaceDidWakeNotification object:NULL];
}

-(void)checkAndInstallDriver{
    if(![Devices eqMacDriverInstalled]){
        //Install only the new driver
        switch([Utilities showAlertWithTitle:NSLocalizedString(@"eqMac2 Requires a Driver Update",nil)
                                  andMessage:NSLocalizedString(@"In order to install the driver, the app will ask for your system password.",nil)
                                  andButtons:@[NSLocalizedString(@"Install",nil), NSLocalizedString(@"Quit",nil)]]){
            case NSAlertFirstButtonReturn:{
                [Utilities runShellScriptWithName:@"install_driver"];
                
                if (![Devices eqMacDriverInstalled]) {
                    [Utilities runAppleScriptWithName:@"open_security_settings"];
                    [Utilities showAlertWithTitle:@"Problem installing the Driver"
                                       andMessage:@"eqMac has just openned your System Preferences > Security and Privacy Settings. \
                     Please follow the instructions to allow eqMac2 Driver to be installed.\
                     Once you finished with all the steps, please try to install again."
                                       andButtons:@[@"Did it, try to install again"]];
                    return [self checkAndInstallDriver];
                }
                break;
            }
            case NSAlertSecondButtonReturn:{
                [self quitApplication];
                break;
            }
        }
    }
}

-(void)startWatchingDeviceChanges{
    deviceChangeWatcher = [Utilities executeBlock:^{
        AudioDeviceID selectedDeviceID = [Devices getCurrentDeviceID];
        if(selectedDeviceID != [Devices getEQMacDeviceID] && [Devices getIsAliveForDeviceID:selectedDeviceID]){
            [EQHost createEQEngineWithOutputDevice: selectedDeviceID];
            [self startWatchingActivityOfDeviceWithID:selectedDeviceID];
        }
    } every:1];
}

-(void)startWatchingActivityOfDeviceWithID:(AudioDeviceID)ID{
    deviceActivityWatcher = [Utilities executeBlock:^{
        if(![Devices getIsAliveForDeviceID:ID]){
            [EQHost deleteEQEngine];
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
    
    //delay the start a little so os has time to catchup with the Audio Processing
    [Utilities executeBlock:^{
        [self startWatchingDeviceChanges];
    } after:3];
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
    [NSApp terminate:nil];
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    [self tearDownApplication];
}

-(void)tearDownApplication{
    [[NSUserDefaults standardUserDefaults] synchronize];
    if([EQHost EQEngineExists]){
        [EQHost deleteEQEngine];
    }
    
    [Devices switchToDeviceWithID:[EQHost getSelectedOutputDeviceID]];
}

@end
