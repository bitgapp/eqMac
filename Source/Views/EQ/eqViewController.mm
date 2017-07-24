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
}

-(void)viewWillAppear{
    [Utilities executeBlock:^{ [self openPresetsDropdown:nil]; } after:0.1];
    [_deleteButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"deleteLight"] : [NSImage imageNamed:@"deleteDark"]];
    [_saveButton setImage:[Utilities isDarkMode] ? [NSImage imageNamed:@"saveLight"] : [NSImage imageNamed:@"saveDark"]];
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
    NSArray *presets = [Presets getPresets];
    [_presetsComboBox addItemsWithObjectValues:presets];
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
    NSString *newPresetName = [Utilities showAlertWithInputAndTitle:@"Please enter a name for your new preset."];
    if(![newPresetName isEqualToString:@""]){
        [Presets savePreset:[sliderView getBandValues] withName:newPresetName];
        [self populatePresetComboBox];
        [_presetsButton setTitle:newPresetName];
    }
}

- (IBAction)deletePreset:(id)sender {
    if(![[_presetsButton title] isEqualToString:@"Flat"]){
        [Presets deletePresetWithName:[_presetsButton title]];
        [_presetsButton setTitle:@"Preset"];
        [self populatePresetComboBox];
        [self resetEQ:nil];
    }
}


#pragma mark -
#pragma mark UI Actions
-(void)sliderGraphChanged{
    [_presetsButton setTitle:@"Custom"];
    [EQHost setEQEngineFrequencyGains:[sliderView getBandValues]];
}

- (IBAction)resetEQ:(id)sender {
    [_presetsButton setTitle:@"Flat"];
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

- (IBAction)supportProject:(id)sender {
    [Utilities openBrowserWithURL:SUPPORT_URL];
}

-(NSString*)getSelectedPresetName{
    return [_presetsButton title];
}

-(void)setSelectedPresetName:(NSString*)name{
    [_presetsButton setTitle:name];
}

@end
