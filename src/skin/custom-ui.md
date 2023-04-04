---
title: 自定义UI
--- 

上一节我们讲了fplayer的内置UI，虽然说有大部分播放器有的功能，但是也很难满足一些需求，这样就需要自定义UI来满足这些需求，这节主要介绍如何自定义UI并使用

## 替换皮肤
首先介绍下FView构造函数中的参数，替换皮肤就需要修改里面的panelBuilder函数。

```dart
typedef FPanelWidgetBuilder = Widget Function(
  FPlayer player,
  FData data,
  BuildContext context,
  Size viewSize,
  Rect texturePos, 
);

FView({
  @required FPlayer player,
  double width,
  double height,
  Color color = Colors.blueGrey,
  FFit fsFit = FFit.contain,
  FFit fit = FFit.contain,
  ImageProvider cover,
  FPanelWidgetBuilder panelBuilder,
  void Function(FData)? onDispose,
}) 
```

* `player`： 播放器 FPlayer 对象，FView 所显示视频的数据来源，自定义UI所控制的播放器对象。  
  监听此 player 的属性变化并在 UI 上作出相应的改变。
* `data`： 播放器在全屏模式和非全屏模式切换时，panel 会销毁并重新初始化，如果要在全屏模式和非全屏模式的 panel 中共享一些数据，可以把数据保存在 FData 中。
* `context`： build Widget 的上下文。
* `viewSize`： 对应 FView 的实际显示大小
* `texturePos`： FView 中实际视频显示的相对位置，这个相对位置可能超出 `FView` 的实际大小

如果在 panel 控制中修改了一些系统参数，可以记录到 FData 中，等 FView 销毁时，在 FView 的 `onDispose` 回掉函数中恢复系统默认值。

* `FFit.contain`：`texturePos` 是绝对不会超出 `viewSize` 的大小。
* `FFit.fill`：`texturePos` 的宽高肯定是和 `viewSize` 的宽高相等，`texturePos` 的相对偏移是 0。
* `FFit.cover`：且 FView 宽高比例和实际视频宽高比例不等的情况下，`texturePos` 宽高肯定超出 `viewSize` 的大小。

## demo
利用上面描述的自定义播放器控制 UI 的接口，我们实际编码实现一个非常简单的 UI。
UI 描述： 在视频显示区域的左下角根据实际播放器状态显示一个播放、暂停按钮。

```dart
class CustomFPanel extends StatefulWidget {
  final FPlayer player;
  final BuildContext buildContext;
  final Size viewSize;
  final Rect texturePos;

  const CustomFPanel({
    @required this.player,
    this.buildContext,
    this.viewSize,
    this.texturePos,
  });

  @override
  _CustomFPanelState createState() => _CustomFPanelState();
}

class _CustomFPanelState extends State<CustomFPanel> {

  FPlayer get player => widget.player;
  bool _playing = false;

  @override
  void initState() {
    super.initState();
    widget.player.addListener(_playerValueChanged);
  }

  void _playerValueChanged() {
    FValue value = player.value;

    bool playing = (value.state == FState.started);
    if (playing != _playing) {
      setState(() {
        _playing = playing;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Rect rect = Rect.fromLTRB(
      max(0.0, widget.texturePos.left),
      max(0.0, widget.texturePos.top),
      min(widget.viewSize.width, widget.texturePos.right),
      min(widget.viewSize.height, widget.texturePos.bottom),
    );
    return Positioned.fromRect(
      rect: rect,
      child: Container(
        alignment: Alignment.bottomLeft,
        child: IconButton(
          icon: Icon(
            _playing ? Icons.pause : Icons.play_arrow,
            color: Colors.white,
          ),
          onPressed: () {
            _playing ? widget.player.pause() : widget.player.start();
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    player.removeListener(_playerValueChanged);
  }
}
```

然后作为 panelBuilder 参数传递给 FView 的构造函数。这样一个简单的自定义皮肤就完成了。

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
    return CustomFPanel(
      player: player,
      buildContext: context,
      viewSize: viewSize,
      texturePos: texturePos,
    );
  },
)
```