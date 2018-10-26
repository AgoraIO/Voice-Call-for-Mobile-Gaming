#include "MainGameScene.h"

#include "PeerSquareLayer.h"

#include "SceneMgr.h"

#include "SimpleAudioEngine.h"

#include <math.h>

using namespace CocosDenshion;

using namespace agora::rtc;

enum AUDIO_ROUTE_TYPE {
        AUDIO_ROUTE_DEFAULT = -1,
        AUDIO_ROUTE_HEADSET = 0,
        AUDIO_ROUTE_EARPIECE = 1,
        AUDIO_ROUTE_SPEAKERPHONE = 3,
        AUDIO_ROUTE_BLUETOOTH = 5,
};

#define BACKGROUND_MUSIC_SFX  "background-music-aac.mp3"
#define PEW_PEW_SFX           "pew-pew-lei.mp3"
#define COLLISION_SOUND       "boom.mp3"

class MyIGamingRtcEngineEventHandler : public agora::rtc::IRtcEngineEventHandler
{
public:
    MyIGamingRtcEngineEventHandler() {
    }

    ~MyIGamingRtcEngineEventHandler() {
    }

    void onJoinChannelSuccess(const char* channel, uid_t uid, int elapsed) 
    {
        CCLOG("[General C++]:onJoinChannelSuccess %s, %d, %d", channel, uid, elapsed);
        std::stringstream rawMsg;
        rawMsg << "onJoinChannelSuccess " << channel << " " << uid << " " << elapsed;
    }

    void onLeaveChannel(const RtcStats& stats) 
    {
        CCLOG("[General C++]:onLeaveChannel %d, %d, %d", stats.duration, stats.txBytes, stats.rxBytes);
        std::stringstream rawMsg;
        rawMsg << "onLeaveChannel " << stats.duration << " " << stats.txBytes << " " << stats.rxBytes;
    }

    void onUserJoined(uid_t uid, int elapsed) 
    {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;

        (static_cast<MainGame*>(scene))->onUserOnline(uid);
    }

    void onUserOffline(uid_t uid, USER_OFFLINE_REASON_TYPE reason) 
    {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;

        (static_cast<MainGame*>(scene))->onUserOffline(uid);
    }

    void onAudioRoutingChanged(int route) 
    {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;
        (static_cast<MainGame*>(scene))->onAudioRouteChanged(route);
        std::stringstream rawMsg;
        rawMsg << "onAudioRoutingChanged " << route;
        CCLOG("[General C++]:onAudioRoutingChanged %d", route);
    }

    void onAudioVolumeIndication(const AudioVolumeInfo* speakers, unsigned int speakerNumber, int totalVolume) 
    {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;

        (static_cast<MainGame*>(scene))->onUserVolumeIndication(speakers, speakerNumber);
    }

    void onWarning(int warn, const char* msg)  {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;

        std::stringstream rawMsg;
        rawMsg << "onWarning " << warn << " " << AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getErrorDescription(warn);
        (static_cast<MainGame*>(scene))->onError(warn, rawMsg.str());
    }

    void onError(int err, const char* msg)  {
        auto scenes = SceneMgr::getInstance()->getScenes();
        auto scene = (scenes.begin() + 1)->first;

        std::stringstream rawMsg;
        rawMsg << "onError " << err << " " << AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getErrorDescription(err);
        (static_cast<MainGame*>(scene))->onError(err, rawMsg.str());
    }
};

enum class PhysicsCategory {
    None = 0,
    Monster = (1 << 0),    // 1
    Projectile = (1 << 1), // 2
    All = PhysicsCategory::Monster | PhysicsCategory::Projectile // 3
};

Scene* MainGame::createScene()
{
    // 'scene' is an autorelease object
    auto scene = Scene::createWithPhysics();
    scene->getPhysicsWorld()->setGravity(Vec2(0,0));

    // 'layer' is an autorelease object
    auto layer = MainGame::create();

    // add layer as a child to scene
    scene->addChild(layer);

    // return the scene
    return scene;
}

