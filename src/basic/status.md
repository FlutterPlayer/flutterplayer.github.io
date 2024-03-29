---
title: 播放器状态
---

## 状态说明

|状态名|播放器表现|
|----|----|
|idle| 闲置状态，刚完成构造的 FPlayer 处于此状态。 <br> 此状态下播放器占用少量内存，无额外线程启动。 <br> idle 状态只能通过 setDataSource 转换为 initialized 状态 |
|initialized| 初始化完成状态，和 idle 状态相比，仅是多了输入媒体数据源的信息。 同样无额外线程打开。 |
|asyncPreparing| 异步准备状态，在 initialized 状态调用 prepareAsync 到达此状态。  <br> 这不是一个稳定状态，此状态等待特定任务完成后自动转化为 prepared 状态。 <br> 这一状态的主要准备工作是 探测媒体文件类型，打开媒体文件，打开解码器以及新建解码线程，新建数据 read 线程，打开音频输出设备，新建视频输出线程等。|
|prepared| asyncPreparing 完成指定任务后自动转化为此状态。 <br> 此状态下已经开始缓冲解码了一部分音视频数据，可以随时进行播放。 |
|started| 媒体（视频、音频）正在播放中。|
|paused| 媒体（视频、音频）播放暂停。|
|completed| 媒体（视频、音频）播放完成。 可重新从头开始播放。|
|stopped| 播放器各种线程占用资源都已经释放。 音频设备关闭。 |
|end| 播放器中所有需要手动释放的内存都释放完成。 <br> 处于此状态的播放器只能等待垃圾回收进行内存释放。|
|error| 播放器出现错误。|


### 可播放状态
prepared、 started、 paused、 completed。  
可播放状态中可以通过调用 `start` 转化为 **started** 状态，并且进行媒体播放。
### 稳定状态
idle、 initialized、 prepared、 paused、 completed、 stopped、 end、error。  
稳定状态只可以通过 API 调用转换为其他的状态，不会自主发生状态变化。
### 非稳定状态
asyncPreparing、 started。  
非稳定状态会在一定条件下自动转变为其他状态，也可以通过 API 调用进行状态跳转。


## 完整转换 API

### **idle**

|API名称|目标状态|
|----|----|
| setDataSource()  | initialized |
| reset()  | idle |
| release()  | end |



### **initialized**

|API名称|目标状态|
|----|----|
| prepareAsync()  | asyncPreparing |
| reset()  | idle |
| release()  | end |



### **asyncPreparing**

|API名称|目标状态|
|----|----|
| 处理完成  | prepared |
| 出现错误  | error |
| reset()  | idle |
| release()  | end |

### **prepared**

|API名称|目标状态|
|----|----|
| seekTo()  | prepared |
| start()  | started |
| reset()  | idle |
| release()  | end |


### **started**

|API名称|目标状态|
|----|----|
| seekTo()  | started |
| start()  | started |
| pause()  | paused |
| stop()  | stopped |
| 播放完成  | completed |
| 出现错误  | error |
| reset()  | idle |
| release()  | end |


### **paused**

|API名称|目标状态|
|----|----|
| seekTo()  | paused |
| start()  | started |
| pause()  | paused |
| stop()  | stopped |
| reset()  | idle |
| release()  | end |

### **completed**

|API名称|目标状态|
|----|----|
| seekTo()  | paused |
| start()  | started （从头开始）|
| pause()  | paused |
| stop()  | stopped |
| reset()  | idle |
| release()  | end |


### **stopped**

|API名称|目标状态|
|----|----|
| stop()  | stopped |
| prepareAsync()  | asyncPreparing |
| reset()  | idle |
| release()  | end |

### **error**

|API名称|目标状态|
|----|----|
| reset()  | idle |
| release()  | end |


### **end**

|API名称|目标状态|
|----|----|
| release()  | end |
