#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

kextunload /System/Library/Extensions/eqMac2Driver.kext/
rm -rf /System/Library/Extensions/eqMac2Driver.kext/
touch /System/Library/Extensions
