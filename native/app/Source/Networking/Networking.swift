//
//  Networking.swift
//  eqMac
//
//  Created by Roman Kisil on 08/07/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Connectivity
import EmitterKit
class Networking {
  static let connectivity = Connectivity()
  static let statusChanged = Event<ConnectivityStatus>()
  static func startMonitor () {
    connectivity.whenConnected = { connectivity in
      Networking.statusChanged.emit(connectivity.status)
    }
    
    connectivity.whenDisconnected = { connectivity in
      Networking.statusChanged.emit(connectivity.status)
    }
    connectivity.startNotifier()
  }
  static func isConnected (_ completion: @escaping (Bool) -> Void) {
    if (connectivity.status == .notConnected) {
      return completion(false)
    }
    var returned = false
    connectivity.checkConnectivity { connectivity in
      if (!returned) {
        returned = true
        let accepted: [ConnectivityStatus] = [
          .connected,
          .connectedViaCellular,
          .connectedViaWiFi
        ]
        completion(accepted.contains(connectivity.status))
      }
    }
    
    Utilities.delay(2000) {
      if (!returned) {
        returned = true
        completion(false)
      }
    }
  }
  
  static func tcpPortIsAvailable(_ port: UInt) -> Bool {
    let socketFileDescriptor = socket(AF_INET, SOCK_STREAM, 0)
    if socketFileDescriptor == -1 {
      return false
    }
    
    var addr = sockaddr_in()
    let sizeOfSockkAddr = MemoryLayout<sockaddr_in>.size
    addr.sin_len = __uint8_t(sizeOfSockkAddr)
    addr.sin_family = sa_family_t(AF_INET)
    addr.sin_port = Int(OSHostByteOrder()) == OSLittleEndian ? _OSSwapInt16(__uint16_t(port)) : in_port_t(port)
    addr.sin_addr = in_addr(s_addr: inet_addr("0.0.0.0"))
    addr.sin_zero = (0, 0, 0, 0, 0, 0, 0, 0)
    var bind_addr = sockaddr()
    memcpy(&bind_addr, &addr, Int(sizeOfSockkAddr))
    
    if Darwin.bind(socketFileDescriptor, &bind_addr, socklen_t(sizeOfSockkAddr)) == -1 {
      release(socket: socketFileDescriptor)
      return false
    }
    if listen(socketFileDescriptor, SOMAXCONN ) == -1 {
      release(socket: socketFileDescriptor)
      return false
    }
    release(socket: socketFileDescriptor)
    return true
  }
  
  static func getAvailabilePort (_ start: UInt) -> UInt {
    var port = start
    while !tcpPortIsAvailable(port) {
      port += 1
    }
    return port
  }
  
  static func release(socket: Int32) {
    Darwin.shutdown(socket, SHUT_RDWR)
    close(socket)
  }
}
