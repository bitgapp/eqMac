//
//  SliderGraphView.m
//  eqMac2
//
//  Created by Roman on 06/03/2016.
//  Copyright © 2016 bitgapp. All rights reserved.
//

#import "SliderGraphView.h"


CGFloat knobSize;
CGFloat sliderBarWidth;
UInt nSliders;
bool dragging;
int sliderSelected;
NSMutableArray *topBars;
NSMutableArray *bottomBars;
NSTimer *knobAnimationTimer;
NSBezierPath *selectedKnob;
NSMutableArray *knobArray;
NSMutableArray *sliderBarArray;
NSColor *drawingColor;
NSBezierPath *graph;
NSBezierPath *middleLine;
NSMutableArray *bandValues;
CGFloat padding;

@implementation SliderGraphView

#pragma mark Initialization

-(id)initWithFrame:(NSRect)frameRect{
    self = [super initWithFrame:frameRect];
    if(self){
        nSliders = 10;
        knobSize = 10;
        sliderBarWidth = 3;
        padding = 5;
        dragging = false;
    }
    return self;
}


-(void)generateAssets{
    knobArray = [[NSMutableArray alloc] init];
    sliderBarArray = [[NSMutableArray alloc] init];
    CGFloat x = padding;
    CGFloat y = self.bounds.size.height/2 - knobSize/2;
    CGFloat gap = (self.bounds.size.width - knobSize * nSliders - padding * 2) / (nSliders - 1) + knobSize;
    for(int i = 0; i < nSliders; i++){
        NSBezierPath *knob = [NSBezierPath bezierPathWithOvalInRect:CGRectMake(x, y, knobSize, knobSize)];
        [knobArray addObject:knob];
        [sliderBarArray addObject:[NSBezierPath bezierPathWithRect:CGRectMake(x + knobSize/2 - sliderBarWidth/2, 0, sliderBarWidth, self.bounds.size.height)]];
        x+=gap;
    }
    middleLine = [NSBezierPath bezierPathWithRect:CGRectMake([[sliderBarArray firstObject] bounds].origin.x, self.bounds.size.height/2 - sliderBarWidth/4, [[sliderBarArray lastObject] bounds].origin.x - [[sliderBarArray firstObject] bounds].origin.x, sliderBarWidth/2)];
    
    topBars = [[NSMutableArray alloc] init];
    bottomBars = [[NSMutableArray alloc] init];
    NSImage *propImage = [NSImage imageNamed:@"blueLine.png"];
    for (int i = 0; i <= self.bounds.size.height/2/propImage.size.height; i++) {
        NSImage *topBar = [NSImage imageNamed:@"blueLine.png"];
        NSImage *bottomBar = [NSImage imageNamed:@"redLine.png"];
        [topBar setSize:CGSizeMake([[sliderBarArray lastObject] bounds].origin.x - [[sliderBarArray firstObject] bounds].origin.x, topBar.size.height)];
        [bottomBar setSize:CGSizeMake([[sliderBarArray lastObject] bounds].origin.x - [[sliderBarArray firstObject] bounds].origin.x, bottomBar.size.height)];
        [topBars addObject:topBar];
        [bottomBars addObject:bottomBar];
    }

    [self newGraphFromKnobs];
}

#pragma mark Drawing
-(void)drawRect:(NSRect)dirtyRect {
    if(!knobArray || !sliderBarArray) [self generateAssets];
    [super drawRect:dirtyRect];
    
    [graph addClip];
    int count = 0;
    for(NSImage *bar in topBars){
        [bar drawAtPoint:CGPointMake([[sliderBarArray firstObject] bounds].origin.x, (self.bounds.size.height/2 + (count * bar.size.height))) fromRect:NSZeroRect operation:NSCompositeSourceOver fraction: 1 - (count*.1)];
        count++;
    }
    
    count = 0;
    for(NSImage *bar in bottomBars){
        [bar drawAtPoint:CGPointMake([[sliderBarArray firstObject] bounds].origin.x, (self.bounds.size.height/2 - ((count + 1) * bar.size.height))) fromRect:NSZeroRect operation:NSCompositeSourceOver fraction: 1 - (count*.1)];
        
        count++;
    }
    
    [NSGraphicsContext restoreGraphicsState];
    
    drawingColor = [Utilities isDarkMode] ? [NSColor whiteColor] : [NSColor blackColor];
    [drawingColor set];
    [graph setLineWidth:sliderBarWidth];
    [graph stroke];
    
    drawingColor =  [Utilities isDarkMode] ? [NSColor colorWithRed:0.85 green:0.85 blue:0.85 alpha:1] : [NSColor colorWithRed:0.15 green:0.15 blue:0.15 alpha:1];
    [drawingColor set];
    for(NSBezierPath *bar in sliderBarArray){
        [bar fill];
    }
    
    [middleLine fill];
    NSMutableArray *tempArray = [[NSMutableArray alloc] init];

    for(NSBezierPath *knob in knobArray){
        drawingColor = [Utilities isDarkMode] ? [NSColor colorWithRed:0.85 green:0.85 blue:0.85 alpha:1] : [NSColor colorWithRed:0.15 green:0.15 blue:0.15 alpha:1];
        [drawingColor set];
        [knob fill];
        drawingColor = [Utilities isDarkMode] ? [NSColor colorWithRed:0.15 green:0.15 blue:0.15 alpha:1] : [NSColor colorWithRed:0.85 green:0.85 blue:0.85 alpha:1];
        [drawingColor set];
        [knob stroke];
        [tempArray addObject:[NSNumber numberWithFloat:[self mapValue:knob.bounds.origin.y inMin:0 inMax:self.bounds.size.height-knobSize outMin:-1 outMax:1]]];
    }
    bandValues = tempArray;
}

