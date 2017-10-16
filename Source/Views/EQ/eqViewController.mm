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
@property (strong) IBOutlet NSButton *saveButton;

@property (strong) IBOutlet NSView *mockSliderView;
@property (weak) IBOutlet NSComboBox *presetsComboBox;
@property (strong) IBOutlet NSButton *presetsButton;

@property (strong) IBOutlet NSButton *launchOnStartupCheckbox;
@property (strong) IBOutlet NSButton *showDefaultPresetsCheckbox;
@property (strong) IBOutlet NSButton *showVolumeHUDCheckbox;
@property (strong) IBOutlet NSButton *exitButton;
@property (strong) IBOutlet NSTextField *buildLabel;

@property (strong) IBOutlet NSSlider *volumeSlider;
@property (strong) IBOutlet NSSlider *balanceSlider;
@property (strong) IBOutlet NSImageView *volumeBars;
@property (strong) IBOutlet NSImageView *leftSpeaker;
@property (strong) IBOutlet NSImageView *rightSpeaker;
@property (strong) IBOutlet NSImageView *speakerIcon;

@end


NSArray *bandArray;
SliderGraphView *sliderView;
NSNotificationCenter *notify;

@implementation eqViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  
    sliderView = [[SliderGraphView alloc] initWithFrame: _mockSliderView.frame];
    _mockSliderView = nil;
    [self.view addSubview:sliderView];
    
    [_presetsComboBox setDelegate:self];
    [_presetsComboBox setStringValue:@""];
    
    notify = [NSNotificationCenter defaultCenter];
    [notify addObserver:self selector:@selector(sliderGraphChanged) name:@"sliderGraphChanged" object:nil];
    [notify addObserver:self selector:@selector(populatePresetComboBox) name:@"showDefaultPresetsChanged" object:nil];

    [self populatePresetComboBox];
    NSString *selectedPresetsName = [Storage get:kStorageSelectedPresetName];
    if(selectedPresetsName) [_presetsButton setTitle:selectedPresetsName];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(readjustSettings) name:@"settingsPopoverWillOpen" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(readjustSettings) name:@"changeVolume" object:nil];
}

-(void)viewWillAppear{
    [Utilities executeBlock:^{ [self openPresetsDropdown:nil]; } after:0.1];
    [_deleteButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"deleteLight.png"] : [NSImage imageNamed:@"deleteDark.png"]];
    [_saveButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"saveLight.png"] : [NSImage imageNamed:@"saveDark.png"]];
    
    [self readjustSettings];
    [_speakerIcon setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"speakerLight.png"] : [NSImage imageNamed:@"speakerDark.png"]];
    [_exitButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"exitLight.png"] : [NSImage imageNamed:@"exitDark.png"]];
    
    [_launchOnStartupCheckbox setState: [Utilities launchOnLogin] ? NSOnState : NSOffState];
    [_showDefaultPresetsCheckbox setState:[[Storage get:kStorageShowDefaultPresets] integerValue]];
    [_buildLabel setStringValue:[@"Build " stringByAppendingString:[Utilities getAppVersion]]];
    [_showVolumeHUDCheckbox setState:[[Storage get: kStorageShowVolumeHUD] integerValue]];
}

-(void)viewDidAppear{
    [Utilities executeBlock:^{
        [sliderView animateBandsToValues:[EQHost getEQEngineFrequencyGains]];
    } after:.1];
}

-(void)viewDidDisappear{
    [_presetsComboBox setHidden:NO];
}

#pragma mark -
#pragma mark Presets logic

-(void)populatePresetComboBox{
    [_presetsComboBox removeAllItems];
    NSArray *presets = [Presets getShowablePresetsNames];
    [_presetsComboBox addItemsWithObjectValues:[presets sortedArrayUsingComparator:^NSComparisonResult(NSString *firstString, NSString *secondString) {
        return [[firstString lowercaseString] compare:[secondString lowercaseString]];
    }]];
    [_presetsComboBox setNumberOfVisibleItems:[presets count]];
}

