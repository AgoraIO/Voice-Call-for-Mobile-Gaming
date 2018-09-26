# Spacewar with AMG Voice SDK SpriteKit

*Read this in other languages: [English](README.md)*

这个开源示例项目演示了如何在 iOS 中集成 Agora 游戏 SDK，实现在游戏中的音频通话。

在这个示例项目中包含了以下功能：

- 加入通话和离开通话；
- 选择语音模式：自由模式、指挥模式、听众模式；
- 静音和取消静音；
- 音乐混音和播放音效；
- 语音变声效果；
- 音效和语音的方位感；
- 设置语音、混音和音效的音量；

你也可以在这里查看入门版的示例项目：[Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)

Agora 游戏 SDK 支持 iOS / Android / Unity / Cocos2d 等多个平台，你可以查看对应各平台的示例项目：

- [Spacewar-with-AMG-Voice-SDK-Unity](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-Unity)
- [Spacewar-with-AMG-Voice-SDK-Cocos2d](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-Cocos2d)

## 运行示例程序
首先在 [Agora.io 注册](https://dashboard.agora.io/cn/signup/) 注册账号，并创建自己的测试项目，获取到 AppID。将 AppID 填写进 AMGVoice/KeyCenter.swift.

```
static let appId: String = <#Your App id#>
```

然后在 [Agora.io SDK](https://www.agora.io/cn/download/) 下载 **AMG 游戏语音 SDK**，解压后讲其中的 **libs/AgoraAudioKit.framework** 下的内容，复制到本项目的 ”AMGVoice” 文件夹下

最后使用 XCode 打开 AMGVoice.xcodeproj，连接 iPhone／iPad 测试设备，设置有效的开发者签名后即可运行。

## 运行环境
- XCode 8.0 +
- iOS 真机设备
- 不支持模拟器

## 联系我们

- 完整的 API 文档见 [文档中心](https://docs.agora.io/cn/)
- 如果在集成中遇到问题, 你可以到 [开发者社区](https://dev.agora.io/cn/) 提问
- 如果有售前咨询问题, 可以拨打 400 632 6626，或加入官方Q群 12742516 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单
- 如果发现了示例代码的bug, 欢迎提交 [issue](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-SpriteKit/issues)

## 代码许可

The MIT License (MIT).
