
#ifndef __SceneMgr_h__
#define __SceneMgr_h__

#include "RtcScene.h"

// PLEASE KEEP THIS App ID IN SAFE PLACE -->
// Get your own App ID at https://dashboard.agora.io/
// After you entered the App ID, remove <##> outside of Your App ID
// For formal released project, please use Dynamic Key
// http://docs.agora.io/en/user_guide/Component_and_Others/Dynamic_Key_User_Guide.html
#define AGORA_APP_ID <#YOUR APP ID#>

class SceneMgr
{
public :
    static SceneMgr *getInstance();
    bool addScene(RtcScene* scene, std::string title);
    bool clear();
public:
    typedef std::pair<RtcScene*, std::string> SceneTitlePair;
    std::vector<SceneTitlePair> getScenes();

    struct RtcEngineConfig {
        agora::rtc::CHANNEL_PROFILE_TYPE cft = agora::rtc::CHANNEL_PROFILE_GAME_FREE_MODE;
        agora::rtc::CLIENT_ROLE_TYPE crt = agora::rtc::CLIENT_ROLE_TYPE::CLIENT_ROLE_BROADCASTER;

        std::string channel;

        long long ts = 0;

        bool muted = false;

        bool useMixing = true;

        float mLocalPitch = 1.0;
        unsigned short mVoiceVolume = 100;
        unsigned short mMixingVolume = 100;
        unsigned short mEffectVolume = 100;
    };

    RtcEngineConfig config;

private:
    std::vector<SceneTitlePair> _sections;
};
#endif /* __SceneMgr_h__ */
