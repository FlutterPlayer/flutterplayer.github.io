---
title: 播放器API
---

## 播放器接口  

### FPlayer
```dart
FPlayer fplayer = FPlayer();
```
播放器 `fplayer` 创建后，Android/iOS/macOS/Windows/OpenHarmony 各端的原生播放器和 C 层 `fplayercore` 也会完成初始化。它必须通过 `release()` 释放底层资源。

### release
```dart
Future<void> release() async
```
```dart
// usage
fplayer.release();
```
release 方法内部会根据当前的播放器状态判断是否需要调用 `stop` 接口。 所以可以在播放器的任何状态下调用 `release` 接口进行资源释放。


## 播放控制

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
/// autoPlay 为 true 时等同于连续调用 setDataSource、prepareAsync、start
fplayer.setDataSource("http://samplevideo.com/sample.flv", autoPlay: true);
///
/// 设置本地资源作为播放源，
/// pubspec.yml 中需要指定assets 内容
///   assets:
///     - assets/butterfly.mp4
///
/// scheme 是 `asset`, `://` 是 scheme 分隔符， `/` 是路径起始符号
fplayer.setDataSource("asset:///assets/butterfly.mp4", autoPlay: true);
```
设置播放器播放资源，接口内部会尝试自动判断资源类型，比如网络资源，本地文件资源等。  
可选参数 `autoPlay` 设置为 true 时会在设置资源后调用 `prepareAsync` 和 `start` 接口自动播放。等价于调用  
```dart
await setDataSource(url);
await setOption(FOption.playerCategory, "start-on-prepared", 1);
await prepareAsync();
```
可选参数 `showCover` 设置为 true 时，播放器会在解析完成数据后渲染第一帧视频，然后暂停。
暂停之后播放器依然继续加载数据放入缓冲中。等价于调用  
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
控制播放器开始启动各种资源，解析媒体内容，准备进行媒体播放。 函数调用结束后，播放器状态变为 `asyncPreparing`，等待准备工作完成后，播放器状态会变为 `prepared`。 调用次方法前必须先设置 dataSource。

### start  
```dart
Future<void> start() async
```
```dart
// usage
fplayer.start();
```
控制播放器开始播放。

### pause  
```dart
Future<void> pause() async
```
```dart
// usage
fplayer.pause();
```
控制播放器进入暂停状态。

### stop  
```dart
Future<void> stop() async
```
```dart
// usage
fplayer.stop();
```
控制播放器终止播放，`stop` 之后不可以直接通过 `start` 接口进入播放状态。

### reset  
```dart
Future<void> reset() async
```
```dart
// usage
fplayer.reset();
```
重置播放器进入 `idle` 状态，可以再次 `setDataSource`。


### seekTo  
```dart
Future<void> seekTo(int msec)
```
```dart
// usage
fplayer.seekTo(3000);
```
控制播放器播放进度，参数以毫秒为单位，且必须大于等于 0。只能在可播放状态下调用。

**播放器状态控制接口都是 async 异步接口。如果需要连续调用多个播放器控制接口，需要使用 `await` 或者 `Future.then()` 等待异步完成。
不等待前一个调用完成就直接调用后一个方法可能会出现状态错误问题。**


##  其他接口

### setVolume
```dart
Future<void> setVolume(double volume)
```
```dart
fplayer.setVolume(0.5);
```
音量设置范围在 [0.0, 1.0]，超出范围会返回参数错误。

### setLoop
```dart
Future<void> setLoop(int loopCount) async
```
```dart
fplayer.setLoop(10);
```
默认播放器的循环次数是1， 即不循环播放。如果设置循环次数0，表示无限循环。

### setSpeed
```dart
Future<void> setSpeed(double speed) async
```
```dart
fplayer.setSpeed(1.5);
```
倍速调整不宜过大，请根据实际效果设定合适的倍速值。

## 音轨

播放器准备完成后可以通过 `getAudioTracks` 获取当前媒体的音轨列表，再通过 `setAudioTrack` 切换音轨。Android、iOS、macOS、Windows 和 OpenHarmony 均支持。

### FAudioTrack

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `index` | `int` | 音轨的流索引，切换时使用 |
| `language` | `String?` | 音轨语言 |
| `codec` | `String?` | 编码短名称，例如 `aac` |
| `codecLongName` | `String?` | 编码完整名称 |
| `sampleRate` | `int?` | 采样率，单位 Hz |
| `channelLayout` | `int?` | FFmpeg 声道布局掩码 |
| `selected` | `bool` | 是否为当前选中的音轨 |

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

返回当前媒体的音轨列表。播放器尚未准备完成或媒体没有音轨时返回空列表。

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

`track.index` 必须是 `getAudioTracks` 返回的音轨索引。切换后可以再次调用 `getAudioTracks` 确认 `selected` 状态。

## 字幕

字幕轨与音轨使用同样的发现和切换流程，播放器默认开启字幕解码。Android、iOS、macOS、Windows 和 OpenHarmony 均支持。`FView` 默认在画面底部渲染当前字幕，也可以通过 `showSubtitles: false` 关闭内置字幕层。

### FSubtitleTrack

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `index` | `int` | 字幕轨的流索引，切换时使用 |
| `language` | `String?` | 字幕语言 |
| `codec` | `String?` | 编码短名称，例如 `subrip` |
| `codecLongName` | `String?` | 编码完整名称 |
| `selected` | `bool` | 是否为当前选中的字幕轨 |

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

返回当前媒体的字幕轨列表。播放器尚未准备完成或媒体没有字幕轨时返回空列表。

### setSubtitleTrack
```dart
Future<void> setSubtitleTrack(FSubtitleTrack? track) async
```
```dart
final tracks = await fplayer.getSubtitleTracks();
if (tracks.isNotEmpty) {
  await fplayer.setSubtitleTrack(tracks.first);
}
// 关闭字幕
await fplayer.setSubtitleTrack(null);
```

`track.index` 必须是 `getSubtitleTracks` 返回的字幕轨索引。传入 `null` 会取消当前选中的字幕轨。

### 字幕文本

`FView` 默认显示字幕文本。使用自定义字幕层时，可以监听 `onSubtitleTextUpdate` 或读取 `subtitleText`：

```dart
final subscription = fplayer.onSubtitleTextUpdate.listen((text) {
  print(text ?? '');
});
```

事件中的 `text` 为空时表示当前字幕已经结束，需要隐藏字幕层。

### enterFullScreen
```dart 
void enterFullScreen()
```
这两个方法仅仅是修改了播放器中的一个属性，全屏 UI 变化主要代码在 FView 中实现，FView 去监听这个属性的变化而作出全屏状态改变。

### exitFullScreen
```dart 
void exitFullScreen()
```
