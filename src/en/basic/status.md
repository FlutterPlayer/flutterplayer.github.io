---
title: Player States
---

## What each state means

|State|Player behavior|
|----|----|
|idle| Idle. A freshly constructed `FPlayer` sits here. <br> It holds a little memory and starts no extra threads. <br> From idle, only `setDataSource` can move it to `initialized`. |
|initialized| Initialized. Compared with idle, the player now knows the input media source. Still no extra threads. |
|asyncPreparing| Asynchronously preparing. You get here by calling `prepareAsync` from `initialized`.  <br> This isn't a stable state: it waits for specific work to finish, then flips to `prepared` on its own. <br> That work covers probing the media type, opening the file, opening decoders and starting decode threads, starting a read thread, opening the audio output device, and starting video output threads.|
|prepared| `asyncPreparing` lands here once its work is done. <br> Some audio and video has already been buffered and decoded, so playback can begin at any moment. |
|started| Media (video or audio) is playing.|
|paused| Playback of media (video or audio) is paused.|
|completed| Playback of media (video or audio) finished. You can play it again from the start.|
|stopped| Every thread has released its resources. The audio device is closed. |
|end| Every buffer that needed manual release has been freed. <br> A player in this state just waits for garbage collection to reclaim the rest.|
|error| The player hit an error.|


### Playable states
`prepared`, `started`, `paused`, `completed`.  
From any playable state, `start` moves the player to **started** and playback runs.
### Stable states
`idle`, `initialized`, `prepared`, `paused`, `completed`, `stopped`, `end`, `error`.  
A stable state only changes when an API call moves it. It never shifts on its own.
### Unstable states
`asyncPreparing`, `started`.  
An unstable state changes on its own once conditions are met, and API calls can also push it to another state.


## Every transition

### **idle**

|API call|Target state|
|----|----|
| setDataSource()  | initialized |
| reset()  | idle |
| release()  | end |



### **initialized**

|API call|Target state|
|----|----|
| prepareAsync()  | asyncPreparing |
| reset()  | idle |
| release()  | end |



### **asyncPreparing**

|API call|Target state|
|----|----|
| Preparation completes  | prepared |
| An error occurs  | error |
| reset()  | idle |
| release()  | end |

### **prepared**

|API call|Target state|
|----|----|
| seekTo()  | prepared |
| start()  | started |
| reset()  | idle |
| release()  | end |


### **started**

|API call|Target state|
|----|----|
| seekTo()  | started |
| start()  | started |
| pause()  | paused |
| stop()  | stopped |
| Playback completes  | completed |
| An error occurs  | error |
| reset()  | idle |
| release()  | end |


### **paused**

|API call|Target state|
|----|----|
| seekTo()  | paused |
| start()  | started |
| pause()  | paused |
| stop()  | stopped |
| reset()  | idle |
| release()  | end |

### **completed**

|API call|Target state|
|----|----|
| seekTo()  | paused |
| start()  | started (from the beginning)|
| pause()  | paused |
| stop()  | stopped |
| reset()  | idle |
| release()  | end |


### **stopped**

|API call|Target state|
|----|----|
| stop()  | stopped |
| prepareAsync()  | asyncPreparing |
| reset()  | idle |
| release()  | end |

### **error**

|API call|Target state|
|----|----|
| reset()  | idle |
| release()  | end |


### **end**

|API call|Target state|
|----|----|
| release()  | end |
