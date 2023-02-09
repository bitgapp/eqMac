<p align="center">
  <img width="400" src="https://github.com/bitgapp/eqMac/raw/master/assets/logos/promo-dark.png"/>
</p>

<p align="center">
  <img width="1024" src="https://github.com/bitgapp/eqMac/raw/master/assets/screenshots/autoeq-promo.png"/>
</p>

<p align="center">
  <a href="https://discord.eqmac.app"><img src="https://img.shields.io/badge/chat-discord-black?style=flat&logo=discord" alt="discord chat"></a>
</p>

**Notice: Currently the code in this repository corresponds to v1.3.2 of eqMac without any Pro Features and all the newer releases are done on a private fork. Having the Free parts of the app open sourced required too much time to maintain and split off.**

## Features
### Current
* `Free` System Audio Processing
* `Free` Volume Booster
* `Free` HDMI Volume Support
* `Free` Volume Balance support for all devices (including HDMI)
* `Free` Basic EQ - Bass, Mids, Treble control
* `Free` Advanced EQ - Fixed 10 bands
* `Pro` Expert EQ - Unlimited bands, fully customizable (Filter Type, Frequency, Gain, Bandwidth)
* `Pro` Spectrum analyzer
* [AutoEQ](https://github.com/jaakkopasanen/AutoEq?referrer=eqMac&referer=eqMac&utm_source=eqMac) Integration - Automatic Headphone Equalization from frequency responses. `Free` for Advanced EQ and `Pro` as part of the Expert EQ
* `Pro` AudioUnit (AU) Hosting* - add 3rd party effects to the Audio Pipeline
* `Pro` Spatial Audio - simulate different listening environments like Concert Halls or Different sized Rooms.
* `Pro` Volume Mixer - Apply different volume levels per each application
* Custom UI - Fully customize the look and feel of eqMac by changing the User Interface Colors (`Pro`), Feature visibility (`Free`) and arrangement (Soon).

### Roadmap
Idea is to become the ultimate Audio toolbox for macOS
* Input Audio Source - Apply effects to any device: guitar, microphone etc.
* Virtual Output - Export the Adjusted audio to any application
* Hotkeys - Control eqMac with Keyboard Shortcuts
* Recorder - save any audio playback (System, Input device, File)
* Remote control from your phone
* Separate L/R Channel EQ - Fix hearing impairements 
* API - Control all aspects of eqMac through a WebSocket API. Works with any programming language that supports WebSockets.
* File playback and rendering - Apply effects to audio files and instantly render them
* and more...

[Vote on the Features you want to see sooner](https://eqmac.app/#coming-soon)

## User support
If you are a `Pro` customer I provide Customer Support through the Contact form on the website :)
This project is heavily reliant on the whole community helping each other out. If you have an issue with eqMac please go through [Issues](https://github.com/bitgapp/eqMac/issues) to see if it's already being discussed, if not create a new one. Also you can [join our Discord](https://discord.eqmac.app), I'm there all the time and I like to chat with people. 

## Technology
eqMac was built using these technologies:
* [App](https://github.com/bitgapp/eqMac/tree/master/native/app) - Native backend to the whole app. Responsible for audio processing, filesystem access, window management, API and general lifecycle of eqMac.
* [UI](https://github.com/bitgapp/eqMac/tree/master/ui) - Web based user interface that is hosted remotely and thus allows for Over the Air (OTA) updates & bug fixes. Built with [Angular](https://angular.io/) + [TypeScript](https://www.typescriptlang.org/) and is cached for offline availability.
* [Driver](https://github.com/bitgapp/eqMac/tree/master/native/driver) - System Audio loopback/passthrough device based on [Apple's Null Audio Server Driver Plug-in](https://developer.apple.com/documentation/coreaudio/creating_an_audio_server_driver_plug-in) example. One of the first Examples of a macOS System Capture drivers written in Swift. The driver grabs the system audio stream and sends it to the app through a secure memory tunnel. eqMac can grab this stream, process it and send to the appropriate audio device. The driver runs in User space instead of Kernel like the previous drivers (i.e SoundFlower), which means it's much more secure and stable.

## Credits

[@nodeful](https://github.com/nodeful) - Creator and Developer of eqMac

[@titanicbobo](https://github.com/titanicbobo) - For the [Big Sur icon design](https://github.com/bitgapp/eqMac/blob/master/assets/icon/icon.svg)

[Max Heim](https://github.com/0bmxa) - For his research and work on creating the first Swift based Audio Server Plug-in Driver - [Pancake](https://github.com/0bmxa/Pancake)
