#include "TextBox.h"

TextBox* TextBox::create(const std::string& bg)
{
    TextBox *sprite = new (std::nothrow) TextBox();
    if (sprite && sprite->initWithBackgroundImg(bg))
    {
        sprite->autorelease();
        return sprite;
    }
    CC_SAFE_DELETE(sprite);
    return nullptr;
}

void TextBox::setSize(const float width, const float height)
{
    this->setScale(width / this->getContentSize().width, height / this->getContentSize().height);
}

bool TextBox::initWithBackgroundImg(const std::string bg)
{
    bool ret;
    ret = initWithFile(bg);
    do {
#if defined(__APPLE__) || defined(__ANDROID__)
        txt_ = cocos2d::Label::createWithTTF("Hello, Welcome to Agora", "fonts/arial.ttf", 10, cocos2d::Size(getContentSize().width - 40, getContentSize().height - 40));
#else
        txt_ = cocos2d::Label::createWithTTF("Hello, Welcome to Agora", "fonts/arial.ttf", 50, cocos2d::Size(getContentSize().width - 40, getContentSize().height - 40));
#endif
		txt_->setLineBreakWithoutSpace(true);
        if (nullptr == txt_) {
            ret = false;
            break;
        }
        this->addChild(txt_, 1);
        this->setAnchorPoint(cocos2d::Vec2(0, 0));
        txt_->setAnchorPoint(cocos2d::Vec2(0, 1));
        txt_->setPosition(cocos2d::Vec2(30, getContentSize().height - 20));
    } while (0);
    return ret;
}

TextBox::TextBox()
{
}

bool TextBox::setText(const std::string &txt)
{
    if (!txt_) {
        CCLOG("[ERROR]:txt_ is nullptr");
        return false;
    }
    txt_->setString(txt);
    return true;
}

bool TextBox::addText(const std::string &txt)
{
    std::string __txt = txt_->getString();
    txt_->setString(__txt + "\n" + txt);
    return true;
}
