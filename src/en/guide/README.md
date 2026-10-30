---
title: Installation
---

fplayer is a Flutter media player plugin for Android, iOS, macOS, Windows, and OpenHarmony. Playback runs on the [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer) kernel, and the Dart side talks to it through one API: `FPlayer`.

## Requirements

- Flutter `3.41.9` or a compatible release
- Android: JDK 17 plus the Android SDK / NDK (consuming the prebuilt kernel doesn't need a local NDK build)
- iOS / macOS: Xcode; on an Apple Silicon Mac you can use the arm64 simulator
- Windows: a Windows host with the Visual Studio C++ toolchain
- OpenHarmony: DevEco Studio, the OpenHarmony SDK, and a Flutter build with OHOS support (see [OpenHarmony setup](/en/core/harmonyos-init))

## Adding the dependency

Add the package to `pubspec.yaml`:

```yaml
dependencies:
  fplayer: ^1.3.0
```

If you also want the bundled player panel, gestures, and the volume/brightness overlay, add the optional `fplayer_ui` package:

```yaml
dependencies:
  fplayer_ui:
    git:
      url: https://github.com/FlutterPlayer/fplayer.git
      path: packages/fplayer_ui
```

Then fetch the packages:

```bash
flutter pub get
```

`fplayer_ui` ships from the fplayer repository and isn't published separately on pub.dev. The core `fplayer` package works fine on its own.

## Platform setup

### Android

Android consumes the `fplayercore` AAR from Maven Central or from `android/local-repo`. Before the first build, run:

```bash
./tool/fetch_ijkplayer_packages.sh
```

If Gradle can't resolve `io.github.flutterplayer:fplayercore`, check that the fetch script above has run and look inside `android/local-repo`.

### iOS / macOS

fplayer uses Swift Package Manager to download the `fplayercore` xcframework from the official ijkplayer releases. Enable SPM before the first build:

```bash
flutter config --enable-swift-package-manager
```

New projects need no Podfile and no `pod install`. Projects that still use CocoaPods can keep the podspec and pull the local framework in `Frameworks/` with the fetch script.

The iOS simulator uses the arm64 slice, so build on an Apple Silicon Mac.

### Windows

The Windows example has to be built on a Windows host with the Visual Studio desktop C++ tools installed. fplayer links `fplayercore.dll` through CMake.

### OpenHarmony

OpenHarmony needs its own Flutter OHOS distribution plus the DevEco toolchain. The full procedure lives in [OpenHarmony setup](/en/core/harmonyos-init).

## Building

```bash
# Android
flutter build apk

# iOS simulator (Apple Silicon)
flutter build ios --simulator --no-codesign

# macOS
flutter build macos

# Windows (must run on a Windows host)
flutter build windows
```

Before you build, run:

```bash
flutter clean
flutter pub get
```

## Next steps

- [Quick start](/en/guide/quick): create a player and mount `FView`
- [Player API](/en/basic/api): playback control, audio tracks, and status
- [Built-in UI](/en/skin/immanent): the full `fplayer_ui` panel

Hit a problem? Open an issue on [fplayer issues](https://github.com/FlutterPlayer/fplayer/issues).
