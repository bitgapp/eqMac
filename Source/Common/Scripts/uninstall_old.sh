#!/bin/sh

kextunload /System/Library/Extensions/eqMacDriver.kext
rm -rf /System/Library/Extensions/eqMacDriver.kext
touch /System/Library/Extensions
