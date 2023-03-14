---
title: IOS内核编译
---

# 提示
目前所有的环境均在Mac上编译如果是其他平台暂时不提供问题自行研究

## 前期准备工作
1. 先装基础环境
```bash
brew install git
brew install yasm
```
2. 安装xcode

## 编译
1. 下载源码
```bash
git clone https://github.com/FlutterPlayer/ijkplayer.git ijkplayer-ios
cd ijkplayer-ios
```

2. 初始化工程以及下载依赖源码
```bash
bash init-ios-openssl.sh
bash init-ios.sh
```

3. 编译FFMpeg
```bash
cd ios
bash compile-openssl.sh all
bash compile-ffmpeg.sh all
```

4. 编译ijkplayer
```bash
cd IJKMediaPlayer
xcodebuild -project IJKMediaPlayer.xcodeproj -configuration Release -scheme Universal
```

## 产物
在目录下会产生ijkplayer.framework引入即可使用