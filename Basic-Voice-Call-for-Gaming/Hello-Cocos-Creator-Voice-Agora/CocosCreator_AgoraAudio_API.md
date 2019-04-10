
- JS API 接口：提供纯语音版游戏 SDK 在 CocosCreate平台上的其他方法和回调，包括：
   * [主要方法](#agoraCreatorInst)
   * [语音控制方法](#rtcengineparameters)
   * [主回调事件](#irtcengineeventhandler)
   * [错误代码和警告代码](#irtcerror)

<a id = "agoraCreatorInst"></a>
### 主要方法 (agoraCreatorInst)

#### 创建agoraCreator对象

```
var agoraCreator = require("agoraCreator");

agoraCreator.createEngine("AGORA APP ID");  
```

注意: 在整个应用全局，开发者只需要对引擎做一次初始化。另外引擎的异步调用的回调，如：加入频道成功、退出频道成功等消息，都在同一个对象里。

Agora 音频实时云传输服务，不区分调试环境和正式环境。

创建agoraCreator对象，返回实例agoraCreatorInst对象。agoraCreatorInst对象提供的接口方法，如无特殊说明，都是异步调用，对接口的调用建议在同一个线程进行。 所有返回值为 int 型的 API，如无特殊说明，返回值 0 为调用成功，返回值小于 0 为调用失败。


#### 设置频道属性 (setChannelProfile)

```
agoraCreatorInst.setChannelProfile(profile);
```

该方法用于设置频道模式(Profile)。引擎需知道应用程序的使用场景(例如通信模式或直播模式), 从而使用不同的优化手段。

**注意：**  参数只可使用枚举类型对应的，整型值。其它API类同。

目前 Agora Native SDK 支持以下几种模式:

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>模式</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>通信</td>
<td>通信为默认模式，用于常见的一对一或群聊，频道中的任何用户可以自由说话</td>
</tr>
<tr><td>直播</td>
<td>直播模式有主播和观众两种用户角色，可以通过调用 setClientRole 设置。主播可收发语音和视频，但观众只能收，不能发</td>
</tr>
<tr><td>游戏语音</td>
<td>频道内任何用户可自由发言。该模式下默认使用低功耗低码率的编解码器</td>
</tr>
</tbody>
</table>

> -   同一频道内只能同时设置一种模式。如果想要切换模式，则需要先调用 release 销毁当前引擎，然后重新调用 `createEngine`，再调用该方法切换频道模式。
> -   不同的频道模式必须使用不同的 App ID。
> -   该方法必须在加入频道前调用和进行设置，进入频道后无法再设置。


<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>profile</td>
<td><p>频道模式：</p>
<ul>
<li>CHANNEL_PROFILE_COMMUNICATION = 0: 通信模式 (默认)</li>
<li>CHANNEL_PROFILE_LIVE_BROADCASTING = 1: 直播模式</li>

</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 设置用户角色 (setClientRole)

```
agoraCreatorInst.setClientRole(CLIENT_ROLE_TYPE role);
```

直播模式下，在加入频道前，用户需要通过本方法设置观众(默认)或主播模式；在加入频道后，用户可以通过本方法切换用户模式。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>role</td>
<td><p>直播场景里的用户角色。</p>
<ul>
<li>CLIENT_ROLE_BROADCASTER = 1; 主播</li>
<li>CLIENT_ROLE_AUDIENCE = 2; 观众(默认)</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 打开音频 (enableAudio)

```
agoraCreatorInst.enableAudio();
```

打开音频(默认为开启状态)。返回值:

-   0: 方法调用成功

-   <0: 方法调用失败

> 该方法设置内部引擎为启用状态，在 `leaveChannel` 后仍然有效。

#### 关闭/重启本地语音功能 (enableLocalAudio)

```
agoraCreatorInst.enableLocalAudio(bool enabled);
```

当用户加入频道时，语音功能默认是开启的。该方法可以关闭或重新开启本地语音功能，停止或重新开始本地音频采集及处理。
该方法不影响接收或播放远端音频流，适用于只听不发的用户场景。
语音功能关闭或重新开启后，会收到回调 `onMicrophoneEnabled`。

> - 该方法需要在 `joinChannel` 之后调用才能生效。
> - 该方法与 `muteLocalAudioStream` 的区别在于：
>    *  `enableLocalAudio`：开启或关闭本地语音采集及处理
>    *  `muteLocalAudioStream`：停止或继续发送本地音频流

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>enabled</td>
<td>
<ul>
<li>true：重新开启本地语音功能，即开启本地语音采集或处理</li>
<li>false：关闭本地语音功能，即停止本地语音采集或处理</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>

#### 关闭音频 (disableAudio)

```
agoraCreatorInst.disableAudio();
```

关闭音频。返回值:

-   0: 方法调用成功

-   <0: 方法调用失败


> 该方法设置内部引擎为禁用状态，在 `leaveChannel` 后仍然有效。

#### 加入频道 (joinChannel)

```
agoraCreatorInst.joinChannel(token, channelId, info, uid);
```

该方法让用户加入通话频道，在同一个频道内的用户可以互相通话，多个用户加入同一个频道，可以群聊。 使用不同 App ID 的应用程序是不能互通的。如果已在通话中，用户必须调用 `leaveChannel()` 退出当前通话，才能进入下一个频道。


> 同一个频道里不能出现两个相同的 UID。如果你的 App 支持多设备同时登录，即同一个用户账号可以在不同的设备上同时登录(例如微信支持在 PC 端和移动端同时登录)，请保证传入的 UID 不相同。 例如你之前都是用同一个用户标识作为 UID, 建议从现在开始加上设备 ID, 以保证传入的 UID 不相同 。如果你的 App 不支持多设备同时登录，例如在电脑上登录时，手机上会自动退出，这种情况下就不需要在 UID 上添加设备 ID。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>token</td>
<td><ul>
<li>安全要求不高: 将值设为 null</li>
<li>安全要求高: 将值设置为 Token 值。 如果你已经启用了 App Certificate, 请务必使用 Token。 关于如何获取 Token，详见 <a href="https://docs.agora.io/cn/Voice/token?platform=All%20Platforms"><span>密钥说明</span></a> 。</li>
</ul>
</td>
</tr>
<tr><td>channelId</td>
<td>标识通话的频道名称，长度在64字节以内的字符串。以下为支持的字符集范围（共89个字符）: a-z,A-Z,0-9,space,! #$%&amp;,()+, -,:;&lt;=.#$%&amp;,()+,-,:;&lt;=.,&gt;?@[],^_,{|},~</td>
</tr>
<tr><td>info</td>
<td>(非必选项) 开发者需加入的任何附加信息。一般可设置为空字符串，或频道相关信息。该信息不会传递给频道内的其他用户</td>
</tr>
<tr><td>uid</td>
<td>(非必选项) 用户ID，32位无符号整数。建议设置范围：1到 (2^32-1)，并保证唯一性。如果不指定（即设为0），SDK 会自动分配一个，并在 <code>onJoinChannelSuccess</code> 回调方法中返回，App 层必须记住该返回值并维护，SDK不对该返回值进行维护
uid 在 SDK 内部用 32 位无符号整数表示，由于 Java 不支持无符号整数，uid 被当成 32 位有符号整数处理，对于过大的整数，Java 会表示为负数，如有需要可以用(uid&amp;0xffffffffL)转换成 64 位整数</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用失败</li>
<li>ERR_INVALID_ARGUMENT (-2)：传递的参数无效</li>
<li>ERR_NOT_READY (-3)：没有成功初始化</li>
</ul>
</td>
</tr>
</tbody>
</table>



> 在iOS上，`joinChannel()` 时，SDK 调用 `setCategoryAVAudioSessionCategoryPlayAndRecord` 将 `AVAudioSession` 设置到 `PlayAndRecord` 模式，应用程序不应将其设置到其他模式。设置该模式时，正在播放的声音会被打断（比如正在播放的响铃声）。

#### 离开频道 (leaveChannel)

```
agoraCreatorInst.leaveChannel();
```

离开频道，即挂断或退出通话。joinChannel后，必须调用 leaveChannel 以结束通话，否则不能进行下一次通话。 不管当前是否在通话中，都可以调用 leaveChannel，没有副作用。如果成功，则返回值为0。leaveChannel 会把会话相关的所有资源释放掉。

leaveChannel 是异步操作，调用返回时并没有真正退出频道。在真正退出频道后，SDK 会触发 onLeaveChannel 回调。

> 如果你调用了 `leaveChannel()` 后立即调用 `release()`，SDK 将无法触发 `onLeaveChannel` 回调。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
<li>ERR_REFUSED (-5): 离开频道失败，当前状态不在通话中，或者正在离开频道</li>
</ul>
</td>
</tr>
</tbody>
</table>


#### 设置本地语音音调 (setLocalVoicePitch)

```
iagoraCreatorInst.setLocalVoicePitch(pitch);
```

该方法改变本地说话人声音的音调。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>pitch</td>
<td>语音频率可以 [0.5, 2.0] 范围内设置。默认值为 1.0</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt; 0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>

#### 设置远端用户的语音位置 (setRemoteVoicePosition)

```
agoraCreatorInst.setRemoteVoicePosition(uid, pan, gain);
```

该方法设置远端用户的语音位置。

> 该方法只在耳机模式下有效，在外放模式下无效。

<table>
<colgroup>
<col>
</col>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td><p>远端用户的 UID</p>
</td></tr>
<tr><td>pan</td>
<td><p>设置是否改变音效的空间位置。取值范围为 [-1, 1]：
<ul>
<li>0：表示该音效出现在正前方</li>
<li>-1：表示该音效出现在左边</li>
<li>1：表示该音效出现在右边</li>
</ul>
</td>
</tr>
<tr><td>gain</td>
<td><p>设置是否改变单个音效的音量。取值范围为 [0.0, 100.0]。
默认值为 100.0。取值越小，音效的音量越低。</p>
</td></tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt; 0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>

#### 设置仅限语音模式 (setVoiceOnlyMode)

```
agoraCreatorInst.setVoiceOnlyMode(bool enable);
```

该方法设置仅语音模式。即仅传输语音流，而不传输其他流，例如，敲键盘的声音等。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>enable</td>
<td>
<ul>
<li>true：启用仅语音模式</li>
<li>false：禁用仅语音模式</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt; 0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>


#### 设置本地语音音效均衡 (setLocalVoiceEqualization)

```
int setLocalVoiceEqualization(bandFrequency, int bandGain);
```

该方法设置本地语音音效均衡。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>bandFrequency</td>
<td>取值范围是 [0-9]，分别代表音效的 10 个 band 的中心频率 [31，62，125，250，500，1k，2k，4k，8k，16k]Hz</td>
</tr>
<tr><td>bandGain</td>
<td>每个 band 的增益，单位是 dB，每一个值的范围是 [-15，15]</td>
</tr>
</tbody>
</table>



#### 设置本地音效混响 (setLocalVoiceReverb)

```
agoraCreatorInst.setLocalVoiceReverb(reverbKey, value);
```

该方法设置本地音效混响。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>reverbKey</td>
<td>混响音效 Key。该方法共有 5 个混响音效 Key，分别如 value 栏列出</td>
</tr>
<tr><td>value</td>
<td><p>各混响音效 Key 所对应的值：</p>
<div><ul>
<li>AUDIO_REVERB_DRY_LEVEL = 0：(dB, [-20,10])，原始声音效果，即所谓的 dry signal</li>
<li>AUDIO_REVERB_WET_LEVEL = 1：(dB, [-20,10])，早期反射信号效果，即所谓的 wet signal</li>
<li>AUDIO_REVERB_ROOM_SIZE = 2：([0，100])， 所需混响效果的房间尺寸</li>
<li>AUDIO_REVERB_WET_DELAY = 3：(ms, [0, 200])，wet signal 的初始延迟长度，以毫秒为单位</li>
<li>AUDIO_REVERB_STRENGTH = 4：([0，100])，后期混响长度</li>
</ul>
</div>
</td>
</tr>
</tbody>
</table>


#### 获取音效音量 (getEffectsVolume)

```
agoraCreatorInst.getEffectsVolume();
```

该方法获取音效的音量，范围为 \[0.0, 100.0\]。

#### 设置音量音效 (setEffectsVolume)

```
agoraCreatorInst.setEffectsVolume(volume);
```

该方法设置音效的音量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>volume</td>
<td>取值范围为 [0.0, 100.0]。 100.0 为默认值</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 实时调整音效音量 (setVolumeOfEffect)

```
agoraCreatorInst.setVolumeOfEffect(soundId, volume);
```

该方法实时调整指定音效的音量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>volume</td>
<td>取值范围为 [0.0, 100.0]。 100.0 为默认值</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 播放指定音效 (playEffect)

```
agoraCreatorInst.playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish);
```

该方法播放指定音效。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID <sup>[1]</sup></td>
</tr>
<tr><td>filepath</td>
<td>音效文件的绝对路径</td>
</tr>
<tr><td>loopCount</td>
<td><p>设置音效循环播放的次数：</p>
<div><ul>
<li>0：播放音效一次</li>
<li>1：播放音效两次</li>
<li>-1：无限循环播放音效，直至调用 <code>stopEffect</code> 或 <code>stopAllEffects</code> 后停止</li>
</ul>
</div>
</td>
</tr>
<tr><td>pitch</td>
<td>设置音效的音调
取值范围为 [0.5, 2]。默认值为 1.0，表示不需要修改音调。取值越小，则音调越低</td>
</tr>
<tr><td>pan</td>
<td><p>设置是否改变本地听到的音效的空间位置。取值范围为 [-1.0, 1.0]：</p>
<div><ul>
<li>0.0：音效出现在正前方</li>
<li>-1.0：音效出现在左边</li>
<li>1.0：音效出现在右边</li>
</ul>
</div>
</td>
</tr>
<tr><td>gain</td>
<td>设置是否改变单个音效的音量。取值范围为 [0.0, 100.0]。默认值为 100.0。取值越小，则音效的音量越低</td>
</tr>
<tr><td>publish</td>
<td><p>设置是否将音效传到远端：</p>
<div><ul>
<li>true：音效在本地播放的同时，会发布到 Agora 云上，因此远端用户也能听到该音效</li>
<li>false：音效不会发布到 Agora 云上，因此只能在本地听到该音效</li>
</ul>
</div>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：该方法调用成功</li>
<li>&lt; 0：该方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



> [1] 如果你已通过 `preloadEffect` 将音效加载至内存，确保这里设置的 `soundId` 与 `preloadEffect` 设置的 `soundId` 相同。

#### 停止播放指定音效 (stopEffect)

```
agoraCreatorInst.stopEffect(soundId);
```

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 停止播放所有音效 (stopAllEffects)

```
int stopAllEffects();
```

该方法停止播放所有音效。

#### 预加载音效 (preloadEffect)

```
int preloadEffect（soundId, char* filePath);
```

该方法将指定音效文件（压缩的语音文件）预加载至内存。


> 为保证通信畅通，请注意预加载音效文件的大小，并在 `joinChannel` 前就使用该方法完成音效预加载。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>filePath</td>
<td>音效文件的绝对路径</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 释放音效 (unloadEffect)

```
int unloadEffect（soundId);
```

该方法将指定预加载的音效从内存里释放出来。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 暂停音效播放 (pauseEffect)

```
int pauseEffect（soundId);
```

该方法暂停播放指定音效。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 暂停所有音效播放 (pauseAllEffects)

```
int pauseAllEffects();
```

该方法暂停播放所有音效。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 恢复播放指定音效 (resumeEffect)

```
int resumeEffect（soundId);
```

该方法恢复播放指定音效。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 恢复播放所有音效 (resumeAllEffects)

```
int resumeAllEffects();
```

该方法恢复播放所有音效。

### 打开与 Web SDK 的互通 (enableWebSdkInteroperability)

```
int enableWebSdkInteroperability(bool enabled);
```

该方法打开或关闭与 Agora Web SDK 的互通。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>enabled</td>
<td><p>是否已打开与 Agora Web SDK 的互通：</p>
<div><ul>
<li>true：打开互通</li>
<li>false：关闭互通</li>
</ul>
</div>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>


### 修改默认的语音路由 (setDefaultAudioRouteToSpeakerphone)

```
int setDefaultAudioRoutetoSpeakerphone(boolean defaultToSpeaker);
```

* 该方法只在纯音频模式下工作，在有视频的模式下不工作。
* 该方法需要在 joinChannel 前设置，否则不生效。

如有必要，调用该方法修改默认的语音路由。默认的语音路由如下:

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>频道模式</strong></td>
<td><strong>默认语音路由</strong></td>
</tr>
<tr><td>通信</td>
<td><ul>
<li>语音通话: 听筒</li>
<li>视频通话: 外放</li>
<li>视频通话中关闭视频 <sup>[2]</sup> : 听筒</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr><td>直播</td>
<td>外放</td>
</tr>
<tr><td>游戏语音</td>
<td>外放</td>
</tr>
</tbody>
</table>


> [2] 已调用 disableVideo 或 已调用 muteLocalVideoStream/muteAllRemoteVideoStreams

**如有需要**， 根据下表修改上述默认的语音路由:

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>defaultToSpeaker</td>
<td><ul>
<li>true: 默认路由改为外放(扬声器)</li>
<li>false: 默认路由改为听筒</li>
</ul>
<p>无论语音是从外放还是听筒出声，如果插上耳机或连接蓝牙，语音路由会发生相应改变。拔出耳机或断开蓝牙后语音路由将恢复成默认路由。</p>
</td>
</tr>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>

#### 打开扬声器 (setEnableSpeakerphone)

```
public abstract int setEnableSpeakerphone(boolean enabled);
```

该方法将语音路由强制设置为扬声器（外放）。调用该方法后，SDK 将返回 `onAudioRouteChanged` 回调提示状态已更改。


> 在调用该方法前，请先阅读 `setDefaultAudioRouteToSpeakerphone` 里关于默认语音路由的说明，确认是否需要调用该方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>enabled</td>
<td><ul>
<li><p>true:</p>
<div><ul>
<li>如果用户已在频道内，无论之前语音是路由到耳机，蓝牙，还是听筒，调用该 API 后均会默认切换到从外放(扬声器)出声。</li>
<li>如果用户尚未加入频道，调用该API后，无论用户是否有耳机或蓝牙设备，在加入频道时均会默认从外放(扬声器)出声。</li>
</ul>
</div>
</li>
<li><p>false: 语音会根据默认路由出声，详见 <code>setDefaultAudioRouteToSpeakerphone</code></p>
</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>

#### 启用内置加密，并设置数据加密密码 (setEncryptionSecret)

```
agoraCreatorInst.setEncryptionSecret(const char* secret);
```

在加入频道之前，应用程序需调用 `setEncryptionSecret()` 指定 secret 来启用内置的加密功能，同一频道内的所有用户应设置相同的 secret。 当用户离开频道时，该频道的 secret 会自动清除。如果未指定 secret 或将 secret 设置为空，则无法激活加密功能。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>secret</td>
<td>加密密码</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 设置内置的加密方案 (setEncryptionMode)

```
agoraCreatorInst.setEncryptionMode(const char* encryptionMode);
```

Agora Native SDK 支持内置加密功能，默认使用 AES-128-XTS 加密方式。如需使用其他加密方式，可以调用该 API 设置。

同一频道内的所有用户必须设置相同的加密方式和 secret 才能进行通话。关于这几种加密方式的区别，请参考 AES 加密算法的相关资料。

> 在调用本方法前，请先调用 `setEncryptionSecret()` 启用内置加密功能。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>encryptionMode</td>
<td><p>加密方式。目前支持以下几种:</p>
<ul>
<li>“aes-128-xts”: 128 位 AES 加密， XTS 模式</li>
<li>“aes-128-ecb”: 128 位 AES 加密， ECB 模式</li>
<li>“aes-256-xts”: 256 位 AES 加密，XTS 模式</li>
<li>“”: 设置为空字符串时，使用默认加密方式 “aes-128-xts”</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>


#### 创建数据流 (createDataStream)

```
agoraCreatorInst.createDataStream(int* streamId, bool reliable, bool ordered);
```

该方法用于创建数据流。频道内每人最多只能创建 5 个数据流。频道内数据通道最多允许数据延迟 5 秒，若超过 5 秒接收方尚未收到数据流，则数据通道会向应用程序报错。


> 请将 `reliable` 和 `ordered` 同时设置为 true 或 false, 暂不支持交叉设置。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td>名称</td>
<td>描述</td>
</tr>
<tr><td>reliable</td>
<td><ul>
<li>true：接收方会在 5 秒内收到发送方所发送的数据，否则会收到 onStreamMessageError 回调获得相应报错信息。</li>
<li>false：接收方不保证收到，就算数据丢失也不会报错。</li>
</ul>
</td>
</tr>
<tr><td>ordered</td>
<td><ul>
<li>true：接收方 5 秒内会按照发送方发送的顺序收到数据包。</li>
<li>false：接收方不保证按照发送方发送的顺序收到数据包。</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>&lt; 0: 创建数据流失败的错误码 <sup>[3]</sup></li>
<li>&gt; 0: 数据流 ID</li>
</ul>
</td>
</tr>
</tbody>
</table>



> [3] 返回的错误码是负数，对应错误代码和警告代码里的正整数。例如返回的错误码为 -2，则对应错误代码和警告代码里的 2: ERR_INVALID_ARGUMENT 。



#### 更新 Token (renewToken)

```
agoraCreatorInst.renewToken(const char* token);
```

该方法用于更新 Token。如果启用了 Token 机制，过一段时间后使用的 Token 会失效。

当：

-   `onError` 回调报告 ERR_TOKEN_EXPIRED(109) 时，

-   `onRequestToken` 回调报告 ERR_TOKEN_EXPIRED(109) 时，


应用程序应重新获取 Token，然后调用该 API 更新 Token，否则 SDK 无法和服务器建立连接。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>token</td>
<td>指定要更新的 Token</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用不成功</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 设置日志文件 (setLogFile)

```
agoraCreatorInst.setLogFile(filePath);
```

设置 SDK 的输出 log 文件。SDK 运行时产生的所有 log 将写入该文件。应用程序必须保证指定的目录存在而且可写。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>filePath</td>
<td>日志文件的完整路径。该日志文件为 UTF-8 编码。</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0:  方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>


> Windows 平台下日志文件的默认地址为：C:Users<user_name\>AppDataLocalAgora<process_name\>。

#### 设置日志过滤器 (setLogFilter)

```
iagoraCreatorInst.setLogFilter(filter);
```

设置 SDK 的输出日志过滤等级。不同的过滤等级可以单独或组合使用。

日志级别顺序依次为 *OFF*、*CRITICAL*、*ERROR*、*WARNING*、*INFO* 和 *DEBUG*。选择一个级别，你就可以看到在该级别之前所有级别的日志信息。

例如，你选择 *WARNING* 级别，就可以看到在 *CRITICAL*、*ERROR* 和 *WARNING* 级别上的所有日志信息。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>filter</td>
<td><p>设置过滤器等级:</p>
<div><ul>
<li>LOG_FILTER_OFF = 0：不输出日志信息</li>
<li>LOG_FILTER_DEBUG = 0x80f：输出所有 API 日志信息</li>
<li>LOG_FILTER_INFO = 0x0f：输出 CRITICAL、ERROR、WARNING 和 INFO 级别的日志信息</li>
<li>LOG_FILTER_WARNING = 0x0e：输出 CRITICAL、ERROR 和 WARNING 级别的日志信息</li>
<li>LOG_FILTER_ERROR = 0x0c：输出 CRITICAL 和 ERROR 级别的日志信息</li>
<li>LOG_FILTER_CRITICAL = 0x08：输出 CRITICAL 级别的日志信息</li>
</ul>
</div>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 销毁IRtcEngine对象 (release)

```
agoraCreatorInst.release();
```

该方法用于销毁 IRtcEngine 对象。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>sync</td>
<td><p>指明调用方式为同步或异步:</p>
<ul>
<li>True: 同步调用。在等待 IRtcEngine 对象资源释放后再返回。APP 不应该在 SDK 产生的回调中调用该接口，否则由于 SDK 要等待回调返回才能回收相关的对象资源，会造成死锁。SDK 会自动检测这种死锁并转为异步调用，但是检测本身会消耗额外的时间</li>
<li>False: 异步调用。不等 IRtcEngine 对象资源释放就立即返回。SDK 会自行释放所有资源。使用异步调用时要注意，不要在该调用后立即卸载 SDK 动态库，否则可能会因为 SDK 的清理线程还没有退出而崩溃</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 错误代码</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 查询 SDK 版本号 (getVersion)

```
agoraCreatorInst.getVersion(build);
```

该方法返回 SDK 版本号的字符串。


<a id = "rtcengineparameters"></a>

### 语音控制方法 

该辅助类用于对 SDK 进行参数设置，如下为该类的具体方法说明。


#### 将自己静音 (muteLocalAudioStream)

```
agoraCreatorInst.muteLocalAudioStream(mute);
```

静音/取消静音。该方法用于允许/禁止往网络发送本地音频流。


> 该方法不影响录音状态，并没有禁用麦克风。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>bool mute</td>
<td><ul>
<li>true：麦克风静音</li>
<li>false：取消麦克风静音</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 静音所有远端音频 (muteAllRemoteAudioStreams)

```
agoraCreatorInst.muteAllRemoteAudioStreams(mute);
```

该方法用于允许/禁止播放远端用户的音频流，即对所有远端用户进行静音与否。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>muted</td>
<td><ul>
<li>True: 停止接收和播放所有远端音频流</li>
<li>False: 允许接收和播放所有远端音频流</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 静音指定用户音频 (muteRemoteAudioStream)

```
agoraCreatorInst.muteRemoteAudioStream(uid, mute);
```

静音指定远端用户/对指定远端用户取消静音。


> 如果之前有调用过 muteAllRemoteAudioStreams (true) 对所有远端音频进行静音，在调用本 API 之前请确保你已调用 muteAllRemoteAudioStreams (false) 。 muteAllRemoteAudioStreams 是全局控制，muteRemoteAudioStream 是精细控制。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>指定用户 ID</td>
</tr>
<tr><td>muted</td>
<td><ul>
<li>True: 停止接收和播放指定音频流</li>
<li>False: 允许接收和播放指定音频流</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td>
<div><ul>
<li>0: 方法调用成功</li>
</ul>
</div>
<ul>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>


#### 启用说话者音量提示 (enableAudioVolumeIndication)

```
agoraCreatorInst.enableAudioVolumeIndication（interval, smooth);
```

该方法允许 SDK 定期向应用程序反馈当前谁在说话以及说话者的音量。启用该方法后，无论频道内是否有人说话，都会在 `onAudioVolumeIndication` 回调中按设置的间隔时间返回音量提示。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>interval</td>
<td><p>指定音量提示的时间间隔：</p>
<ul>
<li>&lt;= 0：禁用音量提示功能</li>
<li>&gt; 0：返回音量提示的间隔，单位为毫秒。建议设置到大于 200 毫秒。最小不得少于 10 毫秒，否则会收不到 <code>onAudioVolumeIndication</code> 回调</li>
</ul>
</td>
</tr>
<tr><td>smooth</td>
<td>平滑系数，指定音量提示的灵敏度。取值范围为 [0-10]，建议值为 3，数字越大，波动越灵敏；数字越小，波动越平滑。</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



### 播放伴奏

#### 开始播放伴奏 (startAudioMixing)

```
agoraCreatorInst.startAudioMixing(filePath, loopback, replace, cycle);
```

指定本地音频文件来和麦克风采集的音频流进行混音和替换(用音频文件替换麦克风采集的音频流)， 可以通过参数选择是否让对方听到本地播放的音频和指定循环播放的次数。


> 请在频道内调用该方法，如果在频道外调用该方法可能会出现问题。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>filePath</td>
<td>指定需要混音的本地音频文件名和文件路径名:
支持以下音频格式: mp3, aac, m4a, 3gp, wav, flac</td>
</tr>
<tr><td>loopback</td>
<td><ul>
<li>true: 只有本地可以听到混音或替换后的音频流</li>
<li>false: 本地和对方都可以听到混音或替换后的音频流</li>
</ul>
</td>
</tr>
<tr><td>replace</td>
<td><ul>
<li>true: 音频文件内容将会替换本地录音的音频流</li>
<li>false: 音频文件内容将会和麦克风采集的音频流进行混音</li>
</ul>
</td>
</tr>
<tr><td>cycle</td>
<td>指定音频文件循环播放的次数：
* 正整数: 循环的次数
* -1: 无限循环</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>


#### 停止播放伴奏 (stopAudioMixing)

```
agoraCreatorInst.stopAudioMixing();
```

该方法停止播放伴奏。请在频道内调用该方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 暂停播放伴奏 (pauseAudioMixing)

```
agoraCreatorInst.pauseAudioMixing();
```

该方法暂停播放伴奏。请在频道内调用该方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 恢复播放伴奏 (resumeAudioMixing)

```
agoraCreatorInst.resumeAudioMixing();
```

该方法恢复混音，继续播放伴奏。请在频道内调用该方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 调节伴奏音量 (adjustAudioMixingVolume)

```
agoraCreatorInst.adjustAudioMixingVolume（volume);
```

该方法调节混音里伴奏的音量大小。请在频道内调用该方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>volume</td>
<td>伴奏音量范围为 0~100。默认 100 为原始文件音量</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 获取伴奏时长 (getAudioMixingDuration)

```
agoraCreatorInst.getAudioMixingDuration();
```

该方法获取伴奏时长，单位为毫秒。请在频道内调用该方法。如果返回值 <0，表明调用失败。

#### 获取伴奏播放进度 (getAudioMixingCurrentPosition)

```
agoraCreatorInst.getAudioMixingCurrentPosition();
```

该方法获取当前伴奏播放进度，单位为毫秒。请在频道内调用该方法。

#### 拖动语音进度条 (setAudioMixingPosition)

```
agoraCreatorInst.setAudioMixingPosition（pos);
```

该方法可以拖动播放音频文件的进度条，这样你可以根据实际情况播放文件，而不是非得从头到尾播放一个文件。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>pos</td>
<td>整数。进度条位置，单位为毫秒</td>
</tr>
</tbody>
</table>


#### 开始客户端录音 (startAudioRecording)

```
agoraCreatorInst.startAudioRecording(filePath, quality);
```

Agora SDK 支持通话过程中在客户端进行录音。该方法录制频道内所有用户的音频，并生成一个包含所有用户声音的录音文件，录音文件格式可以为:

-   wav : 文件大，音质保真度高

-   aac : 文件小，有一定的音质保真度损失


请确保应用程序里指定的目录存在且可写。该接口需在加入频道之后调用。如果调用 `leaveChannel()` 时还在录音，录音会自动停止。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>filePath</td>
<td>录音文件的本地保存路径，由用户自行指定，需精确到文件名及格式，例如：<code>/dir1/dir2/dir3/audio.aac</code></td>
</tr>
<tr><td>quality</td>
<td><p>录音音质：</p>
<ul>
<li>AUDIO_RECORDING_QUALITY_LOW = 0: 低音质。录制 10 分钟的文件大小为 1.2 M 左右</li>
<li>AUDIO_RECORDING_QUALITY_MEDIUM = 1: 中音质。录制 10 分钟的文件大小为 2 M 左右</li>
<li>AUDIO_RECORDING_QUALITY_HIGH = 2: 高音质。录制 10 分钟的文件大小为 3.75 M 左右</li>
</ul>
</td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0：方法调用成功</li>
<li>&lt; 0：方法调用失败</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 停止客户端录音 (stopAudioRecording)

```
agoraCreatorInst.stopAudioRecording();
```

停止录音。该接口需要在 `leaveChannel()` 之前调用，不然会在调用 `leaveChannel()` 时自动停止。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 调节录音信号音量 (adjustRecordingSignalVolume)

```
agoraCreatorInst.adjustRecordingSignalVolume（volume);
```

该方法调节录音信号音量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>volume</td>
<td><p>录音信号音量可在 0~400 范围内进行调节:</p>
<ul>
<li>0: 静音</li>
<li>100: 原始音量</li>
<li>400: 最大可为原始音量的 4 倍(自带溢出保护)</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>



#### 调节播放信号音量 (adjustPlaybackSignalVolume)

```
agoraCreatorInst.adjustPlaybackSignalVolume（volume);
```

该方法调节播放信号音量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>volume</td>
<td><p>播放信号音量可在 0~400 范围内进行调节:</p>
<ul>
<li>0: 静音</li>
<li>100: 原始音量</li>
<li>400: 最大可为原始音量的 4 倍(自带溢出保护)</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr/>
<tr><td>返回值</td>
<td><ul>
<li>0: 方法调用成功</li>
<li>&lt;0: 方法调用失败</li>
</ul>
</td>
</tr>
<tr/>
</tbody>
</table>


<a id = "irtcengineeventhandler"></a>
### 主回调事件 

agora::IRtcEngineEventHandler 接口类用于 SDK 向应用程序发送回调事件通知，应用程序通过继承该接口类的方法获取 SDK 的事件通知。接口类的所有方法都有缺省（空）实现，应用程序可以根据需要只继承关心的事件。

#### 加入频道回调 (onJoinChannelSuccess)

```
agoraCreatorInst.onJoinChannelSuccess(channel, uid, elapsed);
```

该回调方法表示该客户端成功加入了指定的频道。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>channel</td>
<td>频道名. string</td>
</tr>
<tr><td>uid</td>
<td>用户 ID。如果 joinChannel 中指定了 uid，则此处返回该 ID；否则使用 Agora 服务器自动分配的 ID</td>
</tr>
<tr><td>elapsed</td>
<td>从 joinChannel 开始到该事件产生的延迟（毫秒）</td>
</tr>
</tbody>
</table>



#### 重新加入频道回调 (onRejoinChannelSuccess)

```
agoraCreatorInst.onRejoinChannelSuccess(channel, uid, elapsed);
```

有时候由于网络原因，客户端可能会和服务器失去连接，SDK会进行自动重连，自动重连成功后触发此回调方法。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>channel</td>
<td>频道名</td>
</tr>
<tr><td>uid</td>
<td>用户 ID</td>
</tr>
<tr><td>elapsed</td>
<td>从 joinChannel 开始到该事件产生的延迟（毫秒）</td>
</tr>
</tbody>
</table>



#### 发生警告回调 (onWarning)

```
agoraCreatorInst.onWarning（warn, msg);
```

该回调方法表示SDK运行时出现了（网络或媒体相关的）警告。通常情况下，SDK上报的警告信息应用程序可以忽略，SDK会自动恢复。比如和服务器失去连接时，SDK可能会上报ERR_OPEN_CHANNEL_TIMEOUT警告，同时自动尝试重连。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>warn</td>
<td>警告代码</td>
</tr>
<tr><td>msg</td>
<td>警告描述，详见：<span>错误代码和警告代码</span></td>
</tr>
</tbody>
</table>

#### 发生错误回调 (onError)

```
agoraCreatorInst.onError（err, msg);
```

该回调方法表示 SDK 运行时出现了（网络或媒体相关的）错误。通常情况下，SDK上报的错误意味着SDK无法自动恢复，需要应用程序干预或提示用户。 比如启动通话失败时，SDK 会上报 ERR_START_CALL 错误。应用程序可以提示用户启动通话失败，并调用 leaveChannel 退出频道。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>err</td>
<td>错误代码</td>
</tr>
<tr><td>msg</td>
<td>错误描述，string.详见:<span>错误代码和警告代码</span></td>
</tr>
</tbody>
</table>

#### API 已执行回调 (onApiCallExecuted)

```
agoraCreatorInst.onApiCallExecuted（err, api, result);
```

当 SDK 执行相应的 API 后，会触发该回调。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>error</td>
<td>错误码。如果方法调用失败，会返回错误码；如果返回 0，则表示方法调用成功</td>
</tr>
<tr><td>api</td>
<td>SDK 所调用的 API. string </td>
</tr>
<tr><td>result</td>
<td>SDK 调用 API 的调用结果. string </td>
</tr>
</tbody>
</table>

#### 麦克风状态已改变回调 (onMicrophoneEnabled)

```
agoraCreatorInst.onMicrophoneEnabled(enabled)
```

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>enabled</td>
<td>
	<ul>
		<li>true：麦克风已启用</li>
		<li>false：麦克风已禁用</li>
	</ul>
	</td>
</tr>
</tbody>
</table>

#### 声音质量回调 (onAudioQuality)

```
agoraCreatorInst.onAudioQuality(uid, quality,  delay, lost);
```

在通话中，该回调方法每两秒触发一次，报告当前通话的（嘴到耳）音频质量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>用户 ID</td>
</tr>
<tr><td>quality</td>
<td><p>语音质量：</p>
<ul>
<li>QUALITY_UNKNOWN(0)：网络质量未知</li>
<li>QUALITY_EXCELLENT(1)：网络质量极好</li>
<li>QUALITY_GOOD(2)：用户主观感觉和 excellent 差不多，但码率可能略低于 excellent</li>
<li>QUALITY_POOR(3)：用户主观感受有瑕疵但不影响沟通</li>
<li>QUALITY_BAD(4)：勉强能沟通但不顺畅</li>
<li>QUALITY_VBAD(5)：网络质量非常差，基本不能沟通</li>
<li>QUALITY_DOWN(6)：完全无法沟通</li>
</ul>
</td>
</tr>
<tr><td>delay</td>
<td>延迟，单位为毫秒</td>
</tr>
<tr><td>lost</td>
<td>丢包率，单位为百分比</td>
</tr>
</tbody>
</table>



#### 说话声音音量提示回调 (onAudioVolumeIndication)

```
agoraCreatorInst.onAudioVolumeIndication(speakers, speakerNumber, totalVolume);
```

该回调提示频道内谁在说话以及说话者的音量。默认禁用。可以通过 `enableAudioVolumeIndication` 方法开启；开启后，无论频道内是否有人说话，都会按方法中设置的时间间隔返回提示音量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>speakers</td>
<td><p>说话者（数组）。每个 speaker():</p>
<div><ul>
<li>uid: 说话者的用户 ID。如果返回的 uid 为 0，则默认为本地用户</li>
<li>volume: 说话者的音量（0~255）</li>
</ul>
</div>
</td>
</tr>
<tr><td>speakerNumber</td>
<td>Speakers 数组的大小</td>
</tr>
<tr><td>totalVolume</td>
<td>（混音后的）总音量（0~255）</td>
</tr>
</tbody>
</table>



在返回的 speakers 数组中：

-   如果返回的 uid 为 0，即当频道内的说话者为本地用户时，说话者的音量 `volume` 为 `totalVolume`，即频道内的总音量。

-   如果返回的 uid 不是 0，且 volume 为 0，则默认该 uid 对应的远端用户没有说话。

-   如果有 uid 出现在上次返回的数组中，但不在本次返回的数组中，则默认该 uid 对应的远端用户没有说话。


#### 离开频道回调 (onLeaveChannel)

```
agoraCreatorInst.onLeaveChannel(stat);
```

应用程序调用 leaveChannel()方法时，SDK提示应用程序离开频道成功。在该回调方法中，应用程序可以得到此次通话的总通话时长、SDK收发数据的流量等信息。

**stat 定义**

```
struct stat
{
    unsigned int duration;
    unsigned int txBytes;
    unsigned int rxBytes;
    unsigned short txKBitRate;
    unsigned short rxKBitRate;

    unsigned short rxAudioKBitRate;
    unsigned short txAudioKBitRate;
 
    unsigned short rxVideoKBitRate; // 无，纯音频时
    unsigned short txVideoKBitRate; // 无，纯音频时 
    unsigned int userCount;
    double cpuAppUsage;
    double cpuTotalUsage;
};
```

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>stat</td>
<td><p>通话相关的统计信息。</p>
<div><ul>
<li>duration: 通话时长（秒）</li>
<li>txBytes: 发送字节数（bytes）</li>
<li>rxBytes: 接收字节数（bytes）</li>
<li>txKBitRate: 发送码率（kbps）</li>
<li>rxKBitRate: 接收码率（kbps）</li>
<li>rxAudioKBitRate: 音频接收码率 (kbps)</li>
<li>txAudioKBitRate: 音频发送频率 (kbps)</li>
<li>rxVideoKBitRate: 视频接收码率 (kbps)</li>
<li>txVideoKBitRate: 视频发送码率 (kbps)</li>
<li>uerCount: 用户离开频道时频道内的瞬时人数</li>
<li>cpuAppUsage: 当前应用程序的 CPU 使用率 (%)</li>
<li>cpuTotalUsage: 当前系统的 CPU 使用率 (%)</li>
</ul>
</div>
</td>
</tr>
</tbody>
</table>



#### 其他用户加入当前频道回调 (onUserJoined)

```
agoraCreatorInst.onUserJoined(uid, elapsed);
```

该回调提示有主播加入了频道，并返回该主播的 ID。如果在加入之前，已经有主播在频道中了，新加入的用户也会收到已有主播加入频道的回调。Agora 建议连麦主播不超过 17 人。

> 直播场景下:
> -   主播间能相互收到新主播加入频道的回调，并能获得该主播的 uid
> -   观众也能收到新主播加入频道的回调，并能获得该主播的 uid
> -   当 Web 端加入直播频道时，只要 Web 端有推流，SDK 会默认该 Web 端为主播，并触发该回调


<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>主播 ID</td>
</tr>
<tr><td>elapsed</td>
<td>joinChannel 开始到该回调触发的延迟（毫秒)</td>
</tr>
</tbody>
</table>



#### 其他用户离开当前频道回调 (onUserOffline)

```
agoraCreatorInst.onUserOffline(uid, reason);
```

提示有主播离开了频道（或掉线）。SDK 判断用户离开频道（或掉线）的依据是超时：在一定时间内（15秒）没有收到对方的任何数据包，判定为对方掉线。 在网络较差的情况下，可能会有误报。建议可靠的掉线检测应该由信令来做。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>主播 ID</td>
</tr>
<tr><td>reason</td>
<td><p>离线原因:</p>
<ul>
<li>USER_OFFLINE_QUIT(0): 用户主动离开</li>
<li>USER_OFFLINE_DROPPED(1): 因过长时间收不到对方数据包，超时掉线。注意：由于 SDK 使用的是不可靠通道，也有可能对方主动离开本方没收到对方离开消息而误判为超时掉线</li>
<li>USER_OFFLINE_BECOME_AUDIENCE(2): 用户身份从主播切换为观众时触发</li>
</ul>
</td>
</tr>
<tr/>
<tr/>
<tr/>
</tbody>
</table>



#### 当前通话统计回调 (onRtcStats)

```
agoraCreatorInst.onRtcStats(stats);
```

SDK定期向应用程序报告当前通话的统计信息，每两秒触发一次。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>stat</td>
<td>详见 <a href="#onleavechannel-live-windows"><span>离开频道回调 (onLeaveChannel)</span></a> 中的描述</td>
</tr>
</tbody>
</table>



#### 收到远端音频回调 (onFirstRemoteAudioFrame)

```
agoraCreatorInst.onFirstRemoteAudioFrame(uid, elapsed)
```

当接收到远端音频第一帧时，触发此回调。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>用户 UID，表示收到的是哪个用户的音频流</td>
</tr>
<tr><td>elapsed</td>
<td>加入频道开始到该回调触发的延迟（毫秒）</td>
</tr>
</tbody>
</table>


#### 网络质量报告回调 (onLastmileQuality)

```
agoraCreatorInst.onLastmileQuality（quality);
```

报告本地用户的网络质量。当你调用 enableLastmileTest 之后，该回调函数每 2 秒触发一次。 不在通话中时，如果启用了网络质量测试功能（enableLastmileTest），该回调方法会被不定期触发，向应用程序上报当前网络连接质量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>quality</td>
<td><p>网络质量：</p>
<div><ul>
<li>QUALITY_UNKNOWN(0)：网络质量未知</li>
<li>QUALITY_EXCELLENT(1)：网络质量极好</li>
<li>QUALITY_GOOD(2)：用户主观感觉和 excellent 差不多，但码率可能略低于 excellent</li>
<li>QUALITY_POOR(3)：用户主观感受有瑕疵但不影响沟通</li>
<li>QUALITY_BAD(4)：勉强能沟通但不顺畅</li>
<li>QUALITY_VBAD(5)：网络质量非常差，基本不能沟通</li>
<li>QUALITY_DOWN(6)：完全无法沟通</li>
</ul>
</div>
</td>
</tr>
</tbody>
</table>



#### 频道内网络质量报告回调 (onNetworkQuality)

```
agoraCreatorInst.onNetworkQuality(uid, txQuality, rxQuality);
```

该回调每 2 秒触发，向APP报告频道内所有用户当前的上行、下行网络质量。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>用户 ID。表示该回调报告的是持有该 ID 的用户的网络质量。当 uid 为 0 时，返回的是本地用户的网络质量</td>
</tr>
<tr><td>txQuality</td>
<td><p>该用户的上行网络质量：</p>
<ul>
<li>QUALITY_UNKNOWN(0)：网络质量未知</li>
<li>QUALITY_EXCELLENT(1)：网络质量极好</li>
<li>QUALITY_GOOD(2)：用户主观感觉和 excellent 差不多，但码率可能略低于 excellent</li>
<li>QUALITY_POOR(3)：用户主观感受有瑕疵但不影响沟通</li>
<li>QUALITY_BAD(4)：勉强能沟通但不顺畅</li>
<li>QUALITY_VBAD(5)：网络质量非常差，基本不能沟通</li>
<li>QUALITY_DOWN(6)：完全无法沟通</li>
</ul>
</td>
</tr>
<tr><td>rxQuality</td>
<td><p>该用户的下行网络质量：</p>
<ul>
<li>QUALITY_UNKNOWN(0)：网络质量未知</li>
<li>QUALITY_EXCELLENT(1)：网络质量极好</li>
<li>QUALITY_GOOD(2)：用户主观感觉和 excellent 差不多，但码率可能略低于 excellent</li>
<li>QUALITY_POOR(3)：用户主观感受有瑕疵但不影响沟通</li>
<li>QUALITY_BAD(4)：勉强能沟通但不顺畅</li>
<li>QUALITY_VBAD(5)：网络质量非常差，基本不能沟通</li>
<li>QUALITY_DOWN(6)：完全无法沟通</li>
</ul>
</td>
</tr>
</tbody>
</table>



#### 用户静音回调 (onUserMuteAudio)

```
agoraCreatorInst.onUserMuteAudio(uid, muted);
```

提示有其他用户已将其音频流静音（或取消静音）。


> 现阶段，当频道内主播数超过 20 人，该回调会失效。后续会改进。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>用户 ID</td>
</tr>
<tr><td>muted</td>
<td><ul>
<li>True: 该用户已将音频静音</li>
<li>False: 该用户取消了音频静音</li>
</ul>
</td>
</tr>
</tbody>
</table>


#### 网络中断回调 (onConnectionInterrupted)

```
agoraCreatorInst.onConnectionInterrupted();
```

该回调方法表示 SDK 和服务器失去了网络连接。

与 onConnectionLost 回调的区别是: onConnectionInterrupted 回调在 SDK 刚失去和服务器连接时触发，onConnectionLost 在失去连接且尝试自动重连失败后才触发。 失去连接后，除非 APP 主动调用 leaveChannel() ，不然 SDK 会一直自动重连。

#### 连接丢失回调 (onConnectionLost)

```
agoraCreatorInst.onConnectionLost();
```

在 SDK 和服务器失去了网络连接后，会触发 onConnectionInterrupted 回调，并自动重连。如果重连一段时间（默认 10 秒）后仍未连上，会触发该回调。 如果 SDK 在调用 joinChannel 后 10 秒内没有成功加入频道，也会触发该回调。 该回调触发后，SDK 仍然会尝试重连，重连成功后会触发 onRejoinChannelSuccess 回调。

#### 连接已被禁止回调 (onConnectionBanned)

```
agoraCreatorInst.onConnectionBanned();
```

当你被服务端禁掉连接的权限时，会触发该回调。


#### Token 过期回调 (onRequestToken)

```
agoraCreatorInst.onRequestToken();
```

在调用 joinChannel 时如果指定了 Token，由于 Token 具有一定的时效，在通话过程中 SDK 可能由于网络原因和服务器失去连接，重连时可能需要新的 Token。 该回调通知 APP 需要生成新的 token，并需调用 renewToken() 为 SDK 指定新的 Token 。

之前的处理方法是在 onError() 回调报告 ERR_TOKEN_EXPIRED(109)、ERR_INVALID_TOKEN(110) 时，APP 需要生成新的 Token。 在新版本中，原来的处理仍然有效，但建议把相关逻辑放进该回调里。

#### 伴奏播放已结束回调 (onAudioMixingFinished)

```
agoraCreatorInst.onAudioMixingFinished()
```

当调用 startAudioMixing 播放伴奏音乐结束后，会触发该回调。如果调用 startAudioMixing 失败，会在 onError 回调里，返回错误码 WARN_AUDIO_MIXING_OPEN_ERROR 。

#### 音效播放已结束回调 (onAudioEffectFinished)

```
agoraCreatorInst.onAudioEffectFinished（soundId)
```

当指定的音效播放结束后，会触发该回调。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td>名称</td>
<td>描述</td>
</tr>
<tr><td>soundId</td>
<td>指定音效的 ID。每个音效均有唯一的 ID</td>
</tr>
</tbody>
</table>



#### 监测到活跃用户回调 (onActiveSpeaker)

```
agoraCreatorInst.onActiveSpeaker(uid);
```

如果用户开启了 `enableAudioVolumeIndication` 功能，则当音量检测模块监测到频道内有新的活跃用户说话时，会通过本回调返回该用户的 uid。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>uid</td>
<td>当前时间段声音最大的用户的 uid。如果返回的 uid 为 0，则默认为本地用户</td>
</tr>
</tbody>
</table>


> -   你需要开启 `enableAudioVolumeIndication` 方法才能收到该回调。
> -   uid 返回的是当前时间段内声音最大的用户 uid，而不是瞬时声音最大的用户 uid。


#### 上下麦回调 (onClientRoleChanged)

```
agoraCreatorInst.onClientRoleChanged(oldRole, newRole);
```

直播场景下，当用户上下麦时会触发此回调，即主播切换为观众时，或观众切换为主播时。1:主播,2:观众。

<table>
<colgroup>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>名称</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>oldRole</td>
<td>切换前的角色</td>
</tr>
<tr><td>newRole</td>
<td>切换后的角色</td>
</tr>
</tbody>
</table>




<a id = "irtcerror"></a>
### 错误代码和警告代码 - Agora Native SDK

Agora SDK 在调用 API 或运行时，可能会返回错误或警告代码:

-   **错误代码** 意味着 SDK 遭遇不可恢复的错误，需要应用程序干预，例如打开摄像头失败会返回错误，应用程序需要提示用户不能使用摄像头。

-   **警告代码** 意味着 SDK 遇到问题，但有可能恢复，警告代码仅起告知作用，一般情况下应用程序可以忽略警告代码。


#### 错误代码

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>错误代码</strong></td>
<td><strong>值</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>ERR_OK</td>
<td>0</td>
<td>没有错误。</td>
</tr>
<tr><td>ERR_FAILED</td>
<td>1</td>
<td>一般性的错误(没有明确归类的错误原因)。</td>
</tr>
<tr><td>ERR_INVALID_ARGUMENT</td>
<td>2</td>
<td>API 调用了无效的参数。例如指定的频道名含有非法字符。</td>
</tr>
<tr><td>ERR_NOT_READY</td>
<td>3</td>
<td>SDK 的模块没有准备好，例如某个 API 调用依赖于某个模块，但该模块尚未准备提供服务。</td>
</tr>
<tr><td>ERR_NOT_SUPPORTED</td>
<td>4</td>
<td>SDK 不支持该功能。</td>
</tr>
<tr><td>ERR_REFUSED</td>
<td>5</td>
<td>调用被拒绝。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_BUFFER_TOO_SMALL</td>
<td>6</td>
<td>传入的缓冲区大小不足以存放返回的数据。</td>
</tr>
<tr><td>ERR_NOT_INITIALIZED</td>
<td>7</td>
<td>SDK 尚未初始化，就调用其 API。</td>
</tr>
<tr><td>ERR_NO_PERMISSION</td>
<td>9</td>
<td>没有操作权限。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_TIMEDOUT</td>
<td>10</td>
<td>API 调用超时。有些 API 调用需要 SDK 返回结果，如果 SDK 处理时间过长，会出现此错误。</td>
</tr>
<tr><td>ERR_CANCELED</td>
<td>11</td>
<td>请求被取消。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_TOO_OFTEN</td>
<td>12</td>
<td>调用频率太高。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_BIND_SOCKET</td>
<td>13</td>
<td>SDK 内部绑定到网络 socket 失败。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_NET_DOWN</td>
<td>14</td>
<td>网络不可用。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_NET_NOBUFS</td>
<td>15</td>
<td>没有网络缓冲区可用。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_JOIN_CHANNEL_REJECTED</td>
<td>17</td>
<td>加入频道被拒绝。一般是因为用户已进入频道，再次调用加入频道的 API，例如 joinChannel，会返回此错误。</td>
</tr>
<tr><td>ERR_LEAVE_CHANNEL_REJECTED</td>
<td>18</td>
<td>离开频道失败。一般是因为用户已离开某频道，再次调用退出频道的API，例如 leaveChannel，会返回此错误。</td>
</tr>
<tr><td>ERR_ALREADY_IN_USE</td>
<td>19</td>
<td>资源已被占用，不能重复使用。</td>
</tr>
<tr><td>ERR_ABORTED</td>
<td>20</td>
<td>SDK 放弃请求，可能由于请求次数太多。仅供 SDK 内部使用，不通过 API 或者回调事件返回给应用程序。</td>
</tr>
<tr><td>ERR_INIT_NET_ENGINE</td>
<td>21</td>
<td>Windows 下特定的防火墙设置导致 SDK 初始化失败然后崩溃。</td>
</tr>
<tr><td>ERR_INVALID_VENDOR_KEY</td>
<td>101</td>
<td>指定的 App ID 无效。</td>
</tr>
<tr><td>ERR_INVALID_CHANNEL_NAME</td>
<td>102</td>
<td>指定的频道名无效。</td>
</tr>
<tr><td>ERR_NOT_IN_CHANNEL</td>
<td>113</td>
<td>用户不在频道内。</td>
</tr>
<tr><td>ERR_SIZE_TOO_LARGE</td>
<td>114</td>
<td>数据太大</td>
</tr>
<tr><td>ERR_BITRATE_LIMIT</td>
<td>115</td>
<td>码率受限</td>
</tr>
<tr><td>ERR_LOAD_MEDIA_ENGINE</td>
<td>1001</td>
<td>加载媒体引擎失败。</td>
</tr>
<tr><td>ERR_START_CALL</td>
<td>1002</td>
<td>启动媒体引擎开始通话失败。</td>
</tr>
<tr><td>ERR_ADM_GENERAL_ERROR</td>
<td>1005</td>
<td>音频设备模块出现一般性错误（没有明显归类的错误）。</td>
</tr>
<tr><td>ERR_ADM_JAVA_RESOURCE</td>
<td>1006</td>
<td>语音模块: 使用 java 资源出现错误。</td>
</tr>
<tr><td>ERR_ADM_SAMPLE_RATE</td>
<td>1007</td>
<td>语音模块: 设置的采样频率出现错误。</td>
</tr>
<tr><td>ERR_ADM_INIT_PLAYOUT</td>
<td>1008</td>
<td>语音模块: 初始化播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_START_PLAYOUT</td>
<td>1009</td>
<td>语音模块: 启动播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_STOP_PLAYOUT</td>
<td>1010</td>
<td>语音模块: 停止播放设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_INIT_RECORDING</td>
<td>1011</td>
<td>语音模块: 初始化录音设备时出现错误。</td>
</tr>
<tr><td>ERR_ADM_START_RECORDING</td>
<td>1012</td>
<td>语音模块: 启动录音设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_STOP_RECORDING</td>
<td>1013</td>
<td>语音模块: 停止录音设备出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_PLAYOUT_ERROR</td>
<td>1015</td>
<td>语音模块: 运行时播放出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_RECORDING_ERROR</td>
<td>1017</td>
<td>语音模块: 运行时录音错误。</td>
</tr>
<tr><td>ERR_ADM_RECORD_AUDIO_FAILED</td>
<td>1018</td>
<td>语音模块: 录制失败</td>
</tr>
<tr><td>ERR_ADM_INIT_LOOPBACK</td>
<td>1022</td>
<td>语音模块: 初始化 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_START_LOOPBACK</td>
<td>1023</td>
<td>语音模块: 启动 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_NO_PERMISSION</td>
<td>1027</td>
<td>语音模块: 没有使用 ADM 的权限</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_PLAYOUT_ERROR</td>
<td>1015</td>
<td>语音模块: 运行时播放出现错误。</td>
</tr>
<tr><td>ERR_ADM_RUNTIME_RECORDING_ERROR</td>
<td>1017</td>
<td>语音模块: 运行时录音错误。</td>
</tr>
<tr><td>ERR_ADM_RECORD_AUDIO_FAILED</td>
<td>1018</td>
<td>语音模块: 录制失败</td>
</tr>
<tr><td>ERR_ADM_INIT_LOOPBACK</td>
<td>1022</td>
<td>语音模块: 初始化 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_START_LOOPBACK</td>
<td>1023</td>
<td>语音模块: 启动 loopback 设备错误。</td>
</tr>
<tr><td>ERR_ADM_NO_PERMISSION</td>
<td>1027</td>
<td>语音模块: 没有使用 ADM 的权限</td>
</tr>
</tbody>
</table>



#### 警告代码

<table>
<colgroup>
<col/>
<col/>
<col/>
</colgroup>
<tbody>
<tr><td><strong>警告代码</strong></td>
<td><strong>值</strong></td>
<td><strong>描述</strong></td>
</tr>
<tr><td>WARN_PENDING</td>
<td>20</td>
<td>请求处于待定状态。一般是由于某个模块还没准备好，请求被延迟处理。</td>
</tr>
<tr><td>WARN_NO_AVAILABLE_CHANNEL</td>
<td>103</td>
<td>没有可用的频道资源。可能是因为服务端没法分配频道资源。</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_TIMEOUT</td>
<td>104</td>
<td>查找频道超时。在加入频道时SDK先要查找指定的频道，出现该警告一般是因为网络太差，连接不到服务器。</td>
</tr>
<tr><td>WARN_LOOKUP_CHANNEL_REJECTED</td>
<td>105</td>
<td>查找频道请求被服务器拒绝。服务器可能没有办法处理这个请求或请求是非法的。</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_TIMEOUT</td>
<td>106</td>
<td>打开频道超时。查找到指定频道后，SDK 接着打开该频道，超时一般是因为网络太差，连接不到服务器。</td>
</tr>
<tr><td>WARN_OPEN_CHANNEL_REJECTED</td>
<td>107</td>
<td>打开频道请求被服务器拒绝。服务器可能没有办法处理该请求或该请求是非法的。</td>
</tr>
<tr><td>WARN_SET_CLIENT_ROLE_TIMEOUT</td>
<td>118</td>
<td>设置用户角色超时。服务器可能没有办法处理该请求或该请求是非法的。</td>
</tr>
<tr><td>WARN_SET_CLIENT_ROLE_NOT_AUTHORIZED</td>
<td>119</td>
<td>用户没有权限进行该操作</td>
</tr>
<tr><td>WARN_AUDIO_MIXING_OPEN_ERROR</td>
<td>701</td>
<td>调用 startAudioMixing() 时传入了不正确或不完整的文件</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_PLAYOUT_WARNING</td>
<td>1014</td>
<td>音频设备模块: 运行时播放设备出现警告。</td>
</tr>
<tr><td>WARN_ADM_RUNTIME_RECORDING_WARNING</td>
<td>1016</td>
<td>音频设备模块: 运行时录音设备出现警告。</td>
</tr>
<tr><td>WARN_ADM_RECORD_AUDIO_SILENCE</td>
<td>1019</td>
<td>音频设备模块: 没有采集到有效的声音数据。</td>
</tr>
<tr><td>WARN_ADM_PLAYOUT_MALFUNCTION</td>
<td>1020</td>
<td>音频设备模块: 播放设备出现故障。</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1021</td>
<td>音频设备模块: 录制设备出现故障。</td>
</tr>
<tr><td>WARN_ADM_RECORD_MALFUNCTION</td>
<td>1031</td>
<td>音频设备模块: 录制声音过小</td>
</tr>
<tr><td>WARN_ADM_HOWLING</td>
<td>1051</td>
<td>音频设备模块: 检测到啸叫。</td>
</tr>
</tbody>
</table>





