
#ifndef __SettingsPopupLayer_h__
#define __SettingsPopupLayer_h__

#include "cocos2d.h"
#include "cocos-ext.h"

USING_NS_CC;
USING_NS_CC_EXT;
using namespace std;

class SettingsPopupLayer : public Layer {
public:
    SettingsPopupLayer();
    ~SettingsPopupLayer();
    virtual bool init();
    CREATE_FUNC(SettingsPopupLayer);

    static SettingsPopupLayer* create(const char* backgroundImage);
    void sliderSetAble(bool val);

public:

    enum VolumeType {
        VOICE_VOLUME = 1,
        BGM_VOLUME = 2,
        EFFECT_VOLUME = 3,
    };

    bool addButton(const char* normalImage, const char* selectedImage, const char* title, int tag = 0);

    void setCallbackFunc(Ref* target, SEL_CallFuncN callfun);

    virtual void onEnter();
    virtual void onExit();

    typedef std::function<void(VolumeType, float)> onVolumeChangedCallback;

    onVolumeChangedCallback onVolumeChanged = nullptr;

    typedef std::function<void(bool)> onUseMixingCallback;

    onUseMixingCallback onUseMixing = nullptr;

    typedef std::function<void(float)> onPitchChangedCallback;

    onPitchChangedCallback onPitchChanged = nullptr;

private:
    bool isSetAble;
    void buttonCallback(Ref* pSender);

    void onLocalPitchChanged(Ref* sender, Control::EventType evtT);
    void onVoiceVolumeChanged(Ref* sender, Control::EventType evtT);
    void onBGMVolumeChanged(Ref* sender, Control::EventType evtT);
    void onAudioEffectVolumeChanged(Ref* sender, Control::EventType evtT);
    void onMixingBGMChanged(Ref* sender, Control::EventType evtT);

    Ref* m_callbackListener;
    SEL_CallFuncN m_callback;

    CC_SYNTHESIZE_RETAIN(Menu*, m__pMenu, MenuButton);
    CC_SYNTHESIZE_RETAIN(Sprite*, m__sfBackGround, SpriteBackground);
    CC_SYNTHESIZE_RETAIN(ui::Scale9Sprite*, m__s9BackGround, Sprite9Background);

    CC_SYNTHESIZE_RETAIN(Label*, mLocalPitchLabel, LocalPitchLabel);
    CC_SYNTHESIZE_RETAIN(ControlSlider*, mLocalPitchControlSlider, LocalPitchControlSlider);
    CC_SYNTHESIZE_RETAIN(Label*, mLocalPitchValueLabel, LocalPitchValueLabel);

    CC_SYNTHESIZE_RETAIN(Label*, mVoiceLabel, VoiceLabel);
    CC_SYNTHESIZE_RETAIN(ControlSlider*, mVoiceVolumeControlSlider, VoiceVolumeControlSlider);
    CC_SYNTHESIZE_RETAIN(Label*, mVoiceValueLabel, VoiceVolumeValueLabel);

    CC_SYNTHESIZE_RETAIN(Label*, mBGMLabel, BGMLabel);
    CC_SYNTHESIZE_RETAIN(ControlSlider*, mBGMVolumeControlSlider, BGMVolumeControlSlider);
    CC_SYNTHESIZE_RETAIN(Label*, mBGMValueLabel, BGMVolumeValueLabel);

    CC_SYNTHESIZE_RETAIN(Label*, mAudioEffectLabel, AudioEffectLabel);
    CC_SYNTHESIZE_RETAIN(ControlSlider*, mAudioEffectVolumeControlSlider, AudioEffectVolumeControlSlider);
    CC_SYNTHESIZE_RETAIN(Label*, mAudioEffectValueLabel, AudioEffectVolumeValueLabel);
};
#endif /* __PopupLayer_h__ */
