//
//  EQViewController.m
//  eqMac2
//
//  Created by Romans Kisils on 10/12/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "EQViewController.h"

@interface EQViewController ()

@property (strong) IBOutlet NSButton *deleteButton;
@property (strong) IBOutlet NSPopUpButton *presetsPopup;
@property (strong) IBOutlet NSButton *saveButton;

@property (strong) IBOutlet NSView *bandFrequencyLabelsView;
@property (strong) IBOutlet NSView *mockSliderView;
@property (strong) IBOutlet NSView *bandGainLabelsView;
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

@implementation EQViewController

-(void)viewDidLoad {
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
    [notify addObserver:self selector:@selector(populateOutputPopup) name:@"devicesChanged" object:nil];
   
    [notify addObserver:self selector:@selector(readjustView) name:@"popoverWillOpen" object:nil];
    
    [_buildLabel setStringValue:[@"Build " stringByAppendingString:[Utilities getAppVersion]]];
    
    bandMode = [Storage getSelectedBandMode];
    
    [_showDefaultPresetsCheckbox setState: [Storage getShowDefaultPresets] ? NSOnState : NSOffState];
    
    [self setBandModeSettings];
    [self readjustView];
    [self populatePresetPopup];
    [self populateOutputPopup];
    
    [self readjustVolumeControls];
    [Utilities executeBlock: ^{
        if ([self.view.window isVisible]) {
            [self readjustVolumeControls];
        }
    } every: .5];
}

-(void)viewDidAppear{
    [sliderView forceRedraw];
    [self populateOutputPopup];
    [_deleteButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"deleteLight.png"] : [NSImage imageNamed:@"deleteDark.png"]];
    [_saveButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"saveLight.png"] : [NSImage imageNamed:@"saveDark.png"]];
    [_speakerIcon setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"speakerLight.png"] : [NSImage imageNamed:@"speakerDark.png"]];
    
    [_launchOnStartupCheckbox setState: [Utilities launchOnLogin] ? NSOnState : NSOffState];
    
    [Utilities executeBlock:^{
        [self setState];
    } after:.1];
}
    
-(void)setBandFrequencyLabels{
    NSArray *sliderPositions = [sliderView getSliderXPosition];
    [_bandFrequencyLabelsView setSubviews: [[NSArray alloc] init]];
    NSArray *frequencies = [Constants getFrequenciesForBandMode: [bandMode stringValue]];
    CGFloat labelWidth = 38;
    CGFloat labelHeight = 17;
    CGFloat labelYPos = _bandFrequencyLabelsView.bounds.size.height / 2 - labelHeight / 2;
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
        [label setEditable:NO];
        [_bandFrequencyLabelsView addSubview:label];
    }
}

-(void)setBandGainLabels{
    NSArray *sliderPositions = [sliderView getSliderXPosition];
    [_bandGainLabelsView setSubviews: [[NSArray alloc] init]];
    NSArray *gains = [EQHost getEQEngineFrequencyGains];
    CGFloat labelWidth = 38;
    CGFloat labelHeight = 17;
    CGFloat labelYPos = _bandFrequencyLabelsView.bounds.size.height / 2 - labelHeight / 2;
    int index = -1;
    for(NSNumber *position in sliderPositions) {
        index++;
        CGFloat labelXPos = [position floatValue] - labelWidth / 2;
        NSTextField *label = [[NSTextField alloc] initWithFrame: NSMakeRect(labelXPos, labelYPos, labelWidth, labelHeight)];
        [label setBackgroundColor: [NSColor colorWithRed:0 green:0 blue:0 alpha:0]];
        [label setBordered:NO];
        CGFloat gain = round([Utilities mapValue:[[gains objectAtIndex: index] floatValue] withInMin:-1 InMax:1 OutMin:-24 OutMax:24]);
        [label setStringValue: [NSString stringWithFormat:@"%@%.0f", gain > 0 ? @"+": @"", gain]];
        [label setAlignment: NSCenterTextAlignment];
        [label setEditable:NO];
        CGFloat fontSize = bandMode.intValue == 10 ? 9 : 7;
        [label setFont: [NSFont systemFontOfSize: fontSize]];
        [_bandGainLabelsView addSubview:label];
    }
}

-(void)populatePresetPopup{
    [_presetsPopup removeAllItems];
    NSArray *presets = [Storage getPresetsNames];
    [_presetsPopup addItemsWithTitles: [Utilities orderedStringArrayFromStringArray: presets]];
    [_presetsPopup setTitle: [Storage getSelectedPresetName]];
}

- (IBAction)changePreset:(NSPopUpButton *)sender {
    NSString *presetName = [_presetsPopup title];
    [Storage setSelectedPresetName: presetName];
    NSArray *gains = [Storage getGainsForPresetName: presetName];
    [Storage setSelectedGains: gains];
    [sliderView animateBandsToValues:gains];
    [EQHost setEQEngineFrequencyGains:gains];
    [self setBandGainLabels];
}

- (IBAction)deletePreset:(id)sender {
    if(![[_presetsPopup title] isEqualToString:@"Flat"]){
        [Storage deletePresetWithName:[_presetsPopup title]];
        [self populatePresetPopup];
        [self resetEQ:nil];
    }
}

