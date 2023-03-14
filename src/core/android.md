---
title: Android内核编译
---
# 提示
目前所有的环境均在Mac上编译如果是其他平台暂时不提供问题自行研究

## 前期准备工作
1. 先装基础环境

```bash
brew install git
brew install yasm
brew install python
```

2. 安装ndk

确保安装android studio之后 可以使用如下脚本进行下载
```bash
sdkmanager --install "ndk;21.1.6352462" "cmake;3.10.2.4988404"
```
或者直接在UI界面进行下载对应版本

2. 设置环境变量

```bash
export ANDROID_NDK=$ANDROID_HOME/ndk/21.1.6352462/
```
注意在这个之前你需要将 ANDROID_HOME 的环境变量配置好


## 编译
1. 下载源码
```bash
git clone https://github.com/FlutterPlayer/ijkplayer.git ijkplayer-android
cd ijkplayer-android
```

2. 初始化工程以及下载依赖源码
```bash
bash init-android.sh
bash init/init-android-boringssl.sh
bash init/init-android-libsrt.sh
```

3. 编译FFMpeg
```bash
cd android/contrib
bash compile-boringssl.sh all
bash compile-ffmpeg.sh all
```

4. 编译ijkplayer
```bash
cd ../ijkplayer
./gradlew build
./gradlew :fijkplayer-full:assembleRelease
```

## 产物
在目录下会产生fijkplayer-full-release.aar文件引入即可使用