// on "init" you need to initialize your instance
bool MainGame::init()
{
    // 1
    if (!RtcScene::init()) {
        return false;
    }

    auto visibleSize = Director::getInstance()->getVisibleSize();
    auto winSize = Director::getInstance()->getWinSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.

    // add a "close" icon to exit the progress. it's an autorelease object
    auto closeItem = MenuItemImage::create(
                                           "CloseNormal.png",
                                           "CloseSelected.png",
                                           CC_CALLBACK_1(MainGame::menuCloseCallback, this));

    closeItem->setPosition(Vec2(origin.x + visibleSize.width - closeItem->getContentSize().width / 2 ,
                                origin.y + closeItem->getContentSize().height / 2));

    // create menu, it's an autorelease object
    auto menu = Menu::create(closeItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

    // 3
    auto background = DrawNode::create();
    background->drawSolidRect(origin, winSize, Color4F(0.6, 0.6, 0.6, 1.0));
    this->addChild(background);

    // 4
    _player = Sprite::create("player.png");
    _player->setPosition(Vec2(visibleSize.width * 0.5 - _player->getContentSize().width / 2, visibleSize.height * 0.1));
    this->addChild(_player);

    mSpeakerSquare = PeerSquareLayer::create();
    mSpeakerSquare->setPosition(Vec2(visibleSize.width * 0.5 - (mSpeakerSquare->getContentSize().width / 2), visibleSize.height * 0.4));
    mSpeakerSquare->onSpeakerReleased = CC_CALLBACK_3(MainGame::onSpeakerReleased, this);
    this->addChild(mSpeakerSquare);

    // AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->setEventHandler(new MyIGamingRtcEngineEventHandler());
    SceneMgr::getInstance()->addScene(this, "Game");

    //testing 
    AgoraRtcEngineForGaming_CreateAgoraObject(AGORA_APP_ID, new MyIGamingRtcEngineEventHandler());
    
    joinLeaveSwitch = ControlSwitch::create(
                                                       Sprite::create("switch-mask-hd.png"),
                                                       Sprite::create("switch-on-hd.png"),
                                                       Sprite::create("switch-off-hd.png"),
                                                       Sprite::create("switch-thumb-hd.png"),
                                                       Label::create("Leave", "fonts/Arial-BoldMT", 10),
                                                       Label::create("Joined", "fonts/Arial-BoldMT", 10)
                                                       );

    auto settingsButton = ui::Button::create("btn_settings.png", "btn_settings.png", "btn_settings.png");
    auto enableAudioButton = ui::Button::create("btn_speaker.png", "btn_speaker_enabled.png", "btn_speaker.png");
    auto muteAudioButton = ui::Button::create("btn_mute.png", "btn_mute_enabled.png", "btn_mute.png");
    auto commanderModeButton = ui::Button::create("btn_commander.png", "btn_commander_enabled.png", "btn_commander.png");
    mBroadcasterAudienceSwitch = ControlSwitch::create(
                                                           Sprite::create("switch-mask-hd.png"),
                                                           Sprite::create("switch-on-hd.png"),
                                                           Sprite::create("switch-off-hd.png"),
                                                           Sprite::create("switch-thumb-hd.png"),
                                                           Label::create("Host", "fonts/Arial-BoldMT", 10),
                                                           Label::create("audience", "fonts/Arial-BoldMT", 8)
                                                           );

    mMsgLabel = Label::create();
    mChannelLabel = Label::createWithSystemFont("Free Mode",
                                                "Arial",
                                                18);

    int padding = 10;
    int sizew = enableAudioButton->getContentSize().width;
    int sizeh = enableAudioButton->getContentSize().height;
    int x = origin.x + visibleSize.width / 2;
    int y = origin.y + sizeh;

    
    joinLeaveSwitch->setPosition(Vec2(x - 2 * padding - 2 * sizew - 60, y));
    joinLeaveSwitch->addTargetWithActionForControlEvents(this, cccontrol_selector(MainGame::onSwitchValueChanged), Control::EventType::VALUE_CHANGED);
    this->addChild(joinLeaveSwitch);
    
    settingsButton->setPosition(Vec2(x - 2 * padding - 2 * sizew, y));

    settingsButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                popupLayer();
                break;
            case ui::Widget::TouchEventType::ENDED:
                break;
            default:
                break;
        }
    });

    this->addChild(settingsButton);

    enableAudioButton->setPosition(Vec2(x - padding - sizew, y));

    enableAudioButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                break;
            case ui::Widget::TouchEventType::ENDED:
                onAudioBtnClicked(enableAudioButton);
                break;
            default:
                break;
        }
    });

    this->addChild(enableAudioButton);

    muteAudioButton->setPosition(Vec2(x, y));

    muteAudioButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                break;
            case ui::Widget::TouchEventType::ENDED:
                onAudioMuteBtnClicked(muteAudioButton);
                break;
            default:
                break;
        }
    });

    this->addChild(muteAudioButton);

    commanderModeButton->setPosition(Vec2(x + padding + sizew, y));

    commanderModeButton->addTouchEventListener([&](cocos2d::Ref* sender, ui::Widget::TouchEventType type) {
        switch (type)
        {
            case ui::Widget::TouchEventType::BEGAN:
                break;
            case ui::Widget::TouchEventType::ENDED:
                onClientRoleBtnClicked(commanderModeButton);
                break;
            default:
                break;
        }
    });

    this->addChild(commanderModeButton);

    mBroadcasterAudienceSwitch->setPosition(Vec2(x + 2 * padding + 2 * sizew, y));
    this->addChild(mBroadcasterAudienceSwitch);

    mMsgLabel->setPosition(Vec2(x + 3 * padding + 3 * sizew, y));
    this->addChild(mMsgLabel);

    mChannelLabel->setPosition(Vec2(origin.x + visibleSize.width / 2, origin.y + visibleSize.height - mChannelLabel->getContentSize().height));
    this->addChild(mChannelLabel);

    SceneMgr* sceneMgr = SceneMgr::getInstance();
    if (sceneMgr->config.cft == CHANNEL_PROFILE_COMMUNICATION) {
        mBroadcasterAudienceSwitch->setVisible(false);
        commanderModeButton->setVisible(false);
    } else if (sceneMgr->config.cft == CHANNEL_PROFILE_LIVE_BROADCASTING) {
        mBroadcasterAudienceSwitch->setOn(sceneMgr->config.crt == CLIENT_ROLE_BROADCASTER);

        mBroadcasterAudienceSwitch->setVisible(true);
        commanderModeButton->setVisible(true);
    } else {
        CCLOG("wrong mode %d", sceneMgr->config.cft);
    }

    mChannelLabel->setString(sceneMgr->config.channel);

    return true;
}