- (IBAction)savePreset:(NSButton *)sender {
    NSString *newPresetName = [Utilities showAlertWithInputAndTitle:@"Please enter a name for your new preset."];
    if(![newPresetName isEqualToString:@""]){
        [Storage savePresetWithName:newPresetName andGains:[sliderView getBandValues]];
        [Storage setSelectedPresetName: newPresetName];
        [self populatePresetPopup];
        [_presetsPopup selectItemWithTitle:newPresetName];
    }
}

-(void)setState{
    NSLog(@"setState");
    [_presetsPopup setTitle: [Storage getSelectedPresetName]];
    NSArray *selectedGains = [Storage getSelectedGains];
    [EQHost setEQEngineFrequencyGains: selectedGains];
    [sliderView animateBandsToValues: selectedGains];
    [Utilities executeBlock:^{ [self setBandGainLabels];} after:.1];
}

-(void)sliderGraphChanged{
    NSString *popupTitle = @"Custom";
    [_presetsPopup setTitle: popupTitle];
    [Storage setSelectedPresetName: popupTitle];
    NSArray *selectedGains = [sliderView getBandValues];
    [Storage setSelectedGains: selectedGains];
    [Storage setSelectedCustomGains: selectedGains];
    [EQHost setEQEngineFrequencyGains: selectedGains];
    [self setBandGainLabels];
}

- (IBAction)resetEQ:(id)sender {
    NSString *presetName = @"Flat";
    [_presetsPopup setTitle: presetName];
    [Storage setSelectedPresetName: presetName];
    NSMutableArray *flatGains = [@[] mutableCopy];
    for (int i = 0; i < [bandMode intValue]; i++) [flatGains addObject:@0];
    [Storage setSelectedGains: flatGains];
    [sliderView animateBandsToValues:flatGains];
    [EQHost setEQEngineFrequencyGains:flatGains];
    [self setBandGainLabels];
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
    [Devices setOutputVolumeForDeviceID: selectedOutputDevice to: [Devices getOutputVolumeForDeviceID:[Devices getEQMacDeviceID]]];
    [Devices switchToOutputDeviceWithID: selectedOutputDevice];
}

- (IBAction)toggleBandMode:(id)sender {
    [sender setEnabled: NO];
    bandMode = [bandMode intValue] == 10 ? @31 : @10;
    [Storage setSelectedBandMode: bandMode];
    
    [self populatePresetPopup];
    [self readjustView];
    [self setBandModeSettings];
    [Utilities executeBlock:^{
        [EQHost deleteEQEngine];
        [self setState];
        [sender setEnabled: YES];
    } after: 0.1];
}

-(void)setBandModeSettings{
    [sliderView setNSliders: [bandMode intValue]];
    [_showDefaultPresetsCheckbox setEnabled: [bandMode intValue] == 10];
}

-(void)readjustView{
    [Utilities executeBlock:^{
        [self setBandFrequencyLabels];
    } after:0.01];
    
    [_bandModeButton setTitle: [[bandMode intValue] == 10 ? @"31" : @"10" stringByAppendingString:@" Bands"]];
    
    CGFloat width = [bandMode intValue] == 10 ? originalWidth : originalWidth * 2;
    CGFloat height = [bandMode intValue] == 10 ? originalHeight : 338;
    
    [self.view setFrame: NSMakeRect(self.view.frame.origin.x, self.view.frame.origin.y, width, height)];
    [notify postNotificationName:@"readjustPopover" object:nil];
}

-(void)readjustVolumeControls{
    //VOLUME
    Float32 currentVolume = [Devices getOutputVolumeForDeviceID:[Devices getVolumeControllerDeviceID]];
    [_volumeSlider setFloatValue:currentVolume];
    [self changeVolumeIcons:currentVolume];
    
    //BALANCE
    Float32 currentBalance = [Devices getInputBalanceForDeviceID:[Devices getEQMacDeviceID]];
    [_balanceSlider setFloatValue:currentBalance];
    [self changeBalanceIcons:currentBalance];
}

- (IBAction)changeVolume:(id)sender {
    Float32 volume = [sender floatValue];
    [Devices setOutputVolumeForDeviceID:[Devices getVolumeControllerDeviceID] to:volume];
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
    [Devices setInputBalanceForDeviceID: [Devices getEQMacDeviceID] to:balance];
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
    [Storage setShowDefaultPresets: [sender state] == NSOnState];
    [self populatePresetPopup];
}

- (IBAction)quitApplication:(id)sender {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
}

- (IBAction)uninstallApplication:(id)sender {
    if([Utilities showAlertWithTitle:@"Uninstall eqMac2?"
                          andMessage:@"Are you sure about this?"
                          andButtons:@[@"Yes, uninstall",@"No, cancel"]] == NSAlertFirstButtonReturn){
        
        if([Utilities runShellScriptWithName:@"uninstall_driver"]){
            if([EQHost EQEngineExists]) [EQHost deleteEQEngine];
            [Utilities setLaunchOnLogin: NO];
            NSString *helperBundlePath = [[[NSBundle mainBundle] bundlePath] stringByAppendingString:@"/Contents/Resources/eqMac2Helper.app"];
            [Utilities setLaunchOnLogin:NO forBundlePath: helperBundlePath];
            [[NSFileManager defaultManager] removeItemAtPath:[[NSBundle mainBundle] bundlePath] error:nil];
            [[NSNotificationCenter defaultCenter] postNotificationName:@"closeApp" object:nil];
        }
        
    }
}

@end
