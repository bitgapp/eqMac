//
//  EQM_TaskQueue.cpp
//  EQMDriver
//
//

// Self Include
#include "EQM_TaskQueue.h"

// Local Includes
#include "EQM_Types.h"
#include "EQM_Utils.h"
#include "EQM_PlugIn.h"
#include "EQM_Clients.h"
#include "EQM_ClientMap.h"
#include "EQM_ClientTasks.h"

// PublicUtility Includes
#include "CAException.h"
#include "CADebugMacros.h"
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wsign-conversion"
#include "CAAtomic.h"
#pragma clang diagnostic pop

// System Includes
#include <mach/mach_init.h>
#include <mach/mach_time.h>
#include <mach/task.h>


#pragma clang assume_nonnull begin

#pragma mark Construction/destruction

EQM_TaskQueue::EQM_TaskQueue()
:
    // The inline documentation for thread_time_constraint_policy.period says "A value of 0 indicates that there is no
    // inherent periodicity in the computation". So I figure setting the period to 0 means the scheduler will take as long
    // as it wants to wake our real-time thread, which is fine for us, but once it has only other real-time threads can
    // preempt us. (And that's only if they won't make our computation take longer than kRealTimeThreadMaximumComputationNs).
    mRealTimeThread(&EQM_TaskQueue::RealTimeThreadProc,
                    this,
                    /* inPeriod = */ 0,
                    NanosToAbsoluteTime(kRealTimeThreadNominalComputationNs),
                    NanosToAbsoluteTime(kRealTimeThreadMaximumComputationNs),
                    /* inIsPreemptible = */ true),
    mNonRealTimeThread(&EQM_TaskQueue::NonRealTimeThreadProc, this)
{
    // Init the semaphores
    auto createSemaphore = [] () {
        semaphore_t theSemaphore;
        kern_return_t theError = semaphore_create(mach_task_self(), &theSemaphore, SYNC_POLICY_FIFO, 0);
        
        EQM_Utils::ThrowIfMachError("EQM_TaskQueue::EQM_TaskQueue", "semaphore_create", theError);
        
        ThrowIf(theSemaphore == SEMAPHORE_NULL,
                CAException(kAudioHardwareUnspecifiedError),
                "EQM_TaskQueue::EQM_TaskQueue: Could not create semaphore");
        
        return theSemaphore;
    };
    
    mRealTimeThreadWorkQueuedSemaphore = createSemaphore();
    mNonRealTimeThreadWorkQueuedSemaphore = createSemaphore();
    mRealTimeThreadSyncTaskCompletedSemaphore = createSemaphore();
    mNonRealTimeThreadSyncTaskCompletedSemaphore = createSemaphore();
    
    // Pre-allocate enough tasks in mNonRealTimeThreadTasksFreeList that the real-time threads should never have to
    // allocate memory when adding a task to the non-realtime queue.
    for(UInt32 i = 0; i < kNonRealTimeThreadTaskBufferSize; i++)
    {
        EQM_Task* theTask = new EQM_Task;
        mNonRealTimeThreadTasksFreeList.push_NA(theTask);
    }
    
    // Start the worker threads
    mRealTimeThread.Start();
    mNonRealTimeThread.Start();
}

EQM_TaskQueue::~EQM_TaskQueue()
{
    // Join the worker threads
    EQMLogAndSwallowExceptionsMsg("EQM_TaskQueue::~EQM_TaskQueue", "QueueSync", ([&] {
      QueueSync(kEQMTaskStopWorkerThread, /* inRunOnRealtimeThread = */ true);
      QueueSync(kEQMTaskStopWorkerThread, /* inRunOnRealtimeThread = */ false);
    }));

    // Destroy the semaphores
    auto destroySemaphore = [] (semaphore_t inSemaphore) {
        kern_return_t theError = semaphore_destroy(mach_task_self(), inSemaphore);
        
        EQM_Utils::LogIfMachError("EQM_TaskQueue::~EQM_TaskQueue", "semaphore_destroy", theError);
    };
    
    destroySemaphore(mRealTimeThreadWorkQueuedSemaphore);
    destroySemaphore(mNonRealTimeThreadWorkQueuedSemaphore);
    destroySemaphore(mRealTimeThreadSyncTaskCompletedSemaphore);
    destroySemaphore(mNonRealTimeThreadSyncTaskCompletedSemaphore);
    
    EQM_Task* theTask;
    
    // Delete the tasks in the non-realtime tasks free list
    while((theTask = mNonRealTimeThreadTasksFreeList.pop_atomic()) != NULL)
    {
        delete theTask;
    }
    
    // Delete any tasks left on the non-realtime queue that need to be
    while((theTask = mNonRealTimeThreadTasks.pop_atomic()) != NULL)
    {
        if(!theTask->IsSync())
        {
            delete theTask;
        }
    }
}

