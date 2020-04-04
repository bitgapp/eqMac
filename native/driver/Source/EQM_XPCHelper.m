//
//  EQM_XPCHelper.cpp
//  EQMDriver
//
//

// Self Include
#import "EQM_XPCHelper.h"

// Local Includes
#import "EQMXPCProtocols.h"

// PublicUtility Includes
#include "CADebugMacros.h"

// System Includes
#import <Foundation/Foundation.h>


#pragma clang assume_nonnull begin

static const UInt64 REMOTE_CALL_DEFAULT_TIMEOUT_SECS = 30;

static NSXPCConnection* CreateXPCHelperConnection()
{
    // Create a connection to EQMXPCHelper's Mach service. If it isn't already running, launchd will start EQMXPCHelper when we send
    // a message to this connection.
    //
    // Uses the NSXPCConnectionPrivileged option because EQMXPCHelper has to run in the privileged/global bootstrap context for
    // EQMDriver to be able to look it up. EQMDriver runs in the coreaudiod process, which runs in the global context, and services
    // in the global context are only able to look up other services in that context.
    NSXPCConnection* theConnection = [[NSXPCConnection alloc] initWithMachServiceName:kEQMXPCHelperMachServiceName
                                                                              options:NSXPCConnectionPrivileged];
    
    if (theConnection) {
        theConnection.remoteObjectInterface = [NSXPCInterface interfaceWithProtocol:@protocol(EQMXPCHelperXPCProtocol)];
        [theConnection resume];
    } else {
        @throw(@"EQM_XPCHelper::CreateXPCHelperConnection: initWithMachServiceName returned nil");
    }
    
    return theConnection;
}

UInt64 StartEQMAppPlayThroughSync(bool inIsForUISoundsDevice)
{
    __block UInt64 theAnswer = kEQMXPC_Success;
    
    // Connect to our XPC helper.
    //
    // We can't initiate an XPC connection with EQMApp directly for security reasons, so we use EQMXPCHelper as an intermediary. (We
    // could use EQMXPCHelper to initiate the connection and then talk to EQMApp directly, but so far we haven't had any reason to.)
    //
    // It would be faster to keep the connection ready whenever EQMApp is a client of EQMDevice, but it's not important for this case.
    NSXPCConnection* theConnection = CreateXPCHelperConnection();
    
    // This semaphore will be signalled when we get a reply from EQMXPCHelper, or the message fails.
    dispatch_semaphore_t theReplySemaphore = dispatch_semaphore_create(0);
   
    // Set the failure callbacks to signal the reply semaphore so we can return immediately if EQMXPCHelper can't be reached. (It
    // doesn't matter how many times we signal the reply semaphore because we create a new one each time.)
    void (^failureHandler)(void) = ^{
        DebugMsg("EQM_XPCHelper::StartEQMAppPlayThroughSync: Connection to EQMXPCHelper failed");
        
        theAnswer = kEQMXPC_MessageFailure;
        dispatch_semaphore_signal(theReplySemaphore);
    };
    theConnection.interruptionHandler = failureHandler;
    theConnection.invalidationHandler = failureHandler;
    
    // This remote call to EQMXPCHelper will send a reply when the output device is ready to receive IO. Note that, for security
    // reasons, we shouldn't trust the reply object.
    [[theConnection remoteObjectProxyWithErrorHandler:^(NSError* error) {
        (void)error;
        DebugMsg("EQM_XPCHelper::StartEQMAppPlayThroughSync: Remote call error: %s",
                 [[error debugDescription] UTF8String]);
        
        failureHandler();
    }] startEQMAppPlayThroughSyncWithReply:^(NSError* reply) {
        DebugMsg("EQM_XPCHelper::StartEQMAppPlayThroughSync: Got reply from EQMXPCHelper: \"%s\"",
                 [[reply localizedDescription] UTF8String]);
        
        theAnswer = kEQMXPC_MessageFailure;

        @try {
            if (reply)
            {
                theAnswer = (UInt64)[reply code];
            }
        } @catch(...) {
            NSLog(@"EQM_XPCHelper::StartEQMAppPlayThroughSync: Exception while reading reply code");
        }
        
        // We only need the connection for one call, which was successful, so the losing the connection is no longer a problem.
        theConnection.interruptionHandler = nil;
        theConnection.invalidationHandler = nil;
        
        // Tell the enclosing function it can return now.
        dispatch_semaphore_signal(theReplySemaphore);
    } forUISoundsDevice:inIsForUISoundsDevice];
    
    DebugMsg("EQM_XPCHelper::StartEQMAppPlayThroughSync: Waiting for EQMApp to tell us the output device is ready for IO");
    
    // Wait on the reply semaphore until we get the reply (or a connection failure).
    if (0 != dispatch_semaphore_wait(theReplySemaphore,
                                     dispatch_time(DISPATCH_TIME_NOW, REMOTE_CALL_DEFAULT_TIMEOUT_SECS * NSEC_PER_SEC))) {
        // Log a warning if we timeout.
        //
        // TODO: It's possible that the output device is just taking a really long time to start. Is there some way we could check for
        //       that, rather than timing out?
        NSLog(@"EQM_XPCHelper::StartEQMAppPlayThroughSync: Timed out waiting for the eqMac app to start the output device");
        
        theAnswer = kEQMXPC_Timeout;
    }
    
   [theConnection invalidate];
    
    return theAnswer;
}

#pragma clang assume_nonnull end

