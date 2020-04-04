//
//  Source.swift
//  eqMac
//
//  Created by Roman Kisil on 24/06/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import ReSwift
import EmitterKit

public enum SourceType : String {
  //    case File = "File"
  //    case Input = "Input"
  case System = "System"
  static let allValues = [
    //        File.rawValue,
    //        Input.rawValue,
    System.rawValue
  ]
}

class Sources {
  //    typealias StoreSubscriberStateType = SourceState
  var source: SourceType! = .System {
    didSet {
      sourceChanged.emit(source)
    }
  }
  let sourceChanged = Event<SourceType>()
  var isReady = EmitterKit.Event<Void>()

  //    var file: File!
  //    var input: Input!
  var system: SystemAudioSource!
  
  init (_ callback: @escaping (Sources) -> Void) {
    Console.log("Creating Sources")
    //        source = state.source
    setup(callback)
    //        setupStateListener()
  }
  
  //    func setupStateListener () {
  //        Application.store.subscribe(self) { subscription in
  //            subscription.select { state in state.source }
  //        }
  //    }
  //
  //    func newState(state: SourceState) {
  //        self.state = state
  //        if (source != state.source) {
  //            source = state.source
  //            setup()
  //        }
  //    }
  
  func setup (_ callback: @escaping (Sources) -> Void) {
    reset()
    //        initializeFile()
    //        initializeInput()
    getInputPermission() {
      self.initializeSystem()
      callback(self)
    }
  }
  
  func getInputPermission (_ callback: @escaping () -> Void) {
    if !InputSource.hasPermission {
      let title = "Microphone Usage Permission"
      if Alert.confirm(
        title: title,
        message: "eqMac needs access to Microphone to Route and Process System Audio. \nPlease click the \"Proceed\" button and allow access.",
        okText: "Proceed",
        cancelText: "No, quit eqMac")
      {
        InputSource.requestPermission() { allowed in
          if !InputSource.hasPermission {
            Script.apple("open_privacy_microphone_settings")
            if Alert.confirm(
              title: title,
              message: "You have not allowed access to your Microphone. \neqMac needs access to Microphone to Route and Process System Audio. \nWe will try to open your Security & Privacy settings. \n\n If it didn't open please follow these steps, otherwise skip to step 5: \n\n1. Open your \"System Preferences.app\" \n2. Click on \"Security & Privacy\" \n3. Click on \"Privacy\" tab \n4. Scroll down to \"Microphone\" \n5. Check the box against \"eqMac.app\" \n\nAfter that we will need to restart the Application",
              okText: "Ok I did that. Restart eqMac",
              cancelText: "No, quit eqMac")
            {
              Application.restart()
            } else {
              Application.quit()
            }
          }
        }
      } else {
        Application.quit()
      }
    }
    callback()
  }
  
  func reset () {
    system = nil
  }
  
  //    func initializeFile () {
  //        file = File()
  //        node = file.player
  //    }
  //
  //    func initializeInput () {
  //        input = Input()
  //        node = input.device
  //    }
  
  func initializeSystem () {
    system = SystemAudioSource()
  }
}