- (IBAction)changePreset:(NSComboBox *)sender {
    NSString *presetName = [sender itemObjectValueAtIndex:[sender indexOfSelectedItem]];
    NSArray *gains = [Presets getGainsForPreset:presetName];
    [sliderView animateBandsToValues:gains];
    [EQHost setEQEngineFrequencyGains:gains];
    [_presetsButton setTitle:presetName];
}

- (IBAction)savePreset:(NSButton *)sender {
    NSString *newPresetName = [Utilities showAlertWithInputAndTitle:NSLocalizedString(@"Please enter a name for your new preset.",nil)];
    if(![newPresetName isEqualToString:@""]){
        [Presets savePreset:[sliderView getBandValues] withName:newPresetName];
        [self populatePresetComboBox];
        [_presetsButton setTitle:newPresetName];
    }
}

- (IBAction)deletePreset:(id)sender {
    if(![[_presetsButton title] isEqualToString:NSLocalizedString(@"Flat",nil)]){
        [Presets deletePresetWithName:[_presetsButton title]];
        [_presetsButton setTitle:@"Preset"];
        [self populatePresetComboBox];
        [self resetEQ:nil];
    }
}


#pragma mark -
#pragma mark UI Actions
-(void)sliderGraphChanged{
    [_presetsButton setTitle:NSLocalizedString(@"Custom",nil)];
    [EQHost setEQEngineFrequencyGains:[sliderView getBandValues]];
}

- (IBAction)resetEQ:(id)sender {
    [_presetsButton setTitle:NSLocalizedString(@"Flat",nil)];
    NSArray *flatGains = @[@0,@0,@0,@0,@0,@0,@0,@0,@0,@0];
    [sliderView animateBandsToValues:flatGains];
    [EQHost setEQEngineFrequencyGains:flatGains];
}

-(IBAction)openPresetsDropdown:(NSButton*)sender{
    if([_presetsComboBox isHidden]){
        [_presetsComboBox setStringValue:@""];
        [_presetsComboBox setHidden:NO];
        [_presetsComboBox.cell performSelector:@selector(popUp:)];
    }else{
        [_presetsComboBox setHidden:YES];
    }
}

-(void)comboBoxWillDismiss:(NSNotification *)notification{
    [_presetsComboBox setHidden:YES];
}

-(NSString*)getSelectedPresetName{
    return [_presetsButton title];
}

-(void)setSelectedPresetName:(NSString*)name{
    [_presetsButton setTitle:name];
}

-(void)readjustSettings{
    [Utilities executeBlock:^{
        
        //VOLUME
        Float32 currentVolume = [Devices getVolumeForDeviceID:[Devices getVolumeControllerDeviceID]];
        [_volumeSlider setFloatValue:currentVolume];
        [self changeVolumeIcons:currentVolume];
        
        //BALANCE
        Float32 currentBalance = [Devices getBalanceForDeviceID:[Devices getVolumeControllerDeviceID]];
        [_balanceSlider setFloatValue:currentBalance];
        [self changeBalanceIcons:currentBalance];
        
    } after:0.01];
}

- (IBAction)switchShowDefaultPresets:(NSButton *)sender {
    [Storage set:[NSNumber numberWithInteger:[sender state]] key:kStorageShowDefaultPresets];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"showDefaultPresetsChanged" object:nil];
}
- (IBAction)switchShowVolumeHUD:(NSButton *)sender {
    [Storage set:[NSNumber numberWithInteger:[sender state]] key:kStorageShowVolumeHUD];
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
    [Devices setBalanceForDevice:[Devices getVolumeControllerDeviceID] to:balance];
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
- (IBAction)changeLaunchOnStartup:(NSButton*)sender {
    [Utilities setLaunchOnLogin:[sender state] == NSOnState ? true : false];
}
- (IBAction)openWebsite:(id)sender {
    [sender setHighlighted:NO];
    [Utilities openBrowserWithURL:APP_URL];
}



@end
