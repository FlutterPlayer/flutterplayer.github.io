---
title: OpenHarmony 环境搭建
---

OpenHarmony 端依赖支持 OHOS 的 Flutter 发行版、DevEco Studio / hvigor 和 OpenHarmony SDK。fplayer 的 OHOS 原生库由 ijkplayer 的 `fplayercore` HAR 提供。

> 当前推荐流程以 fplayer 仓库中的 [OHOS 说明](https://github.com/FlutterPlayer/fplayer/blob/develop/docs/ohos.md) 为准；本页只保留环境搭建和构建入口。

## 1. 准备 Flutter OHOS

安装一个支持 OHOS 的 Flutter 发行版，并确认 `flutter` 能识别 `ohos` 平台：

```bash
flutter doctor
flutter devices
```

`flutter doctor` 中应出现 OpenHarmony toolchain 相关检查项。需要多版本隔离时可以使用 `fvm`，但不要混用普通 Flutter 与 OHOS Flutter 的缓存。

## 2. 准备 DevEco / hvigor

安装 DevEco Studio，并确保以下命令可用：

```bash
hvigorw --version
ohpm --version
```

设置 DevEco SDK 和工具链环境变量（路径按本机安装位置调整）：

```bash
export DEVECO_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk
export OHOS_BASE_SDK_HOME="$DEVECO_SDK_HOME/default"
export OHOS_SDK="$OHOS_BASE_SDK_HOME/<api-version>/native"
export PATH="/Applications/DevEco-Studio.app/Contents/tools/hvigor/bin:$PATH"
export PATH="/Applications/DevEco-Studio.app/Contents/tools/ohpm/bin:$PATH"
```

`<api-version>` 使用本机 DevEco SDK 的实际版本目录（当前为 `26.0.0`）。如果 `native` 位于
`default/openharmony/native`，请以 DevEco 的实际 SDK 目录为准，不要硬编码旧版本。

SDK 版本需与项目的 `build-profile.json5` 和 `oh-package.json5` 保持一致；不要继续使用旧版 `custom_3.7.12_ohos` 目录。

## 3. 放置 HAR

在 fplayer 插件的 `ohos/har/` 中需要两个文件：

- `flutter.har`：来自 Flutter OHOS SDK 的 engine artifact
- `fplayercore-ohos.har`：来自 ijkplayer 的官方 Release，或由 `tool/fetch_ijkplayer_packages.sh` 下载

`ohos/oh-package.json5` 通过本地 `file:` 路径引用它们：

```json5
{
  "dependencies": {
    "@ohos/flutter_ohos": "file:./har/flutter.har",
    "@fplayer/fplayercore": "file:./har/fplayercore-ohos.har"
  }
}
```

## 4. 构建

在应用工程的 OHOS 目录中执行 Flutter OHOS 构建：

```bash
flutter build hap
```

首次构建前确认：

- `flutter pub get` 已完成
- `ohos/har/flutter.har` 和 `ohos/har/fplayercore-ohos.har` 均存在
- DevEco SDK 版本与 hvigor 配置一致
- 真机安装需要配置签名

## 已知限制

- 系统音量写入在 OHOS 上不可用，相关接口会返回成功但不改变系统音量。
- `takeSnapShot()` 在 OHOS 上未实现。
- OHOS 的完整能力矩阵和最新构建说明见 fplayer 仓库的 `docs/ohos.md`。
