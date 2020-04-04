//
//  EQM_Utils.h
//  SharedSource
//
//

#ifndef SharedSource__EQM_Utils
#define SharedSource__EQM_Utils

// PublicUtility Includes
#include "CADebugMacros.h"

#if defined(__cplusplus)

#include "CAException.h"

// STL Includes
#include <functional>

#endif /* defined(__cplusplus) */

// System Includes
#include <mach/error.h>
#include <dispatch/dispatch.h>

#pragma mark Macros

// The Assert macro from CADebugMacros with support for format strings added.
#define EQMAssert(inCondition, inMessage, ...)                                  \
    if(!(inCondition))                                                          \
    {                                                                           \
        DebugMsg(inMessage, ## __VA_ARGS__);                                    \
        __ASSERT_STOP;                                                          \
    }

#define EQMAssertNonNull(expression) \
    EQMAssertNonNull2((expression), #expression)

#define EQMAssertNonNull2(expression, expressionStr) \
    EQMAssert((expression), \
              "%s:%d:%s: '%s' is null", \
              __FILE__, \
              __LINE__, \
              __FUNCTION__, \
              expressionStr);

#pragma mark Objective-C Macros

#if defined(__OBJC__)

#if __has_feature(objc_generics)

// This trick is from https://gist.github.com/robb/d55b72d62d32deaee5fa
@interface EQMNonNullCastHelper<__covariant T>

- (nonnull T) asNonNull;

@end

// Explicitly casts expressions from nullable to non-null. Only works with expressions that
// evaluate to Objective-C objects. Use EQM_Utils::NN for other types.
//
// TODO: Replace existing non-null casts with this.
#define EQMNN(expression) ({ \
        __typeof((expression)) value = (expression); \
        EQMAssertNonNull2(value, #expression); \
        EQMNonNullCastHelper<__typeof((expression))>* helper; \
        (__typeof(helper.asNonNull))value; \
    })

#else /* __has_feature(objc_generics) */

#define EQMNN(expression) ({ \
        id value = (expression); \
        EQMAssertNonNull2(value, #expression); \
        value; \
    })

#endif /* __has_feature(objc_generics) */

#endif /* defined(__OBJC__) */

#pragma mark C++ Macros

#if defined(__cplusplus)

#define EQMLogException(exception) \
    EQM_Utils::LogException(__FILE__, __LINE__, __FUNCTION__, exception)

#define EQMLogExceptionIn(callerName, exception) \
    EQM_Utils::LogException(__FILE__, __LINE__, callerName, exception)

#define EQMLogAndSwallowExceptions(callerName, function) \
    EQM_Utils::LogAndSwallowExceptions(__FILE__, __LINE__, callerName, function)

#define EQMLogAndSwallowExceptionsMsg(callerName, message, function) \
    EQM_Utils::LogAndSwallowExceptions(__FILE__, __LINE__, callerName, message, function)

#define EQMLogUnexpectedException() \
    EQM_Utils::LogUnexpectedException(__FILE__, __LINE__, __FUNCTION__)

#define EQMLogUnexpectedExceptionIn(callerName) \
    EQM_Utils::LogUnexpectedException(__FILE__, __LINE__, callerName)

#define EQMLogUnexpectedExceptions(callerName, function) \
    EQM_Utils::LogUnexpectedExceptions(__FILE__, __LINE__, callerName, function)

#define EQMLogUnexpectedExceptionsMsg(callerName, message, function) \
    EQM_Utils::LogUnexpectedExceptions(__FILE__, __LINE__, callerName, message, function)

#endif /* defined(__cplusplus) */


#pragma clang assume_nonnull begin

#pragma mark C Utility Functions

dispatch_queue_t EQMGetDispatchQueue_PriorityUserInteractive(void);

#if defined(__cplusplus)

#pragma mark C++ Utility Functions

namespace EQM_Utils
{
    // Used to explicitly cast from nullable to non-null. For Objective-C objects, use the EQMNN
    // macro (above).
    template <typename T>
    inline T __nonnull NN(T __nullable v) {
        EQMAssertNonNull(v);
        return static_cast<T __nonnull>(v);
    }
    
    // Log (and swallow) errors returned by Mach functions. Returns false if there was an error.
    bool LogIfMachError(const char* callerName,
                        const char* errorReturnedBy,
                        mach_error_t error);
    
    // Similar to ThrowIfKernelError from CADebugMacros.h, but also logs (in debug builds) the
    // Mach error string that corresponds to the error.
    void ThrowIfMachError(const char* callerName,
                          const char* errorReturnedBy,
                          mach_error_t error);
    
    // If function throws an exception, log an error and continue.
    //
    // Fails/stops debug builds. It's likely that if we log an error for an exception in release
    // builds, even if it's expected (i.e. not a bug in eqMac), we'd want to know if
    // it gets thrown during testing/debugging.
    OSStatus LogAndSwallowExceptions(const char* __nullable fileName,
                                     int lineNumber,
                                     const char* callerName,
                                     const std::function<void(void)>& function);
    
    OSStatus LogAndSwallowExceptions(const char* __nullable fileName,
                                     int lineNumber,
                                     const char* callerName,
                                     const char* __nullable message,
                                     const std::function<void(void)>& function);
    
    void     LogException(const char* __nullable fileName,
                          int lineNumber,
                          const char* callerName,
                          const CAException& e);
    
    void     LogUnexpectedException(const char* __nullable fileName,
                                    int lineNumber,
                                    const char* callerName);
    
    OSStatus LogUnexpectedExceptions(const char* callerName,
                                     const std::function<void(void)>& function);
    
    OSStatus LogUnexpectedExceptions(const char* __nullable fileName,
                                     int lineNumber,
                                     const char* callerName,
                                     const std::function<void(void)>& function);
    
    // Log unexpected exceptions and continue.
    //
    // Generally, you don't want to use this unless the alternative is to crash. And even then
    // crashing is often the better option. (Especially if we've added crash reporting by the
    // time you're reading this.)
    //
    // Fails/stops debug builds.
    //
    // TODO: Allow a format string and args for the message.
    OSStatus LogUnexpectedExceptions(const char* __nullable fileName,
                                     int lineNumber,
                                     const char* callerName,
                                     const char* __nullable message,
                                     const std::function<void(void)>& function);
}

#endif /* defined(__cplusplus) */

#pragma clang assume_nonnull end

#endif /* SharedSource__EQM_Utils */

