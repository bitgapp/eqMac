//
//  NSSavePanelExtensions.swift
//  eqMac
//
//  Created by Romans Kisils on 20/06/2019.
//  Copyright © 2019 Romans Kisils. All rights reserved.
//

import Foundation
import AppKit

extension NSSavePanel {
    func saveFile(extensions: [String]?, _ handler: @escaping (NSApplication.ModalResponse) -> Void) -> Void {
        title = "Save File"
        canCreateDirectories = true
        allowedFileTypes = extensions
        allowsOtherFileTypes = false
        begin(completionHandler: handler)
    }
}
