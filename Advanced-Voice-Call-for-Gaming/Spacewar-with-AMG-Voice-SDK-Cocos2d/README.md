# Spacewar with Agora Gaming SDK Cocos2d

*其他语言版本： [简体中文](README.zh.md)*

The Spacewar with Agora Gaming SDK Cocos2d Sample App is an open-source demo that will help you get voice chat integrated directly into your Cocos2d gaming applications using the Agora Gaming SDK.

With this sample app, you can:

- Join / leave channel
- Select voice mode: free mode, command mode, audience mode
- Mute / unmute audio
- Music mixing and audio effect playing
- Voice morphing
- Set posotion of voice and audio effect
- Set volume of voice and audio effect

A tutorial demo can be found here: [Hello-Cocos2d-Agora](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/tree/master/Basic-Voice-Call-for-Gaming/Hello-Cocos2d-Agora)

## Running the App
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID. Update "Classes/SceneMgr.h" with your App ID.

```
#define AGORA_APP_ID <#YOUR APP ID#>
```

Next, download the **Agora Gaming SDK** from [Agora.io SDK](https://www.agora.io/en/download/). Unzip the downloaded SDK package and copy **include** and **libs** to **AgoraGamingSDK**.

- This sample app needs open-source project [Cocos2d-x](http://www.cocos2d-x.org/), download it from http://www.cocos2d-x.org/filedown/cocos2d-x-3.14.1.zip and replace files under **cocos2d**
- Agora Gaming SDK does not rely on specific version of Cocos2d, so it's unnecessary to worry about the version which you are already using 

- **Run project for Android**

Head to foler `proj.android-studio/app` and execute `ndk-build`.

Finally, open project with Android Studio, connect your Android device, build and run.

Or use `Gradle` to build and run.

- **Run project for iOS**

Open project with Xcode, connect your iOS device, build and run.

## Developer Environment Requirements
- Android Studio 2.0+ / Xcode 8.0+
- Real Android / iOS devices(Nexus 5X or other devices)
- Some simulators are function missing or have performance issue, so real device is the best choice

## Connect Us

- You can find full API document at [Document Center](https://docs.agora.io/en/)
- You can file bugs about this demo at [issue](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/issues)

## License

The MIT License (MIT).