//static
UInt32  EQM_TaskQueue::NanosToAbsoluteTime(UInt32 inNanos)
{
    // Converts a duration from nanoseconds to absolute time (i.e. number of bus cycles). Used for calculating
    // the real-time thread's time constraint policy.
    
    mach_timebase_info_data_t theTimebaseInfo;
    mach_timebase_info(&theTimebaseInfo);
    
    Float64 theTicksPerNs = static_cast<Float64>(theTimebaseInfo.denom) / theTimebaseInfo.numer;
    return static_cast<UInt32>(inNanos * theTicksPerNs);
}

#pragma mark Task queueing

void    EQM_TaskQueue::QueueSync_SwapClientShadowMaps(EQM_ClientMap* inClientMap)
{
    // TODO: Is there any reason to use uintptr_t when we pass pointers to tasks like this? I can't think of any
    //       reason for a system to have (non-function) pointers larger than 64-bit, so I figure they should fit.
    //
    //       From http://en.cppreference.com/w/cpp/language/reinterpret_cast:
    //       "A pointer converted to an integer of sufficient size and back to the same pointer type is guaranteed
    //        to have its original value [...]"
    QueueSync(kEQMTaskSwapClientShadowMaps, /* inRunOnRealtimeThread = */ true, reinterpret_cast<UInt64>(inClientMap));
}

void    EQM_TaskQueue::QueueAsync_SendPropertyNotification(AudioObjectPropertySelector inProperty, AudioObjectID inDeviceID)
{
    DebugMsg("EQM_TaskQueue::QueueAsync_SendPropertyNotification: Queueing property notification. inProperty=%u inDeviceID=%u",
             inProperty,
             inDeviceID);
    EQM_Task theTask(kEQMTaskSendPropertyNotification, /* inIsSync = */ false, inProperty, inDeviceID);
    QueueOnNonRealtimeThread(theTask);
}

bool    EQM_TaskQueue::Queue_UpdateClientIOState(bool inSync, EQM_Clients* inClients, UInt32 inClientID, bool inDoingIO)
{
    DebugMsg("EQM_TaskQueue::Queue_UpdateClientIOState: Queueing %s %s",
             (inDoingIO ? "kEQMTaskStartClientIO" : "kEQMTaskStopClientIO"),
             (inSync ? "synchronously" : "asynchronously"));
    
    EQM_TaskID theTaskID = (inDoingIO ? kEQMTaskStartClientIO : kEQMTaskStopClientIO);
    UInt64 theClientsPtrArg = reinterpret_cast<UInt64>(inClients);
    UInt64 theClientIDTaskArg = static_cast<UInt64>(inClientID);
    
    if(inSync)
    {
        return QueueSync(theTaskID, false, theClientsPtrArg, theClientIDTaskArg);
    }
    else
    {
        EQM_Task theTask(theTaskID, /* inIsSync = */ false, theClientsPtrArg, theClientIDTaskArg);
        QueueOnNonRealtimeThread(theTask);
        
        // This method's return value isn't used when queueing async, because we can't know what it should be yet.
        return false;
    }
}

