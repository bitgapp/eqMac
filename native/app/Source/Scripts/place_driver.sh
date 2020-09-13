#!/bin/sh

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy driver into Plug-Ins folder
cp -f -r "$DIR/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ &>/dev/null || \
  cp -f -r "../../Embedded/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ # if running from terminal

