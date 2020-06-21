//
//  DeviceEvents.swift
//  eqMac
//
//  Created by Roman Kisil on 14/11/2018.
//  Copyright © 2018 Roman Kisil. All rights reserved.
//

import Foundation
import AMCoreAudio
import EmitterKit

struct ListChangedDevices {
  let added: [AudioDevice]
  let removed: [AudioDevice]
}

enum AudioDeviceEventType {
  case isJackConnectedChanged
  case isRunningSomewhereChanged
  case volumeChanged
  case muteChanged
  case isAliveChanged
  case nominalSampleRateChanged
  case availableNominalSampleRatesChanged
  case clockSourceChanged
  case nameChanged
  case listChanged
  case isRunningChanged
  case preferredChannelsForStereoChanged
  case hogModeChanged
  case outputChanged
  case inputChanged
  case systemDeviceChanged
}

class AudioDeviceEvents: EventSubscriber {
  static var events = AudioDeviceEvents()
  static var listeners: [EmitterKit.EventListener<AudioDevice>] = [] as! [EmitterKit.EventListener<AudioDevice>]

  var hashValue: Int = 1
  var subscribed = false
  // Per Device
  let isJackConnectedChangedEvent = EmitterKit.Event<AudioDevice>()
  let isRunningSomewhereChangedEvent = EmitterKit.Event<AudioDevice>()
  var volumeChangedEvent = EmitterKit.Event<AudioDevice>()
  let muteChangedEvent = EmitterKit.Event<AudioDevice>()
  var isAliveChangedEvent = EmitterKit.Event<AudioDevice>()
  var nominalSampleRateChangedEvent = EmitterKit.Event<AudioDevice>()
  let availableNominalSampleRatesChangedEvent = EmitterKit.Event<AudioDevice>()
  let clockSourceChangedEvent = EmitterKit.Event<AudioDevice>()
  let nameChangedEvent = EmitterKit.Event<AudioDevice>()
  let listChangedEvent = EmitterKit.Event<AudioDevice>()
  let isRunningChangedEvent = EmitterKit.Event<AudioDevice>()
  let preferredChannelsForStereoChangedEvent = EmitterKit.Event<AudioDevice>()
  let hogModeChangedEvent = EmitterKit.Event<AudioDevice>()
  
  // Hardware Events
  let deviceListChangedEvent = EmitterKit.Event<ListChangedDevices>()
  static var deviceListChangedListeners: [EmitterKit.EventListener<ListChangedDevices>] = [] as! [EmitterKit.EventListener<ListChangedDevices>]
  
  let outputChangedEvent = EmitterKit.Event<AudioDevice>()
  let inputChangedEvent = EmitterKit.Event<AudioDevice>()
  let systemDeviceChangedEvent = EmitterKit.Event<AudioDevice>()

  func subscribe () {
    if !subscribed {
      NotificationCenter.defaultCenter.subscribe(
        self,
        eventType: AudioHardwareEvent.self,
        dispatchQueue: DispatchQueue.main
      )
      NotificationCenter.defaultCenter.subscribe(
        self,
        eventType: AudioDeviceEvent.self,
        dispatchQueue: DispatchQueue.main
      )
      subscribed = true
    }
  }
  
  func unsubscribe () {
    NotificationCenter.defaultCenter.unsubscribe(self, eventType: AudioHardwareEvent.self)
    NotificationCenter.defaultCenter.unsubscribe(self, eventType: AudioDeviceEvent.self)
    subscribed = false
  }
  
  static func subscribe () {
    events.subscribe()
  }
  
  static func unsubscribe () {
    events.unsubscribe()
  }
  
  internal func eventReceiver(_ event: AMCoreAudio.Event) {
    switch event {
    case let event as AudioHardwareEvent:
      switch event {
      case .defaultOutputDeviceChanged(let device): outputChangedEvent.emit(device)
      case .deviceListChanged(var added, var removed):
        added = added.filter { $0.isHardware }
        removed = removed.filter { $0.isHardware }
        if (added.count > 0 || removed.count > 0) {
          deviceListChangedEvent.emit(ListChangedDevices(
            added: added,
            removed: removed
          ))
        }
      case .defaultInputDeviceChanged(let device): inputChangedEvent.emit(device)
      case .defaultSystemOutputDeviceChanged(let device): systemDeviceChangedEvent.emit(device)
      }
    case let event as AudioDeviceEvent:
      let emitter = AudioDeviceEvents.getEventEmitterFromEvent(event)
      let device = AudioDeviceEvents.getDeviceFromEvent(event)
      emitter.emit(device)
    default: return
    }
  }
    
  static func recreateEventEmitters(_ eventsToRecreate: [AudioDeviceEventType]) throws {
    subscribe()
    for event in eventsToRecreate {
      switch event {
      case .isAliveChanged:
        events.isAliveChangedEvent = EmitterKit.Event<AudioDevice>()
        break
      case .volumeChanged:
        events.volumeChangedEvent = EmitterKit.Event<AudioDevice>()
        break
      case .nominalSampleRateChanged:
        events.nominalSampleRateChangedEvent = EmitterKit.Event<AudioDevice>()
        break
      default:
        throw "This event can't be recreated, or change this code"
      }
    }
  }
  
  static func getEventEmitterFromEvent (_ event: AudioDeviceEvent) -> EmitterKit.Event<AudioDevice> {
    let eventType = getEventTypeFromEvent(event)
    let emitter = getEventEmitterFromEventType(eventType)
    return emitter
  }
  
