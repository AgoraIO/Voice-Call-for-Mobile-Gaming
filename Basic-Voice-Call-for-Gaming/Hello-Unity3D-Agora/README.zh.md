# Hello Unity3D Agora

*Read this in other languages: [English](README.md)*

这个开源示例项目演示了如何在 Unity3D 中快速集成Agora游戏SDK，实现在游戏中的音频通话。

在这个示例项目中包含了以下功能：

- 加入频道和离开频道
- 通话
- 静音

你也可以在这里查看进阶版的示例项目：[Spacewar-with-AMG-Voice-SDK-Unity](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-Unity)

Agora游戏SDK支持 iOS / Android / Unity3D / Cocos2d 等多个平台，你可以查看对应各平台的示例项目：

- [Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)
- [Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Hello-Gaming-Agora-Android)
- [Hello-Cocos2d-Agora](https://github.com/AgoraIO/Hello-Cocos2d-Agora)

## 运行示例程序
首先在 [Agora.io 注册](https://dashboard.agora.io/cn/signup/) 注册账号，并创建自己的测试项目，获取到 AppID。
接着， 克隆此仓库。 请注意，在下载SDK软件包之前，您将看到Unity编译器错误。
然后下载SDK软件包。 这样做有两种选择。

选择1： 在Unity Asset Store搜寻 Agora Voice 及下载， [这个是地址](https://assetstore.unity.com/packages/tools/audio/agora-voice-sdk-for-unity-134505).

选择2:   在 [Agora.io SDK](https://docs.agora.io/cn/All/downloads?platform=Unity) 下载 **音频 SDK**，解压后

- 把SDK中 **libs/Android/** 下的内容，复制到项目的 **Assets/AgoraEngine/Plugins/Android/AgoraAudioKit.plugin/libs/** 文件夹下
- 把SDK中 **libs/iOS/** 下的内容，复制到项目的 **Assets/AgoraEngine/Plugins/iOS/** 文件夹下
- 把SDK中 **libs/Scripts/AgoraGamingSDK/** 下的内容，复制到项目的 **Assets/AgoraEngine/Scripts/AgoraGamingSDK/** 文件夹下

最后使用 Unity 打开本项目, 打开Demo里的HelloUnity3D 场景。把 AppID 填写进 GameController 的 App ID 项目里 即可运行！

## 运行环境
* Unity 2017 LTS

## 联系我们

- 完整的 API 文档见 [文档中心](https://docs.agora.io/cn/)
- 如果在集成中遇到问题, 你可以到 [开发者社区](https://dev.agora.io/cn/) 提问
- 如果有售前咨询问题, 可以拨打 400 632 6626，或加入官方Q群 12742516 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单
- 如果发现了示例代码的bug, 欢迎提交 [issue](https://github.com/AgoraIO/Hello-Unity3D-Agora/issues)

## 代码许可

The MIT License (MIT).
