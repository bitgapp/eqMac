////
////  AKWorkingEqualizerFilter.swift
////  eqMac
////
////  Created by Roman Kisil on 11/08/2018.
////  Copyright © 2018 Roman Kisil. All rights reserved.
////
//
//import Foundation
//import AudioKit
//
//class AKWorkingEqualizerFilter: AKEqualizerFilter {
//    var lastKnownGain: Double = 1
//    @objc override open func start() {
//        if isStopped {
//            gain = lastKnownGain
//        }
//        super.start()
//    }
//
//    /// Function to stop or bypass the node, both are equivalent
//    @objc override open func stop() {
//        if isPlaying {
//            lastKnownGain = gain
//            gain = 1
//        }
//        super.stop()
//    }
//}
