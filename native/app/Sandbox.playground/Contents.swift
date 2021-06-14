import AVFoundation
import PlaygroundSupport
import Foundation


var engine = AVAudioEngine()
// File
let path = Bundle.main.path(forResource: "track", ofType: "mp3")!
let url = URL(fileURLWithPath: path)
let file = try! AVAudioFile(forReading: url)
let fileFormat = file.processingFormat
let frameCount = UInt32(file.length)

let buffer = AVAudioPCMBuffer(pcmFormat: fileFormat, frameCapacity: frameCount)!
try! file.read(into: buffer, frameCount: frameCount)

let player = AVAudioPlayerNode()
let mixer = AVAudioMixerNode()
let eq = AVAudioUnitEQ()

engine.attach(player)
engine.attach(mixer)
engine.attach(eq)
engine.connect(player, to: mixer, format: fileFormat)
engine.connect(mixer, to: eq, format: fileFormat)

engine.connect(eq, to: engine.mainMixerNode, format: fileFormat)

engine.prepare()

try! engine.start()
print(engine)
engine.mainMixerNode.outputVolume = 0.01


player.play()
player.scheduleBuffer(buffer, at: AVAudioTime(hostTime: 0), options:.loops, completionHandler: nil)

DispatchQueue.main.asyncAfter(deadline: .now() + 5, execute:  {
  mixer.pan = -1
})

let unit = mixer.auAudioUnit.component
