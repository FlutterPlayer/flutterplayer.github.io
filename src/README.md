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


fplayer 是一个 Flutter 生态的媒体播放器，是对 [fijkplayer](https://github.com/befovy/fijkplayer) 的 Flutter 封装，支持 Android 和 iOS。
fplayer 使用 ijkplayer 作为播放器内核。[ijkplayer](https://github.com/bilibili/ijkplayer) 使用 ffmpeg 进行音视频解封装和解码，同时添加了 Android 和 iOS 平台特有的硬件加速解码能力。

fplayer 具有和 ijkplayer 一样的播放能力，并且开箱即用，不需要使用者再去编译 ijkplayer，API易用，易于在 Flutter 项目中集成。

fplayer 通过纹理方式将播放器视频画面渲染接入 flutter 中，性能上优于 PlatformView 的接入方法。
fplayer 有内置的编译好的ffmepg 和 ijkplayer，分别托管在 jcenter 和 CocoaPods 上。

这个站点包含了大量的 fplayer 的文档帮助你使用以及理解 fplayer。

------
&nbsp; &nbsp;

开启你的 fplayer 之旅：

* 中文版 [开始使用](/)
* English Version [Getting Started](/en/)

<!-- * Read news, hints and tips on our [developer blog][]. -->
<!-- * Read the latest [release notes][]. -->
<!-- * Browse the library [Javadoc][]. -->
<!-- * Browse the source code for the [latest release][] and current [tip of tree][]. -->


------

<span><small> 由于个人能力限制，文档中难免不出现纰漏。  
如果您在阅读时发现任何不当或者错误内容，请在 [github issues](https://github.com/FlutterPlayer/fplayer/issues) 上进行指正，或直接提交 [pull request](https://github.com/FlutterPlayer/fplayer/pulls)。 </small></span>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5039983089268679"
     crossorigin="anonymous">
</script>
