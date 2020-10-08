#!/bin/bash

# Dont install if Brew Cask CI
if [ -n "$CI" ] && [ "$GITHUB_REPOSITORY" == "Homebrew/homebrew-cask" ]; then
  echo "Brew Cask CI, skipping driver installation"
  exit 0
fi

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd -P)"

touch /System/Library/Extensions &>/dev/null || true
touch /Library/Extensions &>/dev/null || true

if [ -d "/Library/Audio/Plug-Ins/HAL/eqMac.driver" ]; then
  # updating driver
  echo "Updating old driver..."
  ${SCRIPT_DIR}/uninstall_driver.sh
  echo "Old driver has been uninstalled, installing new..."
fi

# Copy driver into Plug-Ins folder
if [ -d "$DIR/eqMac.driver" ]; then
  cp -f -r "$DIR/eqMac.driver" /Library/Audio/Plug-Ins/HAL/
else
  cp -f -r "../../Embedded/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ # if running from terminal
fi

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

