# Hello Agora CocosCreator Voice

*Read this in other languages: [中文](README.zh.md)*

This tutorial enables you to quickly get started integrating voice chat into a [Cocos Creator](https://www.cocos.com/) game application, using the Cocos Creator Agora Voice SDK on Android, iOS and Web. 

This sample app demonstrates the basic voice SDK features:

- join channel & leave channel

- mute & unmute

- volume control

- enable audio & disable audio

## Prerequisites
- CocosCreator 2.0.9 +


## Run Demo

- step 1, [Download](https://www.cocos.com/download), install CocosCreator 2.0.9 or newer one. Sign up CococsCreator, and certificate your CococsCreator Account. Cocos Official will approve it in less than 3 days.

- step 2, [craete a CocosCreator game](https://account.cocos.com/#/game/create_game).

- step 3, CococsCreator open Demo. Click the "Pannel" of CococsCreator status bar, click "Service" of "Pannel", select "Agora Voice" in "Services" on the right side, then, associate the Game created in step2. 
 
- step 4, Click, open the toggle button of “Agora Voice" on the right sied. Open the ”Agora Voice Service" step by step, according to CococsCreator's tips。 

- step 5, Click "DashBoard" of Agora Voice Service at CococsCreator right side, arriving at agora dashboard. Then, get the Agora AppId in "Project Manager".

- step 6, Fill in agora AppID in HelloWorld.js:

	```
	agoraAppID:"YOUR_AGORA_APPID",
	```

- At last， CococsCreator build, compile, play Android, iOS, Web separately.
Playing Android, iOS, need going to 

	```
	jsb-default/frameworks/runtime-src 
	```
or 

	```
	jsb-link/frameworks/runtime-src
	```
open project and run on devices.

## Resources
- [cocos creator Agora Voice SDK API](https://docs.agora.io/cn/Interactive%20Gaming/game_coco)
- [Cocos Creator Agora Voice Quick Start](https://docs.agora.io/en/Interactive%20Gaming/game_c?platform=Cocos%20Creator)

## Learn More
- A more complete demo can be found in the [Spacewar with AMG Voice SDK for Unity](https://github.com/AgoraIO/Voice-Call-for-Mobile-Gaming/tree/master/Advanced-Voice-Call-for-Gaming/Spacewar-with-AMG-Voice-SDK-Unity) project.
- Agora Video SDK samples are also available for the following platforms:
	- Hello Gaming Agora for [iOS](https://github.com/AgoraIO/Hello-Gaming-Agora-iOS)
	- Hello Gaming Agora for [Android](https://github.com/AgoraIO/Hello-Gaming-Agora-Android)
	- Hello Gaming Agora for [Cocos2d](https://github.com/AgoraIO/Hello-Cocos2d-Agora)

## License
This software is under the MIT License (MIT). [View the license](LICENSE.md).