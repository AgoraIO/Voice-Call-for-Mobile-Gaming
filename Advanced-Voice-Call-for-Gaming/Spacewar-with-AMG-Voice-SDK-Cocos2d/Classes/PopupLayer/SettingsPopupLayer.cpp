
#include "SettingsPopupLayer.h"

#include "../SceneMgr.h"

SettingsPopupLayer::SettingsPopupLayer():
isSetAble(false)
,m__pMenu(nullptr)
, m_callbackListener(nullptr)
, m_callback(nullptr)
, m__sfBackGround(nullptr)
, m__s9BackGround(nullptr)
, mLocalPitchLabel(nullptr)
, mLocalPitchControlSlider(nullptr)
, mLocalPitchValueLabel(nullptr)
, mVoiceLabel(nullptr)
, mVoiceVolumeControlSlider(nullptr)
, mVoiceValueLabel(nullptr)
, mBGMLabel(nullptr)
, mBGMVolumeControlSlider(nullptr)
, mBGMValueLabel(nullptr)
, mAudioEffectLabel(nullptr)
, mAudioEffectVolumeControlSlider(nullptr)
, mAudioEffectValueLabel(nullptr)

,mRecordVolumeLabel(nullptr)
,mRecordVolumeSlider(nullptr)
,mRecordVolumeValueLabel(nullptr)

,mPlayBackVolumeLabel(nullptr)
,mPlayBackVolumeSlider(nullptr)
,mPlayBackVolumeValueLabel(nullptr)

,mSpeakerVolumeLabel(nullptr)
,mSpeakerVolumeSlider(nullptr)
,mSpeakerVolumeValueLabel(nullptr)
{
}

SettingsPopupLayer::~SettingsPopupLayer()
{
    CC_SAFE_RELEASE(m__pMenu);
    CC_SAFE_RELEASE(m__sfBackGround);
    CC_SAFE_RELEASE(mAudioEffectValueLabel);
    CC_SAFE_RELEASE(mAudioEffectVolumeControlSlider);
    CC_SAFE_RELEASE(mAudioEffectLabel);
    CC_SAFE_RELEASE(mBGMValueLabel);
    CC_SAFE_RELEASE(mBGMVolumeControlSlider);
    CC_SAFE_RELEASE(mBGMLabel);
    CC_SAFE_RELEASE(mVoiceValueLabel);
    CC_SAFE_RELEASE(mVoiceVolumeControlSlider);
    CC_SAFE_RELEASE(mVoiceLabel);
    CC_SAFE_RELEASE(mLocalPitchValueLabel);
    CC_SAFE_RELEASE(mLocalPitchControlSlider);
    CC_SAFE_RELEASE(mLocalPitchLabel);
    CC_SAFE_RELEASE(m__s9BackGround);
    
    CC_SAFE_RELEASE(mRecordVolumeValueLabel);
    CC_SAFE_RELEASE(mRecordVolumeSlider);
    CC_SAFE_RELEASE(mRecordVolumeLabel);
    
    CC_SAFE_RELEASE(mPlayBackVolumeLabel);
    CC_SAFE_RELEASE(mPlayBackVolumeSlider);
    CC_SAFE_RELEASE(mPlayBackVolumeValueLabel);
    
    CC_SAFE_RELEASE(mSpeakerVolumeLabel);
    CC_SAFE_RELEASE(mSpeakerVolumeSlider);
    CC_SAFE_RELEASE(mSpeakerVolumeValueLabel);
    
}

bool SettingsPopupLayer::init()
{
    if(!Layer::init()){
        return false;
    }
    this->setContentSize(Size::ZERO);
    
    Menu* menu = Menu::create();
    menu->setPosition(Point::ZERO);
    setMenuButton(menu);
    
    auto listener = cocos2d::EventListenerTouchOneByOne::create();
    listener->setSwallowTouches(true);
    listener->onTouchBegan = [] (cocos2d::Touch*, cocos2d::Event*) { return true; };
    listener->onTouchEnded = [=](cocos2d::Touch* touch, cocos2d::Event* event)
    {
        // adding this and doing nothing to ensure the touch is consumed and therefore not passed through
    };
    this->getEventDispatcher()->addEventListenerWithSceneGraphPriority(listener, this);
    
    return true;
}

