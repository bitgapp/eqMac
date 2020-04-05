<p align="center">
  <img width="512" src="https://github.com/bitgapp/eqMac/raw/master/assets/logos/promo1.jpg"/>
</p>

<p align="center">
  <img height="512" src="https://github.com/bitgapp/eqMac/raw/master/assets/screenshots/advanced-equalizer.png"/>
</p>

## Features
### Current
* System-wide audio source
* Volume Booster
* Volume Balance support for all devices
* Basic EQ - 3 band (Bass, Mids, Treble)
* Advanced EQ - 10 bands

### Roadmap
Idea is to become the ultimate Audio toolbox for macOS (some features might not be open sourced)
* Expert EQ - Ultimited bands
* Reverb - Spatial audio enchancement
* Volume mixer - Apply different volume levels per each application
* Input audio source - Apply effects to any device: guitar, microphone etc.
* Recorder - save any audio playback (System, Input device, File)
* File playback and rendering - Apply effects to audio files and instantly render them
* Remote control from your phone
* Hide unused effects / elements of the UI
* Spectrum analyzer
* and more...

## User support
I'm notoriously known for lacking in communication with users due to lack of time in my busy life. This project is heavily reliant on the whole community helping each other out. If you have an issue with eqMac please go through [Issues](https://github.com/bitgapp/eqMac/issues) to see if it's already being discussed, if not create a new one. Also you can [join our Discord](https://discord.gg/BA22ceW). Please no stupid questions like "How to bass?" - those will be completely ignored by myself.

## Technology
eqMac was built using these technologies:
* [Driver](https://github.com/bitgapp/eqMac/tree/master/native/driver) - System Audio loopback/passthrough device based on [BackgroundMusic](https://github.com/kyleneideck/BackgroundMusic) project. The driver grabs the system audio stream and sends it to the input channels. eqMac can grab this stream, process it and send to the appropriate audio device. Still very low level C++ code although the driver runs in User space instead of Kernel like the previous drivers, which means it's much more secure and stable.
* [App](https://github.com/bitgapp/eqMac/tree/master/native/app) - Native backend to the whole app. Responsible for audio processing, filesystem access, window management, API and general lifecycle of eqMac. Written in Swift and uses Apple's more modern [AVAudioEngine API](https://developer.apple.com/documentation/avfoundation/avaudioengine), unlike the previous version that used a deprecated AUGraph API.
* [UI](https://github.com/bitgapp/eqMac/tree/master/ui) - Web based user interface that is hosted remotely and thus allows for over the air updates & bug fixes. Written in Angular 8 and uses Service Workers to guarantee offline access.
* [Site](https://github.com/bitgapp/eqMac/tree/master/site) - Source code for https://eqmac.app website. Written in Angular 8 and server side rendered using [Angular Universal](https://github.com/angular/universal)

## Contribution
At the moment eqMac is going through a major rewrite and it's hard to coordinate the development of big features, but I'm open to try anyway. Please create an issue on GitHub (please check if your issue is already being discussed) or [join our Discord](https://discord.gg/BA22ceW) to discuss.

