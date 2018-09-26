
#ifndef __DropDownListBox_h__
#define __DropDownListBox_h__

#include <cocos2d.h>

USING_NS_CC;

const auto kDropDownListNormalColor4B = Color4B(128,
                                                128,
                                                128,
                                                255);

const auto kDropDownListSelectedColor4B = Color4B(200,
                                                  200,
                                                  200,
                                                  255);

const auto kDropDownListHighlightColor4B = Color4B(0,
                                                   0,
                                                   255,
                                                   255);

const auto kDropDownListNormalColor3B = Color3B(128,
                                                128,
                                                128);

const auto kDropDownListSelectedColor3B = Color3B(200,
                                                  200,
                                                  200);

const auto kDropDownListHighlightColor3B = Color3B(0,
                                                   0,
                                                   225);
const auto kColorWhite = Color3B(255,
                                 255,
                                 255);

class DropDownListBox : public Layer
{
public:
    DropDownListBox(Label *label,
                    Size show_label_size,
                    Size main_menu_cell_size);
    ~DropDownListBox();
    
    void OpenListener();
    
    static DropDownListBox * Create(Label *label,
                                    Size show_label_size,
                                    Size main_menu_cell_size);
    
    std::string GetString();
    
    int GetSelectedIndex();
    
    void SetSelectedIndex(int index);
    
    virtual bool onTouchBegan(Touch *touch,
                              Event *event);
    
    void onTouchEnded(Touch *touch,
                      Event *event);
    
    void AddLabel(Label *label);
    
    void OnSelected(Ref *sender);
    
    void OnClose();
    
    void CustomSetPosition(Node *node,
                           Point point);
    
private:
    Menu *main_menu_;
    Label *show_label_;
    std::vector<Label *> select_labels_;
    std::vector<LayerColor *> bg_layers_;
    bool is_need_show_menu_;
    int last_selected_index_;
    Size main_menu_cell_size_;
    Size show_label_size_;
    
    EventListenerTouchOneByOne *listener_touch_;
}; // class DropDownListBox : public Layer

#endif /* __DropDownListBox_h__ */
