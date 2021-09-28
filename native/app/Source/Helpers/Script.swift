//
//  Script.swift
//  eqMac
//
//  Created by Roman Kisil on 01/11/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import STPrivilegedTask

class Script {
  static func sudo (_ name: String, started: (() -> Void)? = nil, _ finished: @escaping (Bool) -> Void) {
    let resourcePath = Bundle(for: self).resourcePath
    let scriptAbsolutePath = resourcePath! + "/" + name + ".sh"
    let task: STPrivilegedTask = STPrivilegedTask()
    task.launchPath = "/bin/sh"
    task.arguments = [scriptAbsolutePath]
    
    task.terminationHandler = { _ in
      finished(task.terminationStatus == 0)
    }
    let err: OSStatus = task.launch()
    
    if (err != errAuthorizationSuccess) {
      return finished(false)
    } else {
      started?()
    }
    
  }

  static func shell(_ command: String) -> String {
    let task = Process()
    let pipe = Pipe()

    task.standardOutput = pipe
    task.standardError = pipe
    task.arguments = ["-c", command]
    task.launchPath = "/bin/sh"
    task.launch()

    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let output = String(data: data, encoding: .utf8)!

    return output
  }
  
  static func apple (_ name: String) {
    let resourcePath = Bundle(for: self).resourcePath
    let scriptAbsolutePath = resourcePath! + "/" + name + ".scpt"
    let script = NSAppleScript(contentsOf: URL(fileURLWithPath: scriptAbsolutePath), error: nil)
    script!.executeAndReturnError(nil)
  }
}
