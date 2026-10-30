---
title: Custom UI
---

`FView`'s `panelBuilder` decides what sits on top of the video surface. With the `fplayer` core package the default is the minimal panel. When you want a full player UI, start from the [built-in UI](/en/skin/immanent), or build the whole thing yourself.

## FView parameters

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
  bool showSubtitles = true,
  void Function(FData)? onDispose,
});
```

- `player`: the current `FPlayer`. The panel listens to changes in its `FValue`.
- `data`: a data container shared by the fullscreen and inline panels; its contents persist after a panel is destroyed.
- `viewSize`: the actual on-screen size of `FView`.
- `texturePos`: where the video texture sits inside `FView`. It can extend past the `FView` bounds.
- `showSubtitles`: whether to show the built-in subtitle layer. Set it to `false` when you draw your own.
- `onDispose`: called when `FView` is disposed, for restoring system settings or clearing panel state.

`FFit.contain`, `FFit.fill`, and `FFit.cover` control how the video fills its target area. Fullscreen mode uses `fsFit`; normal mode uses `fit`.

## Custom panel example

The panel below puts a single play/pause button in the bottom left corner of the video:

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

Pass it to `FView`:

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

## Notes

- The panel watches player state through `player.addListener`; remove the listener when the panel is disposed.
- Switching to fullscreen rebuilds the panel, so put anything that must survive the switch in `FData`.
- `await` player calls. Avoid calling `start` or `pause` while the player is initializing or in the `asyncPreparing` state.
- If you need the full gestures and settings panel, use [`fplayer_ui`](/en/skin/immanent) rather than reimplementing the player state machine.
