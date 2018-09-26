#ifndef __HELLOAGORA_SCENE_H__
#define __HELLOAGORA_SCENE_H__

#include "cocos2d.h"

#include "ui/UIEditBox/UIEditBox.h"

// PLEASE KEEP THIS App ID IN SAFE PLACE -->
// Get your own App ID at https://dashboard.agora.io/
// After you entered the App ID, remove <##> outside of Your App ID
// For formal released project, please use Dynamic Key
// http://docs.agora.io/en/user_guide/Component_and_Others/Dynamic_Key_User_Guide.html
#define AGORA_APP_ID <#YOUR APP ID#>

USING_NS_CC;

class TextBox;

class HelloAgora : public cocos2d::Layer
{

private:
    TextBox *mMsgBox = nullptr;
    ui::EditBox *mChannelEditBox = nullptr;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();

    virtual void update(float delta);

    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);

    // implement the "static create()" method manually
    CREATE_FUNC(HelloAgora);

private:
    void onJoinChannelClicked();
    void onLeaveChannelClicked();

public:
    void updateMsgContent(const std::string& msg);
};

#endif // __HELLOAGORA_SCENE_H__
