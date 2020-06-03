//
//  Buffer.swift
//  eqMac
//
//  Created by Roman Kisil on 24/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import CoreAudio

func makeBufferSilent(_ ioData: UnsafeMutableAudioBufferListPointer) {
    for buf in ioData {
        memset(buf.mData, 0, Int(buf.mDataByteSize))
    }
}

func bufferSilencePercent (_ ioData: UnsafeMutablePointer<AudioBufferList>) -> Double {
  let audioBufferListPtr = UnsafeMutableAudioBufferListPointer(ioData).unsafeMutablePointer.pointee
  let data = Data(bytes: audioBufferListPtr.mBuffers.mData!, count: Int(audioBufferListPtr.mBuffers.mDataByteSize))
  let base64 = data.base64EncodedString()
  return Double(100 * base64.filter { $0 == "A" }.count / (base64.count - 1))
}
