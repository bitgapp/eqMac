//
//  Effect.swift
//  eqMac
//
//  Created by Roman Kisil on 17/05/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

class Effects {
    var effects: [Effect] = []
    
    var equalizers: Equalizers!
    //    var reverb: Reverb!

    
    init () {
        Console.log("Creating Effects")
        initializeEffects()
    }
    
    func initializeEffects () {
        initializeEqualizers()
        //  initializeR everb()
    }
    
    func initializeEqualizers () {
        equalizers = Equalizers()
        effects.append(equalizers)
    }
    
    //    func initializeReverb () {
    //        reverb = Reverb()
    //        effects.append(reverb)
    //    }
    
}