void MainGame::onSwitchValueChanged(Ref* sender, Control::EventType evtType)
{
    ControlSwitch* slider = (ControlSwitch*) sender;
    bool toJoin = slider->isOn();
    join_Leave_func();
    return ;
}

void MainGame::join_Leave_func(void)
{
    SceneMgr* sceneMgr = SceneMgr::getInstance();
    long long ts = sceneMgr->config.ts;
    
    long long nowTs = utils::getTimeInMilliseconds();
    
    if (nowTs - ts <= 500) {
        return;
    }
    
    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    if (ts == 0) {
        rtcEngine->setChannelProfile(sceneMgr->config.cft);
        
        if (sceneMgr->config.cft == CHANNEL_PROFILE_LIVE_BROADCASTING) {
            rtcEngine->setClientRole(sceneMgr->config.crt);
        }
        
        if (true == sceneMgr->config.bVoiceOnly) {        
            agora::base::AParameter apm(rtcEngine);
		    apm->setParameters("{\"che.audio.voice_over_mode\":true}");

            // rtcEngine->getAudioEffectManager()->setVoiceOnlyMode(true);
        }
        
        if (true == sceneMgr->config.bSetDefSpeaker) {
            rtcEngine->setDefaultAudioRouteToSpeakerphone(true);
        }
        
        // rtcEngine->joinChannel(sceneMgr->config.channel.c_str(), "Cocos2d", 0);
        rtcEngine->joinChannel("",sceneMgr->config.channel.c_str(), "Cocos2d", 0);
        rep.enableAudioVolumeIndication(800, 3);
        // rtcEngine->enableAudioVolumeIndication(200, 3);

        SceneMgr::getInstance()->config.ts = nowTs;
        
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        std::string file = FileUtils::getInstance()->fullPathForFilename(PEW_PEW_SFX);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        const string& file = FileUtils::getInstance()->getWritablePath() + PEW_PEW_SFX;
#endif
        // AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getAudioEffectManager()->preloadEffect(1, file.c_str());
        char * writable = new char[file.size() + 1];
        std::copy(file.begin(), file.end(), writable);
        writable[file.size()] = '\0'; // don't forget the terminating 0

        rep.preloadEffect(1, writable);
        // don't forget to free the string after finished using it
        delete[] writable;

        doPlayBackgroundMusic(SceneMgr::getInstance()->config.useMixing);
    } else {
        rtcEngine->leaveChannel();
        
        SceneMgr::getInstance()->config.ts = 0;
        SceneMgr::getInstance()->config.muted = false;
        SceneMgr::getInstance()->config.useMixing = true;
        SceneMgr::getInstance()->config.mLocalPitch = 1.0;
        SceneMgr::getInstance()->config.mVoiceVolume = 100;
        SceneMgr::getInstance()->config.mMixingVolume = 100;
        SceneMgr::getInstance()->config.mEffectVolume = 100;
        
        SceneMgr::getInstance()->config.mRecordVolume = 100;
        SceneMgr::getInstance()->config.mPlayBackVolume = 100;
        SceneMgr::getInstance()->config.mSpeakerPhoneVolume = 100;
        
        SceneMgr::getInstance()->config.bVoiceOnly = false;
        SceneMgr::getInstance()->config.bSetDefSpeaker = false;
        SceneMgr::getInstance()->config.enbleSpeaker = false;
        
        doPlayBackgroundMusic(SceneMgr::getInstance()->config.useMixing);
    }
}

