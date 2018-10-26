//
//  VoicePopupLayer.cpp
//  app-mobile
//


#include "VoicePopupLayer.hpp"

#include "../SceneMgr.h"

VoicePopupLayer::VoicePopupLayer():
isSetAble(false)
,m__pMenu(nullptr)
, m_callbackListener(nullptr)
, m_callback(nullptr)
, m__sfBackGround(nullptr)
, m__s9BackGround(nullptr)

{
}

VoicePopupLayer::~VoicePopupLayer()
{
    CC_SAFE_RELEASE(m__pMenu);
    CC_SAFE_RELEASE(m__sfBackGround);
    CC_SAFE_RELEASE(m__s9BackGround);
}

bool VoicePopupLayer::init()
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

VoicePopupLayer* VoicePopupLayer::create(const char *backgroundImage)
{
    VoicePopupLayer* ml = VoicePopupLayer::create();
    ml->setSpriteBackground(Sprite::create(backgroundImage));
    ml->setSprite9Background(ui::Scale9Sprite::create(backgroundImage));
    return ml;
}

void VoicePopupLayer::setCallbackFunc(cocos2d::Ref *target, SEL_CallFuncN callfun)
{
    m_callbackListener = target;
    m_callback = callfun;
}

bool VoicePopupLayer::addButton(const char *normalImage, const char *selectedImage, const char *title, int tag)
{
    Size winSize = Director::getInstance()->getWinSize();
    Vec2 pCenter = Vec2(winSize.width / 2, winSize.height / 2);
    
    MenuItemImage* menuImage = MenuItemImage::create(normalImage, selectedImage, this, menu_selector(VoicePopupLayer::buttonCallback));
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

void VoicePopupLayer::buttonCallback(cocos2d::Ref *sender)
{
    Node* node = dynamic_cast<Node*>(sender);
    CCLOG("touch tag: %d", node->getTag());
    if (m_callback && m_callbackListener) {
        (m_callbackListener->*m_callback)(node);
    }
    this->removeFromParent();
}

void VoicePopupLayer::onMuteAllRemoteChanged(Ref* sender, Control::EventType evtType)
{
    ControlSwitch* slider = (ControlSwitch*) sender;
    
    bool bMuteAll = slider->isOn();
    
    bool orignalMuteAll = SceneMgr::getInstance()->config.muteAllRemote;
    if (orignalMuteAll == bMuteAll) {
        return;
    }
    
    SceneMgr::getInstance()->config.muteAllRemote = bMuteAll;
    
    if (onMuteAllRemote) {
        onMuteAllRemote(bMuteAll);
    }
}

void VoicePopupLayer::onMuteLocalChanged(Ref* sender, Control::EventType evtT)
{
    ControlSwitch* slider = (ControlSwitch*) sender;
    
    bool bEnable = slider->isOn();
    
    bool bVal = SceneMgr::getInstance()->config.muteLcoal;
    if (bVal == bEnable) {
        return;
    }
    
    SceneMgr::getInstance()->config.muteLcoal = bEnable;
    
    if (onMuteLocal) {
        onMuteLocal(bEnable);
    }
}

void VoicePopupLayer::onAudioToggleChanged(Ref* sender, Control::EventType evtType)
{
    ControlSwitch* slider = (ControlSwitch*) sender;
    
    bool bEnable = slider->isOn();
    
    bool bVal = SceneMgr::getInstance()->config.auidoToggle;
    if (bVal == bEnable) {
        return;
    }
    
    SceneMgr::getInstance()->config.auidoToggle = bEnable;
    
    if (onAudioToggle) {
        onAudioToggle(bEnable);
    }
}

void VoicePopupLayer::onEnter()
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
    
    double height = winSize.height / 2 + 70;
    
    auto muteAllRemoteSwitch = ControlSwitch::create(
                                              Sprite::create("switch-mask-hd.png"),
                                              Sprite::create("switch-on-hd.png"),
                                              Sprite::create("switch-off-hd.png"),
                                              Sprite::create("switch-thumb-hd.png"),
                                              Label::create("True", "fonts/Arial-BoldMT", 8),
                                              Label::create("False", "fonts/Arial-BoldMT", 8)
                                              );
    muteAllRemoteSwitch->setPosition(Vec2(winSize.width / 2 + muteAllRemoteSwitch->getContentSize().width, height));
    this->addChild(muteAllRemoteSwitch);
    muteAllRemoteSwitch->setOn(SceneMgr::getInstance()->config.muteAllRemote);
    muteAllRemoteSwitch->addTargetWithActionForControlEvents(this, cccontrol_selector(VoicePopupLayer::onMuteAllRemoteChanged), Control::EventType::VALUE_CHANGED);
    muteAllRemoteSwitch->setEnabled(isSetAble);
    
    Label*  muteAllRemoteLabel = Label::create();
    muteAllRemoteLabel->setString("MuteAllRemote");
    muteAllRemoteLabel->setPosition(Vec2(winSize.width / 2 - muteAllRemoteSwitch->getContentSize().width, height));
    this->addChild(muteAllRemoteLabel);
    
    auto muteLocalSwitch = ControlSwitch::create(
                                                     Sprite::create("switch-mask-hd.png"),
                                                     Sprite::create("switch-on-hd.png"),
                                                     Sprite::create("switch-off-hd.png"),
                                                     Sprite::create("switch-thumb-hd.png"),
                                                     Label::create("True", "fonts/Arial-BoldMT", 8),
                                                     Label::create("False", "fonts/Arial-BoldMT", 8)
                                                     );
    muteLocalSwitch->setPosition(Vec2(winSize.width / 2 + muteLocalSwitch->getContentSize().width, height - 20));
    this->addChild(muteLocalSwitch);
    muteLocalSwitch->setOn(SceneMgr::getInstance()->config.muteAllRemote);
    muteLocalSwitch->addTargetWithActionForControlEvents(this, cccontrol_selector(VoicePopupLayer::onMuteLocalChanged), Control::EventType::VALUE_CHANGED);
    muteLocalSwitch->setEnabled(isSetAble);
    
    Label*  muteLocalLabel = Label::create();
    muteLocalLabel->setString("MuteLocal");
    muteLocalLabel->setPosition(Vec2(winSize.width / 2 - muteLocalSwitch->getContentSize().width, height - 20));
    this->addChild(muteLocalLabel);
    
    auto audioToggle = ControlSwitch::create(
                                                     Sprite::create("switch-mask-hd.png"),
                                                     Sprite::create("switch-on-hd.png"),
                                                     Sprite::create("switch-off-hd.png"),
                                                     Sprite::create("switch-thumb-hd.png"),
                                                     Label::create("On", "fonts/Arial-BoldMT", 10),
                                                     Label::create("Off", "fonts/Arial-BoldMT", 10)
                                                     );
    audioToggle->setPosition(Vec2(winSize.width / 2 + audioToggle->getContentSize().width, height - 40));
    this->addChild(audioToggle);
    audioToggle->setOn(SceneMgr::getInstance()->config.auidoToggle);
    audioToggle->addTargetWithActionForControlEvents(this, cccontrol_selector(VoicePopupLayer::onAudioToggleChanged), Control::EventType::VALUE_CHANGED);
    audioToggle->setEnabled(isSetAble);
    
    Label*  audioToggleLabel = Label::create();
    audioToggleLabel->setString("AudioEngine");
    audioToggleLabel->setPosition(Vec2(winSize.width / 2 - audioToggle->getContentSize().width, height - 40));
    this->addChild(audioToggleLabel);
    

    Action* popupLayer = Sequence::create(ScaleTo::create(0.0, 0.6),
                                          ScaleTo::create(0.06, 0.85),
                                          ScaleTo::create(0.08, 1.15),
                                          ScaleTo::create(0.10, 1.0), nullptr);
    this->runAction(popupLayer);
}

void VoicePopupLayer::sliderSetAble(bool val)
{
    isSetAble = val;
}

void VoicePopupLayer::onExit()
{
    
    CCLOG("popup on exit.");
    Layer::onExit();
}
