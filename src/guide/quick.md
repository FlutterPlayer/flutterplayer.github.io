---
title: 快速上手
---

这一节我们要使用 `fplayer` 库动手写一个最基础的 Flutter 视频播放器了。放心，一点也不难。

本节内容在 [安装](/guide/) 一节中新建的 Flutter App 项目 playerapp 中进行修改更新。

## 验证 Flutter Debug 环境

首先我们验证一下之前新建的 Flutter 项目 playerapp 能够 debug 跑起来。

### iOS debug

新建的 Flutter 项目运行 iOS 时需要先在 ios 目录运行 `pod install --verbose` 安装依赖。

同时，由于一些尚未解决的问题 [flutter/issues/14647](https://github.com/flutter/flutter/issues/14647)，暂时不能在 iOS 模拟器进行纹理的渲染，所需要 iOS 真机调试。那么就需要配置 Xcode 开发证书了。

打开 ios/Runner.xcworkspace Xcode 工程，Runner -> targtes -> Runner -> General -> Signing 进行开发证书配置。

安装完依赖并且配置好证书之后，连接上 iOS 设备，在 Xcode 中直接运行项目，或者终端 `flutter run`，验证 Flutter App 可以顺利运行起来。

### Android debug

Android 上没有开发证书问题，也不需要额外的依赖安装。  
打开 Android 模拟器，或者连接上 Android 设备，在终端运行 `flutter run`，验证 Flutter App 在 Android 设备上正确运行。

## 创建 FPlayer

打开 `main.dart`，将其中的 class `_MyHomePageState` 修改如下。

```dart
class _MyHomePageState extends State<MyHomePage> {
  final FPlayer player = FPlayer();

  @override
  void initState() {
    super.initState();
    player.setDataSource(
        "https://sample-videos.com/video123/flv/240/big_buck_bunny_240p_10mb.flv",
        autoPlay: true);
  }

  @override
  void dispose() {
    super.dispose();
    player.release();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: FView(
          player: player, 
          panelBuilder: fPanel2Builder(snapShot: true),
        ),
      ),
    );
  }
}
```

主要修改内容：

1. 在类 `_MyHomePageState` 中初始化了一个 `FPlayer` 实例 `player`。
2. 在 `initState` 方法中调用 `player.setDataSource` 接口。
3. 在 `dispose` 方法中调用 `player.release` 接口释放播放器占用的资源。
4. 在 `build` 方法中将 `FView` 加入 UI Widgets Tree 中。

### 简要说明

一个 FPlayer 实例绑定一个 playback（native ijkplayer），构造 Fplayer 后，对应的 native ijkplayer 也随即初始化。  
FPlayer 几乎具有所有 ijkplayer 的接口，FijkPlayer 就是对 native C 层 ijkplayer 的一个 dart 包装，接口都保持一致。
FPlayer 处理所有播放相关的工作，实际工作都是由 native C 层 ijkplayer 完成，包含检查 dataSource 中的媒体信息，打开解码器和解码线程、打开音频输出设备、将解码后数据输出给音频设备或显示设备。  
FPlayer 占用较多的内存或资源，在不使用时应该主动调用接口 `release` 进行释放。

FView 只做一件事：显示 FPlayer 解码后的视频内容。FView 几乎没什么接口，后续如果增加的话也都是和 UI 显示相关。


## 运行截图

<table>
    <thead><tr>
        <th>Android</th>
        <th>iOS</th>
    </tr></thead>
    <tbody><tr>
        <td><img style="max-width: 340px" src="/assets/images/android-example.jpg" alt="Android demo 运行截图" /></td>
        <td><img style="max-width: 340px" src="/assets/images/ios-example.jpg" alt="iOS demo 运行截图" /></td>
    </tr></tbody>
</table>