UInt64    EQM_TaskQueue::QueueSync(EQM_TaskID inTaskID, bool inRunOnRealtimeThread, UInt64 inTaskArg1, UInt64 inTaskArg2)
{
    DebugMsg("EQM_TaskQueue::QueueSync: Queueing task synchronously to be processed on the %s thread. inTaskID=%d inTaskArg1=%llu inTaskArg2=%llu",
             (inRunOnRealtimeThread ? "realtime" : "non-realtime"),
             inTaskID,
             inTaskArg1,
             inTaskArg2);
    
    // Create the task
    EQM_Task theTask(inTaskID, /* inIsSync = */ true, inTaskArg1, inTaskArg2);
    
    // Add the task to the queue
    TAtomicStack<EQM_Task>& theTasks = (inRunOnRealtimeThread ? mRealTimeThreadTasks : mNonRealTimeThreadTasks);
    theTasks.push_atomic(&theTask);
    
    // Wake the worker thread so it'll process the task. (Note that semaphore_signal has an implicit barrier.)
    kern_return_t theError = semaphore_signal(inRunOnRealtimeThread ? mRealTimeThreadWorkQueuedSemaphore : mNonRealTimeThreadWorkQueuedSemaphore);
    EQM_Utils::ThrowIfMachError("EQM_TaskQueue::QueueSync", "semaphore_signal", theError);
    
    // Wait until the task has been processed.
    //
    // The worker thread signals all threads waiting on this semaphore when it finishes a task. The comments in WorkerThreadProc
    // explain why we have to check the condition in a loop here.
    bool didLogTimeoutMessage = false;
    while(!theTask.IsComplete())
    {
        semaphore_t theTaskCompletedSemaphore =
            inRunOnRealtimeThread ? mRealTimeThreadSyncTaskCompletedSemaphore : mNonRealTimeThreadSyncTaskCompletedSemaphore;
        // TODO: Because the worker threads use semaphore_signal_all instead of semaphore_signal, a thread can miss the signal if
        //       it isn't waiting at the right time. Using a timeout for now as a temporary fix so threads don't get stuck here.
        theError = semaphore_timedwait(theTaskCompletedSemaphore,
                                       (mach_timespec_t){ 0, kRealTimeThreadMaximumComputationNs * 4 });
        
        if(theError == KERN_OPERATION_TIMED_OUT)
        {
            if(!didLogTimeoutMessage && inRunOnRealtimeThread)
            {
                DebugMsg("EQM_TaskQueue::QueueSync: Task %d taking longer than expected.", theTask.GetTaskID());
                didLogTimeoutMessage = true;
            }
        }
        else
        {
            EQM_Utils::ThrowIfMachError("EQM_TaskQueue::QueueSync", "semaphore_timedwait", theError);
        }
        
        CAMemoryBarrier();
    }
    
    if(didLogTimeoutMessage)
    {
        DebugMsg("EQM_TaskQueue::QueueSync: Late task %d finished.", theTask.GetTaskID());
    }
    
    if(theTask.GetReturnValue() != INT64_MAX)
    {
        DebugMsg("EQM_TaskQueue::QueueSync: Task %d returned %llu.", theTask.GetTaskID(), theTask.GetReturnValue());
    }
    
    return theTask.GetReturnValue();
}

void   EQM_TaskQueue::QueueOnNonRealtimeThread(EQM_Task inTask)
{
    // Add the task to our task list
    EQM_Task* freeTask = mNonRealTimeThreadTasksFreeList.pop_atomic();
    
    if(freeTask == NULL)
    {
        LogWarning("EQM_TaskQueue::QueueOnNonRealtimeThread: No pre-allocated tasks left in the free list. Allocating new task.");
        freeTask = new EQM_Task;
    }
    
    *freeTask = inTask;
    
    mNonRealTimeThreadTasks.push_atomic(freeTask);
    
    // Signal the worker thread to process the task. (Note that semaphore_signal has an implicit barrier.)
    kern_return_t theError = semaphore_signal(mNonRealTimeThreadWorkQueuedSemaphore);
    EQM_Utils::ThrowIfMachError("EQM_TaskQueue::QueueOnNonRealtimeThread", "semaphore_signal", theError);
}

#pragma mark Worker threads

void    EQM_TaskQueue::AssertCurrentThreadIsRTWorkerThread(const char* inCallerMethodName)
{
#if DEBUG  // This Assert macro always checks the condition, even in release builds if the compiler doesn't optimise it away
    if(!mRealTimeThread.IsCurrentThread())
    {
        DebugMsg("%s should only be called on the realtime worker thread.", inCallerMethodName);
        __ASSERT_STOP;  // TODO: Figure out a better way to assert with a formatted message
    }
    
    Assert(mRealTimeThread.IsTimeConstraintThread(), "mRealTimeThread should be in a time-constraint priority band.");
#else
    #pragma unused (inCallerMethodName)
#endif
}

//static
void* __nullable    EQM_TaskQueue::RealTimeThreadProc(void* inRefCon)
{
    DebugMsg("EQM_TaskQueue::RealTimeThreadProc: The realtime worker thread has started");
    
    EQM_TaskQueue* refCon = static_cast<EQM_TaskQueue*>(inRefCon);
    refCon->WorkerThreadProc(refCon->mRealTimeThreadWorkQueuedSemaphore,
                             refCon->mRealTimeThreadSyncTaskCompletedSemaphore,
                             &refCon->mRealTimeThreadTasks,
                             NULL,
                             [&] (EQM_Task* inTask) { return refCon->ProcessRealTimeThreadTask(inTask); });
    
    return NULL;
}

