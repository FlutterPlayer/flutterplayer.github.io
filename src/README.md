---
home: true
icon: home
title: 首页
heroImage: /logo.png
heroText: Fplayer
tagline: 基于fijkplayer二次开发的flutter的媒体播放器
actions:
  - text: 开始使用 💡
    link: /guide/quick
    type: primary

  - text: 入门指南 📖
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

* 中文版 [开始使用](/guide/quick)
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

&nbsp;&nbsp;

QQ交流群

<table>
  <tr>
    <td>
      <img src="/assets/images/qq.jpg"  height="200"/>
    </td>
  </tr>
</table>

------

<span><small> 由于个人能力限制，文档中难免不出现纰漏。  
如果您在阅读时发现任何不当或者错误内容，请在 [github issues](https://github.com/FlutterPlayer/fplayer/issues) 上进行指正，或直接提交 [pull request](https://github.com/FlutterPlayer/fplayer/pulls)。</small></span>

<span><small>感谢您的关注！开源不易，需要开发者们的不断努力和付出。如果您觉得我的项目对您有所帮助，希望能够支持我继续改进和维护这个项目，您可以考虑打赏我一杯咖啡的钱。
您的支持将是我继续前进的动力，让我能够更加专注地投入到开源社区中，让我的项目变得更加完善和有用。如果您决定打赏我，可以通过以下方式：</small></span>
<ul>
    <li>给该项目点赞 &nbsp;<a style="vertical-align: text-bottom;" href="https://github.com/FlutterPlayer/fplayer">
      <img src="https://img.shields.io/github/stars/FlutterPlayer/fplayer.svg?label=Stars&style=social" alt="给该项目点赞" />
    </a></li>
    <li>关注我的 Github &nbsp;<a style="vertical-align: text-bottom;"  href="https://github.com/FlutterPlayer">
      <img src="https://img.shields.io/github/followers/FlutterPlayer.svg?label=Follow&style=social" alt="关注我的 Github" />
    </a></li>
</ul>
<table>
    <thead><tr>
        <th>微信</th>
        <th>支付宝</th>
    </tr></thead>
    <tbody><tr>
        <td><img style="max-width: 150px" src="/assets/images/wx.png" alt="微信" /></td>
        <td><img style="max-width: 150px" src="/assets/images/zfb.png" alt="支付宝" /></td>
    </tr></tbody>
</table>
再次感谢您的支持和慷慨，让我们一起为开源社区贡献一份力量！