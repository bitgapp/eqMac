//
//  Utilities.swift
//  eqMac
//
//  Created by Nodeful on 15/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation

func sizeof <T> (_ type: T) -> UInt32 {
  return UInt32(MemoryLayout.size(ofValue: type))
}
