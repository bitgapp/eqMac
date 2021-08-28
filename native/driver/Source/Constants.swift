//
// Constants.swift
// eqMac
//
// Created by Nodeful on 12/08/2021.
// Copyright © 2021 Bitgapp. All rights reserved.
//

import Foundation
import CoreAudio.AudioServerPlugIn

#if DEBUG
let DEBUG = true
#else
let DEBUG = false
#endif

let kAudioServerPluginTypeUUID = CFUUIDGetConstantUUIDWithBytes(nil, 0x44, 0x3A, 0xBA, 0xB8, 0xE7, 0xB3, 0x49, 0x1A, 0xB9, 0x85, 0xBE, 0xB9, 0x18, 0x70, 0x30, 0xDB)!
let kAudioServerPluginDriverInterfaceUUID = CFUUIDGetConstantUUIDWithBytes(nil, 0xEE, 0xA5, 0x77, 0x3D, 0xCC, 0x43, 0x49, 0xF1, 0x8E, 0x00, 0x8F, 0x96, 0xE7, 0xD2, 0x3B, 0x17)!
let IUnknownUUID = CFUUIDGetConstantUUIDWithBytes(kCFAllocatorSystemDefault, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4)!

let kChannelCount: UInt32 = 2
let kBitsPerChannel: UInt32 = 32
let kBytesPerChannel = kBitsPerChannel / 8
let kBytesPerFrame = kChannelCount * kBytesPerChannel
let kDataSource_NumberItems: UInt32 = 1

let kEQMDeviceDefaultName = "eqMac"
let kDeviceManufacturer = "Bitgapp Ltd"

let kDeviceUID = "EQMDevice"
let kDeviceModelUID = "EQMDeviceModelUID"

let kDefaultSampleRate: Float64 = kEQMDeviceSupportedSampleRates[0]
let kDefaultOutputVolume: Float32 = 1.0

let kMinVolumeDB: Float32 = -96
let kMaxVolumeDB: Float32 = 0

extension HRESULT {
  // Success
  static let ok               = HRESULT(bitPattern: 0x00000000)
  static let `false`          = HRESULT(bitPattern: 0x00000001)

  // Error
  static let unexpected       = HRESULT(bitPattern: 0x8000FFFF)
  static let notImplemented   = HRESULT(bitPattern: 0x80000001)
  static let outOfMemory      = HRESULT(bitPattern: 0x80000002)
  static let invalidArguments = HRESULT(bitPattern: 0x80000003)
  static let noInterface      = HRESULT(bitPattern: 0x80000004)
  static let pointer          = HRESULT(bitPattern: 0x80000005)
  static let handle           = HRESULT(bitPattern: 0x80000006)
  static let abort            = HRESULT(bitPattern: 0x80000007)
  static let fail             = HRESULT(bitPattern: 0x80000008)
  static let accessDenied     = HRESULT(bitPattern: 0x80000009)
}

let kObjectID_PlugIn: UInt32                    = kAudioObjectPlugInObject
let kObjectID_Device: UInt32                    = 3
let kObjectID_Stream_Input: UInt32              = 4
let kObjectID_Stream_Output: UInt32             = 8
let kObjectID_Volume_Output_Master: UInt32      = 9
let kObjectID_Mute_Output_Master: UInt32        = 10
let kObjectID_DataSource_Output_Master: UInt32  = 11
