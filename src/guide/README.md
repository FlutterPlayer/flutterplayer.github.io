---
title: 安装
---

fplayer 是一款 Flutter 媒体播放器插件，支持 Android、iOS、macOS、Windows 和 OpenHarmony。播放器内核由 [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer) 提供，Dart 侧统一使用 `FPlayer` API。

## 环境要求

- Flutter `3.41.9` 或兼容版本
- Android：JDK 17，Android SDK / NDK（构建预编译内核时不需在本地编译 NDK）
- iOS / macOS：Xcode，Apple Silicon Mac 可使用 arm64 模拟器
- Windows：Windows 主机与 Visual Studio C++ 工具链
- OpenHarmony：DevEco Studio、OpenHarmony SDK 与支持 OHOS 的 Flutter（见 [OpenHarmony 环境](/core/harmonyos-init)）

## 添加依赖

在 `pubspec.yaml` 中添加：

```yaml
dependencies:
  fplayer: ^1.3.0
```

如果需要内置播放器面板、手势和音量/亮度浮层，再添加可选的 `fplayer_ui`：

```yaml
dependencies:
  fplayer_ui:
    git:
      url: https://github.com/FlutterPlayer/fplayer.git
      path: packages/fplayer_ui
```

然后执行：

```bash
flutter pub get
```

`fplayer_ui` 目前随 fplayer 仓库一起发布，不在 pub.dev 单独发布；依赖 `fplayer` 核心包仍然可以直接使用。

## 各平台准备

### Android

Android 消费 Maven Central 或 `android/local-repo` 中的 `fplayercore` AAR。首次构建前可以运行：

```bash
./tool/fetch_ijkplayer_packages.sh
```

如果 Gradle 无法解析 `io.github.flutterplayer:fplayercore`，先确认上述 fetch 脚本已执行，并检查 `android/local-repo`。

### iOS / macOS

fplayer 使用 Swift Package Manager 从 ijkplayer 官方 Release 下载 `fplayercore` xcframework。首次构建前启用 SPM：

```bash
flutter config --enable-swift-package-manager
```

新项目不需要 Podfile，也不需要执行 `pod install`。仍然使用 CocoaPods 的旧项目可以继续使用 podspec，并通过 fetch 脚本取得 `Frameworks/` 中的本地 framework。

iOS 模拟器使用 arm64 切片，建议在 Apple Silicon Mac 上构建。

### Windows

Windows 示例需要在 Windows 主机上构建，并确保 Visual Studio 的 C++ 桌面开发工具已安装。fplayer 会通过 CMake 链接 `fplayercore.dll`。

### OpenHarmony

OpenHarmony 需要单独的 Flutter OHOS 发行版和 DevEco 工具链。完整步骤见 [OpenHarmony 环境搭建](/core/harmonyos-init)。

## 构建

```bash
# Android
flutter build apk

# iOS 模拟器（Apple Silicon）
flutter build ios --simulator --no-codesign

# macOS
flutter build macos

# Windows（必须在 Windows 主机执行）
flutter build windows
```

构建前建议先运行：

```bash
flutter clean
flutter pub get
```

## 下一步

- [快速上手](/guide/quick)：创建播放器并接入 `FView`
- [播放器 API](/basic/api)：播放控制、音轨和状态接口
- [内置 UI](/skin/immanent)：使用 `fplayer_ui` 的完整面板

如果遇到问题，请在 [fplayer issues](https://github.com/FlutterPlayer/fplayer/issues) 中反馈。