void MainGame::onAudioBtnClicked(ui::Button* btn)
{
    bool inChannel = SceneMgr::getInstance()->config.ts > 0;
    
    VoicePopupLayer* pl = VoicePopupLayer::create("popup_bg.png");
    pl->setContentSize(Size(220, 180));
    pl->setColor(Color3B(250, 60, 60));
    pl->setCallbackFunc(this, CC_CALLFUNCN_SELECTOR(MainGame::onPopupButtonCallback));

    pl->onMuteAllRemote = CC_CALLBACK_1(MainGame::onMuteAllRemote, this);
    pl->onMuteLocal = CC_CALLBACK_1(MainGame::onMuteLocal, this);
    pl->onAudioToggle = CC_CALLBACK_1(MainGame::onAudioToggle, this);

    pl->addButton("Button.png", "Button.png", "Ok", 1);
    
    pl->sliderSetAble(inChannel);
    this->addChild(pl, 1);
}

void MainGame::onAudioMuteBtnClicked(ui::Button* btn)
{
    SceneMgr* sceneMgr = SceneMgr::getInstance();
    bool muted = sceneMgr->config.muted;

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);

    muted = !muted;
    rtcEngine->muteLocalAudioStream(muted);
    sceneMgr->config.muted = muted;
}

void MainGame::onClientRoleBtnClicked(ui::Button* btn)
{
    SceneMgr* sceneMgr = SceneMgr::getInstance();
    CLIENT_ROLE_TYPE role = sceneMgr->config.crt;

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);

    if (role == CLIENT_ROLE_BROADCASTER) {
        role = CLIENT_ROLE_AUDIENCE;
    } else {
        role = CLIENT_ROLE_BROADCASTER;
    }
    rtcEngine->setClientRole(role);
    sceneMgr->config.crt = role;

    mBroadcasterAudienceSwitch->setOn(role == CLIENT_ROLE_BROADCASTER);
}

