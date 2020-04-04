//
//  EQM_TaskQueue.h
//  EQMDriver
//
//

#ifndef __EQMDriver__EQM_TaskQueue__
#define __EQMDriver__EQM_TaskQueue__

// PublicUtility Includes
#include "CAPThread.h"
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wsign-conversion"
#include "CAAtomicStack.h"
#pragma clang diagnostic pop

// STL Includes
#include <functional>

// System Includes
#include <mach/semaphore.h>
#include <CoreAudio/AudioHardware.h>


// Forward declarations
class EQM_Clients;
class EQM_ClientMap;


#pragma clang assume_nonnull begin

//==================================================================================================
//	EQM_TaskQueue
//
//  This class has two worker threads, one with real-time priority and one with default priority,
//  that tasks can be dispatched to. The two main use cases are dispatching work from a real-time
//  thread to be done async, and dispatching work from a non-real-time thread that needs to run on
//  a real-time thread to avoid priority inversions.
//==================================================================================================

class EQM_TaskQueue
{
    
private:
    enum EQM_TaskID {
        kEQMTaskUninitialized,
        kEQMTaskStopWorkerThread,
        
        // Realtime thread only
        kEQMTaskSwapClientShadowMaps,
        
        // Non-realtime thread only
        kEQMTaskStartClientIO,
        kEQMTaskStopClientIO,
        kEQMTaskSendPropertyNotification
    };
    
    class EQM_Task
    {
    public:
                                        EQM_Task(EQM_TaskID inTaskID = kEQMTaskUninitialized, bool inIsSync = false, UInt64 inArg1 = 0, UInt64 inArg2 = 0) : mNext(NULL), mTaskID(inTaskID), mIsSync(inIsSync), mArg1(inArg1), mArg2(inArg2) { };
        
        EQM_TaskID                      GetTaskID() { return mTaskID; }
        
        // True if the thread that queued this task is blocking until the task is completed
        bool                            IsSync() { return mIsSync; }
        
        UInt64                          GetArg1() { return mArg1; }
        UInt64                          GetArg2() { return mArg2; }
        
        UInt64                          GetReturnValue() { return mReturnValue; }
        void                            SetReturnValue(UInt64 inReturnValue) { mReturnValue = inReturnValue; }
        
        bool                            IsComplete() { return mIsComplete; }
        void                            MarkCompleted() { mIsComplete = true; }
        
        // Used by TAtomicStack
        EQM_Task* __nullable &          next() { return mNext; }
        EQM_Task* __nullable            mNext;
        
    private:
        EQM_TaskID                      mTaskID;
        bool                            mIsSync;
        UInt64                          mArg1;
        UInt64                          mArg2;
        UInt64                          mReturnValue = INT64_MAX;
        bool                            mIsComplete = false;
    };
    
public:
                                        EQM_TaskQueue();
                                        ~EQM_TaskQueue();
                                        // Disallow copying
                                        EQM_TaskQueue(const EQM_TaskQueue&) = delete;
                                        EQM_TaskQueue& operator=(const EQM_TaskQueue&) = delete;
    
private:
    static UInt32                       NanosToAbsoluteTime(UInt32 inNanos);
    
public:
    void                                QueueSync_SwapClientShadowMaps(EQM_ClientMap* inClientMap);
    
    // Sends a property changed notification to the EQMDevice host. Assumes the scope and element are kAudioObjectPropertyScopeGlobal and
    // kAudioObjectPropertyElementMaster because currently those are the only ones we use.
    void                                QueueAsync_SendPropertyNotification(AudioObjectPropertySelector inProperty, AudioObjectID inDeviceID);
    
    // Set/unset a client's is-doing-IO flag
    
    inline bool                         QueueSync_StartClientIO(EQM_Clients* inClients, UInt32 inClientID) { return Queue_UpdateClientIOState(true, inClients, inClientID, true); }
    inline bool                         QueueSync_StopClientIO(EQM_Clients* inClients, UInt32 inClientID) { return Queue_UpdateClientIOState(true, inClients, inClientID, false); }
    
    inline void                         QueueAsync_StartClientIO(EQM_Clients* inClients, UInt32 inClientID) { Queue_UpdateClientIOState(false, inClients, inClientID, true); }
    inline void                         QueueAsync_StopClientIO(EQM_Clients* inClients, UInt32 inClientID) { Queue_UpdateClientIOState(false, inClients, inClientID, false); }
    
private:
    bool                                Queue_UpdateClientIOState(bool inSync, EQM_Clients* inClients, UInt32 inClientID, bool inDoingIO);
    
