#!/bin/sh
# Restart CoreAudio
launchctl kickstart -k system/com.apple.audio.coreaudiod
