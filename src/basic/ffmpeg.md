---
title: ffmpeg参数相关
---

## 设置播放器属性

设置播放器的属性属于高级用法。  
这里介绍设置属性的方法，以及和播放器相关的主要属性。

设置属性方法同时可用于设置 ffmpeg 属性， 比如 avcodec avformat avresmple 相关属性等，这里的文档无法提供全部内容。更多关于 ffmpeg 的属性请去阅读 ffmpeg 文档，或者去搜索引擎查找资料。


设置播放器属性需要在调用 `prepareAsync()` 之前，否则设置仅被保存下来，但不会应用到相应使用此属性值的执行逻辑中。
调用 `reset()` 之后，已经设置的 option 不会被重置，依然有效。

如果在 `prepareAsync()` 之后设置了 option 的值，那么这些值会在此播放器下次调用 `prepareAsync()` 的时候生效。

## 单次属性设置

单次属性设置使用 `FijkPlayer` class 的方法。  
参数 `category` 使用 `FijkOption` class 中的静态常量
`formatCategory`, `codecCategory`，`swsCategory`, `playerCategory`, `swrCategory`。

```dart
Future<void> setOption(int category, String key, dynamic value);
```
value 可以是 String 或者 int 类型，分别用于设置字符串类型和整型的播放器属性。

## 批量属性设置

批量设置播放器属性使用 `applyOptions` 方法。

```dart
Future<void> applyOptions(FijkOption fijkOption) async;
```

先将所有的播放器属性设置在 dart 对象 fijkOption 中，然后在一次性传递给 native 层。

```dart
class FijkOption {
    void setPlayerOption(String key, dynamic value);
    void setFormatOption(String key, dynamic value);
    void setCodecOption(String key, dynamic value);
    void setSwsOption(String key, dynamic value);
    void setSwrOption(String key, dynamic value);
}
```

dynamic 类型的参数 value 实际上只接受 `String` 和 `int` 类型，否则会 throw `ArgumentError`。