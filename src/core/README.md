---
title: 替换内核
---

fplayer 只是桥接了 ijkplayer 和 Flutter，ijkplayer 才是真正的播放器内核。需要定制裁剪、增加能力或压缩体积时，可以自行编译内核。内核源码和发布仓库统一为 [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer)，内核产物名为 `fplayercore`。

官方 Release 提供 Android AAR、iOS/macOS xcframework、Windows DLL 和 OpenHarmony HAR。fplayer 的 iOS/macOS `Package.swift` 通过 `binaryTarget(url:checksum:)` 直接引用这些官方 Release 资产，不需要额外的 SPM 包装仓库。

在使用过程中请注意：

1. 使用官方内核仓库 [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer)
2. 以本地相对路径引入 fplayer
3. 以本地相对路径引入 ijkplayer

## iOS / macOS

编译参考 [iOS 内核编译](/core/build-ios)。

使用 Swift Package Manager 时，不需要手动复制 framework；fplayer 的 `ios/fplayer/Package.swift` 和 `macos/fplayer/Package.swift` 会从官方 Release 下载对应 xcframework。

如果使用 CocoaPods，可以把编译出的 `fplayercore.framework` 放到 `${fplayer}/ios/fplayer/Frameworks` 或 `${fplayer}/macos/fplayer/Frameworks`，再按 podspec 的 `vendored_frameworks` 配置引用。

## Android

编译参考 [Android 内核编译](/core/build-android)。

推荐直接使用 Maven Central 上的 `io.github.flutterplayer:fplayercore:<version>`，不需要手动复制 AAR。fplayer 的 fetch 脚本会把 AAR 同步到 `android/local-repo/io/github/flutterplayer/fplayercore/<version>/`，Gradle 从该 mirror 或 Maven Central 解析同一个 artifact。

如果要替换为自定义 AAR，把 `fplayercore-release.aar` 放到上述版本目录，并保持 `android/fplayercore.version` 与目录版本一致。不要继续使用旧的 `fplayer-core.aar` 路径。

## OpenHarmony

鸿蒙系统需要先准备好 Flutter 环境，可以参考 [鸿蒙环境初始化](/core/harmonyos-init)。

内核构建会生成 `build/ohos/fplayercore-ohos.har`，fplayer 通过 `ohos/oh-package.json5` 依赖该 HAR。
