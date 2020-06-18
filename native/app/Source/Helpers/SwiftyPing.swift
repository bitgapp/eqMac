//
//  SwiftyPing.swift
//  SwiftyPing
//
//  Created by Sami Yrjänheikki on 6.8.2018.
//  Copyright © 2018 Sami Yrjänheikki. All rights reserved.
//

import Foundation
import Darwin

public typealias Observer = ((_ response: PingResponse) -> Void)

/// Describes all possible errors thrown within `SwiftyPing`
public enum PingError: Error, Equatable {
    // Response errors
    
    /// The response took longer to arrive than `configuration.timeoutInterval`
    case responseTimeout
    
    // Response validation errors
    
    /// The response length was too short.
    case invalidLength(received: Int)
    /// The received checksum doesn't match the calculated one.
    case checksumMismatch(received: UInt16, calculated: UInt16)
    /// Response `type` was invalid.
    case invalidType(received: ICMPType.RawValue)
    /// Response `code` was invalid.
    case invalidCode(received: UInt8)
    /// Response `identifier` doesn't match what was sent.
    case identifierMismatch(received: UInt16, expected: UInt16)
    /// Response `sequenceNumber` doesn't match.
    case invalidSequenceIndex(received: UInt16, expected: UInt16)
    
    // Host resolve errors
    /// Unknown error occured within host lookup.
    case unknownHostError
    /// Address lookup failed.
    case addressLookupError
    /// Host was not found.
    case hostNotFound
    /// Address data could not be converted to `sockaddr`.
    case addressMemoryError

    // Request errors
    /// An error occured while sending the request.
    case requestError
    /// The request send timed out. Note that this is not "the" timeout,
    /// that would be `responseTimeout`. This timeout means that
    /// the ping request wasn't even sent within the timeout interval.
    case requestTimeout
}

// MARK: SwiftyPing

public class SwiftyPing: NSObject {
    /// Describes the ping host destination.
    public struct Destination {
        /// The host name, can be a IP address or a URL.
        let host: String
        /// IPv4 address of the host.
        let ipv4Address: Data
        /// Socket address of `ipv4Address`.
        var socketAddress: sockaddr_in? { return ipv4Address.socketAddressInternet }
        /// IP address of the host.
        var ip: String? {
            guard let address = socketAddress else { return nil }
            return String(cString: inet_ntoa(address.sin_addr), encoding: .ascii)
        }
        
        /// Resolves the `host`.
        static func getIPv4AddressFromHost(host: String) throws -> Data {
            var streamError = CFStreamError()
            let cfhost = CFHostCreateWithName(nil, host as CFString).takeRetainedValue()
            let status = CFHostStartInfoResolution(cfhost, .addresses, &streamError)
            
            var data: Data?
            if !status {
                if Int32(streamError.domain)  == kCFStreamErrorDomainNetDB {
                    throw PingError.addressLookupError
                } else {
                    throw PingError.unknownHostError
                }
            } else {
                var success: DarwinBoolean = false
                guard let addresses = CFHostGetAddressing(cfhost, &success)?.takeUnretainedValue() as? [Data] else {
                    throw PingError.hostNotFound
                }
                
                for address in addresses {
                    guard let addrin = address.socketAddress else { throw PingError.addressMemoryError }
                    if address.count >= MemoryLayout<sockaddr>.size && addrin.sa_family == UInt8(AF_INET) {
                        data = address
                        break
                    }
                }
                
                if data?.count == 0 || data == nil {
                    throw PingError.hostNotFound
                }
            }
            guard let returnData = data else { throw PingError.unknownHostError }
            return returnData
        }

    }
    // MARK: - Initialization
    /// Ping host
    let destination: Destination
    /// Ping configuration
    let configuration: PingConfiguration
    /// This closure gets called with ping responses.
    public var observer: Observer?
    /// A random identifier which is a part of the ping request.
    private let identifier = UInt16.random(in: 0..<UInt16.max)
    
    /// User-specified dispatch queue. The `observer` is always called from this queue.
    let currentQueue: DispatchQueue
    
    /// Socket for sending and receiving data.
    private var socket: CFSocket?
    /// Socket source
    private var socketSource: CFRunLoopSource?
    
    /// When the current request was sent.
    private var sequenceStart: Date?
    /// The current sequence number.
    private var _sequenceIndex = 0
    private var sequenceIndex: Int {
        get {
            _serial.sync { self._sequenceIndex }
        }
        set {
            _serial.sync { self._sequenceIndex = newValue }
        }
    }
    
    /// The number of pings to make. Default is `nil`, which means no limit.
    public var targetCount: Int?
    
