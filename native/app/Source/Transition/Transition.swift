//
//  Transitions.swift
//  eqMac
//
//  Created by Romans Kisils on 29/06/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation

class Transition {
    static func perform (from: Double, to: Double, callback: @escaping (_ value: Double) -> Void) {
        let distance = to - from
        let step = distance / Double(Constants.TRANSITION_FRAME_COUNT)
        for frame in 1...Constants.TRANSITION_FRAME_COUNT {
            let delay: Int = Int(round(Constants.TRANSITION_FRAME_DURATION * Double(frame)))
            DispatchQueue.main.asyncAfter (deadline: .now() + .milliseconds(delay)) {
                callback(from + step * Double(frame))
            }
        }
    }
}
