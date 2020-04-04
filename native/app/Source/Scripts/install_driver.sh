#!/bin/bash

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Remove legacy drivers
(kextunload /System/Library/Extensions/eqMacDriver.kext/ && rm -rf /System/Library/Extensions/eqMacDriver.kext/) || true
(kextunload /Library/Extensions/eqMacDriver.kext/ && rm -rf /Library/Extensions/eqMacDriver.kext/) || true
(kextunload /System/Library/Extensions/eqMac2Driver.kext/ && rm -rf /System/Library/Extensions/eqMac2Driver.kext/) || true
(kextunload /Library/Extensions/eqMac2Driver.kext/ && rm -rf /Library/Extensions/eqMac2Driver.kext/) || true
touch /System/Library/Extensions
touch /Library/Extensions

# Copy driver into Plug-Ins folder
cp -f -r "$DIR/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ ||
  cp -f -r "../../../build/eqMac/Build/Products/Release/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ # if running from terminal

# Restart CoreAudio
coreaudiod_plist="/System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist"
(launchctl kickstart -k system/com.apple.audio.coreaudiod &>/dev/null || \
launchctl kill SIGTERM system/com.apple.audio.coreaudiod &>/dev/null || \
launchctl kill TERM system/com.apple.audio.coreaudiod &>/dev/null || \
launchctl kill 15 system/com.apple.audio.coreaudiod &>/dev/null || \
launchctl kill -15 system/com.apple.audio.coreaudiod &>/dev/null || \
(launchctl unload "$coreaudiod_plist" &>/dev/null && \
launchctl load "$coreaudiod_plist" &>/dev/null) || \
killall coreaudiod &>/dev/null) && \
sleep 5

# Wait until coreaudiod has restarted and device is ready to use.
retries=5
while [[ $retries -gt 0 ]]; do
  if ! system_profiler SPAudioDataType | grep "eqMac:" >/dev/null 2>&1; then
    retries=$((retries - 1))
    if [[ $retries -gt 0 ]]; then
      echo "Device not ready yet, waiting..."
      sleep 3
    else
      echo "ERROR: Device did not become active"
      exit 1
    fi
  else
    retries=0
  fi
done
echo "Device became active"

