---
title: 安装
---

fplayer 是 fijkplayer 的 Flutter 封装，是一款支持 Android、iOS、macOS、Windows 和 OpenHarmony 的 Flutter 媒体播放器插件，由 [FlutterPlayer/ijkplayer](https://github.com/FlutterPlayer/ijkplayer) 内核驱动。
通过纹理（Texture）接入播放器视频渲染到 Flutter 中。

让我们开始使用 fplayer 构建你的 Flutter 音视频应用之旅！  
别担心，只需要掌握很少的知识你就能完成 Flutter 音视频应用的开发。

本节内容包括简洁安装指南以及详细安装指南。

## 简洁安装指南

在 flutter 项目配置文件 `pubspec.yaml` 中加入 `fplayer` 依赖。最新的稳定版本号见 badge 图标。

```yaml
dependencies:
  fplayer: ^{latest verison}
```

[![pub package](https://img.shields.io/pub/v/fplayer.svg)](https://pub.dartlang.org/packages/fplayer) &nbsp; &nbsp;

`{latest verison}` 使用徽标中的版本号代替。

如果需要使用某些尚未发布的功能更新，可以直接依赖对应的 git 分支，方式如下。
比如这里依赖 develop 分支，
```yaml
dependencies:
  fplayer:
    git:
      url: https://github.com/FlutterPlayer/fplayer.git
      ref: develop
```

## 详细安装步骤

如果你熟悉 Flutter App 的依赖安装，看上面 “简洁安装指南” 就够了，本页后续内容完全可以跳过。


如果你不太熟悉 Flutter App 开发流程，看到了这这一部分内容，我们还是假定你已经在你的设备上配置好了 Flutter 的开发环境。即你可以在命令行输入 `flutter` 命令，并且有相应的正确输出内容。


### 新建 Flutter App 项目


终端输入以下命令，新建一个名为 `playerapp` 的 Flutter App 项目。
```
$ flutter create -t app playerapp
```
命令运行结束后，Flutter 会给我们如下提示。
```
In order to run your application, type:

  $ cd playerapp
  $ flutter run

Your application code is in playerapp/lib/main.dart.
```


连接上手机设备（或者打开 Android 模拟器），并且使用 `flutter doctor` 命令检查设备是否连接成功。


```
$ flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, v1.7.8+hotfix.4, on Mac OS X 10.14.3 18D109, locale zh-Hans-CN)

[✓] Android toolchain - develop for Android devices (Android SDK version 28.0.3)
[✓] Xcode - develop for iOS and macOS (Xcode 10.3)
[✓] iOS tools - develop for iOS devices
[✓] Android Studio (version 3.4)
[✓] IntelliJ IDEA Ultimate Edition (version 2019.1.2)
[✓] VS Code (version 1.36.1)
[✓] Connected device (1 available)

• No issues found!
```

在 `flutter doctor` 命令的输出中，至少应该含有 `[✓] Connected device (1 available)`


### 安装 fplayer 依赖

进入上一步中创建的目录 playerapp 中，编辑其中的文件 `pubspec.yaml` ，增加依赖 `fplayer: ^{latest verison}`

```diff
dependencies:
  flutter:
    sdk: flutter
    
+ fplayer: ^{latest verison}
```

[![pub package](https://img.shields.io/pub/v/fplayer.svg)](https://pub.dartlang.org/packages/fplayer) &nbsp; &nbsp;

`{latest verison}` 使用徽标中的版本号代替。

然后在 playerapp 目录中运行如下命令安装依赖，等待命令成功完成。

```
$ flutter pub get --verbose
```


### 验证依赖安装

安装完 fplayer 之后我们先验证一下，确保安装正确。

编辑 `lib/main.dart` 文件，在开头加入如下行，引入 fplayer。
```dart
import 'package:fplayer/fplayer.dart';
```

iOS/macOS 默认使用 Swift Package Manager。首次构建前启用 SPM：

```bash
flutter config --enable-swift-package-manager
```

然后分别编译各平台项目，确保 build 成功：

```bash
flutter build apk
flutter build ios --simulator --no-codesign
flutter build macos
flutter build windows
```

#### **注意事项**
* fplayer 中使用了 androidx 的 support 库，在 app 中需要启用 androidx
* 如果 build apk 时太久时间没有输出，可以先在 android 目录运行 `./gradlew` 检查 gradle 环境是否正确。
* iOS/macOS 构建会通过 Swift Package Manager 从 ijkplayer 的官方 GitHub Release 下载 xcframework，网络较慢时请耐心等待。
* iOS 模拟器使用 arm64 切片，请使用 Apple Silicon Mac 的模拟器。
* 仍然使用 CocoaPods 的项目可以通过 podspec 使用 fetch 到 `Frameworks/` 的 framework；新项目推荐直接使用 Swift Package Manager。
* ios 可调试环境：Flutter 3.41.9、Xcode 16+

Flutter 中安装 fplayer 的内容到这里就结束了，有任何问题请在 [github issues](https://github.com/FlutterPlayer/fplayer/issues) 中进行提问。