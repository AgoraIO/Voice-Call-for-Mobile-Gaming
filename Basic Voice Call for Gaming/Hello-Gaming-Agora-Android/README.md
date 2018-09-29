# Hello Gaming Agora Android

*其他语言版本： [简体中文](README.zh.md)*

The Hello Gaming Agora Android Sample App is an open-source demo that will help you get voice chat integrated directly into your Android game applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel
- Mute / unmute audio
- Switch speaker

Agora Gaming SDK supports iOS / Android / Unity / Cocos2d. You can find demos of these platform here:

- [Hello-Gaming-Agora-iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)
- [Hello-Unity3D-Agora](https://github.com/AgoraIO/Hello-Unity3D-Agora)
- [Hello-Cocos2d-Agora](https://github.com/AgoraIO/Hello-Cocos2d-Agora)

## Running the App
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID. Update "app/src/main/res/values/strings_config.xml" with your App ID.

```
<string name="private_app_id"><#YOUR APP ID#></string>
```

Next, download the **Agora Gaming SDK** from [Agora.io SDK](https://www.agora.io/en/download/). Unzip the downloaded SDK package and copy ***.jar** under **libs** to **app/libs**, **arm64-v8a**/**x86**/**armeabi-v7a** under **libs** to **app/src/main/jniLibs**.

Finally, open project with Android Studio, connect your Android device, build and run.

Or use `Gradle` to build and run.

## Developer Environment Requirements
- Android Studio 2.0 or above
- Real devices (Nexus 5X or other devices)
- Some simulators are function missing or have performance issue, so real device is the best choice

## Connect Us

- You can find full API document at [Document Center](https://docs.agora.io/en/)
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Hello-Gaming-Agora-Android/issues)

## License

The MIT License (MIT).
