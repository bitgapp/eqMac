#!/bin/sh

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

CURRENT_DRIVER_VERSION=$(defaults read /Library/Audio/Plug-Ins/HAL/eqMac.driver/Contents/Info CFBundleVersion)
NEEDED_DRIVER_VERSION=$(defaults read $DIR/eqMac.driver/Contents/Info CFBundleVersion)

echo $CURRENT_DRIVER_VERSION
echo $NEEDED_DRIVER_VERSION

if [ "$CURRENT_DRIVER_VERSION" != "$NEEDED_DRIVER_VERSION" ]; then
  # Copy driver into Plug-Ins folder
  cp -f -r "$DIR/eqMac.driver" /Library/Audio/Plug-Ins/HAL/ &>/dev/null

  # Restart CoreAudio
  coreaudiod_plist="/System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist"
  (launchctl kickstart -k system/com.apple.audio.coreaudiod &>/dev/null || \
  launchctl kill SIGTERM system/com.apple.audio.coreaudiod &>/dev/null || \
  launchctl kill TERM system/com.apple.audio.coreaudiod &>/dev/null || \
  launchctl kill 15 system/com.apple.audio.coreaudiod &>/dev/null || \
  launchctl kill -15 system/com.apple.audio.coreaudiod &>/dev/null || \
  (launchctl unload "$coreaudiod_plist" &>/dev/null && \
  launchctl load "$coreaudiod_plist" &>/dev/null) || \
  killall coreaudiod &>/dev/null)

  # Logout
  pkill loginwindow
#   if osascript <<EOT
#     tell application id "com.apple.systemuiserver"
#         display dialog \
#           "It is recommended you restart your Mac for the eqMac Audio Driver to function properly." \
#           buttons {"Skip restart", "Restart Mac"} \
#           default button "Restart Mac" \
#           cancel button "Skip restart" \
#           with icon POSIX file "/Applications/eqMac.app/Contents/Resources/AppIcon.icns"
#     end tell
# EOT
#         then
#             echo "RESTART"
            
#             osascript <<EOT
#               ignoring application responses
#                 tell application "System Events" to restart 
#               end ignoring
# EOT
#             pkill -9 "Installer"
#             exit 0
#         else
#             echo "SKIP RESTART"

#             # Restart CoreAudio
#             coreaudiod_plist="/System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist"
#             (launchctl kickstart -k system/com.apple.audio.coreaudiod &>/dev/null || \
#             launchctl kill SIGTERM system/com.apple.audio.coreaudiod &>/dev/null || \
#             launchctl kill TERM system/com.apple.audio.coreaudiod &>/dev/null || \
#             launchctl kill 15 system/com.apple.audio.coreaudiod &>/dev/null || \
#             launchctl kill -15 system/com.apple.audio.coreaudiod &>/dev/null || \
#             (launchctl unload "$coreaudiod_plist" &>/dev/null && \
#             launchctl load "$coreaudiod_plist" &>/dev/null) || \
#             killall coreaudiod &>/dev/null)

#             # Wait until CoreAudio restarts
#             sleep 5

#             # Wait until coreaudiod has restarted and device is ready to use.
#             retries=5
#             while [[ $retries -gt 0 ]]; do
#               if ! system_profiler SPAudioDataType | grep "eqMac:" >/dev/null 2>&1; then
#                 retries=$((retries - 1))
#                 if [[ $retries -gt 0 ]]; then
#                   echo "Device not ready yet, waiting..."
#                   sleep 3
#                 else
#                   echo "ERROR: Device did not become active"
#                   exit 1
#                 fi
#               else
#                 retries=0
#               fi
#             done
#             echo "Device became active"

#         fi
fi

open /Applications/eqMac.app

