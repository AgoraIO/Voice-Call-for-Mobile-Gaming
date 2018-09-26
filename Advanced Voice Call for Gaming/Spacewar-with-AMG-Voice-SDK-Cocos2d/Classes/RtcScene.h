
#ifndef __RtcScene_h__
#define __RtcScene_h__

#include "cocos2d.h"

#include "../AgoraGamingSDK/include/AgoraGamingRtcHelper.h"

class RtcCallback {
public:
    virtual void onUserOnline(uid_t uid) = 0;

    virtual void onUserOffline(uid_t uid) = 0;

    virtual void onUserVolumeIndication(const agora::rtc::AudioVolumeInfo* speakers, unsigned int speakerNumber) = 0;

    virtual void onAudioRouteChanged(agora::rtc::AUDIO_ROUTE_TYPE route) = 0;

    virtual void onError(int error, const std::string& description) = 0;
};

class RtcScene : public cocos2d::Layer
{
public:
    RtcScene() = default;
    ~RtcScene() = default;

};
#endif /* __RtcScene_h__ */
