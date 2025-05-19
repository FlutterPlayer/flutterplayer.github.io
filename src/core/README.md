---
title: 替换内核
---

fplayer只是桥接了ijkplayer和flutter,ijkplayer才是真正的播放器内核。在使用的过程中可能会出现需要自己编译内核达到定制裁剪的能力从而达到增加功能或者压缩文件大小等。在使用过程中请注意：

1. 一定要使用项目内核的代码的仓库地址[fplayer-core](https://github.com/FlutterPlayer/ijkplayer)
1. 以本地相对路径引入fijkplayer
1. 以本地相对路径引入ijkplayer

## IOS

编译参考 [此处](/core/build-iOS)

把文件 IJKMediaPlayer.framework 复制到 ${fplayer}/ios/Frameworks 目录中。 修改文件 ${fplayer}/ios/fplayer.podsped 文件内容。

```git
+   # 去掉这三行原先的注释
+   s.preserve_paths = 'Frameworks/*.framework'
+   s.vendored_frameworks = 'Frameworks/IJKPlayer.framework'
+   s.xcconfig = { 'LD_RUNPATH_SEARCH_PATHS' => '"$(PODS_ROOT)/Frameworks/"' }

-   # s.dependency 'fplayer-core', '~> 0.1.1' // 把原先这一行注释掉
```

## Android

编译参考 [此处](/core/build-android)

### fplayer 1.1.3 之前的版本 不含1.1.3

把文件 fplayer-core.aar 复制到 ${fplayer}/android/aars 目录中。 修改文件 ${fplayer}/android/build.gradle 中 dependencies 内容。
```git
-    implementation 'io.github.flutterplayer:fplayer-core:1.0.0' // 注释掉这一行
+    implementation(name: 'fplayer-core', ext: 'aar')  // 去掉这行原先的注释
```

### fplayer 1.1.3 之后的版本包含 1.1.3
把文件 fplayer-core.aar 复制到 ${插件源码}/android/aars 目录中。 修改文件 ${插件源码}/android/build.gradle 中 dependencies 内容。
```git
-    implementation 'io.github.flutterplayer:fplayer-core:1.0.0' // 注释掉这一行
+    implementation fileTree(dir: 'aars', include: ['*.aar']) // 去掉这行原先的注释或者添加这行
```

## HarmonyOS

鸿蒙系统需要先将Flutter的环境准备好可以[参考](/core/harmonyos-init)

准备好了之后就可以开始编译相关的内核代码