    /// Initializes a pinger.
    init(destination: Destination, configuration: PingConfiguration, queue: DispatchQueue) {
        self.destination = destination
        self.configuration = configuration
        self.currentQueue = queue
                
        super.init()

        // Create a socket context...
        var context = CFSocketContext(version: 0, info: Unmanaged.passRetained(self).toOpaque(), retain: nil, release: nil, copyDescription: nil)

        // ...and a socket...
        self.socket = CFSocketCreate(kCFAllocatorDefault, AF_INET, SOCK_DGRAM, IPPROTO_ICMP, CFSocketCallBackType.dataCallBack.rawValue, { socket, type, address, data, info in
            // Socket callback closure
            guard let socket = socket, let info = info else { return }
            let ping: SwiftyPing = Unmanaged.fromOpaque(info).takeUnretainedValue()
            if (type as CFSocketCallBackType) == CFSocketCallBackType.dataCallBack {
                let cfdata = Unmanaged<NSData>.fromOpaque(data!).takeUnretainedValue() as Data
                ping.socket(socket: socket, didReadData: cfdata)
            }
            
        }, &context)
        
        // ...and add it to the main run loop.
        socketSource = CFSocketCreateRunLoopSource(nil, socket, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), socketSource, .commonModes)
    }

    // MARK: - Convenience Initializers
    convenience init(ipv4Address: String, config configuration: PingConfiguration, queue: DispatchQueue) {
        var socketAddress = sockaddr_in()
        memset(&socketAddress, 0, MemoryLayout<sockaddr_in>.size)
        
        socketAddress.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        socketAddress.sin_family = UInt8(AF_INET)
        socketAddress.sin_port = 0
        socketAddress.sin_addr.s_addr = inet_addr(ipv4Address.cString(using: String.Encoding.utf8))
        let data = NSData(bytes: &socketAddress, length: MemoryLayout<sockaddr_in>.size)
        
        let destination = Destination(host: ipv4Address, ipv4Address: data as Data)
        self.init(destination: destination, configuration: configuration, queue: queue)
    }
    convenience init(host: String, configuration: PingConfiguration, queue: DispatchQueue) throws {
        let result = try Destination.getIPv4AddressFromHost(host: host)
        let destination = Destination(host: host, ipv4Address: result)
        self.init(destination: destination, configuration: configuration, queue: queue)
    }

    // MARK: - Tear-down
    deinit {
        CFRunLoopSourceInvalidate(socketSource)
        socketSource = nil
        socket = nil
        timeoutTimer?.invalidate()
        timeoutTimer = nil
    }

    // MARK: - Single ping
    
    private var _isPinging = false
    private var isPinging: Bool {
        get {
            return _serial.sync { self._isPinging }
        }
        set {
            _serial.sync { self._isPinging = newValue }
        }
    }

    private var _timeoutTimer: Timer?
    private var timeoutTimer: Timer? {
        get {
            return _serial.sync { self._timeoutTimer }
        }
        set {
            _serial.sync { self._timeoutTimer = newValue }
        }
    }
        
    private func sendPing() {
        if isPinging || killswitch {
            return
        }
        isPinging = true
        sequenceStart = Date()
        
        let timer = Timer(timeInterval: self.configuration.timeoutInterval, target: self, selector: #selector(self.timeout), userInfo: nil, repeats: false)
        RunLoop.main.add(timer, forMode: .common)
        self.timeoutTimer = timer

        currentQueue.async {
            let address = self.destination.ipv4Address
            guard let icmpPackage = self.createICMPPackage(identifier: UInt16(self.identifier), sequenceNumber: UInt16(self.sequenceIndex), payloadSize: Int(self.configuration.payloadSize)), let socket = self.socket else { return }
            let socketError = CFSocketSendData(socket, address as CFData, icmpPackage as CFData, self.configuration.timeoutInterval)

            if socketError != .success {
                var error: PingError?
                
                switch socketError {
                case .error: error = .requestError
                case .timeout: error = .requestTimeout
                default: break
                }
                let response = PingResponse(identifier: self.identifier, ipAddress: self.destination.ip ?? "", sequenceNumber: self.sequenceIndex, duration: Date().timeIntervalSince(self.sequenceStart ?? Date()), error: error)
                self.isPinging = false
                self.informObserver(of: response)
                
                return self.scheduleNextPing()
            }
        }
    }

    @objc private func timeout() {
        let error = PingError.responseTimeout
        let response = PingResponse(identifier: self.identifier, ipAddress: self.destination.ip ?? "", sequenceNumber: self.sequenceIndex, duration: Date().timeIntervalSince(self.sequenceStart ?? Date()), error: error)
        self.isPinging = false
        informObserver(of: response)

        sequenceIndex += 1
        scheduleNextPing()
    }
    
    private func informObserver(of response: PingResponse) {
        if killswitch { return }
        currentQueue.sync {
            self.observer?(response)
        }
    }
    
    // MARK: - Continuous ping
    
    private func shouldSchedulePing() -> Bool {
        if killswitch { return false }
        if let target = targetCount {
            if sequenceIndex < target {
                return true
            }
            return false
        }
        return true
    }
    private func scheduleNextPing() {
        if shouldSchedulePing() {
            currentQueue.asyncAfter(deadline: .now() + configuration.pingInterval) {
                self.sendPing()
            }
        }
    }
    
    private let _serial = DispatchQueue(label: "SwiftyPing internal")
    
    private var _killswitch = false
    private var killswitch: Bool {
        get {
            return _serial.sync { self._killswitch }
        }
        set {
            _serial.sync { self._killswitch = newValue }
        }
    }
    public func startPinging() {
        killswitch = false
        sendPing()
    }
    
    public func stopPinging() {
        killswitch = true
        targetCount = 0
        isPinging = false
        sequenceIndex = 0
        sequenceStart = nil
    }
    
    // MARK: - Socket callback
    private func socket(socket: CFSocket, didReadData data: Data?) {
        timeoutTimer?.invalidate()
        
        if killswitch { return }
        
        guard let data = data else { return }
        var validationError: PingError? = nil
        
        do {
            let validation = try validateResponse(from: data as NSData)
            if !validation { return }
        } catch let error as PingError {
            validationError = error
        } catch {
            print("Unhandled error thrown: \(error)")
        }
        
        guard let start = sequenceStart else { return }
        let response = PingResponse(identifier: identifier, ipAddress: destination.ip ?? "", sequenceNumber: sequenceIndex, duration: Date().timeIntervalSince(start), error: validationError)
        isPinging = false
        informObserver(of: response)
        
        self.sequenceIndex += 1
        scheduleNextPing()
    }

    // MARK: - ICMP package
    
    /// Creates an ICMP package. Currently, the `payloadSize` is not respected, but the payload is always 56 bytes.
    private func createICMPPackage(identifier: UInt16, sequenceNumber: UInt16, payloadSize: Int)-> NSData? {
        var icmpType = ICMPType.EchoRequest.rawValue
        var icmpCode: UInt8 = 0
        var icmpChecksum: UInt16 = 0
        var icmpIdentifier = CFSwapInt16HostToBig(identifier)
        var icmpSequence = CFSwapInt16HostToBig(sequenceNumber)
        
        let count = 99 - sequenceNumber % 100
        let payloadString = String(format: "%28zd bottles of beer on the wall", count)
        guard let payload = payloadString.data(using: .ascii) else { return nil }
        guard let package = NSMutableData(length: MemoryLayout<ICMPHeader>.size + payload.count) else { return nil }
        
        package.replaceBytes(in: NSRange(location: 0, length: 1), withBytes: &icmpType)
        package.replaceBytes(in: NSRange(location: 1, length: 1), withBytes: &icmpCode)
        package.replaceBytes(in: NSRange(location: 2, length: 2), withBytes: &icmpChecksum)
        package.replaceBytes(in: NSRange(location: 4, length: 2), withBytes: &icmpIdentifier)
        package.replaceBytes(in: NSRange(location: 6, length: 2), withBytes: &icmpSequence)
        package.replaceBytes(in: NSRange(location: 8, length: payload.count), withBytes: NSData(data: payload).bytes)

        var checksum = computeCheckSum(buffer: package.mutableBytes, bufLen: package.length)
        package.replaceBytes(in: NSRange(location: 2, length: 2), withBytes: &checksum)
        
        return package
    }
    
    private func computeCheckSum(buffer: UnsafeMutableRawPointer, bufLen: Int) -> UInt16 {
        var bytesLeft = bufLen
        var checksum: Int32 = 0
        var buf = buffer.assumingMemoryBound(to: UInt16.self)

        while bytesLeft > 1 {
            checksum += Int32(buf.pointee)
            buf = buf.successor()
            bytesLeft -= 2
        }

        if bufLen == 1 {
            checksum += Int32(UnsafeMutablePointer<UInt16>(buf).pointee)
        }
        checksum = (checksum >> 16) + (checksum & 0xFFFF)
        checksum += checksum >> 16
        let answer = UInt16(Int32(UInt16.max) + ~checksum) + 1
        return answer
    }
    
    private func icmpHeaderOffset(of packet: Data) -> Int? {
        if packet.count >= MemoryLayout<IPHeader>.size + MemoryLayout<ICMPHeader>.size {
            let ipHeader = packet.withUnsafeBytes({ $0.load(as: IPHeader.self) })
            if ipHeader.versionAndHeaderLength & 0xF0 == 0x40 && ipHeader.protocol == IPPROTO_ICMP {
                let headerLength = Int(ipHeader.versionAndHeaderLength) & 0x0F * MemoryLayout<UInt32>.size
                if packet.count >= headerLength + MemoryLayout<ICMPHeader>.size {
                    return headerLength
                }
            }
        }
        return nil
    }
    
    private func validateResponse(from data: NSData) throws -> Bool {
        guard data.length >= MemoryLayout<ICMPHeader>.size + MemoryLayout<IPHeader>.size else {
            throw PingError.invalidLength(received: data.length)
        }
        
        guard let buffer = data.mutableCopy() as? NSMutableData else { return false }
        
        guard let headerOffset = icmpHeaderOffset(of: data as Data) else { return false }
        let icmpHeaderDataRaw = buffer.subdata(with: NSRange(location: headerOffset, length: MemoryLayout<ICMPHeader>.size))
        let icmpHeader = icmpHeaderDataRaw.withUnsafeBytes({ $0.load(as: ICMPHeader.self) })
        
        // TODO: checksum
//        let receivedChecksum = icmpHeader.checkSum
//        var alternateHeader = icmpHeader
//        alternateHeader.checkSum = 0
//        let calculatedChecksum = computeCheckSum(buffer: &alternateHeader, bufLen: data.count - headerOffset)
//        icmpHeader.checkSum = receivedChecksum
        
//        guard receivedChecksum == calculatedChecksum else {
//            print("checksum mismatch: \(receivedChecksum), \(calculatedChecksum)")
//            return false
//        }
        
        guard icmpHeader.type == ICMPType.EchoReply.rawValue else {
            throw PingError.invalidType(received: icmpHeader.type)
        }
        guard icmpHeader.code == 0 else {
            throw PingError.invalidCode(received: icmpHeader.code)
        }
        guard CFSwapInt16BigToHost(icmpHeader.identifier) == identifier else {
            throw PingError.identifierMismatch(received: icmpHeader.identifier, expected: identifier)
        }
        let receivedSequenceIndex = CFSwapInt16BigToHost(icmpHeader.sequenceNumber)
        guard receivedSequenceIndex == sequenceIndex else {
            return false
        }
        return true
    }
    


}

    // MARK: ICMP

    // Format of IPv4 header
    private struct IPHeader {
        var versionAndHeaderLength: UInt8
        var differentiatedServices: UInt8
        var totalLength: UInt16
        var identification: UInt16
        var flagsAndFragmentOffset: UInt16
        var timeToLive: UInt8
        var `protocol`: UInt8
        var headerChecksum: UInt16
        
        // In C this would be sourceAddress[4],
        // but as there are no fixed-length
        // array types in Swift, the array
        // is manually split to 4 pieces.
        // This makes the memory layout of
        // the struct compatable with a ping
        // response data.
        var sourceAddress0: UInt8
        var sourceAddress1: UInt8
        var sourceAddress2: UInt8
        var sourceAddress3: UInt8
        
        // Same for destinationAddress[4].
        var destinationAddress0: UInt8
        var destinationAddress1: UInt8
        var destinationAddress2: UInt8
        var destinationAddress3: UInt8
    }

    private struct ICMPHeader {
        var type: UInt8      /* type of message*/
        var code: UInt8      /* type sub code */
        var checkSum: UInt16 /* ones complement cksum of struct */
        var identifier: UInt16
        var sequenceNumber: UInt16
//        var data:timeval
    }

    // ICMP type and code combinations:

    public enum ICMPType: UInt8 {
        case EchoReply = 0           // code is always 0
        case EchoRequest = 8            // code is always 0
    }

