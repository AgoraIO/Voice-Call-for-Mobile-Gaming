#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include "RtcScene.h"

#include "PopupLayer/SettingsPopupLayer.h"

USING_NS_CC;

class PeerSquareLayer;

class MainGame : public RtcScene, public RtcCallback
{
private:
    Sprite* _player;
    PeerSquareLayer* mSpeakerSquare;
    Label* mMsgLabel = nullptr;
    Label* mChannelLabel = nullptr;

    ControlSwitch* mBroadcasterAudienceSwitch;

public:
    // there's no 'id' in cpp, so we recommend returning the class instance pointer
    static cocos2d::Scene* createScene();

    // Here's a difference. Method 'init' in cocos2d-x returns bool, instead of returning 'id' in cocos2d-iphone
    bool init() override;

    void update(float delta) override;

    // a selector callback
    void menuCloseCallback(cocos2d::Ref* pSender);

    // implement the "static create()" method manually
    CREATE_FUNC(MainGame);

    void onEnter() override;

    void onExit() override;

    void popupLayer();

    void onPopupButtonCallback(Node* node);

    void onVolumeChanged(SettingsPopupLayer::VolumeType type, float volume);

    void onSpeakerReleased(uid_t uid, Vec2 loc, Vec2 myLoc);

    void onUseMixing(bool);

    void onPitchChanged(float pitch);

private:
    void onAudioEnableBtnClicked(ui::Button* btn);
    void onAudioMuteBtnClicked(ui::Button* btn);
    void onClientRoleBtnClicked(ui::Button* btn);

    void doPlayBackgroundMusic(bool useAgoraMixing);
    void doStopPlayBackgroundMusic();
    void doPlayEffect(bool useAgoraMixing);

    void doCopyAssets(const std::string &filename);

public:
    void onUserOnline(uid_t uid) override;
    void onUserOffline(uid_t uid) override;
    void onUserVolumeIndication(const agora::rtc::AudioVolumeInfo *speakers, unsigned int speakerNumber) override;
    void onAudioRouteChanged(agora::rtc::AUDIO_ROUTE_TYPE route) override;
    void onError(int error, const std::string& description) override;

public:
    void addMonster(float dt);
    bool onContactBegan(PhysicsContact &contact);
    bool onTouchBegan(Touch *touch, Event *unused_event) override;

};

#endif // __HELLOWORLD_SCENE_H__