SettingsPopupLayer* SettingsPopupLayer::create(const char *backgroundImage)
{
    SettingsPopupLayer* ml = SettingsPopupLayer::create();
    ml->setSpriteBackground(Sprite::create(backgroundImage));
    ml->setSprite9Background(ui::Scale9Sprite::create(backgroundImage));
    return ml;
}

void SettingsPopupLayer::setCallbackFunc(cocos2d::Ref *target, SEL_CallFuncN callfun)
{
    m_callbackListener = target;
    m_callback = callfun;
}

bool SettingsPopupLayer::addButton(const char *normalImage, const char *selectedImage, const char *title, int tag)
{
    Size winSize = Director::getInstance()->getWinSize();
    Vec2 pCenter = Vec2(winSize.width / 2, winSize.height / 2);

    MenuItemImage* menuImage = MenuItemImage::create(normalImage, selectedImage, this, menu_selector(SettingsPopupLayer::buttonCallback));
    menuImage->setTag(tag);
    menuImage->setPosition(pCenter);

    Size imenu = menuImage->getContentSize();
    Label* ttf = Label::create(title, "", 12);
    ttf->setColor(Color3B(0, 0, 0));
    ttf->setPosition(Vec2(imenu.width / 2, imenu.height / 2));
    menuImage->addChild(ttf);
    menuImage->setScale(0.5);
    getMenuButton()->addChild(menuImage);
    return true;
}

void SettingsPopupLayer::buttonCallback(cocos2d::Ref *sender)
{
    Node* node = dynamic_cast<Node*>(sender);
    CCLOG("touch tag: %d", node->getTag());
    if (m_callback && m_callbackListener) {
        (m_callbackListener->*m_callback)(node);
    }
    this->removeFromParent();
}

void SettingsPopupLayer::onVoiceVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getVoiceVolumeValueLabel();
    int valueInt = (int) slider->getValue();
    ostringstream oss;
    oss << valueInt;
    string volume = oss.str();
    label->setString(oss.str());
    CCLOG("onVoiceVolumeChanged %s", volume.c_str());

    SceneMgr::getInstance()->config.mVoiceVolume = valueInt;

    if (onVolumeChanged) {
        onVolumeChanged(VolumeType::VOICE_VOLUME, (float) valueInt);
    }
}

void SettingsPopupLayer::onBGMVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getBGMVolumeValueLabel();
    int valueInt = (int) slider->getValue();
    ostringstream oss;
    oss << valueInt;
    string volume = oss.str();
    label->setString(oss.str());
    CCLOG("onBGMVolumeChanged %s", volume.c_str());

    SceneMgr::getInstance()->config.mMixingVolume = valueInt;

    if (onVolumeChanged) {
        onVolumeChanged(VolumeType::BGM_VOLUME, (float) valueInt);
    }
}

void SettingsPopupLayer::onAudioEffectVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getAudioEffectVolumeValueLabel();
    int valueInt = (int) slider->getValue();
    ostringstream oss;
    oss << valueInt;
    string volume = oss.str();
    label->setString(oss.str());
    CCLOG("onAudioEffectVolumeChanged %s", volume.c_str());

    SceneMgr::getInstance()->config.mEffectVolume = valueInt;

    if (onVolumeChanged) {
        onVolumeChanged(VolumeType::EFFECT_VOLUME, (float) valueInt);
    }
}

void SettingsPopupLayer::onMixingBGMChanged(Ref* sender, Control::EventType evtType)
{
    ControlSwitch* slider = (ControlSwitch*) sender;

    bool useMixing = slider->isOn();

    bool orignalUseMixing = SceneMgr::getInstance()->config.useMixing;
    if (orignalUseMixing == useMixing) {
        return;
    }

    SceneMgr::getInstance()->config.useMixing = useMixing;

    if (onUseMixing) {
        onUseMixing(useMixing);
    }
}

