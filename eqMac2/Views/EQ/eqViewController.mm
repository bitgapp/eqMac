//
//  EQViewController.m
//  eqMac2
//
//  Created by Romans Kisils on 10/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "eqViewController.h"

@interface eqViewController ()

@property (strong) IBOutlet NSButton *deleteButton;
@property (strong) IBOutlet NSPopUpButton *presetsPopup;
@property (strong) IBOutlet NSButton *saveButton;

@property (strong) IBOutlet NSView *bandLabelsView;
@property (strong) IBOutlet NSView *mockSliderView;
@property (strong) IBOutlet NSPopUpButton *outputPopup;
@property (strong) IBOutlet NSButton *bandModeButton;

@property (strong) IBOutlet NSImageView *speakerIcon;
@property (strong) IBOutlet NSSlider *volumeSlider;
@property (strong) IBOutlet NSImageView *volumeBars;

@property (strong) IBOutlet NSImageView *leftSpeaker;
@property (strong) IBOutlet NSSlider *balanceSlider;
@property (strong) IBOutlet NSImageView *rightSpeaker;

@property (strong) IBOutlet NSView *optionsView;
@property (strong) IBOutlet NSView *settingsView;
@property (strong) IBOutlet NSButton *showVolumeHUDCheckbox;
@property (strong) IBOutlet NSButton *launchOnStartupCheckbox;
@property (strong) IBOutlet NSButton *showDefaultPresetsCheckbox;
@property (strong) IBOutlet NSTextField *buildLabel;

@end

SliderGraphView *sliderView;
NSNotificationCenter *notify;
NSArray *outputDevices;
NSNumber *bandMode;
CGFloat originalWidth;
CGFloat originalHeight;

@implementation eqViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    originalWidth = self.view.frame.size.width;
    originalHeight = self.view.frame.size.height;
  
    sliderView = [[SliderGraphView alloc] initWithFrame: _mockSliderView.frame];
    [sliderView setAutoresizingMask: _mockSliderView.autoresizingMask];
    _mockSliderView = nil;
    [self.view addSubview:sliderView];
    
    [_presetsPopup setTitle:@""];
    [_outputPopup setTitle:@""];
    
    notify = [NSNotificationCenter defaultCenter];
    [notify addObserver:self selector:@selector(sliderGraphChanged) name:@"sliderGraphChanged" object:nil];
    [notify addObserver:self selector:@selector(populatePresetPopup) name:@"showDefaultPresetsChanged" object:nil];
    [notify addObserver:self selector:@selector(populateOutputPopup) name:@"devicesChanged" object:nil];

    [self populatePresetPopup];
    [self populateOutputPopup];
    
    [notify addObserver:self selector:@selector(readjustView) name:@"popoverWillOpen" object:nil];
    [notify addObserver:self selector:@selector(readjustView) name:@"changeVolume" object:nil];
    
    [_buildLabel setStringValue:[@"Build " stringByAppendingString:[Utilities getAppVersion]]];
    
    bandMode = [Storage get: kStorageSelectedBandMode];
    
    [sliderView setNSliders: [bandMode intValue]];
    
    [self readjustView];
}

-(void)viewDidAppear{
    [sliderView forceRedraw];
    [self populateOutputPopup];
    [_deleteButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"deleteLight.png"] : [NSImage imageNamed:@"deleteDark.png"]];
    [_saveButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"saveLight.png"] : [NSImage imageNamed:@"saveDark.png"]];
    [_speakerIcon setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"speakerLight.png"] : [NSImage imageNamed:@"speakerDark.png"]];
    
    [_launchOnStartupCheckbox setState: [Utilities launchOnLogin] ? NSOnState : NSOffState];
    [_showDefaultPresetsCheckbox setState:[[Storage get:kStorageShowDefaultPresets] integerValue]];
    [_showVolumeHUDCheckbox setState:[[Storage get: kStorageShowVolumeHUD] integerValue]];
    
    [Utilities executeBlock:^{
        [sliderView animateBandsToValues:[EQHost getEQEngineFrequencyGains]];
    } after:.1];
}
    
-(void)setBandLabels{
    NSArray *sliderPositions = [sliderView getSliderXPosition];
    [_bandLabelsView setSubviews: [[NSArray alloc] init]];
    NSArray *frequencies = [Constants getFrequenciesForBandMode: [bandMode stringValue]];
    CGFloat labelWidth = 38;
    CGFloat labelHeight = 17;
    CGFloat labelYPos = _bandLabelsView.bounds.size.height / 2 - labelHeight / 2;
    int index = -1;
    for(NSNumber *position in sliderPositions) {
        index++;
        CGFloat labelXPos = [position floatValue] - labelWidth / 2;
        NSTextField *label = [[NSTextField alloc] initWithFrame: NSMakeRect(labelXPos, labelYPos, labelWidth, labelHeight)];
        [label setBackgroundColor: [NSColor colorWithRed:0 green:0 blue:0 alpha:0]];
        [label setBordered:NO];
        [label setStringValue: [[frequencies objectAtIndex: index] objectForKey:@"label"]];
        [label setAlignment: NSCenterTextAlignment];
        CGFloat fontSize = bandMode.intValue == 10 ? 9 : 7;
        [label setFont: [NSFont systemFontOfSize: fontSize]];
        [_bandLabelsView addSubview:label];
    }
}


