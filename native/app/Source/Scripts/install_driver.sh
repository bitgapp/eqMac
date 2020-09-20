#!/bin/bash

# Dont install if Brew Cask CI
if [ -n "$CI" ] && [ "$GITHUB_REPOSITORY" == "Homebrew/homebrew-cask" ]; then
  echo "Brew Cask CI, skipping driver installation"
  exit 0
fi

# Get current directory path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/place_driver.sh
$DIR/restart_coreaudio.sh
$DIR/check_driver_installed.sh
