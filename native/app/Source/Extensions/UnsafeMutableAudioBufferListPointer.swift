//
//  UnsafeMutableAudioBufferListPointer.swift
//  WaveLabs
//
//  Created by Vlad Gorlov on 29.06.16.
//  Copyright © 2016 WaveLabs. All rights reserved.
//

import AVFoundation

extension UnsafeMutableAudioBufferListPointer {

   public var audioBuffers: [AudioBuffer] {
      var result: [AudioBuffer] = []
      for audioBufferIndex in 0 ..< count {
         result.append(self[audioBufferIndex])
      }
      return result
   }

   public init(unsafePointer pointer: UnsafePointer<AudioBufferList>) {
      self.init(UnsafeMutablePointer<AudioBufferList>(mutating: pointer))
   }
}
