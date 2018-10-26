//
//  VoicePopupLayer.hpp
//  app-mobile
//

#ifndef VoicePopupLayer_hpp
#define VoicePopupLayer_hpp

#include "cocos2d.h"
#include "cocos-ext.h"

USING_NS_CC;
USING_NS_CC_EXT;
using namespace std;

class VoicePopupLayer : public Layer {
public:
    VoicePopupLayer();
    ~VoicePopupLayer();
    virtual bool init();
    CREATE_FUNC(VoicePopupLayer);
    
    static VoicePopupLayer* create(const char* backgroundImage);
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

    typedef std::function<void(bool)> onUseMixingCallback;
    
    onUseMixingCallback onMuteAllRemote = nullptr;
    onUseMixingCallback onMuteLocal = nullptr;
    onUseMixingCallback onAudioToggle = nullptr;
    
private:
    bool isSetAble;
    void buttonCallback(Ref* pSender);

    void onMuteAllRemoteChanged(Ref* sender, Control::EventType evtT);
    void onMuteLocalChanged(Ref* sender, Control::EventType evtT);
    void onAudioToggleChanged(Ref* sender, Control::EventType evtT);
    
   
    Ref* m_callbackListener;
    SEL_CallFuncN m_callback;
    
    CC_SYNTHESIZE_RETAIN(Menu*, m__pMenu, MenuButton);
    CC_SYNTHESIZE_RETAIN(Sprite*, m__sfBackGround, SpriteBackground);
    CC_SYNTHESIZE_RETAIN(ui::Scale9Sprite*, m__s9BackGround, Sprite9Background);
    
//    CC_SYNTHESIZE_RETAIN(Label*, mLocalPitchLabel, LocalPitchLabel);
//    CC_SYNTHESIZE_RETAIN(ControlSlider*, mLocalPitchControlSlider, LocalPitchControlSlider);
//    CC_SYNTHESIZE_RETAIN(Label*, mLocalPitchValueLabel, LocalPitchValueLabel);
//        

};



#endif /* VoicePopupLayer_hpp */
