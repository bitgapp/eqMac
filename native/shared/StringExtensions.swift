//
//  StringExtensions.swift
//  eqMac
//
//  Created by Roman Kisil on 26/02/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation

extension String {
    func toJSON() -> Any? {
        guard let data = self.data(using: .utf8, allowLossyConversion: false) else { return nil }
        return try? JSONSerialization.jsonObject(with: data, options: .mutableContainers)
    }
    
    func toDictionary() -> [String: AnyObject]? {
        if let data = self.data(using: .utf8) {
            do {
                return try JSONSerialization.jsonObject(with: data, options: []) as? [String: AnyObject]
            } catch {
                print(error.localizedDescription)
            }
        }
        return nil
    }
    
    var byteArray: [UInt8] {
        return Array(self.utf8)
    }
  func trim() -> String {
    return self.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
  }
}

extension String: Error {}

extension String: LocalizedError {
    public var errorDescription: String? { return self }
}

extension String {
    func capitalizingFirstLetter() -> String {
        return prefix(1).uppercased() + dropFirst()
    }
    
    var camelCasedString: String {
        return self.components(separatedBy: " ")
            .enumerated()
            .map { (index, component) in
                var result = component.lowercased()
                if (index != 0) {
                    result = result.capitalizingFirstLetter()
                }
                return result
            }
            .joined()
    }
}
