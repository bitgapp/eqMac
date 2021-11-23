

import Foundation
import CoreAudio.AudioServerPlugIn

extension AudioObjectPropertySelector {
  public static func fromString (_ str: String) -> AudioObjectPropertySelector {
    return AudioObjectPropertySelector(UInt32.init(from: str.byteArray))
  }
  
  public var code: String {
    return String(bytes: withUnsafeBytes(of: self.bigEndian, Array.init), encoding: .utf8)!
  }
}

