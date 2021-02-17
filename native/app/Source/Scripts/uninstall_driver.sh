#!/bin/sh

# Dont uninstall if Brew Cask CI
if [ -n "$CI" ] && [ "$GITHUB_REPOSITORY" == "Homebrew/homebrew-cask" ]; then
  echo "Brew Cask CI, skipping uninstalling the driver"
  exit 0
fi

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/remove_driver.sh
$DIR/restart_coreaudio.sh
$DIR/check_driver_uninstalled.sh
