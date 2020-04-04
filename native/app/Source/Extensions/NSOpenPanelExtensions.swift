//
//  NSOpenPanelExtensions.swift
//  eqMac
//
//  Created by Roman Kisil on 01/04/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import Cocoa

extension NSOpenPanel {
    func selectSingleFile(_ handler: @escaping (NSApplication.ModalResponse) -> Void) -> Void {
        title = "Select File"
        allowsMultipleSelection = false
        canChooseDirectories = false
        canChooseFiles = true
        canCreateDirectories = false
        begin(completionHandler: handler)
    }
}