#pragma mark Mouse events

-(void)mouseDragged:(NSEvent*)e{
    CGPoint point = [self convertPoint:[e locationInWindow] fromView:nil];
    if(dragging){
        if(point.y > self.bounds.size.height - knobSize/2 || point.y < knobSize/2) return;
        NSAffineTransform *transform = [NSAffineTransform transform];
        CGPoint knobPos = [[knobArray objectAtIndex:sliderSelected] bounds].origin;
        CGFloat knobPosY = knobPos.y + knobSize/2;
        CGFloat halfHeight = self.bounds.size.height / 2;
        CGFloat diffFromKnobToPoint = point.y - knobPosY;
        CGFloat distFromKnobToPoint = diffFromKnobToPoint >=0 ? diffFromKnobToPoint : -diffFromKnobToPoint;
        CGFloat diffFromKnobToMiddle = halfHeight - knobPosY;
        CGFloat distFromKnobToMiddle = diffFromKnobToMiddle >= 0 ? diffFromKnobToMiddle : -diffFromKnobToMiddle;
        BOOL dirUp = diffFromKnobToPoint > 0;
        
        CGFloat yTransform = diffFromKnobToPoint;
        if(distFromKnobToMiddle < 3){
            if((dirUp && diffFromKnobToMiddle > 0) || (!dirUp && diffFromKnobToMiddle < 0)){
                yTransform = diffFromKnobToMiddle;
                [[NSHapticFeedbackManager defaultPerformer] performFeedbackPattern:NSHapticFeedbackPatternAlignment performanceTime:NSHapticFeedbackPerformanceTimeDefault];
            }
        }
        
        if(round(knobPosY) == round(halfHeight) && distFromKnobToPoint < 7){
            yTransform = 0;
        }
        
        [transform translateXBy: 0 yBy: yTransform];
        [[knobArray objectAtIndex:sliderSelected] transformUsingAffineTransform: transform];
        [self newGraphFromKnobs];
        [self postNotification];
        return;
    }else{
        sliderSelected = 0;
        for(NSBezierPath *knob in knobArray){
            if([knob containsPoint:point]){
                dragging = true;
                [self transformKnob:knob toPoint:point  withAdjustment:YES];
                [self newGraphFromKnobs];
                [self postNotification];
                return;
            }else{
                sliderSelected++;
            }
        }
    }
    [[NSNotificationCenter defaultCenter] postNotificationName:@"sliderGraphChanged" object:self];
}

-(void)mouseDown:(NSEvent *)e{
    CGPoint point = [self convertPoint:[e locationInWindow] fromView:nil];
    for(NSBezierPath *knob in knobArray){
        if([knob containsPoint:CGPointMake(point.x, knob.bounds.origin.y + knobSize/2)]){
            [self transformKnob:knob toPoint:point withAdjustment:YES];
            [self newGraphFromKnobs];
            [self postNotification];
            return;
        }
    }
}

-(void)postNotification{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"sliderGraphChanged" object:self];
}

-(void)mouseUp:(NSEvent *)e{
        if(dragging){
            dragging = false;
            sliderSelected = 0;
        }
}

#pragma mark External methods
-(void)animateBandsToValues:(NSArray*)values{
    if([values count] != nSliders){
        return;
    }
    
    NSMutableArray *steps = [[NSMutableArray alloc] init];
    for(int s = 0; s < nSliders; s++){
        CGFloat yPointToReach = [self mapValue:[[values objectAtIndex:s] floatValue] inMin:-1 inMax:1 outMin:0 outMax: self.bounds.size.height];
        CGFloat diff =  yPointToReach - ([[knobArray objectAtIndex:s] bounds].origin.y + knobSize/2);
        CGFloat step = diff/30;
        [steps addObject:[NSNumber numberWithFloat:step]];
    }
    
    [self animateFrameWithSteps:steps andFrame:0];
    
    
}

