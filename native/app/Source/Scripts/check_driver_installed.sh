#!/bin/sh

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

