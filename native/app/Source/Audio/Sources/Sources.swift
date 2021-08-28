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

  var system: SystemAudioSource!
  
  init () {
    Console.log("Creating Sources")
  }

  static func getInputPermission (_ callback: @escaping () -> Void) {
    if !InputSource.hasPermission {
      let title = "Microphone Usage Permission"
      Alert.confirm(
        title: title,
        message: "eqMac needs access to Microphone to Route and Process System Audio. \nPlease click the \"Proceed\" button and allow access.",
        okText: "Proceed",
        cancelText: "No, quit eqMac") { proceed in
          if proceed {
            InputSource.requestPermission() { allowed in
              if !InputSource.hasPermission {
                NSWorkspace.shared.open(URL(string:"x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone")!)
                delay(1000) {
                  
                  Alert.confirm(
                    title: "Microphone Usage Permission",
                    message: "You have not allowed access to your Microphone. \neqMac needs access to Microphone to Route and Process System Audio. \neqMac will try to open your Security & Privacy settings. \n\n If it didn't open please follow these steps, otherwise skip to step 5: \n\n1. Open your \"System Preferences.app\" \n2. Click on \"Security & Privacy\" \n3. Click on \"Privacy\" tab \n4. Scroll down to \"Microphone\" section \n5. Check the box against \"eqMac.app\" \n\nAfter that we will need to restart the Application",
                    okText: "Ok I did that. Restart eqMac",
                    cancelText: "No, quit eqMac") { restart in
                      if restart {
                        Application.restart()
                      } else {
                        Application.quit()
                      }
                  }
                }
              } else {
                callback()
              }
            }
          } else {
            Application.quit()
          }
      }
      return
    }
    callback()
  }
  
  
  
  func reset () {
    system = nil
  }
  
  func initializeSystem () {
    system = SystemAudioSource()
  }
}
