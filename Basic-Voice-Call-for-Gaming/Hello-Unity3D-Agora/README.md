# Hello Unity3D Agora

*其他语言版本： [简体中文](README.md)*

The Hello Unity3D Agora Sample App is an open-source demo that will help you get voice chat integrated directly into your Unity3D game applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel

A full-fledged demo can be found here: [Spacewar-with-AMG-Voice-SDK-Unity](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-Unity)

Agora Gaming SDK supports iOS / Android / Unity3D / Cocos2d etc. You can find demos of these platform here:

- [Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)
- [Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Hello-Gaming-Agora-Android)
- [Hello-Cocos2d-Agora](https://github.com/AgoraIO/Hello-Cocos2d-Agora)

## Running the App
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID. Update "HelloUnity3D.cs" with your App ID.

```
private static string appId = "YOUR APP ID";
```

Next, download the **Agora Gaming SDK** from [Agora.io SDK](https://www.agora.io/en/blog/download/). Unzip the downloaded SDK package and

- copy files from **libs/Android/** in SDK to **Assets/Plugins/Android/AgoraAudioKit.plugin/libs/** in project
- copy files from **libs/iOS/** in SDK to **Assets/Plugins/iOS/** in project
- copy files from **libs/Scripts/AgoraGamingSDK/** in SDK to **Assets/Scripts/AgoraGamingSDK/** in project

Finally, Open project with Unity and run.

## Developer Environment Requirements
* Unity 5.5 +

## Connect Us

- You can find full API document at [Document Center](https://docs.agora.io/en/)
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Hello-Unity3D-Agora/issues)

## License

The MIT License (MIT).
