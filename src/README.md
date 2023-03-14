---
home: true
icon: home
title: 首页
heroImage: /logo.svg
heroText: fplayer
tagline: 基于fijkplayer二次开发的flutter的媒体播放器
actions:
  - text: 开始使用 💡
    link: /guide/
    type: primary

  - text: 入门指南
    link: /guide/

copyright: false
footer: 使用 <a href="https://theme-hope.vuejs.press/" target="_blank">VuePress Theme Hope</a> 主题, 版权所有 © fplayer -- Flutter plugin for video player 2023
---


fplayer 是一个 Flutter 生态的媒体播放器，是基于 [fijkplayer](https://github.com/befovy/fijkplayer) 的项目的二次开发，目前支持 Android 和 iOS , 后续准备支持 Mac 和 Windows。

fplayer 使用 ijkplayer 作为播放器内核。[ijkplayer](https://github.com/bilibili/ijkplayer) 使用 ffmpeg 进行音视频解封装和解码延续ijkplayer的内核代码支持ios和安卓的硬解码。

fplayer 的内核代码将托管至 [fpalyer-core](https://github.com/FlutterPlayer/ijkplayer)项目中，目前已经升级NDK版本至21安卓最低支持16这样做的目的是为了将部分java代码在后续的计划中逐步迁移至native c++代码，ios的SDK版本也升级到ios 11，同时剔除了armv7的版本支持 仅支持arm64 如果您这边有对其他指令支持的可以在项目中自行编译内核代码 具体的编译以及替换内核的方法见[此处](/core)。

fplayer 具有和 ijkplayer 一样的播放能力，并且开箱即用，不需要使用者再去编译 ijkplayer，API易用，易于在 Flutter 项目中集成。

fplayer 有内置的编译好的ffmepg 和 ijkplayer，分别托管在 Meven Cental 和 CocoaPods 上。

这个站点包含了大量的 fplayer 的文档帮助你使用以及理解 fplayer。

------
&nbsp; 

## 开启你的 fplayer 之旅：

* 中文版 [开始使用](/)
<!-- * English Version [Getting Started](/en/) -->

<!-- * Read news, hints and tips on our [developer blog][]. -->
<!-- * Read the latest [release notes][]. -->
<!-- * Browse the library [Javadoc][]. -->
<!-- * Browse the source code for the [latest release][] and current [tip of tree][]. -->
&nbsp;

------

## 鸣谢以下项目

* [fijkplayer](https://github.com/befovy/fijkplayer)
* [ijkplayer](https://github.com/bilibili/ijkplayer)
* [ffmpeg](https://github.com/FFmpeg/FFmpeg)

------

<span><small> 由于个人能力限制，文档中难免不出现纰漏。  
如果您在阅读时发现任何不当或者错误内容，请在 [github issues](https://github.com/FlutterPlayer/fplayer/issues) 上进行指正，或直接提交 [pull request](https://github.com/FlutterPlayer/fplayer/pulls)。 </small></span>
