---
title: Building the iOS Kernel
description: Compile the iOS fplayercore kernel on macOS with Xcode and package it as an xcframework.
---

The kernel currently builds on macOS with Xcode. The iOS output is `fplayercore.xcframework`, carrying both a device arm64 slice and an Apple Silicon simulator arm64 slice.

## Prerequisites

```bash
brew install git yasm nasm cmake
xcode-select --install
```

## Initialize Dependencies

Run these from the root of the ijkplayer repository:

```bash
bash scripts/init/init-ios.sh
bash scripts/init/init-ios-openssl.sh
```

## Build OpenSSL and FFmpeg

```bash
bash scripts/build/ios/compile-openssl.sh all
bash scripts/build/ios/compile-ffmpeg.sh all
```

## Build fplayercore

```bash
xcodebuild -project platform/ios/IJKMediaPlayer/IJKMediaPlayer.xcodeproj \
  -scheme fplayercore -configuration Release -sdk iphoneos -arch arm64 \
  -derivedDataPath build/xcode-ios-iphoneos CODE_SIGNING_ALLOWED=NO build

xcodebuild -project platform/ios/IJKMediaPlayer/IJKMediaPlayer.xcodeproj \
  -scheme fplayercore -configuration Release -sdk iphonesimulator -arch arm64 \
  -derivedDataPath build/xcode-ios-simulator CODE_SIGNING_ALLOWED=NO build
```

Merge the two frameworks with `xcodebuild -create-xcframework` to get `fplayercore.xcframework`. fplayer consumes it as `fplayercore-ios.xcframework.zip` from the official release.
