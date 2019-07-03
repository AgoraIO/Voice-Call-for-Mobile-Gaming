# Hello Agora CocosCreator Voice

*Read this in other languages: [English](README.md)*

这个开源示例项目演示了，如何使用CocosCreator Agora Voice SDK，在CocosCreator游戏中实现音频通话。

CocosCreator Agora Voice SDK 目前支持的平台： Android,iOS,Web.

在这个示例项目中包含了以下功能：

- 加入通话和离开通话；

- 静音和取消静音

- 调节音量

- 开启和释放SDK录音

## 运行环境
* CocosCreator 2.0.9 +

## 运行示例程序

步骤1，[下载](https://www.cocos.com/download)、安装CocosCreator2.0.9或发布时间更新的版本。注册CococsCreator账号，并完成账号认证（cocos系统认证需要 1-3天)。

步骤2，[新建一个CocosCreator游戏](https://account.cocos.com/#/game/create_game)。

步骤3，CococsCreator打开Demo工程。 点击CococsCreator状态栏的"面板"，选择下拉列表的"服务"后，选择"Agora Voice", 然后，关联"步骤2"中创建游戏。 

步骤4，点击，打开CococsCreator 右侧Agora Voice服务里的复选按钮。按照提示，一步步打开Agora Voice Service。 

步骤5，在CococsCreator右侧Agora Voice服务，点击"前往控制台"，进入声网控制台，在项目管理里可以获取声网的AppID。  

步骤6，在HelloWorld.js中，填入声网的AppID。

```
agoraAppID:"YOUR_AGORA_APPID",
```

最后，使用CococsCreator分别构建、编译、运行Android,iOS, Web工程。
Android，iOS工程的运行，需要到项目目录下jsb-default/frameworks/runtime-src或jsb-link/frameworks/runtime-src下打开对应平台的工程，真机运行。

## 资源
- [cocos creator Agora Voice SDK API](https://docs.agora.io/cn/Interactive%20Gaming/game_coco)
- [Cocos Creator Agora Voice集成快速开始](https://docs.agora.io/cn/Interactive%20Gaming/game_c?platform=Cocos%20Creator)


## 联系我们

- 完整的 API 文档见 [文档中心](https://docs.agora.io/cn/)
- 如果在集成中遇到问题, 你可以到 [开发者社区](https://dev.agora.io/cn/) 提问
- 如果有售前咨询问题, 可以拨打 400 632 6626，或加入官方Q群 12742516 提问
- 如果需要售后技术支持, 你可以在 [Agora Dashboard](https://dashboard.agora.io) 提交工单
- 如果发现了示例代码的bug, 欢迎提交 [issue](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming.git)

## 代码许可

The MIT License (MIT).
