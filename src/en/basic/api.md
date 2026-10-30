---
title: Player API
---

## Player interface

### FPlayer
```dart
FPlayer fplayer = FPlayer();
```
Creating `fplayer` also brings up the native player on Android/iOS/macOS/Windows/OpenHarmony and the `fplayercore` C layer underneath. You have to release those resources with `release()`.

### release
```dart
Future<void> release() async
```
```dart
// usage
fplayer.release();
```
Inside, `release` checks the current player state and decides whether it needs to call `stop` first. That means you can call `release` from any state to free the underlying resources.


## Playback control

### setDataSource
```dart
Future<void> setDataSource(
  String path, {
  Map<String, String?>? headers,
  bool autoPlay = false,
  bool showCover = false,
})
```
```dart
/// usage
/// autoPlay: true is equivalent to calling setDataSource, prepareAsync and start
fplayer.setDataSource("http://samplevideo.com/sample.flv", autoPlay: true);
///
/// Set a local asset as the media source.
/// Declare the asset in pubspec.yml:
///   assets:
///     - assets/butterfly.mp4
///
/// The scheme is `asset`; `://` separates the scheme and `/` starts the path.
fplayer.setDataSource("asset:///assets/butterfly.mp4", autoPlay: true);
```
Sets the media source. The call works out the resource type itself, whether that's a network stream, a local file or something else.  
Setting the optional `autoPlay` flag to true calls `prepareAsync` and `start` after the source is set, so playback begins on its own. It's equivalent to:  
```dart
await setDataSource(url);
await setOption(FOption.playerCategory, "start-on-prepared", 1);
await prepareAsync();
```
Setting the optional `showCover` flag to true makes the player render the first video frame once it finishes parsing, then pause. The player keeps loading data into its buffers while paused. It's equivalent to:  
```dart
await setDataSource(url);
await setOption(FOption.playerCategory, "cover-after-prepared", 1);
await prepareAsync();
```

### prepareAsync  
```dart
Future<void> prepareAsync() async
```
```dart
// usage
fplayer.prepareAsync();
```
Kicks the player into action: it spins up its resources, parses the media and gets ready to play. When the call returns, the player is in `asyncPreparing`; after preparation completes it moves to `prepared`. You must call `setDataSource` before this.

### start  
```dart
Future<void> start() async
```
```dart
// usage
fplayer.start();
```
Starts playback.

### pause  
```dart
Future<void> pause() async
```
```dart
// usage
fplayer.pause();
```
Pauses the player.

### stop  
```dart
Future<void> stop() async
```
```dart
// usage
fplayer.stop();
```
Stops playback. After `stop` you can't return to playing by calling `start` directly.

### reset  
```dart
Future<void> reset() async
```
```dart
// usage
fplayer.reset();
```
Resets the player to `idle`, after which you can call `setDataSource` again.


### seekTo  
```dart
Future<void> seekTo(int msec)
```
```dart
// usage
fplayer.seekTo(3000);
```
Moves playback to a new position. The argument is in milliseconds and must be 0 or greater. Only callable from a playable state.

**Every playback control method is async. When you need to chain several of them, wait on each one with `await` or `Future.then()`. Calling the next method before the previous one finishes can leave the player in the wrong state.**


## Other methods

### setVolume
```dart
Future<void> setVolume(double volume)
```
```dart
fplayer.setVolume(0.5);
```
Volume ranges from 0.0 to 1.0. Anything outside that range returns a parameter error.

### setLoop
```dart
Future<void> setLoop(int loopCount) async
```
```dart
fplayer.setLoop(10);
```
The default loop count is 1, meaning no looping. Set it to 0 to loop forever.

### setSpeed
```dart
Future<void> setSpeed(double speed) async
```
```dart
fplayer.setSpeed(1.5);
```
Don't push the rate too far. Pick a multiplier that feels right for the content you're playing.

## Audio tracks

Once the player is prepared, call `getAudioTracks` for the track list of the current media, then `setAudioTrack` to switch. Works on Android, iOS, macOS, Windows and OpenHarmony.

### FAudioTrack

| Field | Type | Description |
| --- | --- | --- |
| `index` | `int` | Stream index of the track, used when switching |
| `language` | `String?` | Track language |
| `codec` | `String?` | Short codec name, for example `aac` |
| `codecLongName` | `String?` | Full codec name |
| `sampleRate` | `int?` | Sample rate in Hz |
| `channelLayout` | `int?` | FFmpeg channel layout mask |
| `selected` | `bool` | Whether this is the currently selected track |

### getAudioTracks
```dart
Future<List<FAudioTrack>> getAudioTracks() async
```
```dart
final tracks = await fplayer.getAudioTracks();
for (final track in tracks) {
  print('${track.index} ${track.language} ${track.codec} ${track.selected}');
}
```

Returns the audio tracks of the current media. You get an empty list when the player hasn't finished preparing or the media has no audio tracks.

### setAudioTrack
```dart
Future<void> setAudioTrack(FAudioTrack track) async
```
```dart
final tracks = await fplayer.getAudioTracks();
if (tracks.isNotEmpty) {
  await fplayer.setAudioTrack(tracks.first);
}
```

`track.index` must be one of the indexes returned by `getAudioTracks`. After switching, call `getAudioTracks` again to confirm the `selected` flag moved where you expected.

## Subtitles

Subtitle tracks follow the same discovery and switching flow as audio tracks, and the player decodes subtitles by default. Works on Android, iOS, macOS, Windows and OpenHarmony. `FView` draws the current subtitle at the bottom of the video by default; pass `showSubtitles: false` to turn the built-in subtitle layer off.

### FSubtitleTrack

| Field | Type | Description |
| --- | --- | --- |
| `index` | `int` | Stream index of the subtitle track, used when switching |
| `language` | `String?` | Subtitle language |
| `codec` | `String?` | Short codec name, for example `subrip` |
| `codecLongName` | `String?` | Full codec name |
| `selected` | `bool` | Whether this is the currently selected subtitle track |

### getSubtitleTracks
```dart
Future<List<FSubtitleTrack>> getSubtitleTracks() async
```
```dart
final tracks = await fplayer.getSubtitleTracks();
for (final track in tracks) {
  print('${track.index} ${track.language} ${track.codec} ${track.selected}');
}
```

Returns the subtitle tracks of the current media. You get an empty list when the player hasn't finished preparing or the media has no subtitle tracks.

### setSubtitleTrack
```dart
Future<void> setSubtitleTrack(FSubtitleTrack? track) async
```
```dart
final tracks = await fplayer.getSubtitleTracks();
if (tracks.isNotEmpty) {
  await fplayer.setSubtitleTrack(tracks.first);
}
// Turn subtitles off
await fplayer.setSubtitleTrack(null);
```

`track.index` must be one of the indexes returned by `getSubtitleTracks`. Passing `null` clears the current subtitle selection.

### Subtitle text

`FView` displays subtitle text by default. If you're building your own subtitle layer, listen to `onSubtitleTextUpdate` or read `subtitleText`:

```dart
final subscription = fplayer.onSubtitleTextUpdate.listen((text) {
  print(text ?? '');
});
```

An empty `text` in the event means the current subtitle has ended, so hide your subtitle layer.

### enterFullScreen
```dart 
void enterFullScreen()
```
These two methods only flip a flag on the player. The actual fullscreen UI lives in `FView`, which watches that flag and reworks its layout when it changes.

### exitFullScreen
```dart 
void exitFullScreen()
```
