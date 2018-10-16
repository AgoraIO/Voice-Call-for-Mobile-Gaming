#include "ui/CocosGUI.h"

#include "HelloAgoraScene.h"
#include "SimpleAudioEngine.h"

#include "TextBox/TextBox.h"

#include "DropDownList/DropDownListBox.h"

#include "../AgoraGamingSDK/include/AgoraGamingRtcHelper.h"
#include "../AgoraGamingSDK/include/IAgoraRtcEngineForGaming.h"

#include "MainGameScene.h"

#include "SceneMgr.h"

USING_NS_CC;

#define RTC_SDK_LOG_FILE      "rtc_sdk_amg.log"

Scene* HelloAgora::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::create();

    // 'layer' is an autorelease object
    auto layer = HelloAgora::create();

    // add layer as a child to scene
    scene->addChild(layer);

    // return the scene
    return scene;
}

// on "init" you need to initialize your instance
bool HelloAgora::init()
{
    //////////////////////////////
    // 1. super init first
    if (!RtcScene::init())
    {
        return false;
    }

    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.

    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(HelloAgora::menuCloseCallback, this));

    closeItem->setPosition(Vec2(origin.x + visibleSize.width - closeItem->getContentSize().width / 2 ,
                                origin.y + closeItem->getContentSize().height / 2));

    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

    /////////////////////////////
    // 3. add your codes below...

    // create and initialize a label

    std::stringstream title;
    title << "Agora Gaming Demo";
    title << " ";
    title << AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getVersion();
    auto label = Label::createWithTTF(title.str().c_str(), "fonts/Marker Felt.ttf", 24);

    // position the label on the center of the screen
    label->setPosition(Vec2(origin.x + visibleSize.width / 2,
                            origin.y + visibleSize.height - label->getContentSize().height));

    // add the label as a child to this layer
    this->addChild(label, 1);

    mChannelEditBox = ui::EditBox::create(Size(160, 40), "TextBox.png");
    mChannelEditBox->setPosition(Vec2(origin.x + visibleSize.width / 2, origin.y + visibleSize.height - mChannelEditBox->getContentSize().height * 1.5 - label->getContentSize().height));

    this->addChild(mChannelEditBox, 0);

    int padding = 80;

//    auto setModeButton = ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
//    setModeButton->setTitleText("Mode");
//    setModeButton->setPosition(Vec2(origin.x + padding + setModeButton->getContentSize().width / 2, origin.y + visibleSize.height / 2 - setModeButton->getContentSize().height / 2));
//
//    setModeButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
//        switch (type)
//        {
//            case ui::Widget::TouchEventType::BEGAN:
//                break;
//            case ui::Widget::TouchEventType::ENDED:
//                break;
//            default:
//                break;
//        }
//    });
//
//    this->addChild(setModeButton, 0);

    auto box_size = Size(160.0, 30.0);

    auto labelMode = Label::createWithSystemFont("Choose Mode",
                                                 "Arial",
                                                 18);
    mModeListBox = DropDownListBox::Create(labelMode, box_size, box_size);
    auto label1 = Label::createWithSystemFont("Free Mode",
                                              "Arial",
                                              18);
    mModeListBox->AddLabel(label1);
    auto label2 = Label::createWithSystemFont("Commander Mode",
                                              "Arial",
                                              18);
    mModeListBox->AddLabel(label2);
    auto label3 = Label::createWithSystemFont("Audience Mode",
                                              "Arial",
                                              18);
    mModeListBox->AddLabel(label3);

    mModeListBox->setPosition(Vec2(origin.x + mModeListBox->getContentSize().width / 2,
                               origin.y + visibleSize.height / 2 - mModeListBox->getContentSize().height));
    mModeListBox->SetSelectedIndex(0);
    this->addChild(mModeListBox);
    mModeListBox->OpenListener();

    auto joinButton = ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
    joinButton->setTitleText("Join");
    joinButton->setPosition(Vec2(origin.x + visibleSize.width - padding - joinButton->getContentSize().width / 2, origin.y + visibleSize.height / 2 -  joinButton->getContentSize().height / 2));

    joinButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                break;
            case ui::Widget::TouchEventType::ENDED:
                onJoinChannelClicked();
                break;
            default:
                break;
        }
    });

    this->addChild(joinButton, 0);

    // add "HelloAgora" splash screen"
    auto sprite = Sprite::create("HelloAgora.png");

    sprite->setPosition(Vec2(origin.x + visibleSize.width - sprite->getContentSize().width / 2 ,
                             visibleSize.height / 2 + origin.y));

    // add the sprite as a child to this layer
    this->addChild(sprite, 0);

    SceneMgr::getInstance()->addScene(this, "Main");

    auto rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    rtcEngine->setLogFilter(34781);
    std::string log_file = FileUtils::getInstance()->getWritablePath() + RTC_SDK_LOG_FILE;
    CCLOG("setLogFile %s", log_file.c_str());
    rtcEngine->setLogFile(log_file.c_str());

    return true;
}

void HelloAgora::update(float delta)
{
}

void HelloAgora::onEnter()
{
    Layer::onEnter();

    scheduleUpdate();
}

void HelloAgora::onExit()
{
    Layer::onExit();
}

void HelloAgora::onJoinChannelClicked()
{
    if (mChannelEditBox == nullptr || mModeListBox == nullptr || ::strlen(mChannelEditBox->getText()) == 0) {
        return;
    }

    if (0 == mModeListBox->GetSelectedIndex()) {
        SceneMgr::getInstance()->config.cft = agora::rtc::CHANNEL_PROFILE_GAME_FREE_MODE;
    } else if (1 == mModeListBox->GetSelectedIndex()) {
        SceneMgr::getInstance()->config.cft = agora::rtc::CHANNEL_PROFILE_GAME_COMMAND_MODE;
        SceneMgr::getInstance()->config.crt = agora::rtc::CLIENT_ROLE_BROADCASTER;
    } else if (2 == mModeListBox->GetSelectedIndex()) {
        SceneMgr::getInstance()->config.cft = agora::rtc::CHANNEL_PROFILE_GAME_COMMAND_MODE;
        SceneMgr::getInstance()->config.crt = agora::rtc::CLIENT_ROLE_AUDIENCE;
    }

    SceneMgr::getInstance()->config.channel = mChannelEditBox->getText();

    Director::getInstance()->replaceScene(MainGame::createScene());
}

void HelloAgora::menuCloseCallback(Ref* pSender)
{
    // Close the cocos2d-x game scene and quit the application
    Director::getInstance()->end();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif

    /*To navigate back to native iOS screen(if present) without quitting the application, do not use Director::getInstance()->end() and exit(0) as given above, instead trigger a custom event created in RootViewController.mm as below*/

    // EventCustom customEndEvent("game_scene_close_event");
    // _eventDispatcher->dispatchEvent(&customEndEvent);
}
