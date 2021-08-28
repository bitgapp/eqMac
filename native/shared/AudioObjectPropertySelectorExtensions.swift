

import Foundation
import CoreAudio.AudioServerPlugIn

extension AudioObjectPropertySelector {
  static func fromString (_ str: String) -> AudioObjectPropertySelector {
    return AudioObjectPropertySelector(UInt32.init(from: str.byteArray))
  }
  
  var code: String {
    return String(bytes: withUnsafeBytes(of: self.bigEndian, Array.init), encoding: .utf8)!
  }
}

