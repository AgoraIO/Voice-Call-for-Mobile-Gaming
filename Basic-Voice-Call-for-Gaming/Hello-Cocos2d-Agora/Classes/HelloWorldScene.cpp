/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "HelloWorldScene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

class MyIGamingRtcEngineEventHandler : public agora::rtc::IRtcEngineEventHandler {
private:
  HelloWorld *mUi;

public:
  explicit MyIGamingRtcEngineEventHandler(HelloWorld *ui) : mUi(ui) {}

  void onJoinChannelSuccess(const char *channel, uid_t uid, int elapsed) override {
	CCLOG("[General C++]:onJoinChannelSuccess %s, %d, %d", channel, uid, elapsed);
	std::stringstream rawMsg;
	rawMsg << "onJoinChannelSuccess " << channel << " " << uid << " " << elapsed;
	mUi->updateMsgContent(rawMsg.str());
  }

  void onLeaveChannel(const agora::rtc::RtcStats &stats) override {
	CCLOG("[General C++]:onLeaveChannel %d, %d, %d", stats.duration, stats.txBytes, stats.rxBytes);
	std::stringstream rawMsg;
	rawMsg << "onLeaveChannel " << stats.duration << " " << stats.txBytes << " " << stats.rxBytes;
	mUi->updateMsgContent(rawMsg.str());
  }

  void onAudioRouteChanged(agora::rtc::AUDIO_ROUTE_TYPE routing) override {
	CCLOG("[General C++]:onAudioRouteChanged %d", routing);
  }
};

Scene *HelloWorld::createScene() {
  return HelloWorld::create();
}

// Print useful error message instead of segfaulting when files are not there.
static void problemLoading(const char *filename) {
  printf("Error while loading: %s\n", filename);
  printf(
	  "Depending on how you compiled you might have to add 'Resources/' in front of filenames in HelloWorldScene.cpp\n");
}

// on "init" you need to initialize your instance
bool HelloWorld::init() {
  //////////////////////////////
  // 1. super init first
  if (!Scene::init()) {
	return false;
  }

  scheduleUpdate();

  auto visibleSize = Director::getInstance()->getVisibleSize();
  Vec2 origin = Director::getInstance()->getVisibleOrigin();

  /////////////////////////////
  // 2. add a menu item with "X" image, which is clicked to quit the program
  //    you may modify it.

  // add a "close" icon to exit the progress. it's an autorelease object
  auto closeItem = MenuItemImage::create(
	  "CloseNormal.png",
	  "CloseSelected.png",
	  CC_CALLBACK_1(HelloWorld::menuCloseCallback, this));

  if (closeItem==nullptr ||
	  closeItem->getContentSize().width <= 0 ||
	  closeItem->getContentSize().height <= 0) {
	problemLoading("'CloseNormal.png' and 'CloseSelected.png'");
  } else {
	float x = origin.x + visibleSize.width - closeItem->getContentSize().width;
	float y = origin.y + closeItem->getContentSize().height;
	closeItem->setPosition(Vec2(x, y));
  }

  // create menu, it's an autorelease object
  auto menu = Menu::create(closeItem, NULL);
  menu->setPosition(Vec2::ZERO);
  this->addChild(menu, 1);

  /////////////////////////////
  // 3. add your codes below...

  // create and initialize a label

  auto label = Label::createWithTTF("HelloWorld", "fonts/Marker Felt.ttf", 24);
  if (label==nullptr) {
	problemLoading("'fonts/Marker Felt.ttf'");
  } else {
	// position the label on the center of the screen
	label->setPosition(Vec2(origin.x + visibleSize.width/2,
							origin.y + visibleSize.height - label->getContentSize().height));

	// add the label as a child to this layer
	this->addChild(label, 1);
  }

  textBox = TextBox::create("TextBox.png");
  if (textBox==nullptr) {
	problemLoading("'TextBox.png'");
  } else {
	textBox->setSize(220, 160);

	textBox->setPosition(Vec2(origin.x + visibleSize.width/2,
							  origin.y
								  + (visibleSize.height - label->getContentSize().height*1.5f)/2));

	this->addChild(textBox, 0);
  }

  // add "HelloWorld" splash screen"
  auto spriteLocal = Sprite::create("HelloWorld.png");
  if (spriteLocal==nullptr) {
	problemLoading("'HelloWorld.png'");
  } else {
	// position the sprite on the center of the screen
	spriteLocal->setPosition(Vec2(textBox->getPositionX() - textBox->getContentSize().width*textBox->getScaleX()/2
									  + spriteLocal->getContentSize().width/2,
								  textBox->getPositionY() - textBox->getContentSize().height*textBox->getScaleY()/2
									  + spriteLocal->getContentSize().height/2));

	// add the sprite as a child to this layer
	this->addChild(spriteLocal, 0);

	textureLocal = new cocos2d::Texture2D;
	auto frame = new cocos2d::SpriteFrame;
	frame->initWithTexture(textureLocal, spriteLocal->getTextureRect());
	textureLocal->initWithData(nullptr,
							   1,
							   Texture2D::PixelFormat::RGBA4444,
							   (int)frame->getRectInPixels().size.width,
							   (int)frame->getRectInPixels().size.height,
							   spriteLocal->getContentSize());
	spriteLocal->setSpriteFrame(frame);
  }

  auto spriteRemote = Sprite::create("HelloWorld.png");
  if (spriteRemote==nullptr) {
	problemLoading("'HelloWorld.png'");
  } else {
	// position the sprite on the center of the screen
	spriteRemote->setPosition(Vec2(textBox->getPositionX() + textBox->getContentSize().width*textBox->getScaleX()/2
									   - spriteRemote->getContentSize().width/2,
								   textBox->getPositionY() - textBox->getContentSize().height*textBox->getScaleY()/2
									   + spriteRemote->getContentSize().height/2));

	// add the sprite as a child to this layer
	this->addChild(spriteRemote, 0);

	textureRemote = new cocos2d::Texture2D;
	auto frame = new cocos2d::SpriteFrame;
	frame->initWithTexture(textureRemote, spriteRemote->getTextureRect());
	textureRemote->initWithData(nullptr,
								1,
								Texture2D::PixelFormat::RGBA4444,
								(int)frame->getRectInPixels().size.width,
								(int)frame->getRectInPixels().size.height,
								spriteRemote->getContentSize());
	spriteRemote->setSpriteFrame(frame);
  }

  float leftPadding = 10;

  editBox = cocos2d::ui::EditBox::create(Size(120, 30), "TextBox.png");
  if (editBox==nullptr) {
	problemLoading("'TextBox.png'");
  } else {
	editBox->setPlaceHolder("Channel ID");

	editBox->setPosition(Vec2(origin.x + leftPadding + editBox->getContentSize().width/2,
							  origin.y + visibleSize.height
								  - editBox->getContentSize().height*1.5f));

	this->addChild(editBox, 0);
  }

  auto joinButton =
	  cocos2d::ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
  if (joinButton==nullptr) {
	problemLoading("'Button.png' and 'ButtonPressed.png'");
  } else {
	joinButton->setTitleText("Join Channel");

	joinButton->setPosition(Vec2(origin.x + leftPadding + joinButton->getContentSize().width/2,
								 origin.y + visibleSize.height
									 - 1*joinButton->getContentSize().height
									 - 2*editBox->getContentSize().height));

	joinButton->addTouchEventListener([&](cocos2d::Ref *sender, ui::Widget::TouchEventType type) {
	  switch (type) {
	  case ui::Widget::TouchEventType::BEGAN:break;
	  case ui::Widget::TouchEventType::ENDED:onJoinChannelClicked();
		break;
	  default:break;
	  }
	});

	this->addChild(joinButton, 0);
  }

  auto leaveButton = ui::Button::create("Button.png", "ButtonPressed.png", "ButtonPressed.png");
  if (leaveButton==nullptr) {
	problemLoading("'Button.png' and 'ButtonPressed.png'");
  } else {
	leaveButton->setTitleText("Leave Channel");

	leaveButton->setPosition(Vec2(origin.x + leftPadding + leaveButton->getContentSize().width/2,
								  origin.y + visibleSize.height
									  - 2*leaveButton->getContentSize().height
									  - 2*editBox->getContentSize().height));

	leaveButton->addTouchEventListener([&](cocos2d::Ref *sender, ui::Widget::TouchEventType type) {
	  switch (type) {
	  case ui::Widget::TouchEventType::BEGAN:break;
	  case ui::Widget::TouchEventType::ENDED:onLeaveChannelClicked();
		break;
	  default:break;
	  }
	});

	this->addChild(leaveButton, 0);
  }

  return true;
}

