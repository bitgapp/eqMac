#!/bin/sh
# Type a script or drag a script file from your workspace to insert its path.
if [ "${CONFIGURATION}" = "Release" ]; then
    cp -r "$BUILT_PRODUCTS_DIR/$FULL_PRODUCT_NAME" "$SRCROOT/../build/eqMac.driver"
fi

if [ "${CONFIGURATION}" = "Debug" ]; then
    export SUDO_ASKPASS=~/askpass.sh
    # Uninstall any new driver leftovers
    sudo -A rm -rf /Library/Audio/Plug-Ins/HAL/eqMac.driver/
    # Install the new driver
    sudo -A cp -f -r "$BUILT_PRODUCTS_DIR/$FULL_PRODUCT_NAME" /Library/Audio/Plug-Ins/HAL/
    # Restart CoreAudio
    coreaudiod_plist="/System/Library/LaunchDaemons/com.apple.audio.coreaudiod.plist"
    (sudo -A launchctl kickstart -k system/com.apple.audio.coreaudiod &>/dev/null || \
        sudo -A launchctl kill SIGTERM system/com.apple.audio.coreaudiod &>/dev/null || \
        sudo -A launchctl kill TERM system/com.apple.audio.coreaudiod &>/dev/null || \
        sudo -A launchctl kill 15 system/com.apple.audio.coreaudiod &>/dev/null || \
        sudo -A launchctl kill -15 system/com.apple.audio.coreaudiod &>/dev/null || \
    (sudo -A launchctl unload "$coreaudiod_plist" &>/dev/null && \
        sudo -A launchctl load "$coreaudiod_plist" &>/dev/null) || \
        sudo -A killall coreaudiod &>/dev/null)
    
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

fi

