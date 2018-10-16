#include "PeerSquareLayer.h"

USING_NS_CC;

// on "init" you need to initialize your instance
bool PeerSquareLayer::init()
{
    if (!Layer::init()) {
        return false;
    }

    if (!LayerColor::initWithColor(Color4B::BLUE, 300, 120)) // RGBA
    {
        return false;
    }

//    mPeerNode = DrawNode::create();
//    mPeerNode->setContentSize(Size(40, 40));
//    mPeerNode->drawDot(Vec2(80, 80), 20, Color4F::RED);
//    this->addChild(mPeerNode);

//    mPeerNode = Sprite::create("player.png");
//    mPeerNode->setPosition(Vec2(80, 80));
//    this->addChild(mPeerNode);

//    mPeerNode = LayerColor::create(Color4B::RED, 40, 40);
//    mPeerNode->setPosition(80, 80);
//    this->addChild(mPeerNode);

    return true;
}

bool PeerSquareLayer::onMyTouchBegan(Touch *touch, Event *unused_event)
{
    return true;
}

void PeerSquareLayer::onMyTouchMoved(Touch *touch, Event *unused_event)
{
    Point beginLoc = touch->getLocationInView();
    beginLoc = Director::getInstance()->convertToGL(beginLoc);

    Vec2 vec2 = this->convertTouchToNodeSpace(touch);

    auto target = unused_event->getCurrentTarget();

    Rect bounding = target->getBoundingBox();

    if (bounding.containsPoint(vec2))
    {
        Point endLoc = touch->getPreviousLocationInView();
        endLoc = Director::getInstance()->convertToGL(endLoc);

        Point offSet = beginLoc - endLoc;
        Drag(offSet, target);
    }
}

void PeerSquareLayer::onMyTouchEnded(Touch* touch, Event* unused_event)
{
    Point releasedLoc = touch->getLocationInView();
    uid_t uid;
    std::istringstream iss(unused_event->getCurrentTarget()->getName());
    iss >> uid;
    CCLOG("onMyTouchEnded local %f, %f", releasedLoc.x, releasedLoc.y);
    releasedLoc = Director::getInstance()->convertToGL(releasedLoc);
    CCLOG("onMyTouchEnded %f, %f", releasedLoc.x, releasedLoc.y);

    if (onSpeakerReleased) {
        onSpeakerReleased(uid, Vec2(releasedLoc.x, releasedLoc.y), Vec2(getPosition().x + getContentSize().width / 2, getPosition().y));
    }

    CCLOG("onMyTouchEnded normalized  %u, %f, %f", uid, releasedLoc.x, releasedLoc.y);
}
enum class PhysicsCategory {
    None = 0,
    Monster = (1 << 0),    // 1
    Projectile = (1 << 1), // 2
    All = PhysicsCategory::Monster | PhysicsCategory::Projectile // 3
};

void PeerSquareLayer::addSpeaker(uid_t uid)
{
    auto it = mSpeakerMap.find(uid);
    if (it != mSpeakerMap.end()) {
        return;
    }

    uint8_t r = (uid * rand() % 255);
    uint8_t g = (uid * rand() % 255);
    uint8_t b = (uid * rand() % 255);

    Color4B color(Color3B(r, g, b));
    if (Color4B::BLUE == color) {
        color = Color4B::RED;
    }

    LayerColor* speakerNode = (LayerColor*) LayerColor::create(color, 40, 40);

    int minX = speakerNode->getContentSize().width / 2;
    int maxX = getContentSize().width - speakerNode->getContentSize().width / 2;
    int rangeX = maxX - minX;
    int randomX = (rand() % rangeX) + minX;

    int minY = speakerNode->getContentSize().width / 2;
    int maxY = getContentSize().height - speakerNode->getContentSize().height / 2;
    int rangeY = maxY - minY;
    int randomY = (rand() % rangeY) + minX;

    speakerNode->setPosition(randomX, randomY);

    mSpeakerMap.insert({uid, speakerNode});

    std::ostringstream oss;
    oss << uid;
    speakerNode->setName(oss.str());

    this->addChild(speakerNode);
    

    auto speakerNodeSize = speakerNode->getContentSize();
    auto physicsBody = PhysicsBody::createCircle(speakerNodeSize.width / 2 );
    physicsBody->setDynamic(true);
    physicsBody->setCategoryBitmask((int)PhysicsCategory::Monster);
    physicsBody->setCollisionBitmask((int)PhysicsCategory::None);
    physicsBody->setContactTestBitmask((int)PhysicsCategory::Projectile);
    speakerNode->setPhysicsBody(physicsBody);
    
    auto eventListener = EventListenerTouchOneByOne::create();
    eventListener->onTouchBegan = CC_CALLBACK_2(PeerSquareLayer::onMyTouchBegan, this);
    eventListener->onTouchMoved = CC_CALLBACK_2(PeerSquareLayer::onMyTouchMoved, this);
    eventListener->onTouchEnded = CC_CALLBACK_2(PeerSquareLayer::onMyTouchEnded, this);

    this->getEventDispatcher()->addEventListenerWithSceneGraphPriority(eventListener, speakerNode);
}

void PeerSquareLayer::removeSpeaker(uid_t uid)
{
    auto it = mSpeakerMap.find(uid);
    if (it == mSpeakerMap.end()) {
        return;
    }

    auto speakerNode = it->second;

    this->getEventDispatcher()->removeEventListenersForTarget(speakerNode);

    speakerNode->removeFromParent();

    mSpeakerMap.erase(it);
}

void PeerSquareLayer::speaking(uid_t uid, unsigned short volume)
{
    if (volume <= 20) { // do not animate
        return;
    }

    auto it = mSpeakerMap.find(uid);
    if (it == mSpeakerMap.end()) {
        return;
    }

    auto speakerNode = it->second;

    speakerNode->runAction(Sequence::create(ScaleTo::create(0.0, 0.0),
                                            ScaleTo::create(0.06, 1.05),
                                            ScaleTo::create(0.08, 0.95),
                                            ScaleTo::create(0.10, 1.0), nullptr));
}

void PeerSquareLayer::Drag(Point offSet, Node* target)
{
    Point pos = target->getPosition() + offSet;
    target->setPosition(pos);
}
