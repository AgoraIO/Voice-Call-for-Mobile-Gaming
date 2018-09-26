# Hello Gaming Agora iOS

*其他语言版本： [简体中文](README.zh.md)*

The Hello Gaming Agora iOS Sample App is an open-source demo that will help you get voice chat integrated directly into your iOS game applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel
- Mute / unmute audio
- Switch speaker

A full-fledged demo can be found here: [Spacewar-with-AMG-Voice-SDK-SpriteKit](https://github.com/AgoraIO/Spacewar-with-AMG-Voice-SDK-SpriteKit)

Agora Video SDK supports iOS / Android / Windows / macOS etc. You can find demos of these platform here:

- [Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Hello-Gaming-Agora-Android)
- [Hello-Unity3D-Agora](https://github.com/AgoraIO/Hello-Unity3D-Agora)
- [Hello-Cocos2d-Agora](https://github.com/AgoraIO/Hello-Cocos2d-Agora)

## Running the App
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID. Update "KeyCenter.swift" with your App ID.

```
static let AppId: String = "Your App ID"
```

Next, download the **Agora Gaming SDK** from [Agora.io SDK](https://www.agora.io/en/blog/download/). Unzip the downloaded SDK package and copy **libs/AgoraAudioKit.framework** to the “HelloGaming” folder in project.

Finally, Open HelloGaming.xcodeproj, connect your iPhone／iPad device, setup your development signing and run.

## Developer Environment Requirements
* XCode 8.0 +
* Real devices (iPhone or iPad)
* iOS simulator is NOT supported

## Connect Us

- You can find full API document at [Document Center](https://docs.agora.io/en/)
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS/issues)

## License

The MIT License (MIT).