//static
void* __nullable    EQM_TaskQueue::NonRealTimeThreadProc(void* inRefCon)
{
    DebugMsg("EQM_TaskQueue::NonRealTimeThreadProc: The non-realtime worker thread has started");
    
    EQM_TaskQueue* refCon = static_cast<EQM_TaskQueue*>(inRefCon);
    refCon->WorkerThreadProc(refCon->mNonRealTimeThreadWorkQueuedSemaphore,
                             refCon->mNonRealTimeThreadSyncTaskCompletedSemaphore,
                             &refCon->mNonRealTimeThreadTasks,
                             &refCon->mNonRealTimeThreadTasksFreeList,
                             [&] (EQM_Task* inTask) { return refCon->ProcessNonRealTimeThreadTask(inTask); });
    
    return NULL;
}

void    EQM_TaskQueue::WorkerThreadProc(semaphore_t inWorkQueuedSemaphore, semaphore_t inSyncTaskCompletedSemaphore, TAtomicStack<EQM_Task>* inTasks, TAtomicStack2<EQM_Task>* __nullable inFreeList, std::function<bool(EQM_Task*)> inProcessTask)
{
    bool theThreadShouldStop = false;
    
    while(!theThreadShouldStop)
    {
        // Wait until a thread signals that it's added tasks to the queue.
        //
        // Note that we don't have to hold any lock before waiting. If the semaphore is signalled before we begin waiting we'll
        // still get the signal after we do.
        kern_return_t theError = semaphore_wait(inWorkQueuedSemaphore);
        EQM_Utils::ThrowIfMachError("EQM_TaskQueue::WorkerThreadProc", "semaphore_wait", theError);
        
        // Fetch the tasks from the queue.
        //
        // The tasks need to be processed in the order they were added to the queue. Since pop_all_reversed is atomic, other threads
        // can't add new tasks while we're reading, which would mix up the order.
        EQM_Task* theTask = inTasks->pop_all_reversed();
        
        while(theTask != NULL &&
              !theThreadShouldStop)  // Stop processing tasks if we're shutting down
        {
            EQM_Task* theNextTask = theTask->mNext;
            
            EQMAssert(!theTask->IsComplete(),
                      "EQM_TaskQueue::WorkerThreadProc: Cannot process already completed task (ID %d)",
                      theTask->GetTaskID());
            
            EQMAssert(theTask != theNextTask,
                      "EQM_TaskQueue::WorkerThreadProc: EQM_Task %p (ID %d) was added to %s multiple times. arg1=%llu arg2=%llu",
                      theTask,
                      theTask->GetTaskID(),
                      (inTasks == &mRealTimeThreadTasks ? "mRealTimeThreadTasks" : "mNonRealTimeThreadTasks"),
                      theTask->GetArg1(),
                      theTask->GetArg2());
            
            // Process the task
            theThreadShouldStop = inProcessTask(theTask);
            
            // If the task was queued synchronously, let the thread that queued it know we're finished
            if(theTask->IsSync())
            {
                // Marking the task as completed allows QueueSync to return, which means it's possible for theTask to point to
                // invalid memory after this point.
                CAMemoryBarrier();
                theTask->MarkCompleted();
                
                // Signal any threads waiting for their task to be processed.
                //
                // We use semaphore_signal_all instead of semaphore_signal to avoid a race condition in QueueSync. It's possible
                // for threads calling QueueSync to wait on the semaphore in an order different to the order of the tasks they just
                // added to the queue. So after each task is completed we have every waiting thread check if it was theirs.
                //
                // Note that semaphore_signal_all has an implicit barrier.
                theError = semaphore_signal_all(inSyncTaskCompletedSemaphore);
                EQM_Utils::ThrowIfMachError("EQM_TaskQueue::WorkerThreadProc", "semaphore_signal_all", theError);
            }
            else if(inFreeList != NULL)
            {
                // After completing an async task, move it to the free list so the memory can be reused
                inFreeList->push_atomic(theTask);
            }
            
            theTask = theNextTask;
        }
    }
}

