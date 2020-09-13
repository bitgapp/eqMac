#!/bin/bash

# Dont install if Brew Cask CI
if [ -n "$CI" ] && [ "$GITHUB_REPOSITORY" == "Homebrew/homebrew-cask" ]; then
  echo "Brew Cask CI, skipping driver installation"
  exit 0
fi

./place_driver.sh
./restart_coreaudio.sh
./check_driver_installed.sh
