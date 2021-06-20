<p align="center">
  <img width="512" src="https://github.com/bitgapp/eqMac/raw/master/assets/logos/promo.png"/>
</p>

<p align="center">
  <img height="512" src="https://github.com/bitgapp/eqMac/raw/master/assets/screenshots/advanced-equalizer.png"/>
</p>

<p align="center">
  <a href="https://discord.eqmac.app"><img src="https://img.shields.io/badge/chat-discord-black?style=flat&logo=discord" alt="discord chat"></a>
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
* Expert EQ - Unlimited bands + Spectrum analyzer (coming very soon!)
* Reverb - Spatial audio enhancement
* Volume mixer - Apply different volume levels per each application
* Input audio source - Apply effects to any device: guitar, microphone etc.
* Recorder - save any audio playback (System, Input device, File)
* File playback and rendering - Apply effects to audio files and instantly render them
* Remote control from your phone
* Hide unused effects / elements of the UI
* and more...

## User support
I'm notoriously known for lacking in communication with users due to lack of time in my busy life. This project is heavily reliant on the whole community helping each other out. If you have an issue with eqMac please go through [Issues](https://github.com/bitgapp/eqMac/issues) to see if it's already being discussed, if not create a new one. Also you can [join our Discord](https://discord.eqmac.app). Please no stupid questions like "How to bass?" - those will be completely ignored.

## Technology
eqMac was built using these technologies:
* [Driver](https://github.com/bitgapp/eqMac/tree/master/native/driver) - System Audio loopback/passthrough device based on [BackgroundMusic](https://github.com/kyleneideck/BackgroundMusic) project. The driver grabs the system audio stream and sends it to the input channels. eqMac can grab this stream, process it and send to the appropriate audio device. Still very low level C++ code although the driver runs in User space instead of Kernel like the previous drivers, which means it's much more secure and stable.
* [App](https://github.com/bitgapp/eqMac/tree/master/native/app) - Native backend to the whole app. Responsible for audio processing, filesystem access, window management, API and general lifecycle of eqMac. Written in Swift and uses Apple's more modern [AVAudioEngine API](https://developer.apple.com/documentation/avfoundation/avaudioengine), unlike the previous version that used a deprecated AUGraph API.
* [UI](https://github.com/bitgapp/eqMac/tree/master/ui) - Web based user interface that is hosted remotely and thus allows for over the air updates & bug fixes. Developer with [Angular](https://angular.io/) + [TypeScript](https://www.typescriptlang.org/) and is cached for offline availability.

## Contribution
At the moment eqMac is going through a major rewrite and it's hard to coordinate the development of big features, but I'm open to try anyway. Please create an issue on GitHub (please check if your issue is already being discussed) or [join our Discord](https://discord.eqmac.app) to discuss. Once a piece of work has been agreed - fork, build, debug, fix, merge and create a Pull Request to get your work merged in :) 
Check the documentation below to understand how to start eqMac debug process from Xcode

## Credits

[@nodeful](https://github.com/nodeful) - Creator and Developer of eqMac

[@kyleneideck](https://github.com/kyleneideck) - For his hard work on the [BGMDriver](https://github.com/kyleneideck/BackgroundMusic)

[@titanicbobo](https://github.com/titanicbobo) - For the [Big Sur icon design](https://github.com/bitgapp/eqMac/blob/master/assets/icon/icon-bigsur.svg)

## Development
Fork the repository, then run these commands in Terminal.app:

``` 
git clone https://github.com/YOUR_USERNAME/eqMac.git
cd eqMac/
```

### Web User Interface
If you want to run the web based User Interface locally then you need to follow these steps to make that happen:

#### Prerequisites
Install [Node.js](https://nodejs.org/en/) LTS version preferrably using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

Install [Yarn](https://classic.yarnpkg.com/en/) v1 globally: `npm i -g yarn` (this is needed because the project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/))

#### Building and running the Web UI
1. Run `yarn` from the root directory of the Monorepo
2. Go into the ui/ directory by `cd ui/`
3. Start local development server with `yarn start`

### Native app + driver
#### Prerequisites

1. Download [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
2. Install [CocoaPods](https://cocoapods.org/) by `sudo gem install cocoapods`

#### Building and running the App

1. Go into the native/app directory from root of the repo by: `cd native/`
2. Install Cocoapod dependencies: `pod install`
3. Open the Xcode workspace: `open eqMac.xcworkspace`
4. Launch eqMac in debug mode by running the **App - Debug** Scheme:
<img width="512" src="https://user-images.githubusercontent.com/8472525/83069640-279c1100-a062-11ea-85a7-45aa5253771b.png"/>
