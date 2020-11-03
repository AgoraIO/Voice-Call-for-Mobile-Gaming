//
// Created by LXH on 2020/10/13.
//

#include "VideoFrameObserver.h"

#if defined(__ANDROID__)
#include <GLES/gl.h>
#include <GLES2/gl2.h>
#include <GLES2/gl2ext.h>
#elif defined(__APPLE__)
#include <OpenGLES/ES2/gl.h>
#endif

namespace agora {
namespace cocos {
void CacheVideoFrame::resetVideoFrame(
	media::IVideoFrameObserver::VideoFrame &videoFrame) {
  width = videoFrame.width;
  height = videoFrame.height;
  auto size = width*height*4;
  data.resize(size);
  data.insert(data.begin(), (uint8_t *)videoFrame.yBuffer,
			  (uint8_t *)videoFrame.yBuffer + size);
}

media::IVideoFrameObserver::VIDEO_FRAME_TYPE
VideoFrameObserver::getVideoFormatPreference() {
  return FRAME_TYPE_RGBA;
}

bool VideoFrameObserver::getRotationApplied() { return true; }

bool VideoFrameObserver::onCaptureVideoFrame(
	media::IVideoFrameObserver::VideoFrame &videoFrame) {
  cacheVideoFrame(0, videoFrame);
  return true;
}

bool VideoFrameObserver::onRenderVideoFrame(
	unsigned int uid, media::IVideoFrameObserver::VideoFrame &videoFrame) {
  cacheVideoFrame(uid, videoFrame);
  return true;
}

void VideoFrameObserver::bindTextureId(unsigned int textureId,
									   unsigned int uid) {
  if (_map.find(uid)!=_map.end()) {
	renderTexture(textureId, _map[uid]);
  }
}

void VideoFrameObserver::cacheVideoFrame(
	unsigned int uid, media::IVideoFrameObserver::VideoFrame &videoFrame) {
  if (_map.find(uid)==_map.end()) {
	_map[uid] = CacheVideoFrame();
  }
  _map[uid].resetVideoFrame(videoFrame);
}

void VideoFrameObserver::renderTexture(unsigned int textureId,
									   const CacheVideoFrame &frame) {
  glBindTexture(GL_TEXTURE_2D, textureId);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, frame.width, frame.height, 0, GL_RGBA,
			   GL_UNSIGNED_BYTE, frame.data.data());
  glBindTexture(GL_TEXTURE_2D, 0);
}
} // namespace cocos
} // namespace agora
