---
title: 播放器API
---

## 播放器接口  

### FijkPlayer
```dart
FijkPlayer fplayer = FijkPlayer();
```
播放器 `fplayer` 创建后，java/objc 层的播放器以及 C 层的播放器也随之一起完成对象创建或 struct 内存分配。终其一生，这个 `fplayer` 就只能对应这一个 C 层的 `FFPlayer`。 并且在使用完成之后， `fplayer`  必须释放其内部 `FFPlayer` 所占用的资源。

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
Future<int> setDataSource(String path, {bool autoPlay = false, bool showCover = false}) async
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
await setOption(FijkOption.playerCategory, "start-on-prepared", 1);
await prepareAsync();
```
可选参数 `showCover` 设置为 true 时，播放器会在解析完成数据后渲染第一帧视频，然后暂停。
暂停之后播放器依然继续加载数据放入缓冲中。等价于调用  
```dart
await setDataSource(url);
await setOption(FijkOption.playerCategory, "cover-after-prepared", 1);
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
Future<void> seekTo() async
```
```dart
// usage
fplayer.seekTo(3000);
```
控制播放器进行播放进度，参数以毫秒为单位。只能在可播放状态下调用此接口。

**播放器状态控制接口都是 async 异步接口。如果需要连续调用多个播放器控制接口，需要使用 `await` 或者 `Future.then()` 等待异步完成。
不等待前一个调用完成就直接调用后一个方法可能会出现状态错误问题。**


##  其他接口

### setVolume
```dart
Future<void> setVolume() async
```
```dart
fplayer.setVolume(0.5);
```
音量设置范围在 [0.0, 1.0]，设置超出此范围的音量只效果无法保障。

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

### enterFullScreen
```dart 
void enterFullScreen()
```
这两个方法仅仅是修改了播放器中的一个属性，全屏 UI 变化主要代码在 FijkView 中实现，FijkView 去监听这个属性的变化而作出全屏状态改变。

### exitFullScreen
```dart 
void exitFullScreen()
```
