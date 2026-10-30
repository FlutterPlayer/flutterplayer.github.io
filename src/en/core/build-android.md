---
title: Building the Android Kernel
description: Compile the Android fplayercore kernel with the NDK and CMake, and publish the resulting AAR.
---

The Android kernel builds with the NDK and CMake. CI pins NDK `29.0.14206865` and CMake `3.22.1`.

## Prerequisites

```bash
brew install git yasm nasm cmake python
sdkmanager --install "ndk;29.0.14206865" "cmake;3.22.1"
export ANDROID_NDK="$ANDROID_HOME/ndk/29.0.14206865"
```

## Initialize Dependencies

Run these from the root of the ijkplayer repository:

```bash
bash scripts/init/init-android.sh
bash scripts/init/init-android-boringssl.sh
bash scripts/init/init-android-libsrt.sh
```

## Build BoringSSL and FFmpeg

```bash
bash scripts/build/android/compile-boringssl.sh all
bash scripts/build/android/compile-ffmpeg.sh all
```

## Build the AAR

```bash
cd platform/android
./gradlew :library:assembleRelease -PVERSION_NAME=1.2.12
```

The output is `fplayercore-release.aar`. The same artifact is published to Maven Central as `io.github.flutterplayer:fplayercore:<version>`, and fplayer's fetch script syncs it into `android/local-repo` so Gradle can resolve it locally.
