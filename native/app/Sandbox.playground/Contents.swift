
// Loopable allows to dynamically get static properties of a class/struct
protocol Loopable {
  var properties: [String: Any] { get }
}

extension Loopable {
  var properties: [String: Any] {
    var result: [String: Any] = [:]
    let mirror = Mirror(reflecting: self)

    for (property, value) in mirror.children {
      guard let property = property else {
        continue
      }

      result[property] = value
    }

    return result
  }
}

struct EQMDeviceCustomProperties: Loopable {
  let version = 1
  let shown = 2
  let latency = 3
  let name = 4

  var count: UInt32 {
    return UInt32(properties.count)
  }
}

struct EQMDeviceCustom {
  static let properties = EQMDeviceCustomProperties()
}

print(EQMDeviceCustom.properties.count)