  static func getEventTypeFromEvent (_ event: AudioDeviceEvent) -> AudioDeviceEventType {
    switch event {
    case .isRunningSomewhereDidChange(_): return .isRunningSomewhereChanged
    case .volumeDidChange(_, _, _): return .volumeChanged
    case .muteDidChange(_, _, _): return .muteChanged
    case .isAliveDidChange(_): return .isAliveChanged
    case .isJackConnectedDidChange(_): return .isJackConnectedChanged
    case .nominalSampleRateDidChange(_): return .nominalSampleRateChanged
    case .availableNominalSampleRatesDidChange(_): return .availableNominalSampleRatesChanged
    case .clockSourceDidChange(_): return .clockSourceChanged
    case .nameDidChange(_): return .nameChanged
    case .listDidChange(_): return .listChanged
    case .isRunningDidChange(_): return .isRunningChanged
    case .preferredChannelsForStereoDidChange(_): return .preferredChannelsForStereoChanged
    case .hogModeDidChange(_): return .hogModeChanged
    }
  }
  
  static func getDeviceFromEvent (_ event: AudioDeviceEvent) -> AudioDevice {
    switch event {
    case .isRunningSomewhereDidChange(let device): return device
    case .volumeDidChange(let device, _, _): return device
    case .muteDidChange(let device, _, _): return device
    case .isAliveDidChange(let device): return device
    case .isJackConnectedDidChange(let device): return device
    case .nominalSampleRateDidChange(let device): return device
    case .availableNominalSampleRatesDidChange(let device): return device
    case .clockSourceDidChange(let device): return device
    case .nameDidChange(let device): return device
    case .listDidChange(let device): return device
    case .isRunningDidChange(let device): return device
    case .preferredChannelsForStereoDidChange(let device): return device
    case .hogModeDidChange(let device): return device
    }
  }
  
  static func getEventEmitterFromEventType (_ event: AudioDeviceEventType) -> EmitterKit.Event<AudioDevice> {
    switch event {
    case .isRunningSomewhereChanged: return events.isRunningSomewhereChangedEvent
    case .volumeChanged: return events.volumeChangedEvent
    case .muteChanged: return events.muteChangedEvent
    case .isAliveChanged: return events.isAliveChangedEvent
    case .isJackConnectedChanged: return events.isJackConnectedChangedEvent
    case .nominalSampleRateChanged: return events.nominalSampleRateChangedEvent
    case .availableNominalSampleRatesChanged: return events.availableNominalSampleRatesChangedEvent
    case .clockSourceChanged: return events.clockSourceChangedEvent
    case .nameChanged: return events.nameChangedEvent
    case .listChanged: return events.listChangedEvent
    case .isRunningChanged: return events.isRunningChangedEvent
    case .preferredChannelsForStereoChanged: return events.preferredChannelsForStereoChangedEvent
    case .hogModeChanged: return events.hogModeChangedEvent
    case .outputChanged: return events.outputChangedEvent
    case .inputChanged: return events.inputChangedEvent
    case .systemDeviceChanged: return events.systemDeviceChangedEvent
    }
  }
  
  @discardableResult
  static func on (_ event: AudioDeviceEventType, retain: Bool = true, _ handler: @escaping (AudioDevice) -> Void) -> EmitterKit.EventListener<AudioDevice> {
    events.subscribe()
    let emitter = getEventEmitterFromEventType(event)
    let listener: EmitterKit.EventListener<AudioDevice> = emitter.on(handler)
    if (retain) {
      listeners.append(listener)
    }
    return listener
  }
  
  @discardableResult
  static func on (_ event: AudioDeviceEventType, onDevice device: AudioDevice, retain: Bool = true, _ handler: @escaping () -> Void) -> EmitterKit.EventListener<AudioDevice> {
    return on(event, retain: retain) { if $0.id == device.id { handler() }}
  }
  
  @discardableResult
  static func once (_ event: AudioDeviceEventType, _ handler: @escaping (AudioDevice) -> Void) -> EmitterKit.EventListener<AudioDevice> {
    events.subscribe()
    let emitter = getEventEmitterFromEventType(event)
    let listener: EmitterKit.EventListener<AudioDevice> = emitter.once(handler: handler)
    return listener
  }
  
  static func once (_ event: AudioDeviceEventType, onDevice device: AudioDevice, _ handler: @escaping () -> Void) {
    let emitter = getEventEmitterFromEventType(event)
    emitter.once { d in
      if (d.id == device.id) {
        handler()
      } else {
        once(event, onDevice: device, handler)
      }
    }
  }
  
  @discardableResult
  static func onDeviceListChanged (_ handler: @escaping (ListChangedDevices) -> Void) -> EmitterKit.EventListener<ListChangedDevices> {
    let listener = events.deviceListChangedEvent.on(handler)
    deviceListChangedListeners.append(listener)
    return listener
  }
  
  static func start () {
    subscribe()
    for listener in listeners {
      listener.isListening = true
    }
  }
  
  static func stop () {
    unsubscribe()
    for listener in listeners {
      listener.isListening = false
    }
    listeners.removeAll()
    
    for listener in deviceListChangedListeners {
      listener.isListening = false
    }
    deviceListChangedListeners.removeAll()
  }
  
}
