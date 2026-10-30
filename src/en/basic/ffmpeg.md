---
title: FFmpeg Options
---

## Setting player options

Setting player options is an advanced topic.  
This page covers how to set them and which ones matter most for the player.

The same calls configure FFmpeg internals, including avcodec, avformat and swresample properties, and no document can list them all. For the full catalog, read the [FFmpeg documentation](https://ffmpeg.org/documentation.html).


Set options before calling `prepareAsync()`. Set them later and the values are only stored, never picked up by the code that reads them. Options aren't reset by `reset()`: they stay in force after a reset.

If you do set an option after `prepareAsync()`, the new value takes effect the next time this player calls `prepareAsync()`.

## Setting a single option

Use the methods on the `FPlayer` class for one-off options.  
The `category` argument comes from the static constants on `FOption`:
`formatCategory`, `codecCategory`, `swsCategory`, `playerCategory` and `swrCategory`.

```dart
Future<void> setOption(int category, String key, dynamic value);
```
`value` may be a `String` or an `int`, covering string and integer player options.

## Setting options in bulk

Use `applyOptions` to set several at once.

```dart
Future<void> applyOptions(FOption fOption) async;
```

Stage every option on the Dart `fOption` object, then hand the whole set to the native layer in one call.

```dart
class FOption {
    void setPlayerOption(String key, dynamic value);
    void setFormatOption(String key, dynamic value);
    void setCodecOption(String key, dynamic value);
    void setSwsOption(String key, dynamic value);
    void setSwrOption(String key, dynamic value);
}
```

The `value` parameter is typed as dynamic but really only accepts `String` and `int`. Anything else throws an `ArgumentError`.