-(void)animateFrameWithSteps:(NSArray*)steps andFrame:(int)frame{
    
    int k = 0;
    for(NSBezierPath* knob in knobArray){
        NSAffineTransform *transform = [NSAffineTransform transform];
        [transform translateXBy: 0 yBy: [[steps objectAtIndex:k] floatValue]];
        [knob transformUsingAffineTransform: transform];
        
        k++;
    }
    [self newGraphFromKnobs];
    
    frame++;
    if(frame < 30){
        CGFloat delayInSeconds = frame*0.001;
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            [self animateFrameWithSteps:steps andFrame:frame];
        });
    }else{
        return;
    }
    
}

#pragma mark Helpers



-(void)transformKnob:(NSBezierPath*)knob toPoint:(CGPoint)point withAdjustment:(BOOL)withAdjustment{
    if(point.y > self.bounds.size.height - knobSize/2 || point.y < knobSize/2) return;
    CGPoint knobPos = knob.bounds.origin;
    NSAffineTransform *transform = [NSAffineTransform transform];
    CGFloat adjustment = knobPos.y;
    if(withAdjustment){
        adjustment += knobSize/2;
    }
    [transform translateXBy: 0 yBy: point.y - adjustment];
    [knob transformUsingAffineTransform: transform];
}

-(void)newGraphFromKnobs{
    NSMutableArray *points = [[NSMutableArray alloc] init];
    for(NSBezierPath *knob in knobArray){
        NSValue *value = [NSValue valueWithPoint:CGPointMake(knob.bounds.origin.x + knobSize/2, knob.bounds.origin.y + knobSize/2)];
        [points addObject: value];
    }
    graph = [self generateBezierPathFromPoints:points];
    [self setNeedsDisplay:YES];
}


-(CGFloat)mapValue:(CGFloat)x inMin:(CGFloat)in_min inMax:(CGFloat)in_max outMin:(CGFloat)out_min outMax:(CGFloat) out_max{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

- (NSBezierPath*)generateBezierPathFromPoints:(NSMutableArray *)points{
    NSBezierPath *path = [NSBezierPath bezierPath];
    float granularity = 100;
    [points insertObject:[NSValue valueWithPoint:CGPointMake([[points firstObject] pointValue].x, self.bounds.size.height/2)] atIndex:0];
    [points addObject:[NSValue valueWithPoint:CGPointMake([[points lastObject] pointValue].x, self.bounds.size.height/2)]];
    [path moveToPoint:[[points firstObject] pointValue]];
    
    for (int index = 1; index < points.count - 2 ; index++) {
        CGPoint point0 = [[points objectAtIndex:index - 1] pointValue];
        CGPoint point1 = [[points objectAtIndex:index] pointValue];
        CGPoint point2 = [[points objectAtIndex:index + 1] pointValue];
        CGPoint point3 = [[points objectAtIndex:index + 2] pointValue];
        
        for (int i = 1; i < granularity ; i++) {
            float t = (float) i * (1.0f / (float) granularity);
            float tt = t * t;
            float ttt = tt * t;
            
            CGPoint pi;
            pi.x = 0.5 * (2*point1.x+(point2.x-point0.x)*t + (2*point0.x-5*point1.x+4*point2.x-point3.x)*tt + (3*point1.x-point0.x-3*point2.x+point3.x)*ttt);
            pi.y = 0.5 * (2*point1.y+(point2.y-point0.y)*t + (2*point0.y-5*point1.y+4*point2.y-point3.y)*tt + (3*point1.y-point0.y-3*point2.y+point3.y)*ttt);
            
            if (pi.x > point0.x) {
                [path lineToPoint:pi];
            }
        }
        
        [path lineToPoint:point2];
    }
    
    [path lineToPoint:[[points objectAtIndex:[points count] - 1] pointValue]];
    return path;
    
}

-(NSArray*)getBandValues{
    return bandValues;
}
    
-(NSArray*)getSliderXPosition{
    NSMutableArray *positions = [[NSMutableArray alloc] init];
    for (NSBezierPath *knob in knobArray) {
        [positions addObject: [NSNumber numberWithFloat: knob.bounds.origin.x + knobSize / 2]];
    }
    return positions;
}

-(void)setNSliders:(int)number{
    nSliders = number;
    knobArray = nil;
    [self forceRedraw];
}

-(void)forceRedraw{
    [self setHidden:YES];
    [self setHidden:NO];
}

@end
