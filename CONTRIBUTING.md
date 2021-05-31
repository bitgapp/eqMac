## Contribution
At the moment eqMac is going through a major rewrite and it's hard to coordinate the development of big features, but I'm open to try anyway. Please create an issue on GitHub (please check if your issue is already being discussed) or [join our Discord](https://discord.eqmac.app) to discuss. Once a piece of work has been agreed - fork, build, debug, fix, merge and create a Pull Request to get your work merged in :) 
Check the documentation below to understand how to start eqMac debug process from Xcode

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
