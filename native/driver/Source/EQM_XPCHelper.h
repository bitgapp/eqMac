//
//  EQM_XPCHelper.h
//  EQMDriver
//
//

#ifndef EQMDriver__EQM_XPCHelper
#define EQMDriver__EQM_XPCHelper

// System Includes
#include <MacTypes.h>

#if defined(__cplusplus)
extern "C" {
#endif

// On failure, returns one of the kEQMXPC_* error codes, or the error code received from EQMXPCHelper. Returns kEQMXPC_Success otherwise.
UInt64 StartEQMAppPlayThroughSync(bool inIsForUISoundsDevice);

#if defined(__cplusplus)
}
#endif

#endif /* EQMDriver__EQM_XPCHelper */

