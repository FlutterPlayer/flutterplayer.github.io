---
title: HarmonyOS Flutter 环境搭建
---

因为HarmonyOS的flutter的版本比较低，所以建议使用fvm进行环境的隔离，如果需要使用对应环境的时候直接进行切换即可，本文主要是介绍怎么搭建flutter的HarmonyOS的环境

# 说明
本文档仅在Mac上进行核对，如其他环境可以参考文档中的步骤进行修正

## 环境清理
先将环境中的fluter清理掉，如果使用的是brew安装可以参考下面命令进行清理
```shell
brew remove flutter
```

## 安装fvm
目前有很多的fvm的版本，本文采用的是[官网](https://fvm.app)
```shell
brew tap leoafarias/fvm
brew install fvm
```
安装完成后可以使用以下命令查看有多少版本可以使用
```shell
fvm releases
```

## 安装flutter
因为本人习惯使用最新的flutter的环境所以直接安装了最新的flutter，可以参考以下命令进行安装
```shell
fvm install 3.24.5
```
安装完成之后使用以下命令进行初始化
```shell
fvm global 3.24.5
fvm flutter doctor
```
命令完成后可以看到相关的flutter信息

## 安装flutter_ohos

首先进入fvm的版本目录
```shell
cd ~/fvm/versions
```

配置DevTool的环境
```shell
export TOOL_HOME=/Applications/DevEco-Studio.app/Contents # mac环境
export DEVECO_SDK_HOME=$TOOL_HOME/sdk # command-line-tools/sdk
export PATH=$TOOL_HOME/tools/ohpm/bin:$PATH # command-line-tools/ohpm/bin
export PATH=$TOOL_HOME/tools/hvigor/bin:$PATH # command-line-tools/hvigor/bin
export PATH=$TOOL_HOME/tools/node/bin:$PATH # command-line-tools/tool/node/bin
export PUB_HOSTED_URL=https://pub.flutter-io.cn;
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn·
```
添加flutter ohos的版本
```shell
git clone https://gitee.com/openharmony-sig/flutter_flutter.git
mv flutter_flutter custom_3.7.12_ohos
```
切换到flutter ohos
```shell
fvm global custom_3.7.12_ohos
fvm flutter doctor
```
如果出现了HarmonyOS toolchain相关的检查项 说明已经安装成功了

## flutter 使用
后续的使用可以使用如下命令进行使用
```shell
fvm flutter <cammand>
```
