LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := agora-rtc-sdk
LOCAL_SRC_FILES := $(LOCAL_PATH)/../../../sdk/android/agora/$(TARGET_ARCH_ABI)/libagora-rtc-sdk.so
include $(PREBUILT_SHARED_LIBRARY)

include $(CLEAR_VARS)

LOCAL_MODULE := MyGame_shared

LOCAL_MODULE_FILENAME := libMyGame

LOCAL_SRC_FILES := $(LOCAL_PATH)/hellocpp/main.cpp \
                   $(LOCAL_PATH)/../../../Classes/AppDelegate.cpp \
                   $(LOCAL_PATH)/../../../Classes/HelloWorldScene.cpp \
                   $(LOCAL_PATH)/../../../Classes/TextBox/TextBox.cpp \
                   $(LOCAL_PATH)/../../../Classes/VideoFrameObserver.cpp \

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../Classes \
					$(LOCAL_PATH)/../../../sdk/android/agora/include

# _COCOS_HEADER_ANDROID_BEGIN
# _COCOS_HEADER_ANDROID_END


LOCAL_STATIC_LIBRARIES := cc_static

LOCAL_SHARED_LIBRARIES := agora-rtc-sdk

# _COCOS_LIB_ANDROID_BEGIN
# _COCOS_LIB_ANDROID_END

include $(BUILD_SHARED_LIBRARY)

$(call import-module, cocos)

# _COCOS_LIB_IMPORT_ANDROID_BEGIN
# _COCOS_LIB_IMPORT_ANDROID_END