-(void)populatePresetPopup{
    [_presetsPopup removeAllItems];
    NSArray *presets = [Presets getShowablePresetsNames];
    [_presetsPopup addItemsWithTitles: [Utilities orderedStringArrayFromStringArray: presets]];
    StorageKey selectedPresetNameKey = bandMode.intValue == 10 ? kStorageSelectedPresetName10Bands : kStorageSelectedPresetName31Bands;
    NSString *selectedPresetsName = [Storage get: selectedPresetNameKey];
    if(selectedPresetsName) [_presetsPopup setTitle: selectedPresetsName];
}

- (IBAction)changePreset:(NSPopUpButton *)sender {
    NSString *presetName = [_presetsPopup title];
    NSArray *gains = [Presets getGainsForPreset:presetName];
    [sliderView animateBandsToValues:gains];
    [EQHost setEQEngineFrequencyGains:gains];
    StorageKey selectedPresetNameKey = bandMode.intValue == 10 ? kStorageSelectedPresetName10Bands : kStorageSelectedPresetName31Bands;
    [Storage set: presetName key: selectedPresetNameKey];
}

- (IBAction)deletePreset:(id)sender {
    if(![[_presetsPopup title] isEqualToString:NSLocalizedString(@"Flat",nil)]){
        [Presets deletePresetWithName:[_presetsPopup title]];
        [self populatePresetPopup];
        [self resetEQ:nil];
    }
}

- (IBAction)savePreset:(NSButton *)sender {
    NSString *newPresetName = [Utilities showAlertWithInputAndTitle:NSLocalizedString(@"Please enter a name for your new preset.",nil)];
    if(![newPresetName isEqualToString:@""]){
        [Presets savePreset:[sliderView getBandValues] withName:newPresetName];
        [self populatePresetPopup];
        [_presetsPopup selectItemWithTitle:newPresetName];
    }
}

-(void)sliderGraphChanged{
    [_presetsPopup setTitle:NSLocalizedString(@"Custom",nil)];
    [EQHost setEQEngineFrequencyGains:[sliderView getBandValues]];
}

- (IBAction)resetEQ:(id)sender {
    [_presetsPopup setTitle:NSLocalizedString(@"Flat",nil)];
    NSMutableArray *flatGains = [@[] mutableCopy];
    for (int i = 0; i < [bandMode intValue]; i++) [flatGains addObject:@0];
    [sliderView animateBandsToValues:flatGains];
    [EQHost setEQEngineFrequencyGains:flatGains];
}

-(NSString*)getSelectedPresetName{
    return [_presetsPopup title];
}

-(void)populateOutputPopup{
    [_outputPopup removeAllItems];
    outputDevices = [Devices getAllUsableDevices];
    NSMutableArray *outputDeviceNames = [[NSMutableArray alloc] init];
    for (NSDictionary *device in outputDevices) {
        [outputDeviceNames addObject: [device objectForKey:@"name"]];
    }
    [_outputPopup addItemsWithTitles: [Utilities orderedStringArrayFromStringArray: outputDeviceNames]];
    AudioDeviceID selectedDeviceID = [EQHost EQEngineExists] ? [EQHost getSelectedOutputDeviceID] : [Devices getCurrentDeviceID];
    NSString *nameOfSelectedDevice = [Devices getDeviceNameByID: selectedDeviceID];
    [_outputPopup selectItemWithTitle: nameOfSelectedDevice];
}

- (IBAction)changeOutputDevice:(id)sender {
    AudioDeviceID selectedOutputDevice = [EQHost getSelectedOutputDeviceID];
    for (NSDictionary *device in outputDevices) {
        if ([[device objectForKey:@"name"] isEqualToString: [_outputPopup titleOfSelectedItem]]) {
            selectedOutputDevice = [[device objectForKey:@"id"] intValue];
        }
    }
    [Devices switchToDeviceWithID: selectedOutputDevice];
}

- (IBAction)toggleBandMode:(id)sender {
    bandMode = [bandMode intValue] == 10 ? @31 : @10;
    
    [Storage set: bandMode key: kStorageSelectedBandMode];
    [self populatePresetPopup];
    [self readjustView];
    [self setBandModeSettings];
    [Devices switchToDeviceWithID: [EQHost getSelectedOutputDeviceID]];
}

-(void)setBandModeSettings{
    [sliderView setNSliders: [bandMode intValue]];
    [_showDefaultPresetsCheckbox setEnabled: [bandMode intValue] == 10];
}

