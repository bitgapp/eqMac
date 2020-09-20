#!/bin/sh

# Dont uninstall if Brew Cask CI
if [ -n "$CI" ] && [ "$GITHUB_REPOSITORY" == "Homebrew/homebrew-cask" ]; then
  echo "Brew Cask CI, skipping uninstalling the driver"
  exit 0
fi

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

./remove_driver.sh
./restart_coreaudio.sh
./check_driver_uninstalled.sh
