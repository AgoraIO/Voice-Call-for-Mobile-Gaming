//
// Created by LXH on 2020/10/13.
//

#ifndef PROJ_ANDROID_STUDIO_CLASSES_AGORA_VIDEOFRAMEOBSERVER_H
#define PROJ_ANDROID_STUDIO_CLASSES_AGORA_VIDEOFRAMEOBSERVER_H

#include <map>
#include <mutex>
#include <vector>

#ifdef __APPLE__
#include <AgoraRtcKit/IAgoraRtcEngine.h>
#include <AgoraRtcKit/IAgoraMediaEngine.h>
#elif __ANDROID__
#include "IAgoraRtcEngine.h"
#include "IAgoraMediaEngine.h"
#endif

namespace agora {
namespace cocos {
class CacheVideoFrame {
public:
  void resetVideoFrame(media::IVideoFrameObserver::VideoFrame &videoFrame);

public:
  int width;
  int height;
  std::vector<uint8_t> data;
};

class VideoFrameObserver : public media::IVideoFrameObserver {
public:
  VIDEO_FRAME_TYPE getVideoFormatPreference() override;
  bool getRotationApplied() override;
  bool onCaptureVideoFrame(VideoFrame &videoFrame) override;
  bool onRenderVideoFrame(unsigned int uid, VideoFrame &videoFrame) override;

public:
  void bindTextureId(unsigned int textureId, unsigned int uid);

private:
  void cacheVideoFrame(unsigned int uid,
					   media::IVideoFrameObserver::VideoFrame &videoFrame);
  static void renderTexture(unsigned int textureId,
							const CacheVideoFrame &frame);

private:
  std::mutex _mutex;
  std::map<unsigned int, CacheVideoFrame> _map;
};
} // namespace cocos
} // namespace agora

#endif // PROJ_ANDROID_STUDIO_CLASSES_AGORA_VIDEOFRAMEOBSERVER_H
