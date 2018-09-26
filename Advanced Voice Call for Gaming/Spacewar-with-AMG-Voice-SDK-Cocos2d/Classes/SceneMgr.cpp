
#include "SceneMgr.h"

#include "cocos2d.h"

static SceneMgr *s_sceneMgr = nullptr;

SceneMgr* SceneMgr::getInstance()
{
    if (!s_sceneMgr) {
        s_sceneMgr = new SceneMgr();
        if (!s_sceneMgr) {
            CCLOG("No more memory to use! \n");
            return nullptr;
        }
    }
    return s_sceneMgr;
}

bool SceneMgr::addScene(RtcScene* scene, std::string title)
{
    scene->retain();
    this->_sections.push_back(make_pair(scene, title));
    return true;
}

bool SceneMgr::clear()
{
    std::vector<SceneTitlePair>::iterator iter;
    for (iter = this->_sections.begin(); iter != this->_sections.end(); iter++) {
        iter->first->release();
    }
    this->_sections.clear();
    return true;
}

std::vector<SceneMgr::SceneTitlePair> SceneMgr::getScenes()
{
    return _sections;
}


