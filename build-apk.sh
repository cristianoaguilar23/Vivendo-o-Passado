#!/usr/bin/env bash
set -euo pipefail
mkdir -p android/app/src/main/assets/www
cp -R web/. android/app/src/main/assets/www/
cd android
gradle --no-daemon assembleDebug
echo "APK gerado em: android/app/build/outputs/apk/debug/app-debug.apk"
