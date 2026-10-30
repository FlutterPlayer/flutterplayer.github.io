---
title: 快速上手
---

这一节用 `FPlayer` 和 `FView` 做一个最小可播放页面。依赖安装见 [安装](/guide/)。

## 创建页面

```dart
import 'package:fplayer/fplayer.dart';
import 'package:flutter/material.dart';

class PlayerPage extends StatefulWidget {
  const PlayerPage({super.key, required this.url});

  final String url;

  @override
  State<PlayerPage> createState() => _PlayerPageState();
}

class _PlayerPageState extends State<PlayerPage> {
  final FPlayer player = FPlayer();

  @override
  void initState() {
    super.initState();
    player.setDataSource(widget.url, autoPlay: true);
  }

  @override
  void dispose() {
    player.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fplayer')),
      body: Center(
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: FView(player: player),
        ),
      ),
    );
  }
}
```

`FView` 默认使用最小的播放器面板。需要内置手势、播放条和设置面板时，添加
`fplayer_ui` 依赖，并替换为：

```dart
import 'package:fplayer_ui/fplayer_ui.dart';

FView(
  player: player,
  panelBuilder: fPanelBuilder(
    title: '视频标题',
    subTitle: '视频副标题',
  ),
)
```

## 播放状态

`FPlayer` 通过 `FValue` 暴露状态、时长、尺寸和错误信息。可以监听 `player`：

```dart
player.addListener(() {
  final state = player.state;
  final duration = player.value.duration;
  debugPrint('state=$state duration=$duration');
});
```

`FPlayer` 的接口是异步的。需要连续执行多个控制操作时使用 `await`：

```dart
await player.pause();
await player.seekTo(3000);
await player.start();
```

## 音轨

播放器准备完成后可以读取和切换音轨：

```dart
final tracks = await player.getAudioTracks();
for (final track in tracks) {
  debugPrint('${track.index} ${track.language} ${track.codec} ${track.selected}');
}

if (tracks.isNotEmpty) {
  await player.setAudioTrack(tracks.first);
}
```

完整参数和返回值见 [播放器 API](/basic/api)。

## 释放播放器

`FPlayer` 占用原生解码器和纹理资源。页面销毁时必须调用 `release()`；
重复调用 `release()` 是安全的，但不要在释放后继续调用播放控制方法。

## 下一步

- [播放器 API](/basic/api)
- [内置 UI](/skin/immanent)
- [完整示例](https://github.com/FlutterPlayer/fplayer/blob/develop/example/lib/video_page.dart)
