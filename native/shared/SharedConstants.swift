import Foundation
import CoreAudio.AudioServerPlugIn

let kEQMDeviceCustomPropertyVersion = AudioObjectPropertySelector.fromString("vrsn")
let kEQMDeviceCustomPropertyShown = AudioObjectPropertySelector.fromString("shwn")
let kEQMDeviceCustomPropertyLatency = AudioObjectPropertySelector.fromString("cltc")

let kEQMDeviceSupportedSampleRates: [Float64] = [
  44_100,
  48_000,
  88_200,
  96_000,
  176_400,
  192_000
]