void SettingsPopupLayer::onEnableSpeakerChanged(Ref* sender, Control::EventType evtType)
{
    ControlSwitch* slider = (ControlSwitch*) sender;
    
    bool bEnable = slider->isOn();
    
    bool bVal = SceneMgr::getInstance()->config.enbleSpeaker;
    if (bVal == bEnable) {
        return;
    }
    
    SceneMgr::getInstance()->config.enbleSpeaker = bEnable;
    
    if (onEnableSpeaker) {
        onEnableSpeaker(bEnable);
    }
}

void SettingsPopupLayer::onLocalPitchChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getLocalPitchValueLabel();
    float valueFloat = slider->getValue();
    ostringstream oss;
    oss.precision(2);
    oss << std::fixed << valueFloat;
    string pitch = oss.str();
    label->setString(oss.str());
    CCLOG("onLocalPitchChanged %s", pitch.c_str());

    SceneMgr::getInstance()->config.mLocalPitch = valueFloat;

    if (onPitchChanged) {
        onPitchChanged(valueFloat);
    }
}

void SettingsPopupLayer::onRecordVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getRecordVolumeValueLabel();
    int value = slider->getValue();
    ostringstream oss;
    oss << std::fixed << value;
    string sVal = oss.str();
    label->setString(oss.str());
    CCLOG("onRecordVolumeChanged : %s", sVal.c_str());

    SceneMgr::getInstance()->config.mRecordVolume = value;

    if (onRecordVolume) {
        onRecordVolume(value);
    }
}

void SettingsPopupLayer::onPlayBackVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getPlayBackVolumeValueLabel();
    int value = slider->getValue();
    ostringstream oss;
    oss << std::fixed << value;
    string sVal = oss.str();
    label->setString(oss.str());
    CCLOG("onPlayBackVolumeChanged : %s", sVal.c_str());
    
    SceneMgr::getInstance()->config.mPlayBackVolume = value;
    
    if (onPlayBackVolume) {
        onPlayBackVolume(value);
    }
}


void SettingsPopupLayer::onSpeakerVolumeChanged(Ref* sender, Control::EventType evtType)
{
    ControlSlider* slider = (ControlSlider*) sender;
    Label* label = getSpeakerVolumeValueLabel();
    int value = slider->getValue();
    ostringstream oss;
    oss << std::fixed << value;
    string sVal = oss.str();
    label->setString(oss.str());
    CCLOG("onSpeakerVolumeChanged : %s", sVal.c_str());
    
    SceneMgr::getInstance()->config.mSpeakerPhoneVolume = value;
    
    if (onSpeakerVolume) {
        onSpeakerVolume(value);
    }
}




