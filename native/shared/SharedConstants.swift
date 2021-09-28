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

struct EQMDeviceCustomAddresses {
  var version = AudioObjectPropertyAddress(
    mSelector: EQMDeviceCustom.properties.version,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMaster
  )

  var shown = AudioObjectPropertyAddress(
    mSelector: EQMDeviceCustom.properties.shown,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMaster
  )

  var latency = AudioObjectPropertyAddress(
    mSelector: EQMDeviceCustom.properties.latency,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMaster
  )

  var name = AudioObjectPropertyAddress(
    mSelector: EQMDeviceCustom.properties.name,
    mScope: kAudioObjectPropertyScopeGlobal,
    mElement: kAudioObjectPropertyElementMaster
  )
}

struct EQMDeviceCustom {
  static let properties = EQMDeviceCustomProperties()
  static var addresses = EQMDeviceCustomAddresses()
}

let kEQMDeviceSupportedSampleRates: [Float64] = [
  44_100,
  48_000,
  88_200,
  96_000,
  176_400,
  192_000
]

let kMinVolumeDB: Float32 = -96
let kMaxVolumeDB: Float32 = 0
