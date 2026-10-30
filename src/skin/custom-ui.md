---
title: 自定义UI
---

`FView` 的 `panelBuilder` 用来决定视频区域上层的控件。使用 `fplayer` 核心包时默认是最小面板；需要完整播放器 UI 时可以先参考[内置 UI](/skin/immanent)，或者完全自己实现。

## FView 参数

```dart
typedef FPanelWidgetBuilder = Widget Function(
  FPlayer player,
  FData data,
  BuildContext context,
  Size viewSize,
  Rect texturePos,
);

FView({
  Key? key,
  required FPlayer player,
  double? width,
  double? height,
  FFit fit = FFit.contain,
  FFit fsFit = FFit.contain,
  FPanelWidgetBuilder panelBuilder = minimalFPanelBuilder,
  Color color = const Color(0xFF607D8B),
  ImageProvider? cover,
  bool fs = true,
  void Function(FData)? onDispose,
});
```

- `player`：当前 `FPlayer`，面板监听它的 `FValue` 变化。
- `data`：全屏和非全屏面板共享的数据容器；面板销毁后数据仍可保留。
- `viewSize`：`FView` 的实际显示尺寸。
- `texturePos`：视频纹理在 `FView` 中的位置，可能超出 `FView` 边界。
- `onDispose`：`FView` 销毁时恢复系统设置或清理面板状态。

`FFit.contain`、`FFit.fill`、`FFit.cover` 分别控制视频在目标区域内的填充方式；全屏使用 `fsFit`，普通模式使用 `fit`。

## 自定义面板示例

下面的面板只在视频左下角显示一个播放/暂停按钮：

```dart
import 'dart:math';

import 'package:fplayer/fplayer.dart';
import 'package:flutter/material.dart';

class CustomPanel extends StatefulWidget {
  const CustomPanel({
    super.key,
    required this.player,
    required this.viewSize,
    required this.texturePos,
  });

  final FPlayer player;
  final Size viewSize;
  final Rect texturePos;

  @override
  State<CustomPanel> createState() => _CustomPanelState();
}

class _CustomPanelState extends State<CustomPanel> {
  bool _playing = false;

  @override
  void initState() {
    super.initState();
    widget.player.addListener(_playerValueChanged);
  }

  void _playerValueChanged() {
    final playing = widget.player.state == FState.started;
    if (playing != _playing) {
      setState(() => _playing = playing);
    }
  }

  @override
  Widget build(BuildContext context) {
    final rect = Rect.fromLTRB(
      max(0.0, widget.texturePos.left),
      max(0.0, widget.texturePos.top),
      min(widget.viewSize.width, widget.texturePos.right),
      min(widget.viewSize.height, widget.texturePos.bottom),
    );

    return Positioned.fromRect(
      rect: rect,
      child: Align(
        alignment: Alignment.bottomLeft,
        child: IconButton(
          color: Colors.white,
          icon: Icon(_playing ? Icons.pause : Icons.play_arrow),
          onPressed: () {
            _playing ? widget.player.pause() : widget.player.start();
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    widget.player.removeListener(_playerValueChanged);
    super.dispose();
  }
}
```

传给 `FView`：

```dart
FView(
  player: player,
  panelBuilder: (
    FPlayer player,
    FData data,
    BuildContext context,
    Size viewSize,
    Rect texturePos,
  ) {
    return CustomPanel(
      player: player,
      viewSize: viewSize,
      texturePos: texturePos,
    );
  },
)
```

## 注意事项

- 面板通过 `player.addListener` 监听状态，销毁时必须移除监听。
- 全屏切换会重建面板，需要跨全屏保留的数据放入 `FData`。
- 控制播放器时使用 `await`，避免在初始化或 `asyncPreparing` 状态调用 `start`、`pause`。
- 需要完整的手势和设置面板时，优先使用 [`fplayer_ui`](/skin/immanent)，不要重复实现播放器状态机。
