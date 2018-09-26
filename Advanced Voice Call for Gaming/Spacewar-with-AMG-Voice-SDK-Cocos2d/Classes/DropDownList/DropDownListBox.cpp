#include "DropDownListBox.h"

USING_NS_CC;

DropDownListBox::DropDownListBox(Label *label,
                                 Size show_label_size,
                                 Size main_menu_cell_size) :
show_label_(label),
is_need_show_menu_(false),
last_selected_index_(0)
{
    show_label_size_ = show_label_size;
    main_menu_cell_size_ = main_menu_cell_size;
    
    main_menu_ = Menu::create();
    
    CustomSetPosition(main_menu_,
                      Point(0,
                            0));
    main_menu_->setColor(kDropDownListNormalColor3B);
    main_menu_->retain();
    
    CustomSetPosition(show_label_,
                      Point(0,
                            0));
    show_label_->setColor(kDropDownListNormalColor3B);
    
    this->addChild(show_label_);
    
    this->setContentSize(show_label_size_);
}

DropDownListBox::~DropDownListBox() {};

void DropDownListBox::OpenListener()
{
    listener_touch_ = EventListenerTouchOneByOne::create();
    listener_touch_->onTouchBegan = CC_CALLBACK_2(DropDownListBox::onTouchBegan,
                                                  this);
    listener_touch_->onTouchEnded = CC_CALLBACK_2(DropDownListBox::onTouchEnded,
                                                  this);
    _eventDispatcher->addEventListenerWithSceneGraphPriority(listener_touch_,
                                                             this);
}

DropDownListBox *DropDownListBox::Create(Label *label,
                                         Size show_label_size,
                                         Size main_menu_cell_size)
{
    auto *list = new DropDownListBox(label,
                                     show_label_size,
                                     main_menu_cell_size);
    list->autorelease();
    return list;
}

std::string DropDownListBox::GetString()
{
    return show_label_->getString();
}

int DropDownListBox::GetSelectedIndex()
{
    return last_selected_index_;
}

void DropDownListBox::SetSelectedIndex(int index)
{
    last_selected_index_ = index;
    
    for (int i = 0, j = (int)select_labels_.size(); i < j; i++) {
        if ( last_selected_index_ == i) {
            bg_layers_[i]->setColor(kDropDownListSelectedColor3B);
            show_label_->setString(select_labels_[i]->getString());
        } else {
            bg_layers_[i]->setColor(kDropDownListNormalColor3B);
        }
    }
}

bool DropDownListBox::onTouchBegan(Touch *touch,
                                   Event *event)
{
    auto location_in_view = touch->getLocationInView();
    auto location = Director::getInstance()->convertToGL(location_in_view);
    
    if (false == is_need_show_menu_) {
        Rect show_rect;
        show_rect.origin = this->getPosition();
        show_rect.size = show_label_size_;
        
        if (show_rect.containsPoint(location)) {
            is_need_show_menu_ = true;
            return true;
        }
    } else {
        Rect list_rect;
        list_rect.origin = this->getPosition();
        list_rect.size = show_label_size_;
        
        if (!list_rect.containsPoint(location)) {
            OnClose();
        }
    }
    
    return false;
}

void DropDownListBox::onTouchEnded(cocos2d::Touch *touch,
                                   cocos2d::Event *event)
{
    if (true == is_need_show_menu_)
    {
        for (int i = 0, j = (int)select_labels_.size(); i < j; i++)
        {
            if (last_selected_index_ == i) {
                bg_layers_[i]->setColor(kDropDownListHighlightColor3B);
            } else {
                bg_layers_[i]->setColor(kDropDownListNormalColor3B);
            }
        }
        addChild(main_menu_);
    }
}

void DropDownListBox::AddLabel(Label *label)
{
    auto *normal_color = LayerColor::create(kDropDownListNormalColor4B,
                                            main_menu_cell_size_.width,
                                            main_menu_cell_size_.height);
    auto *pSelectedColor = LayerColor::create(kDropDownListSelectedColor4B,
                                              main_menu_cell_size_.width,
                                              main_menu_cell_size_.height);

    bg_layers_.push_back(normal_color);
    select_labels_.push_back(label);

    auto item = MenuItemSprite::create(normal_color,
                                       pSelectedColor,
                                       NULL,
                                       this,
                                       SEL_MenuHandler(&DropDownListBox::OnSelected));
    
    label->setPosition(Point(main_menu_cell_size_.width / 2,
                             main_menu_cell_size_.height / 2));
    item->addChild(label);
    
    item->setTag((int)select_labels_.size() - 1);
    item->setPosition(0,
                      - (int)select_labels_.size() * main_menu_cell_size_.height);
    main_menu_->addChild(item);
}

void DropDownListBox::OnSelected(Ref *sender)
{
    auto item = dynamic_cast<MenuItem *>(sender);
    
    if (item)
    {
        last_selected_index_ = item->getTag();
        show_label_->setString(select_labels_[item->getTag()]->getString());
    }
    OnClose();
}

void DropDownListBox::OnClose()
{
    removeChild(main_menu_,
                true);
    is_need_show_menu_ = false;
}

void DropDownListBox::CustomSetPosition(Node *node,
                                        Point point)
{
    node->setPosition(Point(point.x + show_label_size_.width / 2,
                            point.y + show_label_size_.height / 2));
}
