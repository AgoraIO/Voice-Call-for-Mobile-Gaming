var agora;
(function (agora) {
    var isWeb = typeof AgoraRTC !== 'undefined';
    var event = new cc.EventTarget();
    var bridge;
    var client;
    var localStream;
    var remoteStreams = new Map();
    if (!isWeb) {
        bridge = new agoraCreator();
    }
    agora.bridge=bridge;
    function initNativeEvent() {
        bridge.onWarning = function (warn, msg) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onWarning', JSON.stringify({ warn: warn, msg: msg }));
            }
            event.emit('warning', warn, msg);
        };
        bridge.onError = function (err, msg) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onError', JSON.stringify({ err: err, msg: msg }));
            }
            event.emit('error', err, msg);
        };
        bridge.onJoinChannelSuccess = function (channel, uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onJoinChannelSuccess', JSON.stringify({ channel: channel, uid: uid, elapsed: elapsed }));
            }
            event.emit('join-channel-success', channel, uid, elapsed);
            event.emit('joinChannelSuccess', channel, uid, elapsed);
        };
        bridge.onRejoinChannelSuccess = function (channel, uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRejoinChannelSuccess', JSON.stringify({ channel: channel, uid: uid, elapsed: elapsed }));
            }
            event.emit('rejoin-channel-success', channel, uid, elapsed);
            event.emit('rejoinChannelSuccess', channel, uid, elapsed);
        };
        bridge.onLeaveChannel = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLeaveChannel', JSON.stringify({ stats: stats }));
            }
            event.emit('leave-channel', stats);
            event.emit('leaveChannel', stats);
        };
        bridge.onClientRoleChanged = function (oldRole, newRole) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onClientRoleChanged', JSON.stringify({ oldRole: oldRole, newRole: newRole }));
            }
            event.emit('client-role-changed', oldRole, newRole);
            event.emit('clientRoleChanged', oldRole, newRole);
        };
        bridge.onUserJoined = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserJoined', JSON.stringify({ uid: uid, elapsed: elapsed }));
            }
            event.emit('user-joined', uid, elapsed);
            event.emit('userJoined', uid, elapsed);
        };
        bridge.onUserOffline = function (uid, reason) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserOffline', JSON.stringify({ uid: uid, reason: reason }));
            }
            event.emit('user-offline', uid, reason);
            event.emit('userOffline', uid, reason);
        };
        bridge.onLastmileQuality = function (quality) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLastmileQuality', JSON.stringify({ quality: quality }));
            }
            event.emit('lastmileQuality', quality);
        };
        bridge.onLastmileProbeResult = function (result) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLastmileProbeResult', JSON.stringify({ result: result }));
            }
            event.emit('lastmileProbeResult', result);
        };
        bridge.onConnectionInterrupted = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionInterrupted', JSON.stringify({}));
            }
            event.emit('connection-interrupted');
            event.emit('connectionInterrupted');
        };
        bridge.onConnectionLost = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionLost', JSON.stringify({}));
            }
            event.emit('connection-lost');
            event.emit('connectionLost');
        };
        bridge.onConnectionBanned = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionBanned', JSON.stringify({}));
            }
            event.emit('connection-banned');
            event.emit('connectionBanned');
        };
        bridge.onApiCallExecuted = function (err, api, result) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onApiCallExecuted', JSON.stringify({ err: err, api: api, result: result }));
            }
            event.emit('apiCallExecuted', err, api, result);
        };
        bridge.onRequestToken = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRequestToken', JSON.stringify({}));
            }
            event.emit('request-token');
            event.emit('requestToken');
        };
        bridge.onTokenPrivilegeWillExpire = function (token) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onTokenPrivilegeWillExpire', JSON.stringify({ token: token }));
            }
            event.emit('tokenPrivilegeWillExpire', token);
        };
        bridge.onAudioQuality = function (uid, quality, delay, lost) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioQuality', JSON.stringify({ uid: uid, quality: quality, delay: delay, lost: lost }));
            }
            event.emit('audio-quality', uid, quality, delay, lost);
            event.emit('audioQuality', uid, quality, delay, lost);
        };
        bridge.onRtcStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtcStats', JSON.stringify({ stats: stats }));
            }
            event.emit('rtcStats', stats);
        };
        bridge.onNetworkQuality = function (uid, txQuality, rxQuality) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onNetworkQuality', JSON.stringify({ uid: uid, txQuality: txQuality, rxQuality: rxQuality }));
            }
            event.emit('network-quality', uid, txQuality, rxQuality);
            event.emit('networkQuality', uid, txQuality, rxQuality);
        };
        bridge.onLocalVideoStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalVideoStats', JSON.stringify({ stats: stats }));
            }
            event.emit('localVideoStats', stats);
        };
        bridge.onRemoteVideoStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoStats', JSON.stringify({ stats: stats }));
            }
            event.emit('remoteVideoStats', stats);
        };
        bridge.onLocalAudioStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalAudioStats', JSON.stringify({ stats: stats }));
            }
            event.emit('localAudioStats', stats);
        };
        bridge.onRemoteAudioStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioStats', JSON.stringify({ stats: stats }));
            }
            event.emit('remoteAudioStats', stats);
        };
        bridge.onLocalAudioStateChanged = function (state, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalAudioStateChanged', JSON.stringify({ state: state, error: error }));
            }
            event.emit('localAudioStateChanged', state, error);
        };
        bridge.onRemoteAudioStateChanged = function (uid, state, reason, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioStateChanged', JSON.stringify({ uid: uid, state: state, reason: reason, elapsed: elapsed }));
            }
            event.emit('remoteAudioStateChanged', uid, state, reason, elapsed);
        };
        bridge.onAudioPublishStateChanged = function (channel, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioPublishStateChanged', JSON.stringify({
                    channel: channel,
                    oldState: oldState,
                    newState: newState,
                    elapseSinceLastState: elapseSinceLastState
                }));
            }
            event.emit('audioPublishStateChanged', channel, oldState, newState, elapseSinceLastState);
        };
        bridge.onVideoPublishStateChanged = function (channel, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoPublishStateChanged', JSON.stringify({
                    channel: channel,
                    oldState: oldState,
                    newState: newState,
                    elapseSinceLastState: elapseSinceLastState
                }));
            }
            event.emit('videoPublishStateChanged', channel, oldState, newState, elapseSinceLastState);
        };
        bridge.onAudioSubscribeStateChanged = function (channel, uid, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioSubscribeStateChanged', JSON.stringify({
                    channel: channel,
                    oldState: oldState,
                    newState: newState,
                    elapseSinceLastState: elapseSinceLastState
                }));
            }
            event.emit('audioSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState);
        };
        bridge.onVideoSubscribeStateChanged = function (channel, uid, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoSubscribeStateChanged', JSON.stringify({
                    channel: channel,
                    oldState: oldState,
                    newState: newState,
                    elapseSinceLastState: elapseSinceLastState
                }));
            }
            event.emit('videoSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState);
        };
        bridge.onAudioVolumeIndication = function (speakers, speakerNumber, totalVolume) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioVolumeIndication', JSON.stringify({
                    speakers: speakers,
                    speakerNumber: speakerNumber,
                    totalVolume: totalVolume
                }));
            }
            event.emit('audio-volume-indication', speakers, speakerNumber, totalVolume);
            event.emit('audioVolumeIndication', speakers, speakerNumber, totalVolume);
        };
        bridge.onActiveSpeaker = function (uid) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onActiveSpeaker', JSON.stringify({ uid: uid }));
            }
            event.emit('activeSpeaker', uid);
        };
        bridge.onVideoStopped = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoStopped', JSON.stringify({}));
            }
            event.emit('videoStopped');
        };
        bridge.onFirstLocalVideoFrame = function (width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalVideoFrame', JSON.stringify({ width: width, height: height, elapsed: elapsed }));
            }
            event.emit('firstLocalVideoFrame', width, height, elapsed);
        };
        bridge.onFirstLocalVideoFramePublished = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalVideoFramePublished', JSON.stringify({ elapsed: elapsed }));
            }
            event.emit('firstLocalVideoFramePublished', elapsed);
        };
        bridge.onFirstRemoteVideoDecoded = function (uid, width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteVideoDecoded', JSON.stringify({ uid: uid, width: width, height: height, elapsed: elapsed }));
            }
            event.emit('firstRemoteVideoDecoded', uid, width, height, elapsed);
        };
        bridge.onFirstRemoteVideoFrame = function (uid, width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteVideoFrame', JSON.stringify({ uid: uid, width: width, height: height, elapsed: elapsed }));
            }
            event.emit('firstRemoteVideoFrame', uid, width, height, elapsed);
        };
        bridge.onUserMuteAudio = function (uid, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserMuteAudio', JSON.stringify({ uid: uid, muted: muted }));
            }
            event.emit('user-mute-audio', uid, muted);
            event.emit('userMuteAudio', uid, muted);
        };
        bridge.onUserMuteVideo = function (uid, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserMuteVideo', JSON.stringify({ uid: uid, muted: muted }));
            }
            event.emit('userMuteVideo', uid, muted);
        };
        bridge.onUserEnableVideo = function (uid, enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserEnableVideo', JSON.stringify({ uid: uid, enabled: enabled }));
            }
            event.emit('userEnableVideo', uid, enabled);
        };
        bridge.onAudioDeviceStateChanged = function (deviceId, deviceType, deviceState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioDeviceStateChanged', JSON.stringify({
                    deviceId: deviceId,
                    deviceType: deviceType,
                    deviceState: deviceState
                }));
            }
            event.emit('audioDeviceStateChanged', deviceId, deviceType, deviceState);
        };
        bridge.onAudioDeviceVolumeChanged = function (deviceType, volume, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioDeviceVolumeChanged', JSON.stringify({ deviceType: deviceType, volume: volume, muted: muted }));
            }
            event.emit('audioDeviceVolumeChanged', deviceType, volume, muted);
        };
        bridge.onCameraReady = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraReady', JSON.stringify({}));
            }
            event.emit('cameraReady');
        };
        bridge.onCameraFocusAreaChanged = function (x, y, width, height) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraFocusAreaChanged', JSON.stringify({ x: x, y: y, width: width, height: height }));
            }
            event.emit('cameraFocusAreaChanged', x, y, width, height);
        };
        bridge.onFacePositionChanged = function (imageWidth, imageHeight, vecRectangle, vecDistance, numFaces) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFacePositionChanged', JSON.stringify({
                    imageWidth: imageWidth,
                    imageHeight: imageHeight,
                    vecRectangle: vecRectangle,
                    vecDistance: vecDistance,
                    numFaces: numFaces
                }));
            }
            event.emit('facePositionChanged', imageWidth, imageHeight, vecRectangle, vecDistance, numFaces);
        };
        bridge.onCameraExposureAreaChanged = function (x, y, width, height) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraExposureAreaChanged', JSON.stringify({ x: x, y: y, width: width, height: height }));
            }
            event.emit('cameraExposureAreaChanged', x, y, width, height);
        };
        bridge.onAudioMixingFinished = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioMixingFinished', JSON.stringify({}));
            }
            event.emit('audioMixingFinished');
        };
        bridge.onAudioMixingStateChanged = function (state, errorCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioMixingStateChanged', JSON.stringify({ state: state, errorCode: errorCode }));
            }
            event.emit('audioMixingStateChanged', state, errorCode);
        };
        bridge.onRemoteAudioMixingBegin = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioMixingBegin', JSON.stringify({}));
            }
            event.emit('remoteAudioMixingBegin');
        };
        bridge.onRemoteAudioMixingEnd = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioMixingEnd', JSON.stringify({}));
            }
            event.emit('remoteAudioMixingEnd');
        };
        bridge.onAudioEffectFinished = function (soundId) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioEffectFinished', JSON.stringify({ soundId: soundId }));
            }
            event.emit('audioEffectFinished', soundId);
        };
        bridge.onFirstRemoteAudioDecoded = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteAudioDecoded', JSON.stringify({ uid: uid, elapsed: elapsed }));
            }
            event.emit('firstRemoteAudioDecoded', uid, elapsed);
        };
        bridge.onVideoDeviceStateChanged = function (deviceId, deviceType, deviceState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoDeviceStateChanged', JSON.stringify({
                    deviceId: deviceId,
                    deviceType: deviceType,
                    deviceState: deviceState
                }));
            }
            event.emit('videoDeviceStateChanged', deviceId, deviceType, deviceState);
        };
        bridge.onLocalVideoStateChanged = function (localVideoState, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalVideoStateChanged', JSON.stringify({ localVideoState: localVideoState, error: error }));
            }
            event.emit('localVideoStateChanged', localVideoState, error);
        };
        bridge.onVideoSizeChanged = function (uid, width, height, rotation) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoSizeChanged', JSON.stringify({ uid: uid, width: width, height: height, rotation: rotation }));
            }
            event.emit('videoSizeChanged', uid, width, height, rotation);
        };
        bridge.onRemoteVideoStateChanged = function (uid, state, reason, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoStateChanged', JSON.stringify({ uid: uid, state: state, reason: reason, elapsed: elapsed }));
            }
            event.emit('remoteVideoStateChanged', uid, state, reason, elapsed);
        };
        bridge.onUserEnableLocalVideo = function (uid, enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserEnableLocalVideo', JSON.stringify({ uid: uid, enabled: enabled }));
            }
            event.emit('userEnableLocalVideo', uid, enabled);
        };
        bridge.onStreamMessage = function (uid, streamId, data, length) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamMessage', JSON.stringify({
                    uid: uid,
                    streamId: streamId,
                    data: String.fromCharCode.apply(null, data),
                    length: length
                }));
            }
            event.emit('streamMessage', uid, streamId, data, length);
        };
        bridge.onStreamMessageError = function (uid, streamId, code, missed, cached) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamMessageError', JSON.stringify({ uid: uid, streamId: streamId, code: code, missed: missed, cached: cached }));
            }
            event.emit('streamMessageError', uid, streamId, code, missed, cached);
        };
        bridge.onMediaEngineLoadSuccess = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMediaEngineLoadSuccess', JSON.stringify({}));
            }
            event.emit('mediaEngineLoadSuccess');
        };
        bridge.onMediaEngineStartCallSuccess = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMediaEngineStartCallSuccess', JSON.stringify({}));
            }
            event.emit('mediaEngineStartCallSuccess');
        };
        bridge.onChannelMediaRelayStateChanged = function (state, code) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onChannelMediaRelayStateChanged', JSON.stringify({ state: state, code: code }));
            }
            event.emit('channelMediaRelayStateChanged', state, code);
        };
        bridge.onChannelMediaRelayEvent = function (code) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onChannelMediaRelayEvent', JSON.stringify({ code: code }));
            }
            event.emit('channelMediaRelayEvent', code);
        };
        bridge.onFirstLocalAudioFrame = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalAudioFrame', JSON.stringify({ elapsed: elapsed }));
            }
            event.emit('firstLocalAudioFrame', elapsed);
        };
        bridge.onFirstLocalAudioFramePublished = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalAudioFramePublished', JSON.stringify({ elapsed: elapsed }));
            }
            event.emit('firstLocalAudioFramePublished', elapsed);
        };
        bridge.onFirstRemoteAudioFrame = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteAudioFrame', JSON.stringify({ uid: uid, elapsed: elapsed }));
            }
            event.emit('firstRemoteAudioFrame', uid, elapsed);
        };
        bridge.onRtmpStreamingStateChanged = function (url, state, errCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtmpStreamingStateChanged', JSON.stringify({ url: url, state: state, errCode: errCode }));
            }
            event.emit('rtmpStreamingStateChanged', url, state, errCode);
        };
        bridge.onRtmpStreamingEvent = function (url, eventCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtmpStreamingEvent', JSON.stringify({ url: url, eventCode: eventCode }));
            }
            event.emit('rtmpStreamingEvent', url, eventCode);
        };
        bridge.onStreamPublished = function (url, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamPublished', JSON.stringify({ url: url, error: error }));
            }
            event.emit('streamPublished', url, error);
        };
        bridge.onStreamUnpublished = function (url) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamUnpublished', JSON.stringify({ url: url }));
            }
            event.emit('streamUnpublished', url);
        };
        bridge.onTranscodingUpdated = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onTranscodingUpdated', JSON.stringify({}));
            }
            event.emit('transcodingUpdated');
        };
        bridge.onStreamInjectedStatus = function (url, uid, status) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamInjectedStatus', JSON.stringify({ url: url, uid: uid, status: status }));
            }
            event.emit('streamInjectedStatus', url, uid, status);
        };
        bridge.onAudioRouteChanged = function (routing) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioRouteChanged', JSON.stringify({ routing: routing }));
            }
            event.emit('audio-routing-changed', routing);
            event.emit('audioRouteChanged', routing);
        };
        bridge.onLocalPublishFallbackToAudioOnly = function (isFallbackOrRecover) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalPublishFallbackToAudioOnly', JSON.stringify({ isFallbackOrRecover: isFallbackOrRecover }));
            }
            event.emit('localPublishFallbackToAudioOnly', isFallbackOrRecover);
        };
        bridge.onRemoteSubscribeFallbackToAudioOnly = function (uid, isFallbackOrRecover) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteSubscribeFallbackToAudioOnly', JSON.stringify({
                    uid: uid,
                    isFallbackOrRecover: isFallbackOrRecover
                }));
            }
            event.emit('remoteSubscribeFallbackToAudioOnly', uid, isFallbackOrRecover);
        };
        bridge.onRemoteAudioTransportStats = function (uid, delay, lost, rxKBitRate) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioTransportStats', JSON.stringify({ uid: uid, delay: delay, lost: lost, rxKBitRate: rxKBitRate }));
            }
            event.emit('remoteAudioTransportStats', uid, delay, lost, rxKBitRate);
        };
        bridge.onRemoteVideoTransportStats = function (uid, delay, lost, rxKBitRate) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoTransportStats', JSON.stringify({ uid: uid, delay: delay, lost: lost, rxKBitRate: rxKBitRate }));
            }
            event.emit('remoteVideoTransportStats', uid, delay, lost, rxKBitRate);
        };
        bridge.onMicrophoneEnabled = function (enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMicrophoneEnabled', JSON.stringify({ enabled: enabled }));
            }
            event.emit('microphoneEnabled', enabled);
        };
        bridge.onConnectionStateChanged = function (state, reason) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionStateChanged', JSON.stringify({ state: state, reason: reason }));
            }
            event.emit('connectionStateChanged', state, reason);
        };
        bridge.onNetworkTypeChanged = function (type) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onNetworkTypeChanged', JSON.stringify({ type: type }));
            }
            event.emit('networkTypeChanged', type);
        };
        bridge.onLocalUserRegistered = function (uid, userAccount) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalUserRegistered', JSON.stringify({ uid: uid, userAccount: userAccount }));
            }
            event.emit('localUserRegistered', uid, userAccount);
        };
        bridge.onUserInfoUpdated = function (uid, info) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserInfoUpdated', JSON.stringify({ uid: uid, info: info }));
            }
            event.emit('userInfoUpdated', uid, info);
        };
        bridge.onMetadataReceived = function (_a) {
            var uid = _a.uid, size = _a.size, buffer = _a.buffer, timeStampMs = _a.timeStampMs;
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMetadataReceived', JSON.stringify({
                    uid: uid,
                    size: size,
                    buffer: String.fromCharCode.apply(null, buffer),
                    timeStampMs: timeStampMs
                }));
            }
            event.emit('metadataReceived', { uid: uid, size: size, buffer: buffer, timeStampMs: timeStampMs });
        };
    }
    function initWebEvent() {
        client.on('first-audio-frame-decode', function (evt) {
            event.emit('firstRemoteAudioDecoded', evt.stream.getId(), 0);
        });
        client.on('first-video-frame-decode', function (evt) {
            evt.stream.getStats(function (stats) {
                event.emit('firstRemoteVideoDecoded', evt.stream.getId(), stats.videoReceiveResolutionWidth, stats.videoReceiveResolutionHeight, 0);
            });
        });
        client.on('stream-published', function (evt) {
            event.emit('firstLocalAudioFramePublished', 0);
            event.emit('firstLocalVideoFramePublished', 0);
        });
        client.on('stream-unpublished', function (evt) {
            event.emit('localAudioStateChanged', LOCAL_AUDIO_STREAM_STATE.LOCAL_AUDIO_STREAM_STATE_STOPPED, LOCAL_AUDIO_STREAM_ERROR.LOCAL_AUDIO_STREAM_ERROR_OK);
            event.emit('localVideoStateChanged', LOCAL_VIDEO_STREAM_STATE.LOCAL_VIDEO_STREAM_STATE_STOPPED, LOCAL_VIDEO_STREAM_ERROR.LOCAL_VIDEO_STREAM_ERROR_OK);
        });
        client.on('stream-added', function (evt) {
            client.subscribe(evt.stream);
            remoteStreams.set(evt.stream.getId(), evt.stream);
            event.emit('remoteAudioStateChanged', evt.stream.getId(), REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STARTING, REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_INTERNAL, 0);
            event.emit('remoteVideoStateChanged', evt.stream.getId(), REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STARTING, REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_INTERNAL, 0);
        });
        client.on('stream-removed', function (evt) {
            client.unsubscribe(evt.stream);
            remoteStreams.delete(evt.stream.getId());
            event.emit('remoteAudioStateChanged', evt.stream.getId(), REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STOPPED, REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_INTERNAL, 0);
            event.emit('remoteVideoStateChanged', evt.stream.getId(), REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STOPPED, REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_INTERNAL, 0);
        });
        client.on('stream-subscribed', function (evt) {
            evt.stream.play('Cocos2dGameContainer');
            event.emit('audioSubscribeStateChanged', undefined, evt.stream.getId(), STREAM_SUBSCRIBE_STATE.SUB_STATE_IDLE, STREAM_SUBSCRIBE_STATE.SUB_STATE_SUBSCRIBED, 0);
            event.emit('videoSubscribeStateChanged', undefined, evt.stream.getId(), STREAM_SUBSCRIBE_STATE.SUB_STATE_IDLE, STREAM_SUBSCRIBE_STATE.SUB_STATE_SUBSCRIBED, 0);
        });
        client.on('peer-online', function (evt) {
            event.emit('user-joined', evt.uid, 0);
            event.emit('userJoined', evt.uid, 0);
        });
        client.on('peer-leave', function (evt) {
            event.emit('user-offline', evt.uid, evt.reason, 0);
            event.emit('userOffline', evt.uid, evt.reason, 0);
        });
        client.on('mute-audio', function (evt) {
            event.emit('user-mute-audio', evt.uid, true);
            event.emit('userMuteAudio', evt.uid, true);
        });
        client.on('unmute-audio', function (evt) {
            event.emit('user-mute-audio', evt.uid, false);
            event.emit('userMuteAudio', evt.uid, false);
        });
        client.on('mute-video', function (evt) {
            event.emit('userMuteVideo', evt.uid, true);
        });
        client.on('unmute-video', function (evt) {
            event.emit('userMuteVideo', evt.uid, false);
        });
        client.on('crypt-error', function (evt) {
        });
        client.on('client-banned', function (evt) {
            event.emit('connection-banned');
            event.emit('connectionBanned');
        });
        client.on('active-speaker', function (evt) {
            event.emit('activeSpeaker', evt.uid);
        });
        client.on('volume-indicator', function (evt) {
            var speakers = [];
            var sumVolume = 0;
            evt.attr.forEach(function (_a, index) {
                var uid = _a.uid, level = _a.level;
                speakers.push({ uid: uid, volume: level });
                sumVolume += level;
            });
            event.emit('audio-volume-indication', speakers, speakers.length, sumVolume / speakers.length);
            event.emit('audioVolumeIndication', speakers, speakers.length, sumVolume / speakers.length);
        });
        client.on('liveStreamingStarted', function (evt) {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_RUNNING, null);
        });
        client.on('liveStreamingFailed', function (evt) {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_FAILURE, null);
        });
        client.on('liveStreamingStopped', function (evt) {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_IDLE, null);
        });
        client.on('liveTranscodingUpdated', function (evt) {
            event.emit('transcodingUpdated');
        });
        client.on('streamInjectedStatus', function (evt) {
            event.emit('streamInjectedStatus', evt.url, evt.uid, evt.status);
        });
        client.on('onTokenPrivilegeWillExpire', function (evt) {
            event.emit('tokenPrivilegeWillExpire');
        });
        client.on('onTokenPrivilegeDidExpire', function (evt) {
        });
        client.on('error', function (evt) {
            event.emit('error', ERROR_CODE_TYPE.ERR_FAILED, evt.reason);
        });
        client.on('network-type-changed', function (evt) {
            event.emit('networkTypeChanged', evt.networkType);
        });
        client.on('recording-device-changed', function (evt) {
            event.emit('recordingDeviceChanged', evt.state, evt.device);
        });
        client.on('playout-device-changed', function (evt) {
            event.emit('playoutDeviceChanged', evt.state, evt.device);
        });
        client.on('camera-changed', function (evt) {
        });
        client.on('stream-type-changed', function (evt) {
        });
        client.on('connection-state-change', function (evt) {
            var state = {
                'DISCONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED,
                'CONNECTING': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING,
                'CONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED,
                'DISCONNECTING': undefined,
            };
            if (state[evt.curState] !== undefined) {
                event.emit('connectionStateChanged', state[evt.curState], null);
            }
        });
        client.on('stream-reconnect-start', function (evt) {
        });
        client.on('stream-reconnect-end', function (evt) {
        });
        client.on('client-role-changed', function (evt) {
            event.emit('client-role-changed', null, evt.role);
            event.emit('clientRoleChanged', null, evt.role);
        });
        client.on('reconnect', function () {
            event.emit('connectionStateChanged', CONNECTION_STATE_TYPE.CONNECTION_STATE_RECONNECTING, null);
        });
        client.on('connected', function () {
            event.emit('connectionStateChanged', CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED, null);
        });
        client.on('network-quality', function (stats) {
            event.emit('networkQuality', 0, stats.uplinkNetworkQuality, stats.downlinkNetworkQuality);
        });
        client.on('stream-fallback', function (evt) {
            event.emit('remoteSubscribeFallbackToAudioOnly', evt.uid, evt.attr === 1);
        });
        client.on('stream-updated', function (evt) {
            // TODO
        });
        client.on('exception', function (evt) {
            event.emit('warning', evt.code, evt.msg);
        });
        client.on('enable-local-video', function (evt) {
            event.emit('userEnableVideo', evt.uid, true);
        });
        client.on('disable-local-video', function (evt) {
            event.emit('userEnableVideo', evt.uid, false);
        });
        client.on('channel-media-relay-event', function (evt) {
            event.emit('channelMediaRelayEvent', evt.code);
        });
        client.on('channel-media-relay-state', function (evt) {
            event.emit('channelMediaRelayStateChanged', evt.state, evt.code);
        });
    }
    function callNativeMethod(apiType, param, extra) {
        if (param === void 0) { param = {}; }
        return bridge.callNativeMethod(apiType, JSON.stringify(param), extra);
    }
    function callNativeMethodAudioEffect(apiType, param) {
        if (param === void 0) { param = {}; }
        return bridge.callNativeMethodAudioEffect(apiType, JSON.stringify(param));
    }
    function init(appId) {
        initWithAreaCode(appId, AREA_CODE.AREA_CODE_GLOBAL);
    }
    agora.init = init;
    function initWithAreaCode(appId, areaCode) {
        var _a;
        if (isWeb) {
            var areas = (_a = {},
                _a[AREA_CODE.AREA_CODE_CN] = AgoraRTC.AREAS.CHINA,
                _a[AREA_CODE.AREA_CODE_NA] = AgoraRTC.AREAS.NORTH_AMERICA,
                _a[AREA_CODE.AREA_CODE_EUR] = AgoraRTC.AREAS.EUROPE,
                _a[AREA_CODE.AREA_CODE_AS] = AgoraRTC.AREAS.ASIA,
                _a[AREA_CODE.AREA_CODE_JAPAN] = AgoraRTC.AREAS.JAPAN,
                _a[AREA_CODE.AREA_CODE_INDIA] = AgoraRTC.AREAS.INDIA,
                _a[AREA_CODE.AREA_CODE_GLOBAL] = AgoraRTC.AREAS.GLOBAL,
                _a);
            var config = {
                codec: 'h264',
                mode: 'live',
                areaCode: [areas[areaCode]]
            };
            client = AgoraRTC.createClient(config);
            initWebEvent();
            client.init(appId);
        }
        else {
            initNativeEvent();
            callNativeMethod(API_TYPE.INITIALIZE, { appId: appId, areaCode: areaCode });
        }
    }
    agora.initWithAreaCode = initWithAreaCode;
    function on(type, callback, target, useCapture) {
        return event.on(type, callback, target, useCapture);
    }
    agora.on = on;
    function off(type, callback, target) {
        event.off(type, callback, target);
    }
    agora.off = off;
    /** Sets the channel profile of the Agora IRtcEngine.
     *
     * The Agora IRtcEngine differentiates channel profiles and applies optimization algorithms accordingly.
     * For example, it prioritizes smoothness and low latency for a video call, and prioritizes video quality for the live interactive video streaming.
     *
     * @warning
     * - To ensure the quality of real-time communication, we recommend that all users in a channel use the same channel profile.
     * - Call this method before calling \ref IRtcEngine::joinChannel "joinChannel" . You cannot set the channel profile once you have joined the channel.
     * - The default audio route and video encoding bitrate are different in different channel profiles. For details, see
     * \ref IRtcEngine::setDefaultAudioRouteToSpeakerphone "setDefaultAudioRouteToSpeakerphone" and \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
     *
     * @param profile The channel profile of the Agora IRtcEngine. See #CHANNEL_PROFILE_TYPE
     * @return
     * - 0(ERR_OK): Success.
     * - < 0: Failure.
     *  - -2 (ERR_INVALID_ARGUMENT): The parameter is invalid.
     *  - -7(ERR_NOT_INITIALIZED): The SDK is not initialized.
     */
    function setChannelProfile(profile) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_CHANNEL_PROFILE, { profile: profile });
    }
    agora.setChannelProfile = setChannelProfile;
    /** Sets the role of the user, such as a host or an audience (default), before joining a channel in the live interactive streaming.
     *
     * This method can be used to switch the user role in the live interactive streaming after the user joins a channel.
     *
     * In the `LIVE_BROADCASTING` profile, when a user switches user roles after joining a channel, a successful \ref agora::rtc::IRtcEngine::setClientRole "setClientRole" method call triggers the following callbacks:
     * - The local client: \ref agora::rtc::IRtcEngineEventHandler::onClientRoleChanged "onClientRoleChanged"
     * - The remote client: \ref agora::rtc::IRtcEngineEventHandler::onUserJoined "onUserJoined" or \ref agora::rtc::IRtcEngineEventHandler::onUserOffline "onUserOffline" (BECOME_AUDIENCE)
     *
     * @note
     * This method applies only to the `LIVE_BROADCASTING` profile.
     *
     * @param role Sets the role of the user. See #CLIENT_ROLE_TYPE.
     *
     * @return
     * - 0(ERR_OK): Success.
     * - < 0: Failure.
     *  - -1(ERR_FAILED): A general error occurs (no specified reason).
     *  - -2(ERR_INALID_ARGUMENT): The parameter is invalid.
     *  - -7(ERR_NOT_INITIALIZED): The SDK is not initialized.
     */
    function setClientRole(role) {
        if (isWeb) {
            var roles = new Map([
                [CLIENT_ROLE_TYPE.CLIENT_ROLE_AUDIENCE, 'audience'],
                [CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER, 'host'],
            ]);
            client.setClientRole(roles.get(role));
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.SET_CLIENT_ROLE, { role: role });
    }
    agora.setClientRole = setClientRole;
    /** Joins a channel with the user ID.

     Users in the same channel can talk to each other, and multiple users in the same channel can start a group chat. Users with different App IDs cannot call each other.


     You must call the \ref IRtcEngine::leaveChannel "leaveChannel" method to exit the current call before entering another channel.

     A successful \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method call triggers the following callbacks:
     - The local client: \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess"
     - The remote client: \ref agora::rtc::IRtcEngineEventHandler::onUserJoined "onUserJoined" , if the user joining the channel is in the `COMMUNICATION` profile, or is a host in the `LIVE_BROADCASTING` profile.

     When the connection between the client and Agora's server is interrupted due to poor network conditions, the SDK tries reconnecting to the server. When the local client successfully rejoins the channel, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onRejoinChannelSuccess "onRejoinChannelSuccess" callback on the local client.

     @note A channel does not accept duplicate uids, such as two users with the same @p uid. If you set @p uid as 0, the system automatically assigns a @p uid. If you want to join a channel from different devices, ensure that each device has a different uid.
     @warning Ensure that the App ID used for creating the token is the same App ID used by the \ref IRtcEngine::initialize "initialize" method for initializing the RTC engine. Otherwise, the CDN live streaming may fail.

     @param token Pointer to the token generated by the application server. In most circumstances, a static App ID suffices. For added security, use a Channel Key.
     - If the user uses a static App ID, *token* is optional and can be set as NULL.
     - If the user uses a Channel Key, Agora issues an additional App Certificate for you to generate a user key based on the algorithm and App Certificate for user authentication on the server.
     @param channelId Pointer to the unique channel name for the Agora RTC session in the string format smaller than 64 bytes. Supported characters:
     - All lowercase English letters: a to z.
     - All uppercase English letters: A to Z.
     - All numeric characters: 0 to 9.
     - The space character.
     - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
     @param info (Optional) Pointer to additional information about the channel. This parameter can be set to NULL or contain channel related information. Other users in the channel will not receive this message.
     @param uid (Optional) User ID. A 32-bit unsigned integer with a value ranging from 1 to 2<sup>32</sup>-1. The @p uid must be unique. If a @p uid is not assigned (or set to 0), the SDK assigns and returns a @p uid in the \ref IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback. Your application must record and maintain the returned *uid* since the SDK does not do so.

     @return
         - 0(ERR_OK): Success.
     - < 0: Failure.
     - -2(ERR_INALID_ARGUMENT): The parameter is invalid.
     - -3(ERR_NOT_READY): The SDK fails to be initialized. You can try re-initializing the SDK.
     - -5(ERR_REFUSED): The request is rejected. This may be caused by the following:
     - You have created an IChannel object with the same channel name.
     - You have joined and published a stream in a channel created by the IChannel object.
     */
    function joinChannel(token, channelId, info, uid) {
        if (info === void 0) { info = ''; }
        if (uid === void 0) { uid = 0; }
        if (isWeb) {
            client.join(token, channelId, uid, function (uid) {
                var spec = { streamID: uid, audio: true, video: true, screen: false };
                localStream = AgoraRTC.createStream(spec);
                localStream.init(function () {
                    localStream.play('Cocos2dGameContainer');
                    client.publish(localStream);
                });
                event.emit('join-channel-success', channelId, uid, 0);
                event.emit('joinChannelSuccess', channelId, uid, 0);
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.JOIN_CHANNEL, { token: token, channelId: channelId, info: info, uid: uid });
    }
    agora.joinChannel = joinChannel;
    /** Switches to a different channel.
     *
     * This method allows the audience of a `LIVE_BROADCASTING` channel to switch
     * to a different channel.
     *
     * After the user successfully switches to another channel, the
     * \ref agora::rtc::IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel"
     *  and \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess
     * "onJoinChannelSuccess" callbacks are triggered to indicate that the
     * user has left the original channel and joined a new one.
     *
     * @note
     * This method applies to the audience role in a `LIVE_BROADCASTING` channel
     * only.
     *
     * @param token The token generated at your server:
     * - For low-security requirements: You can use the temporary token
     * generated in Console. For details, see
     * [Get a temporary token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-temporary-token).
     * - For high-security requirements: Use the token generated at your
     * server. For details, see
     * [Get a token](https://docs.agora.io/en/Agora%20Platform/token?platfor%20*%20m=All%20Platforms#get-a-token).
     * @param channelId Unique channel name for the AgoraRTC session in the
     * string format. The string length must be less than 64 bytes. Supported
     * character scopes are:
     * - All lowercase English letters: a to z.
     * - All uppercase English letters: A to Z.
     * - All numeric characters: 0 to 9.
     * - The space character.
     * - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
     *
     * @return
     * - 0(ERR_OK): Success.
     * - < 0: Failure.
     *  - -1(ERR_FAILED): A general error occurs (no specified reason).
     *  - -2(ERR_INALID_ARGUMENT): The parameter is invalid.
     *  - -5(ERR_REFUSED): The request is rejected, probably because the user is not an audience.
     *  - -7(ERR_NOT_INITIALIZED): The SDK is not initialized.
     *  - -102(ERR_INVALID_CHANNEL_NAME): The channel name is invalid.
     *  - -113(ERR_NOT_IN_CHANNEL): The user is not in the channel.
     */
    function switchChannel(token, channelId) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SWITCH_CHANNEL, { token: token, channelId: channelId });
    }
    agora.switchChannel = switchChannel;
    /** Allows a user to leave a channel, such as hanging up or exiting a call.

     After joining a channel, the user must call the *leaveChannel* method to end the call before joining another channel.

     This method returns 0 if the user leaves the channel and releases all resources related to the call.

     This method call is asynchronous, and the user has not left the channel when the method call returns. Once the user leaves the channel, the SDK triggers the \ref IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel" callback.

     A successful \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method call triggers the following callbacks:
     - The local client: \ref agora::rtc::IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel"
     - The remote client: \ref agora::rtc::IRtcEngineEventHandler::onUserOffline "onUserOffline" , if the user leaving the channel is in the `COMMUNICATION` channel, or is a host in the `LIVE_BROADCASTING` profile.

     @note
     - If you call the \ref IRtcEngine::release "release" method immediately after the *leaveChannel* method, the *leaveChannel* process interrupts, and the \ref IRtcEngineEventHandler::onLeaveChannel "onLeaveChannel" callback is not triggered.
     - If you call the *leaveChannel* method during a CDN live streaming, the SDK triggers the \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" method.

     @return
         - 0(ERR_OK): Success.
     - < 0: Failure.
     - -1(ERR_FAILED): A general error occurs (no specified reason).
     - -2(ERR_INALID_ARGUMENT): The parameter is invalid.
     - -7(ERR_NOT_INITIALIZED): The SDK is not initialized.
     */
    function leaveChannel() {
        if (isWeb) {
            client.leave(function () {
                event.emit('leave-channel', null);
                event.emit('leaveChannel', null);
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.LEAVE_CHANNEL);
    }
    agora.leaveChannel = leaveChannel;
    /** Gets a new token when the current token expires after a period of time.

     The `token` expires after a period of time once the token schema is enabled when:

     - The SDK triggers the \ref IRtcEngineEventHandler::onTokenPrivilegeWillExpire "onTokenPrivilegeWillExpire" callback, or
     - The \ref IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" reports CONNECTION_CHANGED_TOKEN_EXPIRED(9).

     The application should call this method to get the new `token`. Failure to do so will result in the SDK disconnecting from the server.

     @param token Pointer to the new token.

     @return
         - 0(ERR_OK): Success.
     - < 0: Failure.
     - -1(ERR_FAILED): A general error occurs (no specified reason).
     - -2(ERR_INALID_ARGUMENT): The parameter is invalid.
     - -7(ERR_NOT_INITIALIZED): The SDK is not initialized.
     */
    function renewToken(token) {
        if (isWeb) {
            client.renewToken(token);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.RE_NEW_TOKEN, { token: token });
    }
    agora.renewToken = renewToken;
    /** Registers a user account.

     Once registered, the user account can be used to identify the local user when the user joins the channel.
     After the user successfully registers a user account, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onLocalUserRegistered "onLocalUserRegistered" callback on the local client,
     reporting the user ID and user account of the local user.

     To join a channel with a user account, you can choose either of the following:

     - Call the \ref agora::rtc::IRtcEngine::registerLocalUserAccount "registerLocalUserAccount" method to create a user account, and then the \ref agora::rtc::IRtcEngine::joinChannelWithUserAccount "joinChannelWithUserAccount" method to join the channel.
     - Call the \ref agora::rtc::IRtcEngine::joinChannelWithUserAccount "joinChannelWithUserAccount" method to join the channel.

     The difference between the two is that for the former, the time elapsed between calling the \ref agora::rtc::IRtcEngine::joinChannelWithUserAccount "joinChannelWithUserAccount" method
     and joining the channel is shorter than the latter.

     @note
     - Ensure that you set the `userAccount` parameter. Otherwise, this method does not take effect.
     - Ensure that the value of the `userAccount` parameter is unique in the channel.
     - To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account. If a user joins the channel with the Agora Web SDK, ensure that the uid of the user is set to the same parameter type.

     @param appId The App ID of your project.
     @param userAccount The user account. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported character scopes are:
     - All lowercase English letters: a to z.
     - All uppercase English letters: A to Z.
     - All numeric characters: 0 to 9.
     - The space character.
     - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function registerLocalUserAccount(appId, userAccount) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.REGISTER_LOCAL_USER_ACCOUNT, { appId: appId, userAccount: userAccount });
    }
    agora.registerLocalUserAccount = registerLocalUserAccount;
    /** Joins the channel with a user account.

     After the user successfully joins the channel, the SDK triggers the following callbacks:

     - The local client: \ref agora::rtc::IRtcEngineEventHandler::onLocalUserRegistered "onLocalUserRegistered" and \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" .
     The remote client: \ref agora::rtc::IRtcEngineEventHandler::onUserJoined "onUserJoined" and \ref agora::rtc::IRtcEngineEventHandler::onUserInfoUpdated "onUserInfoUpdated" , if the user joining the channel is in the `COMMUNICATION` profile, or is a host in the `LIVE_BROADCASTING` profile.

     @note To ensure smooth communication, use the same parameter type to identify the user. For example, if a user joins the channel with a user ID, then ensure all the other users use the user ID too. The same applies to the user account.
     If a user joins the channel with the Agora Web SDK, ensure that the uid of the user is set to the same parameter type.

     @param token The token generated at your server:
     - For low-security requirements: You can use the temporary token generated at Console. For details, see [Get a temporary toke](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-temporary-token).
     - For high-security requirements: Set it as the token generated at your server. For details, see [Get a token](https://docs.agora.io/en/Voice/token?platform=All%20Platforms#get-a-token).
     @param channelId The channel name. The maximum length of this parameter is 64 bytes. Supported character scopes are:
     - All lowercase English letters: a to z.
     - All uppercase English letters: A to Z.
     - All numeric characters: 0 to 9.
     - The space character.
     - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
     @param userAccount The user account. The maximum length of this parameter is 255 bytes. Ensure that you set this parameter and do not set it as null. Supported character scopes are:
     - All lowercase English letters: a to z.
     - All uppercase English letters: A to Z.
     - All numeric characters: 0 to 9.
     - The space character.
     - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".

     @return
         - 0: Success.
     - < 0: Failure.
     - #ERR_INVALID_ARGUMENT (-2)
     - #ERR_NOT_READY (-3)
     - #ERR_REFUSED (-5)
     */
    function joinChannelWithUserAccount(token, channelId, userAccount) {
        if (isWeb) {
            client.join(token, channelId, userAccount, function (uid) {
                var spec = { streamID: uid, audio: true, video: true, screen: false };
                localStream = AgoraRTC.createStream(spec);
                localStream.init(function () {
                    localStream.play('Cocos2dGameContainer');
                    client.publish(localStream);
                });
                event.emit('join-channel-success', channelId, uid, 0);
                event.emit('joinChannelSuccess', channelId, uid, 0);
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.JOIN_CHANNEL_WITH_USER_ACCOUNT, { token: token, channelId: channelId, userAccount: userAccount });
    }
    agora.joinChannelWithUserAccount = joinChannelWithUserAccount;
    /** Gets the user information by passing in the user account.

     After a remote user joins the channel, the SDK gets the user ID and user account of the remote user, caches them
     in a mapping table object (`userInfo`), and triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserInfoUpdated "onUserInfoUpdated" callback on the local client.

     After receiving the o\ref agora::rtc::IRtcEngineEventHandler::onUserInfoUpdated "onUserInfoUpdated" callback, you can call this method to get the user ID of the
     remote user from the `userInfo` object by passing in the user account.

     @param userAccount The user account of the user. Ensure that you set this parameter.
     @param [in,out] userInfo  A userInfo object that identifies the user:
     - Input: A userInfo object.
     - Output: A userInfo object that contains the user account and user ID of the user.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function getUserInfoByUserAccount(userAccount) {
        if (isWeb) {
            return null;
        }
        return callNativeMethod(API_TYPE.GET_USER_INFO_BY_USER_ACCOUNT, { userAccount: userAccount });
    }
    agora.getUserInfoByUserAccount = getUserInfoByUserAccount;
    /** Gets the user information by passing in the user ID.

     After a remote user joins the channel, the SDK gets the user ID and user account of the remote user,
     caches them in a mapping table object (`userInfo`), and triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserInfoUpdated "onUserInfoUpdated" callback on the local client.

     After receiving the \ref agora::rtc::IRtcEngineEventHandler::onUserInfoUpdated "onUserInfoUpdated" callback, you can call this method to get the user account of the remote user
     from the `userInfo` object by passing in the user ID.

     @param uid The user ID of the remote user. Ensure that you set this parameter.
     @param[in,out] userInfo A userInfo object that identifies the user:
     - Input: A userInfo object.
     - Output: A userInfo object that contains the user account and user ID of the user.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function getUserInfoByUid(uid) {
        if (isWeb) {
            return null;
        }
        return callNativeMethod(API_TYPE.GET_USER_INFO_BY_UID, { uid: uid });
    }
    agora.getUserInfoByUid = getUserInfoByUid;
    /** Starts an audio call test.

     This method starts an audio call test to determine whether the audio devices (for example, headset and speaker) and the network connection are working properly.

     In the audio call test, you record your voice. If the recording plays back within the set time interval, the audio devices and the network connection are working properly.

     @note
     - Call this method before joining a channel.
     - After calling this method, call the \ref IRtcEngine::stopEchoTest "stopEchoTest" method to end the test. Otherwise, the app cannot run the next echo test, or call the \ref IRtcEngine::joinChannel "joinChannel" method.
     - In the `LIVE_BROADCASTING` profile, only a host can call this method.
     @param intervalInSeconds The time interval (s) between when you speak and when the recording plays back.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function startEchoTest(intervalInSeconds) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        if (intervalInSeconds === undefined) {
            return callNativeMethod(API_TYPE.START_ECHO_TEST);
        }
        return callNativeMethod(API_TYPE.START_ECHO_TEST_2, { intervalInSeconds: intervalInSeconds });
    }
    agora.startEchoTest = startEchoTest;
    /** Stops the audio call test.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function stopEchoTest() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.STOP_ECHO_TEST);
    }
    agora.stopEchoTest = stopEchoTest;
    /** Enables the video module.

     Call this method either before joining a channel or during a call. If this method is called before joining a channel, the call starts in the video mode. If this method is called during an audio call, the audio mode switches to the video mode. To disable the video module, call the \ref IRtcEngine::disableVideo "disableVideo" method.

     A successful \ref agora::rtc::IRtcEngine::enableVideo "enableVideo" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserEnableVideo "onUserEnableVideo" (true) callback on the remote client.
     @note
     - This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.
     - This method resets the internal engine and takes some time to take effect. We recommend using the following API methods to control the video engine modules separately:
     - \ref IRtcEngine::enableLocalVideo "enableLocalVideo": Whether to enable the camera to create the local video stream.
     - \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream": Whether to publish the local video stream.
     - \ref IRtcEngine::muteRemoteVideoStream "muteRemoteVideoStream": Whether to subscribe to and play the remote video stream.
     - \ref IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams": Whether to subscribe to and play all remote video streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableVideo() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_VIDEO);
    }
    agora.enableVideo = enableVideo;
    /** Disables the video module.

     This method can be called before joining a channel or during a call. If this method is called before joining a channel, the call starts in audio mode. If this method is called during a video call, the video mode switches to the audio mode. To enable the video module, call the \ref IRtcEngine::enableVideo "enableVideo" method.

     A successful \ref agora::rtc::IRtcEngine::disableVideo "disableVideo" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserEnableVideo "onUserEnableVideo" (false) callback on the remote client.
     @note
     - This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.
     - This method resets the internal engine and takes some time to take effect. We recommend using the following API methods to control the video engine modules separately:
     - \ref IRtcEngine::enableLocalVideo "enableLocalVideo": Whether to enable the camera to create the local video stream.
     - \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream": Whether to publish the local video stream.
     - \ref IRtcEngine::muteRemoteVideoStream "muteRemoteVideoStream": Whether to subscribe to and play the remote video stream.
     - \ref IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams": Whether to subscribe to and play all remote video streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function disableVideo() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.DISABLE_VIDEO);
    }
    agora.disableVideo = disableVideo;
    /** **DEPRECATED** Sets the video profile.

     This method is deprecated as of v2.3. Use the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method instead.

     Each video profile includes a set of parameters, such as the resolution, frame rate, and bitrate. If the camera device does not support the specified resolution, the SDK automatically chooses a suitable camera resolution, keeping the encoder resolution specified by the *setVideoProfile* method.

     @note
     - If you do not need to set the video profile after joining the channel, call this method before the \ref IRtcEngine::enableVideo "enableVideo" method to reduce the render time of the first video frame.
     - Always set the video profile before calling the \ref IRtcEngine::joinChannel "joinChannel" or \ref IRtcEngine::startPreview "startPreview" method.

     @param profile Sets the video profile. See #VIDEO_PROFILE_TYPE.
     @param swapWidthAndHeight Sets whether to swap the width and height of the video stream:
     - true: Swap the width and height.
     - false: (Default) Do not swap the width and height.
     The width and height of the output video are consistent with the set video profile.
     @note Since the landscape or portrait mode of the output video can be decided directly by the video profile, We recommend setting *swapWidthAndHeight* to *false* (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setVideoProfile(profile, swapWidthAndHeight) {
        var _a;
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                var profiles = (_a = {},
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_120P] = '120p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_120P_3] = '120p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P] = '180p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P_3] = '180p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P_4] = '180p_4',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P] = '240p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P_3] = '240p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P_4] = '240p_4',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P] = '360p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_3] = '360p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_4] = '360p_4',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_6] = '360p_6',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_7] = '360p_7',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_8] = '360p_8',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_9] = '360p_9',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_10] = '360p_10',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_11] = '360p_11',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P] = '480p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_3] = '480p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_4] = '480p_4',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_6] = '480p_6',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_8] = '480p_8',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_9] = '480p_9',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_10] = '480p_10',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P] = '720p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_3] = '720p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_5] = '720p_5',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_6] = '720p_6',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P] = '1080p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P_3] = '1080p_3',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P_5] = '1080p_5',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1440P] = '1440p_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1440P_2] = '1440p_2',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_4K] = '4K_1',
                    _a[VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_4K_3] = '4K_3',
                    _a);
                if (profiles[profile] === undefined) {
                    return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
                }
                else {
                    localStream.setVideoProfile(profiles[profile]);
                    return ERROR_CODE_TYPE.ERR_OK;
                }
            }
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_PROFILE, { profile: profile, swapWidthAndHeight: swapWidthAndHeight });
    }
    agora.setVideoProfile = setVideoProfile;
    /** Sets the video encoder configuration.

     Each video encoder configuration corresponds to a set of video parameters, including the resolution, frame rate, bitrate, and video orientation.

     The parameters specified in this method are the maximum values under ideal network conditions. If the video engine cannot render the video using the specified parameters due to poor network conditions, the parameters further down the list are considered until a successful configuration is found.

     @note If you do not need to set the video encoder configuration after joining the channel, you can call this method before the \ref IRtcEngine::enableVideo "enableVideo" method to reduce the render time of the first video frame.

     @param config Sets the local video encoder configuration. See VideoEncoderConfiguration.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setVideoEncoderConfiguration(config) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                var configuration = {
                    resolution: { width: config.dimensions.width, height: config.dimensions.height },
                    frameRate: { max: config.frameRate, min: config.minFrameRate },
                    bitrate: { max: config.bitrate, min: config.minBitrate }
                };
                localStream.setVideoEncoderConfiguration(configuration);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_ENCODER_CONFIGURATION, { config: config });
    }
    agora.setVideoEncoderConfiguration = setVideoEncoderConfiguration;
    /** Sets the camera capture configuration.

     For a video call or the live interactive video streaming, generally the SDK controls the camera output parameters. When the default camera capturer settings do not meet special requirements or cause performance problems, we recommend using this method to set the camera capturer configuration:

     - If the resolution or frame rate of the captured raw video data are higher than those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration", processing video frames requires extra CPU and RAM usage and degrades performance. We recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1 to avoid such problems.
     - If you do not need local video preview or are willing to sacrifice preview quality, we recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1 to optimize CPU and RAM usage.
     - If you want better quality for the local video preview, we recommend setting config as CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2.

     @note Call this method before enabling the local camera. That said, you can call this method before calling \ref agora::rtc::IRtcEngine::joinChannel "joinChannel", \ref agora::rtc::IRtcEngine::enableVideo "enableVideo", or \ref IRtcEngine::enableLocalVideo "enableLocalVideo", depending on which method you use to turn on your local camera.

     @param config Sets the camera capturer configuration. See CameraCapturerConfiguration.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setCameraCapturerConfiguration(config) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_CAMERA_CAPTURER_CONFIGURATION, { config: config });
    }
    agora.setCameraCapturerConfiguration = setCameraCapturerConfiguration;
    /** Starts the local video preview before joining the channel.

     Before calling this method, you must:

     - Call the \ref IRtcEngine::setupLocalVideo "setupLocalVideo" method to set up the local preview window and configure the attributes.
     - Call the \ref IRtcEngine::enableVideo "enableVideo" method to enable video.

     @note Once the startPreview method is called to start the local video preview, if you leave the channel by calling the \ref IRtcEngine::leaveChannel "leaveChannel" method, the local video preview remains until you call the \ref IRtcEngine::stopPreview "stopPreview" method to disable it.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function startPreview() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.START_PREVIEW);
    }
    agora.startPreview = startPreview;
    /** Prioritizes a remote user's stream.

     Use this method with the \ref IRtcEngine::setRemoteSubscribeFallbackOption "setRemoteSubscribeFallbackOption" method. If the fallback function is enabled for a subscribed stream, the SDK ensures the high-priority user gets the best possible stream quality.

     @note The Agora SDK supports setting @p userPriority as high for one user only.

     @param  uid  The ID of the remote user.
     @param  userPriority Sets the priority of the remote user. See #PRIORITY_TYPE.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteUserPriority(uid, userPriority) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_USER_PRIORITY, { uid: uid, userPriority: userPriority });
    }
    agora.setRemoteUserPriority = setRemoteUserPriority;
    /** Stops the local video preview and disables video.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function stopPreview() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.STOP_PREVIEW);
    }
    agora.stopPreview = stopPreview;
    /** Enables the audio module.

     The audio mode is enabled by default.

     @note
     - This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method. You can call this method either before or after joining a channel.
     - This method resets the internal engine and takes some time to take effect. We recommend using the following API methods to control the audio engine modules separately:
     - \ref IRtcEngine::enableLocalAudio "enableLocalAudio": Whether to enable the microphone to create the local audio stream.
     - \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream": Whether to publish the local audio stream.
     - \ref IRtcEngine::muteRemoteAudioStream "muteRemoteAudioStream": Whether to subscribe to and play the remote audio stream.
     - \ref IRtcEngine::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams": Whether to subscribe to and play all remote audio streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableAudio() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_AUDIO);
    }
    agora.enableAudio = enableAudio;
    /** Disables/Re-enables the local audio function.

     The audio function is enabled by default. This method disables or re-enables the local audio function, that is, to stop or restart local audio capturing.

     This method does not affect receiving or playing the remote audio streams,and enableLocalAudio(false) is applicable to scenarios where the user wants to
     receive remote audio streams without sending any audio stream to other users in the channel.

     Once the local audio function is disabled or re-enabled, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onLocalAudioStateChanged "onLocalAudioStateChanged" callback,
     which reports `LOCAL_AUDIO_STREAM_STATE_STOPPED(0)` or `LOCAL_AUDIO_STREAM_STATE_RECORDING(1)`.

     @note
     This method is different from the \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method:
     - \ref agora::rtc::IRtcEngine::enableLocalAudio "enableLocalAudio": Disables/Re-enables the local audio capturing and processing.
     If you disable or re-enable local audio recording using the `enableLocalAudio` method, the local user may hear a pause in the remote audio playback.
     - \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream": Sends/Stops sending the local audio streams.

     @param enabled Sets whether to disable/re-enable the local audio function:
     - true: (Default) Re-enable the local audio function, that is, to start the local audio capturing device (for example, the microphone).
     - false: Disable the local audio function, that is, to stop local audio capturing.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableLocalAudio(enabled) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (enabled) {
                    localStream.enableAudio();
                }
                else {
                    localStream.disableAudio();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.ENABLE_LOCAL_AUDIO, { enabled: enabled });
    }
    agora.enableLocalAudio = enableLocalAudio;
    /** Disables the audio module.

     @note
     - This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method. You can call this method either before or after joining a channel.
     - This method resets the internal engine and takes some time to take effect. We recommend using the \ref agora::rtc::IRtcEngine::enableLocalAudio "enableLocalAudio" and \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" methods to capture, process, and send the local audio streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function disableAudio() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.DISABLE_AUDIO);
    }
    agora.disableAudio = disableAudio;
    /** Sets the audio parameters and application scenarios.

     @note
     - The *setAudioProfile* method must be called before the \ref IRtcEngine::joinChannel "joinChannel" method.
     - In the `COMMUNICATION` and `LIVE_BROADCASTING` profiles, the bitrate may be different from your settings due to network self-adaptation.
     - In scenarios requiring high-quality audio, for example, a music teaching scenario, we recommend setting profile as AUDIO_PROFILE_MUSIC_HIGH_QUALITY (4) and  scenario as AUDIO_SCENARIO_GAME_STREAMING (3).

     @param  profile Sets the sample rate, bitrate, encoding mode, and the number of channels. See #AUDIO_PROFILE_TYPE.
     @param  scenario Sets the audio application scenario. See #AUDIO_SCENARIO_TYPE.
     Under different audio scenarios, the device uses different volume tracks,
     i.e. either the in-call volume or the media volume. For details, see
     [What is the difference between the in-call volume and the media volume?](https://docs.agora.io/en/faq/system_volume).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setAudioProfile(profile, scenario) {
        var _a;
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                var profiles = (_a = {},
                    _a[AUDIO_PROFILE_TYPE.AUDIO_PROFILE_SPEECH_STANDARD] = 'speech_standard',
                    _a[AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_STANDARD] = 'music_standard',
                    _a[AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_STANDARD_STEREO] = 'standard_stereo',
                    _a[AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_HIGH_QUALITY] = 'high_quality',
                    _a[AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO] = 'high_quality_stereo',
                    _a);
                if (profiles[profile] === undefined) {
                    return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
                }
                else {
                    localStream.setAudioProfile(profiles[profile]);
                    return ERROR_CODE_TYPE.ERR_OK;
                }
            }
        }
        return callNativeMethod(API_TYPE.SET_AUDIO_PROFILE, { profile: profile, scenario: scenario });
    }
    agora.setAudioProfile = setAudioProfile;
    /** Stops/Resumes sending the local audio stream.

     A successful \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserMuteAudio "onUserMuteAudio" callback on the remote client.
     @note
     - When @p mute is set as @p true, this method does not disable the microphone, which does not affect any ongoing recording.
     - If you call \ref agora::rtc::IRtcEngine::setChannelProfile "setChannelProfile" after this method, the SDK resets whether or not to mute the local audio according to the channel profile and user role. Therefore, we recommend calling this method after the `setChannelProfile` method.

     @param mute Sets whether to send/stop sending the local audio stream:
     - true: Stops sending the local audio stream.
     - false: (Default) Sends the local audio stream.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function muteLocalAudioStream(mute) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (mute) {
                    localStream.muteAudio();
                }
                else {
                    localStream.unmuteAudio();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.MUTE_LOCAL_AUDIO_STREAM, { mute: mute });
    }
    agora.muteLocalAudioStream = muteLocalAudioStream;
    /** Stops/Resumes receiving all remote users' audio streams.

     @param mute Sets whether to receive/stop receiving all remote users' audio streams.
     - true: Stops receiving all remote users' audio streams.
     - false: (Default) Receives all remote users' audio streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function muteAllRemoteAudioStreams(mute) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.MUTE_ALL_REMOTE_AUDIO_STREAMS, { mute: mute });
    }
    agora.muteAllRemoteAudioStreams = muteAllRemoteAudioStreams;
    /** Stops/Resumes receiving all remote users' audio streams by default.

     You can call this method either before or after joining a channel. If you call `setDefaultMuteAllRemoteAudioStreams (true)` after joining a channel, the remote audio streams of all subsequent users are not received.

     @note If you want to resume receiving the audio stream, call \ref agora::rtc::IRtcEngine::muteRemoteAudioStream "muteRemoteAudioStream (false)",
     and specify the ID of the remote user whose audio stream you want to receive.
     To receive the audio streams of multiple remote users, call `muteRemoteAudioStream (false)` as many times.
     Calling `setDefaultMuteAllRemoteAudioStreams (false)` resumes receiving the audio streams of subsequent users only.

     @param mute Sets whether to receive/stop receiving all remote users' audio streams by default:
     - true:  Stops receiving all remote users' audio streams by default.
     - false: (Default) Receives all remote users' audio streams by default.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setDefaultMuteAllRemoteAudioStreams(mute) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS, { mute: mute });
    }
    agora.setDefaultMuteAllRemoteAudioStreams = setDefaultMuteAllRemoteAudioStreams;
    /** Adjusts the playback volume of a specified remote user.

     You can call this method as many times as necessary to adjust the playback volume of different remote users, or to repeatedly adjust the playback volume of the same remote user.

     @note
     - Call this method after joining a channel.
     - The playback volume here refers to the mixed volume of a specified remote user.
     - This method can only adjust the playback volume of one specified remote user at a time. To adjust the playback volume of different remote users, call the method as many times, once for each remote user.

     @param uid The ID of the remote user.
     @param volume The playback volume of the specified remote user. The value ranges from 0 to 100:
     - 0: Mute.
     - 100: Original volume.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustUserPlaybackSignalVolume(uid, volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ADJUST_USER_PLAYBACK_SIGNAL_VOLUME, { uid: uid, volume: volume });
    }
    agora.adjustUserPlaybackSignalVolume = adjustUserPlaybackSignalVolume;
    /** Stops/Resumes receiving a specified remote user's audio stream.

     @note If you called the \ref agora::rtc::IRtcEngine::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams" method and set @p mute as @p true to stop receiving all remote users' audio streams, call the *muteAllRemoteAudioStreams* method and set @p mute as @p false before calling this method. The *muteAllRemoteAudioStreams* method sets all remote audio streams, while the *muteRemoteAudioStream* method sets a specified remote audio stream.

     @param userId User ID of the specified remote user sending the audio.
     @param mute Sets whether to receive/stop receiving a specified remote user's audio stream:
     - true: Stops receiving the specified remote user's audio stream.
     - false: (Default) Receives the specified remote user's audio stream.

     @return
         - 0: Success.
     - < 0: Failure.

     */
    function muteRemoteAudioStream(userId, mute) {
        if (isWeb) {
            var stream = remoteStreams.get(userId);
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (mute) {
                    stream.muteAudio();
                }
                else {
                    stream.unmuteAudio();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.MUTE_REMOTE_AUDIO_STREAM, { userId: userId, mute: mute });
    }
    agora.muteRemoteAudioStream = muteRemoteAudioStream;
    /** Stops/Resumes sending the local video stream.

     A successful \ref agora::rtc::IRtcEngine::muteLocalVideoStream "muteLocalVideoStream" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserMuteVideo "onUserMuteVideo" callback on the remote client.

     @note
     - When set to *true*, this method does not disable the camera which does not affect the retrieval of the local video streams. This method executes faster than the \ref agora::rtc::IRtcEngine::enableLocalVideo "enableLocalVideo" method which controls the sending of the local video stream.
     - If you call \ref agora::rtc::IRtcEngine::setChannelProfile "setChannelProfile" after this method, the SDK resets whether or not to mute the local video according to the channel profile and user role. Therefore, we recommend calling this method after the `setChannelProfile` method.

     @param mute Sets whether to send/stop sending the local video stream:
     - true: Stop sending the local video stream.
     - false: (Default) Send the local video stream.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function muteLocalVideoStream(mute) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (mute) {
                    localStream.muteVideo();
                }
                else {
                    localStream.unmuteVideo();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.MUTE_LOCAL_VIDEO_STREAM, { mute: mute });
    }
    agora.muteLocalVideoStream = muteLocalVideoStream;
    /** Enables/Disables the local video capture.

     This method disables or re-enables the local video capturer, and does not affect receiving the remote video stream.

     After you call the \ref agora::rtc::IRtcEngine::enableVideo "enableVideo" method, the local video capturer is enabled by default. You can call \ref agora::rtc::IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local video capturer. If you want to re-enable it, call \ref agora::rtc::IRtcEngine::enableLocalVideo "enableLocalVideo(true)".

     After the local video capturer is successfully disabled or re-enabled, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onUserEnableLocalVideo "onUserEnableLocalVideo" callback on the remote client.

     @note This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.

     @param enabled Sets whether to disable/re-enable the local video, including the capturer, renderer, and sender:
     - true: (Default) Re-enable the local video.
     - false: Disable the local video. Once the local video is disabled, the remote users can no longer receive the video stream of this user, while this user can still receive the video streams of the other remote users.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableLocalVideo(enabled) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (enabled) {
                    localStream.enableVideo();
                }
                else {
                    localStream.disableVideo();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.ENABLE_LOCAL_VIDEO, { enabled: enabled });
    }
    agora.enableLocalVideo = enableLocalVideo;
    /** Stops/Resumes receiving all video stream from a specified remote user.

     @param  mute Sets whether to receive/stop receiving all remote users' video streams:
     - true: Stop receiving all remote users' video streams.
     - false: (Default) Receive all remote users' video streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function muteAllRemoteVideoStreams(mute) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.MUTE_ALL_REMOTE_VIDEO_STREAMS, { mute: mute });
    }
    agora.muteAllRemoteVideoStreams = muteAllRemoteVideoStreams;
    /** Stops/Resumes receiving all remote users' video streams by default.

     You can call this method either before or after joining a channel. If you call `setDefaultMuteAllRemoteVideoStreams (true)` after joining a channel, the remote video streams of all subsequent users are not received.

     @note If you want to resume receiving the video stream, call \ref agora::rtc::IRtcEngine::muteRemoteVideoStream "muteRemoteVideoStream (false)", and specify the ID of the remote user whose video stream you want to receive. To receive the video streams of multiple remote users, call `muteRemoteVideoStream (false)` as many times. Calling `setDefaultMuteAllRemoteVideoStreams (false)` resumes receiving the video streams of subsequent users only.

     @param mute Sets whether to receive/stop receiving all remote users' video streams by default:
     - true: Stop receiving all remote users' video streams by default.
     - false: (Default) Receive all remote users' video streams by default.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setDefaultMuteAllRemoteVideoStreams(mute) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS, { mute: mute });
    }
    agora.setDefaultMuteAllRemoteVideoStreams = setDefaultMuteAllRemoteVideoStreams;
    /** Stops/Resumes receiving the video stream from a specified remote user.

     @note If you called the \ref agora::rtc::IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams" method and set @p mute as @p true to stop receiving all remote video streams, call the *muteAllRemoteVideoStreams* method and set @p mute as @p false before calling this method.

     @param userId User ID of the specified remote user.
     @param mute Sets whether to stop/resume receiving the video stream from a specified remote user:
     - true: Stop receiving the specified remote user's video stream.
     - false: (Default) Receive the specified remote user's video stream.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function muteRemoteVideoStream(userId, mute) {
        if (isWeb) {
            var stream = remoteStreams.get(userId);
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                if (mute) {
                    stream.muteVideo();
                }
                else {
                    stream.unmuteVideo();
                }
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.MUTE_REMOTE_VIDEO_STREAM, { userId: userId, mute: mute });
    }
    agora.muteRemoteVideoStream = muteRemoteVideoStream;
    /** Sets the stream type of the remote video.

     Under limited network conditions, if the publisher has not disabled the dual-stream mode using `enableDualStreamMode(false)`,
     the receiver can choose to receive either the high-quality video stream (the high resolution, and high bitrate video stream) or
     the low-video stream (the low resolution, and low bitrate video stream).

     By default, users receive the high-quality video stream. Call this method if you want to switch to the low-video stream.
     This method allows the app to adjust the corresponding video stream type based on the size of the video window to
     reduce the bandwidth and resources.

     The aspect ratio of the low-video stream is the same as the high-quality video stream. Once the resolution of the high-quality video
     stream is set, the system automatically sets the resolution, frame rate, and bitrate of the low-video stream.

     The method result returns in the \ref agora::rtc::IRtcEngineEventHandler::onApiCallExecuted "onApiCallExecuted" callback.

     @param userId ID of the remote user sending the video stream.
     @param streamType  Sets the video-stream type. See #REMOTE_VIDEO_STREAM_TYPE.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteVideoStreamType(userId, streamType) {
        if (isWeb) {
            var stream = remoteStreams.get(userId);
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                client.setRemoteVideoStreamType(stream, streamType);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_VIDEO_STREAM_TYPE, { userId: userId, streamType: streamType });
    }
    agora.setRemoteVideoStreamType = setRemoteVideoStreamType;
    /** Sets the default stream type of remote videos.

     Under limited network conditions, if the publisher has not disabled the dual-stream mode using `enableDualStreamMode(false)`,
     the receiver can choose to receive either the high-quality video stream (the high resolution, and high bitrate video stream) or
     the low-video stream (the low resolution, and low bitrate video stream).

     By default, users receive the high-quality video stream. Call this method if you want to switch to the low-video stream.
     This method allows the app to adjust the corresponding video stream type based on the size of the video window to
     reduce the bandwidth and resources. The aspect ratio of the low-video stream is the same as the high-quality video stream.
     Once the resolution of the high-quality video
     stream is set, the system automatically sets the resolution, frame rate, and bitrate of the low-video stream.

     The method result returns in the \ref agora::rtc::IRtcEngineEventHandler::onApiCallExecuted "onApiCallExecuted" callback.

     @param streamType Sets the default video-stream type. See #REMOTE_VIDEO_STREAM_TYPE.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteDefaultVideoStreamType(streamType) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE, { streamType: streamType });
    }
    agora.setRemoteDefaultVideoStreamType = setRemoteDefaultVideoStreamType;
    /** Enables the \ref agora::rtc::IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication" callback at a set time interval to report on which users are speaking and the speakers' volume.

     Once this method is enabled, the SDK returns the volume indication in the \ref agora::rtc::IRtcEngineEventHandler::onAudioVolumeIndication "onAudioVolumeIndication" callback at the set time interval, whether or not any user is speaking in the channel.

     @param interval Sets the time interval between two consecutive volume indications:
     - &le; 0: Disables the volume indication.
     - > 0: Time interval (ms) between two consecutive volume indications. We recommend setting @p interval &gt; 200 ms. Do not set @p interval &lt; 10 ms, or the *onAudioVolumeIndication* callback will not be triggered.
     @param smooth  Smoothing factor sets the sensitivity of the audio volume indicator. The value ranges between 0 and 10. The greater the value, the more sensitive the indicator. The recommended value is 3.
     @param report_vad

     - true: Enable the voice activity detection of the local user. Once it is enabled, the `vad` parameter of the `onAudioVolumeIndication` callback reports the voice activity status of the local user.
     - false: (Default) Disable the voice activity detection of the local user. Once it is disabled, the `vad` parameter of the `onAudioVolumeIndication` callback does not report the voice activity status of the local user, except for the scenario where the engine automatically detects the voice activity of the local user.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableAudioVolumeIndication(interval, smooth, report_vad) {
        if (isWeb) {
            client.enableAudioVolumeIndicator();
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.ENABLE_AUDIO_VOLUME_INDICATION, { interval: interval, smooth: smooth, report_vad: report_vad });
    }
    agora.enableAudioVolumeIndication = enableAudioVolumeIndication;
    /** Starts an audio recording on the client.
     *
     * The SDK allows recording during a call. After successfully calling this method, you can record the audio of all the users in the channel and get an audio recording file.
     * Supported formats of the recording file are as follows:
     * - .wav: Large file size with high fidelity.
     * - .aac: Small file size with low fidelity.
     *
     * @note
     * - Ensure that the directory you use to save the recording file exists and is writable.
     * - This method is usually called after the `joinChannel` method. The recording automatically stops when you call the `leaveChannel` method.
     * - For better recording effects, set quality as #AUDIO_RECORDING_QUALITY_MEDIUM or #AUDIO_RECORDING_QUALITY_HIGH when `sampleRate` is 44.1 kHz or 48 kHz.
     *
     * @param filePath Pointer to the absolute file path of the recording file. The string of the file name is in UTF-8, such as c:/music/audio.aac.
     * @param sampleRate Sample rate (kHz) of the recording file. Supported values are as follows:
     * - 16
     * - (Default) 32
     * - 44.1
     * - 48
     * @param quality Sets the audio recording quality. See #AUDIO_RECORDING_QUALITY_TYPE.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function startAudioRecording(filePath, quality, sampleRate) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        if (sampleRate === undefined) {
            return callNativeMethod(API_TYPE.START_AUDIO_RECORDING, { filePath: filePath, quality: quality });
        }
        return callNativeMethod(API_TYPE.START_AUDIO_RECORDING2, { filePath: filePath, sampleRate: sampleRate, quality: quality });
    }
    agora.startAudioRecording = startAudioRecording;
    /** Stops an audio recording on the client.

     You can call this method before calling the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method else, the recording automatically stops when the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method is called.

     @return
         - 0: Success
     - < 0: Failure.
     */
    function stopAudioRecording() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.STOP_AUDIO_RECORDING);
    }
    agora.stopAudioRecording = stopAudioRecording;
    /** Starts playing and mixing the music file.

     This method mixes the specified local audio file with the audio stream from the microphone, or replaces the microphone's audio stream with the specified local audio file. You can choose whether the other user can hear the local audio playback and specify the number of playback loops. This method also supports online music playback.

     When the audio mixing file playback finishes after calling this method, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onAudioMixingFinished "onAudioMixingFinished" callback.

     A successful \ref agora::rtc::IRtcEngine::startAudioMixing "startAudioMixing" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onAudioMixingStateChanged "onAudioMixingStateChanged" (PLAY) callback on the local client.

     When the audio mixing file playback finishes, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onAudioMixingStateChanged "onAudioMixingStateChanged" (STOPPED) callback on the local client.
     @note
     - Call this method after joining a channel, otherwise issues may occur.
     - If the local audio mixing file does not exist, or if the SDK does not support the file format or cannot access the music file URL, the SDK returns WARN_AUDIO_MIXING_OPEN_ERROR = 701.
     - If you want to play an online music file, ensure that the time interval between calling this method is more than 100 ms, or the AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL(702) error code occurs.
     @param filePath Pointer to the absolute path (including the suffixes of the filename) of the local or online audio file to mix, for example, c:/music/audio.mp4. Supported audio formats: 3GP, ASF, ADTS, AVI, MP3, MP4, MPEG-4, SAMI, and WAVE. For more information, see [Supported Media Formats in Media Foundation](https://docs.microsoft.com/en-us/windows/desktop/medfound/supported-media-formats-in-media-foundation).
     @param loopback Sets which user can hear the audio mixing:
     - true: Only the local user can hear the audio mixing.
     - false: Both users can hear the audio mixing.
     @param replace Sets the audio mixing content:
     - true: Only publish the specified audio file. The audio stream from the microphone is not published.
     - false: The local audio file is mixed with the audio stream from the microphone.
     @param cycle Sets the number of playback loops:
     - Positive integer: Number of playback loops.
     - `-1`: Infinite playback loops.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function startAudioMixing(filePath, loopback, replace, cycle) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.startAudioMixing({ filePath: filePath, cycle: cycle, loop: loopback, playTime: 0, replace: replace });
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.START_AUDIO_MIXING, {
            filePath: filePath,
            loopback: loopback,
            replace: replace,
            cycle: cycle
        });
    }
    agora.startAudioMixing = startAudioMixing;
    /** Stops playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function stopAudioMixing() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.stopAudioMixing();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_AUDIO_MIXING);
    }
    agora.stopAudioMixing = stopAudioMixing;
    /** Pauses playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function pauseAudioMixing() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.pauseAudioMixing();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_AUDIO_MIXING);
    }
    agora.pauseAudioMixing = pauseAudioMixing;
    /** Resumes playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function resumeAudioMixing() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.resumeAudioMixing();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_AUDIO_MIXING);
    }
    agora.resumeAudioMixing = resumeAudioMixing;
    /** **DEPRECATED** Agora does not recommend using this method.

     Sets the high-quality audio preferences. Call this method and set all parameters before joining a channel.

     Do not call this method again after joining a channel.

     @param fullband Sets whether to enable/disable full-band codec (48-kHz sample rate). Not compatible with SDK versions before v1.7.4:
     - true: Enable full-band codec.
     - false: Disable full-band codec.
     @param  stereo Sets whether to enable/disable stereo codec. Not compatible with SDK versions before v1.7.4:
     - true: Enable stereo codec.
     - false: Disable stereo codec.
     @param fullBitrate Sets whether to enable/disable high-bitrate mode. Recommended in voice-only mode:
     - true: Enable high-bitrate mode.
     - false: Disable high-bitrate mode.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setHighQualityAudioParameters(fullband, stereo, fullBitrate) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_HIGH_QUALITY_AUDIO_PARAMETERS, {
            fullband: fullband,
            stereo: stereo,
            fullBitrate: fullBitrate
        });
    }
    agora.setHighQualityAudioParameters = setHighQualityAudioParameters;
    /** Adjusts the volume during audio mixing.

     Call this method when you are in a channel.

     @note Calling this method does not affect the volume of audio effect file playback invoked by the \ref agora::rtc::IRtcEngine::playEffect "playEffect" method.

     @param volume Audio mixing volume. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustAudioMixingVolume(volume) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.adjustAudioMixingVolume(volume);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_VOLUME, { volume: volume });
    }
    agora.adjustAudioMixingVolume = adjustAudioMixingVolume;
    /** Adjusts the audio mixing volume for local playback.

     @note Call this method when you are in a channel.

     @param volume Audio mixing volume for local playback. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustAudioMixingPlayoutVolume(volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME, { volume: volume });
    }
    agora.adjustAudioMixingPlayoutVolume = adjustAudioMixingPlayoutVolume;
    /** Retrieves the audio mixing volume for local playback.

     This method helps troubleshoot audio volume related issues.

     @note Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing volume, if this method call succeeds. The value range is [0,100].
     - < 0: Failure.
     */
    function getAudioMixingPlayoutVolume() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PLAYOUT_VOLUME);
    }
    agora.getAudioMixingPlayoutVolume = getAudioMixingPlayoutVolume;
    /** Adjusts the audio mixing volume for publishing (for remote users).

     @note Call this method when you are in a channel.

     @param volume Audio mixing volume for publishing. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustAudioMixingPublishVolume(volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PUBLISH_VOLUME, { volume: volume });
    }
    agora.adjustAudioMixingPublishVolume = adjustAudioMixingPublishVolume;
    /** Retrieves the audio mixing volume for publishing.

     This method helps troubleshoot audio volume related issues.

     @note Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing volume for publishing, if this method call succeeds. The value range is [0,100].
     - < 0: Failure.
     */
    function getAudioMixingPublishVolume() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PUBLISH_VOLUME);
    }
    agora.getAudioMixingPublishVolume = getAudioMixingPublishVolume;
    /** Retrieves the duration (ms) of the music file.

     Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing duration, if this method call succeeds.
     - < 0: Failure.
     */
    function getAudioMixingDuration() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                return localStream.getAudioMixingDuration();
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_DURATION);
    }
    agora.getAudioMixingDuration = getAudioMixingDuration;
    /** Retrieves the playback position (ms) of the music file.

     Call this method when you are in a channel.

     @return
         - &ge; 0: The current playback position of the audio mixing, if this method call succeeds.
     - < 0: Failure.
     */
    function getAudioMixingCurrentPosition() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                return localStream.getAudioMixingCurrentPosition();
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_CURRENT_POSITION);
    }
    agora.getAudioMixingCurrentPosition = getAudioMixingCurrentPosition;
    /** Sets the playback position of the music file to a different starting position (the default plays from the beginning).

     @param pos The playback starting position (ms) of the music file.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setAudioMixingPosition(pos) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.setAudioMixingPosition(pos);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_POSITION, { pos: pos });
    }
    agora.setAudioMixingPosition = setAudioMixingPosition;
    /** Sets the pitch of the local music file.
     * @since v3.0.1
     *
     * When a local music file is mixed with a local human voice, call this method to set the pitch of the local music file only.
     *
     * @note
     * Call this method after calling `startAudioMixing`.
     *
     * @param pitch Sets the pitch of the local music file by chromatic scale. The default value is 0,
     * which means keeping the original pitch. The value ranges from -12 to 12, and the pitch value between
     * consecutive values is a chromatic value. The greater the absolute value of this parameter, the
     * higher or lower the pitch of the local music file.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function setAudioMixingPitch(pitch) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_PITCH, { pitch: pitch });
    }
    agora.setAudioMixingPitch = setAudioMixingPitch;
    /** Retrieves the volume of the audio effects.

     The value ranges between 0.0 and 100.0.

     @return
         - &ge; 0: Volume of the audio effects, if this method call succeeds.

     - < 0: Failure.
     */
    function getEffectsVolume() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                return localStream.getEffectsVolume()[0].volume;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_EFFECTS_VOLUME);
    }
    agora.getEffectsVolume = getEffectsVolume;
    /** Sets the volume of the audio effects.

     @param volume Sets the volume of the audio effects. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setEffectsVolume(volume) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.setEffectsVolume(volume);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EFFECTS_VOLUME, { volume: volume });
    }
    agora.setEffectsVolume = setEffectsVolume;
    /** Sets the volume of a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @param volume Sets the volume of the specified audio effect. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setVolumeOfEffect(soundId, volume) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.setVolumeOfEffect(soundId, volume);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_VOLUME_OF_EFFECT, { soundId: soundId, volume: volume });
    }
    agora.setVolumeOfEffect = setVolumeOfEffect;
    /**
     * Enables/Disables face detection for the local user. Applies to Android and iOS only.
     * @since v3.0.1
     *
     * Once face detection is enabled, the SDK triggers the \ref IRtcEngineEventHandler::onFacePositionChanged "onFacePositionChanged" callback
     * to report the face information of the local user, which includes the following aspects:
     * - The width and height of the local video.
     * - The position of the human face in the local video.
     * - The distance between the human face and the device screen.
     *
     * @param enabled Determines whether to enable the face detection function for the local user:
     * - true: Enable face detection.
     * - false: (Default) Disable face detection.
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function enableFaceDetection(enabled) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_FACE_DETECTION, { enabled: enabled });
    }
    agora.enableFaceDetection = enableFaceDetection;
    /** Plays a specified local or online audio effect file.

     This method allows you to set the loop count, pitch, pan, and gain of the audio effect file, as well as whether the remote user can hear the audio effect.

     To play multiple audio effect files simultaneously, call this method multiple times with different soundIds and filePaths. We recommend playing no more than three audio effect files at the same time.

     @param soundId ID of the specified audio effect. Each audio effect has a unique ID.

     @note
     - If the audio effect is preloaded into the memory through the \ref IRtcEngine::preloadEffect "preloadEffect" method, the value of @p soundID must be the same as that in the *preloadEffect* method.
     - Playing multiple online audio effect files simultaneously is not supported on macOS and Windows.

     @param filePath Specifies the absolute path (including the suffixes of the filename) to the local audio effect file or the URL of the online audio effect file, for example, c:/music/audio.mp4. Supported audio formats: mp3, mp4, m4a, aac, 3gp, mkv and wav.
     @param loopCount Sets the number of times the audio effect loops:
     - 0: Play the audio effect once.
     - 1: Play the audio effect twice.
     - -1: Play the audio effect in an indefinite loop until the \ref IRtcEngine::stopEffect "stopEffect" or \ref IRtcEngine::stopAllEffects "stopAllEffects" method is called.
     @param pitch Sets the pitch of the audio effect. The value ranges between 0.5 and 2. The default value is 1 (no change to the pitch). The lower the value, the lower the pitch.
     @param pan Sets the spatial position of the audio effect. The value ranges between -1.0 and 1.0:
     - 0.0: The audio effect displays ahead.
     - 1.0: The audio effect displays to the right.
     - -1.0: The audio effect displays to the left.
     @param gain  Sets the volume of the audio effect. The value ranges between 0 and 100 (default). The lower the value, the lower the volume of the audio effect.
     @param publish Sets whether or not to publish the specified audio effect to the remote stream:
     - true: The locally played audio effect is published to the Agora Cloud and the remote users can hear it.
     - false: The locally played audio effect is not published to the Agora Cloud and the remote users cannot hear it.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.playEffect({ soundId: soundId, filePath: filePath, cycle: loopCount });
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PLAY_EFFECT, {
            soundId: soundId,
            filePath: filePath,
            loopCount: loopCount,
            pitch: pitch,
            pan: pan,
            gain: gain,
            publish: publish
        });
    }
    agora.playEffect = playEffect;
    /** Stops playing a specified audio effect.

     @param soundId ID of the audio effect to stop playing. Each audio effect has a unique ID.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function stopEffect(soundId) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.stopEffect(soundId);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_EFFECT, { soundId: soundId });
    }
    agora.stopEffect = stopEffect;
    /** Stops playing all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function stopAllEffects() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.stopAllEffects();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_ALL_EFFECTS);
    }
    agora.stopAllEffects = stopAllEffects;
    /** Preloads a specified audio effect file into the memory.

     @note This method does not support online audio effect files.

     To ensure smooth communication, limit the size of the audio effect file. We recommend using this method to preload the audio effect before calling the \ref IRtcEngine::joinChannel "joinChannel" method.

     Supported audio formats: mp3, aac, m4a, 3gp, and wav.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @param filePath Pointer to the absolute path of the audio effect file.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function preloadEffect(soundId, filePath) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.playEffect({ filePath: filePath, soundId: soundId });
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PRE_LOAD_EFFECT, { soundId: soundId, filePath: filePath });
    }
    agora.preloadEffect = preloadEffect;
    /** Releases a specified preloaded audio effect from the memory.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function unloadEffect(soundId) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.unloadEffect(soundId);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.UN_LOAD_EFFECT, { soundId: soundId });
    }
    agora.unloadEffect = unloadEffect;
    /** Pauses a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function pauseEffect(soundId) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.pauseEffect(soundId);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_EFFECT, { soundId: soundId });
    }
    agora.pauseEffect = pauseEffect;
    /** Pauses all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function pauseAllEffects() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.pauseAllEffects();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_ALL_EFFECTS);
    }
    agora.pauseAllEffects = pauseAllEffects;
    /** Resumes playing a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function resumeEffect(soundId) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.resumeEffect(soundId);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_EFFECT, { soundId: soundId });
    }
    agora.resumeEffect = resumeEffect;
    /** Resumes playing all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function resumeAllEffects() {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.resumeAllEffects();
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_ALL_EFFECTS);
    }
    agora.resumeAllEffects = resumeAllEffects;
    /** Enables/Disables stereo panning for remote users.

     Ensure that you call this method before joinChannel to enable stereo panning for remote users so that the local user can track the position of a remote user by calling \ref agora::rtc::IRtcEngine::setRemoteVoicePosition "setRemoteVoicePosition".

     @param enabled Sets whether or not to enable stereo panning for remote users:
     - true: enables stereo panning.
     - false: disables stereo panning.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableSoundPositionIndication(enabled) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ENABLE_SOUND_POSITION_INDICATION, { enabled: enabled });
    }
    agora.enableSoundPositionIndication = enableSoundPositionIndication;
    /** Sets the sound position and gain of a remote user.

     When the local user calls this method to set the sound position of a remote user, the sound difference between the left and right channels allows the local user to track the real-time position of the remote user, creating a real sense of space. This method applies to massively multiplayer online games, such as Battle Royale games.

     @note
     - For this method to work, enable stereo panning for remote users by calling the \ref agora::rtc::IRtcEngine::enableSoundPositionIndication "enableSoundPositionIndication" method before joining a channel.
     - This method requires hardware support. For the best sound positioning, we recommend using a stereo speaker.

     @param uid The ID of the remote user.
     @param pan The sound position of the remote user. The value ranges from -1.0 to 1.0:
     - 0.0: the remote sound comes from the front.
     - -1.0: the remote sound comes from the left.
     - 1.0: the remote sound comes from the right.
     @param gain Gain of the remote user. The value ranges from 0.0 to 100.0. The default value is 100.0 (the original gain of the remote user). The smaller the value, the less the gain.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteVoicePosition(uid, pan, gain) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_VOICE_POSITIONN, { uid: uid, pan: pan, gain: gain });
    }
    agora.setRemoteVoicePosition = setRemoteVoicePosition;
    /** Changes the voice pitch of the local speaker.

     @param pitch Sets the voice pitch. The value ranges between 0.5 and 2.0. The lower the value, the lower the voice pitch. The default value is 1.0 (no change to the local voice pitch).
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalVoicePitch(pitch) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_CHANGER, { pitch: pitch });
    }
    agora.setLocalVoicePitch = setLocalVoicePitch;
    /** Sets the local voice equalization effect.

     @param bandFrequency Sets the band frequency. The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects, including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz. See #AUDIO_EQUALIZATION_BAND_FREQUENCY.
     @param bandGain  Sets the gain of each band in dB. The value ranges between -15 and 15.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalVoiceEqualization(bandFrequency, bandGain) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_EQUALIZATION, {
            bandFrequency: bandFrequency,
            bandGain: bandGain
        });
    }
    agora.setLocalVoiceEqualization = setLocalVoiceEqualization;
    /**  Sets the local voice reverberation.

     v2.4.0 adds the \ref agora::rtc::IRtcEngine::setLocalVoiceReverbPreset "setLocalVoiceReverbPreset" method, a more user-friendly method for setting the local voice reverberation. You can use this method to set the local reverberation effect, such as pop music, R&B, rock music, and hip-hop.

     @param reverbKey Sets the reverberation key. See #AUDIO_REVERB_TYPE.
     @param value Sets the value of the reverberation key.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalVoiceReverb(reverbKey, value) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB, { reverbKey: reverbKey, value: value });
    }
    agora.setLocalVoiceReverb = setLocalVoiceReverb;
    /** Sets the local voice changer option.

     This method can be used to set the local voice effect for users in a `COMMUNICATION` channel or hosts in a `LIVE_BROADCASTING` channel.
     Voice changer options include the following voice effects:

     - `VOICE_CHANGER_XXX`: Changes the local voice to an old man, a little boy, or the Hulk. Applies to the voice talk scenario.
     - `VOICE_BEAUTY_XXX`: Beautifies the local voice by making it sound more vigorous, resounding, or adding spacial resonance. Applies to the voice talk and singing scenario.
     - `GENERAL_VOICE_BEAUTY_XXX`: Adds gender-based beautification effect to the local voice. Applies to the voice talk scenario.
     - For a male voice: Adds magnetism to the voice.
     - For a female voice: Adds freshness or vitality to the voice.

     @note
     - To achieve better voice effect quality, Agora recommends setting the profile parameter in `setAudioProfile` as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY(4)` or `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
     - This method works best with the human voice, and Agora does not recommend using it for audio containing music and a human voice.
     - Do not use this method with `setLocalVoiceReverbPreset`, because the method called later overrides the one called earlier. For detailed considerations, see the advanced guide *Voice Changer and Reverberation*.

     @param voiceChanger Sets the local voice changer option. The default value is `VOICE_CHANGER_OFF`, which means the original voice. See details in #VOICE_CHANGER_PRESET.
     Gender-based beatification effect works best only when assigned a proper gender:
     - For male: `GENERAL_BEAUTY_VOICE_MALE_MAGNETIC`.
     - For female: `GENERAL_BEAUTY_VOICE_FEMALE_FRESH` or `GENERAL_BEAUTY_VOICE_FEMALE_VITALITY`.
     Failure to do so can lead to voice distortion.

     @return
         - 0: Success.
     - < 0: Failure. Check if the enumeration is properly set.
     */
    function setLocalVoiceChanger(voiceChanger) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_CHANGER, { voiceChanger: voiceChanger });
    }
    agora.setLocalVoiceChanger = setLocalVoiceChanger;
    /** Sets the local voice reverberation option, including the virtual stereo.
     *
     * This method sets the local voice reverberation for users in a `COMMUNICATION` channel or hosts in a `LIVE_BROADCASTING` channel.
     * After successfully calling this method, all users in the channel can hear the voice with reverberation.
     *
     * @note
     * - When calling this method with enumerations that begin with `AUDIO_REVERB_FX`, ensure that you set profile in `setAudioProfile` as
     * `AUDIO_PROFILE_MUSIC_HIGH_QUALITY(4)` or `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`; otherwise, this methods cannot set the corresponding voice reverberation option.
     * - When calling this method with `AUDIO_VIRTUAL_STEREO`, Agora recommends setting the `profile` parameter in `setAudioProfile` as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
     * - This method works best with the human voice, and Agora does not recommend using it for audio containing music and a human voice.
     * - Do not use this method with `setLocalVoiceChanger`, because the method called later overrides the one called earlier.
     * For detailed considerations, see the advanced guide *Voice Changer and Reverberation*.

     @param reverbPreset The local voice reverberation option. The default value is `AUDIO_REVERB_OFF`,
     which means the original voice.  See #AUDIO_REVERB_PRESET.
     To achieve better voice effects, Agora recommends the enumeration whose name begins with `AUDIO_REVERB_FX`.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalVoiceReverbPreset(reverbPreset) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB_PRESET, { reverbPreset: reverbPreset });
    }
    agora.setLocalVoiceReverbPreset = setLocalVoiceReverbPreset;
    /** Sets the log files that the SDK outputs.
     *
     * By default, the SDK outputs five log files, `agorasdk.log`, `agorasdk_1.log`, `agorasdk_2.log`, `agorasdk_3.log`, `agorasdk_4.log`, each with a default size of 1024 KB.
     * These log files are encoded in UTF-8. The SDK writes the latest logs in `agorasdk.log`. When `agorasdk.log` is full, the SDK deletes the log file with the earliest
     * modification time among the other four, renames `agorasdk.log` to the name of the deleted log file, and create a new `agorasdk.log` to record latest logs.
     *
     * @note Ensure that you call this method immediately after calling \ref agora::rtc::IRtcEngine::initialize "initialize" , otherwise the output logs may not be complete.
     *
     * @see \ref IRtcEngine::setLogFileSize "setLogFileSize"
     * @see \ref IRtcEngine::setLogFilter "setLogFilter"
     *
     * @param filePath The absolute path of log files. The default file path is `C: \Users\<user_name>\AppData\Local\Agora\<process_name>\agorasdk.log`.
     * Ensure that the directory for the log files exists and is writable. You can use this parameter to rename the log files.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function setLogFile(filePath) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILE, { filePath: filePath });
    }
    agora.setLogFile = setLogFile;
    /** Sets the output log level of the SDK.

     You can use one or a combination of the log filter levels. The log level follows the sequence of OFF, CRITICAL, ERROR, WARNING, INFO, and DEBUG. Choose a level to see the logs preceding that level.

     If you set the log level to WARNING, you see the logs within levels CRITICAL, ERROR, and WARNING.

     @see \ref IRtcEngine::setLogFile "setLogFile"
     @see \ref IRtcEngine::setLogFileSize "setLogFileSize"

     @param filter Sets the log filter level. See #LOG_FILTER_TYPE.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLogFilter(filter) {
        var _a;
        if (isWeb) {
            var levels = (_a = {},
                _a[LOG_FILTER_TYPE.LOG_FILTER_DEBUG] = 0,
                _a[LOG_FILTER_TYPE.LOG_FILTER_INFO] = 1,
                _a[LOG_FILTER_TYPE.LOG_FILTER_WARN] = 2,
                _a[LOG_FILTER_TYPE.LOG_FILTER_ERROR] = 3,
                _a[LOG_FILTER_TYPE.LOG_FILTER_OFF] = 4,
                _a);
            if (levels[filter] === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
            }
            else {
                AgoraRTC.Logger.setLogLevel(levels[filter]);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILTER, { filter: filter });
    }
    agora.setLogFilter = setLogFilter;
    /** Sets the size of a log file that the SDK outputs.
     *
     * By default, the SDK outputs five log files, `agorasdk.log`, `agorasdk_1.log`, `agorasdk_2.log`, `agorasdk_3.log`, `agorasdk_4.log`, each with a default size of 1024 KB.
     * These log files are encoded in UTF-8. The SDK writes the latest logs in `agorasdk.log`. When `agorasdk.log` is full, the SDK deletes the log file with the earliest
     * modification time among the other four, renames `agorasdk.log` to the name of the deleted log file, and create a new `agorasdk.log` to record latest logs.
     *
     * @see \ref IRtcEngine::setLogFile "setLogFile"
     * @see \ref IRtcEngine::setLogFilter "setLogFilter"
     *
     * @param fileSizeInKBytes The size (KB) of a log file. The default value is 1024 KB. If you set `fileSizeInKByte` to 1024 KB,
     * the SDK outputs at most 5 MB log files; if you set it to less than 1024 KB, the maximum size of a log file is still 1024 KB.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function setLogFileSize(fileSizeInKBytes) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILE_SIZE, { fileSizeInKBytes: fileSizeInKBytes });
    }
    agora.setLogFileSize = setLogFileSize;
    /** Updates the display mode of the local video view.

     @since v3.0.0

     After initializing the local video view, you can call this method to update its rendering and mirror modes. It affects only the video view that the local user sees, not the published local video stream.

     @note
     - Ensure that you have called the \ref IRtcEngine::setupLocalVideo "setupLocalVideo" method to initialize the local video view before calling this method.
     - During a call, you can call this method as many times as necessary to update the display mode of the local video view.
     @param renderMode The rendering mode of the local video view. See #RENDER_MODE_TYPE.
     @param mirrorMode
     - The mirror mode of the local video view. See #VIDEO_MIRROR_MODE_TYPE.
     - **Note**: If you use a front camera, the SDK enables the mirror mode by default; if you use a rear camera, the SDK disables the mirror mode by default.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalRenderMode(renderMode, mirrorMode) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        if (mirrorMode === undefined) {
            return callNativeMethod(API_TYPE.SET_LOCAL_RENDER_MODE, { renderMode: renderMode });
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_RENDER_MODE_2, { renderMode: renderMode, mirrorMode: mirrorMode });
    }
    agora.setLocalRenderMode = setLocalRenderMode;
    /** Updates the display mode of the video view of a remote user.

     @since v3.0.0
     After initializing the video view of a remote user, you can call this method to update its rendering and mirror modes. This method affects only the video view that the local user sees.

     @note
     - Ensure that you have called the \ref IRtcEngine::setupRemoteVideo "setupRemoteVideo" method to initialize the remote video view before calling this method.
     - During a call, you can call this method as many times as necessary to update the display mode of the video view of a remote user.

     @param userId The ID of the remote user.
     @param renderMode The rendering mode of the remote video view. See #RENDER_MODE_TYPE.
     @param mirrorMode
     - The mirror mode of the remote video view. See #VIDEO_MIRROR_MODE_TYPE.
     - **Note**: The SDK disables the mirror mode by default.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteRenderMode(userId, renderMode, mirrorMode) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        if (mirrorMode === undefined) {
            return callNativeMethod(API_TYPE.SET_REMOTE_RENDER_MODE, { userId: userId, renderMode: renderMode });
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_RENDER_MODE_2, { userId: userId, renderMode: renderMode, mirrorMode: mirrorMode });
    }
    agora.setRemoteRenderMode = setRemoteRenderMode;
    /**
     @deprecated This method is deprecated, use the \ref IRtcEngine::setupLocalVideo "setupLocalVideo"
     or \ref IRtcEngine::setLocalRenderMode(RENDER_MODE_TYPE renderMode, VIDEO_MIRROR_MODE_TYPE mirrorMode) "setLocalRenderMode" method instead.

     Sets the local video mirror mode.

     You must call this method before calling the \ref agora::rtc::IRtcEngine::startPreview "startPreview" method, otherwise the mirror mode will not work.

     @warning
     - Call this method after calling the \ref agora::rtc::IRtcEngine::setupLocalVideo "setupLocalVideo" method to initialize the local video view.
     - During a call, you can call this method as many times as necessary to update the mirror mode of the local video view.

     @param mirrorMode Sets the local video mirror mode. See #VIDEO_MIRROR_MODE_TYPE.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalVideoMirrorMode(mirrorMode) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_VIDEO_MIRROR_MODE, { mirrorMode: mirrorMode });
    }
    agora.setLocalVideoMirrorMode = setLocalVideoMirrorMode;
    /** Sets the stream mode to the single-stream (default) or dual-stream mode. (`LIVE_BROADCASTING` only.)

     If the dual-stream mode is enabled, the receiver can choose to receive the high stream (high-resolution and high-bitrate video stream), or the low stream (low-resolution and low-bitrate video stream).

     @param enabled Sets the stream mode:
     - true: Dual-stream mode.
     - false: Single-stream mode.
     */
    function enableDualStreamMode(enabled) {
        if (isWeb) {
            if (enabled) {
                client.enableDualStream();
            }
            else {
                client.disableDualStream();
            }
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.ENABLE_DUAL_STREAM_MODE, { enabled: enabled });
    }
    agora.enableDualStreamMode = enableDualStreamMode;
    /** Sets the external audio source. Please call this method before \ref agora::rtc::IRtcEngine::joinChannel "joinChannel".

     @param enabled Sets whether to enable/disable the external audio source:
     - true: Enables the external audio source.
     - false: (Default) Disables the external audio source.
     @param sampleRate Sets the sample rate (Hz) of the external audio source, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
     @param channels Sets the number of audio channels of the external audio source:
     - 1: Mono.
     - 2: Stereo.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setExternalAudioSource(enabled, sampleRate, channels) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SOURCE, {
            enabled: enabled,
            sampleRate: sampleRate,
            channels: channels
        });
    }
    agora.setExternalAudioSource = setExternalAudioSource;
    /** Sets the external audio sink.
     * This method applies to scenarios where you want to use external audio
     * data for playback. After enabling the external audio sink, you can call
     * the \ref agora::media::IMediaEngine::pullAudioFrame "pullAudioFrame" method to pull the remote audio data, process
     * it, and play it with the audio effects that you want.
     *
     * @note
     * Once you enable the external audio sink, the app will not retrieve any
     * audio data from the
     * \ref agora::media::IAudioFrameObserver::onPlaybackAudioFrame "onPlaybackAudioFrame" callback.
     *
     * @param enabled
     * - true: Enables the external audio sink.
     * - false: (Default) Disables the external audio sink.
     * @param sampleRate Sets the sample rate (Hz) of the external audio sink, which can be set as 16000, 32000, 44100 or 48000.
     * @param channels Sets the number of audio channels of the external
     * audio sink:
     * - 1: Mono.
     * - 2: Stereo.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function setExternalAudioSink(enabled, sampleRate, channels) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SINK, {
            enabled: enabled,
            sampleRate: sampleRate,
            channels: channels
        });
    }
    agora.setExternalAudioSink = setExternalAudioSink;
    /** Sets the audio recording format for the \ref agora::media::IAudioFrameObserver::onRecordAudioFrame "onRecordAudioFrame" callback.


     @param sampleRate Sets the sample rate (@p samplesPerSec) returned in the *onRecordAudioFrame* callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
     @param channel Sets the number of audio channels (@p channels) returned in the *onRecordAudioFrame* callback:
     - 1: Mono
     - 2: Stereo
     @param mode Sets the use mode (see #RAW_AUDIO_FRAME_OP_MODE_TYPE) of the *onRecordAudioFrame* callback.
     @param samplesPerCall Sets the number of samples returned in the *onRecordAudioFrame* callback. `samplesPerCall` is usually set as 1024 for RTMP streaming.


     @note The SDK triggers the `onRecordAudioFrame` callback according to the sample interval. Ensure that the sample interval ≥ 0.01 (s). And, Sample interval (sec) = `samplePerCall`/(`sampleRate` × `channel`).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_RECORDING_AUDIO_FRAME_PARAMETERS, {
            sampleRate: sampleRate,
            channel: channel,
            mode: mode,
            samplesPerCall: samplesPerCall
        });
    }
    agora.setRecordingAudioFrameParameters = setRecordingAudioFrameParameters;
    /** Sets the audio playback format for the \ref agora::media::IAudioFrameObserver::onPlaybackAudioFrame "onPlaybackAudioFrame" callback.


     @param sampleRate Sets the sample rate (@p samplesPerSec) returned in the *onPlaybackAudioFrame* callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
     @param channel Sets the number of channels (@p channels) returned in the *onPlaybackAudioFrame* callback:
     - 1: Mono
     - 2: Stereo
     @param mode Sets the use mode (see #RAW_AUDIO_FRAME_OP_MODE_TYPE) of the *onPlaybackAudioFrame* callback.
     @param samplesPerCall Sets the number of samples returned in the *onPlaybackAudioFrame* callback. `samplesPerCall` is usually set as 1024 for RTMP streaming.

     @note The SDK triggers the `onPlaybackAudioFrame` callback according to the sample interval. Ensure that the sample interval ≥ 0.01 (s). And, Sample interval (sec) = `samplePerCall`/(`sampleRate` × `channel`).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_PLAYBACK_AUDIO_FRAME_PARAMETERS, {
            sampleRate: sampleRate,
            channel: channel,
            mode: mode,
            samplesPerCall: samplesPerCall
        });
    }
    agora.setPlaybackAudioFrameParameters = setPlaybackAudioFrameParameters;
    /** Sets the mixed audio format for the \ref agora::media::IAudioFrameObserver::onMixedAudioFrame "onMixedAudioFrame" callback.


     @param sampleRate Sets the sample rate (@p samplesPerSec) returned in the *onMixedAudioFrame* callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
     @param samplesPerCall Sets the number of samples (`samples`) returned in the *onMixedAudioFrame* callback. `samplesPerCall` is usually set as 1024 for RTMP streaming.

     @note The SDK triggers the `onMixedAudioFrame` callback according to the sample interval. Ensure that the sample interval ≥ 0.01 (s). And, Sample interval (sec) = `samplePerCall`/(`sampleRate` × `channels`).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setMixedAudioFrameParameters(sampleRate, samplesPerCall) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_MIXED_AUDIO_FRAME_PARAMETERS, {
            sampleRate: sampleRate,
            samplesPerCall: samplesPerCall
        });
    }
    agora.setMixedAudioFrameParameters = setMixedAudioFrameParameters;
    /** Adjusts the recording volume.

     @param volume Recording volume. To avoid echoes and
     improve call quality, Agora recommends setting the value of volume between
     0 and 100. If you need to set the value higher than 100, contact
     support@agora.io first.
     - 0: Mute.
     - 100: Original volume.


     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustRecordingSignalVolume(volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ADJUST_RECORDING_SIGNAL_VOLUME, { volume: volume });
    }
    agora.adjustRecordingSignalVolume = adjustRecordingSignalVolume;
    /** Adjusts the playback volume of all remote users.

     @note
     - This method adjusts the playback volume that is the mixed volume of all remote users.
     - (Since v2.3.2) To mute the local audio playback, call both the `adjustPlaybackSignalVolume` and \ref IRtcEngine::adjustAudioMixingVolume "adjustAudioMixingVolume" methods and set the volume as `0`.

     @param volume The playback volume of all remote users. To avoid echoes and
     improve call quality, Agora recommends setting the value of volume between
     0 and 100. If you need to set the value higher than 100, contact
     support@agora.io first.
     - 0: Mute.
     - 100: Original volume.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function adjustPlaybackSignalVolume(volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ADJUST_PLAYBACK_SIGNAL_VOLUME, { volume: volume });
    }
    agora.adjustPlaybackSignalVolume = adjustPlaybackSignalVolume;
    /**
     @deprecated This method is deprecated. As of v3.0.0, the Native SDK automatically enables interoperability with the Web SDK, so you no longer need to call this method.
     Enables interoperability with the Agora Web SDK.

     @note
     - This method applies only to the `LIVE_BROADCASTING` profile. In the `COMMUNICATION` profile, interoperability with the Agora Web SDK is enabled by default.
     - If the channel has Web SDK users, ensure that you call this method, or the video of the Native user will be a black screen for the Web user.

     @param enabled Sets whether to enable/disable interoperability with the Agora Web SDK:
     - true: Enable.
     - false: (Default) Disable.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableWebSdkInteroperability(enabled) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_WEB_SDK_INTEROPER_ABILITY, { enabled: enabled });
    }
    agora.enableWebSdkInteroperability = enableWebSdkInteroperability;
    /** **DEPRECATED** Sets the preferences for the high-quality video. (`LIVE_BROADCASTING` only).

     This method is deprecated as of v2.4.0.

     @param preferFrameRateOverImageQuality Sets the video quality preference:
     - true: Frame rate over image quality.
     - false: (Default) Image quality over frame rate.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setVideoQualityParameters(preferFrameRateOverImageQuality) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_QUALITY_PARAMETERS, { preferFrameRateOverImageQuality: preferFrameRateOverImageQuality });
    }
    agora.setVideoQualityParameters = setVideoQualityParameters;
    /** Sets the fallback option for the published video stream based on the network conditions.

     If `option` is set as #STREAM_FALLBACK_OPTION_AUDIO_ONLY (2), the SDK will:

     - Disable the upstream video but enable audio only when the network conditions deteriorate and cannot support both video and audio.
     - Re-enable the video when the network conditions improve.

     When the published video stream falls back to audio only or when the audio-only stream switches back to the video, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onLocalPublishFallbackToAudioOnly "onLocalPublishFallbackToAudioOnly" callback.

     @note Agora does not recommend using this method for CDN live streaming, because the remote CDN live user will have a noticeable lag when the published video stream falls back to audio only.

     @param option Sets the fallback option for the published video stream:
     - #STREAM_FALLBACK_OPTION_DISABLED (0): (Default) No fallback behavior for the published video stream when the uplink network condition is poor. The stream quality is not guaranteed.
     - #STREAM_FALLBACK_OPTION_AUDIO_ONLY (2): The published video stream falls back to audio only when the uplink network condition is poor.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLocalPublishFallbackOption(option) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_PUBLISH_FALLBACK_OPTION, { option: option });
    }
    agora.setLocalPublishFallbackOption = setLocalPublishFallbackOption;
    /** Sets the fallback option for the remotely subscribed video stream based on the network conditions.

     The default setting for `option` is #STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW (1), where the remotely subscribed video stream falls back to the low-stream video (low resolution and low bitrate) under poor downlink network conditions.

     If `option` is set as #STREAM_FALLBACK_OPTION_AUDIO_ONLY (2), the SDK automatically switches the video from a high-stream to a low-stream, or disables the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio. The SDK monitors the network quality and restores the video stream when the network conditions improve.

     When the remotely subscribed video stream falls back to audio only or when the audio-only stream switches back to the video stream, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onRemoteSubscribeFallbackToAudioOnly "onRemoteSubscribeFallbackToAudioOnly" callback.

     @param  option  Sets the fallback option for the remotely subscribed video stream. See #STREAM_FALLBACK_OPTIONS.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setRemoteSubscribeFallbackOption(option) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION, { option: option });
    }
    agora.setRemoteSubscribeFallbackOption = setRemoteSubscribeFallbackOption;
    /** Switches between front and rear cameras.

     @note This method is for Android and iOS only.
     @note This method is private.

     @param direction Sets the camera to be used:
     - CAMERA_DIRECTION.CAMERA_REAR: Use the rear camera.
     - CAMERA_DIRECTION.CAMERA_FRONT: Use the front camera.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    function switchCamera(direction) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        if (direction === undefined) {
            return callNativeMethod(API_TYPE.SWITCH_CAMERA);
        }
        return callNativeMethod(API_TYPE.SWITCH_CAMERA_2, { direction: direction });
    }
    agora.switchCamera = switchCamera;
    /** Sets the default audio playback route.

     This method sets whether the received audio is routed to the earpiece or speakerphone by default before joining a channel.
     If a user does not call this method, the audio is routed to the earpiece by default. If you need to change the default audio route after joining a channel, call the \ref IRtcEngine::setEnableSpeakerphone "setEnableSpeakerphone" method.

     The default setting for each profile:
     - `COMMUNICATION`: In a voice call, the default audio route is the earpiece. In a video call, the default audio route is the speakerphone. If a user who is in the `COMMUNICATION` profile calls
     the \ref IRtcEngine.disableVideo "disableVideo" method or if the user calls
     the \ref IRtcEngine.muteLocalVideoStream "muteLocalVideoStream" and
     \ref IRtcEngine.muteAllRemoteVideoStreams "muteAllRemoteVideoStreams" methods, the
     default audio route switches back to the earpiece automatically.
     - `LIVE_BROADCASTING`: Speakerphone.

     @note
     - This method is for Android and iOS only.
     - This method is applicable only to the `COMMUNICATION` profile.
     - For iOS, this method only works in a voice call.
     - Call this method before calling the \ref IRtcEngine::joinChannel "joinChannel" method.

     @param defaultToSpeaker Sets the default audio route:
     - true: Route the audio to the speakerphone. If the playback device connects to the earpiece or Bluetooth, the audio cannot be routed to the speakerphone.
     - false: (Default) Route the audio to the earpiece. If a headset is plugged in, the audio is routed to the headset.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setDefaultAudioRouteToSpeakerphone(defaultToSpeaker) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE, { defaultToSpeaker: defaultToSpeaker });
    }
    agora.setDefaultAudioRouteToSpeakerphone = setDefaultAudioRouteToSpeakerphone;
    /** Enables/Disables the audio playback route to the speakerphone.

     This method sets whether the audio is routed to the speakerphone or earpiece.

     See the default audio route explanation in the \ref IRtcEngine::setDefaultAudioRouteToSpeakerphone "setDefaultAudioRouteToSpeakerphone" method and check whether it is necessary to call this method.

     @note
     - This method is for Android and iOS only.
     - Ensure that you have successfully called the \ref IRtcEngine::joinChannel "joinChannel" method before calling this method.
     - After calling this method, the SDK returns the \ref IRtcEngineEventHandler::onAudioRouteChanged "onAudioRouteChanged" callback to indicate the changes.
     - This method does not take effect if a headset is used.

     @param speakerOn Sets whether to route the audio to the speakerphone or earpiece:
     - true: Route the audio to the speakerphone. If the playback device connects to the earpiece or Bluetooth, the audio cannot be routed to the speakerphone.
     - false: Route the audio to the earpiece. If a headset is plugged in, the audio is routed to the headset.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setEnableSpeakerphone(speakerOn) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_ENABLE_SPEAKER_PHONE, { speakerOn: speakerOn });
    }
    agora.setEnableSpeakerphone = setEnableSpeakerphone;
    /** Enables in-ear monitoring (for Android and iOS only).
     @param enabled Determines whether to enable in-ear monitoring.
     - true: Enable.
     - false: (Default) Disable.

     * @return
        - 0: Success.
     - < 0: Failure.
     */
    function enableInEarMonitoring(enabled) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_IN_EAR_MONITORING, { enabled: enabled });
    }
    agora.enableInEarMonitoring = enableInEarMonitoring;
    /** Sets the volume of the in-ear monitor.

     @param volume Sets the volume of the in-ear monitor. The value ranges between 0 and 100 (default).

     @note This method is for Android and iOS only.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setInEarMonitoringVolume(volume) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_IN_EAR_MONITORING_VOLUME, { volume: volume });
    }
    agora.setInEarMonitoringVolume = setInEarMonitoringVolume;
    /** Checks whether the speakerphone is enabled.

     @note This method is for Android and iOS only.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function isSpeakerphoneEnabled() {
        if (isWeb) {
            return false;
        }
        return callNativeMethod(API_TYPE.IS_SPEAKER_PHONE_ENABLED);
    }
    agora.isSpeakerphoneEnabled = isSpeakerphoneEnabled;
    /** Retrieves the current call ID.

     When a user joins a channel on a client, a @p callId is generated to identify the call from the client. Feedback methods, such as \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain", must be called after the call ends to submit feedback to the SDK.

     The \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain" methods require the @p callId parameter retrieved from the *getCallId* method during a call. @p callId is passed as an argument into the \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain" methods after the call ends.

     @param callId Pointer to the current call ID.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function getCallId() {
        if (isWeb) {
            return null;
        }
        return callNativeMethod(API_TYPE.GET_CALL_ID);
    }
    agora.getCallId = getCallId;
    /** Allows a user to rate a call after the call ends.

     @param callId Pointer to the ID of the call, retrieved from the \ref IRtcEngine::getCallId "getCallId" method.
     @param rating  Rating of the call. The value is between 1 (lowest score) and 5 (highest score). If you set a value out of this range, the #ERR_INVALID_ARGUMENT (2) error returns.
     @param description (Optional) Pointer to the description of the rating, with a string length of less than 800 bytes.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function rate(callId, rating, description) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.RATE, { callId: callId, rating: rating, description: description });
    }
    agora.rate = rate;
    /** Allows a user to complain about the call quality after a call ends.

     @param callId Pointer to the ID of the call, retrieved from the \ref IRtcEngine::getCallId "getCallId" method.
     @param description (Optional) Pointer to the description of the complaint, with a string length of less than 800 bytes.

     @return
         - 0: Success.
     - < 0: Failure.

     */
    function complain(callId, description) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.COMPLAIN, { callId: callId, description: description });
    }
    agora.complain = complain;
    /** Retrieves the SDK version number.

     @param build Pointer to the build number.
     @return The version of the current SDK in the string format. For example, 2.3.1.
     */
    function getVersion() {
        if (isWeb) {
            return AgoraRTC.VERSION;
        }
        return callNativeMethod(API_TYPE.GET_VERSION);
    }
    agora.getVersion = getVersion;
    /**  Enables the network connection quality test.

     This method tests the quality of the users' network connections and is disabled by default.

     Before a user joins a channel or before an audience switches to a host, call this method to check the uplink network quality.

     This method consumes additional network traffic, and hence may affect communication quality.

     Call the \ref IRtcEngine::disableLastmileTest "disableLastmileTest" method to disable this test after receiving the \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality" callback, and before joining a channel.

     @note
     - Do not call any other methods before receiving the \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality" callback. Otherwise, the callback may be interrupted by other methods, and hence may not be triggered.
     - A host should not call this method after joining a channel (when in a call).
     - If you call this method to test the last-mile quality, the SDK consumes the bandwidth of a video stream, whose bitrate corresponds to the bitrate you set in the \ref agora::rtc::IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method. After you join the channel, whether you have called the `disableLastmileTest` method or not, the SDK automatically stops consuming the bandwidth.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function enableLastmileTest() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_LAST_MILE_TEST);
    }
    agora.enableLastmileTest = enableLastmileTest;
    /** Disables the network connection quality test.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function disableLastmileTest() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.DISABLE_LAST_MILE_TEST);
    }
    agora.disableLastmileTest = disableLastmileTest;
    /** Starts the last-mile network probe test.

     This method starts the last-mile network probe test before joining a channel to get the uplink and downlink last-mile network statistics, including the bandwidth, packet loss, jitter, and round-trip time (RTT).

     Call this method to check the uplink network quality before users join a channel or before an audience switches to a host.
     Once this method is enabled, the SDK returns the following callbacks:
     - \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality": the SDK triggers this callback within two seconds depending on the network conditions. This callback rates the network conditions and is more closely linked to the user experience.
     - \ref IRtcEngineEventHandler::onLastmileProbeResult "onLastmileProbeResult": the SDK triggers this callback within 30 seconds depending on the network conditions. This callback returns the real-time statistics of the network conditions and is more objective.

     @note
     - This method consumes extra network traffic and may affect communication quality. We do not recommend calling this method together with enableLastmileTest.
     - Do not call other methods before receiving the \ref IRtcEngineEventHandler::onLastmileQuality "onLastmileQuality" and \ref IRtcEngineEventHandler::onLastmileProbeResult "onLastmileProbeResult" callbacks. Otherwise, the callbacks may be interrupted.
     - In the `LIVE_BROADCASTING` profile, a host should not call this method after joining a channel.

     @param config Sets the configurations of the last-mile network probe test. See LastmileProbeConfig.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function startLastmileProbeTest(config) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.START_LAST_MILE_PROBE_TEST, { config: config });
    }
    agora.startLastmileProbeTest = startLastmileProbeTest;
    /** Stops the last-mile network probe test. */
    function stopLastmileProbeTest() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.STOP_LAST_MILE_PROBE_TEST);
    }
    agora.stopLastmileProbeTest = stopLastmileProbeTest;
    /** Retrieves the warning or error description.

     @param code Warning code or error code returned in the \ref agora::rtc::IRtcEngineEventHandler::onWarning "onWarning" or \ref agora::rtc::IRtcEngineEventHandler::onError "onError" callback.

     @return #WARN_CODE_TYPE or #ERROR_CODE_TYPE.
     */
    function getErrorDescription(code) {
        if (isWeb) {
            return null;
        }
        return callNativeMethod(API_TYPE.GET_ERROR_DESCRIPTION, { code: code });
    }
    agora.getErrorDescription = getErrorDescription;
    /** **DEPRECATED** Enables built-in encryption with an encryption password before users join a channel.

     Deprecated as of v3.1.0. Use the \ref agora::rtc::IRtcEngine::enableEncryption "enableEncryption" instead.

     All users in a channel must use the same encryption password. The encryption password is automatically cleared once a user leaves the channel.

     If an encryption password is not specified, the encryption functionality will be disabled.

     @note
     - Do not use this method for CDN live streaming.
     - For optimal transmission, ensure that the encrypted data size does not exceed the original data size + 16 bytes. 16 bytes is the maximum padding size for AES encryption.

     @param secret Pointer to the encryption password.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setEncryptionSecret(secret) {
        if (isWeb) {
            client.setEncryptionSecret(secret);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.SET_ENCRYPTION_SECTRT, { secret: secret });
    }
    agora.setEncryptionSecret = setEncryptionSecret;
    /** **DEPRECATED** Sets the built-in encryption mode.

     @deprecated Deprecated as of v3.1.0. Use the \ref agora::rtc::IRtcEngine::enableEncryption "enableEncryption" instead.

     The Agora SDK supports built-in encryption, which is set to the @p aes-128-xts mode by default. Call this method to use other encryption modes.

     All users in the same channel must use the same encryption mode and password.

     Refer to the information related to the AES encryption algorithm on the differences between the encryption modes.

     @note Call the \ref IRtcEngine::setEncryptionSecret "setEncryptionSecret" method to enable the built-in encryption function before calling this method.

     @param encryptionMode Pointer to the set encryption mode:
     - "aes-128-xts": (Default) 128-bit AES encryption, XTS mode.
     - "aes-128-ecb": 128-bit AES encryption, ECB mode.
     - "aes-256-xts": 256-bit AES encryption, XTS mode.
     - "": When encryptionMode is set as NULL, the encryption mode is set as "aes-128-xts" by default.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setEncryptionMode(encryptionMode) {
        if (isWeb) {
            client.setEncryptionMode(encryptionMode);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.SET_ENCRYPTION_MODE, { encryptionMode: encryptionMode });
    }
    agora.setEncryptionMode = setEncryptionMode;
    /** Enables/Disables the built-in encryption.
     *
     * @since v3.1.0
     *
     * In scenarios requiring high security, Agora recommends calling this method to enable the built-in encryption before joining a channel.
     *
     * All users in the same channel must use the same encryption mode and encryption key. Once all users leave the channel, the encryption key of this channel is automatically cleared.
     *
     * @note
     * - If you enable the built-in encryption, you cannot use the RTMP streaming function.
     * - Agora supports four encryption modes. If you choose an encryption mode (excepting `SM4_128_ECB` mode), you need to add an external encryption library when integrating the SDK. See the advanced guide *Channel Encryption*.
     *
     * @param enabled Whether to enable the built-in encryption:
     * - true: Enable the built-in encryption.
     * - false: Disable the built-in encryption.
     * @param config Configurations of built-in encryption schemas. See EncryptionConfig.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     *  - -2(ERR_INVALID_ARGUMENT): An invalid parameter is used. Set the parameter with a valid value.
     *  - -4(ERR_NOT_SUPPORTED): The encryption mode is incorrect or the SDK fails to load the external encryption library. Check the enumeration or reload the external encryption library.
     *  - -7(ERR_NOT_INITIALIZED): The SDK is not initialized. Initialize the `IRtcEngine` instance before calling this method.
     */
    function enableEncryption(enabled, config) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ENABLE_ENCRYPTION, { enabled: enabled, config: config });
    }
    agora.enableEncryption = enableEncryption;
    /** Registers a packet observer.

     The Agora SDK allows your application to register a packet observer to receive callbacks for voice or video packet transmission.

     @note
     - The size of the packet sent to the network after processing should not exceed 1200 bytes, otherwise, the packet may fail to be sent.
     - Ensure that both receivers and senders call this method, otherwise, you may meet undefined behaviors such as no voice and black screen.
     - When you use CDN live streaming, recording or storage functions, Agora doesn't recommend calling this method.

     @param observer Pointer to the registered packet observer. See IPacketObserver.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function registerPacketObserver(observer) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.REGISTER_PACKET_OBSERVER, { observer: observer });
    }
    agora.registerPacketObserver = registerPacketObserver;
    /** Creates a data stream.

     Each user can create up to five data streams during the lifecycle of the IRtcEngine.

     @note Set both the @p reliable and @p ordered parameters to true or false. Do not set one as true and the other as false.

     @param streamId Pointer to the ID of the created data stream.
     @param reliable Sets whether or not the recipients are guaranteed to receive the data stream from the sender within five seconds:
     - true: The recipients receive the data stream from the sender within five seconds. If the recipient does not receive the data stream within five seconds, an error is reported to the application.
     - false: There is no guarantee that the recipients receive the data stream within five seconds and no error message is reported for any delay or missing data stream.
     @param ordered Sets whether or not the recipients receive the data stream in the sent order:
     - true: The recipients receive the data stream in the sent order.
     - false: The recipients do not receive the data stream in the sent order.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function createDataStream(streamId, reliable, ordered) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.CREATE_DATA_STREAM, { streamId: streamId, reliable: reliable, ordered: ordered });
    }
    agora.createDataStream = createDataStream;
    /** Sends data stream messages to all users in a channel.

     The SDK has the following restrictions on this method:
     - Up to 30 packets can be sent per second in a channel with each packet having a maximum size of 1 kB.
     - Each client can send up to 6 kB of data per second.
     - Each user can have up to five data streams simultaneously.

     A successful \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method call triggers the
     \ref agora::rtc::IRtcEngineEventHandler::onStreamMessage "onStreamMessage" callback on the remote client, from which the remote user gets the stream message.

     A failed \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method call triggers the
     \ref agora::rtc::IRtcEngineEventHandler::onStreamMessage "onStreamMessage" callback on the remote client.
     @note This method applies only to the `COMMUNICATION` profile or to the hosts in the `LIVE_BROADCASTING` profile. If an audience in the `LIVE_BROADCASTING` profile calls this method, the audience may be switched to a host.
     @param  streamId  ID of the sent data stream, returned in the \ref IRtcEngine::createDataStream "createDataStream" method.
     @param data Pointer to the sent data.
     @param length Length of the sent data.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function sendStreamMessage(streamId, data, length) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SEND_STREAM_MESSAGE, { streamId: streamId, length: length }, data);
    }
    agora.sendStreamMessage = sendStreamMessage;
    /** Publishes the local stream to a specified CDN live RTMP address.  (CDN live only.)

     The SDK returns the result of this method call in the \ref IRtcEngineEventHandler::onStreamPublished "onStreamPublished" callback.

     The \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" callback on the local client to report the state of adding a local stream to the CDN.
     @note
     - Ensure that the user joins the channel before calling this method.
     - Ensure that you enable the RTMP Converter service before using this function. See  *Prerequisites* in the advanced guide *Push Streams to CDN*.
     - This method adds only one stream RTMP URL address each time it is called.
     - This method applies to `LIVE_BROADCASTING` only.

     @param url The CDN streaming URL in the RTMP format. The maximum length of this parameter is 1024 bytes. The RTMP URL address must not contain special characters, such as Chinese language characters.
     @param  transcodingEnabled Sets whether transcoding is enabled/disabled:
     - true: Enable transcoding. To [transcode](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#transcoding) the audio or video streams when publishing them to CDN live, often used for combining the audio and video streams of multiple hosts in CDN live. If you set this parameter as `true`, ensure that you call the \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" method before this method.
     - false: Disable transcoding.

     @return
         - 0: Success.
     - < 0: Failure.
     - #ERR_INVALID_ARGUMENT (2): The RTMP URL address is NULL or has a string length of 0.
     - #ERR_NOT_INITIALIZED (7): You have not initialized the RTC engine when publishing the stream.
     */
    function addPublishStreamUrl(url, transcodingEnabled) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ADD_PUBLISH_STREAM_URL, { url: url, transcodingEnabled: transcodingEnabled });
    }
    agora.addPublishStreamUrl = addPublishStreamUrl;
    /** Removes an RTMP stream from the CDN. (CDN live only.)

     This method removes the RTMP URL address (added by the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method) from a CDN live stream. The SDK returns the result of this method call in the \ref IRtcEngineEventHandler::onStreamUnpublished "onStreamUnpublished" callback.

     The \ref agora::rtc::IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" method call triggers the \ref agora::rtc::IRtcEngineEventHandler::onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" callback on the local client to report the state of removing an RTMP stream from the CDN.
     @note
     - This method removes only one RTMP URL address each time it is called.
     - The RTMP URL address must not contain special characters, such as Chinese language characters.
     - This method applies to `LIVE_BROADCASTING` only.

     @param url The RTMP URL address to be removed. The maximum length of this parameter is 1024 bytes.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function removePublishStreamUrl(url) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.REMOVE_PUBLISH_STREAM_URL, { url: url });
    }
    agora.removePublishStreamUrl = removePublishStreamUrl;
    /** Sets the video layout and audio settings for CDN live. (CDN live only.)

     The SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onTranscodingUpdated "onTranscodingUpdated" callback when you call the `setLiveTranscoding` method to update the transcoding setting.

     @note
     - This method applies to `LIVE_BROADCASTING` only.
     - Ensure that you enable the RTMP Converter service before using this function. See *Prerequisites* in the advanced guide *Push Streams to CDN*.
     - If you call the `setLiveTranscoding` method to update the transcoding setting for the first time, the SDK does not trigger the `onTranscodingUpdated` callback.

     @param transcoding Sets the CDN live audio/video transcoding settings. See LiveTranscoding.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setLiveTranscoding(transcoding) {
        if (isWeb) {
            var coding = {
                audioBitrate: transcoding.audioBitrate,
                audioChannels: transcoding.audioChannels,
                audioSampleRate: transcoding.audioSampleRate,
                backgroundColor: transcoding.backgroundColor,
                height: transcoding.height,
                images: [transcoding.watermark],
                lowLatency: transcoding.lowLatency,
                transcodingUsers: transcoding.transcodingUsers,
                userCount: transcoding.userCount,
                videoBitrate: transcoding.videoBitrate,
                videoCodecProfile: transcoding.videoCodecProfile,
                videoFramerate: transcoding.videoFramerate,
                videoGop: transcoding.videoGop,
                width: transcoding.width,
            };
            client.setLiveTranscoding(coding);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.SET_LIVE_TRANSCODING, { transcoding: transcoding });
    }
    agora.setLiveTranscoding = setLiveTranscoding;
    /** Adds a watermark image to the local video.

     This method adds a PNG watermark image to the local video in the live streaming. Once the watermark image is added, all the audience in the channel (CDN audience included),
     and the recording device can see and capture it. Agora supports adding only one watermark image onto the local video, and the newly watermark image replaces the previous one.

     The watermark position depends on the settings in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method:
     - If the orientation mode of the encoding video is #ORIENTATION_MODE_FIXED_LANDSCAPE, or the landscape mode in #ORIENTATION_MODE_ADAPTIVE, the watermark uses the landscape orientation.
     - If the orientation mode of the encoding video is #ORIENTATION_MODE_FIXED_PORTRAIT, or the portrait mode in #ORIENTATION_MODE_ADAPTIVE, the watermark uses the portrait orientation.
     - When setting the watermark position, the region must be less than the dimensions set in the `setVideoEncoderConfiguration` method. Otherwise, the watermark image will be cropped.

     @note
     - Ensure that you have called the \ref agora::rtc::IRtcEngine::enableVideo "enableVideo" method to enable the video module before calling this method.
     - If you only want to add a watermark image to the local video for the audience in the CDN live streaming channel to see and capture, you can call this method or the \ref agora::rtc::IRtcEngine::setLiveTranscoding "setLiveTranscoding" method.
     - This method supports adding a watermark image in the PNG file format only. Supported pixel formats of the PNG image are RGBA, RGB, Palette, Gray, and Alpha_gray.
     - If the dimensions of the PNG image differ from your settings in this method, the image will be cropped or zoomed to conform to your settings.
     - If you have enabled the local video preview by calling the \ref agora::rtc::IRtcEngine::startPreview "startPreview" method, you can use the `visibleInPreview` member in the WatermarkOptions class to set whether or not the watermark is visible in preview.
     - If you have enabled the mirror mode for the local video, the watermark on the local video is also mirrored. To avoid mirroring the watermark, Agora recommends that you do not use the mirror and watermark functions for the local video at the same time. You can implement the watermark function in your application layer.

     @param watermarkUrl The local file path of the watermark image to be added. This method supports adding a watermark image from the local absolute or relative file path.
     @param options Pointer to the watermark's options to be added. See WatermarkOptions for more infomation.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function addVideoWatermark(watermarkUrl, options) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.ADD_VIDEO_WATER_MARK_2, { watermarkUrl: watermarkUrl, options: options });
    }
    agora.addVideoWatermark = addVideoWatermark;
    /** Removes the watermark image from the video stream added by the \ref agora::rtc::IRtcEngine::addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) "addVideoWatermark" method.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function clearVideoWatermarks() {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.CLEAR_VIDEO_WATER_MARKS);
    }
    agora.clearVideoWatermarks = clearVideoWatermarks;
    /** @since v3.0.0

     Enables/Disables image enhancement and sets the options.

     @note
     - Call this method after calling the enableVideo method.
     - Currently this method does not apply for macOS.

     @param enabled Sets whether or not to enable image enhancement:
     - true: enables image enhancement.
     - false: disables image enhancement.
     @param options Sets the image enhancement option. See BeautyOptions.
     */
    function setBeautyEffectOptions(enabled, options) {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED;
            }
            else {
                localStream.setBeautyEffectOptions(enabled, options);
                return ERROR_CODE_TYPE.ERR_OK;
            }
        }
        return callNativeMethod(API_TYPE.SET_BEAUTY_EFFECT_OPTIONS, { enabled: enabled, options: options });
    }
    agora.setBeautyEffectOptions = setBeautyEffectOptions;
    /** Adds a voice or video stream URL address to the live streaming.

     The \ref IRtcEngineEventHandler::onStreamPublished "onStreamPublished" callback returns the inject status. If this method call is successful, the server pulls the voice or video stream and injects it into a live channel. This is applicable to scenarios where all audience members in the channel can watch a live show and interact with each other.

     The \ref agora::rtc::IRtcEngine::addInjectStreamUrl "addInjectStreamUrl" method call triggers the following callbacks:
     - The local client:
     - \ref agora::rtc::IRtcEngineEventHandler::onStreamInjectedStatus "onStreamInjectedStatus" , with the state of the injecting the online stream.
     - \ref agora::rtc::IRtcEngineEventHandler::onUserJoined "onUserJoined" (uid: 666), if the method call is successful and the online media stream is injected into the channel.
     - The remote client:
     - \ref agora::rtc::IRtcEngineEventHandler::onUserJoined "onUserJoined" (uid: 666), if the method call is successful and the online media stream is injected into the channel.

     @note
     - Ensure that you enable the RTMP Converter service before using this function. See *Prerequisites* in the advanced guide *Push Streams to CDN*.
     - This method applies to the Native SDK v2.4.1 and later.
     - This method applies to the `LIVE_BROADCASTING` profile only.
     - You can inject only one media stream into the channel at the same time.

     @param url Pointer to the URL address to be added to the ongoing streaming. Valid protocols are RTMP, HLS, and HTTP-FLV.
     - Supported audio codec type: AAC.
     - Supported video codec type: H264 (AVC).
     @param config Pointer to the InjectStreamConfig object that contains the configuration of the added voice or video stream.

     @return
         - 0: Success.
     - < 0: Failure.
     - #ERR_INVALID_ARGUMENT (2): The injected URL does not exist. Call this method again to inject the stream and ensure that the URL is valid.
     - #ERR_NOT_READY (3): The user is not in the channel.
     - #ERR_NOT_SUPPORTED (4): The channel profile is not `LIVE_BROADCASTING`. Call the \ref agora::rtc::IRtcEngine::setChannelProfile "setChannelProfile" method and set the channel profile to `LIVE_BROADCASTING` before calling this method.
     - #ERR_NOT_INITIALIZED (7): The SDK is not initialized. Ensure that the IRtcEngine object is initialized before calling this method.
     */
    function addInjectStreamUrl(url, config) {
        if (isWeb) {
            client.addInjectStreamUrl(url, config);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.ADD_INJECT_STREAM_URL, { url: url, config: config });
    }
    agora.addInjectStreamUrl = addInjectStreamUrl;
    /** Starts to relay media streams across channels.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" and
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     * "onChannelMediaRelayEvent" callbacks, and these callbacks return the
     * state and events of the media stream relay.
     * - If the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback returns
     * #RELAY_STATE_RUNNING (2) and #RELAY_OK (0), and the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     * "onChannelMediaRelayEvent" callback returns
     * #RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL (4), the host starts
     * sending data to the destination channel.
     * - If the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback returns
     * #RELAY_STATE_FAILURE (3), an exception occurs during the media stream
     * relay.
     *
     * @note
     * - Call this method after the \ref joinChannel() "joinChannel" method.
     * - This method takes effect only when you are a host in a
     * `LIVE_BROADCASTING` channel.
     * - After a successful method call, if you want to call this method
     * again, ensure that you call the
     * \ref stopChannelMediaRelay() "stopChannelMediaRelay" method to quit the
     * current relay.
     * - Contact sales-us@agora.io before implementing this function.
     * - We do not support string user accounts in this API.
     *
     * @param configuration The configuration of the media stream relay:
     * ChannelMediaRelayConfiguration.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function startChannelMediaRelay(configuration) {
        if (isWeb) {
            // @ts-ignore
            var config_1 = new AgoraRTC.ChannelMediaRelayConfiguration();
            config_1.setSrcChannelInfo(configuration.srcInfo);
            configuration.destInfos.map(function (value) {
                config_1.setDestChannelInfo(value.channelName, value);
            });
            client.startChannelMediaRelay(config_1, function () {
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.START_CHANNEL_MEDIA_RELAY, { configuration: configuration });
    }
    agora.startChannelMediaRelay = startChannelMediaRelay;
    /** Updates the channels for media stream relay. After a successful
     * \ref startChannelMediaRelay() "startChannelMediaRelay" method call, if
     * you want to relay the media stream to more channels, or leave the
     * current relay channel, you can call the
     * \ref updateChannelMediaRelay() "updateChannelMediaRelay" method.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayEvent
     *  "onChannelMediaRelayEvent" callback with the
     * #RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL (7) state code.
     *
     * @note
     * Call this method after the
     * \ref startChannelMediaRelay() "startChannelMediaRelay" method to update
     * the destination channel.
     *
     * @param configuration The media stream relay configuration:
     * ChannelMediaRelayConfiguration.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function updateChannelMediaRelay(configuration) {
        if (isWeb) {
            // @ts-ignore
            var config_2 = new AgoraRTC.ChannelMediaRelayConfiguration();
            config_2.setSrcChannelInfo(configuration.srcInfo);
            configuration.destInfos.map(function (value) {
                config_2.setDestChannelInfo(value.channelName, value);
            });
            client.updateChannelMediaRelay(config_2, function () {
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.UPDATE_CHANNEL_MEDIA_RELAY, { configuration: configuration });
    }
    agora.updateChannelMediaRelay = updateChannelMediaRelay;
    /** Stops the media stream relay.
     *
     * Once the relay stops, the host quits all the destination
     * channels.
     *
     * After a successful method call, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback. If the callback returns
     * #RELAY_STATE_IDLE (0) and #RELAY_OK (0), the host successfully
     * stops the relay.
     *
     * @note
     * If the method call fails, the SDK triggers the
     * \ref agora::rtc::IRtcEngineEventHandler::onChannelMediaRelayStateChanged
     *  "onChannelMediaRelayStateChanged" callback with the
     * #RELAY_ERROR_SERVER_NO_RESPONSE (2) or
     * #RELAY_ERROR_SERVER_CONNECTION_LOST (8) state code. You can leave the
     * channel by calling the \ref leaveChannel() "leaveChannel" method, and
     * the media stream relay automatically stops.
     *
     * @return
     * - 0: Success.
     * - < 0: Failure.
     */
    function stopChannelMediaRelay() {
        if (isWeb) {
            client.stopChannelMediaRelay(function () {
            });
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.STOP_CHANNEL_MEDIA_RELAY);
    }
    agora.stopChannelMediaRelay = stopChannelMediaRelay;
    /** Removes the voice or video stream URL address from the live streaming.

     This method removes the URL address (added by the \ref IRtcEngine::addInjectStreamUrl "addInjectStreamUrl" method) from the live streaming.

     @note If this method is called successfully, the SDK triggers the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback and returns a stream uid of 666.

     @param url Pointer to the URL address of the injected stream to be removed.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function removeInjectStreamUrl(url) {
        if (isWeb) {
            client.removeInjectStreamUrl(url);
            return ERROR_CODE_TYPE.ERR_OK;
        }
        return callNativeMethod(API_TYPE.REMOVE_INJECT_STREAM_URL, { url: url });
    }
    agora.removeInjectStreamUrl = removeInjectStreamUrl;
    /** Agora supports reporting and analyzing customized messages.
     *
     * @since v3.1.0
     *
     * This function is in the beta stage with a free trial. The ability provided in its beta test version is reporting a maximum of 10 message pieces within 6 seconds, with each message piece not exceeding 256 bytes.
     * To try out this function, contact [support@agora.io](mailto:support@agora.io) and discuss the format of customized messages with us.
     */
    function sendCustomReportMessage(id, category, event, label, value) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SEND_CUSTOM_REPORT_MESSAGE, { id: id, category: category, event: event, label: label, value: value });
    }
    agora.sendCustomReportMessage = sendCustomReportMessage;
    /** Gets the current connection state of the SDK.

     @return #CONNECTION_STATE_TYPE.
     */
    function getConnectionState() {
        if (isWeb) {
            var state = {
                'DISCONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED,
                'CONNECTING': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING,
                'CONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED,
                'DISCONNECTING': undefined,
            };
            return state[client.getConnectionState()];
        }
        return callNativeMethod(API_TYPE.GET_CONNECTION_STATE);
    }
    agora.getConnectionState = getConnectionState;
    function sendMetadata(_a) {
        var uid = _a.uid, size = _a.size, buffer = _a.buffer, timeStampMs = _a.timeStampMs;
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SEND_METADATA, { uid: uid, size: size, timeStampMs: timeStampMs }, buffer);
    }
    agora.sendMetadata = sendMetadata;
    function setMaxMetadataSize(size) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_MAX_META_SIZE, { size: size });
    }
    agora.setMaxMetadataSize = setMaxMetadataSize;
    /** Registers the metadata observer.

     Registers the metadata observer. You need to implement the IMetadataObserver class and specify the metadata type in this method. A successful call of this method triggers the \ref agora::rtc::IMetadataObserver::getMaxMetadataSize "getMaxMetadataSize" callback.
     This method enables you to add synchronized metadata in the video stream for more diversified live interactive streaming, such as sending shopping links, digital coupons, and online quizzes.

     @note
     - Call this method before the joinChannel method.
     - This method applies to the `LIVE_BROADCASTING` channel profile.

     @param observer The IMetadataObserver class. See the definition of IMetadataObserver for details.
     @param type See \ref IMetadataObserver::METADATA_TYPE "METADATA_TYPE". The SDK supports VIDEO_METADATA (0) only for now.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function registerMediaMetadataObserver(type) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.REGISTER_MEDIA_META_DATA_OBSERVER, { type: type });
    }
    agora.registerMediaMetadataObserver = registerMediaMetadataObserver;
    /** Provides technical preview functionalities or special customizations by configuring the SDK with JSON options.

     The JSON options are not public by default. Agora is working on making commonly used JSON options public in a standard way.

     @param parameters Sets the parameter as a JSON string in the specified format.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    function setParameters(parameters) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED;
        }
        return callNativeMethod(API_TYPE.SET_PARAMETERS, { parameters: parameters });
    }
    agora.setParameters = setParameters;
    /**
     * @internal
     */
    var API_TYPE;
    (function (API_TYPE) {
        API_TYPE[API_TYPE["INITIALIZE"] = 0] = "INITIALIZE";
        API_TYPE[API_TYPE["RELEASE"] = 1] = "RELEASE";
        API_TYPE[API_TYPE["SET_CHANNEL_PROFILE"] = 2] = "SET_CHANNEL_PROFILE";
        API_TYPE[API_TYPE["SET_CLIENT_ROLE"] = 3] = "SET_CLIENT_ROLE";
        API_TYPE[API_TYPE["JOIN_CHANNEL"] = 4] = "JOIN_CHANNEL";
        API_TYPE[API_TYPE["SWITCH_CHANNEL"] = 5] = "SWITCH_CHANNEL";
        API_TYPE[API_TYPE["LEAVE_CHANNEL"] = 6] = "LEAVE_CHANNEL";
        API_TYPE[API_TYPE["RE_NEW_TOKEN"] = 7] = "RE_NEW_TOKEN";
        API_TYPE[API_TYPE["REGISTER_LOCAL_USER_ACCOUNT"] = 8] = "REGISTER_LOCAL_USER_ACCOUNT";
        API_TYPE[API_TYPE["JOIN_CHANNEL_WITH_USER_ACCOUNT"] = 9] = "JOIN_CHANNEL_WITH_USER_ACCOUNT";
        API_TYPE[API_TYPE["GET_USER_INFO_BY_USER_ACCOUNT"] = 10] = "GET_USER_INFO_BY_USER_ACCOUNT";
        API_TYPE[API_TYPE["GET_USER_INFO_BY_UID"] = 11] = "GET_USER_INFO_BY_UID";
        API_TYPE[API_TYPE["START_ECHO_TEST"] = 12] = "START_ECHO_TEST";
        API_TYPE[API_TYPE["START_ECHO_TEST_2"] = 13] = "START_ECHO_TEST_2";
        API_TYPE[API_TYPE["STOP_ECHO_TEST"] = 14] = "STOP_ECHO_TEST";
        API_TYPE[API_TYPE["ENABLE_VIDEO"] = 15] = "ENABLE_VIDEO";
        API_TYPE[API_TYPE["DISABLE_VIDEO"] = 16] = "DISABLE_VIDEO";
        API_TYPE[API_TYPE["SET_VIDEO_PROFILE"] = 17] = "SET_VIDEO_PROFILE";
        API_TYPE[API_TYPE["SET_VIDEO_ENCODER_CONFIGURATION"] = 18] = "SET_VIDEO_ENCODER_CONFIGURATION";
        API_TYPE[API_TYPE["SET_CAMERA_CAPTURER_CONFIGURATION"] = 19] = "SET_CAMERA_CAPTURER_CONFIGURATION";
        API_TYPE[API_TYPE["SET_UP_LOCAL_VIDEO"] = 20] = "SET_UP_LOCAL_VIDEO";
        API_TYPE[API_TYPE["SET_UP_REMOTE_VIDEO"] = 21] = "SET_UP_REMOTE_VIDEO";
        API_TYPE[API_TYPE["START_PREVIEW"] = 22] = "START_PREVIEW";
        API_TYPE[API_TYPE["SET_REMOTE_USER_PRIORITY"] = 23] = "SET_REMOTE_USER_PRIORITY";
        API_TYPE[API_TYPE["STOP_PREVIEW"] = 24] = "STOP_PREVIEW";
        API_TYPE[API_TYPE["ENABLE_AUDIO"] = 25] = "ENABLE_AUDIO";
        API_TYPE[API_TYPE["ENABLE_LOCAL_AUDIO"] = 26] = "ENABLE_LOCAL_AUDIO";
        API_TYPE[API_TYPE["DISABLE_AUDIO"] = 27] = "DISABLE_AUDIO";
        API_TYPE[API_TYPE["SET_AUDIO_PROFILE"] = 28] = "SET_AUDIO_PROFILE";
        API_TYPE[API_TYPE["MUTE_LOCAL_AUDIO_STREAM"] = 29] = "MUTE_LOCAL_AUDIO_STREAM";
        API_TYPE[API_TYPE["MUTE_ALL_REMOTE_AUDIO_STREAMS"] = 30] = "MUTE_ALL_REMOTE_AUDIO_STREAMS";
        API_TYPE[API_TYPE["SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS"] = 31] = "SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS";
        API_TYPE[API_TYPE["ADJUST_USER_PLAYBACK_SIGNAL_VOLUME"] = 32] = "ADJUST_USER_PLAYBACK_SIGNAL_VOLUME";
        API_TYPE[API_TYPE["MUTE_REMOTE_AUDIO_STREAM"] = 33] = "MUTE_REMOTE_AUDIO_STREAM";
        API_TYPE[API_TYPE["MUTE_LOCAL_VIDEO_STREAM"] = 34] = "MUTE_LOCAL_VIDEO_STREAM";
        API_TYPE[API_TYPE["ENABLE_LOCAL_VIDEO"] = 35] = "ENABLE_LOCAL_VIDEO";
        API_TYPE[API_TYPE["MUTE_ALL_REMOTE_VIDEO_STREAMS"] = 36] = "MUTE_ALL_REMOTE_VIDEO_STREAMS";
        API_TYPE[API_TYPE["SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS"] = 37] = "SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS";
        API_TYPE[API_TYPE["MUTE_REMOTE_VIDEO_STREAM"] = 38] = "MUTE_REMOTE_VIDEO_STREAM";
        API_TYPE[API_TYPE["SET_REMOTE_VIDEO_STREAM_TYPE"] = 39] = "SET_REMOTE_VIDEO_STREAM_TYPE";
        API_TYPE[API_TYPE["SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE"] = 40] = "SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE";
        API_TYPE[API_TYPE["ENABLE_AUDIO_VOLUME_INDICATION"] = 41] = "ENABLE_AUDIO_VOLUME_INDICATION";
        API_TYPE[API_TYPE["START_AUDIO_RECORDING"] = 42] = "START_AUDIO_RECORDING";
        API_TYPE[API_TYPE["START_AUDIO_RECORDING2"] = 43] = "START_AUDIO_RECORDING2";
        API_TYPE[API_TYPE["STOP_AUDIO_RECORDING"] = 44] = "STOP_AUDIO_RECORDING";
        API_TYPE[API_TYPE["ENABLE_FACE_DETECTION"] = 62] = "ENABLE_FACE_DETECTION";
        API_TYPE[API_TYPE["SET_REMOTE_VOICE_POSITIONN"] = 73] = "SET_REMOTE_VOICE_POSITIONN";
        API_TYPE[API_TYPE["SET_LOG_FILE"] = 79] = "SET_LOG_FILE";
        API_TYPE[API_TYPE["SET_LOG_FILTER"] = 80] = "SET_LOG_FILTER";
        API_TYPE[API_TYPE["SET_LOG_FILE_SIZE"] = 81] = "SET_LOG_FILE_SIZE";
        API_TYPE[API_TYPE["SET_LOCAL_RENDER_MODE"] = 82] = "SET_LOCAL_RENDER_MODE";
        API_TYPE[API_TYPE["SET_LOCAL_RENDER_MODE_2"] = 83] = "SET_LOCAL_RENDER_MODE_2";
        API_TYPE[API_TYPE["SET_REMOTE_RENDER_MODE"] = 84] = "SET_REMOTE_RENDER_MODE";
        API_TYPE[API_TYPE["SET_REMOTE_RENDER_MODE_2"] = 85] = "SET_REMOTE_RENDER_MODE_2";
        API_TYPE[API_TYPE["SET_LOCAL_VIDEO_MIRROR_MODE"] = 86] = "SET_LOCAL_VIDEO_MIRROR_MODE";
        API_TYPE[API_TYPE["ENABLE_DUAL_STREAM_MODE"] = 87] = "ENABLE_DUAL_STREAM_MODE";
        API_TYPE[API_TYPE["ADJUST_RECORDING_SIGNAL_VOLUME"] = 93] = "ADJUST_RECORDING_SIGNAL_VOLUME";
        API_TYPE[API_TYPE["ADJUST_PLAYBACK_SIGNAL_VOLUME"] = 94] = "ADJUST_PLAYBACK_SIGNAL_VOLUME";
        API_TYPE[API_TYPE["ENABLE_WEB_SDK_INTEROPER_ABILITY"] = 95] = "ENABLE_WEB_SDK_INTEROPER_ABILITY";
        API_TYPE[API_TYPE["SET_VIDEO_QUALITY_PARAMETERS"] = 96] = "SET_VIDEO_QUALITY_PARAMETERS";
        API_TYPE[API_TYPE["SET_LOCAL_PUBLISH_FALLBACK_OPTION"] = 97] = "SET_LOCAL_PUBLISH_FALLBACK_OPTION";
        API_TYPE[API_TYPE["SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION"] = 98] = "SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION";
        API_TYPE[API_TYPE["SWITCH_CAMERA"] = 99] = "SWITCH_CAMERA";
        API_TYPE[API_TYPE["SWITCH_CAMERA_2"] = 100] = "SWITCH_CAMERA_2";
        API_TYPE[API_TYPE["SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE"] = 101] = "SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE";
        API_TYPE[API_TYPE["SET_ENABLE_SPEAKER_PHONE"] = 102] = "SET_ENABLE_SPEAKER_PHONE";
        API_TYPE[API_TYPE["ENABLE_IN_EAR_MONITORING"] = 103] = "ENABLE_IN_EAR_MONITORING";
        API_TYPE[API_TYPE["SET_IN_EAR_MONITORING_VOLUME"] = 104] = "SET_IN_EAR_MONITORING_VOLUME";
        API_TYPE[API_TYPE["IS_SPEAKER_PHONE_ENABLED"] = 105] = "IS_SPEAKER_PHONE_ENABLED";
        API_TYPE[API_TYPE["SET_AUDIO_SESSION_OPERATION_RESTRICTION"] = 106] = "SET_AUDIO_SESSION_OPERATION_RESTRICTION";
        API_TYPE[API_TYPE["ENABLE_LOOP_BACK_RECORDING"] = 107] = "ENABLE_LOOP_BACK_RECORDING";
        API_TYPE[API_TYPE["START_SCREEN_CAPTURE_BY_DISPLAY_ID"] = 108] = "START_SCREEN_CAPTURE_BY_DISPLAY_ID";
        API_TYPE[API_TYPE["START_SCREEN_CAPTURE_BY_SCREEN_RECT"] = 109] = "START_SCREEN_CAPTURE_BY_SCREEN_RECT";
        API_TYPE[API_TYPE["START_SCREEN_CAPTURE_BY_WINDOW_ID"] = 110] = "START_SCREEN_CAPTURE_BY_WINDOW_ID";
        API_TYPE[API_TYPE["SET_SCREEN_CAPTURE_CONTENT_HINT"] = 111] = "SET_SCREEN_CAPTURE_CONTENT_HINT";
        API_TYPE[API_TYPE["UPDATE_SCREEN_CAPTURE_PARAMETERS"] = 112] = "UPDATE_SCREEN_CAPTURE_PARAMETERS";
        API_TYPE[API_TYPE["UPDATE_SCREEN_CAPTURE_REGION"] = 113] = "UPDATE_SCREEN_CAPTURE_REGION";
        API_TYPE[API_TYPE["STOP_SCREEN_CAPTURE"] = 114] = "STOP_SCREEN_CAPTURE";
        API_TYPE[API_TYPE["GET_CALL_ID"] = 117] = "GET_CALL_ID";
        API_TYPE[API_TYPE["RATE"] = 118] = "RATE";
        API_TYPE[API_TYPE["COMPLAIN"] = 119] = "COMPLAIN";
        API_TYPE[API_TYPE["GET_VERSION"] = 120] = "GET_VERSION";
        API_TYPE[API_TYPE["ENABLE_LAST_MILE_TEST"] = 121] = "ENABLE_LAST_MILE_TEST";
        API_TYPE[API_TYPE["DISABLE_LAST_MILE_TEST"] = 122] = "DISABLE_LAST_MILE_TEST";
        API_TYPE[API_TYPE["START_LAST_MILE_PROBE_TEST"] = 123] = "START_LAST_MILE_PROBE_TEST";
        API_TYPE[API_TYPE["STOP_LAST_MILE_PROBE_TEST"] = 124] = "STOP_LAST_MILE_PROBE_TEST";
        API_TYPE[API_TYPE["GET_ERROR_DESCRIPTION"] = 125] = "GET_ERROR_DESCRIPTION";
        API_TYPE[API_TYPE["SET_ENCRYPTION_SECTRT"] = 126] = "SET_ENCRYPTION_SECTRT";
        API_TYPE[API_TYPE["SET_ENCRYPTION_MODE"] = 127] = "SET_ENCRYPTION_MODE";
        API_TYPE[API_TYPE["REGISTER_PACKET_OBSERVER"] = 128] = "REGISTER_PACKET_OBSERVER";
        API_TYPE[API_TYPE["CREATE_DATA_STREAM"] = 129] = "CREATE_DATA_STREAM";
        API_TYPE[API_TYPE["SEND_STREAM_MESSAGE"] = 130] = "SEND_STREAM_MESSAGE";
        API_TYPE[API_TYPE["ADD_PUBLISH_STREAM_URL"] = 131] = "ADD_PUBLISH_STREAM_URL";
        API_TYPE[API_TYPE["REMOVE_PUBLISH_STREAM_URL"] = 132] = "REMOVE_PUBLISH_STREAM_URL";
        API_TYPE[API_TYPE["SET_LIVE_TRANSCODING"] = 133] = "SET_LIVE_TRANSCODING";
        API_TYPE[API_TYPE["ADD_VIDEO_WATER_MARK"] = 134] = "ADD_VIDEO_WATER_MARK";
        API_TYPE[API_TYPE["ADD_VIDEO_WATER_MARK_2"] = 135] = "ADD_VIDEO_WATER_MARK_2";
        API_TYPE[API_TYPE["CLEAR_VIDEO_WATER_MARKS"] = 136] = "CLEAR_VIDEO_WATER_MARKS";
        API_TYPE[API_TYPE["SET_BEAUTY_EFFECT_OPTIONS"] = 137] = "SET_BEAUTY_EFFECT_OPTIONS";
        API_TYPE[API_TYPE["ADD_INJECT_STREAM_URL"] = 138] = "ADD_INJECT_STREAM_URL";
        API_TYPE[API_TYPE["START_CHANNEL_MEDIA_RELAY"] = 139] = "START_CHANNEL_MEDIA_RELAY";
        API_TYPE[API_TYPE["UPDATE_CHANNEL_MEDIA_RELAY"] = 140] = "UPDATE_CHANNEL_MEDIA_RELAY";
        API_TYPE[API_TYPE["STOP_CHANNEL_MEDIA_RELAY"] = 141] = "STOP_CHANNEL_MEDIA_RELAY";
        API_TYPE[API_TYPE["REMOVE_INJECT_STREAM_URL"] = 142] = "REMOVE_INJECT_STREAM_URL";
        API_TYPE[API_TYPE["GET_CONNECTION_STATE"] = 143] = "GET_CONNECTION_STATE";
        API_TYPE[API_TYPE["REGISTER_MEDIA_META_DATA_OBSERVER"] = 144] = "REGISTER_MEDIA_META_DATA_OBSERVER";
        API_TYPE[API_TYPE["SET_PARAMETERS"] = 145] = "SET_PARAMETERS";
        API_TYPE[API_TYPE["SET_PLAYBACK_DEVICE_VOLUME"] = 146] = "SET_PLAYBACK_DEVICE_VOLUME";
        API_TYPE[API_TYPE["PUBLISH"] = 147] = "PUBLISH";
        API_TYPE[API_TYPE["UNPUBLISH"] = 148] = "UNPUBLISH";
        API_TYPE[API_TYPE["CHANNEL_ID"] = 149] = "CHANNEL_ID";
        API_TYPE[API_TYPE["SEND_METADATA"] = 150] = "SEND_METADATA";
        API_TYPE[API_TYPE["SET_MAX_META_SIZE"] = 151] = "SET_MAX_META_SIZE";
        API_TYPE[API_TYPE["PUSH_AUDIO_FRAME"] = 152] = "PUSH_AUDIO_FRAME";
        API_TYPE[API_TYPE["PUSH_AUDIO_FRAME_2"] = 153] = "PUSH_AUDIO_FRAME_2";
        API_TYPE[API_TYPE["PULL_AUDIO_FRAME"] = 154] = "PULL_AUDIO_FRAME";
        API_TYPE[API_TYPE["SET_EXTERN_VIDEO_SOURCE"] = 155] = "SET_EXTERN_VIDEO_SOURCE";
        API_TYPE[API_TYPE["PUSH_VIDEO_FRAME"] = 156] = "PUSH_VIDEO_FRAME";
        API_TYPE[API_TYPE["ENABLE_ENCRYPTION"] = 157] = "ENABLE_ENCRYPTION";
        API_TYPE[API_TYPE["SEND_CUSTOM_REPORT_MESSAGE"] = 158] = "SEND_CUSTOM_REPORT_MESSAGE";
    })(API_TYPE || (API_TYPE = {}));
    agora.API_TYPE=API_TYPE;
    /**
     * @internal
     */
    var API_TYPE_AUDIO_EFFECT;
    (function (API_TYPE_AUDIO_EFFECT) {
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["START_AUDIO_MIXING"] = 45] = "START_AUDIO_MIXING";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["STOP_AUDIO_MIXING"] = 46] = "STOP_AUDIO_MIXING";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["PAUSE_AUDIO_MIXING"] = 47] = "PAUSE_AUDIO_MIXING";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["RESUME_AUDIO_MIXING"] = 48] = "RESUME_AUDIO_MIXING";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_HIGH_QUALITY_AUDIO_PARAMETERS"] = 49] = "SET_HIGH_QUALITY_AUDIO_PARAMETERS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["ADJUST_AUDIO_MIXING_VOLUME"] = 50] = "ADJUST_AUDIO_MIXING_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME"] = 51] = "ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["GET_AUDIO_MIXING_PLAYOUT_VOLUME"] = 52] = "GET_AUDIO_MIXING_PLAYOUT_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["ADJUST_AUDIO_MIXING_PUBLISH_VOLUME"] = 53] = "ADJUST_AUDIO_MIXING_PUBLISH_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["GET_AUDIO_MIXING_PUBLISH_VOLUME"] = 54] = "GET_AUDIO_MIXING_PUBLISH_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["GET_AUDIO_MIXING_DURATION"] = 55] = "GET_AUDIO_MIXING_DURATION";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["GET_AUDIO_MIXING_CURRENT_POSITION"] = 56] = "GET_AUDIO_MIXING_CURRENT_POSITION";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_AUDIO_MIXING_POSITION"] = 57] = "SET_AUDIO_MIXING_POSITION";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_AUDIO_MIXING_PITCH"] = 58] = "SET_AUDIO_MIXING_PITCH";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["GET_EFFECTS_VOLUME"] = 59] = "GET_EFFECTS_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_EFFECTS_VOLUME"] = 60] = "SET_EFFECTS_VOLUME";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_VOLUME_OF_EFFECT"] = 61] = "SET_VOLUME_OF_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["PLAY_EFFECT"] = 63] = "PLAY_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["STOP_EFFECT"] = 64] = "STOP_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["STOP_ALL_EFFECTS"] = 65] = "STOP_ALL_EFFECTS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["PRE_LOAD_EFFECT"] = 66] = "PRE_LOAD_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["UN_LOAD_EFFECT"] = 67] = "UN_LOAD_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["PAUSE_EFFECT"] = 68] = "PAUSE_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["PAUSE_ALL_EFFECTS"] = 69] = "PAUSE_ALL_EFFECTS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["RESUME_EFFECT"] = 70] = "RESUME_EFFECT";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["RESUME_ALL_EFFECTS"] = 71] = "RESUME_ALL_EFFECTS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["ENABLE_SOUND_POSITION_INDICATION"] = 72] = "ENABLE_SOUND_POSITION_INDICATION";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_LOCAL_VOICE_PITCH"] = 74] = "SET_LOCAL_VOICE_PITCH";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_LOCAL_VOICE_EQUALIZATION"] = 75] = "SET_LOCAL_VOICE_EQUALIZATION";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_LOCAL_VOICE_REVERB"] = 76] = "SET_LOCAL_VOICE_REVERB";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_LOCAL_VOICE_CHANGER"] = 77] = "SET_LOCAL_VOICE_CHANGER";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_LOCAL_VOICE_REVERB_PRESET"] = 78] = "SET_LOCAL_VOICE_REVERB_PRESET";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_EXTERNAL_AUDIO_SOURCE"] = 88] = "SET_EXTERNAL_AUDIO_SOURCE";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_EXTERNAL_AUDIO_SINK"] = 89] = "SET_EXTERNAL_AUDIO_SINK";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_RECORDING_AUDIO_FRAME_PARAMETERS"] = 90] = "SET_RECORDING_AUDIO_FRAME_PARAMETERS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_PLAYBACK_AUDIO_FRAME_PARAMETERS"] = 91] = "SET_PLAYBACK_AUDIO_FRAME_PARAMETERS";
        API_TYPE_AUDIO_EFFECT[API_TYPE_AUDIO_EFFECT["SET_MIXED_AUDIO_FRAME_PARAMETERS"] = 92] = "SET_MIXED_AUDIO_FRAME_PARAMETERS";
    })(API_TYPE_AUDIO_EFFECT || (API_TYPE_AUDIO_EFFECT = {}));
    agora.API_TYPE_AUDIO_EFFECT=API_TYPE_AUDIO_EFFECT;
    /** Media device states.
     */
    var MEDIA_DEVICE_STATE_TYPE;
    (function (MEDIA_DEVICE_STATE_TYPE) {
        /** 1: The device is active.
         */
        MEDIA_DEVICE_STATE_TYPE[MEDIA_DEVICE_STATE_TYPE["MEDIA_DEVICE_STATE_ACTIVE"] = 1] = "MEDIA_DEVICE_STATE_ACTIVE";
        /** 2: The device is disabled.
         */
        MEDIA_DEVICE_STATE_TYPE[MEDIA_DEVICE_STATE_TYPE["MEDIA_DEVICE_STATE_DISABLED"] = 2] = "MEDIA_DEVICE_STATE_DISABLED";
        /** 4: The device is not present.
         */
        MEDIA_DEVICE_STATE_TYPE[MEDIA_DEVICE_STATE_TYPE["MEDIA_DEVICE_STATE_NOT_PRESENT"] = 4] = "MEDIA_DEVICE_STATE_NOT_PRESENT";
        /** 8: The device is unplugged.
         */
        MEDIA_DEVICE_STATE_TYPE[MEDIA_DEVICE_STATE_TYPE["MEDIA_DEVICE_STATE_UNPLUGGED"] = 8] = "MEDIA_DEVICE_STATE_UNPLUGGED";
    })(MEDIA_DEVICE_STATE_TYPE = agora.MEDIA_DEVICE_STATE_TYPE || (agora.MEDIA_DEVICE_STATE_TYPE = {}));
    /** Media device types.
     */
    var MEDIA_DEVICE_TYPE;
    (function (MEDIA_DEVICE_TYPE) {
        /** -1: Unknown device type.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["UNKNOWN_AUDIO_DEVICE"] = -1] = "UNKNOWN_AUDIO_DEVICE";
        /** 0: Audio playback device.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["AUDIO_PLAYOUT_DEVICE"] = 0] = "AUDIO_PLAYOUT_DEVICE";
        /** 1: Audio recording device.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["AUDIO_RECORDING_DEVICE"] = 1] = "AUDIO_RECORDING_DEVICE";
        /** 2: Video renderer.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["VIDEO_RENDER_DEVICE"] = 2] = "VIDEO_RENDER_DEVICE";
        /** 3: Video capturer.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["VIDEO_CAPTURE_DEVICE"] = 3] = "VIDEO_CAPTURE_DEVICE";
        /** 4: Application audio playback device.
         */
        MEDIA_DEVICE_TYPE[MEDIA_DEVICE_TYPE["AUDIO_APPLICATION_PLAYOUT_DEVICE"] = 4] = "AUDIO_APPLICATION_PLAYOUT_DEVICE";
    })(MEDIA_DEVICE_TYPE = agora.MEDIA_DEVICE_TYPE || (agora.MEDIA_DEVICE_TYPE = {}));
    /** The states of the local user's audio mixing file.
     */
    var AUDIO_MIXING_STATE_TYPE;
    (function (AUDIO_MIXING_STATE_TYPE) {
        /** 710: The audio mixing file is playing.
         */
        AUDIO_MIXING_STATE_TYPE[AUDIO_MIXING_STATE_TYPE["AUDIO_MIXING_STATE_PLAYING"] = 710] = "AUDIO_MIXING_STATE_PLAYING";
        /** 711: The audio mixing file pauses playing.
         */
        AUDIO_MIXING_STATE_TYPE[AUDIO_MIXING_STATE_TYPE["AUDIO_MIXING_STATE_PAUSED"] = 711] = "AUDIO_MIXING_STATE_PAUSED";
        /** 713: The audio mixing file stops playing.
         */
        AUDIO_MIXING_STATE_TYPE[AUDIO_MIXING_STATE_TYPE["AUDIO_MIXING_STATE_STOPPED"] = 713] = "AUDIO_MIXING_STATE_STOPPED";
        /** 714: An exception occurs when playing the audio mixing file. See #AUDIO_MIXING_ERROR_TYPE.
         */
        AUDIO_MIXING_STATE_TYPE[AUDIO_MIXING_STATE_TYPE["AUDIO_MIXING_STATE_FAILED"] = 714] = "AUDIO_MIXING_STATE_FAILED";
    })(AUDIO_MIXING_STATE_TYPE = agora.AUDIO_MIXING_STATE_TYPE || (agora.AUDIO_MIXING_STATE_TYPE = {}));
    /** The error codes of the local user's audio mixing file.
     */
    var AUDIO_MIXING_ERROR_TYPE;
    (function (AUDIO_MIXING_ERROR_TYPE) {
        /** 701: The SDK cannot open the audio mixing file.
         */
        AUDIO_MIXING_ERROR_TYPE[AUDIO_MIXING_ERROR_TYPE["AUDIO_MIXING_ERROR_CAN_NOT_OPEN"] = 701] = "AUDIO_MIXING_ERROR_CAN_NOT_OPEN";
        /** 702: The SDK opens the audio mixing file too frequently.
         */
        AUDIO_MIXING_ERROR_TYPE[AUDIO_MIXING_ERROR_TYPE["AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL"] = 702] = "AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL";
        /** 703: The audio mixing file playback is interrupted.
         */
        AUDIO_MIXING_ERROR_TYPE[AUDIO_MIXING_ERROR_TYPE["AUDIO_MIXING_ERROR_INTERRUPTED_EOF"] = 703] = "AUDIO_MIXING_ERROR_INTERRUPTED_EOF";
        /** 0: The SDK can open the audio mixing file.
         */
        AUDIO_MIXING_ERROR_TYPE[AUDIO_MIXING_ERROR_TYPE["AUDIO_MIXING_ERROR_OK"] = 0] = "AUDIO_MIXING_ERROR_OK";
    })(AUDIO_MIXING_ERROR_TYPE = agora.AUDIO_MIXING_ERROR_TYPE || (agora.AUDIO_MIXING_ERROR_TYPE = {}));
    /** Local video state types
     */
    var LOCAL_VIDEO_STREAM_STATE;
    (function (LOCAL_VIDEO_STREAM_STATE) {
        /** 0: Initial state */
        LOCAL_VIDEO_STREAM_STATE[LOCAL_VIDEO_STREAM_STATE["LOCAL_VIDEO_STREAM_STATE_STOPPED"] = 0] = "LOCAL_VIDEO_STREAM_STATE_STOPPED";
        /** 1: The local video capturing device starts successfully.
         *
         * The SDK also reports this state when you share a maximized window by calling \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId".
         */
        LOCAL_VIDEO_STREAM_STATE[LOCAL_VIDEO_STREAM_STATE["LOCAL_VIDEO_STREAM_STATE_CAPTURING"] = 1] = "LOCAL_VIDEO_STREAM_STATE_CAPTURING";
        /** 2: The first video frame is successfully encoded. */
        LOCAL_VIDEO_STREAM_STATE[LOCAL_VIDEO_STREAM_STATE["LOCAL_VIDEO_STREAM_STATE_ENCODING"] = 2] = "LOCAL_VIDEO_STREAM_STATE_ENCODING";
        /** 3: The local video fails to start. */
        LOCAL_VIDEO_STREAM_STATE[LOCAL_VIDEO_STREAM_STATE["LOCAL_VIDEO_STREAM_STATE_FAILED"] = 3] = "LOCAL_VIDEO_STREAM_STATE_FAILED";
    })(LOCAL_VIDEO_STREAM_STATE = agora.LOCAL_VIDEO_STREAM_STATE || (agora.LOCAL_VIDEO_STREAM_STATE = {}));
    /** Local video state error codes
     */
    var LOCAL_VIDEO_STREAM_ERROR;
    (function (LOCAL_VIDEO_STREAM_ERROR) {
        /** 0: The local video is normal. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_OK"] = 0] = "LOCAL_VIDEO_STREAM_ERROR_OK";
        /** 1: No specified reason for the local video failure. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_FAILURE"] = 1] = "LOCAL_VIDEO_STREAM_ERROR_FAILURE";
        /** 2: No permission to use the local video capturing device. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_DEVICE_NO_PERMISSION"] = 2] = "LOCAL_VIDEO_STREAM_ERROR_DEVICE_NO_PERMISSION";
        /** 3: The local video capturing device is in use. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY"] = 3] = "LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY";
        /** 4: The local video capture fails. Check whether the capturing device is working properly. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE"] = 4] = "LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE";
        /** 5: The local video encoding fails. */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_ENCODE_FAILURE"] = 5] = "LOCAL_VIDEO_STREAM_ERROR_ENCODE_FAILURE";
        /** 11: The shared window is minimized when you call \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId" to share a window.
         */
        LOCAL_VIDEO_STREAM_ERROR[LOCAL_VIDEO_STREAM_ERROR["LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_MINIMIZED"] = 11] = "LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_MINIMIZED";
    })(LOCAL_VIDEO_STREAM_ERROR = agora.LOCAL_VIDEO_STREAM_ERROR || (agora.LOCAL_VIDEO_STREAM_ERROR = {}));
    /** Local audio state types.
     */
    var LOCAL_AUDIO_STREAM_STATE;
    (function (LOCAL_AUDIO_STREAM_STATE) {
        /** 0: The local audio is in the initial state.
         */
        LOCAL_AUDIO_STREAM_STATE[LOCAL_AUDIO_STREAM_STATE["LOCAL_AUDIO_STREAM_STATE_STOPPED"] = 0] = "LOCAL_AUDIO_STREAM_STATE_STOPPED";
        /** 1: The recording device starts successfully.
         */
        LOCAL_AUDIO_STREAM_STATE[LOCAL_AUDIO_STREAM_STATE["LOCAL_AUDIO_STREAM_STATE_RECORDING"] = 1] = "LOCAL_AUDIO_STREAM_STATE_RECORDING";
        /** 2: The first audio frame encodes successfully.
         */
        LOCAL_AUDIO_STREAM_STATE[LOCAL_AUDIO_STREAM_STATE["LOCAL_AUDIO_STREAM_STATE_ENCODING"] = 2] = "LOCAL_AUDIO_STREAM_STATE_ENCODING";
        /** 3: The local audio fails to start.
         */
        LOCAL_AUDIO_STREAM_STATE[LOCAL_AUDIO_STREAM_STATE["LOCAL_AUDIO_STREAM_STATE_FAILED"] = 3] = "LOCAL_AUDIO_STREAM_STATE_FAILED";
    })(LOCAL_AUDIO_STREAM_STATE = agora.LOCAL_AUDIO_STREAM_STATE || (agora.LOCAL_AUDIO_STREAM_STATE = {}));
    /** Local audio state error codes.
     */
    var LOCAL_AUDIO_STREAM_ERROR;
    (function (LOCAL_AUDIO_STREAM_ERROR) {
        /** 0: The local audio is normal.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_OK"] = 0] = "LOCAL_AUDIO_STREAM_ERROR_OK";
        /** 1: No specified reason for the local audio failure.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_FAILURE"] = 1] = "LOCAL_AUDIO_STREAM_ERROR_FAILURE";
        /** 2: No permission to use the local audio device.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_DEVICE_NO_PERMISSION"] = 2] = "LOCAL_AUDIO_STREAM_ERROR_DEVICE_NO_PERMISSION";
        /** 3: The microphone is in use.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_DEVICE_BUSY"] = 3] = "LOCAL_AUDIO_STREAM_ERROR_DEVICE_BUSY";
        /** 4: The local audio recording fails. Check whether the recording device
         * is working properly.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_RECORD_FAILURE"] = 4] = "LOCAL_AUDIO_STREAM_ERROR_RECORD_FAILURE";
        /** 5: The local audio encoding fails.
         */
        LOCAL_AUDIO_STREAM_ERROR[LOCAL_AUDIO_STREAM_ERROR["LOCAL_AUDIO_STREAM_ERROR_ENCODE_FAILURE"] = 5] = "LOCAL_AUDIO_STREAM_ERROR_ENCODE_FAILURE";
    })(LOCAL_AUDIO_STREAM_ERROR = agora.LOCAL_AUDIO_STREAM_ERROR || (agora.LOCAL_AUDIO_STREAM_ERROR = {}));
    /** Audio recording qualities.
     */
    var AUDIO_RECORDING_QUALITY_TYPE;
    (function (AUDIO_RECORDING_QUALITY_TYPE) {
        /** 0: Low quality. The sample rate is 32 kHz, and the file size is around
         * 1.2 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_TYPE[AUDIO_RECORDING_QUALITY_TYPE["AUDIO_RECORDING_QUALITY_LOW"] = 0] = "AUDIO_RECORDING_QUALITY_LOW";
        /** 1: Medium quality. The sample rate is 32 kHz, and the file size is
         * around 2 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_TYPE[AUDIO_RECORDING_QUALITY_TYPE["AUDIO_RECORDING_QUALITY_MEDIUM"] = 1] = "AUDIO_RECORDING_QUALITY_MEDIUM";
        /** 2: High quality. The sample rate is 32 kHz, and the file size is
         * around 3.75 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_TYPE[AUDIO_RECORDING_QUALITY_TYPE["AUDIO_RECORDING_QUALITY_HIGH"] = 2] = "AUDIO_RECORDING_QUALITY_HIGH";
    })(AUDIO_RECORDING_QUALITY_TYPE = agora.AUDIO_RECORDING_QUALITY_TYPE || (agora.AUDIO_RECORDING_QUALITY_TYPE = {}));
    /** Network quality types. */
    var QUALITY_TYPE;
    (function (QUALITY_TYPE) {
        /** 0: The network quality is unknown. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_UNKNOWN"] = 0] = "QUALITY_UNKNOWN";
        /**  1: The network quality is excellent. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_EXCELLENT"] = 1] = "QUALITY_EXCELLENT";
        /** 2: The network quality is quite good, but the bitrate may be slightly lower than excellent. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_GOOD"] = 2] = "QUALITY_GOOD";
        /** 3: Users can feel the communication slightly impaired. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_POOR"] = 3] = "QUALITY_POOR";
        /** 4: Users cannot communicate smoothly. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_BAD"] = 4] = "QUALITY_BAD";
        /** 5: The network is so bad that users can barely communicate. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_VBAD"] = 5] = "QUALITY_VBAD";
        /** 6: The network is down and users cannot communicate at all. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_DOWN"] = 6] = "QUALITY_DOWN";
        /** 7: Users cannot detect the network quality. (Not in use.) */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_UNSUPPORTED"] = 7] = "QUALITY_UNSUPPORTED";
        /** 8: Detecting the network quality. */
        QUALITY_TYPE[QUALITY_TYPE["QUALITY_DETECTING"] = 8] = "QUALITY_DETECTING";
    })(QUALITY_TYPE = agora.QUALITY_TYPE || (agora.QUALITY_TYPE = {}));
    /** Video display modes. */
    var RENDER_MODE_TYPE;
    (function (RENDER_MODE_TYPE) {
        /**
         1: Uniformly scale the video until it fills the visible boundaries (cropped). One dimension of the video may have clipped contents.
         */
        RENDER_MODE_TYPE[RENDER_MODE_TYPE["RENDER_MODE_HIDDEN"] = 1] = "RENDER_MODE_HIDDEN";
        /**
         2: Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Areas that are not filled due to disparity in the aspect ratio are filled with black.
         */
        RENDER_MODE_TYPE[RENDER_MODE_TYPE["RENDER_MODE_FIT"] = 2] = "RENDER_MODE_FIT";
        /** **DEPRECATED** 3: This mode is deprecated.
         */
        RENDER_MODE_TYPE[RENDER_MODE_TYPE["RENDER_MODE_ADAPTIVE"] = 3] = "RENDER_MODE_ADAPTIVE";
        /**
         4: The fill mode. In this mode, the SDK stretches or zooms the video to fill the display window.
         */
        RENDER_MODE_TYPE[RENDER_MODE_TYPE["RENDER_MODE_FILL"] = 4] = "RENDER_MODE_FILL";
    })(RENDER_MODE_TYPE = agora.RENDER_MODE_TYPE || (agora.RENDER_MODE_TYPE = {}));
    /** Video mirror modes. */
    var VIDEO_MIRROR_MODE_TYPE;
    (function (VIDEO_MIRROR_MODE_TYPE) {
        /** 0: (Default) The SDK enables the mirror mode.
         */
        VIDEO_MIRROR_MODE_TYPE[VIDEO_MIRROR_MODE_TYPE["VIDEO_MIRROR_MODE_AUTO"] = 0] = "VIDEO_MIRROR_MODE_AUTO";
        /** 1: Enable mirror mode. */
        VIDEO_MIRROR_MODE_TYPE[VIDEO_MIRROR_MODE_TYPE["VIDEO_MIRROR_MODE_ENABLED"] = 1] = "VIDEO_MIRROR_MODE_ENABLED";
        /** 2: Disable mirror mode. */
        VIDEO_MIRROR_MODE_TYPE[VIDEO_MIRROR_MODE_TYPE["VIDEO_MIRROR_MODE_DISABLED"] = 2] = "VIDEO_MIRROR_MODE_DISABLED";
    })(VIDEO_MIRROR_MODE_TYPE = agora.VIDEO_MIRROR_MODE_TYPE || (agora.VIDEO_MIRROR_MODE_TYPE = {}));
    /** **DEPRECATED** Video profiles. */
    var VIDEO_PROFILE_TYPE;
    (function (VIDEO_PROFILE_TYPE) {
        /** 0: 160 * 120, frame rate 15 fps, bitrate 65 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_120P"] = 0] = "VIDEO_PROFILE_LANDSCAPE_120P";
        /** 2: 120 * 120, frame rate 15 fps, bitrate 50 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_120P_3"] = 2] = "VIDEO_PROFILE_LANDSCAPE_120P_3";
        /** 10: 320*180, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P"] = 10] = "VIDEO_PROFILE_LANDSCAPE_180P";
        /** 12: 180 * 180, frame rate 15 fps, bitrate 100 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P_3"] = 12] = "VIDEO_PROFILE_LANDSCAPE_180P_3";
        /** 13: 240 * 180, frame rate 15 fps, bitrate 120 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_180P_4"] = 13] = "VIDEO_PROFILE_LANDSCAPE_180P_4";
        /** 20: 320 * 240, frame rate 15 fps, bitrate 200 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P"] = 20] = "VIDEO_PROFILE_LANDSCAPE_240P";
        /** 22: 240 * 240, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P_3"] = 22] = "VIDEO_PROFILE_LANDSCAPE_240P_3";
        /** 23: 424 * 240, frame rate 15 fps, bitrate 220 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_240P_4"] = 23] = "VIDEO_PROFILE_LANDSCAPE_240P_4";
        /** 30: 640 * 360, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P"] = 30] = "VIDEO_PROFILE_LANDSCAPE_360P";
        /** 32: 360 * 360, frame rate 15 fps, bitrate 260 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_3"] = 32] = "VIDEO_PROFILE_LANDSCAPE_360P_3";
        /** 33: 640 * 360, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_4"] = 33] = "VIDEO_PROFILE_LANDSCAPE_360P_4";
        /** 35: 360 * 360, frame rate 30 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_6"] = 35] = "VIDEO_PROFILE_LANDSCAPE_360P_6";
        /** 36: 480 * 360, frame rate 15 fps, bitrate 320 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_7"] = 36] = "VIDEO_PROFILE_LANDSCAPE_360P_7";
        /** 37: 480 * 360, frame rate 30 fps, bitrate 490 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_8"] = 37] = "VIDEO_PROFILE_LANDSCAPE_360P_8";
        /** 38: 640 * 360, frame rate 15 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_9"] = 38] = "VIDEO_PROFILE_LANDSCAPE_360P_9";
        /** 39: 640 * 360, frame rate 24 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_10"] = 39] = "VIDEO_PROFILE_LANDSCAPE_360P_10";
        /** 100: 640 * 360, frame rate 24 fps, bitrate 1000 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_360P_11"] = 100] = "VIDEO_PROFILE_LANDSCAPE_360P_11";
        /** 40: 640 * 480, frame rate 15 fps, bitrate 500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P"] = 40] = "VIDEO_PROFILE_LANDSCAPE_480P";
        /** 42: 480 * 480, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_3"] = 42] = "VIDEO_PROFILE_LANDSCAPE_480P_3";
        /** 43: 640 * 480, frame rate 30 fps, bitrate 750 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_4"] = 43] = "VIDEO_PROFILE_LANDSCAPE_480P_4";
        /** 45: 480 * 480, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_6"] = 45] = "VIDEO_PROFILE_LANDSCAPE_480P_6";
        /** 47: 848 * 480, frame rate 15 fps, bitrate 610 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_8"] = 47] = "VIDEO_PROFILE_LANDSCAPE_480P_8";
        /** 48: 848 * 480, frame rate 30 fps, bitrate 930 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_9"] = 48] = "VIDEO_PROFILE_LANDSCAPE_480P_9";
        /** 49: 640 * 480, frame rate 10 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_480P_10"] = 49] = "VIDEO_PROFILE_LANDSCAPE_480P_10";
        /** 50: 1280 * 720, frame rate 15 fps, bitrate 1130 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P"] = 50] = "VIDEO_PROFILE_LANDSCAPE_720P";
        /** 52: 1280 * 720, frame rate 30 fps, bitrate 1710 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_3"] = 52] = "VIDEO_PROFILE_LANDSCAPE_720P_3";
        /** 54: 960 * 720, frame rate 15 fps, bitrate 910 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_5"] = 54] = "VIDEO_PROFILE_LANDSCAPE_720P_5";
        /** 55: 960 * 720, frame rate 30 fps, bitrate 1380 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_720P_6"] = 55] = "VIDEO_PROFILE_LANDSCAPE_720P_6";
        /** 60: 1920 * 1080, frame rate 15 fps, bitrate 2080 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P"] = 60] = "VIDEO_PROFILE_LANDSCAPE_1080P";
        /** 62: 1920 * 1080, frame rate 30 fps, bitrate 3150 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P_3"] = 62] = "VIDEO_PROFILE_LANDSCAPE_1080P_3";
        /** 64: 1920 * 1080, frame rate 60 fps, bitrate 4780 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1080P_5"] = 64] = "VIDEO_PROFILE_LANDSCAPE_1080P_5";
        /** 66: 2560 * 1440, frame rate 30 fps, bitrate 4850 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1440P"] = 66] = "VIDEO_PROFILE_LANDSCAPE_1440P";
        /** 67: 2560 * 1440, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_1440P_2"] = 67] = "VIDEO_PROFILE_LANDSCAPE_1440P_2";
        /** 70: 3840 * 2160, frame rate 30 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_4K"] = 70] = "VIDEO_PROFILE_LANDSCAPE_4K";
        /** 72: 3840 * 2160, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_LANDSCAPE_4K_3"] = 72] = "VIDEO_PROFILE_LANDSCAPE_4K_3";
        /** 1000: 120 * 160, frame rate 15 fps, bitrate 65 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_120P"] = 1000] = "VIDEO_PROFILE_PORTRAIT_120P";
        /** 1002: 120 * 120, frame rate 15 fps, bitrate 50 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_120P_3"] = 1002] = "VIDEO_PROFILE_PORTRAIT_120P_3";
        /** 1010: 180 * 320, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P"] = 1010] = "VIDEO_PROFILE_PORTRAIT_180P";
        /** 1012: 180 * 180, frame rate 15 fps, bitrate 100 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P_3"] = 1012] = "VIDEO_PROFILE_PORTRAIT_180P_3";
        /** 1013: 180 * 240, frame rate 15 fps, bitrate 120 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_180P_4"] = 1013] = "VIDEO_PROFILE_PORTRAIT_180P_4";
        /** 1020: 240 * 320, frame rate 15 fps, bitrate 200 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P"] = 1020] = "VIDEO_PROFILE_PORTRAIT_240P";
        /** 1022: 240 * 240, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P_3"] = 1022] = "VIDEO_PROFILE_PORTRAIT_240P_3";
        /** 1023: 240 * 424, frame rate 15 fps, bitrate 220 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_240P_4"] = 1023] = "VIDEO_PROFILE_PORTRAIT_240P_4";
        /** 1030: 360 * 640, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P"] = 1030] = "VIDEO_PROFILE_PORTRAIT_360P";
        /** 1032: 360 * 360, frame rate 15 fps, bitrate 260 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_3"] = 1032] = "VIDEO_PROFILE_PORTRAIT_360P_3";
        /** 1033: 360 * 640, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_4"] = 1033] = "VIDEO_PROFILE_PORTRAIT_360P_4";
        /** 1035: 360 * 360, frame rate 30 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_6"] = 1035] = "VIDEO_PROFILE_PORTRAIT_360P_6";
        /** 1036: 360 * 480, frame rate 15 fps, bitrate 320 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_7"] = 1036] = "VIDEO_PROFILE_PORTRAIT_360P_7";
        /** 1037: 360 * 480, frame rate 30 fps, bitrate 490 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_8"] = 1037] = "VIDEO_PROFILE_PORTRAIT_360P_8";
        /** 1038: 360 * 640, frame rate 15 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_9"] = 1038] = "VIDEO_PROFILE_PORTRAIT_360P_9";
        /** 1039: 360 * 640, frame rate 24 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_10"] = 1039] = "VIDEO_PROFILE_PORTRAIT_360P_10";
        /** 1100: 360 * 640, frame rate 24 fps, bitrate 1000 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_360P_11"] = 1100] = "VIDEO_PROFILE_PORTRAIT_360P_11";
        /** 1040: 480 * 640, frame rate 15 fps, bitrate 500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P"] = 1040] = "VIDEO_PROFILE_PORTRAIT_480P";
        /** 1042: 480 * 480, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_3"] = 1042] = "VIDEO_PROFILE_PORTRAIT_480P_3";
        /** 1043: 480 * 640, frame rate 30 fps, bitrate 750 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_4"] = 1043] = "VIDEO_PROFILE_PORTRAIT_480P_4";
        /** 1045: 480 * 480, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_6"] = 1045] = "VIDEO_PROFILE_PORTRAIT_480P_6";
        /** 1047: 480 * 848, frame rate 15 fps, bitrate 610 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_8"] = 1047] = "VIDEO_PROFILE_PORTRAIT_480P_8";
        /** 1048: 480 * 848, frame rate 30 fps, bitrate 930 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_9"] = 1048] = "VIDEO_PROFILE_PORTRAIT_480P_9";
        /** 1049: 480 * 640, frame rate 10 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_480P_10"] = 1049] = "VIDEO_PROFILE_PORTRAIT_480P_10";
        /** 1050: 720 * 1280, frame rate 15 fps, bitrate 1130 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P"] = 1050] = "VIDEO_PROFILE_PORTRAIT_720P";
        /** 1052: 720 * 1280, frame rate 30 fps, bitrate 1710 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_3"] = 1052] = "VIDEO_PROFILE_PORTRAIT_720P_3";
        /** 1054: 720 * 960, frame rate 15 fps, bitrate 910 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_5"] = 1054] = "VIDEO_PROFILE_PORTRAIT_720P_5";
        /** 1055: 720 * 960, frame rate 30 fps, bitrate 1380 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_720P_6"] = 1055] = "VIDEO_PROFILE_PORTRAIT_720P_6";
        /** 1060: 1080 * 1920, frame rate 15 fps, bitrate 2080 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P"] = 1060] = "VIDEO_PROFILE_PORTRAIT_1080P";
        /** 1062: 1080 * 1920, frame rate 30 fps, bitrate 3150 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P_3"] = 1062] = "VIDEO_PROFILE_PORTRAIT_1080P_3";
        /** 1064: 1080 * 1920, frame rate 60 fps, bitrate 4780 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1080P_5"] = 1064] = "VIDEO_PROFILE_PORTRAIT_1080P_5";
        /** 1066: 1440 * 2560, frame rate 30 fps, bitrate 4850 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1440P"] = 1066] = "VIDEO_PROFILE_PORTRAIT_1440P";
        /** 1067: 1440 * 2560, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_1440P_2"] = 1067] = "VIDEO_PROFILE_PORTRAIT_1440P_2";
        /** 1070: 2160 * 3840, frame rate 30 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_4K"] = 1070] = "VIDEO_PROFILE_PORTRAIT_4K";
        /** 1072: 2160 * 3840, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_PORTRAIT_4K_3"] = 1072] = "VIDEO_PROFILE_PORTRAIT_4K_3";
        /** Default 640 * 360, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_TYPE[VIDEO_PROFILE_TYPE["VIDEO_PROFILE_DEFAULT"] = 30] = "VIDEO_PROFILE_DEFAULT";
    })(VIDEO_PROFILE_TYPE = agora.VIDEO_PROFILE_TYPE || (agora.VIDEO_PROFILE_TYPE = {}));
    /** Audio profiles.

     Sets the sample rate, bitrate, encoding mode, and the number of channels:*/
    var AUDIO_PROFILE_TYPE;
    (function (AUDIO_PROFILE_TYPE) {
        /**
         0: Default audio profile:
         - For the interactive streaming profile: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
         - For the `COMMUNICATION` profile:
         - Windows: A sample rate of 16 KHz, music encoding, mono, and a bitrate of up to 16 Kbps.
         - Android/macOS/iOS: A sample rate of 32 KHz, music encoding, mono, and a bitrate of up to 18 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_DEFAULT"] = 0] = "AUDIO_PROFILE_DEFAULT";
        /**
         1: A sample rate of 32 KHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_SPEECH_STANDARD"] = 1] = "AUDIO_PROFILE_SPEECH_STANDARD";
        /**
         2: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_MUSIC_STANDARD"] = 2] = "AUDIO_PROFILE_MUSIC_STANDARD";
        /**
         3: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 80 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_MUSIC_STANDARD_STEREO"] = 3] = "AUDIO_PROFILE_MUSIC_STANDARD_STEREO";
        /**
         4: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 96 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_MUSIC_HIGH_QUALITY"] = 4] = "AUDIO_PROFILE_MUSIC_HIGH_QUALITY";
        /**
         5: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 128 Kbps.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO"] = 5] = "AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO";
        /**
         6: A sample rate of 16 KHz, audio encoding, mono, and Acoustic Echo Cancellation (AES) enabled.
         */
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_IOT"] = 6] = "AUDIO_PROFILE_IOT";
        AUDIO_PROFILE_TYPE[AUDIO_PROFILE_TYPE["AUDIO_PROFILE_NUM"] = 7] = "AUDIO_PROFILE_NUM";
    })(AUDIO_PROFILE_TYPE = agora.AUDIO_PROFILE_TYPE || (agora.AUDIO_PROFILE_TYPE = {}));
    /** Audio application scenarios.
     */
    var AUDIO_SCENARIO_TYPE;
    (function (AUDIO_SCENARIO_TYPE) {
        /** 0: Default. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_DEFAULT"] = 0] = "AUDIO_SCENARIO_DEFAULT";
        /** 1: Entertainment scenario, supporting voice during gameplay. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT"] = 1] = "AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT";
        /** 2: Education scenario, prioritizing smoothness and stability. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_EDUCATION"] = 2] = "AUDIO_SCENARIO_EDUCATION";
        /** 3: Live gaming scenario, enabling the gaming audio effects in the speaker mode in the interactive live streaming scenario. Choose this scenario for high-fidelity music playback. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_GAME_STREAMING"] = 3] = "AUDIO_SCENARIO_GAME_STREAMING";
        /** 4: Showroom scenario, optimizing the audio quality with external professional equipment. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_SHOWROOM"] = 4] = "AUDIO_SCENARIO_SHOWROOM";
        /** 5: Gaming scenario. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_CHATROOM_GAMING"] = 5] = "AUDIO_SCENARIO_CHATROOM_GAMING";
        /** 6: Applicable to the IoT scenario. */
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_IOT"] = 6] = "AUDIO_SCENARIO_IOT";
        AUDIO_SCENARIO_TYPE[AUDIO_SCENARIO_TYPE["AUDIO_SCENARIO_NUM"] = 7] = "AUDIO_SCENARIO_NUM";
    })(AUDIO_SCENARIO_TYPE = agora.AUDIO_SCENARIO_TYPE || (agora.AUDIO_SCENARIO_TYPE = {}));
    /** The channel profile.
     */
    var CHANNEL_PROFILE_TYPE;
    (function (CHANNEL_PROFILE_TYPE) {
        /** (Default) Communication. This profile applies to scenarios such as an audio call or video call,
         * where all users can publish and subscribe to streams.
         */
        CHANNEL_PROFILE_TYPE[CHANNEL_PROFILE_TYPE["CHANNEL_PROFILE_COMMUNICATION"] = 0] = "CHANNEL_PROFILE_COMMUNICATION";
        /** Live streaming. In this profile, uses have roles, namely, host and audience (default).
         * A host both publishes and subscribes to streams, while an audience subscribes to streams only.
         * This profile applies to scenarios such as a chat room or interactive video streaming.
         */
        CHANNEL_PROFILE_TYPE[CHANNEL_PROFILE_TYPE["CHANNEL_PROFILE_LIVE_BROADCASTING"] = 1] = "CHANNEL_PROFILE_LIVE_BROADCASTING";
        /** 2: Gaming. This profile uses a codec with a lower bitrate and consumes less power. Applies to the gaming scenario, where all game players can talk freely.
         */
        CHANNEL_PROFILE_TYPE[CHANNEL_PROFILE_TYPE["CHANNEL_PROFILE_GAME"] = 2] = "CHANNEL_PROFILE_GAME";
    })(CHANNEL_PROFILE_TYPE = agora.CHANNEL_PROFILE_TYPE || (agora.CHANNEL_PROFILE_TYPE = {}));
    /** Client roles in the live interactive streaming. */
    var CLIENT_ROLE_TYPE;
    (function (CLIENT_ROLE_TYPE) {
        /** 1: Host. A host can both send and receive streams. */
        CLIENT_ROLE_TYPE[CLIENT_ROLE_TYPE["CLIENT_ROLE_BROADCASTER"] = 1] = "CLIENT_ROLE_BROADCASTER";
        /** 2: Audience, the default role. An audience can only receive streams. */
        CLIENT_ROLE_TYPE[CLIENT_ROLE_TYPE["CLIENT_ROLE_AUDIENCE"] = 2] = "CLIENT_ROLE_AUDIENCE";
    })(CLIENT_ROLE_TYPE = agora.CLIENT_ROLE_TYPE || (agora.CLIENT_ROLE_TYPE = {}));
    /** Reasons for a user being offline. */
    var USER_OFFLINE_REASON_TYPE;
    (function (USER_OFFLINE_REASON_TYPE) {
        /** 0: The user quits the call. */
        USER_OFFLINE_REASON_TYPE[USER_OFFLINE_REASON_TYPE["USER_OFFLINE_QUIT"] = 0] = "USER_OFFLINE_QUIT";
        /** 1: The SDK times out and the user drops offline because no data packet is received within a certain period of time. If the user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline. */
        USER_OFFLINE_REASON_TYPE[USER_OFFLINE_REASON_TYPE["USER_OFFLINE_DROPPED"] = 1] = "USER_OFFLINE_DROPPED";
        /** 2: (`LIVE_BROADCASTING` only.) The client role switched from the host to the audience. */
        USER_OFFLINE_REASON_TYPE[USER_OFFLINE_REASON_TYPE["USER_OFFLINE_BECOME_AUDIENCE"] = 2] = "USER_OFFLINE_BECOME_AUDIENCE";
    })(USER_OFFLINE_REASON_TYPE = agora.USER_OFFLINE_REASON_TYPE || (agora.USER_OFFLINE_REASON_TYPE = {}));
    /**
     States of the RTMP streaming.
     */
    var RTMP_STREAM_PUBLISH_STATE;
    (function (RTMP_STREAM_PUBLISH_STATE) {
        /** The RTMP streaming has not started or has ended. This state is also triggered after you remove an RTMP address from the CDN by calling removePublishStreamUrl.
         */
        RTMP_STREAM_PUBLISH_STATE[RTMP_STREAM_PUBLISH_STATE["RTMP_STREAM_PUBLISH_STATE_IDLE"] = 0] = "RTMP_STREAM_PUBLISH_STATE_IDLE";
        /** The SDK is connecting to Agora's streaming server and the RTMP server. This state is triggered after you call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method.
         */
        RTMP_STREAM_PUBLISH_STATE[RTMP_STREAM_PUBLISH_STATE["RTMP_STREAM_PUBLISH_STATE_CONNECTING"] = 1] = "RTMP_STREAM_PUBLISH_STATE_CONNECTING";
        /** The RTMP streaming publishes. The SDK successfully publishes the RTMP streaming and returns this state.
         */
        RTMP_STREAM_PUBLISH_STATE[RTMP_STREAM_PUBLISH_STATE["RTMP_STREAM_PUBLISH_STATE_RUNNING"] = 2] = "RTMP_STREAM_PUBLISH_STATE_RUNNING";
        /** The RTMP streaming is recovering. When exceptions occur to the CDN, or the streaming is interrupted, the SDK tries to resume RTMP streaming and returns this state.

         - If the SDK successfully resumes the streaming, #RTMP_STREAM_PUBLISH_STATE_RUNNING (2) returns.
         - If the streaming does not resume within 60 seconds or server errors occur, #RTMP_STREAM_PUBLISH_STATE_FAILURE (4) returns. You can also reconnect to the server by calling the \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" and \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" methods.
         */
        RTMP_STREAM_PUBLISH_STATE[RTMP_STREAM_PUBLISH_STATE["RTMP_STREAM_PUBLISH_STATE_RECOVERING"] = 3] = "RTMP_STREAM_PUBLISH_STATE_RECOVERING";
        /** The RTMP streaming fails. See the errCode parameter for the detailed error information. You can also call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the RTMP streaming again.
         */
        RTMP_STREAM_PUBLISH_STATE[RTMP_STREAM_PUBLISH_STATE["RTMP_STREAM_PUBLISH_STATE_FAILURE"] = 4] = "RTMP_STREAM_PUBLISH_STATE_FAILURE";
    })(RTMP_STREAM_PUBLISH_STATE = agora.RTMP_STREAM_PUBLISH_STATE || (agora.RTMP_STREAM_PUBLISH_STATE = {}));
    /**
     Error codes of the RTMP streaming.
     */
    var RTMP_STREAM_PUBLISH_ERROR;
    (function (RTMP_STREAM_PUBLISH_ERROR) {
        /** The RTMP streaming publishes successfully. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_OK"] = 0] = "RTMP_STREAM_PUBLISH_ERROR_OK";
        /** Invalid argument used. If, for example, you do not call the \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" method to configure the LiveTranscoding parameters before calling the addPublishStreamUrl method, the SDK returns this error. Check whether you set the parameters in the *setLiveTranscoding* method properly. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT"] = 1] = "RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT";
        /** The RTMP streaming is encrypted and cannot be published. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_ENCRYPTED_STREAM_NOT_ALLOWED"] = 2] = "RTMP_STREAM_PUBLISH_ERROR_ENCRYPTED_STREAM_NOT_ALLOWED";
        /** Timeout for the RTMP streaming. Call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the streaming again. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT"] = 3] = "RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT";
        /** An error occurs in Agora's streaming server. Call the addPublishStreamUrl method to publish the streaming again. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR"] = 4] = "RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR";
        /** An error occurs in the RTMP server. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR"] = 5] = "RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR";
        /** The RTMP streaming publishes too frequently. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN"] = 6] = "RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN";
        /** The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT"] = 7] = "RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT";
        /** The host manipulates other hosts' URLs. Check your app logic. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED"] = 8] = "RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED";
        /** Agora's server fails to find the RTMP streaming. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_STREAM_NOT_FOUND"] = 9] = "RTMP_STREAM_PUBLISH_ERROR_STREAM_NOT_FOUND";
        /** The format of the RTMP streaming URL is not supported. Check whether the URL format is correct. */
        RTMP_STREAM_PUBLISH_ERROR[RTMP_STREAM_PUBLISH_ERROR["RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED"] = 10] = "RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED";
    })(RTMP_STREAM_PUBLISH_ERROR = agora.RTMP_STREAM_PUBLISH_ERROR || (agora.RTMP_STREAM_PUBLISH_ERROR = {}));
    /** Events during the RTMP streaming. */
    var RTMP_STREAMING_EVENT;
    (function (RTMP_STREAMING_EVENT) {
        /** An error occurs when you add a background image or a watermark image to the RTMP stream.
         */
        RTMP_STREAMING_EVENT[RTMP_STREAMING_EVENT["RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE"] = 1] = "RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE";
    })(RTMP_STREAMING_EVENT = agora.RTMP_STREAMING_EVENT || (agora.RTMP_STREAMING_EVENT = {}));
    /** States of importing an external video stream in the live interactive streaming. */
    var INJECT_STREAM_STATUS;
    (function (INJECT_STREAM_STATUS) {
        /** 0: The external video stream imported successfully. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_START_SUCCESS"] = 0] = "INJECT_STREAM_STATUS_START_SUCCESS";
        /** 1: The external video stream already exists. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_START_ALREADY_EXISTS"] = 1] = "INJECT_STREAM_STATUS_START_ALREADY_EXISTS";
        /** 2: The external video stream to be imported is unauthorized. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_START_UNAUTHORIZED"] = 2] = "INJECT_STREAM_STATUS_START_UNAUTHORIZED";
        /** 3: Import external video stream timeout. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_START_TIMEDOUT"] = 3] = "INJECT_STREAM_STATUS_START_TIMEDOUT";
        /** 4: Import external video stream failed. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_START_FAILED"] = 4] = "INJECT_STREAM_STATUS_START_FAILED";
        /** 5: The external video stream stopped importing successfully. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_STOP_SUCCESS"] = 5] = "INJECT_STREAM_STATUS_STOP_SUCCESS";
        /** 6: No external video stream is found. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_STOP_NOT_FOUND"] = 6] = "INJECT_STREAM_STATUS_STOP_NOT_FOUND";
        /** 7: The external video stream to be stopped importing is unauthorized. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_STOP_UNAUTHORIZED"] = 7] = "INJECT_STREAM_STATUS_STOP_UNAUTHORIZED";
        /** 8: Stop importing external video stream timeout. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_STOP_TIMEDOUT"] = 8] = "INJECT_STREAM_STATUS_STOP_TIMEDOUT";
        /** 9: Stop importing external video stream failed. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_STOP_FAILED"] = 9] = "INJECT_STREAM_STATUS_STOP_FAILED";
        /** 10: The external video stream is corrupted. */
        INJECT_STREAM_STATUS[INJECT_STREAM_STATUS["INJECT_STREAM_STATUS_BROKEN"] = 10] = "INJECT_STREAM_STATUS_BROKEN";
    })(INJECT_STREAM_STATUS = agora.INJECT_STREAM_STATUS || (agora.INJECT_STREAM_STATUS = {}));
    /** Remote video stream types. */
    var REMOTE_VIDEO_STREAM_TYPE;
    (function (REMOTE_VIDEO_STREAM_TYPE) {
        /** 0: High-stream video. */
        REMOTE_VIDEO_STREAM_TYPE[REMOTE_VIDEO_STREAM_TYPE["REMOTE_VIDEO_STREAM_HIGH"] = 0] = "REMOTE_VIDEO_STREAM_HIGH";
        /** 1: Low-stream video. */
        REMOTE_VIDEO_STREAM_TYPE[REMOTE_VIDEO_STREAM_TYPE["REMOTE_VIDEO_STREAM_LOW"] = 1] = "REMOTE_VIDEO_STREAM_LOW";
    })(REMOTE_VIDEO_STREAM_TYPE = agora.REMOTE_VIDEO_STREAM_TYPE || (agora.REMOTE_VIDEO_STREAM_TYPE = {}));
    /** The use mode of the audio data in the \ref media::IAudioFrameObserver::onRecordAudioFrame "onRecordAudioFrame" or \ref media::IAudioFrameObserver::onPlaybackAudioFrame "onPlaybackAudioFrame" callback.
     */
    var RAW_AUDIO_FRAME_OP_MODE_TYPE;
    (function (RAW_AUDIO_FRAME_OP_MODE_TYPE) {
        /** 0: Read-only mode: Users only read the \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame" data without modifying anything. For example, when users acquire the data with the Agora SDK, then push the RTMP streams. */
        RAW_AUDIO_FRAME_OP_MODE_TYPE[RAW_AUDIO_FRAME_OP_MODE_TYPE["RAW_AUDIO_FRAME_OP_MODE_READ_ONLY"] = 0] = "RAW_AUDIO_FRAME_OP_MODE_READ_ONLY";
        /** 1: Write-only mode: Users replace the \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame" data with their own data and pass the data to the SDK for encoding. For example, when users acquire the data. */
        RAW_AUDIO_FRAME_OP_MODE_TYPE[RAW_AUDIO_FRAME_OP_MODE_TYPE["RAW_AUDIO_FRAME_OP_MODE_WRITE_ONLY"] = 1] = "RAW_AUDIO_FRAME_OP_MODE_WRITE_ONLY";
        /** 2: Read and write mode: Users read the data from \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame", modify it, and then play it. For example, when users have their own sound-effect processing module and perform some voice pre-processing, such as a voice change. */
        RAW_AUDIO_FRAME_OP_MODE_TYPE[RAW_AUDIO_FRAME_OP_MODE_TYPE["RAW_AUDIO_FRAME_OP_MODE_READ_WRITE"] = 2] = "RAW_AUDIO_FRAME_OP_MODE_READ_WRITE";
    })(RAW_AUDIO_FRAME_OP_MODE_TYPE = agora.RAW_AUDIO_FRAME_OP_MODE_TYPE || (agora.RAW_AUDIO_FRAME_OP_MODE_TYPE = {}));
    /** Audio-sample rates. */
    var AUDIO_SAMPLE_RATE_TYPE;
    (function (AUDIO_SAMPLE_RATE_TYPE) {
        /** 32000: 32 kHz */
        AUDIO_SAMPLE_RATE_TYPE[AUDIO_SAMPLE_RATE_TYPE["AUDIO_SAMPLE_RATE_32000"] = 32000] = "AUDIO_SAMPLE_RATE_32000";
        /** 44100: 44.1 kHz */
        AUDIO_SAMPLE_RATE_TYPE[AUDIO_SAMPLE_RATE_TYPE["AUDIO_SAMPLE_RATE_44100"] = 44100] = "AUDIO_SAMPLE_RATE_44100";
        /** 48000: 48 kHz */
        AUDIO_SAMPLE_RATE_TYPE[AUDIO_SAMPLE_RATE_TYPE["AUDIO_SAMPLE_RATE_48000"] = 48000] = "AUDIO_SAMPLE_RATE_48000";
    })(AUDIO_SAMPLE_RATE_TYPE = agora.AUDIO_SAMPLE_RATE_TYPE || (agora.AUDIO_SAMPLE_RATE_TYPE = {}));
    /** Video codec profile types. */
    var VIDEO_CODEC_PROFILE_TYPE;
    (function (VIDEO_CODEC_PROFILE_TYPE) {
        /** 66: Baseline video codec profile. Generally used in video calls on mobile phones. */
        VIDEO_CODEC_PROFILE_TYPE[VIDEO_CODEC_PROFILE_TYPE["VIDEO_CODEC_PROFILE_BASELINE"] = 66] = "VIDEO_CODEC_PROFILE_BASELINE";
        /** 77: Main video codec profile. Generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads. */
        VIDEO_CODEC_PROFILE_TYPE[VIDEO_CODEC_PROFILE_TYPE["VIDEO_CODEC_PROFILE_MAIN"] = 77] = "VIDEO_CODEC_PROFILE_MAIN";
        /** 100: (Default) High video codec profile. Generally used in high-resolution live streaming or television. */
        VIDEO_CODEC_PROFILE_TYPE[VIDEO_CODEC_PROFILE_TYPE["VIDEO_CODEC_PROFILE_HIGH"] = 100] = "VIDEO_CODEC_PROFILE_HIGH";
    })(VIDEO_CODEC_PROFILE_TYPE = agora.VIDEO_CODEC_PROFILE_TYPE || (agora.VIDEO_CODEC_PROFILE_TYPE = {}));
    /** Video codec types */
    var VIDEO_CODEC_TYPE;
    (function (VIDEO_CODEC_TYPE) {
        /** Standard VP8 */
        VIDEO_CODEC_TYPE[VIDEO_CODEC_TYPE["VIDEO_CODEC_VP8"] = 1] = "VIDEO_CODEC_VP8";
        /** Standard H264 */
        VIDEO_CODEC_TYPE[VIDEO_CODEC_TYPE["VIDEO_CODEC_H264"] = 2] = "VIDEO_CODEC_H264";
        /** Enhanced VP8 */
        VIDEO_CODEC_TYPE[VIDEO_CODEC_TYPE["VIDEO_CODEC_EVP"] = 3] = "VIDEO_CODEC_EVP";
        /** Enhanced H264 */
        VIDEO_CODEC_TYPE[VIDEO_CODEC_TYPE["VIDEO_CODEC_E264"] = 4] = "VIDEO_CODEC_E264";
    })(VIDEO_CODEC_TYPE = agora.VIDEO_CODEC_TYPE || (agora.VIDEO_CODEC_TYPE = {}));
    /** Audio equalization band frequencies. */
    var AUDIO_EQUALIZATION_BAND_FREQUENCY;
    (function (AUDIO_EQUALIZATION_BAND_FREQUENCY) {
        /** 0: 31 Hz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_31"] = 0] = "AUDIO_EQUALIZATION_BAND_31";
        /** 1: 62 Hz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_62"] = 1] = "AUDIO_EQUALIZATION_BAND_62";
        /** 2: 125 Hz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_125"] = 2] = "AUDIO_EQUALIZATION_BAND_125";
        /** 3: 250 Hz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_250"] = 3] = "AUDIO_EQUALIZATION_BAND_250";
        /** 4: 500 Hz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_500"] = 4] = "AUDIO_EQUALIZATION_BAND_500";
        /** 5: 1 kHz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_1K"] = 5] = "AUDIO_EQUALIZATION_BAND_1K";
        /** 6: 2 kHz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_2K"] = 6] = "AUDIO_EQUALIZATION_BAND_2K";
        /** 7: 4 kHz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_4K"] = 7] = "AUDIO_EQUALIZATION_BAND_4K";
        /** 8: 8 kHz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_8K"] = 8] = "AUDIO_EQUALIZATION_BAND_8K";
        /** 9: 16 kHz */
        AUDIO_EQUALIZATION_BAND_FREQUENCY[AUDIO_EQUALIZATION_BAND_FREQUENCY["AUDIO_EQUALIZATION_BAND_16K"] = 9] = "AUDIO_EQUALIZATION_BAND_16K";
    })(AUDIO_EQUALIZATION_BAND_FREQUENCY = agora.AUDIO_EQUALIZATION_BAND_FREQUENCY || (agora.AUDIO_EQUALIZATION_BAND_FREQUENCY = {}));
    /** Audio reverberation types. */
    var AUDIO_REVERB_TYPE;
    (function (AUDIO_REVERB_TYPE) {
        /** 0: The level of the dry signal (db). The value is between -20 and 10. */
        AUDIO_REVERB_TYPE[AUDIO_REVERB_TYPE["AUDIO_REVERB_DRY_LEVEL"] = 0] = "AUDIO_REVERB_DRY_LEVEL";
        /** 1: The level of the early reflection signal (wet signal) (dB). The value is between -20 and 10. */
        AUDIO_REVERB_TYPE[AUDIO_REVERB_TYPE["AUDIO_REVERB_WET_LEVEL"] = 1] = "AUDIO_REVERB_WET_LEVEL";
        /** 2: The room size of the reflection. The value is between 0 and 100. */
        AUDIO_REVERB_TYPE[AUDIO_REVERB_TYPE["AUDIO_REVERB_ROOM_SIZE"] = 2] = "AUDIO_REVERB_ROOM_SIZE";
        /** 3: The length of the initial delay of the wet signal (ms). The value is between 0 and 200. */
        AUDIO_REVERB_TYPE[AUDIO_REVERB_TYPE["AUDIO_REVERB_WET_DELAY"] = 3] = "AUDIO_REVERB_WET_DELAY";
        /** 4: The reverberation strength. The value is between 0 and 100. */
        AUDIO_REVERB_TYPE[AUDIO_REVERB_TYPE["AUDIO_REVERB_STRENGTH"] = 4] = "AUDIO_REVERB_STRENGTH";
    })(AUDIO_REVERB_TYPE = agora.AUDIO_REVERB_TYPE || (agora.AUDIO_REVERB_TYPE = {}));
    /**
     * Local voice changer options.
     */
    var VOICE_CHANGER_PRESET;
    (function (VOICE_CHANGER_PRESET) {
        /**
         * The original voice (no local voice change).
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_OFF"] = 0] = "VOICE_CHANGER_OFF";
        /**
         * The voice of an old man.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_OLDMAN"] = 1] = "VOICE_CHANGER_OLDMAN";
        /**
         * The voice of a little boy.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_BABYBOY"] = 2] = "VOICE_CHANGER_BABYBOY";
        /**
         * The voice of a little girl.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_BABYGIRL"] = 3] = "VOICE_CHANGER_BABYGIRL";
        /**
         * The voice of Zhu Bajie, a character in Journey to the West who has a voice like that of a growling bear.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_ZHUBAJIE"] = 4] = "VOICE_CHANGER_ZHUBAJIE";
        /**
         * The ethereal voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_ETHEREAL"] = 5] = "VOICE_CHANGER_ETHEREAL";
        /**
         * The voice of Hulk.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_CHANGER_HULK"] = 6] = "VOICE_CHANGER_HULK";
        /**
         * A more vigorous voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_VIGOROUS"] = 1048577] = "VOICE_BEAUTY_VIGOROUS";
        /**
         * A deeper voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_DEEP"] = 1048578] = "VOICE_BEAUTY_DEEP";
        /**
         * A mellower voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_MELLOW"] = 1048579] = "VOICE_BEAUTY_MELLOW";
        /**
         * Falsetto.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_FALSETTO"] = 1048580] = "VOICE_BEAUTY_FALSETTO";
        /**
         * A fuller voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_FULL"] = 1048581] = "VOICE_BEAUTY_FULL";
        /**
         * A clearer voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_CLEAR"] = 1048582] = "VOICE_BEAUTY_CLEAR";
        /**
         * A more resounding voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_RESOUNDING"] = 1048583] = "VOICE_BEAUTY_RESOUNDING";
        /**
         * A more ringing voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_RINGING"] = 1048584] = "VOICE_BEAUTY_RINGING";
        /**
         * A more spatially resonant voice.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["VOICE_BEAUTY_SPACIAL"] = 1048585] = "VOICE_BEAUTY_SPACIAL";
        /**
         * (For male only) A more magnetic voice. Do not use it when the speaker is a female; otherwise, voice distortion occurs.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["GENERAL_BEAUTY_VOICE_MALE_MAGNETIC"] = 2097153] = "GENERAL_BEAUTY_VOICE_MALE_MAGNETIC";
        /**
         * (For female only) A fresher voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["GENERAL_BEAUTY_VOICE_FEMALE_FRESH"] = 2097154] = "GENERAL_BEAUTY_VOICE_FEMALE_FRESH";
        /**
         *    (For female only) A more vital voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
         */
        VOICE_CHANGER_PRESET[VOICE_CHANGER_PRESET["GENERAL_BEAUTY_VOICE_FEMALE_VITALITY"] = 2097155] = "GENERAL_BEAUTY_VOICE_FEMALE_VITALITY";
    })(VOICE_CHANGER_PRESET = agora.VOICE_CHANGER_PRESET || (agora.VOICE_CHANGER_PRESET = {}));
    /** Local voice reverberation presets. */
    var AUDIO_REVERB_PRESET;
    (function (AUDIO_REVERB_PRESET) {
        /**
         * Turn off local voice reverberation, that is, to use the original voice.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_OFF"] = 0] = "AUDIO_REVERB_OFF";
        /**
         * The reverberation style typical of a KTV venue (enhanced).
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_KTV"] = 1048577] = "AUDIO_REVERB_FX_KTV";
        /**
         * The reverberation style typical of a concert hall (enhanced).
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_VOCAL_CONCERT"] = 1048578] = "AUDIO_REVERB_FX_VOCAL_CONCERT";
        /**
         * The reverberation style typical of an uncle's voice.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_UNCLE"] = 1048579] = "AUDIO_REVERB_FX_UNCLE";
        /**
         * The reverberation style typical of a little sister's voice.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_SISTER"] = 1048580] = "AUDIO_REVERB_FX_SISTER";
        /**
         * The reverberation style typical of a recording studio (enhanced).
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_STUDIO"] = 1048581] = "AUDIO_REVERB_FX_STUDIO";
        /**
         * The reverberation style typical of popular music (enhanced).
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_POPULAR"] = 1048582] = "AUDIO_REVERB_FX_POPULAR";
        /**
         * The reverberation style typical of R&B music (enhanced).
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_RNB"] = 1048583] = "AUDIO_REVERB_FX_RNB";
        /**
         * The reverberation style typical of the vintage phonograph.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_FX_PHONOGRAPH"] = 1048584] = "AUDIO_REVERB_FX_PHONOGRAPH";
        /**
         * The reverberation style typical of popular music.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_POPULAR"] = 1] = "AUDIO_REVERB_POPULAR";
        /**
         * The reverberation style typical of R&B music.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_RNB"] = 2] = "AUDIO_REVERB_RNB";
        /**
         * The reverberation style typical of rock music.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_ROCK"] = 3] = "AUDIO_REVERB_ROCK";
        /**
         * The reverberation style typical of hip-hop music.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_HIPHOP"] = 4] = "AUDIO_REVERB_HIPHOP";
        /**
         * The reverberation style typical of a concert hall.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_VOCAL_CONCERT"] = 5] = "AUDIO_REVERB_VOCAL_CONCERT";
        /**
         * The reverberation style typical of a KTV venue.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_KTV"] = 6] = "AUDIO_REVERB_KTV";
        /**
         * The reverberation style typical of a recording studio.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_REVERB_STUDIO"] = 7] = "AUDIO_REVERB_STUDIO";
        /**
         * The reverberation of the virtual stereo. The virtual stereo is an effect that renders the monophonic
         * audio as the stereo audio, so that all users in the channel can hear the stereo voice effect.
         * To achieve better virtual stereo reverberation, Agora recommends setting `profile` in `setAudioProfile`
         * as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
         */
        AUDIO_REVERB_PRESET[AUDIO_REVERB_PRESET["AUDIO_VIRTUAL_STEREO"] = 2097153] = "AUDIO_VIRTUAL_STEREO";
    })(AUDIO_REVERB_PRESET = agora.AUDIO_REVERB_PRESET || (agora.AUDIO_REVERB_PRESET = {}));
    /** Audio codec profile types. The default value is LC_ACC. */
    var AUDIO_CODEC_PROFILE_TYPE;
    (function (AUDIO_CODEC_PROFILE_TYPE) {
        /** 0: LC-AAC, which is the low-complexity audio codec type. */
        AUDIO_CODEC_PROFILE_TYPE[AUDIO_CODEC_PROFILE_TYPE["AUDIO_CODEC_PROFILE_LC_AAC"] = 0] = "AUDIO_CODEC_PROFILE_LC_AAC";
        /** 1: HE-AAC, which is the high-efficiency audio codec type. */
        AUDIO_CODEC_PROFILE_TYPE[AUDIO_CODEC_PROFILE_TYPE["AUDIO_CODEC_PROFILE_HE_AAC"] = 1] = "AUDIO_CODEC_PROFILE_HE_AAC";
    })(AUDIO_CODEC_PROFILE_TYPE = agora.AUDIO_CODEC_PROFILE_TYPE || (agora.AUDIO_CODEC_PROFILE_TYPE = {}));
    /** Remote audio states.
     */
    var REMOTE_AUDIO_STATE;
    (function (REMOTE_AUDIO_STATE) {
        /** 0: The remote audio is in the default state, probably due to
         * #REMOTE_AUDIO_REASON_LOCAL_MUTED (3),
         * #REMOTE_AUDIO_REASON_REMOTE_MUTED (5), or
         * #REMOTE_AUDIO_REASON_REMOTE_OFFLINE (7).
         */
        REMOTE_AUDIO_STATE[REMOTE_AUDIO_STATE["REMOTE_AUDIO_STATE_STOPPED"] = 0] = "REMOTE_AUDIO_STATE_STOPPED";
        /** 1: The first remote audio packet is received.
         */
        REMOTE_AUDIO_STATE[REMOTE_AUDIO_STATE["REMOTE_AUDIO_STATE_STARTING"] = 1] = "REMOTE_AUDIO_STATE_STARTING";
        /** 2: The remote audio stream is decoded and plays normally, probably
         * due to #REMOTE_AUDIO_REASON_NETWORK_RECOVERY (2),
         * #REMOTE_AUDIO_REASON_LOCAL_UNMUTED (4), or
         * #REMOTE_AUDIO_REASON_REMOTE_UNMUTED (6).
         */
        REMOTE_AUDIO_STATE[REMOTE_AUDIO_STATE["REMOTE_AUDIO_STATE_DECODING"] = 2] = "REMOTE_AUDIO_STATE_DECODING";
        /** 3: The remote audio is frozen, probably due to
         * #REMOTE_AUDIO_REASON_NETWORK_CONGESTION (1).
         */
        REMOTE_AUDIO_STATE[REMOTE_AUDIO_STATE["REMOTE_AUDIO_STATE_FROZEN"] = 3] = "REMOTE_AUDIO_STATE_FROZEN";
        /** 4: The remote audio fails to start, probably due to
         * #REMOTE_AUDIO_REASON_INTERNAL (0).
         */
        REMOTE_AUDIO_STATE[REMOTE_AUDIO_STATE["REMOTE_AUDIO_STATE_FAILED"] = 4] = "REMOTE_AUDIO_STATE_FAILED";
    })(REMOTE_AUDIO_STATE = agora.REMOTE_AUDIO_STATE || (agora.REMOTE_AUDIO_STATE = {}));
    /** Remote audio state reasons.
     */
    var REMOTE_AUDIO_STATE_REASON;
    (function (REMOTE_AUDIO_STATE_REASON) {
        /** 0: Internal reasons.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_INTERNAL"] = 0] = "REMOTE_AUDIO_REASON_INTERNAL";
        /** 1: Network congestion.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_NETWORK_CONGESTION"] = 1] = "REMOTE_AUDIO_REASON_NETWORK_CONGESTION";
        /** 2: Network recovery.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_NETWORK_RECOVERY"] = 2] = "REMOTE_AUDIO_REASON_NETWORK_RECOVERY";
        /** 3: The local user stops receiving the remote audio stream or
         * disables the audio module.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_LOCAL_MUTED"] = 3] = "REMOTE_AUDIO_REASON_LOCAL_MUTED";
        /** 4: The local user resumes receiving the remote audio stream or
         * enables the audio module.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_LOCAL_UNMUTED"] = 4] = "REMOTE_AUDIO_REASON_LOCAL_UNMUTED";
        /** 5: The remote user stops sending the audio stream or disables the
         * audio module.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_REMOTE_MUTED"] = 5] = "REMOTE_AUDIO_REASON_REMOTE_MUTED";
        /** 6: The remote user resumes sending the audio stream or enables the
         * audio module.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_REMOTE_UNMUTED"] = 6] = "REMOTE_AUDIO_REASON_REMOTE_UNMUTED";
        /** 7: The remote user leaves the channel.
         */
        REMOTE_AUDIO_STATE_REASON[REMOTE_AUDIO_STATE_REASON["REMOTE_AUDIO_REASON_REMOTE_OFFLINE"] = 7] = "REMOTE_AUDIO_REASON_REMOTE_OFFLINE";
    })(REMOTE_AUDIO_STATE_REASON = agora.REMOTE_AUDIO_STATE_REASON || (agora.REMOTE_AUDIO_STATE_REASON = {}));
    /** The state of the remote video. */
    var REMOTE_VIDEO_STATE;
    (function (REMOTE_VIDEO_STATE) {
        /** 0: The remote video is in the default state, probably due to #REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED (3), #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5), or #REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE (7).
         */
        REMOTE_VIDEO_STATE[REMOTE_VIDEO_STATE["REMOTE_VIDEO_STATE_STOPPED"] = 0] = "REMOTE_VIDEO_STATE_STOPPED";
        /** 1: The first remote video packet is received.
         */
        REMOTE_VIDEO_STATE[REMOTE_VIDEO_STATE["REMOTE_VIDEO_STATE_STARTING"] = 1] = "REMOTE_VIDEO_STATE_STARTING";
        /** 2: The remote video stream is decoded and plays normally, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY (2), #REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED (4), #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6), or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY (9).
         */
        REMOTE_VIDEO_STATE[REMOTE_VIDEO_STATE["REMOTE_VIDEO_STATE_DECODING"] = 2] = "REMOTE_VIDEO_STATE_DECODING";
        /** 3: The remote video is frozen, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION (1) or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK (8).
         */
        REMOTE_VIDEO_STATE[REMOTE_VIDEO_STATE["REMOTE_VIDEO_STATE_FROZEN"] = 3] = "REMOTE_VIDEO_STATE_FROZEN";
        /** 4: The remote video fails to start, probably due to #REMOTE_VIDEO_STATE_REASON_INTERNAL (0).
         */
        REMOTE_VIDEO_STATE[REMOTE_VIDEO_STATE["REMOTE_VIDEO_STATE_FAILED"] = 4] = "REMOTE_VIDEO_STATE_FAILED";
    })(REMOTE_VIDEO_STATE = agora.REMOTE_VIDEO_STATE || (agora.REMOTE_VIDEO_STATE = {}));
    /** The publishing state.
     */
    var STREAM_PUBLISH_STATE;
    (function (STREAM_PUBLISH_STATE) {
        /** 0: The initial publishing state after joining the channel.
         */
        STREAM_PUBLISH_STATE[STREAM_PUBLISH_STATE["PUB_STATE_IDLE"] = 0] = "PUB_STATE_IDLE";
        /** 1: Fails to publish the local stream. Possible reasons:
         * - The local user calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" or \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" to stop sending local streams.
         * - The local user calls \ref IRtcEngine::disableAudio "disableAudio" or \ref IRtcEngine::disableVideo "disableVideo" to disable the entire audio or video module.
         * - The local user calls \ref IRtcEngine::enableLocalAudio "enableLocalAudio(false)" or \ref IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local audio sampling or video capturing.
         * - The role of the local user is `AUDIENCE`.
         */
        STREAM_PUBLISH_STATE[STREAM_PUBLISH_STATE["PUB_STATE_NO_PUBLISHED"] = 1] = "PUB_STATE_NO_PUBLISHED";
        /** 2: Publishing.
         */
        STREAM_PUBLISH_STATE[STREAM_PUBLISH_STATE["PUB_STATE_PUBLISHING"] = 2] = "PUB_STATE_PUBLISHING";
        /** 3: Publishes successfully.
         */
        STREAM_PUBLISH_STATE[STREAM_PUBLISH_STATE["PUB_STATE_PUBLISHED"] = 3] = "PUB_STATE_PUBLISHED";
    })(STREAM_PUBLISH_STATE = agora.STREAM_PUBLISH_STATE || (agora.STREAM_PUBLISH_STATE = {}));
    /** The subscribing state.
     */
    var STREAM_SUBSCRIBE_STATE;
    (function (STREAM_SUBSCRIBE_STATE) {
        /** 0: The initial subscribing state after joining the channel.
         */
        STREAM_SUBSCRIBE_STATE[STREAM_SUBSCRIBE_STATE["SUB_STATE_IDLE"] = 0] = "SUB_STATE_IDLE";
        /** 1: Fails to subscribe to the remote stream. Possible reasons:
         * - The remote user:
         *  - Calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" or \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" to stop sending local streams.
         *  - Calls \ref IRtcEngine::disableAudio "disableAudio" or \ref IRtcEngine::disableVideo "disableVideo" to disable the entire audio or video modules.
         *  - Calls \ref IRtcEngine::enableLocalAudio "enableLocalAudio(false)" or \ref IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local audio sampling or video capturing.
         *  - The role of the remote user is `AUDIENCE`.
         * - The local user calls the following methods to stop receiving remote streams:
         *  - Calls \ref IRtcEngine::muteRemoteAudioStream "muteRemoteAudioStream(true)", \ref IRtcEngine::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams(true)", or \ref IRtcEngine::setDefaultMuteAllRemoteAudioStreams "setDefaultMuteAllRemoteAudioStreams(true)" to stop receiving remote audio streams.
         *  - Calls \ref IRtcEngine::muteRemoteVideoStream "muteRemoteVideoStream(true)", \ref IRtcEngine::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams(true)", or \ref IRtcEngine::setDefaultMuteAllRemoteVideoStreams "setDefaultMuteAllRemoteVideoStreams(true)" to stop receiving remote video streams.
         */
        STREAM_SUBSCRIBE_STATE[STREAM_SUBSCRIBE_STATE["SUB_STATE_NO_SUBSCRIBED"] = 1] = "SUB_STATE_NO_SUBSCRIBED";
        /** 2: Subscribing.
         */
        STREAM_SUBSCRIBE_STATE[STREAM_SUBSCRIBE_STATE["SUB_STATE_SUBSCRIBING"] = 2] = "SUB_STATE_SUBSCRIBING";
        /** 3: Subscribes to and receives the remote stream successfully.
         */
        STREAM_SUBSCRIBE_STATE[STREAM_SUBSCRIBE_STATE["SUB_STATE_SUBSCRIBED"] = 3] = "SUB_STATE_SUBSCRIBED";
    })(STREAM_SUBSCRIBE_STATE = agora.STREAM_SUBSCRIBE_STATE || (agora.STREAM_SUBSCRIBE_STATE = {}));
    /** The reason for the remote video state change. */
    var REMOTE_VIDEO_STATE_REASON;
    (function (REMOTE_VIDEO_STATE_REASON) {
        /** 0: Internal reasons.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_INTERNAL"] = 0] = "REMOTE_VIDEO_STATE_REASON_INTERNAL";
        /** 1: Network congestion.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION"] = 1] = "REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION";
        /** 2: Network recovery.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY"] = 2] = "REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY";
        /** 3: The local user stops receiving the remote video stream or disables the video module.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED"] = 3] = "REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED";
        /** 4: The local user resumes receiving the remote video stream or enables the video module.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED"] = 4] = "REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED";
        /** 5: The remote user stops sending the video stream or disables the video module.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED"] = 5] = "REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED";
        /** 6: The remote user resumes sending the video stream or enables the video module.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED"] = 6] = "REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED";
        /** 7: The remote user leaves the channel.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE"] = 7] = "REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE";
        /** 8: The remote audio-and-video stream falls back to the audio-only stream due to poor network conditions.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK"] = 8] = "REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK";
        /** 9: The remote audio-only stream switches back to the audio-and-video stream after the network conditions improve.
         */
        REMOTE_VIDEO_STATE_REASON[REMOTE_VIDEO_STATE_REASON["REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY"] = 9] = "REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY";
    })(REMOTE_VIDEO_STATE_REASON = agora.REMOTE_VIDEO_STATE_REASON || (agora.REMOTE_VIDEO_STATE_REASON = {}));
    /** Video frame rates. */
    var FRAME_RATE;
    (function (FRAME_RATE) {
        /** 1: 1 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_1"] = 1] = "FRAME_RATE_FPS_1";
        /** 7: 7 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_7"] = 7] = "FRAME_RATE_FPS_7";
        /** 10: 10 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_10"] = 10] = "FRAME_RATE_FPS_10";
        /** 15: 15 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_15"] = 15] = "FRAME_RATE_FPS_15";
        /** 24: 24 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_24"] = 24] = "FRAME_RATE_FPS_24";
        /** 30: 30 fps */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_30"] = 30] = "FRAME_RATE_FPS_30";
        /** 60: 60 fps (Windows and macOS only) */
        FRAME_RATE[FRAME_RATE["FRAME_RATE_FPS_60"] = 60] = "FRAME_RATE_FPS_60";
    })(FRAME_RATE = agora.FRAME_RATE || (agora.FRAME_RATE = {}));
    /** Video output orientation modes.
     */
    var ORIENTATION_MODE;
    (function (ORIENTATION_MODE) {
        /** 0: (Default) Adaptive mode.

         The video encoder adapts to the orientation mode of the video input device.

         - If the width of the captured video from the SDK is greater than the height, the encoder sends the video in landscape mode. The encoder also sends the rotational information of the video, and the receiver uses the rotational information to rotate the received video.
         - When you use a custom video source, the output video from the encoder inherits the orientation of the original video. If the original video is in portrait mode, the output video from the encoder is also in portrait mode. The encoder also sends the rotational information of the video to the receiver.
         */
        ORIENTATION_MODE[ORIENTATION_MODE["ORIENTATION_MODE_ADAPTIVE"] = 0] = "ORIENTATION_MODE_ADAPTIVE";
        /** 1: Landscape mode.

         The video encoder always sends the video in landscape mode. The video encoder rotates the original video before sending it and the rotational infomation is 0. This mode applies to scenarios involving CDN live streaming.
         */
        ORIENTATION_MODE[ORIENTATION_MODE["ORIENTATION_MODE_FIXED_LANDSCAPE"] = 1] = "ORIENTATION_MODE_FIXED_LANDSCAPE";
        /** 2: Portrait mode.

         The video encoder always sends the video in portrait mode. The video encoder rotates the original video before sending it and the rotational infomation is 0. This mode applies to scenarios involving CDN live streaming.
         */
        ORIENTATION_MODE[ORIENTATION_MODE["ORIENTATION_MODE_FIXED_PORTRAIT"] = 2] = "ORIENTATION_MODE_FIXED_PORTRAIT";
    })(ORIENTATION_MODE = agora.ORIENTATION_MODE || (agora.ORIENTATION_MODE = {}));
    /** Video degradation preferences when the bandwidth is a constraint. */
    var DEGRADATION_PREFERENCE;
    (function (DEGRADATION_PREFERENCE) {
        /** 0: (Default) Degrade the frame rate in order to maintain the video quality. */
        DEGRADATION_PREFERENCE[DEGRADATION_PREFERENCE["MAINTAIN_QUALITY"] = 0] = "MAINTAIN_QUALITY";
        /** 1: Degrade the video quality in order to maintain the frame rate. */
        DEGRADATION_PREFERENCE[DEGRADATION_PREFERENCE["MAINTAIN_FRAMERATE"] = 1] = "MAINTAIN_FRAMERATE";
        /** 2: (For future use) Maintain a balance between the frame rate and video quality. */
        DEGRADATION_PREFERENCE[DEGRADATION_PREFERENCE["MAINTAIN_BALANCED"] = 2] = "MAINTAIN_BALANCED";
    })(DEGRADATION_PREFERENCE = agora.DEGRADATION_PREFERENCE || (agora.DEGRADATION_PREFERENCE = {}));
    /** Stream fallback options. */
    var STREAM_FALLBACK_OPTIONS;
    (function (STREAM_FALLBACK_OPTIONS) {
        /** 0: No fallback behavior for the local/remote video stream when the uplink/downlink network conditions are poor. The quality of the stream is not guaranteed. */
        STREAM_FALLBACK_OPTIONS[STREAM_FALLBACK_OPTIONS["STREAM_FALLBACK_OPTION_DISABLED"] = 0] = "STREAM_FALLBACK_OPTION_DISABLED";
        /** 1: Under poor downlink network conditions, the remote video stream, to which you subscribe, falls back to the low-stream (low resolution and low bitrate) video. You can set this option only in the \ref IRtcEngine::setRemoteSubscribeFallbackOption "setRemoteSubscribeFallbackOption" method. Nothing happens when you set this in the \ref IRtcEngine::setLocalPublishFallbackOption "setLocalPublishFallbackOption" method. */
        STREAM_FALLBACK_OPTIONS[STREAM_FALLBACK_OPTIONS["STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW"] = 1] = "STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW";
        /** 2: Under poor uplink network conditions, the published video stream falls back to audio only.

         Under poor downlink network conditions, the remote video stream, to which you subscribe, first falls back to the low-stream (low resolution and low bitrate) video; and then to an audio-only stream if the network conditions worsen.*/
        STREAM_FALLBACK_OPTIONS[STREAM_FALLBACK_OPTIONS["STREAM_FALLBACK_OPTION_AUDIO_ONLY"] = 2] = "STREAM_FALLBACK_OPTION_AUDIO_ONLY";
    })(STREAM_FALLBACK_OPTIONS = agora.STREAM_FALLBACK_OPTIONS || (agora.STREAM_FALLBACK_OPTIONS = {}));
    /** Camera capturer configuration.
     */
    var CAPTURER_OUTPUT_PREFERENCE;
    (function (CAPTURER_OUTPUT_PREFERENCE) {
        /** 0: (Default) self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality.
         */
        CAPTURER_OUTPUT_PREFERENCE[CAPTURER_OUTPUT_PREFERENCE["CAPTURER_OUTPUT_PREFERENCE_AUTO"] = 0] = "CAPTURER_OUTPUT_PREFERENCE_AUTO";
        /** 1: Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
         */
        CAPTURER_OUTPUT_PREFERENCE[CAPTURER_OUTPUT_PREFERENCE["CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE"] = 1] = "CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE";
        /** 2: Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing.
         */
        CAPTURER_OUTPUT_PREFERENCE[CAPTURER_OUTPUT_PREFERENCE["CAPTURER_OUTPUT_PREFERENCE_PREVIEW"] = 2] = "CAPTURER_OUTPUT_PREFERENCE_PREVIEW";
    })(CAPTURER_OUTPUT_PREFERENCE = agora.CAPTURER_OUTPUT_PREFERENCE || (agora.CAPTURER_OUTPUT_PREFERENCE = {}));
    /** The priority of the remote user.
     */
    var PRIORITY_TYPE;
    (function (PRIORITY_TYPE) {
        /** 50: The user's priority is high.
         */
        PRIORITY_TYPE[PRIORITY_TYPE["PRIORITY_HIGH"] = 50] = "PRIORITY_HIGH";
        /** 100: (Default) The user's priority is normal.
         */
        PRIORITY_TYPE[PRIORITY_TYPE["PRIORITY_NORMAL"] = 100] = "PRIORITY_NORMAL";
    })(PRIORITY_TYPE = agora.PRIORITY_TYPE || (agora.PRIORITY_TYPE = {}));
    /** Connection states. */
    var CONNECTION_STATE_TYPE;
    (function (CONNECTION_STATE_TYPE) {
        /** 1: The SDK is disconnected from Agora's edge server.

         - This is the initial state before calling the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
         - The SDK also enters this state when the application calls the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.
         */
        CONNECTION_STATE_TYPE[CONNECTION_STATE_TYPE["CONNECTION_STATE_DISCONNECTED"] = 1] = "CONNECTION_STATE_DISCONNECTED";
        /** 2: The SDK is connecting to Agora's edge server.

         - When the application calls the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method, the SDK starts to establish a connection to the specified channel, triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, and switches to the #CONNECTION_STATE_CONNECTING state.
         - When the SDK successfully joins the channel, it triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_CONNECTED state.
         - After the SDK joins the channel and when it finishes initializing the media engine, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback.
         */
        CONNECTION_STATE_TYPE[CONNECTION_STATE_TYPE["CONNECTION_STATE_CONNECTING"] = 2] = "CONNECTION_STATE_CONNECTING";
        /** 3: The SDK is connected to Agora's edge server and has joined a channel. You can now publish or subscribe to a media stream in the channel.

         If the connection to the channel is lost because, for example, if the network is down or switched, the SDK automatically tries to reconnect and triggers:
         - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted" callback (deprecated).
         - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_RECONNECTING state.
         */
        CONNECTION_STATE_TYPE[CONNECTION_STATE_TYPE["CONNECTION_STATE_CONNECTED"] = 3] = "CONNECTION_STATE_CONNECTED";
        /** 4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.

         - If the SDK cannot rejoin the channel within 10 seconds after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost" callback, stays in the #CONNECTION_STATE_RECONNECTING state, and keeps rejoining the channel.
         - If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, switches to the #CONNECTION_STATE_FAILED state, and stops rejoining the channel.
         */
        CONNECTION_STATE_TYPE[CONNECTION_STATE_TYPE["CONNECTION_STATE_RECONNECTING"] = 4] = "CONNECTION_STATE_RECONNECTING";
        /** 5: The SDK fails to connect to Agora's edge server or join the channel.

         You must call the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to leave this state, and call the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method again to rejoin the channel.

         If the SDK is banned from joining the channel by Agora's edge server (through the RESTful API), the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionBanned "onConnectionBanned" (deprecated) and \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callbacks.
         */
        CONNECTION_STATE_TYPE[CONNECTION_STATE_TYPE["CONNECTION_STATE_FAILED"] = 5] = "CONNECTION_STATE_FAILED";
    })(CONNECTION_STATE_TYPE = agora.CONNECTION_STATE_TYPE || (agora.CONNECTION_STATE_TYPE = {}));
    /** Reasons for a connection state change. */
    var CONNECTION_CHANGED_REASON_TYPE;
    (function (CONNECTION_CHANGED_REASON_TYPE) {
        /** 0: The SDK is connecting to Agora's edge server. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_CONNECTING"] = 0] = "CONNECTION_CHANGED_CONNECTING";
        /** 1: The SDK has joined the channel successfully. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_JOIN_SUCCESS"] = 1] = "CONNECTION_CHANGED_JOIN_SUCCESS";
        /** 2: The connection between the SDK and Agora's edge server is interrupted. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_INTERRUPTED"] = 2] = "CONNECTION_CHANGED_INTERRUPTED";
        /** 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_BANNED_BY_SERVER"] = 3] = "CONNECTION_CHANGED_BANNED_BY_SERVER";
        /** 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_JOIN_FAILED"] = 4] = "CONNECTION_CHANGED_JOIN_FAILED";
        /** 5: The SDK has left the channel. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_LEAVE_CHANNEL"] = 5] = "CONNECTION_CHANGED_LEAVE_CHANNEL";
        /** 6: The connection failed since Appid is not valid. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_INVALID_APP_ID"] = 6] = "CONNECTION_CHANGED_INVALID_APP_ID";
        /** 7: The connection failed since channel name is not valid. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_INVALID_CHANNEL_NAME"] = 7] = "CONNECTION_CHANGED_INVALID_CHANNEL_NAME";
        /** 8: The connection failed since token is not valid, possibly because:

         - The App Certificate for the project is enabled in Console, but you do not use Token when joining the channel. If you enable the App Certificate, you must use a token to join the channel.
         - The uid that you specify in the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method is different from the uid that you pass for generating the token.
         */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_INVALID_TOKEN"] = 8] = "CONNECTION_CHANGED_INVALID_TOKEN";
        /** 9: The connection failed since token is expired. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_TOKEN_EXPIRED"] = 9] = "CONNECTION_CHANGED_TOKEN_EXPIRED";
        /** 10: The connection is rejected by server. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_REJECTED_BY_SERVER"] = 10] = "CONNECTION_CHANGED_REJECTED_BY_SERVER";
        /** 11: The connection changed to reconnecting since SDK has set a proxy server. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_SETTING_PROXY_SERVER"] = 11] = "CONNECTION_CHANGED_SETTING_PROXY_SERVER";
        /** 12: When SDK is in connection failed, the renew token operation will make it connecting. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_RENEW_TOKEN"] = 12] = "CONNECTION_CHANGED_RENEW_TOKEN";
        /** 13: The IP Address of SDK client has changed. i.e., Network type or IP/Port changed by network operator might change client IP address. */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_CLIENT_IP_ADDRESS_CHANGED"] = 13] = "CONNECTION_CHANGED_CLIENT_IP_ADDRESS_CHANGED";
        /** 14: Timeout for the keep-alive of the connection between the SDK and Agora's edge server. The connection state changes to CONNECTION_STATE_RECONNECTING(4). */
        CONNECTION_CHANGED_REASON_TYPE[CONNECTION_CHANGED_REASON_TYPE["CONNECTION_CHANGED_KEEP_ALIVE_TIMEOUT"] = 14] = "CONNECTION_CHANGED_KEEP_ALIVE_TIMEOUT";
    })(CONNECTION_CHANGED_REASON_TYPE = agora.CONNECTION_CHANGED_REASON_TYPE || (agora.CONNECTION_CHANGED_REASON_TYPE = {}));
    /** Network type. */
    var NETWORK_TYPE;
    (function (NETWORK_TYPE) {
        /** -1: The network type is unknown. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_UNKNOWN"] = -1] = "NETWORK_TYPE_UNKNOWN";
        /** 0: The SDK disconnects from the network. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_DISCONNECTED"] = 0] = "NETWORK_TYPE_DISCONNECTED";
        /** 1: The network type is LAN. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_LAN"] = 1] = "NETWORK_TYPE_LAN";
        /** 2: The network type is Wi-Fi(including hotspots). */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_WIFI"] = 2] = "NETWORK_TYPE_WIFI";
        /** 3: The network type is mobile 2G. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_MOBILE_2G"] = 3] = "NETWORK_TYPE_MOBILE_2G";
        /** 4: The network type is mobile 3G. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_MOBILE_3G"] = 4] = "NETWORK_TYPE_MOBILE_3G";
        /** 5: The network type is mobile 4G. */
        NETWORK_TYPE[NETWORK_TYPE["NETWORK_TYPE_MOBILE_4G"] = 5] = "NETWORK_TYPE_MOBILE_4G";
    })(NETWORK_TYPE = agora.NETWORK_TYPE || (agora.NETWORK_TYPE = {}));
    /** States of the last-mile network probe test. */
    var LASTMILE_PROBE_RESULT_STATE;
    (function (LASTMILE_PROBE_RESULT_STATE) {
        /** 1: The last-mile network probe test is complete. */
        LASTMILE_PROBE_RESULT_STATE[LASTMILE_PROBE_RESULT_STATE["LASTMILE_PROBE_RESULT_COMPLETE"] = 1] = "LASTMILE_PROBE_RESULT_COMPLETE";
        /** 2: The last-mile network probe test is incomplete and the bandwidth estimation is not available, probably due to limited test resources. */
        LASTMILE_PROBE_RESULT_STATE[LASTMILE_PROBE_RESULT_STATE["LASTMILE_PROBE_RESULT_INCOMPLETE_NO_BWE"] = 2] = "LASTMILE_PROBE_RESULT_INCOMPLETE_NO_BWE";
        /** 3: The last-mile network probe test is not carried out, probably due to poor network conditions. */
        LASTMILE_PROBE_RESULT_STATE[LASTMILE_PROBE_RESULT_STATE["LASTMILE_PROBE_RESULT_UNAVAILABLE"] = 3] = "LASTMILE_PROBE_RESULT_UNAVAILABLE";
    })(LASTMILE_PROBE_RESULT_STATE = agora.LASTMILE_PROBE_RESULT_STATE || (agora.LASTMILE_PROBE_RESULT_STATE = {}));
    /** Audio output routing. */
    var AUDIO_ROUTE_TYPE;
    (function (AUDIO_ROUTE_TYPE) {
        /** Default.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_DEFAULT"] = -1] = "AUDIO_ROUTE_DEFAULT";
        /** Headset.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_HEADSET"] = 0] = "AUDIO_ROUTE_HEADSET";
        /** Earpiece.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_EARPIECE"] = 1] = "AUDIO_ROUTE_EARPIECE";
        /** Headset with no microphone.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_HEADSET_NO_MIC"] = 2] = "AUDIO_ROUTE_HEADSET_NO_MIC";
        /** Speakerphone.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_SPEAKERPHONE"] = 3] = "AUDIO_ROUTE_SPEAKERPHONE";
        /** Loudspeaker.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_LOUDSPEAKER"] = 4] = "AUDIO_ROUTE_LOUDSPEAKER";
        /** Bluetooth headset.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_BLUETOOTH"] = 5] = "AUDIO_ROUTE_BLUETOOTH";
        /** USB peripheral.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_USB"] = 6] = "AUDIO_ROUTE_USB";
        /** HDMI peripheral.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_HDMI"] = 7] = "AUDIO_ROUTE_HDMI";
        /** DisplayPort peripheral.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_DISPLAYPORT"] = 8] = "AUDIO_ROUTE_DISPLAYPORT";
        /** Apple AirPlay.
         */
        AUDIO_ROUTE_TYPE[AUDIO_ROUTE_TYPE["AUDIO_ROUTE_AIRPLAY"] = 9] = "AUDIO_ROUTE_AIRPLAY";
    })(AUDIO_ROUTE_TYPE = agora.AUDIO_ROUTE_TYPE || (agora.AUDIO_ROUTE_TYPE = {}));
    /** Audio session restriction. */
    var AUDIO_SESSION_OPERATION_RESTRICTION;
    (function (AUDIO_SESSION_OPERATION_RESTRICTION) {
        /** No restriction, the SDK has full control of the audio session operations. */
        AUDIO_SESSION_OPERATION_RESTRICTION[AUDIO_SESSION_OPERATION_RESTRICTION["AUDIO_SESSION_OPERATION_RESTRICTION_NONE"] = 0] = "AUDIO_SESSION_OPERATION_RESTRICTION_NONE";
        /** The SDK does not change the audio session category. */
        AUDIO_SESSION_OPERATION_RESTRICTION[AUDIO_SESSION_OPERATION_RESTRICTION["AUDIO_SESSION_OPERATION_RESTRICTION_SET_CATEGORY"] = 1] = "AUDIO_SESSION_OPERATION_RESTRICTION_SET_CATEGORY";
        /** The SDK does not change any setting of the audio session (category, mode, categoryOptions). */
        AUDIO_SESSION_OPERATION_RESTRICTION[AUDIO_SESSION_OPERATION_RESTRICTION["AUDIO_SESSION_OPERATION_RESTRICTION_CONFIGURE_SESSION"] = 2] = "AUDIO_SESSION_OPERATION_RESTRICTION_CONFIGURE_SESSION";
        /** The SDK keeps the audio session active when leaving a channel. */
        AUDIO_SESSION_OPERATION_RESTRICTION[AUDIO_SESSION_OPERATION_RESTRICTION["AUDIO_SESSION_OPERATION_RESTRICTION_DEACTIVATE_SESSION"] = 4] = "AUDIO_SESSION_OPERATION_RESTRICTION_DEACTIVATE_SESSION";
        /** The SDK does not configure the audio session anymore. */
        AUDIO_SESSION_OPERATION_RESTRICTION[AUDIO_SESSION_OPERATION_RESTRICTION["AUDIO_SESSION_OPERATION_RESTRICTION_ALL"] = 128] = "AUDIO_SESSION_OPERATION_RESTRICTION_ALL";
    })(AUDIO_SESSION_OPERATION_RESTRICTION = agora.AUDIO_SESSION_OPERATION_RESTRICTION || (agora.AUDIO_SESSION_OPERATION_RESTRICTION = {}));
    var CAMERA_DIRECTION;
    (function (CAMERA_DIRECTION) {
        /** The rear camera. */
        CAMERA_DIRECTION[CAMERA_DIRECTION["CAMERA_REAR"] = 0] = "CAMERA_REAR";
        /** The front camera. */
        CAMERA_DIRECTION[CAMERA_DIRECTION["CAMERA_FRONT"] = 1] = "CAMERA_FRONT";
    })(CAMERA_DIRECTION = agora.CAMERA_DIRECTION || (agora.CAMERA_DIRECTION = {}));
    /** Quality change of the local video in terms of target frame rate and target bit rate since last count.
     */
    var QUALITY_ADAPT_INDICATION;
    (function (QUALITY_ADAPT_INDICATION) {
        /** The quality of the local video stays the same. */
        QUALITY_ADAPT_INDICATION[QUALITY_ADAPT_INDICATION["ADAPT_NONE"] = 0] = "ADAPT_NONE";
        /** The quality improves because the network bandwidth increases. */
        QUALITY_ADAPT_INDICATION[QUALITY_ADAPT_INDICATION["ADAPT_UP_BANDWIDTH"] = 1] = "ADAPT_UP_BANDWIDTH";
        /** The quality worsens because the network bandwidth decreases. */
        QUALITY_ADAPT_INDICATION[QUALITY_ADAPT_INDICATION["ADAPT_DOWN_BANDWIDTH"] = 2] = "ADAPT_DOWN_BANDWIDTH";
    })(QUALITY_ADAPT_INDICATION = agora.QUALITY_ADAPT_INDICATION || (agora.QUALITY_ADAPT_INDICATION = {}));
    /** The error code in CHANNEL_MEDIA_RELAY_ERROR. */
    var CHANNEL_MEDIA_RELAY_ERROR;
    (function (CHANNEL_MEDIA_RELAY_ERROR) {
        /** 0: The state is normal.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_OK"] = 0] = "RELAY_OK";
        /** 1: An error occurs in the server response.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_SERVER_ERROR_RESPONSE"] = 1] = "RELAY_ERROR_SERVER_ERROR_RESPONSE";
        /** 2: No server response. You can call the
         * \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to
         * leave the channel.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_SERVER_NO_RESPONSE"] = 2] = "RELAY_ERROR_SERVER_NO_RESPONSE";
        /** 3: The SDK fails to access the service, probably due to limited
         * resources of the server.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_NO_RESOURCE_AVAILABLE"] = 3] = "RELAY_ERROR_NO_RESOURCE_AVAILABLE";
        /** 4: Fails to send the relay request.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_FAILED_JOIN_SRC"] = 4] = "RELAY_ERROR_FAILED_JOIN_SRC";
        /** 5: Fails to accept the relay request.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_FAILED_JOIN_DEST"] = 5] = "RELAY_ERROR_FAILED_JOIN_DEST";
        /** 6: The server fails to receive the media stream.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC"] = 6] = "RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC";
        /** 7: The server fails to send the media stream.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST"] = 7] = "RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST";
        /** 8: The SDK disconnects from the server due to poor network
         * connections. You can call the \ref agora::rtc::IRtcEngine::leaveChannel
         * "leaveChannel" method to leave the channel.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_SERVER_CONNECTION_LOST"] = 8] = "RELAY_ERROR_SERVER_CONNECTION_LOST";
        /** 9: An internal error occurs in the server.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_INTERNAL_ERROR"] = 9] = "RELAY_ERROR_INTERNAL_ERROR";
        /** 10: The token of the source channel has expired.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_SRC_TOKEN_EXPIRED"] = 10] = "RELAY_ERROR_SRC_TOKEN_EXPIRED";
        /** 11: The token of the destination channel has expired.
         */
        CHANNEL_MEDIA_RELAY_ERROR[CHANNEL_MEDIA_RELAY_ERROR["RELAY_ERROR_DEST_TOKEN_EXPIRED"] = 11] = "RELAY_ERROR_DEST_TOKEN_EXPIRED";
    })(CHANNEL_MEDIA_RELAY_ERROR = agora.CHANNEL_MEDIA_RELAY_ERROR || (agora.CHANNEL_MEDIA_RELAY_ERROR = {}));
    /** The event code in CHANNEL_MEDIA_RELAY_EVENT. */
    var CHANNEL_MEDIA_RELAY_EVENT;
    (function (CHANNEL_MEDIA_RELAY_EVENT) {
        /** 0: The user disconnects from the server due to poor network
         * connections.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_NETWORK_DISCONNECTED"] = 0] = "RELAY_EVENT_NETWORK_DISCONNECTED";
        /** 1: The network reconnects.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_NETWORK_CONNECTED"] = 1] = "RELAY_EVENT_NETWORK_CONNECTED";
        /** 2: The user joins the source channel.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL"] = 2] = "RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL";
        /** 3: The user joins the destination channel.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL"] = 3] = "RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL";
        /** 4: The SDK starts relaying the media stream to the destination channel.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL"] = 4] = "RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL";
        /** 5: The server receives the video stream from the source channel.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC"] = 5] = "RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC";
        /** 6: The server receives the audio stream from the source channel.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC"] = 6] = "RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC";
        /** 7: The destination channel is updated.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL"] = 7] = "RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL";
        /** 8: The destination channel update fails due to internal reasons.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED"] = 8] = "RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED";
        /** 9: The destination channel does not change, which means that the
         * destination channel fails to be updated.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE"] = 9] = "RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE";
        /** 10: The destination channel name is NULL.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL"] = 10] = "RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL";
        /** 11: The video profile is sent to the server.
         */
        CHANNEL_MEDIA_RELAY_EVENT[CHANNEL_MEDIA_RELAY_EVENT["RELAY_EVENT_VIDEO_PROFILE_UPDATE"] = 11] = "RELAY_EVENT_VIDEO_PROFILE_UPDATE";
    })(CHANNEL_MEDIA_RELAY_EVENT = agora.CHANNEL_MEDIA_RELAY_EVENT || (agora.CHANNEL_MEDIA_RELAY_EVENT = {}));
    /** The state code in CHANNEL_MEDIA_RELAY_STATE. */
    var CHANNEL_MEDIA_RELAY_STATE;
    (function (CHANNEL_MEDIA_RELAY_STATE) {
        /** 0: The SDK is initializing.
         */
        CHANNEL_MEDIA_RELAY_STATE[CHANNEL_MEDIA_RELAY_STATE["RELAY_STATE_IDLE"] = 0] = "RELAY_STATE_IDLE";
        /** 1: The SDK tries to relay the media stream to the destination channel.
         */
        CHANNEL_MEDIA_RELAY_STATE[CHANNEL_MEDIA_RELAY_STATE["RELAY_STATE_CONNECTING"] = 1] = "RELAY_STATE_CONNECTING";
        /** 2: The SDK successfully relays the media stream to the destination
         * channel.
         */
        CHANNEL_MEDIA_RELAY_STATE[CHANNEL_MEDIA_RELAY_STATE["RELAY_STATE_RUNNING"] = 2] = "RELAY_STATE_RUNNING";
        /** 3: A failure occurs. See the details in code.
         */
        CHANNEL_MEDIA_RELAY_STATE[CHANNEL_MEDIA_RELAY_STATE["RELAY_STATE_FAILURE"] = 3] = "RELAY_STATE_FAILURE";
    })(CHANNEL_MEDIA_RELAY_STATE = agora.CHANNEL_MEDIA_RELAY_STATE || (agora.CHANNEL_MEDIA_RELAY_STATE = {}));
    /** (Recommended) The standard bitrate set in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method.

     In this mode, the bitrates differ between the live interactive streaming and communication profiles:

     - `COMMUNICATION` profile: The video bitrate is the same as the base bitrate.
     - `LIVE_BROADCASTING` profile: The video bitrate is twice the base bitrate.

     */
    var STANDARD_BITRATE = 0;
    /** The compatible bitrate set in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method.

     The bitrate remains the same regardless of the channel profile. If you choose this mode in the `LIVE_BROADCASTING` profile, the video frame rate may be lower than the set value.
     */
    var COMPATIBLE_BITRATE = -1;
    /** Use the default minimum bitrate.
     */
    var DEFAULT_MIN_BITRATE = -1;
    /**  **DEPRECATED** Lifecycle of the CDN live video stream.
     */
    var RTMP_STREAM_LIFE_CYCLE_TYPE;
    (function (RTMP_STREAM_LIFE_CYCLE_TYPE) {
        /** Bind to the channel lifecycle. If all hosts leave the channel, the CDN live streaming stops after 30 seconds.
         */
        RTMP_STREAM_LIFE_CYCLE_TYPE[RTMP_STREAM_LIFE_CYCLE_TYPE["RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL"] = 1] = "RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL";
        /** Bind to the owner of the RTMP stream. If the owner leaves the channel, the CDN live streaming stops immediately.
         */
        RTMP_STREAM_LIFE_CYCLE_TYPE[RTMP_STREAM_LIFE_CYCLE_TYPE["RTMP_STREAM_LIFE_CYCLE_BIND2OWNER"] = 2] = "RTMP_STREAM_LIFE_CYCLE_BIND2OWNER";
    })(RTMP_STREAM_LIFE_CYCLE_TYPE = agora.RTMP_STREAM_LIFE_CYCLE_TYPE || (agora.RTMP_STREAM_LIFE_CYCLE_TYPE = {}));
    /** Content hints for screen sharing.
     */
    var VideoContentHint;
    (function (VideoContentHint) {
        /** (Default) No content hint.
         */
        VideoContentHint[VideoContentHint["CONTENT_HINT_NONE"] = 0] = "CONTENT_HINT_NONE";
        /** Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game.
         */
        VideoContentHint[VideoContentHint["CONTENT_HINT_MOTION"] = 1] = "CONTENT_HINT_MOTION";
        /** Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text.
         */
        VideoContentHint[VideoContentHint["CONTENT_HINT_DETAILS"] = 2] = "CONTENT_HINT_DETAILS";
    })(VideoContentHint = agora.VideoContentHint || (agora.VideoContentHint = {}));
    /**
     * IP areas.
     */
    var AREA_CODE;
    (function (AREA_CODE) {
        /**
         * Mainland China.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_CN"] = 1] = "AREA_CODE_CN";
        /**
         * North America.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_NA"] = 2] = "AREA_CODE_NA";
        /**
         * Europe.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_EUR"] = 4] = "AREA_CODE_EUR";
        /**
         * Asia, excluding Mainland China.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_AS"] = 8] = "AREA_CODE_AS";
        /**
         * Japan.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_JAPAN"] = 16] = "AREA_CODE_JAPAN";
        /**
         * India.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_INDIA"] = 32] = "AREA_CODE_INDIA";
        /**
         * (Default) Global.
         */
        AREA_CODE[AREA_CODE["AREA_CODE_GLOBAL"] = 4294967295] = "AREA_CODE_GLOBAL";
    })(AREA_CODE = agora.AREA_CODE || (agora.AREA_CODE = {}));
    var ENCRYPTION_CONFIG;
    (function (ENCRYPTION_CONFIG) {
        /**
         * - 1: Force set master key and mode;
         * - 0: Not force set, checking whether encryption plugin exists
         */
        ENCRYPTION_CONFIG[ENCRYPTION_CONFIG["ENCRYPTION_FORCE_SETTING"] = 1] = "ENCRYPTION_FORCE_SETTING";
        /**
         * - 1: Force not encrypting packet;
         * - 0: Not force encrypting;
         */
        ENCRYPTION_CONFIG[ENCRYPTION_CONFIG["ENCRYPTION_FORCE_DISABLE_PACKET"] = 2] = "ENCRYPTION_FORCE_DISABLE_PACKET";
    })(ENCRYPTION_CONFIG = agora.ENCRYPTION_CONFIG || (agora.ENCRYPTION_CONFIG = {}));
    /** Encryption mode. */
    var ENCRYPTION_MODE;
    (function (ENCRYPTION_MODE) {
        /** 1: (Default) 128-bit AES encryption, XTS mode. */
        ENCRYPTION_MODE[ENCRYPTION_MODE["AES_128_XTS"] = 1] = "AES_128_XTS";
        /** 2: 128-bit AES encryption, ECB mode. */
        ENCRYPTION_MODE[ENCRYPTION_MODE["AES_128_ECB"] = 2] = "AES_128_ECB";
        /** 3: 256-bit AES encryption, XTS mode. */
        ENCRYPTION_MODE[ENCRYPTION_MODE["AES_256_XTS"] = 3] = "AES_256_XTS";
        /** 4: 128-bit SM4 encryption, ECB mode. */
        ENCRYPTION_MODE[ENCRYPTION_MODE["SM4_128_ECB"] = 4] = "SM4_128_ECB";
        /** Enumerator boundary. */
        ENCRYPTION_MODE[ENCRYPTION_MODE["MODE_END"] = 5] = "MODE_END";
    })(ENCRYPTION_MODE = agora.ENCRYPTION_MODE || (agora.ENCRYPTION_MODE = {}));
    /** Error code. */
    var ERROR_CODE_TYPE;
    (function (ERROR_CODE_TYPE) {
        /** 0: No error occurs.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_OK"] = 0] = "ERR_OK";
        //1~1000
        /** 1: A general error occurs (no specified reason).
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_FAILED"] = 1] = "ERR_FAILED";
        /** 2: An invalid parameter is used. For example, the specific channel name includes illegal characters.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVALID_ARGUMENT"] = 2] = "ERR_INVALID_ARGUMENT";
        /** 3: The SDK module is not ready. Possible solutions:

         - Check the audio device.
         - Check the completeness of the application.
         - Re-initialize the RTC engine.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NOT_READY"] = 3] = "ERR_NOT_READY";
        /** 4: The SDK does not support this function.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NOT_SUPPORTED"] = 4] = "ERR_NOT_SUPPORTED";
        /** 5: The request is rejected.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_REFUSED"] = 5] = "ERR_REFUSED";
        /** 6: The buffer size is not big enough to store the returned data.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_BUFFER_TOO_SMALL"] = 6] = "ERR_BUFFER_TOO_SMALL";
        /** 7: The SDK is not initialized before calling this method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NOT_INITIALIZED"] = 7] = "ERR_NOT_INITIALIZED";
        /** 9: No permission exists. Check if the user has granted access to the audio or video device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NO_PERMISSION"] = 9] = "ERR_NO_PERMISSION";
        /** 10: An API method timeout occurs. Some API methods require the SDK to return the execution result, and this error occurs if the request takes too long (more than 10 seconds) for the SDK to process.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_TIMEDOUT"] = 10] = "ERR_TIMEDOUT";
        /** 11: The request is canceled. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_CANCELED"] = 11] = "ERR_CANCELED";
        /** 12: The method is called too often. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_TOO_OFTEN"] = 12] = "ERR_TOO_OFTEN";
        /** 13: The SDK fails to bind to the network socket. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_BIND_SOCKET"] = 13] = "ERR_BIND_SOCKET";
        /** 14: The network is unavailable. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NET_DOWN"] = 14] = "ERR_NET_DOWN";
        /** 15: No network buffers are available. This is for internal SDK internal use only, and it does not return to the application through any method or callback.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NET_NOBUFS"] = 15] = "ERR_NET_NOBUFS";
        /** 17: The request to join the channel is rejected.
         *
         * - This error usually occurs when the user is already in the channel, and still calls the method to join the channel, for example, \ref agora::rtc::IRtcEngine::joinChannel "joinChannel".
         * - This error usually occurs when the user tries to join a channel during a call test (\ref agora::rtc::IRtcEngine::startEchoTest "startEchoTest"). Once you call \ref agora::rtc::IRtcEngine::startEchoTest "startEchoTest", you need to call \ref agora::rtc::IRtcEngine::stopEchoTest "stopEchoTest" before joining a channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_JOIN_CHANNEL_REJECTED"] = 17] = "ERR_JOIN_CHANNEL_REJECTED";
        /** 18: The request to leave the channel is rejected.

         This error usually occurs:

         - When the user has left the channel and still calls \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" to leave the channel. In this case, stop calling \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel".
         - When the user has not joined the channel and still calls \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" to leave the channel. In this case, no extra operation is needed.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_REJECTED"] = 18] = "ERR_LEAVE_CHANNEL_REJECTED";
        /** 19: Resources are occupied and cannot be reused.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ALREADY_IN_USE"] = 19] = "ERR_ALREADY_IN_USE";
        /** 20: The SDK gives up the request due to too many requests.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ABORTED"] = 20] = "ERR_ABORTED";
        /** 21: In Windows, specific firewall settings can cause the SDK to fail to initialize and crash.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INIT_NET_ENGINE"] = 21] = "ERR_INIT_NET_ENGINE";
        /** 22: The application uses too much of the system resources and the SDK fails to allocate the resources.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_RESOURCE_LIMITED"] = 22] = "ERR_RESOURCE_LIMITED";
        /** 101: The specified App ID is invalid. Please try to rejoin the channel with a valid App ID.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVALID_APP_ID"] = 101] = "ERR_INVALID_APP_ID";
        /** 102: The specified channel name is invalid. Please try to rejoin the channel with a valid channel name.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVALID_CHANNEL_NAME"] = 102] = "ERR_INVALID_CHANNEL_NAME";
        /** 103: Fails to get server resources in the specified region. Please try to specify another region when calling \ref agora::rtc::IRtcEngine::initialize "initialize".
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NO_SERVER_RESOURCES"] = 103] = "ERR_NO_SERVER_RESOURCES";
        /** **DEPRECATED** 109: Deprecated as of v2.4.1. Use CONNECTION_CHANGED_TOKEN_EXPIRED(9) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.

         The token expired due to one of the following reasons:

         - Authorized Timestamp expired: The timestamp is represented by the number of seconds elapsed since 1/1/1970. The user can use the Token to access the Agora service within 24 hours after the Token is generated. If the user does not access the Agora service after 24 hours, this Token is no longer valid.
         - Call Expiration Timestamp expired: The timestamp is the exact time when a user can no longer use the Agora service (for example, when a user is forced to leave an ongoing call). When a value is set for the Call Expiration Timestamp, it does not mean that the token will expire, but that the user will be banned from the channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_TOKEN_EXPIRED"] = 109] = "ERR_TOKEN_EXPIRED";
        /** **DEPRECATED** 110: Deprecated as of v2.4.1. Use CONNECTION_CHANGED_INVALID_TOKEN(8) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.

         The token is invalid due to one of the following reasons:

         - The App Certificate for the project is enabled in Console, but the user is still using the App ID. Once the App Certificate is enabled, the user must use a token.
         - The uid is mandatory, and users must set the same uid as the one set in the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVALID_TOKEN"] = 110] = "ERR_INVALID_TOKEN";
        /** 111: The internet connection is interrupted. This applies to the Agora Web SDK only.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_CONNECTION_INTERRUPTED"] = 111] = "ERR_CONNECTION_INTERRUPTED";
        /** 112: The internet connection is lost. This applies to the Agora Web SDK only.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_CONNECTION_LOST"] = 112] = "ERR_CONNECTION_LOST";
        /** 113: The user is not in the channel when calling the method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_NOT_IN_CHANNEL"] = 113] = "ERR_NOT_IN_CHANNEL";
        /** 114: The size of the sent data is over 1024 bytes when the user calls the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_SIZE_TOO_LARGE"] = 114] = "ERR_SIZE_TOO_LARGE";
        /** 115: The bitrate of the sent data exceeds the limit of 6 Kbps when the user calls the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_BITRATE_LIMIT"] = 115] = "ERR_BITRATE_LIMIT";
        /** 116: Too many data streams (over 5 streams) are created when the user calls the \ref agora::rtc::IRtcEngine::createDataStream "createDataStream" method.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_TOO_MANY_DATA_STREAMS"] = 116] = "ERR_TOO_MANY_DATA_STREAMS";
        /** 117: The data stream transmission timed out.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_STREAM_MESSAGE_TIMEOUT"] = 117] = "ERR_STREAM_MESSAGE_TIMEOUT";
        /** 119: Switching roles fail. Please try to rejoin the channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED"] = 119] = "ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED";
        /** 120: Decryption fails. The user may have used a different encryption password to join the channel. Check your settings or try rejoining the channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_DECRYPTION_FAILED"] = 120] = "ERR_DECRYPTION_FAILED";
        /** 123: The client is banned by the server.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_CLIENT_IS_BANNED_BY_SERVER"] = 123] = "ERR_CLIENT_IS_BANNED_BY_SERVER";
        /** 124: Incorrect watermark file parameter.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARK_PARAM"] = 124] = "ERR_WATERMARK_PARAM";
        /** 125: Incorrect watermark file path.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARK_PATH"] = 125] = "ERR_WATERMARK_PATH";
        /** 126: Incorrect watermark file format.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARK_PNG"] = 126] = "ERR_WATERMARK_PNG";
        /** 127: Incorrect watermark file information.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARKR_INFO"] = 127] = "ERR_WATERMARKR_INFO";
        /** 128: Incorrect watermark file data format.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARK_ARGB"] = 128] = "ERR_WATERMARK_ARGB";
        /** 129: An error occurs in reading the watermark file.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_WATERMARK_READ"] = 129] = "ERR_WATERMARK_READ";
        /** 130: Encryption is enabled when the user calls the \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method (CDN live streaming does not support encrypted streams).
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH"] = 130] = "ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH";
        /** 134: The user account is invalid. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVALID_USER_ACCOUNT"] = 134] = "ERR_INVALID_USER_ACCOUNT";
        /** 151: CDN related errors. Remove the original URL address and add a new one by calling the \ref agora::rtc::IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" and \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" methods.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_CDN_ERROR"] = 151] = "ERR_PUBLISH_STREAM_CDN_ERROR";
        /** 152: The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_NUM_REACH_LIMIT"] = 152] = "ERR_PUBLISH_STREAM_NUM_REACH_LIMIT";
        /** 153: The host manipulates other hosts' URLs. Check your app logic.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_NOT_AUTHORIZED"] = 153] = "ERR_PUBLISH_STREAM_NOT_AUTHORIZED";
        /** 154: An error occurs in Agora's streaming server. Call the addPublishStreamUrl method to publish the streaming again.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_INTERNAL_SERVER_ERROR"] = 154] = "ERR_PUBLISH_STREAM_INTERNAL_SERVER_ERROR";
        /** 155: The server fails to find the stream.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_NOT_FOUND"] = 155] = "ERR_PUBLISH_STREAM_NOT_FOUND";
        /** 156: The format of the RTMP stream URL is not supported. Check whether the URL format is correct.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_PUBLISH_STREAM_FORMAT_NOT_SUPPORTED"] = 156] = "ERR_PUBLISH_STREAM_FORMAT_NOT_SUPPORTED";
        //signaling: 400~600
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_OTHER"] = 400] = "ERR_LOGOUT_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_USER"] = 401] = "ERR_LOGOUT_USER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_NET"] = 402] = "ERR_LOGOUT_NET";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_KICKED"] = 403] = "ERR_LOGOUT_KICKED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_PACKET"] = 404] = "ERR_LOGOUT_PACKET";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_TOKEN_EXPIRED"] = 405] = "ERR_LOGOUT_TOKEN_EXPIRED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_OLDVERSION"] = 406] = "ERR_LOGOUT_OLDVERSION";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_TOKEN_WRONG"] = 407] = "ERR_LOGOUT_TOKEN_WRONG";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGOUT_ALREADY_LOGOUT"] = 408] = "ERR_LOGOUT_ALREADY_LOGOUT";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_OTHER"] = 420] = "ERR_LOGIN_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_NET"] = 421] = "ERR_LOGIN_NET";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_FAILED"] = 422] = "ERR_LOGIN_FAILED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_CANCELED"] = 423] = "ERR_LOGIN_CANCELED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_TOKEN_EXPIRED"] = 424] = "ERR_LOGIN_TOKEN_EXPIRED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_OLD_VERSION"] = 425] = "ERR_LOGIN_OLD_VERSION";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_TOKEN_WRONG"] = 426] = "ERR_LOGIN_TOKEN_WRONG";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_TOKEN_KICKED"] = 427] = "ERR_LOGIN_TOKEN_KICKED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOGIN_ALREADY_LOGIN"] = 428] = "ERR_LOGIN_ALREADY_LOGIN";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_JOIN_CHANNEL_OTHER"] = 440] = "ERR_JOIN_CHANNEL_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_SEND_MESSAGE_OTHER"] = 440] = "ERR_SEND_MESSAGE_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_SEND_MESSAGE_TIMEOUT"] = 441] = "ERR_SEND_MESSAGE_TIMEOUT";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_QUERY_USERNUM_OTHER"] = 450] = "ERR_QUERY_USERNUM_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_QUERY_USERNUM_TIMEOUT"] = 451] = "ERR_QUERY_USERNUM_TIMEOUT";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_QUERY_USERNUM_BYUSER"] = 452] = "ERR_QUERY_USERNUM_BYUSER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_OTHER"] = 460] = "ERR_LEAVE_CHANNEL_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_KICKED"] = 461] = "ERR_LEAVE_CHANNEL_KICKED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_BYUSER"] = 462] = "ERR_LEAVE_CHANNEL_BYUSER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_LOGOUT"] = 463] = "ERR_LEAVE_CHANNEL_LOGOUT";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LEAVE_CHANNEL_DISCONNECTED"] = 464] = "ERR_LEAVE_CHANNEL_DISCONNECTED";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_OTHER"] = 470] = "ERR_INVITE_OTHER";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_REINVITE"] = 471] = "ERR_INVITE_REINVITE";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_NET"] = 472] = "ERR_INVITE_NET";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_PEER_OFFLINE"] = 473] = "ERR_INVITE_PEER_OFFLINE";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_TIMEOUT"] = 474] = "ERR_INVITE_TIMEOUT";
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_INVITE_CANT_RECV"] = 475] = "ERR_INVITE_CANT_RECV";
        //1001~2000
        /** 1001: Fails to load the media engine.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_LOAD_MEDIA_ENGINE"] = 1001] = "ERR_LOAD_MEDIA_ENGINE";
        /** 1002: Fails to start the call after enabling the media engine.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_START_CALL"] = 1002] = "ERR_START_CALL";
        /** **DEPRECATED** 1003: Fails to start the camera.

         Deprecated as of v2.4.1. Use LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE(4) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_START_CAMERA"] = 1003] = "ERR_START_CAMERA";
        /** 1004: Fails to start the video rendering module.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_START_VIDEO_RENDER"] = 1004] = "ERR_START_VIDEO_RENDER";
        /** 1005: A general error occurs in the Audio Device Module (no specified reason). Check if the audio device is used by another application, or try rejoining the channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_GENERAL_ERROR"] = 1005] = "ERR_ADM_GENERAL_ERROR";
        /** 1006: Audio Device Module: An error occurs in using the Java resources.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_JAVA_RESOURCE"] = 1006] = "ERR_ADM_JAVA_RESOURCE";
        /** 1007: Audio Device Module: An error occurs in setting the sampling frequency.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_SAMPLE_RATE"] = 1007] = "ERR_ADM_SAMPLE_RATE";
        /** 1008: Audio Device Module: An error occurs in initializing the playback device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_INIT_PLAYOUT"] = 1008] = "ERR_ADM_INIT_PLAYOUT";
        /** 1009: Audio Device Module: An error occurs in starting the playback device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_START_PLAYOUT"] = 1009] = "ERR_ADM_START_PLAYOUT";
        /** 1010: Audio Device Module: An error occurs in stopping the playback device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_STOP_PLAYOUT"] = 1010] = "ERR_ADM_STOP_PLAYOUT";
        /** 1011: Audio Device Module: An error occurs in initializing the recording device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_INIT_RECORDING"] = 1011] = "ERR_ADM_INIT_RECORDING";
        /** 1012: Audio Device Module: An error occurs in starting the recording device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_START_RECORDING"] = 1012] = "ERR_ADM_START_RECORDING";
        /** 1013: Audio Device Module: An error occurs in stopping the recording device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_STOP_RECORDING"] = 1013] = "ERR_ADM_STOP_RECORDING";
        /** 1015: Audio Device Module: A playback error occurs. Check your playback device and try rejoining the channel.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_RUNTIME_PLAYOUT_ERROR"] = 1015] = "ERR_ADM_RUNTIME_PLAYOUT_ERROR";
        /** 1017: Audio Device Module: A recording error occurs.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_RUNTIME_RECORDING_ERROR"] = 1017] = "ERR_ADM_RUNTIME_RECORDING_ERROR";
        /** 1018: Audio Device Module: Fails to record.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_RECORD_AUDIO_FAILED"] = 1018] = "ERR_ADM_RECORD_AUDIO_FAILED";
        /** 1022: Audio Device Module: An error occurs in initializing the
         * loopback device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_INIT_LOOPBACK"] = 1022] = "ERR_ADM_INIT_LOOPBACK";
        /** 1023: Audio Device Module: An error occurs in starting the loopback
         * device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_START_LOOPBACK"] = 1023] = "ERR_ADM_START_LOOPBACK";
        /** 1027: Audio Device Module: No recording permission exists. Check if the
         *  recording permission is granted.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_NO_PERMISSION"] = 1027] = "ERR_ADM_NO_PERMISSION";
        /** 1033: Audio device module: The device is occupied.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_RECORD_AUDIO_IS_ACTIVE"] = 1033] = "ERR_ADM_RECORD_AUDIO_IS_ACTIVE";
        /** 1101: Audio device module: A fatal exception occurs.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_JAVA_RESOURCE"] = 1101] = "ERR_ADM_ANDROID_JNI_JAVA_RESOURCE";
        /** 1108: Audio device module: The recording frequency is lower than 50.
         * 0 indicates that the recording is not yet started. We recommend
         * checking your recording permission.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_NO_RECORD_FREQUENCY"] = 1108] = "ERR_ADM_ANDROID_JNI_NO_RECORD_FREQUENCY";
        /** 1109: The playback frequency is lower than 50. 0 indicates that the
         * playback is not yet started. We recommend checking if you have created
         * too many AudioTrack instances.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_NO_PLAYBACK_FREQUENCY"] = 1109] = "ERR_ADM_ANDROID_JNI_NO_PLAYBACK_FREQUENCY";
        /** 1111: Audio device module: AudioRecord fails to start up. A ROM system
         * error occurs. We recommend the following options to debug:
         * - Restart your App.
         * - Restart your cellphone.
         * - Check your recording permission.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_JAVA_START_RECORD"] = 1111] = "ERR_ADM_ANDROID_JNI_JAVA_START_RECORD";
        /** 1112: Audio device module: AudioTrack fails to start up. A ROM system
         * error occurs. We recommend the following options to debug:
         * - Restart your App.
         * - Restart your cellphone.
         * - Check your playback permission.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_JAVA_START_PLAYBACK"] = 1112] = "ERR_ADM_ANDROID_JNI_JAVA_START_PLAYBACK";
        /** 1115: Audio device module: AudioRecord returns error. The SDK will
         * automatically restart AudioRecord. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_JNI_JAVA_RECORD_ERROR"] = 1115] = "ERR_ADM_ANDROID_JNI_JAVA_RECORD_ERROR";
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_OPENSL_CREATE_ENGINE"] = 1151] = "ERR_ADM_ANDROID_OPENSL_CREATE_ENGINE";
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_RECORDER"] = 1153] = "ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_RECORDER";
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_OPENSL_START_RECORDER_THREAD"] = 1156] = "ERR_ADM_ANDROID_OPENSL_START_RECORDER_THREAD";
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_PLAYER"] = 1157] = "ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_PLAYER";
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_ANDROID_OPENSL_START_PLAYER_THREAD"] = 1160] = "ERR_ADM_ANDROID_OPENSL_START_PLAYER_THREAD";
        /** 1201: Audio device module: The current device does not support audio
         * input, possibly because you have mistakenly configured the audio session
         *  category, or because some other app is occupying the input device. We
         * recommend terminating all background apps and re-joining the channel. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_INPUT_NOT_AVAILABLE"] = 1201] = "ERR_ADM_IOS_INPUT_NOT_AVAILABLE";
        /** 1206: Audio device module: Cannot activate the Audio Session.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_ACTIVATE_SESSION_FAIL"] = 1206] = "ERR_ADM_IOS_ACTIVATE_SESSION_FAIL";
        /** 1210: Audio device module: Fails to initialize the audio device,
         * normally because the audio device parameters are wrongly set.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_VPIO_INIT_FAIL"] = 1210] = "ERR_ADM_IOS_VPIO_INIT_FAIL";
        /** 1213: Audio device module: Fails to re-initialize the audio device,
         * normally because the audio device parameters are wrongly set.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_VPIO_REINIT_FAIL"] = 1213] = "ERR_ADM_IOS_VPIO_REINIT_FAIL";
        /** 1214: Fails to re-start up the Audio Unit, possibly because the audio
         * session category is not compatible with the settings of the Audio Unit.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_VPIO_RESTART_FAIL"] = 1214] = "ERR_ADM_IOS_VPIO_RESTART_FAIL";
        /// @cond
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_SET_RENDER_CALLBACK_FAIL"] = 1219] = "ERR_ADM_IOS_SET_RENDER_CALLBACK_FAIL";
        /// @endcond
        /** **DEPRECATED** */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_IOS_SESSION_SAMPLERATR_ZERO"] = 1221] = "ERR_ADM_IOS_SESSION_SAMPLERATR_ZERO";
        /** 1301: Audio device module: An audio driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_INIT"] = 1301] = "ERR_ADM_WIN_CORE_INIT";
        /** 1303: Audio device module: A recording driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_INIT_RECORDING"] = 1303] = "ERR_ADM_WIN_CORE_INIT_RECORDING";
        /** 1306: Audio device module: A playout driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_INIT_PLAYOUT"] = 1306] = "ERR_ADM_WIN_CORE_INIT_PLAYOUT";
        /** 1307: Audio device module: No audio device is available. Solutions:
         * Plug in a proper audio device. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_INIT_PLAYOUT_NULL"] = 1307] = "ERR_ADM_WIN_CORE_INIT_PLAYOUT_NULL";
        /** 1309: Audio device module: An audio driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_START_RECORDING"] = 1309] = "ERR_ADM_WIN_CORE_START_RECORDING";
        /** 1311: Audio device module: Insufficient system memory or poor device
         * performance. Solutions: Reboot the system or replace the device.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_CREATE_REC_THREAD"] = 1311] = "ERR_ADM_WIN_CORE_CREATE_REC_THREAD";
        /** 1314: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_CAPTURE_NOT_STARTUP"] = 1314] = "ERR_ADM_WIN_CORE_CAPTURE_NOT_STARTUP";
        /** 1319: Audio device module: Insufficient system memory or poor device
         * performance. Solutions: Reboot the system or replace the device. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_CREATE_RENDER_THREAD"] = 1319] = "ERR_ADM_WIN_CORE_CREATE_RENDER_THREAD";
        /** 1320: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Replace the device. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_RENDER_NOT_STARTUP"] = 1320] = "ERR_ADM_WIN_CORE_RENDER_NOT_STARTUP";
        /** 1322: Audio device module: No audio sampling device is available.
         * Solutions: Plug in a proper recording device. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_NO_RECORDING_DEVICE"] = 1322] = "ERR_ADM_WIN_CORE_NO_RECORDING_DEVICE";
        /** 1323: Audio device module: No audio playout device is available.
         * Solutions: Plug in a proper playback device.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_CORE_NO_PLAYOUT_DEVICE"] = 1323] = "ERR_ADM_WIN_CORE_NO_PLAYOUT_DEVICE";
        /** 1351: Audio device module: An audio driver abnormality or a
         * compatibility issue occurs. Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_INIT"] = 1351] = "ERR_ADM_WIN_WAVE_INIT";
        /** 1353: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_INIT_RECORDING"] = 1353] = "ERR_ADM_WIN_WAVE_INIT_RECORDING";
        /** 1354: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_INIT_MICROPHONE"] = 1354] = "ERR_ADM_WIN_WAVE_INIT_MICROPHONE";
        /** 1355: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_INIT_PLAYOUT"] = 1355] = "ERR_ADM_WIN_WAVE_INIT_PLAYOUT";
        /** 1356: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_INIT_SPEAKER"] = 1356] = "ERR_ADM_WIN_WAVE_INIT_SPEAKER";
        /** 1357: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_START_RECORDING"] = 1357] = "ERR_ADM_WIN_WAVE_START_RECORDING";
        /** 1358: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver.*/
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_WIN_WAVE_START_PLAYOUT"] = 1358] = "ERR_ADM_WIN_WAVE_START_PLAYOUT";
        /** 1359: Audio Device Module: No recording device exists.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_NO_RECORDING_DEVICE"] = 1359] = "ERR_ADM_NO_RECORDING_DEVICE";
        /** 1360: Audio Device Module: No playback device exists.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_ADM_NO_PLAYOUT_DEVICE"] = 1360] = "ERR_ADM_NO_PLAYOUT_DEVICE";
        // VDM error code starts from 1500
        /** 1501: Video Device Module: The camera is unauthorized.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VDM_CAMERA_NOT_AUTHORIZED"] = 1501] = "ERR_VDM_CAMERA_NOT_AUTHORIZED";
        // VDM error code starts from 1500
        /** **DEPRECATED** 1502: Video Device Module: The camera in use.

         Deprecated as of v2.4.1. Use LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY(3) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VDM_WIN_DEVICE_IN_USE"] = 1502] = "ERR_VDM_WIN_DEVICE_IN_USE";
        // VCM error code starts from 1600
        /** 1600: Video Device Module: An unknown error occurs.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VCM_UNKNOWN_ERROR"] = 1600] = "ERR_VCM_UNKNOWN_ERROR";
        /** 1601: Video Device Module: An error occurs in initializing the video encoder.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VCM_ENCODER_INIT_ERROR"] = 1601] = "ERR_VCM_ENCODER_INIT_ERROR";
        /** 1602: Video Device Module: An error occurs in encoding.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VCM_ENCODER_ENCODE_ERROR"] = 1602] = "ERR_VCM_ENCODER_ENCODE_ERROR";
        /** 1603: Video Device Module: An error occurs in setting the video encoder.
         */
        ERROR_CODE_TYPE[ERROR_CODE_TYPE["ERR_VCM_ENCODER_SET_ERROR"] = 1603] = "ERR_VCM_ENCODER_SET_ERROR";
    })(ERROR_CODE_TYPE = agora.ERROR_CODE_TYPE || (agora.ERROR_CODE_TYPE = {}));
    /** The contrast level, used with the @p lightening parameter.
     */
    var LIGHTENING_CONTRAST_LEVEL;
    (function (LIGHTENING_CONTRAST_LEVEL) {
        /** Low contrast level. */
        LIGHTENING_CONTRAST_LEVEL[LIGHTENING_CONTRAST_LEVEL["LIGHTENING_CONTRAST_LOW"] = 0] = "LIGHTENING_CONTRAST_LOW";
        /** (Default) Normal contrast level. */
        LIGHTENING_CONTRAST_LEVEL[LIGHTENING_CONTRAST_LEVEL["LIGHTENING_CONTRAST_NORMAL"] = 1] = "LIGHTENING_CONTRAST_NORMAL";
        /** High contrast level. */
        LIGHTENING_CONTRAST_LEVEL[LIGHTENING_CONTRAST_LEVEL["LIGHTENING_CONTRAST_HIGH"] = 2] = "LIGHTENING_CONTRAST_HIGH";
    })(LIGHTENING_CONTRAST_LEVEL = agora.LIGHTENING_CONTRAST_LEVEL || (agora.LIGHTENING_CONTRAST_LEVEL = {}));
    /** Output log filter level. */
    var LOG_FILTER_TYPE;
    (function (LOG_FILTER_TYPE) {
        /** 0: Do not output any log information. */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_OFF"] = 0] = "LOG_FILTER_OFF";
        /** 0x080f: Output all log information.
         Set your log filter as debug if you want to get the most complete log file.      */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_DEBUG"] = 2063] = "LOG_FILTER_DEBUG";
        /** 0x000f: Output CRITICAL, ERROR, WARNING, and INFO level log information.
         We recommend setting your log filter as this level.
         */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_INFO"] = 15] = "LOG_FILTER_INFO";
        /** 0x000e: Outputs CRITICAL, ERROR, and WARNING level log information.
         */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_WARN"] = 14] = "LOG_FILTER_WARN";
        /** 0x000c: Outputs CRITICAL and ERROR level log information. */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_ERROR"] = 12] = "LOG_FILTER_ERROR";
        /** 0x0008: Outputs CRITICAL level log information. */
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_CRITICAL"] = 8] = "LOG_FILTER_CRITICAL";
        /// @cond
        LOG_FILTER_TYPE[LOG_FILTER_TYPE["LOG_FILTER_MASK"] = 2063] = "LOG_FILTER_MASK";
        /// @endcond
    })(LOG_FILTER_TYPE = agora.LOG_FILTER_TYPE || (agora.LOG_FILTER_TYPE = {}));
    /** Metadata type of the observer.
     @note We only support video metadata for now.
     */
    var METADATA_TYPE;
    (function (METADATA_TYPE) {
        /** -1: the metadata type is unknown.
         */
        METADATA_TYPE[METADATA_TYPE["UNKNOWN_METADATA"] = -1] = "UNKNOWN_METADATA";
        /** 0: the metadata type is video.
         */
        METADATA_TYPE[METADATA_TYPE["VIDEO_METADATA"] = 0] = "VIDEO_METADATA";
    })(METADATA_TYPE = agora.METADATA_TYPE || (agora.METADATA_TYPE = {}));
    /** The video pixel format.
     */
    var VIDEO_PIXEL_FORMAT;
    (function (VIDEO_PIXEL_FORMAT) {
        /** 0: The video pixel format is unknown.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_UNKNOWN"] = 0] = "VIDEO_PIXEL_UNKNOWN";
        /** 1: The video pixel format is I420.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_I420"] = 1] = "VIDEO_PIXEL_I420";
        /** 2: The video pixel format is BGRA.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_BGRA"] = 2] = "VIDEO_PIXEL_BGRA";
        /** 3: The video pixel format is NV21.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_NV21"] = 3] = "VIDEO_PIXEL_NV21";
        /** 4: The video pixel format is RGBA.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_RGBA"] = 4] = "VIDEO_PIXEL_RGBA";
        /** 5: The video pixel format is IMC2.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_IMC2"] = 5] = "VIDEO_PIXEL_IMC2";
        /** 7: The video pixel format is ARGB.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_ARGB"] = 7] = "VIDEO_PIXEL_ARGB";
        /** 8: The video pixel format is NV12.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_NV12"] = 8] = "VIDEO_PIXEL_NV12";
        /** 16: The video pixel format is I422.
         */
        VIDEO_PIXEL_FORMAT[VIDEO_PIXEL_FORMAT["VIDEO_PIXEL_I422"] = 16] = "VIDEO_PIXEL_I422";
    })(VIDEO_PIXEL_FORMAT = agora.VIDEO_PIXEL_FORMAT || (agora.VIDEO_PIXEL_FORMAT = {}));
    /** Warning code.
     */
    var WARN_CODE_TYPE;
    (function (WARN_CODE_TYPE) {
        /** 8: The specified view is invalid. Specify a view when using the video call function.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_INVALID_VIEW"] = 8] = "WARN_INVALID_VIEW";
        /** 16: Failed to initialize the video function, possibly caused by a lack of resources. The users cannot see the video while the voice communication is not affected.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_INIT_VIDEO"] = 16] = "WARN_INIT_VIDEO";
        /** 20: The request is pending, usually due to some module not being ready, and the SDK postponed processing the request.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_PENDING"] = 20] = "WARN_PENDING";
        /** 103: No channel resources are available. Maybe because the server cannot allocate any channel resource.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_NO_AVAILABLE_CHANNEL"] = 103] = "WARN_NO_AVAILABLE_CHANNEL";
        /** 104: A timeout occurs when looking up the channel. When joining a channel, the SDK looks up the specified channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_LOOKUP_CHANNEL_TIMEOUT"] = 104] = "WARN_LOOKUP_CHANNEL_TIMEOUT";
        /** **DEPRECATED** 105: The server rejects the request to look up the channel. The server cannot process this request or the request is illegal.

         Deprecated as of v2.4.1. Use CONNECTION_CHANGED_REJECTED_BY_SERVER(10) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_LOOKUP_CHANNEL_REJECTED"] = 105] = "WARN_LOOKUP_CHANNEL_REJECTED";
        /** 106: A timeout occurs when opening the channel. Once the specific channel is found, the SDK opens the channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_OPEN_CHANNEL_TIMEOUT"] = 106] = "WARN_OPEN_CHANNEL_TIMEOUT";
        /** 107: The server rejects the request to open the channel. The server cannot process this request or the request is illegal.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_OPEN_CHANNEL_REJECTED"] = 107] = "WARN_OPEN_CHANNEL_REJECTED";
        // sdk: 100~1000
        /** 111: A timeout occurs when switching to the live video.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_SWITCH_LIVE_VIDEO_TIMEOUT"] = 111] = "WARN_SWITCH_LIVE_VIDEO_TIMEOUT";
        /** 118: A timeout occurs when setting the client role in the live interactive streaming profile.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_SET_CLIENT_ROLE_TIMEOUT"] = 118] = "WARN_SET_CLIENT_ROLE_TIMEOUT";
        /** 121: The ticket to open the channel is invalid.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_OPEN_CHANNEL_INVALID_TICKET"] = 121] = "WARN_OPEN_CHANNEL_INVALID_TICKET";
        /** 122: Try connecting to another server.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_OPEN_CHANNEL_TRY_NEXT_VOS"] = 122] = "WARN_OPEN_CHANNEL_TRY_NEXT_VOS";
        /** 131: The channel connection cannot be recovered. */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_CHANNEL_CONNECTION_UNRECOVERABLE"] = 131] = "WARN_CHANNEL_CONNECTION_UNRECOVERABLE";
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_CHANNEL_CONNECTION_IP_CHANGED"] = 132] = "WARN_CHANNEL_CONNECTION_IP_CHANGED";
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_CHANNEL_CONNECTION_PORT_CHANGED"] = 133] = "WARN_CHANNEL_CONNECTION_PORT_CHANGED";
        /** 701: An error occurs in opening the audio mixing file.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_AUDIO_MIXING_OPEN_ERROR"] = 701] = "WARN_AUDIO_MIXING_OPEN_ERROR";
        /** 1014: Audio Device Module: A warning occurs in the playback device.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RUNTIME_PLAYOUT_WARNING"] = 1014] = "WARN_ADM_RUNTIME_PLAYOUT_WARNING";
        /** 1016: Audio Device Module: a warning occurs in the recording device.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RUNTIME_RECORDING_WARNING"] = 1016] = "WARN_ADM_RUNTIME_RECORDING_WARNING";
        /** 1019: Audio Device Module: no valid audio data is recorded.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RECORD_AUDIO_SILENCE"] = 1019] = "WARN_ADM_RECORD_AUDIO_SILENCE";
        /** 1020: Audio device module: The audio playback frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_PLAYOUT_MALFUNCTION"] = 1020] = "WARN_ADM_PLAYOUT_MALFUNCTION";
        /** 1021: Audio device module: the audio recording frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RECORD_MALFUNCTION"] = 1021] = "WARN_ADM_RECORD_MALFUNCTION";
        /** 1025: The audio playback or recording is interrupted by system events (such as a phone call).
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_CALL_INTERRUPTION"] = 1025] = "WARN_ADM_CALL_INTERRUPTION";
        /** 1029: During a call, the audio session category should be set to
         * AVAudioSessionCategoryPlayAndRecord, and RtcEngine monitors this value.
         * If the audio session category is set to other values, this warning code
         * is triggered and RtcEngine will forcefully set it back to
         * AVAudioSessionCategoryPlayAndRecord.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_IOS_CATEGORY_NOT_PLAYANDRECORD"] = 1029] = "WARN_ADM_IOS_CATEGORY_NOT_PLAYANDRECORD";
        /** 1031: Audio Device Module: The recorded audio voice is too low.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RECORD_AUDIO_LOWLEVEL"] = 1031] = "WARN_ADM_RECORD_AUDIO_LOWLEVEL";
        /** 1032: Audio Device Module: The playback audio voice is too low.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_PLAYOUT_AUDIO_LOWLEVEL"] = 1032] = "WARN_ADM_PLAYOUT_AUDIO_LOWLEVEL";
        /** 1033: Audio device module: The audio recording device is occupied.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_RECORD_AUDIO_IS_ACTIVE"] = 1033] = "WARN_ADM_RECORD_AUDIO_IS_ACTIVE";
        /** 1040: Audio device module: An exception occurs with the audio drive.
         * Solutions:
         * - Disable or re-enable the audio device.
         * - Re-enable your device.
         * - Update the sound card drive.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_WINDOWS_NO_DATA_READY_EVENT"] = 1040] = "WARN_ADM_WINDOWS_NO_DATA_READY_EVENT";
        /** 1042: Audio device module: The audio recording device is different from the audio playback device,
         * which may cause echoes problem. Agora recommends using the same audio device to record and playback
         * audio.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_INCONSISTENT_AUDIO_DEVICE"] = 1042] = "WARN_ADM_INCONSISTENT_AUDIO_DEVICE";
        /** 1051: (Communication profile only) Audio processing module: A howling sound is detected when recording the audio data.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_APM_HOWLING"] = 1051] = "WARN_APM_HOWLING";
        /** 1052: Audio Device Module: The device is in the glitch state.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_GLITCH_STATE"] = 1052] = "WARN_ADM_GLITCH_STATE";
        /** 1053: Audio Processing Module: A residual echo is detected, which may be caused by the belated scheduling of system threads or the signal overflow.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_APM_RESIDUAL_ECHO"] = 1053] = "WARN_APM_RESIDUAL_ECHO";
        /// @cond
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_WIN_CORE_NO_RECORDING_DEVICE"] = 1322] = "WARN_ADM_WIN_CORE_NO_RECORDING_DEVICE";
        /// @endcond
        /** 1323: Audio device module: No available playback device.
         * Solution: Plug in the audio device.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_WIN_CORE_NO_PLAYOUT_DEVICE"] = 1323] = "WARN_ADM_WIN_CORE_NO_PLAYOUT_DEVICE";
        /** Audio device module: The capture device is released improperly.
         * Solutions:
         * - Disable or re-enable the audio device.
         * - Re-enable your device.
         * - Update the sound card drive.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_ADM_WIN_CORE_IMPROPER_CAPTURE_RELEASE"] = 1324] = "WARN_ADM_WIN_CORE_IMPROPER_CAPTURE_RELEASE";
        /** 1610: Super-resolution warning: The original video dimensions of the remote user exceed 640 * 480.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_SUPER_RESOLUTION_STREAM_OVER_LIMITATION"] = 1610] = "WARN_SUPER_RESOLUTION_STREAM_OVER_LIMITATION";
        /** 1611: Super-resolution warning: Another user is using super resolution.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_SUPER_RESOLUTION_USER_COUNT_OVER_LIMITATION"] = 1611] = "WARN_SUPER_RESOLUTION_USER_COUNT_OVER_LIMITATION";
        /** 1612: The device is not supported.
         */
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_SUPER_RESOLUTION_DEVICE_NOT_SUPPORTED"] = 1612] = "WARN_SUPER_RESOLUTION_DEVICE_NOT_SUPPORTED";
        /// @cond
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_RTM_LOGIN_TIMEOUT"] = 2005] = "WARN_RTM_LOGIN_TIMEOUT";
        WARN_CODE_TYPE[WARN_CODE_TYPE["WARN_RTM_KEEP_ALIVE_TIMEOUT"] = 2009] = "WARN_RTM_KEEP_ALIVE_TIMEOUT";
        /// @endcond
    })(WARN_CODE_TYPE = agora.WARN_CODE_TYPE || (agora.WARN_CODE_TYPE = {}));
    /**
     * Video dimensions.
     */
    var VideoDimensions = /** @class */ (function () {
        function VideoDimensions(width, height) {
            if (width === void 0) { width = 640; }
            if (height === void 0) { height = 480; }
            this.width = width;
            this.height = height;
        }
        return VideoDimensions;
    }());
    agora.VideoDimensions = VideoDimensions;
    /** Video encoder configurations.
     */
    var VideoEncoderConfiguration = /** @class */ (function () {
        function VideoEncoderConfiguration(dimensions, frameRate, minFrameRate, bitrate, minBitrate, orientationMode, degradationPreference, mirrorMode) {
            if (dimensions === void 0) { dimensions = new VideoDimensions(); }
            if (frameRate === void 0) { frameRate = FRAME_RATE.FRAME_RATE_FPS_15; }
            if (minFrameRate === void 0) { minFrameRate = -1; }
            if (bitrate === void 0) { bitrate = STANDARD_BITRATE; }
            if (minBitrate === void 0) { minBitrate = DEFAULT_MIN_BITRATE; }
            if (orientationMode === void 0) { orientationMode = ORIENTATION_MODE.ORIENTATION_MODE_ADAPTIVE; }
            if (degradationPreference === void 0) { degradationPreference = DEGRADATION_PREFERENCE.MAINTAIN_QUALITY; }
            if (mirrorMode === void 0) { mirrorMode = VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_AUTO; }
            this.dimensions = dimensions;
            this.frameRate = frameRate;
            this.minFrameRate = minFrameRate;
            this.bitrate = bitrate;
            this.minBitrate = minBitrate;
            this.orientationMode = orientationMode;
            this.degradationPreference = degradationPreference;
            this.mirrorMode = mirrorMode;
        }
        return VideoEncoderConfiguration;
    }());
    agora.VideoEncoderConfiguration = VideoEncoderConfiguration;
    /** The video and audio properties of the user displaying the video in the CDN live. Agora supports a maximum of 17 transcoding users in a CDN streaming channel.
     */
    var TranscodingUser = /** @class */ (function () {
        function TranscodingUser(uid, x, y, width, height, zOrder, alpha, audioChannel) {
            if (alpha === void 0) { alpha = 1.0; }
            this.uid = uid;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.zOrder = zOrder;
            this.alpha = alpha;
            this.audioChannel = audioChannel;
        }
        return TranscodingUser;
    }());
    agora.TranscodingUser = TranscodingUser;
    /** Image properties.

     The properties of the watermark and background images.
     */
    var RtcImage = /** @class */ (function () {
        function RtcImage(url, x, y, width, height) {
            this.url = url;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return RtcImage;
    }());
    agora.RtcImage = RtcImage;
    /** The configuration for advanced features of the RTMP streaming with transcoding.
     */
    var LiveStreamAdvancedFeature = /** @class */ (function () {
        function LiveStreamAdvancedFeature(featureName, opened) {
            this.featureName = featureName;
            this.opened = opened;
        }
        /** The advanced feature for high-quality video with a lower bitrate. */
        LiveStreamAdvancedFeature.LBHQ = "lbhq";
        /** The advanced feature for the optimized video encoder. */
        LiveStreamAdvancedFeature.VEO = "veo";
        return LiveStreamAdvancedFeature;
    }());
    agora.LiveStreamAdvancedFeature = LiveStreamAdvancedFeature;
    /** A struct for managing CDN live audio/video transcoding settings.
     */
    var LiveTranscoding = /** @class */ (function () {
        function LiveTranscoding(width, height, videoBitrate, videoFramerate, lowLatency, videoGop, videoCodecProfile, backgroundColor, userCount, transcodingUsers, transcodingExtraInfo, metadata, watermark, backgroundImage, audioSampleRate, audioBitrate, audioChannels, audioCodecProfile, advancedFeatures, advancedFeatureCount) {
            if (width === void 0) { width = 360; }
            if (height === void 0) { height = 640; }
            if (videoBitrate === void 0) { videoBitrate = 400; }
            if (videoFramerate === void 0) { videoFramerate = 15; }
            if (lowLatency === void 0) { lowLatency = false; }
            if (videoGop === void 0) { videoGop = 30; }
            if (videoCodecProfile === void 0) { videoCodecProfile = VIDEO_CODEC_PROFILE_TYPE.VIDEO_CODEC_PROFILE_HIGH; }
            if (backgroundColor === void 0) { backgroundColor = 0x000000; }
            if (userCount === void 0) { userCount = 0; }
            if (audioSampleRate === void 0) { audioSampleRate = AUDIO_SAMPLE_RATE_TYPE.AUDIO_SAMPLE_RATE_48000; }
            if (audioBitrate === void 0) { audioBitrate = 48; }
            if (audioChannels === void 0) { audioChannels = 1; }
            if (audioCodecProfile === void 0) { audioCodecProfile = AUDIO_CODEC_PROFILE_TYPE.AUDIO_CODEC_PROFILE_LC_AAC; }
            if (advancedFeatureCount === void 0) { advancedFeatureCount = 0; }
            this.width = width;
            this.height = height;
            this.videoBitrate = videoBitrate;
            this.videoFramerate = videoFramerate;
            this.lowLatency = lowLatency;
            this.videoGop = videoGop;
            this.videoCodecProfile = videoCodecProfile;
            this.backgroundColor = backgroundColor;
            this.userCount = userCount;
            this.transcodingUsers = transcodingUsers;
            this.transcodingExtraInfo = transcodingExtraInfo;
            this.metadata = metadata;
            this.watermark = watermark;
            this.backgroundImage = backgroundImage;
            this.audioSampleRate = audioSampleRate;
            this.audioBitrate = audioBitrate;
            this.audioChannels = audioChannels;
            this.audioCodecProfile = audioCodecProfile;
            this.advancedFeatures = advancedFeatures;
            this.advancedFeatureCount = advancedFeatureCount;
        }
        return LiveTranscoding;
    }());
    agora.LiveTranscoding = LiveTranscoding;
    /** Camera capturer configuration.
     */
    var CameraCapturerConfiguration = /** @class */ (function () {
        function CameraCapturerConfiguration(preference, cameraDirection) {
            this.preference = preference;
            this.cameraDirection = cameraDirection;
        }
        return CameraCapturerConfiguration;
    }());
    agora.CameraCapturerConfiguration = CameraCapturerConfiguration;
    /** Configuration of the injected media stream.
     */
    var InjectStreamConfig = /** @class */ (function () {
        function InjectStreamConfig(width, height, videoGop, videoFramerate, videoBitrate, audioSampleRate, audioBitrate, audioChannels) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (videoGop === void 0) { videoGop = 30; }
            if (videoFramerate === void 0) { videoFramerate = 15; }
            if (videoBitrate === void 0) { videoBitrate = 400; }
            if (audioSampleRate === void 0) { audioSampleRate = AUDIO_SAMPLE_RATE_TYPE.AUDIO_SAMPLE_RATE_48000; }
            if (audioBitrate === void 0) { audioBitrate = 48; }
            if (audioChannels === void 0) { audioChannels = 1; }
            this.width = width;
            this.height = height;
            this.videoGop = videoGop;
            this.videoFramerate = videoFramerate;
            this.videoBitrate = videoBitrate;
            this.audioSampleRate = audioSampleRate;
            this.audioBitrate = audioBitrate;
            this.audioChannels = audioChannels;
        }
        return InjectStreamConfig;
    }());
    agora.InjectStreamConfig = InjectStreamConfig;
    /** The definition of ChannelMediaInfo.
     */
    var ChannelMediaInfo = /** @class */ (function () {
        function ChannelMediaInfo(channelName, token, uid) {
            this.channelName = channelName;
            this.token = token;
            this.uid = uid;
        }
        return ChannelMediaInfo;
    }());
    agora.ChannelMediaInfo = ChannelMediaInfo;
    /** The definition of ChannelMediaRelayConfiguration.
     */
    var ChannelMediaRelayConfiguration = /** @class */ (function () {
        function ChannelMediaRelayConfiguration(srcInfo, destInfos, destCount) {
            this.srcInfo = srcInfo;
            this.destInfos = destInfos;
            this.destCount = destCount;
        }
        return ChannelMediaRelayConfiguration;
    }());
    agora.ChannelMediaRelayConfiguration = ChannelMediaRelayConfiguration;
    /** The relative location of the region to the screen or window.
     */
    var Rectangle = /** @class */ (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return Rectangle;
    }());
    agora.Rectangle = Rectangle;
    /**  **DEPRECATED** Definition of the rectangular region. */
    var Rect = /** @class */ (function () {
        function Rect(top, left, bottom, right) {
            if (top === void 0) { top = 0; }
            if (left === void 0) { left = 0; }
            if (bottom === void 0) { bottom = 0; }
            if (right === void 0) { right = 0; }
            this.top = top;
            this.left = left;
            this.bottom = bottom;
            this.right = right;
        }
        return Rect;
    }());
    agora.Rect = Rect;
    /** The options of the watermark image to be added. */
    var WatermarkOptions = /** @class */ (function () {
        function WatermarkOptions(visibleInPreview, positionInLandscapeMode, positionInPortraitMode) {
            if (visibleInPreview === void 0) { visibleInPreview = true; }
            if (positionInLandscapeMode === void 0) { positionInLandscapeMode = new Rectangle(); }
            if (positionInPortraitMode === void 0) { positionInPortraitMode = new Rectangle(); }
            this.visibleInPreview = visibleInPreview;
            this.positionInLandscapeMode = positionInLandscapeMode;
            this.positionInPortraitMode = positionInPortraitMode;
        }
        return WatermarkOptions;
    }());
    agora.WatermarkOptions = WatermarkOptions;
    /** Screen sharing encoding parameters.
     */
    var ScreenCaptureParameters = /** @class */ (function () {
        function ScreenCaptureParameters(dimensions, frameRate, bitrate, captureMouseCursor, windowFocus, excludeWindowList, excludeWindowCount) {
            if (dimensions === void 0) { dimensions = new VideoDimensions(1920, 1080); }
            if (frameRate === void 0) { frameRate = 5; }
            if (bitrate === void 0) { bitrate = STANDARD_BITRATE; }
            if (captureMouseCursor === void 0) { captureMouseCursor = true; }
            if (windowFocus === void 0) { windowFocus = false; }
            if (excludeWindowCount === void 0) { excludeWindowCount = 0; }
            this.dimensions = dimensions;
            this.frameRate = frameRate;
            this.bitrate = bitrate;
            this.captureMouseCursor = captureMouseCursor;
            this.windowFocus = windowFocus;
            this.excludeWindowList = excludeWindowList;
            this.excludeWindowCount = excludeWindowCount;
        }
        return ScreenCaptureParameters;
    }());
    agora.ScreenCaptureParameters = ScreenCaptureParameters;
    /** Video display settings of the VideoCanvas class.
     */
    var VideoCanvas = /** @class */ (function () {
        function VideoCanvas(view, renderMode, channelId, uid, priv, mirrorMode) {
            if (renderMode === void 0) { renderMode = RENDER_MODE_TYPE.RENDER_MODE_HIDDEN; }
            if (uid === void 0) { uid = 0; }
            if (mirrorMode === void 0) { mirrorMode = VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_AUTO; }
            this.view = view;
            this.renderMode = renderMode;
            this.channelId = channelId;
            this.uid = uid;
            this.priv = priv;
            this.mirrorMode = mirrorMode;
        }
        return VideoCanvas;
    }());
    agora.VideoCanvas = VideoCanvas;
    /** Image enhancement options.
     */
    var BeautyOptions = /** @class */ (function () {
        function BeautyOptions(lighteningContrastLevel, lighteningLevel, smoothnessLevel, rednessLevel) {
            if (lighteningContrastLevel === void 0) { lighteningContrastLevel = LIGHTENING_CONTRAST_LEVEL.LIGHTENING_CONTRAST_NORMAL; }
            if (lighteningLevel === void 0) { lighteningLevel = 0; }
            if (smoothnessLevel === void 0) { smoothnessLevel = 0; }
            if (rednessLevel === void 0) { rednessLevel = 0; }
            this.lighteningContrastLevel = lighteningContrastLevel;
            this.lighteningLevel = lighteningLevel;
            this.smoothnessLevel = smoothnessLevel;
            this.rednessLevel = rednessLevel;
        }
        return BeautyOptions;
    }());
    agora.BeautyOptions = BeautyOptions;
    /** Configurations of built-in encryption schemas. */
    var EncryptionConfig = /** @class */ (function () {
        function EncryptionConfig(encryptionMode, encryptionKey) {
            if (encryptionMode === void 0) { encryptionMode = ENCRYPTION_MODE.AES_128_XTS; }
            this.encryptionMode = encryptionMode;
            this.encryptionKey = encryptionKey;
        }
        return EncryptionConfig;
    }());
    agora.EncryptionConfig = EncryptionConfig;
    /** The channel media options. */
    var ChannelMediaOptions = /** @class */ (function () {
        function ChannelMediaOptions(autoSubscribeAudio, autoSubscribeVideo) {
            if (autoSubscribeAudio === void 0) { autoSubscribeAudio = true; }
            if (autoSubscribeVideo === void 0) { autoSubscribeVideo = true; }
            this.autoSubscribeAudio = autoSubscribeAudio;
            this.autoSubscribeVideo = autoSubscribeVideo;
        }
        return ChannelMediaOptions;
    }());
    agora.ChannelMediaOptions = ChannelMediaOptions;
    var Metadata = /** @class */ (function () {
        function Metadata(uid, size, buffer, timeStampMs) {
            this.uid = uid;
            this.size = size;
            this.buffer = buffer;
            this.timeStampMs = timeStampMs;
        }
        return Metadata;
    }());
    agora.Metadata = Metadata;
})(agora || (agora = {}));
window.agora = agora;