void SettingsPopupLayer::onEnter()
{
    Layer::onEnter();
    
    Size winSize = Director::getInstance()->getWinSize();
    Vec2 pCenter = Vec2(winSize.width / 2, winSize.height / 2);
    
    Size contentSize;
    if (getContentSize().equals(Size::ZERO)) {
        getSpriteBackground()->setPosition(Vec2(winSize.width / 2, winSize.height / 2));
        this->addChild(getSpriteBackground(), 0, 0);
        contentSize = getSpriteBackground()->getTexture()->getContentSize();
    } else {
        ui::Scale9Sprite *background = getSprite9Background();
        background->setContentSize(getContentSize());
        background->setPosition(Vec2(winSize.width / 2, winSize.height / 2));
        this->addChild(background, 0, 0);
        contentSize = getContentSize();
    }
    
    this->addChild(getMenuButton());
    float btnWidth = contentSize.width / (getMenuButton()->getChildrenCount() + 1);
    
    Vector<Node*> vecArray = getMenuButton()->getChildren();
    
    int i = 0;
    for (auto& e : vecArray) {
        Node* node = dynamic_cast<Node*>(e);
        node->setPosition(Point(winSize.width / 2 - contentSize.width / 2 + btnWidth * (i + 1), winSize.height / 2 - contentSize.height / 3));
        i++;
    }

    if (getLocalPitchControlSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setLocalPitchControlSlider(slider);

        Label* label = Label::create();
        label->setString("Pitch");
        setLocalPitchLabel(label);

        Label* labelPitchValue = Label::create();
        setLocalPitchValueLabel(labelPitchValue);
    }

    ControlSlider* pitchSlider = getLocalPitchControlSlider();
    double height = winSize.height / 2 + 100;
    pitchSlider->setPosition(Vec2(winSize.width / 2, height));
    pitchSlider->setMinimumValue(0.5);
    pitchSlider->setMaximumValue(2);
    pitchSlider->setValue(SceneMgr::getInstance()->config.mLocalPitch);
    this->addChild(pitchSlider);

    getLocalPitchLabel()->setPosition(Vec2(winSize.width / 2 - pitchSlider->getContentSize().width, height));
    this->addChild(getLocalPitchLabel());

    getLocalPitchValueLabel()->setPosition(Vec2(winSize.width / 2 + pitchSlider->getContentSize().width, height));
    std::ostringstream oss_1;
    oss_1.precision(2);
    oss_1 << std::fixed << SceneMgr::getInstance()->config.mLocalPitch;
    getLocalPitchValueLabel()->setString(oss_1.str());
    this->addChild(getLocalPitchValueLabel());

    pitchSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onLocalPitchChanged), Control::EventType::VALUE_CHANGED);

    if (getVoiceVolumeControlSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setVoiceVolumeControlSlider(slider);

        Label* label = Label::create();
        label->setString("Voice");
        setVoiceLabel(label);

        Label* labelVolumeValue = Label::create();
        setVoiceVolumeValueLabel(labelVolumeValue);
    }

    ControlSlider* voiceVSlider = getVoiceVolumeControlSlider();
    voiceVSlider->setPosition(Vec2(winSize.width / 2, height - 20));
    voiceVSlider->setMinimumValue(0);
    voiceVSlider->setMaximumValue(100);
    voiceVSlider->setValue(SceneMgr::getInstance()->config.mVoiceVolume);
    this->addChild(voiceVSlider);

    getVoiceLabel()->setPosition(Vec2(winSize.width / 2 - voiceVSlider->getContentSize().width, height - 20));
    this->addChild(getVoiceLabel());

    getVoiceVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + voiceVSlider->getContentSize().width, height - 20));
    std::ostringstream oss0;
    oss0 << SceneMgr::getInstance()->config.mVoiceVolume;
    getVoiceVolumeValueLabel()->setString(oss0.str());
    this->addChild(getVoiceVolumeValueLabel());

    voiceVSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onVoiceVolumeChanged), Control::EventType::VALUE_CHANGED);

    if (getBGMVolumeControlSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setBGMVolumeControlSlider(slider);
        
        Label* label = Label::create();
        label->setString("BGM");
        setBGMLabel(label);
        
        Label* labelVolumeValue = Label::create();
        setBGMVolumeValueLabel(labelVolumeValue);
    }

    ControlSlider* bgmVSlider = getBGMVolumeControlSlider();
    bgmVSlider->setPosition(Vec2(winSize.width / 2, height - 40));
    bgmVSlider->setMinimumValue(0);
    bgmVSlider->setMaximumValue(100);
    bgmVSlider->setValue(SceneMgr::getInstance()->config.mMixingVolume);
    this->addChild(bgmVSlider);
    
    getBGMLabel()->setPosition(Vec2(winSize.width / 2 - bgmVSlider->getContentSize().width, height - 40));
    this->addChild(getBGMLabel());

    getBGMVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + bgmVSlider->getContentSize().width, height - 40));
    std::ostringstream oss;
    oss << SceneMgr::getInstance()->config.mMixingVolume;
    getBGMVolumeValueLabel()->setString(oss.str());
    this->addChild(getBGMVolumeValueLabel());

    bgmVSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onBGMVolumeChanged), Control::EventType::VALUE_CHANGED);

    if (getAudioEffectVolumeControlSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setAudioEffectVolumeControlSlider(slider);
        
        Label* label = Label::create();
        label->setString("Effect");
        setAudioEffectLabel(label);
        
        Label* labelVolumeValue = Label::create();
        setAudioEffectVolumeValueLabel(labelVolumeValue);
    }

    ControlSlider* aeVSlider = getAudioEffectVolumeControlSlider();
    aeVSlider->setPosition(Vec2(winSize.width / 2, height - 60));
    aeVSlider->setMinimumValue(0);
    aeVSlider->setMaximumValue(100);
    aeVSlider->setValue(SceneMgr::getInstance()->config.mEffectVolume);
    this->addChild(aeVSlider);

    getAudioEffectLabel()->setPosition(Vec2(winSize.width / 2 - aeVSlider->getContentSize().width, height - 60));
    this->addChild(getAudioEffectLabel());

    getAudioEffectVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + aeVSlider->getContentSize().width, height - 60));
    std::ostringstream oss_2;
    oss_2 << SceneMgr::getInstance()->config.mEffectVolume;
    getAudioEffectVolumeValueLabel()->setString(oss_2.str());
    this->addChild(getAudioEffectVolumeValueLabel());

    aeVSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onAudioEffectVolumeChanged), Control::EventType::VALUE_CHANGED);

    Label* useMixingLabel = Label::create();
    useMixingLabel->setString("Mixing(Agora)");
    useMixingLabel->setPosition(Vec2(winSize.width / 2 - aeVSlider->getContentSize().width, height - 80));
    this->addChild(useMixingLabel);

    auto mixingSwitch = ControlSwitch::create(
                                                           Sprite::create("switch-mask-hd.png"),
                                                           Sprite::create("switch-on-hd.png"),
                                                           Sprite::create("switch-off-hd.png"),
                                                           Sprite::create("switch-thumb-hd.png"),
                                                           Label::create("On", "Arial-BoldMT", 12),
                                                           Label::create("Off", "Arial-BoldMT", 12)
                                                           );

    mixingSwitch->setPosition(Vec2(winSize.width / 2, height - 80));
    this->addChild(mixingSwitch);

    mixingSwitch->setOn(SceneMgr::getInstance()->config.useMixing);

    mixingSwitch->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onMixingBGMChanged), Control::EventType::VALUE_CHANGED);
    
    //Add AdjustRecordingSignalVolume ui
    if (getRecordVolumeSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setRecordVolumeSlider(slider);
        
        Label* label = Label::create();
        label->setString("RecordVolume");
        setRecordVolumeLabel(label);
        
        Label* labelVolumeValue = Label::create();
        setRecordVolumeValueLabel(labelVolumeValue);
    }
    ControlSlider* recordVolumeSlider = getRecordVolumeSlider();
    recordVolumeSlider->setPosition(Vec2(winSize.width / 2, height - 100));
    recordVolumeSlider->setMinimumValue(0);
    recordVolumeSlider->setMaximumValue(400);
    recordVolumeSlider->setValue(SceneMgr::getInstance()->config.mRecordVolume);
    recordVolumeSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onRecordVolumeChanged), Control::EventType::VALUE_CHANGED);
    this->addChild(recordVolumeSlider);
    
    getRecordVolumeLabel()->setPosition(Vec2(winSize.width / 2 - recordVolumeSlider->getContentSize().width, height - 100));
    this->addChild(getRecordVolumeLabel());
    
    getRecordVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + recordVolumeSlider->getContentSize().width, height - 100));
    std::ostringstream oss1;
    oss1 << SceneMgr::getInstance()->config.mRecordVolume;
    getRecordVolumeValueLabel()->setString(oss1.str());
    this->addChild(getRecordVolumeValueLabel());
 
    //Add AdjustPlaybackSignalVolume ui
    if ( getPlayBackVolumeSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setPlayBackVolumeSlider(slider);
        
        Label* label = Label::create();
        label->setString("PlayBackVolume");
        setPlayBackVolumeLabel(label);
        
        Label* labelVolumeValue = Label::create();
        setPlayBackVolumeValueLabel(labelVolumeValue);
    }
    ControlSlider* playBackVolumeSlider = getPlayBackVolumeSlider();
    playBackVolumeSlider->setPosition(Vec2(winSize.width / 2, height - 120));
    playBackVolumeSlider->setMinimumValue(0);
    playBackVolumeSlider->setMaximumValue(400);
    playBackVolumeSlider->setValue(SceneMgr::getInstance()->config.mPlayBackVolume);
    playBackVolumeSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onPlayBackVolumeChanged), Control::EventType::VALUE_CHANGED);
    this->addChild(playBackVolumeSlider);
    
    getPlayBackVolumeLabel()->setPosition(Vec2(winSize.width / 2 - playBackVolumeSlider->getContentSize().width, height - 120));
    this->addChild(getPlayBackVolumeLabel());
    
    getPlayBackVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + playBackVolumeSlider->getContentSize().width, height - 120));
    std::ostringstream oss2;
    oss2 << SceneMgr::getInstance()->config.mPlayBackVolume;
    getPlayBackVolumeValueLabel()->setString(oss2.str());
    this->addChild(getPlayBackVolumeValueLabel());
    
