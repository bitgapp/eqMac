//
//  BitOperations.swift
//  eqMac

import Foundation

func CountLeadingZeroes(_ x: UInt32) -> UInt32 {
    var x = x
    var n : UInt32 = 32
    var y : UInt32
    
    y = x >> 16; if (y != 0) { n = n - 16; x = y }
    y = x >> 8; if (y != 0) { n = n - 8; x = y }
    y = x >> 4; if (y != 0) { n = n - 4; x = y }
    y = x >> 2; if (y != 0) { n = n - 2; x = y }
    y = x >> 1; if (y != 0) { return n - 2 }
    
    return n - x
}

// base 2 log of next power of two greater or equal to x
func Log2Ceil(_ x: UInt32) -> UInt32 {
    return 32 - CountLeadingZeroes(x - 1)
}

func NextPowerOfTwo(_ x: UInt32) -> UInt32 {
    return 1 << Log2Ceil(x)
}