bool    EQM_TaskQueue::ProcessRealTimeThreadTask(EQM_Task* inTask)
{
    AssertCurrentThreadIsRTWorkerThread("EQM_TaskQueue::ProcessRealTimeThreadTask");
    
    switch(inTask->GetTaskID())
    {
        case kEQMTaskStopWorkerThread:
            DebugMsg("EQM_TaskQueue::ProcessRealTimeThreadTask: Stopping");
            // Return that the thread should stop itself
            return true;
            
        case kEQMTaskSwapClientShadowMaps:
            {
                DebugMsg("EQM_TaskQueue::ProcessRealTimeThreadTask: Swapping the shadow maps in EQM_ClientMap");
                EQM_ClientMap* theClientMap = reinterpret_cast<EQM_ClientMap*>(inTask->GetArg1());
                EQM_ClientTasks::SwapInShadowMapsRT(theClientMap);
            }
            break;
            
        default:
            Assert(false, "EQM_TaskQueue::ProcessRealTimeThreadTask: Unexpected task ID");
            break;
    }
    
    return false;
}

bool    EQM_TaskQueue::ProcessNonRealTimeThreadTask(EQM_Task* inTask)
{
#if DEBUG  // This Assert macro always checks the condition, if for some reason the compiler doesn't optimise it away, even in release builds
    Assert(mNonRealTimeThread.IsCurrentThread(), "ProcessNonRealTimeThreadTask should only be called on the non-realtime worker thread.");
    Assert(mNonRealTimeThread.IsTimeShareThread(), "mNonRealTimeThread should not be in a time-constraint priority band.");
#endif
    
    switch(inTask->GetTaskID())
    {
        case kEQMTaskStopWorkerThread:
            DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Stopping");
            // Return that the thread should stop itself
            return true;
            
        case kEQMTaskStartClientIO:
            DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Processing kEQMTaskStartClientIO");
            try
            {
                EQM_Clients* theClients = reinterpret_cast<EQM_Clients*>(inTask->GetArg1());
                bool didStartIO = EQM_ClientTasks::StartIONonRT(theClients, static_cast<UInt32>(inTask->GetArg2()));
                inTask->SetReturnValue(didStartIO);
            }
            // TODO: Catch the other types of exceptions EQM_ClientTasks::StartIONonRT can throw here as well. Set the task's return
            //       value (rather than rethrowing) so the exceptions can be handled if the task was queued sync. Then
            //       QueueSync_StartClientIO can throw some exception and EQM_StartIO can return an appropriate error code to the
            //       HAL, instead of the driver just crashing.
            //
            //       Do the same for the kEQMTaskStopClientIO case below. And should we set a return value in the catch block for
            //       EQM_InvalidClientException as well, so it can also be rethrown in QueueSync_StartClientIO and then handled?
            catch(EQM_InvalidClientException)
            {
                DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Ignoring EQM_InvalidClientException thrown by StartIONonRT. %s",
                         "It's possible the client was removed before this task was processed.");
            }
            break;

        case kEQMTaskStopClientIO:
            DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Processing kEQMTaskStopClientIO");
            try
            {
                EQM_Clients* theClients = reinterpret_cast<EQM_Clients*>(inTask->GetArg1());
                bool didStopIO = EQM_ClientTasks::StopIONonRT(theClients, static_cast<UInt32>(inTask->GetArg2()));
                inTask->SetReturnValue(didStopIO);
            }
            catch(EQM_InvalidClientException)
            {
                DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Ignoring EQM_InvalidClientException thrown by StopIONonRT. %s",
                         "It's possible the client was removed before this task was processed.");
            }
            break;
            
        case kEQMTaskSendPropertyNotification:
            DebugMsg("EQM_TaskQueue::ProcessNonRealTimeThreadTask: Processing kEQMTaskSendPropertyNotification");
            {
                AudioObjectPropertyAddress thePropertyAddress[] = {
                    { static_cast<UInt32>(inTask->GetArg1()), kAudioObjectPropertyScopeGlobal, kAudioObjectPropertyElementMaster } };
                EQM_PlugIn::Host_PropertiesChanged(static_cast<AudioObjectID>(inTask->GetArg2()), 1, thePropertyAddress);
            }
            break;
            
        default:
            Assert(false, "EQM_TaskQueue::ProcessNonRealTimeThreadTask: Unexpected task ID");
            break;
    }
    
    return false;
}

#pragma clang assume_nonnull end