#if 0 // No SetSpeakerphoneVolume on Android & iOS
    //Add SetSpeakerphoneVolume ui
    if ( getSpeakerVolumeSlider() == nullptr) {
        ControlSlider* slider = ControlSlider::create("sliderTrack.png", "sliderProgress.png", "sliderThumb.png");
        slider->setEnabled(isSetAble);
        setSpeakerVolumeSlider(slider);
        
        Label* label = Label::create();
        label->setString("SpeakerVolume");
        setSpeakerVolumeLabel(label);
        
        Label* labelVolumeValue = Label::create();
        setSpeakerVolumeValueLabel(labelVolumeValue);
    }
    ControlSlider* speakerVolumeSlider = getSpeakerVolumeSlider();
    speakerVolumeSlider->setPosition(Vec2(winSize.width / 2, height - 140));
    speakerVolumeSlider->setMinimumValue(0);
    speakerVolumeSlider->setMaximumValue(255);
    speakerVolumeSlider->setValue(SceneMgr::getInstance()->config.mSpeakerPhoneVolume);
    speakerVolumeSlider->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onSpeakerVolumeChanged), Control::EventType::VALUE_CHANGED);
    this->addChild(speakerVolumeSlider);
    
    getSpeakerVolumeLabel()->setPosition(Vec2(winSize.width / 2 - playBackVolumeSlider->getContentSize().width, height - 140));
    this->addChild(getSpeakerVolumeLabel());
    
    getSpeakerVolumeValueLabel()->setPosition(Vec2(winSize.width / 2 + playBackVolumeSlider->getContentSize().width, height - 140));
    std::ostringstream oss3;
    oss3 << SceneMgr::getInstance()->config.mSpeakerPhoneVolume;
    getSpeakerVolumeValueLabel()->setString(oss3.str());
    this->addChild(getSpeakerVolumeValueLabel());
