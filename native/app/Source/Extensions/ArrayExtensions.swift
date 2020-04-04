//
//  ArrayExtensions.swift
//  eqMac
//
//  Created by Roman Kisil on 14/02/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

extension Array {
    func split() -> [[Element]] {
        let ct = self.count
        let half = ct / 2
        let leftSplit = self[0 ..< half]
        let rightSplit = self[half ..< ct]
        return [Array(leftSplit), Array(rightSplit)]
    }
}
