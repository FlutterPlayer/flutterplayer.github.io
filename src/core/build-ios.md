---
title: iOS 内核编译
---

目前内核在 macOS + Xcode 上构建。iOS 产物是 `fplayercore.xcframework`，同时包含 device arm64 和 Apple Silicon 模拟器 arm64 切片。

## 环境准备

```bash
brew install git yasm nasm cmake
xcode-select --install
```

## 初始化依赖

在 ijkplayer 仓库根目录执行：

```bash
bash scripts/init/init-ios.sh
bash scripts/init/init-ios-openssl.sh
```

## 编译 OpenSSL 和 FFmpeg

```bash
bash scripts/build/ios/compile-openssl.sh all
bash scripts/build/ios/compile-ffmpeg.sh all
```

## 编译 fplayercore

```bash
xcodebuild -project platform/ios/IJKMediaPlayer/IJKMediaPlayer.xcodeproj \
  -scheme fplayercore -configuration Release -sdk iphoneos -arch arm64 \
  -derivedDataPath build/xcode-ios-iphoneos CODE_SIGNING_ALLOWED=NO build

xcodebuild -project platform/ios/IJKMediaPlayer/IJKMediaPlayer.xcodeproj \
  -scheme fplayercore -configuration Release -sdk iphonesimulator -arch arm64 \
  -derivedDataPath build/xcode-ios-simulator CODE_SIGNING_ALLOWED=NO build
```

用 `xcodebuild -create-xcframework` 合并两个 framework，产物为 `fplayercore.xcframework`。fplayer 通过官方 Release 中的 `fplayercore-ios.xcframework.zip` 使用它。
