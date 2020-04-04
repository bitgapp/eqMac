import AVFoundation
import PlaygroundSupport
import AMCoreAudio

var engine: AVAudioEngine?

func stopEngine () {
  if (engine != nil) {
    print("pausing")
    engine!.pause()
    print("paused, stopping")
    engine!.stop()
    print("stopped")
//    engine = nil
  }
}
func createEngine () {
  stopEngine()
  engine = AVAudioEngine()
  // File
  let path = Bundle.main.path(forResource: "track", ofType: "mp3")!
  let url = URL(fileURLWithPath: path)
  let file = try! AVAudioFile(forReading: url)
  let fileFormat = file.processingFormat
  let frameCount = UInt32(file.length)
  
  let buffer = AVAudioPCMBuffer(pcmFormat: fileFormat, frameCapacity: frameCount)!
  try! file.read(into: buffer, frameCount: frameCount)
  
  let player = AVAudioPlayerNode()
  
  let eq = AVAudioUnitEQ(numberOfBands: 3)
  eq.bypass = false
  //eq.globalGain = -24
  let gain = Float32(10)
  let band1 = eq.bands[0]
  band1.filterType = .parametric
  band1.bandwidth = 0.5
  band1.gain = gain
  band1.frequency = 32.0
  band1.bypass = false
  
  let band2 = eq.bands[1]
  band2.filterType = .parametric
  band2.bandwidth = 0.5
  band2.gain = gain
  band2.frequency = 64.0
  band2.bypass = false
  
  let band3 = eq.bands[2]
  band3.filterType = .parametric
  band3.bandwidth = 0.5
  band3.gain = gain
  band3.frequency = 125.0
  band3.bypass = false
  
  var varispeed = AVAudioUnitVarispeed()
  engine!.attach(varispeed)
  engine!.attach(player)
  engine!.attach(eq)
  varispeed.rate = 0.1
  engine!.connect(player, to: varispeed, format: fileFormat)
  engine!.connect(varispeed, to: eq, format: fileFormat)
  engine!.connect(eq, to: engine!.mainMixerNode, format: fileFormat)
  
  var asbd = AudioStreamBasicDescription()
  var propSize = UInt32(MemoryLayout<AudioStreamBasicDescription>.size)
  AudioUnitGetProperty(engine!.outputNode.audioUnit!, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 0, &asbd, &propSize)
  
  print(asbd)
  print(AVAudioFormat(streamDescription: &asbd))
  
  try! engine!.outputNode.auAudioUnit.setDeviceID(AudioDevice.defaultOutputDevice()!.id)
  engine!.prepare()
  try! engine!.start()
  print(engine!)
  
  player.play()
  player.scheduleBuffer(buffer, at: AVAudioTime(hostTime: 0), options:.loops, completionHandler: nil)
}

class EventListener: EventSubscriber {
  var hashValue: Int = 1
  init () {
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
  }
  
  internal func eventReceiver(_ event: AMCoreAudio.Event) {
    switch event {
    case let event as AudioHardwareEvent:
      switch event {
      case .deviceListChanged(let added, let removed):
        print(added, removed)
        if removed.count > 0 && !removed[0].name.contains("CADefaultDeviceAggregate") || added.count > 0 && !added[0].name.contains("CADefaultDeviceAggregate") {
          stopEngine()
          DispatchQueue.main.asyncAfter(deadline: .now() + 1000 / 1000) {
            print("Trying to start again")
            createEngine()
          }
        }
        
      default: return
      }
    case let event as AudioDeviceEvent:
      switch event {
      case .isAliveDidChange(let device):
        print("isAliveDidChange", device)
      default:
        return
      }
    default: return
    }
  }
}

createEngine()
let listener = EventListener()
