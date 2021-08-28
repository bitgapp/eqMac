import Foundation
import CoreAudio.AudioServerPlugIn

let APP_BUNDLE_ID = "com.bitgapp.eqmac"
let DRIVER_BUNDLE_ID = "com.bitgapp.eqmac.driver"

struct EQMDeviceCustomProperties: Loopable {
  let version = AudioObjectPropertySelector.fromString("vrsn")
  let shown = AudioObjectPropertySelector.fromString("shwn")
  let latency = AudioObjectPropertySelector.fromString("cltc")
  let name = AudioObjectPropertySelector.fromString("eqmn")

  var count: UInt32 {
    return UInt32(properties.count)
  }
}

struct EQMDeviceCustom {
  static let properties = EQMDeviceCustomProperties()
}

let kEQMDeviceSupportedSampleRates: [Float64] = [
  44_100,
  48_000,
  88_200,
  96_000,
  176_400,
  192_000
]
