/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include "cocos2d.h"

#ifdef __APPLE__
#include <AgoraRtcKit/IAgoraRtcEngine.h>
#elif __ANDROID__
#include "IAgoraRtcEngine.h"
#endif

#include "ui/CocosGUI.h"
#include "./TextBox/TextBox.h"

// PLEASE KEEP THIS App ID IN SAFE PLACE -->
// Get your own App ID at https://dashboard.agora.io/
// After you entered the App ID, remove <##> outside of Your App ID
// For formal released project, please use Dynamic Key
// http://docs.agora.io/en/user_guide/Component_and_Others/Dynamic_Key_User_Guide.html
#define AGORA_APP_ID "aab8b8f5a8cd4469a63042fcfafe7063"

class HelloWorld : public cocos2d::Scene
{
public:
    static cocos2d::Scene* createScene();

    bool init() override;

    void onEnter() override;
    
    void onExit() override;
    
    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);
    
    // implement the "static create()" method manually
    CREATE_FUNC(HelloWorld);

public:
    void updateMsgContent(const std::string &msg);

private:
    void onJoinChannelClicked();

    void onLeaveChannelClicked();

private:
    TextBox *mMsgBox = nullptr;
    cocos2d::ui::EditBox *mChannelEditBox = nullptr;
    agora::rtc::IRtcEngine *engine;
    agora::rtc::IRtcEngineEventHandler *eventHandler;
};

#endif // __HELLOWORLD_SCENE_H__
