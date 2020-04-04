//
//  EQM_TestUtils.h
//  SharedSource
//
//

#ifndef __SharedSource__EQM_TestUtils__
#define __SharedSource__EQM_TestUtils__

// Test Framework
#import <XCTest/XCTest.h>

#if defined(__cplusplus)

// STL Includes
#include <functional>


// Fails the test if f doesn't throw ExpectedException when run.
// (The "self" argument is required by XCTFail, presumably so it can report the context.)
template<typename ExpectedException>
void EQMShouldThrow(XCTestCase* self, const std::function<void()>& f)
{
    try
    {
        f();
        XCTFail();
    }
    catch (ExpectedException)
    { }
}

#endif /* defined(__cplusplus) */

#endif /* __SharedSource__EQM_TestUtils__ */

