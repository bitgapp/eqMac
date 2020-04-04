//
//  CwlSysctl.swift
//  CwlUtils
//
//  Created by Matt Gallagher on 2016/02/03.
//  Copyright © 2016 Matt Gallagher ( http://cocoawithlove.com ). All rights reserved.
//
//  Permission to use, copy, modify, and/or distribute this software for any
//  purpose with or without fee is hereby granted, provided that the above
//  copyright notice and this permission notice appear in all copies.
//
//  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
//  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
//  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
//  SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
//  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
//  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
//  IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//
import Foundation

/// A "static"-only namespace around a series of functions that operate on buffers returned from the `Darwin.sysctl` function
public struct Sysctl {
    /// Possible errors.
    public enum Error: Swift.Error {
        case unknown
        case malformedUTF8
        case invalidSize
        case posixError(POSIXErrorCode)
    }
    
    /// Access the raw data for an array of sysctl identifiers.
    public static func dataForKeys(_ keys: [Int32]) throws -> [Int8] {
        return try keys.withUnsafeBufferPointer() { keysPointer throws -> [Int8] in
            // Preflight the request to get the required data size
            var requiredSize = 0
            let preFlightResult = Darwin.sysctl(UnsafeMutablePointer<Int32>(mutating: keysPointer.baseAddress), UInt32(keys.count), nil, &requiredSize, nil, 0)
            if preFlightResult != 0 {
                throw POSIXErrorCode(rawValue: errno).map {
                    Console.log($0.rawValue)
                    return Error.posixError($0)
                    } ?? Error.unknown
            }
            
            // Run the actual request with an appropriately sized array buffer
            let data = Array<Int8>(repeating: 0, count: requiredSize)
            let result = data.withUnsafeBufferPointer() { dataBuffer -> Int32 in
                return Darwin.sysctl(UnsafeMutablePointer<Int32>(mutating: keysPointer.baseAddress), UInt32(keys.count), UnsafeMutableRawPointer(mutating: dataBuffer.baseAddress), &requiredSize, nil, 0)
            }
            if result != 0 {
                throw POSIXErrorCode(rawValue: errno).map { Error.posixError($0) } ?? Error.unknown
            }
            
            return data
        }
    }
    
    /// Convert a sysctl name string like "hw.memsize" to the array of `sysctl` identifiers (e.g. [CTL_HW, HW_MEMSIZE])
    public static func keysForName(_ name: String) throws -> [Int32] {
        var keysBufferSize = Int(CTL_MAXNAME)
        var keysBuffer = Array<Int32>(repeating: 0, count: keysBufferSize)
        try keysBuffer.withUnsafeMutableBufferPointer { (lbp: inout UnsafeMutableBufferPointer<Int32>) throws in
            try name.withCString { (nbp: UnsafePointer<Int8>) throws in
                guard sysctlnametomib(nbp, lbp.baseAddress, &keysBufferSize) == 0 else {
                    throw POSIXErrorCode(rawValue: errno).map { Error.posixError($0) } ?? Error.unknown
                }
            }
        }
        if keysBuffer.count > keysBufferSize {
            keysBuffer.removeSubrange(keysBufferSize..<keysBuffer.count)
        }
        return keysBuffer
    }
    
    /// Invoke `sysctl` with an array of identifers, interpreting the returned buffer as the specified type. This function will throw `Error.invalidSize` if the size of buffer returned from `sysctl` fails to match the size of `T`.
    public static func valueOfType<T>(_ type: T.Type, forKeys keys: [Int32]) throws -> T {
        let buffer = try dataForKeys(keys)
        if buffer.count != MemoryLayout<T>.size {
            throw Error.invalidSize
        }
        return try buffer.withUnsafeBufferPointer() { bufferPtr throws -> T in
            guard let baseAddress = bufferPtr.baseAddress else { throw Error.unknown }
            return baseAddress.withMemoryRebound(to: T.self, capacity: 1) { $0.pointee }
        }
    }
    
    /// Invoke `sysctl` with an array of identifers, interpreting the returned buffer as the specified type. This function will throw `Error.invalidSize` if the size of buffer returned from `sysctl` fails to match the size of `T`.
    public static func valueOfType<T>(_ type: T.Type, forKeys keys: Int32...) throws -> T {
        return try valueOfType(type, forKeys: keys)
    }
    
