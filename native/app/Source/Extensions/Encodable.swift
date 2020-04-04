//
//  Encodable.swift
//  eqMac
//
//  Created by Roman Kisil on 15/07/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

extension Encodable {
    subscript(key: String) -> Any? {
        return dictionary[key]
    }
    var data: Data {
        return try! JSONEncoder().encode(self)
    }
    var dictionary: [String: Any] {
        return (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] ?? [:]
    }
}
