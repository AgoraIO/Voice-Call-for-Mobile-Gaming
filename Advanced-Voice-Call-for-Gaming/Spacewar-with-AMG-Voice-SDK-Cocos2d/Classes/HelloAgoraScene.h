#ifndef __HELLOAGORA_SCENE_H__
#define __HELLOAGORA_SCENE_H__

#include "RtcScene.h"

#include "ui/UIEditBox/UIEditBox.h"

USING_NS_CC;

class DropDownListBox;

class HelloAgora : public RtcScene
{

private:
    ui::EditBox* mChannelEditBox = nullptr;
    DropDownListBox* mModeListBox = nullptr;

public:
    static cocos2d::Scene* createScene();

    bool init() override;

    void update(float delta) override;

    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);

    // implement the "static create()" method manually
    CREATE_FUNC(HelloAgora);

    void onEnter() override;

    void onExit() override;

private:
    void onJoinChannelClicked();
};

#endif // __HELLOAGORA_SCENE_H__
