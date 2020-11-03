
#ifndef __My__TextBox__
#define __My__TextBox__

#include "ui/UIWidget.h"
#include "cocos2d.h"

#include <string>

class TextBox : public cocos2d::Sprite {
public:
  static TextBox *create(const std::string &bg);
  bool addText(const std::string &txt);
  bool setText(const std::string &txt);
protected:
  bool initWithBackgroundImg(const std::string &bg);

protected:
  cocos2d::Label *txt_;
};

#endif /* defined(__My__TextBox__) */
