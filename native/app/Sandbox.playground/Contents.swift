import AVFoundation
import PlaygroundSupport
import AMCoreAudio

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

let eq = AVAudioUnitEQ(numberOfBands: 3)
eq.bypass = false
eq.globalGain = -16
let gain = Float32(24)
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

engine.attach(varispeed)
engine.attach(player)
engine.attach(eq)


engine.connect(player, to: varispeed, format: fileFormat)
engine.connect(varispeed, to: eq, format: fileFormat)
engine.connect(eq, to: engine.mainMixerNode, format: fileFormat)

try! engine.outputNode.auAudioUnit.setDeviceID(AudioDevice.defaultOutputDevice()!.id)
engine.prepare()
try! engine.start()
print(engine)

player.play()
player.scheduleBuffer(buffer, at: AVAudioTime(hostTime: 0), options:.loops, completionHandler: nil)
