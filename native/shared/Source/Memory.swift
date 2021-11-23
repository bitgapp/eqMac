//
//  File.swift
//  
//
//  Created by Romans Kisils on 23/11/2021.
//

import Foundation

public class Memory {
  public static func sizeof <T> (_ type: T.Type) -> UInt32 {
    return UInt32(MemoryLayout<T>.stride)
  }

  public static func sizeof <T> (_ value: T) -> UInt32 {
    return UInt32(MemoryLayout.size(ofValue: value))
  }
}
