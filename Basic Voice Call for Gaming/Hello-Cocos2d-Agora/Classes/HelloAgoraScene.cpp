#include "ui/CocosGUI.h"

#include "HelloAgoraScene.h"
#include "SimpleAudioEngine.h"

#include "TextBox/TextBox.h"

#include "../AgoraGamingSDK/include/AgoraGamingRtcHelper.h"
#include "../AgoraGamingSDK/include/IAgoraRtcEngineForGaming.h"

USING_NS_CC;

using namespace agora::rtc;

class MyIGamingRtcEngineEventHandler : public agora::rtc::IGamingRtcEngineEventHandler
{
private:
    HelloAgora* mUi;

public:
    MyIGamingRtcEngineEventHandler(HelloAgora* ui) :mUi(ui) {
    }

    ~MyIGamingRtcEngineEventHandler() {
    }

    void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) override
    {
        CCLOG("[General C++]:onJoinChannelSuccess %s, %d, %d", channel, uid, elapsed);
        std::stringstream rawMsg;
        rawMsg << "onJoinChannelSuccess " << channel << " " << uid << " " << elapsed;
        mUi->updateMsgContent(rawMsg.str());
    }

    void onLeaveChannel(const RtcStats& stats) override
    {
        CCLOG("[General C++]:onLeaveChannel %d, %d, %d", stats.duration, stats.txBytes, stats.rxBytes);
        std::stringstream rawMsg;
        rawMsg << "onLeaveChannel " << stats.duration << " " << stats.txBytes << " " << stats.rxBytes;
        mUi->updateMsgContent(rawMsg.str());
    }

    void onAudioRouteChanged(AUDIO_ROUTE_TYPE routing) override
    {
        CCLOG("[General C++]:onAudioRouteChanged %d", routing);
    }

    void onRequestChannelKey() override
    {
        CCLOG("[General C++]:onRequestChannelKey");
    }
};

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
    if ( !Layer::init() )
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

    auto label = Label::createWithTTF(AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getVersion(), "fonts/Marker Felt.ttf", 24);

    // position the label on the center of the screen
    label->setPosition(Vec2(origin.x + visibleSize.width / 2,
                            origin.y + visibleSize.height - label->getContentSize().height));

    // add the label as a child to this layer
    this->addChild(label, 1);

    mMsgBox = TextBox::create("TextBox.png");
    mMsgBox->setPosition(Vec2(origin.x + visibleSize.width / 2 - 110,
                            origin.y + visibleSize.height - 210));

    mMsgBox->setSize(220, 160);

    this->addChild(mMsgBox, 0);

    int leftPadding = 10;

    mChannelEditBox = ui::EditBox::create(Size(120, 30), "TextBox.png");
    mChannelEditBox->setPlaceHolder("Enter Chan...");
    mChannelEditBox->setPosition(Vec2(origin.x + leftPadding + mChannelEditBox->getContentSize().width / 2, origin.y + visibleSize.height - 1.5 * mChannelEditBox->getContentSize().height));

    this->addChild(mChannelEditBox, 0);

    auto joinButton = ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
    joinButton->setTitleText("Join Channel");
    joinButton->setPosition(Vec2(origin.x + leftPadding + joinButton->getContentSize().width / 2, origin.y + visibleSize.height - 1 * joinButton->getContentSize().height - 2 * mChannelEditBox->getContentSize().height));

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

    auto leaveButton = ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
    leaveButton->setTitleText("Leave Channel");
    leaveButton->setPosition(Vec2(origin.x + leftPadding + leaveButton->getContentSize().width / 2, origin.y + visibleSize.height - 2 * leaveButton->getContentSize().height - 2 * mChannelEditBox->getContentSize().height));

    leaveButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                break;
            case ui::Widget::TouchEventType::ENDED:
                onLeaveChannelClicked();
                break;
            default:
                break;
        }
    });

    this->addChild(leaveButton, 0);

    // add "HelloAgora" splash screen"
    auto sprite = Sprite::create("HelloAgora.png");

    sprite->setPosition(Vec2(origin.x + visibleSize.width - sprite->getContentSize().width / 2 ,
                                visibleSize.height / 2 + origin.y));

    // add the sprite as a child to this layer
    this->addChild(sprite, 0);

    AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->setEventHandler(new MyIGamingRtcEngineEventHandler(this));

    scheduleUpdate();

    return true;
}

void HelloAgora::update(float delta)
{
    AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->poll();
}

void HelloAgora::updateMsgContent(const std::string& msg)
{
    mMsgBox->setText(msg);
}

void HelloAgora::onLeaveChannelClicked()
{
    AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->leaveChannel();
}

void HelloAgora::onJoinChannelClicked()
{
    if (mChannelEditBox == nullptr || ::strlen(mChannelEditBox->getText()) == 0) {
        return;
    }

    auto rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    rtcEngine->setChannelProfile(CHANNEL_PROFILE_GAME_FREE_MODE);
    rtcEngine->joinChannel(mChannelEditBox->getText(), "Cocos2d", 0);
}

void HelloAgora::menuCloseCallback(Ref* pSender)
{
    onLeaveChannelClicked();

    // Close the cocos2d-x game scene and quit the application
    Director::getInstance()->end();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif

    /*To navigate back to native iOS screen(if present) without quitting the application, do not use Director::getInstance()->end() and exit(0) as given above, instead trigger a custom event created in RootViewController.mm as below*/

    // EventCustom customEndEvent("game_scene_close_event");
    // _eventDispatcher->dispatchEvent(&customEndEvent);
}