// MARK: - Helpers

public struct PingResponse {
    public let identifier: UInt16
    public let ipAddress: String?
    public let sequenceNumber: Int
    public let duration: TimeInterval
    public let error: PingError?
}
public struct PingConfiguration {
    let pingInterval: TimeInterval
    let timeoutInterval: TimeInterval
    let payloadSize: UInt64
    
    public init(interval: TimeInterval = 1, with timeout: TimeInterval = 5, and payload: UInt64 = 64) {
        pingInterval = interval
        timeoutInterval = timeout
        payloadSize = payload
    }
    public init(interval: TimeInterval) {
        self.init(interval: interval, with: 5)
    }
    public init(interval: TimeInterval, with timeout: TimeInterval) {
        self.init(interval: interval, with: timeout, and: 64)
    }
}

// MARK: - Data Extensions

extension Data {
    public var socketAddress: sockaddr? {
        return self.withUnsafeBytes { (pointer: UnsafeRawBufferPointer) -> sockaddr? in
            let raw = pointer.baseAddress
            let address = raw?.assumingMemoryBound(to: sockaddr.self).pointee
            return address
        }
    }
    public var socketAddressInternet: sockaddr_in? {
        return self.withUnsafeBytes { (pointer: UnsafeRawBufferPointer) -> sockaddr_in? in
            let raw = pointer.baseAddress
            let address = raw?.assumingMemoryBound(to: sockaddr_in.self).pointee
            return address
        }
    }
}
