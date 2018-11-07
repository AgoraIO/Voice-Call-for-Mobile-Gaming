# Spacewar with Agora Gaming SDK Android

*其他语言版本： [简体中文](README.zh.md)*

The Spacewar with Agora Gaming SDK Android Sample App is an open-source demo that will help you get voice chat integrated directly into your Android gaming applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel
- Select voice mode: free mode, command mode, audience mode
- Mute / unmute audio
- Music mixing and audio effect playing
- Voice morphing (In Progress)
- Set posotion of voice and audio effect (In Progress)
- Set volume of voice and audio effect

A tutorial demo can be found here: [Hello-Gaming-Agora-Android](https://github.com/AgoraIO/Video-Call-for-Mobile-Gaming/tree/master/Hello-Video-Unity-Agora)

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
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/issues)

## License

The MIT License (MIT).