#endif
    
    auto enableSpeakerSwitch = ControlSwitch::create(
                                              Sprite::create("switch-mask-hd.png"),
                                              Sprite::create("switch-on-hd.png"),
                                              Sprite::create("switch-off-hd.png"),
                                              Sprite::create("switch-thumb-hd.png"),
                                              Label::create("On", "Arial-BoldMT", 12),
                                              Label::create("Off", "Arial-BoldMT", 12)
                                              );
    enableSpeakerSwitch->setPosition(Vec2(winSize.width / 2, height - 140));
    this->addChild(enableSpeakerSwitch);
    enableSpeakerSwitch->setOn(SceneMgr::getInstance()->config.enbleSpeaker);
    enableSpeakerSwitch->addTargetWithActionForControlEvents(this, cccontrol_selector(SettingsPopupLayer::onEnableSpeakerChanged), Control::EventType::VALUE_CHANGED);
    enableSpeakerSwitch->setEnabled(isSetAble);
    
    Label* enableSpeakerLabel = Label::create();
    enableSpeakerLabel->setString("EnableSpeaker");
    enableSpeakerLabel->setPosition(Vec2(winSize.width / 2 - aeVSlider->getContentSize().width, height - 140));
    this->addChild(enableSpeakerLabel);
    
    Action* popupLayer = Sequence::create(ScaleTo::create(0.0, 0.6),
                                          ScaleTo::create(0.06, 0.85),
                                          ScaleTo::create(0.08, 1.15),
                                          ScaleTo::create(0.10, 1.0), nullptr);
    this->runAction(popupLayer);
}

void SettingsPopupLayer::sliderSetAble(bool val)
{
    isSetAble = val;
}

void SettingsPopupLayer::onExit()
{
    
    CCLOG("popup on exit.");
    Layer::onExit();
}
