# Spacewar with AMG Voice SDK SpriteKit

*其他语言版本： [简体中文](README.zh.md)*

The Spacewar with AMG Voice SDK SpriteKit Sample App is an open-source demo that will help you get voice chat integrated directly into your iOS game applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel
- Select voice mode: free mode, command mode, audience mode
- Mute / unmute audio
- Music mixing and audio effect playing
- Voice morphing
- Set posotion of voice and audio effect
- Set volume of voice and audio effect

A tutorial demo can be found here: [Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/tree/master/Basic-Voice-Call-for-Gaming/Hello-Gaming-Agora-iOS)

## Running the App
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID. Update "AMGVoice/KeyCenter.swift" with your App ID.

```
static let appId: String = <#Your App id#>
```

Next, download the **Agora Gaming SDK** from [Agora.io SDK](https://www.agora.io/en/download/). Unzip the downloaded SDK package and copy **libs/AgoraAudioKit.framework** to the “AMGVoice” folder in project.

Finally, Open AMGVoice.xcodeproj, connect your iPhone／iPad device, setup your development signing and run.

## Developer Environment Requirements
- XCode 8.0 +
- Real devices (iPhone or iPad)
- iOS simulator is NOT supported

## Connect Us

- You can find full API document at [Document Center](https://docs.agora.io/en/)
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/issues)

## License

The MIT License (MIT).