void MainGame::onEnter()
{
    Layer::onEnter();
    CCLOG("onEnter");
    doCopyAssets(BACKGROUND_MUSIC_SFX);
    doCopyAssets(PEW_PEW_SFX);
    doCopyAssets(COLLISION_SOUND);

    scheduleUpdate();

    doPlayBackgroundMusic(SceneMgr::getInstance()->config.useMixing);

    srand((unsigned int)time(nullptr));
    this->schedule(CC_SCHEDULE_SELECTOR(MainGame::addMonster), 1.5);

    auto eventListener = EventListenerTouchOneByOne::create();
    eventListener->onTouchBegan = CC_CALLBACK_2(MainGame::onTouchBegan, this);
    this->getEventDispatcher()->addEventListenerWithSceneGraphPriority(eventListener, _player);

    auto contactListener = EventListenerPhysicsContact::create();
    contactListener->onContactBegin = CC_CALLBACK_1(MainGame::onContactBegan, this);
    this->getEventDispatcher()->addEventListenerWithSceneGraphPriority(contactListener, this);
}

void MainGame::onExit()
{
    CCLOG("onExit");
    doStopPlayBackgroundMusic();

    Layer::onExit();
}

void MainGame::popupLayer()
{
    bool inChannel = SceneMgr::getInstance()->config.ts > 0;
    
    SettingsPopupLayer* pl = SettingsPopupLayer::create("popup_bg.png");
    pl->setContentSize(Size(320, 220));
    pl->setColor(Color3B(250, 60, 60));
    pl->setCallbackFunc(this, CC_CALLFUNCN_SELECTOR(MainGame::onPopupButtonCallback));
    pl->onVolumeChanged = CC_CALLBACK_2(MainGame::onVolumeChanged, this);
    pl->onUseMixing = CC_CALLBACK_1(MainGame::onUseMixing, this);
    pl->onPitchChanged = CC_CALLBACK_1(MainGame::onPitchChanged, this);
    
    pl->onRecordVolume = CC_CALLBACK_1(MainGame::onRecordVolume, this);
    pl->onPlayBackVolume = CC_CALLBACK_1(MainGame::onPlayBackVolume, this);
    pl->onSpeakerVolume = CC_CALLBACK_1(MainGame::onSpeakerVolume, this);
    pl->onEnableSpeaker = CC_CALLBACK_1(MainGame::onEnableSpeaker, this);
    pl->addButton("Button.png", "Button.png", "Ok", 1);

    pl->sliderSetAble(inChannel);
    this->addChild(pl, 1);
}

void MainGame::onPopupButtonCallback(Node* node)
{
    CCLOG("onPopupButtonCallback %d", node->getTag());
    if(node->getTag() == 1) {
    }
}

void MainGame::onVolumeChanged(SettingsPopupLayer::VolumeType type, float volume)
{
    bool useMixing = SceneMgr::getInstance()->config.useMixing;
    CCLOG("onVolumeChanged %d, %f, %s, %f", type, volume, useMixing ? "true" : "false", volume / 100.0);

    if (useMixing) {
        IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
        RtcEngineParameters rep(rtcEngine);

        if (type == SettingsPopupLayer::BGM_VOLUME) {
            rep.adjustAudioMixingVolume((int) volume);
        } else if (type == SettingsPopupLayer::EFFECT_VOLUME) {
           rep.setEffectsVolume(volume);
        }
    }
#if 0 //no need change out of channel's BMG
    else {
        SimpleAudioEngine* engine = SimpleAudioEngine::getInstance();
        if (type == SettingsPopupLayer::BGM_VOLUME) {
            engine->setBackgroundMusicVolume(volume / 100.0);
        } else if (type == SettingsPopupLayer::EFFECT_VOLUME) {
            engine->setEffectsVolume(volume / 100.0);
        }
    }
#endif
    
    if (type == SettingsPopupLayer::VOICE_VOLUME) {
        IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
        RtcEngineParameters rep(rtcEngine);
        rep.adjustRecordingSignalVolume(volume);
    }
}

