# Spacewar with Agora Gaming SDK Android

*Read this in other languages: [English](README.md)*

这个开源示例项目演示了如何快速集成 Agora 游戏 SDK 到 Android，实现在游戏中音频通话。

在这个示例项目中包含了以下功能：

- 加入通话和离开通话；
- 选择语音模式：自由模式、指挥模式、听众模式；
- 静音和取消静音；
- 音乐混音和播放音效；
- 语音变声效果；(未完成)
- 音效和语音的方位感；（未完成）
- 设置语音、混音和音效的音量；

你也可以在这里查看入门版的示例项目：[Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/tree/master/Basic-Voice-Call-for-Gaming/Hello-Gaming-Agora-Android)

## 运行示例程序
首先在 [Agora.io 注册](https://dashboard.agora.io/cn/signup/) 注册账号，并创建自己的测试项目，获取到 AppID。将 AppID 填写进 "app/src/main/res/values/strings_config.xml"

```
<string name="private_app_id"><#YOUR APP ID#></string>
```

然后在 [Agora.io SDK](https://www.agora.io/cn/download/) 下载 **AMG 游戏语音SDK**，解压后将其中的 **libs** 文件夹下的 ***.jar** 复制到本项目的 **app/libs** 下，其中的 **libs** 文件夹下的 **arm64-v8a**/**x86**/**armeabi-v7a** 复制到本项目的 **app/src/main/jniLibs** 下。

最后用 Android Studio 打开该项目，连上设备，编译并运行。

也可以使用 `Gradle` 直接编译运行。

## 运行环境
- Android Studio 2.0 +
- 真实 Android 设备 (Nexus 5X 或者其它设备)
- 部分模拟器会存在功能缺失或者性能问题，所以推荐使用真机

## 联系我们

- 完整的 API 文档见 [文档中心](https://docs.agora.io/cn/)
- 如果在集成中遇到问题, 你可以到 [开发者社区](https://dev.agora.io/cn/) 提问
- 如果有售前咨询问题, 可以拨打 400 632 6626，或加入官方Q群 12742516 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单
- 如果发现了示例代码的bug, 欢迎提交 [issue](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/issues)

## 代码许可

The MIT License (MIT).
