---
title: Android 内核编译
---

Android 内核使用 NDK 和 CMake 构建，CI 固定使用 NDK `29.0.14206865` 与 CMake `3.22.1`。

## 环境准备

```bash
brew install git yasm nasm cmake python
sdkmanager --install "ndk;29.0.14206865" "cmake;3.22.1"
export ANDROID_NDK="$ANDROID_HOME/ndk/29.0.14206865"
```

## 初始化依赖

在 ijkplayer 仓库根目录执行：

```bash
bash scripts/init/init-android.sh
bash scripts/init/init-android-boringssl.sh
bash scripts/init/init-android-libsrt.sh
```

## 编译 BoringSSL 和 FFmpeg

```bash
bash scripts/build/android/compile-boringssl.sh all
bash scripts/build/android/compile-ffmpeg.sh all
```

## 编译 AAR

```bash
cd platform/android
./gradlew :library:assembleRelease -PVERSION_NAME=1.2.12
```

产物为 `fplayercore-release.aar`，同时会发布为 Maven Central 的 `io.github.flutterplayer:fplayercore:<version>`。fplayer 的 fetch 脚本会把 AAR 同步到 `android/local-repo`，供 Gradle 本地解析。