void MainGame::onUseMixing(bool useMixing)
{
    CCLOG("onUseMixing %s", useMixing ? "true" : "false");
    doPlayBackgroundMusic(useMixing);
}

void MainGame::onPitchChanged(float pitch)
{
    CCLOG("onPitchChanged %f", pitch);
    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    rep.setLocalVoicePitch(pitch);
}

void MainGame::onRecordVolume(int vol)
{
    CCLOG("onRecordVolume %d", vol);

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    rep.adjustRecordingSignalVolume(vol);
}

void MainGame::onPlayBackVolume(int vol)
{
    CCLOG("onPlayBackVolume %d", vol);

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    rep.adjustPlaybackSignalVolume(vol);
}

void MainGame::onSpeakerVolume(int vol)
{
    CCLOG("onSpeakerVolume %d", vol);
    // Android, iOS no such API: SetSpeakerphoneVolume
//    AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->SetSpeakerphoneVolume(vol);
}

void MainGame::onEnableSpeaker(bool val)
{
    bool inChannel = SceneMgr::getInstance()->config.ts > 0;
    
    if (inChannel) {
        AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->setEnableSpeakerphone(val);
        return;
    }
    CCLOG("Not in Channel, skip setEnableSpeakerphone !");
}

void MainGame::onAudioToggle(bool val)
{
    if (val) {
        AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->enableAudio();
    }else {
        AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->disableAudio();
    }
    return;
}

void MainGame::onMuteAllRemote(bool val)
{    
    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    rep.muteAllRemoteAudioStreams(val);
    return;
}

void MainGame::onMuteLocal(bool val)
{
    AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->muteLocalAudioStream(val);
    return;
}

void MainGame::doCopyAssets(const std::string &filename)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    auto data = FileUtils::getInstance()->getDataFromFile(filename);

    string tmpPath = FileUtils::getInstance()->getWritablePath() + "/" + filename;
    FILE* dest = fopen(tmpPath.c_str(), "wb");
    fwrite(data.getBytes(), 1, data.getSize(), dest);
    fclose(dest);
#endif
}

void MainGame::doPlayBackgroundMusic(bool useAgoraMixing)
{
    bool inChannel = SceneMgr::getInstance()->config.ts > 0;

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);

    if (useAgoraMixing && inChannel) {

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        std::string file = FileUtils::getInstance()->fullPathForFilename(BACKGROUND_MUSIC_SFX);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        const string& file = FileUtils::getInstance()->getWritablePath() + BACKGROUND_MUSIC_SFX;
#endif

        SimpleAudioEngine::getInstance()->stopBackgroundMusic();

        rep.startAudioMixing(file.c_str(), true, false, -1);
    } else {
        rep.stopAudioMixing();
        SimpleAudioEngine::getInstance()->playBackgroundMusic(BACKGROUND_MUSIC_SFX, true);
    }
}

void MainGame::doPlayEffect(bool useAgoraMixing)
{
    bool inChannel = SceneMgr::getInstance()->config.ts > 0;

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);

    if (useAgoraMixing && inChannel) {

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        std::string file = FileUtils::getInstance()->fullPathForFilename(PEW_PEW_SFX);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        const string& file = FileUtils::getInstance()->getWritablePath() + PEW_PEW_SFX;
#endif

        CCLOG("doPlayEffect %s in channel %s path %s ", useAgoraMixing ? "true" : "false", inChannel ? "true" : "false", file.c_str());

        // AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->getAudioEffectManager()->playEffect(1, file.c_str());
        rep.playEffect(1, file.c_str(),1, 1.0,0,100,false);
    } else {
        SimpleAudioEngine::getInstance()->playEffect(PEW_PEW_SFX);
    }
}

