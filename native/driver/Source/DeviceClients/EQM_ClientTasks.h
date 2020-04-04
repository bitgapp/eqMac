//
//  EQM_ClientTasks.h
//  EQMDriver
//
//
//  The interface between the client classes (EQM_Client, EQM_Clients and EQM_ClientMap) and EQM_TaskQueue.
//

#ifndef __EQMDriver__EQM_ClientTasks__
#define __EQMDriver__EQM_ClientTasks__

// Local Includes
#include "EQM_Clients.h"
#include "EQM_ClientMap.h"


// Forward Declarations
class EQM_TaskQueue;


#pragma clang assume_nonnull begin

class EQM_ClientTasks
{
    
    friend class EQM_TaskQueue;
    
private:
    static bool                            StartIONonRT(EQM_Clients* inClients, UInt32 inClientID) { return inClients->StartIONonRT(inClientID); }
    static bool                            StopIONonRT(EQM_Clients* inClients, UInt32 inClientID) { return inClients->StopIONonRT(inClientID); }
    
    static void                            SwapInShadowMapsRT(EQM_ClientMap* inClientMap) { inClientMap->SwapInShadowMapsRT(); }
    
};

#pragma clang assume_nonnull end

#endif /* __EQMDriver__EQM_ClientTasks__ */

