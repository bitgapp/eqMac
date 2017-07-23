#!/bin/sh

kextunload /System/Library/Extensions/eqMacDriver.kext
rm -rf /System/Library/Extensions/eqMacDriver.kext

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp -R $DIR/eqMac2Driver.kext /System/Library/Extensions/
kextload -tv /System/Library/Extensions/eqMac2Driver.kext
touch /System/Library/Extensions