void MainGame::doStopPlayBackgroundMusic()
{
    SimpleAudioEngine::getInstance()->stopBackgroundMusic();

    // AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->stopAudioMixing();
    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    RtcEngineParameters rep(rtcEngine);
    rep.stopAudioMixing();
}

void MainGame::onSpeakerReleased(uid_t uid, Vec2 loc, Vec2 myLoc)
{
    CCLOG("onSpeakerReleased %u, %f, %f, %f, %f", uid, loc.x, loc.y, myLoc.x, myLoc.y);
    // agora::rtc::IRtcEngine* engine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);
    // agora::rtc::IAudioEffectManager* effectMgr = engine->getAudioEffectManager();

    IRtcEngine* rtcEngine = AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID);    
    agora::base::AParameter apm(rtcEngine);

    // Location to Pan/Gain
    Vec2 direction = loc - myLoc;

    float pan = 0;
    if (direction == Vec2::ZERO) {
        pan = 0;
    } else if (direction.y == 0) {
        pan = direction.x > 0 ? 1 : -1;
    } else {
        pan = ::atan(direction.x / direction.y) / M_PI_2;
    }

    float gain = 100 - 50 * direction.length() / mSpeakerSquare->getContentSize().height * 2;
    if (gain < 20) {
        gain = 20;
    }
    
    // effectMgr->setRemoteVoicePosition(uid, pan, gain);
    const char *fmt = "{\"che.audio.game_place_sound_position\": {\"uid\":%u,\"pan\":%f,\"gain\":%f}}";
    char buf[512];
    sprintf(buf, fmt, uid, pan, gain);

    apm->setParameters (buf);
}

void MainGame::update(float delta)
{
    // AgoraRtcEngineForGaming_getInstance(AGORA_APP_ID)->poll();
}

void MainGame::menuCloseCallback(Ref* pSender)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WP8) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    MessageBox("You pressed the close button. Windows Store Apps do not implement a close button.","Alert");
    return;
#endif

    Director::getInstance()->end();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
}

void MainGame::addMonster(float dt) {
    auto monster = Sprite::create("monster.png");

//    // 1
//    auto monsterSize = monster->getContentSize();
//    auto physicsBody = PhysicsBody::createBox(Size(monsterSize.width , monsterSize.height),
//                                              PhysicsMaterial(0.1f, 1.0f, 0.0f));
//    // 2
//    physicsBody->setDynamic(true);
//    // 3
//    physicsBody->setCategoryBitmask((int)PhysicsCategory::Monster);
//    physicsBody->setCollisionBitmask((int)PhysicsCategory::None);
//    physicsBody->setContactTestBitmask((int)PhysicsCategory::Projectile);
//
//    monster->setPhysicsBody(physicsBody);

    // 1
    auto monsterContentSize = monster->getContentSize();
    auto selfContentSize = this->getContentSize();
    int minX = monsterContentSize.width / 2;
    int maxX = selfContentSize.width - monsterContentSize.width / 2;
    int rangeX = maxX - minX;
    int randomX = (rand() % rangeX) + minX;

    monster->setPosition(Vec2(randomX, selfContentSize.height + monsterContentSize.height / 2));
    monster->setScale(0.2, 0.2);
    this->addChild(monster);

    // 2
    int minDuration = 2.0;
    int maxDuration = 4.0;
    int rangeDuration = maxDuration - minDuration;
    int randomDuration = (rand() % rangeDuration) + minDuration;

    // 3
    auto actionMove = MoveTo::create(randomDuration, Vec2(randomX, -monsterContentSize.height / 2));
    auto actionRemove = RemoveSelf::create();
    monster->runAction(Sequence::create(actionMove, actionRemove, nullptr));
}

