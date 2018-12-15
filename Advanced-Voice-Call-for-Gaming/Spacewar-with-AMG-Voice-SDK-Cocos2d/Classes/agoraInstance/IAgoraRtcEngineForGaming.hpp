//
//  Agora Rtc Engine SDK
//  Copyright (c) 2015 Agora IO. All rights reserved.
//
//  This C++ API provides a uniform way to access Agora
//  SDK both on Android and iOS

#ifndef AGORA_GAMING_RTC_ENGINE_H
#define AGORA_GAMING_RTC_ENGINE_H

#include <stddef.h>
#include <stdio.h>
#include <stdarg.h>

#include <string>
#include <vector>

#if defined(_WIN32)
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#define AGORA_CALL __cdecl
#if defined(AGORARTC_EXPORT)
#define AGORA_API extern "C" __declspec(dllexport)
#else
#define AGORA_API extern "C" __declspec(dllimport)
#endif
#elif defined(__APPLE__)
#define AGORA_API __attribute__((visibility("default"))) extern "C"
#define AGORA_CALL
#elif defined(__ANDROID__) || defined(__linux__) || defined(__linux)
#define AGORA_API extern "C" __attribute__((visibility("default")))
#define AGORA_CALL
#else
#define AGORA_API extern "C"
#define AGORA_CALL
#endif

#if defined(__APPLE__)
     #include <AgoraAudioKit/IAgoraRtcEngine.h>
#elif defined(__ANDROID__)
    #include "IAgoraRtcEngine.h"
    #include <android/log.h>
    #define LOG_TAG "android-debug"
    #define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG,LOG_TAG,__VA_ARGS__)
#else

#endif

using namespace agora::rtc;

class AgoraObject {
private:
    static AgoraObject  *mAgoraObject;
    static IRtcEngine *mAgoraEngine;
    static IRtcEngineEventHandler *mEventHandler;

private:
    AgoraObject();
    virtual ~AgoraObject();

public:
    static IRtcEngine *GetEngine();
    static AgoraObject *GetAgoraObject(const char *appId, IRtcEngineEventHandler *evenHandler);
    
    /**
    * set customized callback for SDK, you can set once and only after SDK intialized
    *
    * @return return void
    */
    // virtual void setEventHandler(IRtcEngineEventHandler* handler);
    static IRtcEngineEventHandler* getEventHandler();

    static void CloseAgoraObject();
};

/**
* create the engine instance and return the pointer
*/
IRtcEngine* AGORA_CALL AgoraRtcEngineForGaming_getInstance(const char *appId);

/**
* create the engine object and return the pointer
*/
AgoraObject* AGORA_CALL AgoraRtcEngineForGaming_CreateAgoraObject(const char *appId,IRtcEngineEventHandler *evenHandler);

#endif
