# Hello Gaming Agora Cocos2d

*Read this in other languages: [English](README.md)*

这个开源示例项目演示了如何快速集成 Agora 游戏 SDK 到 Cocos2d，实现在游戏中音频通话。

在这个示例项目中包含了以下功能：

- 加入通话和离开通话；

Agora 游戏 SDK 支持 iOS / Android / Unity / Cocos2d 等多个平台，你可以查看对应各平台的示例项目：

- [Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Hello-Gaming-Agora-Android)
- [Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)
- [Hello-Unity3D-Agora](https://github.com/AgoraIO/Hello-Unity3D-Agora)

## 运行示例程序
首先在 [Agora.io 注册](https://dashboard.agora.io/cn/signup/) 注册账号，并创建自己的测试项目，获取到 AppID。将 AppID 填写进 "Classes/SceneMgr.h"

```
#define AGORA_APP_ID <#YOUR APP ID#>
```


然后在 [Agora.io SDK](https://www.agora.io/cn/download/) 下载 **Agora 游戏语音 SDK for Cocos2d**，解压后将其中的 **include** 和 **libs** 文件夹复制到本项目的 **AgoraGamingSDK** 下。

- 本示例项目依赖于开源的 [Cocos2d-x](http://www.cocos2d-x.org/) 项目，下载 http://www.cocos2d-x.org/filedown/cocos2d-x-3.14.1.zip 并用相应内容来替换本项目下的 **cocos2d** 文件夹
- Agora 游戏 SDK 本身并不依赖于特定的 Cocos2d 的版本，所以不比担心自己用的是不同版本的 Cocos2d

- **运行 Android 项目**

利用命令行工具跳转到 `proj.android-studio/app` 并执行 `ndk-build`。

最后用 Android Studio 打开该项目，连上设备，编译并运行。

也可以使用 `Gradle` 直接编译运行。

- **运行 iOS 项目**

使用 Xcode 打开项目直接编译运行。

## 运行环境
- Android Studio 2.0+ 或 Xcode 8.0+
- 真实 Android / iOS 设备(Nexus 5X 或者其它设备)
- 部分模拟器会存在功能缺失或者性能问题，所以推荐使用真机

## 联系我们

- 完整的 API 文档见 [文档中心](https://docs.agora.io/cn/)
- 如果在集成中遇到问题, 你可以到 [开发者社区](https://dev.agora.io/cn/) 提问
- 如果有售前咨询问题, 可以拨打 400 632 6626，或加入官方Q群 12742516 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单
- 如果发现了示例代码的bug, 欢迎提交 [issue](https://github.com/AgoraIO/Hello-Cocos2d-Agora/issues)

## 代码许可

The MIT License (MIT).

