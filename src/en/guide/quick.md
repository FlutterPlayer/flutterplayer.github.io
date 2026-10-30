---
title: Quick Start
---

This page builds a minimal playable screen with `FPlayer` and `FView`. For dependency setup, see [Installation](/en/guide/).

## Creating the page

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

`FView` shows a minimal player panel by default. For the built-in gestures, control bar, and settings panel, add the `fplayer_ui` dependency and swap the widget for:

```dart
import 'package:fplayer_ui/fplayer_ui.dart';

FView(
  player: player,
  panelBuilder: fPanelBuilder(
    title: 'Video title',
    subTitle: 'Video subtitle',
  ),
)
```

## Playback state

`FPlayer` exposes state, duration, size, and error details through `FValue`. Listen to `player` to pick them up:

```dart
player.addListener(() {
  final state = player.state;
  final duration = player.value.duration;
  debugPrint('state=$state duration=$duration');
});
```

The `FPlayer` interface is asynchronous. When you need several control calls back to back, use `await`:

```dart
await player.pause();
await player.seekTo(3000);
await player.start();
```

## Audio tracks

Once the player is prepared, you can read the audio tracks and switch between them:

```dart
final tracks = await player.getAudioTracks();
for (final track in tracks) {
  debugPrint('${track.index} ${track.language} ${track.codec} ${track.selected}');
}

if (tracks.isNotEmpty) {
  await player.setAudioTrack(tracks.first);
}
```

See [Player API](/en/basic/api) for every parameter and return value.

## Releasing the player

`FPlayer` holds native decoder and texture resources, so the page has to call `release()` when it's disposed. Calling `release()` twice is safe, but don't touch playback control methods after releasing.

## Next steps

- [Player API](/en/basic/api)
- [Built-in UI](/en/skin/immanent)
- [Full example](https://github.com/FlutterPlayer/fplayer/blob/develop/example/lib/video_page.dart)
