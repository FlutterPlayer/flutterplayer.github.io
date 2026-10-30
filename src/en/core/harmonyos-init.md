---
title: OpenHarmony Setup
description: Prepare a Flutter OHOS toolchain, DevEco Studio, and the SDK, then place the HAR files and build a HAP.
---

The OpenHarmony side needs a Flutter distribution with OHOS support, DevEco Studio with hvigor, and the OpenHarmony SDK. fplayer's OHOS native library comes from the `fplayercore` HAR built by ijkplayer.

> The [OHOS guide](https://github.com/FlutterPlayer/fplayer/blob/develop/docs/ohos.md) in the fplayer repository is the source of truth for the recommended flow today. This page covers only environment setup and the build entry point.

## 1. Prepare Flutter for OHOS

Install a Flutter distribution with OHOS support and confirm that `flutter` recognizes the `ohos` platform:

```bash
flutter doctor
flutter devices
```

`flutter doctor` should list the OpenHarmony toolchain checks. Use `fvm` if you need to keep versions apart, but never let a stock Flutter install share a cache with the OHOS build.

## 2. Prepare DevEco and hvigor

Install DevEco Studio and make sure these commands are on your path:

```bash
hvigorw --version
ohpm --version
```

Point the environment at the DevEco SDK and toolchain, adjusting the paths to your install:

```bash
export DEVECO_SDK_HOME=/Applications/DevEco-Studio.app/Contents/sdk
export OHOS_BASE_SDK_HOME="$DEVECO_SDK_HOME/default"
export OHOS_SDK="$OHOS_BASE_SDK_HOME/<api-version>/native"
export PATH="/Applications/DevEco-Studio.app/Contents/tools/hvigor/bin:$PATH"
export PATH="/Applications/DevEco-Studio.app/Contents/tools/ohpm/bin:$PATH"
```

Replace `<api-version>` with the real version directory in your DevEco SDK, currently `26.0.0`. If `native` lives under `default/openharmony/native`, follow whatever layout DevEco actually installed rather than hardcoding an older version.

Keep the SDK version aligned with the project's `build-profile.json5` and `oh-package.json5`, and don't fall back to the old `custom_3.7.12_ohos` directory.

## 3. Place the HAR Files

The fplayer plugin expects two files in `ohos/har/`:

- `flutter.har`: the engine artifact from the Flutter OHOS SDK
- `fplayercore-ohos.har`: from the official ijkplayer release, or downloaded by `tool/fetch_ijkplayer_packages.sh`

`ohos/oh-package.json5` references both through local `file:` paths:

```json5
{
  "dependencies": {
    "@ohos/flutter_ohos": "file:./har/flutter.har",
    "@fplayer/fplayercore": "file:./har/fplayercore-ohos.har"
  }
}
```

## 4. Build

Run the Flutter OHOS build from the OHOS directory of your app project:

```bash
flutter build hap
```

Before the first build, check that:

- `flutter pub get` has run
- both `ohos/har/flutter.har` and `ohos/har/fplayercore-ohos.har` exist
- the DevEco SDK version matches the hvigor configuration
- installing on a real device has a signing configuration

## Known Limitations

- Writing the system volume isn't available on OHOS. The call returns success but leaves the volume untouched.
- `takeSnapShot()` isn't implemented on OHOS.
- The full capability matrix and the latest build notes live in `docs/ohos.md` in the fplayer repository.