    UInt64                              QueueSync(EQM_TaskID inTaskID, bool inRunOnRealtimeThread, UInt64 inTaskArg1 = 0, UInt64 inTaskArg2 = 0);
    
    void                                QueueOnNonRealtimeThread(EQM_Task inTask);
    
public:
    void                                AssertCurrentThreadIsRTWorkerThread(const char* inCallerMethodName);
    
private:
    static void* __nullable             RealTimeThreadProc(void* inRefCon);
    static void* __nullable             NonRealTimeThreadProc(void* inRefCon);
    
    void                                WorkerThreadProc(semaphore_t inWorkQueuedSemaphore, semaphore_t inSyncTaskCompletedSemaphore, TAtomicStack<EQM_Task>* inTasks, TAtomicStack2<EQM_Task>* __nullable inFreeList, std::function<bool(EQM_Task*)> inProcessTask);
    
    // These return true when the thread should be stopped
    bool                                ProcessRealTimeThreadTask(EQM_Task* inTask);
    bool                                ProcessNonRealTimeThreadTask(EQM_Task* inTask);
    
private:
    // The worker threads that perform the queued tasks
    CAPThread                           mRealTimeThread;
    CAPThread                           mNonRealTimeThread;
    
    // The approximate amount of time we'll need whenever our real-time thread is scheduled. This is currently just
    // set to the minimum (see sched_prim.c) because our real-time tasks do very little work.
    //
    // TODO: Would it be better to specify these in absolute time, which would make them relative to the system's bus
    //       speed? Or even calculate them from the system's CPU/RAM speed? Note that none of our tasks actually have
    //       a deadline (though that might change). They just have to run with real-time priority to avoid causing
    //       priority inversions on the IO thread.
    static const UInt32                 kRealTimeThreadNominalComputationNs = 50 * NSEC_PER_USEC;
    // The maximum amount of time the real-time thread can take to finish its computation after being scheduled.
    static const UInt32                 kRealTimeThreadMaximumComputationNs = 60 * NSEC_PER_USEC;
    
    // We use Mach semaphores for communication with the worker threads because signalling them is real-time safe.
    
    // Signalled to tell the worker threads when there are tasks for them process.
    semaphore_t                         mRealTimeThreadWorkQueuedSemaphore;
    semaphore_t                         mNonRealTimeThreadWorkQueuedSemaphore;
    // Signalled when a worker thread completes a task, if the thread that queued that task is blocking on it.
    semaphore_t                         mRealTimeThreadSyncTaskCompletedSemaphore;
    semaphore_t                         mNonRealTimeThreadSyncTaskCompletedSemaphore;
    
    // When a task is queued we add it to one of these, depending on which worker thread it will run on. Using
    // TAtomicStack lets us safely add and remove tasks on real-time threads.
    //
    // We use TAtomicStack rather than TAtomicStack2 because we need pop_all_reversed() to make sure we process the
    // tasks in order. (It might have been better to use OSAtomicFifoEnqueue/OSAtomicFifoDequeue, but I only
    // recently found out about them.)
    TAtomicStack<EQM_Task>              mRealTimeThreadTasks;
    TAtomicStack<EQM_Task>              mNonRealTimeThreadTasks;
    
    // The number of tasks to pre-allocate and add to the non-realtime task free list. Should be large enough that
    // the free list is never emptied. (At least not while IO could be running.)
    static const UInt32                 kNonRealTimeThreadTaskBufferSize = 512;
    // Realtime threads can't safely allocate memory, so when they queue a task the memory for it comes from this
    // free list. We pre-allocate as many tasks as they should ever need in the constructor. (But if the free list
    // runs out of tasks somehow the realtime thread will allocate a new one.)
    //
    // There's a similar free list used in Apple's CAThreadSafeList.h.
    //
    // We can use TAtomicStack2 instead of TAtomicStack because we never call pop_all on the free list.
    TAtomicStack2<EQM_Task>             mNonRealTimeThreadTasksFreeList;
    
};

#pragma clang assume_nonnull end

#endif /* __EQMDriver__EQM_TaskQueue__ */

