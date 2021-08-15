//
//  ObjectProtocol.swift
//  eqMac
//
//  Created by Nodeful on 13/08/2021.
//  Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

protocol ObjectProtocol {
  static func hasProperty (address: AudioObjectPropertyAddress) -> Bool
}
