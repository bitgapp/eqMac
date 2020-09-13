#!/bin/sh
# Type a script or drag a script file from your workspace to insert its path.
if [ "${CONFIGURATION}" = "Release" ]; then
    cp -r "$BUILT_PRODUCTS_DIR/$FULL_PRODUCT_NAME" "$SRCROOT/../app/Embedded/"
fi

if [ "${CONFIGURATION}" = "Debug" ]; then
    export SUDO_ASKPASS=~/askpass.sh
    # Uninstall any new driver leftovers
    sudo -A rm -rf /Library/Audio/Plug-Ins/HAL/eqMac.driver/
    # Install the new driver
    sudo -A cp -f -r "$BUILT_PRODUCTS_DIR/$FULL_PRODUCT_NAME" /Library/Audio/Plug-Ins/HAL/
    # Restart CoreAudio
    sudo -A launchctl kickstart -kp system/com.apple.audio.coreaudiod
fi