void HelloWorld::menuCloseCallback(Ref *pSender) {
  //Close the cocos2d-x game scene and quit the application
  Director::getInstance()->end();

  /*To navigate back to native iOS screen(if present) without quitting the application  ,do not use Director::getInstance()->end() as given above,instead trigger a custom event created in RootViewController.mm as below*/

  //EventCustom customEndEvent("game_scene_close_event");
  //_eventDispatcher->dispatchEvent(&customEndEvent);
}

void HelloWorld::updateMsgContent(const std::string &msg) {
  textBox->addText(msg);
}

void HelloWorld::onLeaveChannelClicked() {
  engine->leaveChannel();
}

void HelloWorld::onJoinChannelClicked() {
  if (editBox==nullptr || strlen(editBox->getText())==0) {
	return;
  }

  engine->enableVideo();
  engine->setChannelProfile(agora::rtc::CHANNEL_PROFILE_GAME);
  engine->joinChannel(nullptr, editBox->getText(), "Cocos2d", 0);
}

void HelloWorld::onEnter() {
  cocos2d::Scene::onEnter();
  eventHandler = new MyIGamingRtcEngineEventHandler(this);

  engine = createAgoraRtcEngine();
  agora::rtc::RtcEngineContext context;
  context.appId = AGORA_APP_ID;
  context.eventHandler = eventHandler;
  engine->initialize(context);

  agora::util::AutoPtr<agora::media::IMediaEngine> mediaEngine;
  mediaEngine.queryInterface(engine, agora::AGORA_IID_MEDIA_ENGINE);
  if (mediaEngine) {
	videoFrameObserver = new agora::cocos::VideoFrameObserver;
	mediaEngine->registerVideoFrameObserver(videoFrameObserver);
  }
}

void HelloWorld::onExit() {
  Node::onExit();
  agora::rtc::IRtcEngine::release(true);
  engine = nullptr;
  delete eventHandler;
  eventHandler = nullptr;
  delete videoFrameObserver;
  videoFrameObserver = nullptr;
}

void HelloWorld::update(float delta) {
  Node::update(delta);
  videoFrameObserver->bindTextureId(textureLocal->getName(), 0);
  videoFrameObserver->bindTextureId(textureRemote->getName(), 123);
}
