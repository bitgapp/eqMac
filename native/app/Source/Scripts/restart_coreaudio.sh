#!/bin/sh
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

