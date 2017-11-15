//
//  EQPromotionWindowController.m
//  eqMac2
//
//  Created by Romans Kisils on 13/11/2017.
//  Copyright © 2017 bitgapp. All rights reserved.
//

#import "EQPromotionWindowController.h"

@interface EQPromotionWindowController ()
@property (strong) IBOutlet EQClickableImageView *imageView;
@property (strong) IBOutlet NSButton *button;
@property (strong) NSString *image;
@property (strong) NSString *link;
@end

@implementation EQPromotionWindowController
- (void)windowDidLoad {
    [super windowDidLoad];
    
    [_imageView setTarget:self];
    [_imageView setClickAction:@selector(openLink)];
    [_button setTarget: self];
    
    [API getPromotionWithCallback:^(NSDictionary *resp, NSError * err){
        if (resp && !err) {
            _image = [resp objectForKey:@"image"];
            _link = [resp objectForKey:@"link"];
            NSImage *image = [[NSImage alloc] initWithData: [NSData dataWithContentsOfURL: [NSURL URLWithString: _image]]];
            NSScreen *screen = [NSScreen mainScreen];
            NSSize displayPixelSize = [screen frame].size;
            CGFloat imageWidth = image.size.width;
            CGFloat imageHeight = image.size.height;
            CGFloat titleBarHeight = [self getWindowTitlebarHeight];
            [self.window setFrame:NSMakeRect(displayPixelSize.width - imageWidth - titleBarHeight, displayPixelSize.height - imageHeight - (titleBarHeight * 3), imageWidth, imageHeight + titleBarHeight) display:YES];
            [_imageView setImage:image];
            [self.window makeKeyAndOrderFront: self];
        }
    }];
}


-(void)openLink{
    if (_link) {
        [Utilities openBrowserWithURL: _link];
    }
    [self.window close];
}

- (CGFloat)getWindowTitlebarHeight{
    CGFloat contentHeight = [self.window contentRectForFrameRect: self.window.frame].size.height;
    return self.window.frame.size.height - contentHeight;
}

@end
