<h1 align="center">
  <a href="https://bitgapp.com/eqmac"><img src="https://github.com/romankisil/eqMac2/blob/master/eqMac2/Assets/Assets/Icons/256x256.png?raw=true?raw=true" alt="eqMac2 - System-Wide Equalizer for the Mac" width="200"></a>
  <br>
  eqMac2

</h1>
<h4 align="center">System-Wide Equalizer for the Mac</h4>

<p align="center">
  <a href="https://join.slack.com/t/eqmac/shared_invite/enQtMjk4NDkwNzEzOTA4LTg4OWFlYWFjNGQzZTJiM2RmMDI4MTUzMjk5ZTk1ZTkwYzk5NTk1ZDMwNTc1ZmU2MDdmNzRhNjc4ZTBhOWM2MzA"><img src="https://img.shields.io/badge/slack-workspace-pink.svg" alt="chat on slack"></a>
  <a href="http://twitter.com/eqMacApp"><img src="https://img.shields.io/twitter/follow/eqMacApp.svg?style=social" alt="Twitter"></a>
  <a href="https://github.com/romankisil/eqMac2/releases"><img src="https://img.shields.io/github/downloads/romankisil/eqMac2/total.svg" alt="Download"></a>+ 127k (Legacy)
</p>

<br>


<p align="center">
  <a href="https://bitgapp.com/eqmac"><img alt="eqMac2 Screenshot EQ" height="300" src="https://user-images.githubusercontent.com/8472525/33244041-488cf4b4-d2e8-11e7-986c-49826dd853e1.png"></a>
</p>

## How to install?

Best way to install eqMac2 is from the website: https://bitgapp.com/eqmac

Or if you use [Homebrew](https://brew.sh/): `brew cask install eqmac`

## How it started?

If you are interested to know how eqMac was created, you can read the [Story](https://github.com/romankisil/eqMac2/blob/master/STORY.md)

## How to help?

If you are an Objective-C / C++ developer, please read the [Contribution Guide](https://github.com/romankisil/eqMac2/blob/master/CONTRIBUTING.md)

If you are a user, you can always help by [Reporting Bugs](https://github.com/romankisil/eqMac2/blob/master/CONTRIBUTING.md)
and/or [making direct contributions from the website](https://bitgapp.com/eqmac/#/donate)

## How to build?

Please install [CocoaPods](https://cocoapods.org/) dependency manager on your Mac.
Then in Terminal:
```
git clone https://github.com/romankisil/eqMac2.git
cd eqMac2/
pod install
open eqMac2.xcworkspace
```
And then ⌘R

## How it works

I basically took Apple's [CAPlayThrough example](https://developer.apple.com/library/content/samplecode/CAPlayThrough/Introduction/Intro.html) and modified the AUGraph to have an EQ node. Combined it with [SoundFlower Audio Driver](https://github.com/mattingalls/Soundflower) and it just worked. 
<p align="center">
  <img alt="eqMac2 Diagram" src="https://user-images.githubusercontent.com/8472525/29003031-13d1cd60-7aa7-11e7-9868-6afc36a34b52.jpg">
</p>