-(void)readjustView{
    [Utilities executeBlock:^{
        
        //VOLUME
        Float32 currentVolume = [Devices getVolumeForDeviceID:[Devices getVolumeControllerDeviceID]];
        [_volumeSlider setFloatValue:currentVolume];
        [self changeVolumeIcons:currentVolume];
        
        //BALANCE
        Float32 currentBalance = [Devices getBalanceForDeviceID:[Devices getVolumeControllerDeviceID]];
        [_balanceSlider setFloatValue:currentBalance];
        [self changeBalanceIcons:currentBalance];
    
        [self setBandLabels];
    } after:0.01];
    
    [_bandModeButton setTitle: [[bandMode intValue] == 10 ? @"31" : @"10" stringByAppendingString:@" Bands"]];
    
    CGFloat width = [bandMode intValue] == 10 ? originalWidth : originalWidth * 2;
    CGFloat height = [bandMode intValue] == 10 ? originalHeight : originalHeight - (_optionsView.frame.size.height + _settingsView.frame.size.height);
    
    [self.view setFrame: NSMakeRect(self.view.frame.origin.x, self.view.frame.origin.y, width, height)];
    [notify postNotificationName:@"readjustPopover" object:nil];
    
   
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
    }else if(volume >= QUARTER_VOLUME_STEP && volume <= 0.25){
        [_volumeBars setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol1Light.png"] : [NSImage imageNamed:@"vol1Dark.png"]];
    }else if(volume >0.25 && volume <= 0.5){
        [_volumeBars setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol2Light.png"] : [NSImage imageNamed:@"vol2Dark.png"]];
    }else if(volume >0.5 && volume <= 0.75){
        [_volumeBars setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol3Light.png"] : [NSImage imageNamed:@"vol3Dark.png"]];
    }else if(volume >0.75 && volume <= 1){
        [_volumeBars setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]];
    }
}

- (IBAction)changeBalance:(NSSlider *)sender {
    Float32 balance = [sender floatValue];
    [Devices setBalanceForDevice:[Devices getVolumeControllerDeviceID] to:balance];
    [self changeBalanceIcons: [sender floatValue]];
}

-(void)changeBalanceIcons:(CGFloat)balance{
    if (balance == -1) {
        [_leftSpeaker setImage: [Utilities flipImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol1Light.png"] : [NSImage imageNamed:@"vol1Dark.png"]];
    }else if(balance >-1 && balance <= -0.5){
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol2Light.png"] : [NSImage imageNamed:@"vol2Dark.png"]];
        
    }else if(balance > -0.5 && balance < 0){
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol3Light.png"] : [NSImage imageNamed:@"vol3Dark.png"]];
        
    }else if(balance == 0){
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]];
        
    }else if(balance >0 && balance <= 0.5){
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol3Light.png"] : [NSImage imageNamed:@"vol3Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]];
        
    }else if(balance >0.5 && balance < 1){
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol2Light.png"] : [NSImage imageNamed:@"vol2Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]];
    }else{
        [_leftSpeaker setImage: [Utilities flipImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"vol1Light.png"] : [NSImage imageNamed:@"vol1Dark.png"]]];
        [_rightSpeaker setImage: [Utilities isDarkMode] ? [NSImage imageNamed:@"vol4Light.png"] : [NSImage imageNamed:@"vol4Dark.png"]];
    }
    
}


- (IBAction)reportBug:(id)sender {
    [Utilities openBrowserWithURL:REPO_ISSUES_URL];
}

- (IBAction)supportProject:(id)sender {
    [Utilities openBrowserWithURL:SUPPORT_URL];
}
- (IBAction)getHelp:(id)sender {
    [Utilities openBrowserWithURL:HELP_URL];
}

- (IBAction)changeLaunchOnStartup:(NSButton*)sender {
    [Utilities setLaunchOnLogin:[sender state] == NSOnState ? true : false];
}

- (IBAction)switchShowDefaultPresets:(NSButton *)sender {
    [Storage set:[NSNumber numberWithInteger:[sender state]] key:kStorageShowDefaultPresets];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"showDefaultPresetsChanged" object:nil];
}
- (IBAction)switchShowVolumeHUD:(NSButton *)sender {
    [Storage set:[NSNumber numberWithInteger:[sender state]] key:kStorageShowVolumeHUD];
}

- (IBAction)quitApplication:(id)sender {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
}

- (IBAction)uninstallApplication:(id)sender {
    if([Utilities showAlertWithTitle:NSLocalizedString(@"Uninstall eqMac2?",nil)
                          andMessage:NSLocalizedString(@"Are you sure about this?",nil)
                          andButtons:@[NSLocalizedString(@"Yes, uninstall",nil),NSLocalizedString(@"No, cancel",nil)]] == NSAlertFirstButtonReturn){
        
        if([EQHost EQEngineExists]) [EQHost deleteEQEngine];
        [Utilities runShellScriptWithName:@"uninstall_app"];
        [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
    }
}



@end
