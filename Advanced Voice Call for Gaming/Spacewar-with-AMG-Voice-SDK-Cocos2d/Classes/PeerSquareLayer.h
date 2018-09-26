#ifndef __PEERSQUARE_LAYER_H__
#define __PEERSQUARE_LAYER_H__

#include <unordered_map>

#include "cocos2d.h"

USING_NS_CC;

class PeerSquareLayer : public cocos2d::LayerColor
{
public:
    bool init() override;

    bool onMyTouchBegan(Touch*touch, Event* unused_event);

    void onMyTouchMoved(Touch*touch, Event* unused_event);

    void onMyTouchEnded(Touch*touch, Event* unused_event);

    void addSpeaker(uid_t uid);

    void removeSpeaker(uid_t uid);

    void speaking(uid_t uid, unsigned short volume);

    // implement the "static create()" method manually
    CREATE_FUNC(PeerSquareLayer);

    typedef std::function<void(uid_t uid, Vec2, Vec2)> onSpeakerReleasedAtCallback;

    onSpeakerReleasedAtCallback onSpeakerReleased = nullptr;

private:
    void Drag(Point offSet, Node* target);

private:
//    DrawNode* mPeerNode;
//    Sprite* mPeerNode;
//    LayerColor* mPeerNode;

    typedef std::unordered_map<uid_t, LayerColor*> SpeakerMap;

    SpeakerMap mSpeakerMap;

    LayerColor* mTouchingSpeaker = nullptr;
};

#endif /* __PEERSQUARE_LAYER_H__ */
