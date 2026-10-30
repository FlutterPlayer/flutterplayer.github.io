---
title: Replacing the Kernel
description: Build your own fplayercore kernel from the ijkplayer sources, and wire the result into fplayer on each platform.
---

fplayer is only a bridge between ijkplayer and Flutter. ijkplayer does the actual playback work. When you need a custom trim, extra capabilities, or a smaller binary, build the kernel yourself. Both the source and the release repository live at [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer), and the kernel artifacts ship as `fplayercore`.

Official releases provide an Android AAR, iOS and macOS xcframeworks, a Windows DLL, and an OpenHarmony HAR. The iOS and macOS `Package.swift` manifests in fplayer point straight at these release assets through `binaryTarget(url:checksum:)`, so no separate SPM wrapper repository is involved.

A few rules to follow while you work:

1. Use the official kernel repository, [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer)
2. Reference fplayer by a local relative path
3. Reference ijkplayer by a local relative path

## iOS / macOS

For build steps, see [Building the iOS Kernel](/en/core/build-ios).

With Swift Package Manager you don't copy any framework by hand. `ios/fplayer/Package.swift` and `macos/fplayer/Package.swift` download the matching xcframework from the official release.

On CocoaPods, drop the `fplayercore.framework` you built into `${fplayer}/ios/fplayer/Frameworks` or `${fplayer}/macos/fplayer/Frameworks`, then reference it through the podspec's `vendored_frameworks` setting.

## Android

For build steps, see [Building the Android Kernel](/en/core/build-android).

The simplest route is `io.github.flutterplayer:fplayercore:<version>` from Maven Central, with no manual AAR copying. fplayer's fetch script syncs the AAR into `android/local-repo/io/github/flutterplayer/fplayercore/<version>/`, and Gradle resolves the same artifact from that mirror or from Maven Central.

To swap in a custom AAR, put `fplayercore-release.aar` in that version directory and keep `android/fplayercore.version` in sync with it. The old `fplayer-core.aar` path is gone, so don't keep using it.

## OpenHarmony

HarmonyOS needs a Flutter toolchain with OHOS support before anything else; see [OpenHarmony Setup](/en/core/harmonyos-init).

The kernel build produces `build/ohos/fplayercore-ohos.har`, and fplayer depends on that HAR through `ohos/oh-package.json5`.