    /// Invoke `sysctl` with the specified name, interpreting the returned buffer as the specified type. This function will throw `Error.invalidSize` if the size of buffer returned from `sysctl` fails to match the size of `T`.
    public static func valueOfType<T>(_ type: T.Type, forName name: String) throws -> T {
        return try valueOfType(type, forKeys: keysForName(name))
    }
    
    /// Invoke `sysctl` with an array of identifers, interpreting the returned buffer as a `String`. This function will throw `Error.malformedUTF8` if the buffer returned from `sysctl` cannot be interpreted as a UTF8 buffer.
    public static func stringForKeys(_ keys: [Int32]) throws -> String {
        let optionalString = try dataForKeys(keys).withUnsafeBufferPointer() { dataPointer -> String? in
            dataPointer.baseAddress.flatMap { String(validatingUTF8: $0) }
        }
        guard let s = optionalString else {
            throw Error.malformedUTF8
        }
        return s
    }
    
    /// Invoke `sysctl` with an array of identifers, interpreting the returned buffer as a `String`. This function will throw `Error.malformedUTF8` if the buffer returned from `sysctl` cannot be interpreted as a UTF8 buffer.
    public static func stringForKeys(_ keys: Int32...) throws -> String {
        return try stringForKeys(keys)
    }
    
    /// Invoke `sysctl` with the specified name, interpreting the returned buffer as a `String`. This function will throw `Error.malformedUTF8` if the buffer returned from `sysctl` cannot be interpreted as a UTF8 buffer.
    public static func stringForName(_ name: String) throws -> String {
        return try stringForKeys(keysForName(name))
    }
    
    /// e.g. "MyComputer.local" (from System Preferences -> Sharing -> Computer Name) or
    /// "My-Name-iPhone" (from Settings -> General -> About -> Name)
    public static var hostName: String { return try! Sysctl.stringForKeys([CTL_KERN, KERN_HOSTNAME]) }
    
    /// e.g. "x86_64" or "N71mAP"
    /// NOTE: this is *corrected* on iOS devices to fetch hw.model
    public static var machine: String {
        #if os(iOS) && !arch(x86_64) && !arch(i386)
            return try! Sysctl.stringForKeys([CTL_HW, HW_MODEL])
        #else
            return try! Sysctl.stringForKeys([CTL_HW, HW_MACHINE])
        #endif
    }
    
    /// e.g. "MacPro4,1" or "iPhone8,1"
    /// NOTE: this is *corrected* on iOS devices to fetch hw.machine
    public static var model: String {
        #if os(iOS) && !arch(x86_64) && !arch(i386)
            return try! Sysctl.stringForKeys([CTL_HW, HW_MACHINE])
        #else
            return try! Sysctl.stringForKeys([CTL_HW, HW_MODEL])
        #endif
    }
    
    /// e.g. "8" or "2"
    public static var activeCPUs: Int32 { return try! Sysctl.valueOfType(Int32.self, forKeys: [CTL_HW, HW_AVAILCPU]) }
    
    /// e.g. "15.3.0" or "15.0.0"
    public static var osRelease: String { return try! Sysctl.stringForKeys([CTL_KERN, KERN_OSRELEASE]) }
    
    /// e.g. "Darwin" or "Darwin"
    public static var osType: String { return try! Sysctl.stringForKeys([CTL_KERN, KERN_OSTYPE]) }
    
    /// e.g. "15D21" or "13D20"
    public static var osVersion: String { return try! Sysctl.stringForKeys([CTL_KERN, KERN_OSVERSION]) }
    
    /// e.g. "Darwin Kernel Version 15.3.0: Thu Dec 10 18:40:58 PST 2015; root:xnu-3248.30.4~1/RELEASE_X86_64" or
    /// "Darwin Kernel Version 15.0.0: Wed Dec  9 22:19:38 PST 2015; root:xnu-3248.31.3~2/RELEASE_ARM64_S8000"
    public static var version: String { return try! Sysctl.stringForKeys([CTL_KERN, KERN_VERSION]) }
    
    #if os(macOS)
    /// e.g. 199506 (not available on iOS)
    public static var osRev: Int32 { return try! Sysctl.valueOfType(Int32.self, forKeys: [CTL_KERN, KERN_OSREV]) }
    
    /// e.g. 2659000000 (not available on iOS)
    public static var cpuFreq: Int64 { return try! Sysctl.valueOfType(Int64.self, forName: "hw.cpufrequency") }
    
    /// e.g. 25769803776 (not available on iOS)
    public static var memSize: UInt64 { return try! Sysctl.valueOfType(UInt64.self, forKeys: [CTL_HW, HW_MEMSIZE]) }
    #endif
}
