//
//  EQMXPCProtocols.h
//  SharedSource
//
//

// Local Includes
#include "EQM_Types.h"

// System Includes
#import <Foundation/Foundation.h>


#pragma clang assume_nonnull begin

static NSString* kEQMXPCHelperMachServiceName = @kEQMXPCHelperBundleID;

// The protocol that EQMXPCHelper will vend as its XPC API.
@protocol EQMXPCHelperXPCProtocol

// Tells EQMXPCHelper that the caller is EQMApp and passes a listener endpoint that EQMXPCHelper can use to create connections to EQMApp.
// EQMXPCHelper may also pass the endpoint on to EQMDriver so it can do the same.
- (void) registerAsEQMAppWithListenerEndpoint:(NSXPCListenerEndpoint*)endpoint reply:(void (^)(void))reply;
- (void) unregisterAsEQMApp;

// EQMDriver calls this remote method when it wants EQMApp to start IO. EQMXPCHelper passes the message along and then passes the response
// back. This allows EQMDriver to wait for the audio hardware to start up, which means it can let the HAL know when it's safe to start
// sending us audio data from the client.
//
// If EQMApp can be reached, the error it returns will be passed the reply block. Otherwise, the reply block will be passed an error with
// one of the kEQMXPC_* error codes. It may have an underlying error using one of the NSXPCConnection* error codes from FoundationErrors.h.
- (void) startEQMAppPlayThroughSyncWithReply:(void (^)(NSError*))reply forUISoundsDevice:(BOOL)isUI;

// EQMXPCHelper will set the system's default output device to deviceID if it loses its connection
// to EQMApp and EQMApp has left EQMDevice as the default device. It waits for a short time first to
// give EQMApp a chance to fix the connection.
//
// This is so EQMDevice isn't left as the default device if EQMApp crashes or otherwise terminates
// abnormally. If audio is played to EQMDevice and EQMApp isn't running, the user won't hear it.
- (void) setOutputDeviceToMakeDefaultOnAbnormalTermination:(AudioObjectID)deviceID;
    
@end


// The protocol that EQMApp will vend as its XPC API.
@protocol EQMAppXPCProtocol

- (void) startPlayThroughSyncWithReply:(void (^)(NSError*))reply forUISoundsDevice:(BOOL)isUI;

@end

#pragma clang assume_nonnull end

