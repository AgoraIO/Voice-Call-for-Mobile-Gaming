//
//  IAgoraRtcEngineForGaming.cpp
//  app-mobile
//

#include <mutex>
#include <sstream>
#include <cstdlib>

#include "IAgoraRtcEngineForGaming.hpp"

static std::mutex mLock;

IRtcEngine* AgoraObject::mAgoraEngine = nullptr;
IRtcEngineEventHandler* AgoraObject::mEventHandler = nullptr;
AgoraObject* AgoraObject::mAgoraObject = nullptr;

AgoraObject::AgoraObject(void)
{
}

AgoraObject::~AgoraObject(void)
{
}

// void AgoraObject::setEventHandler(IRtcEngineEventHandler* handler)
// {
//     mLock.lock();
//     mEventHandler = handler;
//     mLock.unlock();
// }

IRtcEngine *AgoraObject::GetEngine()
{
	if(mAgoraEngine == NULL)
		mAgoraEngine = (IRtcEngine *)createAgoraRtcEngine();

	return mAgoraEngine;
}

AgoraObject *AgoraObject::GetAgoraObject(const char *appId, IRtcEngineEventHandler *evenHandler)
{
	if(mAgoraObject == NULL)
		mAgoraObject = new AgoraObject();

	if(mAgoraEngine == NULL){
		mAgoraEngine = (IRtcEngine *)createAgoraRtcEngine();
    }

	RtcEngineContext ctx;
    ctx.appId = appId;
	ctx.eventHandler = evenHandler;
    mEventHandler = evenHandler;
    
    int ret =  mAgoraEngine->initialize(ctx);

	return mAgoraObject;
}

IRtcEngineEventHandler* AgoraObject::getEventHandler(){
    return mEventHandler;
}

void AgoraObject::CloseAgoraObject()
{
	if(mAgoraEngine != NULL){
        mLock.lock();
        if(mAgoraEngine != NULL){
             mAgoraEngine->release();
        }
        if(mAgoraObject != NULL){
		    delete mAgoraObject;
        }
        mLock.unlock();
    }

	mAgoraEngine = NULL;
	mAgoraObject = NULL;
}

IRtcEngine* AGORA_CALL AgoraRtcEngineForGaming_getInstance(const char *appId)
{   
     return AgoraObject::GetEngine();
}

AgoraObject* AGORA_CALL AgoraRtcEngineForGaming_CreateAgoraObject(const char *appId, IRtcEngineEventHandler *evenHandler)
{
     return AgoraObject::GetAgoraObject(appId, evenHandler);
}