bool MainGame::onTouchBegan(Touch *touch, Event *unused_event) {
    // 1  - Just an example for how to get the  _player object
    //auto node = unused_event->getCurrentTarget();

    // 2
    Vec2 touchLocation = touch->getLocation();
    Vec2 offset = touchLocation - _player->getPosition();

    // 3
    if (offset.y < 0) {
        return true;
    }

    // 4
    auto projectile = Sprite::create("projectile.png");
    projectile->setPosition(_player->getPosition());
    
    auto projectileSize = projectile->getContentSize();
    auto physicsBody = PhysicsBody::createCircle(projectileSize.width / 2 );
    physicsBody->setDynamic(true);
    physicsBody->setCategoryBitmask((int)PhysicsCategory::Projectile);
    physicsBody->setCollisionBitmask((int)PhysicsCategory::None);
    physicsBody->setContactTestBitmask((int)PhysicsCategory::Monster);
    projectile->setPhysicsBody(physicsBody);
    
    projectile->setTag(1);
    this->addChild(projectile);

    // 5
    offset.normalize();
    auto shootAmount = offset * 1000;

    // 6
    auto realDest = shootAmount + projectile->getPosition();

    // 7
    auto actionMove = MoveTo::create(2.0f, realDest);
    auto actionRemove = RemoveSelf::create();
    projectile->runAction(Sequence::create(actionMove, actionRemove, nullptr));

    doPlayEffect(SceneMgr::getInstance()->config.useMixing);

    return true;
}

bool MainGame::onContactBegan(PhysicsContact &contact) {
    auto nodeA = contact.getShapeA()->getBody()->getNode();
    auto nodeB = contact.getShapeB()->getBody()->getNode();

    if (nodeA != nullptr && nodeA->getTag() == 1) {
        nodeA->removeFromParent();
    }
    if (nodeB != nullptr && nodeB->getTag() == 1) {
        nodeB->removeFromParent();
    }
    if((SceneMgr::getInstance()->config.ts > 0) && (SceneMgr::getInstance()->config.useMixing))
        SimpleAudioEngine::getInstance()->playBackgroundMusic(COLLISION_SOUND, false);
    
    return true;
}

void MainGame::onUserVolumeIndication(const agora::rtc::AudioVolumeInfo *speakers, unsigned int speakerNumber)
{
    if (speakerNumber <= 0) {
        return;
    }

    for (int i = 0; i < speakerNumber; i++) {
        AudioVolumeInfo info = *(speakers + i);

        if (info.uid == 0) {
            continue;
        }

        mSpeakerSquare->speaking(info.uid, info.volume);
    }
}

void MainGame::onUserOnline(uid_t uid)
{
    CCLOG("onUserOnline %d", uid);
    mSpeakerSquare->addSpeaker(uid);
}

void MainGame::onUserOffline(uid_t uid)
{
    CCLOG("onUserOffline %d", uid);
    mSpeakerSquare->removeSpeaker(uid);
}

void MainGame::onAudioRouteChanged(int route)
{
    CCLOG("onAudioRouteChanged %d", route);
    std::ostringstream oss;
    if (route == AUDIO_ROUTE_HEADSET) {
        oss << "Headset";
    } else if (route == AUDIO_ROUTE_EARPIECE) {
        oss << "Earpiece";
    } else if (route == AUDIO_ROUTE_SPEAKERPHONE) {
        oss << "Speakerphone";
    } else if (route == AUDIO_ROUTE_BLUETOOTH) {
        oss << "Bluetooth";
    } else {
        oss << "Something ";
        oss << route;
    }
    if (mMsgLabel != nullptr) {
        mMsgLabel->setString(oss.str());
    }
}

void MainGame::onError(int error, const std::string &description)
{
    CCLOG("onError %d, %s", error, description.c_str());

    if (mMsgLabel != nullptr) {
        mMsgLabel->setString(description);
    }
}
