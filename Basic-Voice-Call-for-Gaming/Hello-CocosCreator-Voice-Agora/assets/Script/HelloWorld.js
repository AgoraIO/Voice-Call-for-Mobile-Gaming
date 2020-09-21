cc.Class({
    extends: cc.Component,

    properties: {
        langLabelSetup1PlaceHolder: {
            default: null,
            type: cc.Label
        },

        langLabelSetup1BtnLabel: {
            default: null,
            type: cc.Label
        },

        langLabelSetup2PlaceHolder: {
            default: null,
            type: cc.Label
        },

        langLabelSetup2BtnLabel: {
            default: null,
            type: cc.Label
        },

        subscribeRemoteStreamLabel: {
            default: null,
            type: cc.Label
        },

        publishLocalStreamLabel: {
            default: null,
            type: cc.Label
        },

        subscribeOrPublishStreamLabel: {
            default: null,
            type: cc.Label
        },

        btnInit: {
            default: null,
            type: cc.Button
        },

        btnJoin: {
            default: null,
            type: cc.Button
        },

        btnLocal: {
            default: null,
            type: cc.Button
        },

        btnRemote: {
            default: null,
            type: cc.Button
        },

        btnCNLang: {
            default: null,
            type: cc.Button
        },

        btnENLang: {
            default: null,
            type: cc.Button
        },

        ebAppID: {
            default: null,
            type: cc.EditBox
        },

        ebChannel: {
            default: null,
            type: cc.EditBox
        },

        logListView: {
            default: null,
            type: cc.ScrollView
        },

        localSprite: {
            default: null,
            type: cc.Sprite
        },

        disableLocalSprite: {
            default: null,
            type: cc.Sprite
        },

        remoteSprite: {
            default: null,
            type: cc.Sprite
        },

        disableRemoteSprite: {
            default: null,
            type: cc.Sprite
        },

        cnLanguageSprite: {
            default: null,
            type: cc.Sprite
        },

        enLanguageSprite: {
            default: null,
            type: cc.Sprite
        },

        cnLanguageLabel: {
            default: null,
            type: cc.Label
        },

        enLanguageLabel: {
            default: null,
            type: cc.Label
        },

        itemTemplate: {
            default: null,
            type: cc.Node
        },
        joined: false,
        lang: "zh",
        muteRemote: false,
        muteLocal: false,
        logs: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.initAgoraEvents();
        this.btnInit.interactable = true;
        this.btnJoin.interactable = false;
        this.btnLocal.interactable = false;
        this.btnRemote.interactable = false;
        this.ebAppID.interactable = false;
        this.lang = cc.sys.language;
        this.initMultiLang();
        this.updateLangBackground(true);
        this.updateMute();
        this.initAgora();
    },

    initAgoraEvents: function () {
        if (agora) {
            agora.on('join-channel-success', this.onJoinChannelSuccess, this);
            agora.on('leave-channel', this.onLeaveChannel, this);
            agora.on('rejoin-channel-success', this.onRejoinChannelSuccess, this);
            agora.on('warning', this.onWarning, this);
            agora.on('error', this.onError, this);
            agora.on('audio-quality', this.onAudioQuality, this);
            agora.on('audio-volume-indication', this.onAudioVolumeIndication, this);
            agora.on('network-quality', this.onNetworkQuality, this);
            agora.on('user-joined', this.onUserJoined, this);
            agora.on('user-offline', this.onUserOffline, this);
            agora.on('user-mute-audio', this.onUserMuteAudio, this);
            agora.on('audio-routing-changed', this.onAudioRoutingChanged, this);
            agora.on('connection-lost', this.onConnectionLost, this);
            agora.on('connection-interrupted', this.onConnectionInterrupted, this);
            agora.on('request-token', this.onRequestToken, this);
            agora.on('connection-banned', this.onConnectionBanned, this);
            agora.on('client-role-changed', this.onClientRoleChanged, this);
        }
    },

    onDestroy: function () {
        this.uninitAgoraEvents();
    },

    uninitAgoraEvents: function () {
        if (agora) {
            agora.off('join-channel-success', this.onJoinChannelSuccess);
            agora.off('leave-channel', this.onLeaveChannel);
            agora.off('rejoin-channel-success', this.onRejoinChannelSuccess, this);
            agora.off('warning', this.onWarning, this);
            agora.off('error', this.onError, this);
            agora.off('audio-quality', this.onAudioQuality, this);
            agora.off('audio-volume-indication', this.onAudioVolumeIndication, this);
            agora.off('network-quality', this.onNetworkQuality, this);
            agora.off('user-joined', this.onUserJoined, this);
            agora.off('user-offline', this.onUserOffline, this);
            agora.off('user-mute-audio', this.onUserMuteAudio, this);
            agora.off('audio-routing-changed', this.onAudioRoutingChanged, this);
            agora.off('connection-lost', this.onConnectionLost, this);
            agora.off('connection-interrupted', this.onConnectionInterrupted, this);
            agora.off('request-token', this.onRequestToken, this);
            agora.off('connection-banned', this.onConnectionBanned, this);
            agora.off('client-role-changed', this.onClientRoleChanged, this);
        }
    },

    initMultiLang: function () {
        if (this.lang === cc.sys.LANGUAGE_CHINESE) {
            this.langLabelSetup1PlaceHolder.string = "App ID (声网控制台获取)";
            this.langLabelSetup1BtnLabel.string = "初始化 (默认已经初始化)";
            this.langLabelSetup2PlaceHolder.string = "能标识频道的频道名";
            this.langLabelSetup2BtnLabel.string = this.joined ? "离开频道" : "加入频道";
            this.subscribeOrPublishStreamLabel.string = "发布和订阅流";
            this.publishLocalStreamLabel.string = "发布流";
            this.subscribeRemoteStreamLabel.string = "订阅流";
        } else if (this.lang === cc.sys.LANGUAGE_ENGLISH) {
            this.langLabelSetup1PlaceHolder.string = "App ID (Get from Agora Dashboard)";
            this.langLabelSetup1BtnLabel.string = "Initialize (Initialized by default)";
            this.langLabelSetup2PlaceHolder.string = "Channel Name";
            this.langLabelSetup2BtnLabel.string = this.joined ? "Leave Channel" : "Join Channel";
            this.subscribeOrPublishStreamLabel.string = "Publish or subscribe stream";
            this.publishLocalStreamLabel.string = "Publish";
            this.subscribeRemoteStreamLabel.string = "Subscribe";
        }
    },

    initTest: function () {
        agora.bridge.onTestEnd = function () {
            console.log('onTestEnd');
            agora.bridge.compareAndDumpRtcEngineEventTestResult('/sdcard/Android/data/org.cocos2d.demo/case/rtcEngineEventCase.json', '/sdcard/Android/data/org.cocos2d.demo/dump/rtcEngineEventDump.json');
        };
        agora.bridge.beginRtcEngineEventTest('/sdcard/Android/data/org.cocos2d.demo/case/rtcEngineEventCase.json');

        agora.bridge.handleAPICase = function (apiType, paramsJson) {
            if (apiType === -1) {
                agora.bridge.compareAndDumpApiTestResult('/sdcard/Android/data/org.cocos2d.demo/case/apicase.json', '/sdcard/Android/data/org.cocos2d.demo/dump/apiDump.json');
                return;
            }
            console.log('handleAPICase', apiType, paramsJson);
            const params = JSON.parse(paramsJson);
            switch (apiType) {
                case agora.API_TYPE.INITIALIZE: {
                    const {appId, areaCode} = params;
                    agora.initWithAreaCode(appId, areaCode);
                }
                    break;

                case agora.API_TYPE.SET_CHANNEL_PROFILE: {
                    const {profile} = params;
                    agora.setChannelProfile(profile);
                }
                    break;

                case agora.API_TYPE.SET_CLIENT_ROLE: {
                    const {role} = params;
                    agora.setClientRole(role);
                }
                    break;

                case agora.API_TYPE.JOIN_CHANNEL: {
                    const {token, channelId, info, uid} = params;
                    agora.joinChannel(token, channelId, info, uid);
                }
                    break;

                case agora.API_TYPE.SWITCH_CHANNEL: {
                    const {token, channelId} = params;
                    agora.switchChannel(token, channelId);
                }
                    break;

                case agora.API_TYPE.LEAVE_CHANNEL: {
                    agora.leaveChannel();
                }
                    break;

                case agora.API_TYPE.RE_NEW_TOKEN: {
                    const {token} = params;
                    agora.renewToken(token);
                }
                    break;

                case agora.API_TYPE.REGISTER_LOCAL_USER_ACCOUNT: {
                    const {appId, userAccount} = params;
                    agora.registerLocalUserAccount(appId, userAccount);
                }
                    break;

                case agora.API_TYPE.JOIN_CHANNEL_WITH_USER_ACCOUNT: {
                    const {token, channelId, userAccount} = params;
                    agora.joinChannelWithUserAccount(token, channelId, userAccount);
                }
                    break;

                case agora.API_TYPE.START_ECHO_TEST: {
                    agora.startEchoTest();
                }
                    break;

                case agora.API_TYPE.START_ECHO_TEST_2: {
                    const {intervalInSeconds} = params;
                    agora.startEchoTest(intervalInSeconds);
                }
                    break;

                case agora.API_TYPE.STOP_ECHO_TEST: {
                    agora.stopEchoTest();
                }
                    break;

                case agora.API_TYPE.ENABLE_VIDEO: {
                    agora.enableVideo();
                }
                    break;

                case agora.API_TYPE.DISABLE_VIDEO: {
                    agora.disableVideo();
                }
                    break;

                case agora.API_TYPE.SET_VIDEO_PROFILE: {
                    const {profile, swapWidthAndHeight} = params;
                    agora.setVideoProfile(profile, swapWidthAndHeight);
                }
                    break;

                case agora.API_TYPE.SET_VIDEO_ENCODER_CONFIGURATION: {
                    const {config} = params;
                    agora.setVideoEncoderConfiguration(config);
                }
                    break;

                case agora.API_TYPE.SET_CAMERA_CAPTURER_CONFIGURATION: {
                    const {config} = params;
                    agora.setCameraCapturerConfiguration(config);
                }
                    break;

                case agora.API_TYPE.START_PREVIEW: {
                    agora.startPreview();
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_USER_PRIORITY: {
                    const {uid, userPriority} = params;
                    agora.setRemoteUserPriority(uid, userPriority);
                }
                    break;

                case agora.API_TYPE.STOP_PREVIEW: {
                    agora.stopPreview();
                }
                    break;

                case agora.API_TYPE.ENABLE_AUDIO: {
                    agora.enableAudio();
                }
                    break;

                case agora.API_TYPE.ENABLE_LOCAL_AUDIO: {
                    const {enabled} = params;
                    agora.enableLocalAudio(enabled);
                }
                    break;

                case agora.API_TYPE.DISABLE_AUDIO: {
                    agora.disableAudio();
                }
                    break;

                case agora.API_TYPE.SET_AUDIO_PROFILE: {
                    const {profile, scenario} = params;
                    agora.setAudioProfile(profile, scenario);
                }
                    break;

                case agora.API_TYPE.MUTE_LOCAL_AUDIO_STREAM: {
                    const {mute} = params;
                    agora.muteLocalAudioStream(mute);
                }
                    break;

                case agora.API_TYPE.MUTE_ALL_REMOTE_AUDIO_STREAMS: {
                    const {mute} = params;
                    agora.muteAllRemoteAudioStreams(mute);
                }
                    break;

                case agora.API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS: {
                    const {mute} = params;
                    agora.setDefaultMuteAllRemoteAudioStreams(mute);
                }
                    break;

                case agora.API_TYPE.ADJUST_USER_PLAYBACK_SIGNAL_VOLUME: {
                    const {uid, volume} = params;
                    agora.adjustUserPlaybackSignalVolume(uid, volume);
                }
                    break;

                case agora.API_TYPE.MUTE_REMOTE_AUDIO_STREAM: {
                    const {userId, mute} = params;
                    agora.muteRemoteAudioStream(userId, mute);
                }
                    break;

                case agora.API_TYPE.MUTE_LOCAL_VIDEO_STREAM: {
                    const {mute} = params;
                    agora.muteLocalVideoStream(mute);
                }
                    break;

                case agora.API_TYPE.ENABLE_LOCAL_VIDEO: {
                    const {enabled} = params;
                    agora.enableLocalVideo(enabled);
                }
                    break;

                case agora.API_TYPE.MUTE_ALL_REMOTE_VIDEO_STREAMS: {
                    const {mute} = params;
                    agora.muteAllRemoteVideoStreams(mute);
                }
                    break;

                case agora.API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS: {
                    const {mute} = params;
                    agora.setDefaultMuteAllRemoteVideoStreams(mute);
                }
                    break;

                case agora.API_TYPE.MUTE_REMOTE_VIDEO_STREAM: {
                    const {userId, mute} = params;
                    agora.muteRemoteVideoStream(userId, mute);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_VIDEO_STREAM_TYPE: {
                    const {userId, streamType} = params;
                    agora.setRemoteVideoStreamType(userId, streamType);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE: {
                    const {streamType} = params;
                    agora.setRemoteDefaultVideoStreamType(streamType);
                }
                    break;

                case agora.API_TYPE.ENABLE_AUDIO_VOLUME_INDICATION: {
                    const {interval, smooth, report_vad} = params;
                    agora.enableAudioVolumeIndication(interval, smooth, report_vad);
                }
                    break;

                case agora.API_TYPE.START_AUDIO_RECORDING: {
                    const {filePath, quality} = params;
                    agora.startAudioRecording(filePath, quality);
                }
                    break;

                case agora.API_TYPE.START_AUDIO_RECORDING2: {
                    const {filePath, quality, sampleRate} = params;
                    agora.startAudioRecording(filePath, quality, sampleRate);
                }
                    break;

                case agora.API_TYPE.STOP_AUDIO_RECORDING: {
                    agora.stopAudioRecording();
                }
                    break;

                case agora.API_TYPE.ENABLE_FACE_DETECTION: {
                    const {enabled} = params;
                    agora.enableFaceDetection(enabled);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_VOICE_POSITIONN: {
                    const {uid, pan, gain} = params;
                    agora.setRemoteVoicePosition(uid, pan, gain);
                }
                    break;

                case agora.API_TYPE.SET_LOG_FILE: {
                    const {filePath} = params;
                    agora.setLogFile(filePath);
                }
                    break;

                case agora.API_TYPE.SET_LOG_FILTER: {
                    const {filter} = params;
                    agora.setLogFilter(filter);
                }
                    break;

                case agora.API_TYPE.SET_LOG_FILE_SIZE: {
                    const {fileSizeInKBytes} = params;
                    agora.setLogFileSize(fileSizeInKBytes);
                }
                    break;

                case agora.API_TYPE.SET_LOCAL_RENDER_MODE: {
                    const {renderMode} = params;
                    agora.setLocalRenderMode(renderMode);
                }
                    break;

                case agora.API_TYPE.SET_LOCAL_RENDER_MODE_2: {
                    const {renderMode, mirrorMode} = params;
                    agora.setLocalRenderMode(renderMode, mirrorMode);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_RENDER_MODE: {
                    const {userId, renderMode} = params;
                    agora.setRemoteRenderMode(userId, renderMode);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_RENDER_MODE_2: {
                    const {userId, renderMode, mirrorMode} = params;
                    agora.setRemoteRenderMode(userId, renderMode, mirrorMode);
                }
                    break;

                case agora.API_TYPE.SET_LOCAL_VIDEO_MIRROR_MODE: {
                    const {mirrorMode} = params;
                    agora.setLocalVideoMirrorMode(mirrorMode);
                }
                    break;

                case agora.API_TYPE.ENABLE_DUAL_STREAM_MODE: {
                    const {enabled} = params;
                    agora.enableDualStreamMode(enabled);
                }
                    break;

                case agora.API_TYPE.ADJUST_RECORDING_SIGNAL_VOLUME: {
                    const {volume} = params;
                    agora.adjustRecordingSignalVolume(volume);
                }
                    break;

                case agora.API_TYPE.ADJUST_PLAYBACK_SIGNAL_VOLUME: {
                    const {volume} = params;
                    agora.adjustPlaybackSignalVolume(volume);
                }
                    break;

                case agora.API_TYPE.ENABLE_WEB_SDK_INTEROPER_ABILITY: {
                    const {enabled} = params;
                    agora.enableWebSdkInteroperability(enabled);
                }
                    break;

                case agora.API_TYPE.SET_VIDEO_QUALITY_PARAMETERS: {
                    const {preferFrameRateOverImageQuality} = params;
                    agora.setVideoQualityParameters(preferFrameRateOverImageQuality);
                }
                    break;

                case agora.API_TYPE.SET_LOCAL_PUBLISH_FALLBACK_OPTION: {
                    const {option} = params;
                    agora.setLocalPublishFallbackOption(option);
                }
                    break;

                case agora.API_TYPE.SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION: {
                    const {option} = params;
                    agora.setRemoteSubscribeFallbackOption(option);
                }
                    break;

                case agora.API_TYPE.SWITCH_CAMERA: {
                    agora.switchCamera();
                }
                    break;

                case agora.API_TYPE.SWITCH_CAMERA_2: {
                    const {direction} = params;
                    agora.switchCamera(direction);
                }
                    break;

                case agora.API_TYPE.SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE: {
                    const {defaultToSpeaker} = params;
                    agora.setDefaultAudioRouteToSpeakerphone(defaultToSpeaker);
                }
                    break;

                case agora.API_TYPE.SET_ENABLE_SPEAKER_PHONE: {
                    const {speakerOn} = params;
                    agora.setEnableSpeakerphone(speakerOn);
                }
                    break;

                case agora.API_TYPE.ENABLE_IN_EAR_MONITORING: {
                    const {enabled} = params;
                    agora.enableInEarMonitoring(enabled);
                }
                    break;

                case agora.API_TYPE.SET_IN_EAR_MONITORING_VOLUME: {
                    const {volume} = params;
                    agora.setInEarMonitoringVolume(volume);
                }
                    break;

                case agora.API_TYPE.IS_SPEAKER_PHONE_ENABLED: {
                    agora.isSpeakerphoneEnabled();
                }
                    break;

                case agora.API_TYPE.SET_AUDIO_SESSION_OPERATION_RESTRICTION: {
                    // TODO
                    const {restriction} = params;
                    agora.setAudioSessionOperationRestriction(restriction);
                }
                    break;

                case agora.API_TYPE.ENABLE_LOOP_BACK_RECORDING: {
                    // TODO
                    const {enabled, deviceName} = params;
                    agora.enableLoopbackRecording(enabled, deviceName());
                }
                    break;

                case agora.API_TYPE.START_SCREEN_CAPTURE_BY_DISPLAY_ID: {
                    // TODO
                    const {displayId, regionRect, captureParams} = params;
                    agora.startScreenCaptureByDisplayId(displayId, regionRect, captureParams);
                }
                    break;

                case agora.API_TYPE.START_SCREEN_CAPTURE_BY_SCREEN_RECT: {
                    // TODO
                    const {screenRect, regionRect, captureParams} = params;
                    agora.startScreenCaptureByScreenRect(screenRect, regionRect, captureParams);
                }
                    break;

                case agora.API_TYPE.START_SCREEN_CAPTURE_BY_WINDOW_ID: {
                    // TODO
                    const {windowId, regionRect, captureParams} = params;
                    agora.startScreenCaptureByWindowId(windowId, regionRect, captureParams);
                }
                    break;

                case agora.API_TYPE.SET_SCREEN_CAPTURE_CONTENT_HINT: {
                    // TODO
                    const {contentHint} = params;
                    agora.setScreenCaptureContentHint(contentHint);
                }
                    break;

                case agora.API_TYPE.UPDATE_SCREEN_CAPTURE_PARAMETERS: {
                    // TODO
                    const {captureParams} = params;
                    agora.updateScreenCaptureParameters(captureParams);
                }
                    break;

                case agora.API_TYPE.UPDATE_SCREEN_CAPTURE_REGION: {
                    // TODO
                    const {regionRect} = params;
                    agora.updateScreenCaptureRegion(regionRect);
                }
                    break;

                case agora.API_TYPE.STOP_SCREEN_CAPTURE: {
                    // TODO
                    agora.stopScreenCapture();
                }
                    break;

                case agora.API_TYPE.RATE: {
                    const {callId, rating, description} = params;
                    agora.rate(callId, rating, description);
                }
                    break;

                case agora.API_TYPE.COMPLAIN: {
                    const {callId, description} = params;
                    agora.complain(callId, description);
                }
                    break;

                case agora.API_TYPE.ENABLE_LAST_MILE_TEST: {
                    agora.enableLastmileTest();
                }
                    break;

                case agora.API_TYPE.DISABLE_LAST_MILE_TEST: {
                    agora.disableLastmileTest();
                }
                    break;

                case agora.API_TYPE.START_LAST_MILE_PROBE_TEST: {
                    const {config} = params;
                    agora.startLastmileProbeTest(config);
                }
                    break;

                case agora.API_TYPE.STOP_LAST_MILE_PROBE_TEST: {
                    agora.stopLastmileProbeTest();
                }
                    break;

                case agora.API_TYPE.SET_ENCRYPTION_SECTRT: {
                    const {secret} = params;
                    agora.setEncryptionSecret(secret);
                }
                    break;

                case agora.API_TYPE.SET_ENCRYPTION_MODE: {
                    const {encryptionMode} = params;
                    agora.setEncryptionMode(encryptionMode);
                }
                    break;

                case agora.API_TYPE.ADD_PUBLISH_STREAM_URL: {
                    const {url, transcodingEnabled} = params;
                    agora.addPublishStreamUrl(url, transcodingEnabled);
                }
                    break;

                case agora.API_TYPE.REMOVE_PUBLISH_STREAM_URL: {
                    const {url} = params;
                    agora.removePublishStreamUrl(url);
                }
                    break;

                case agora.API_TYPE.SET_LIVE_TRANSCODING: {
                    const {transcoding} = params;
                    agora.setLiveTranscoding(transcoding);
                }
                    break;

                case agora.API_TYPE.ADD_VIDEO_WATER_MARK: {
                    // TODO
                }
                    break;

                case agora.API_TYPE.ADD_VIDEO_WATER_MARK_2: {
                    const {watermarkUrl, options} = params;
                    agora.addVideoWatermark(watermarkUrl, options);
                }
                    break;

                case agora.API_TYPE.CLEAR_VIDEO_WATER_MARKS: {
                    agora.clearVideoWatermarks();
                }
                    break;

                case agora.API_TYPE.SET_BEAUTY_EFFECT_OPTIONS: {
                    const {enabled, options} = params;
                    agora.setBeautyEffectOptions(enabled, options);
                }
                    break;

                case agora.API_TYPE.ADD_INJECT_STREAM_URL: {
                    const {url, config} = params;
                    agora.addInjectStreamUrl(url, config);
                }
                    break;

                case agora.API_TYPE.START_CHANNEL_MEDIA_RELAY: {
                    const {configuration} = params;
                    agora.startChannelMediaRelay(configuration);
                }
                    break;

                case agora.API_TYPE.UPDATE_CHANNEL_MEDIA_RELAY: {
                    const {configuration} = params;
                    agora.updateChannelMediaRelay(configuration);
                }
                    break;

                case agora.API_TYPE.STOP_CHANNEL_MEDIA_RELAY: {
                    agora.stopChannelMediaRelay();
                }
                    break;

                case agora.API_TYPE.REMOVE_INJECT_STREAM_URL: {
                    const {url} = params;
                    agora.removeInjectStreamUrl(url);
                }
                    break;

                case agora.API_TYPE.GET_CONNECTION_STATE: {
                    agora.getConnectionState();
                }
                    break;

                case agora.API_TYPE.SET_PARAMETERS: {
                    const {parameters} = params;
                    agora.setParameters(parameters);
                }
                    break;

                case agora.API_TYPE.SET_PLAYBACK_DEVICE_VOLUME: {
                    // TODO
                    const {volume} = params;
                    agora.setPlaybackDeviceVolume(volume);
                }
                    break;

                case agora.API_TYPE.ENABLE_ENCRYPTION: {
                    const {enable, config} = params;
                    agora.enableEncryption(enable, config);
                }
                    break;

                case agora.API_TYPE.SEND_CUSTOM_REPORT_MESSAGE: {
                    const {id, category, event, label, value} = params;
                    agora.sendCustomReportMessage(id, category, event, label, value);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.START_AUDIO_MIXING: {
                    const {filePath, loopback, replace, cycle} = params;
                    agora.startAudioMixing(filePath, loopback, replace, cycle);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.STOP_AUDIO_MIXING: {
                    agora.stopAudioMixing();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.PAUSE_AUDIO_MIXING: {
                    agora.pauseAudioMixing();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.RESUME_AUDIO_MIXING: {
                    agora.resumeAudioMixing();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_HIGH_QUALITY_AUDIO_PARAMETERS: {
                    const {fullband, stereo, fullBitrate} = params;
                    agora.setHighQualityAudioParameters(fullband, stereo, fullBitrate);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_VOLUME: {
                    const {volume} = params;
                    agora.adjustAudioMixingVolume(volume);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME: {
                    const {volume} = params;
                    agora.adjustAudioMixingPlayoutVolume(volume);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PLAYOUT_VOLUME: {
                    agora.getAudioMixingPlayoutVolume();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PUBLISH_VOLUME: {
                    const {volume} = params;
                    agora.adjustAudioMixingPublishVolume(volume);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PUBLISH_VOLUME: {
                    agora.getAudioMixingPublishVolume();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_DURATION: {
                    agora.getAudioMixingDuration();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_CURRENT_POSITION: {
                    agora.getAudioMixingCurrentPosition();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_POSITION: {
                    const {pos} = params;
                    agora.setAudioMixingPosition(pos);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.GET_EFFECTS_VOLUME: {
                    agora.getEffectsVolume();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_EFFECTS_VOLUME: {
                    const {volume} = params;
                    agora.setEffectsVolume(volume);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_VOLUME_OF_EFFECT: {
                    const {soundId, volume} = params;
                    agora.setVolumeOfEffect(soundId, volume);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.PLAY_EFFECT: {
                    const {soundId, filePath, loopCount, pitch, pan, gain, publish} = params;
                    agora.playEffect(soundId, filePath, loopCount, pitch, pan, gain, publish);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.STOP_EFFECT: {
                    const {soundId} = params;
                    agora.stopEffect(soundId);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.STOP_ALL_EFFECTS: {
                    agora.stopAllEffects();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.PRE_LOAD_EFFECT: {
                    const {soundId, filePath} = params;
                    agora.preloadEffect(soundId, filePath);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.UN_LOAD_EFFECT: {
                    const {soundId} = params;
                    agora.unloadEffect(soundId);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.PAUSE_EFFECT: {
                    const {soundId} = params;
                    agora.pauseEffect(soundId);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.PAUSE_ALL_EFFECTS: {
                    agora.pauseAllEffects();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.RESUME_EFFECT: {
                    const {soundId} = params;
                    agora.resumeEffect(soundId);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.RESUME_ALL_EFFECTS: {
                    agora.resumeAllEffects();
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.ENABLE_SOUND_POSITION_INDICATION: {
                    const {enabled} = params;
                    agora.enableSoundPositionIndication(enabled);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_PITCH: {
                    const {pitch} = params;
                    agora.setLocalVoicePitch(pitch);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_EQUALIZATION: {
                    const {bandFrequency, bandGain} = params;
                    agora.setLocalVoiceEqualization(bandFrequency, bandGain);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB: {
                    const {reverbKey, value} = params;
                    agora.setLocalVoiceReverb(reverbKey, value);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_CHANGER: {
                    const {voiceChanger} = params;
                    agora.setLocalVoiceChanger(voiceChanger);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB_PRESET: {
                    const {reverbPreset} = params;
                    agora.setLocalVoiceReverbPreset(reverbPreset);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_PITCH: {
                    const {pitch} = params;
                    agora.setAudioMixingPitch(pitch);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SOURCE: {
                    const {enabled, sampleRate, channels} = params;
                    agora.setExternalAudioSource(enabled, sampleRate, channels);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SINK: {
                    const {enabled, sampleRate, channels} = params;
                    agora.setExternalAudioSink(enabled, sampleRate, channels);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_RECORDING_AUDIO_FRAME_PARAMETERS: {
                    const {sampleRate, channel, mode, samplesPerCall} = params;
                    agora.setRecordingAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_PLAYBACK_AUDIO_FRAME_PARAMETERS: {
                    const {sampleRate, channel, mode, samplesPerCall} = params;
                    agora.setPlaybackAudioFrameParameters(sampleRate, channel, mode, samplesPerCall);
                }
                    break;

                case agora.API_TYPE_AUDIO_EFFECT.SET_MIXED_AUDIO_FRAME_PARAMETERS: {
                    const {sampleRate, samplesPerCall} = params;
                    agora.setMixedAudioFrameParameters(sampleRate, samplesPerCall);
                }
                    break;

                case agora.API_TYPE.GET_VERSION: {
                    agora.getVersion();
                }
                    break;

                case agora.API_TYPE.GET_ERROR_DESCRIPTION: {
                    const {code} = params;
                    agora.getErrorDescription(code);
                }
                    break;

                case agora.API_TYPE.GET_CALL_ID: {
                    agora.getCallId();
                }
                    break;

                case agora.API_TYPE.GET_USER_INFO_BY_USER_ACCOUNT: {
                    const {userAccount} = params;
                    agora.getUserInfoByUserAccount(userAccount);
                }
                    break;

                case agora.API_TYPE.GET_USER_INFO_BY_UID: {
                    const {uid} = params;
                    agora.getUserInfoByUid(uid);
                }
                    break;

                case agora.API_TYPE.CREATE_DATA_STREAM: {
                    const {streamId, reliable, ordered} = params;
                    agora.createDataStream(streamId, reliable, ordered);
                }
                    break;

                case agora.API_TYPE.SEND_STREAM_MESSAGE: {
                    const {streamId, data, length} = params;
                    const dataBytes = new Uint8Array(new ArrayBuffer(length));
                    for (let i = 0; i < length; i++) {
                        dataBytes[i] = data.charCodeAt(i);
                    }
                    agora.sendStreamMessage(streamId, dataBytes, length);
                }
                    break;

                case agora.API_TYPE.SET_UP_LOCAL_VIDEO: {
                    // TODO
                    const {renderMode, channelId, uid, mirrorMode} = params;
                    agora.setupLocalVideo(videoCanvas);
                }
                    break;

                case agora.API_TYPE.SET_UP_REMOTE_VIDEO: {
                    // TODO
                    const {renderMode, channelId, uid, mirrorMode} = params;
                    agora.setupRemoteVideo(videoCanvas);
                }
                    break;

                case agora.API_TYPE.REGISTER_PACKET_OBSERVER: {
                    // TODO
                }
                    break;

                case agora.API_TYPE.SEND_METADATA: {
                    const {uid, size, buffer, timeStampMs} = params;
                    agora.sendMetadata({uid, size, buffer, timeStampMs});
                }
                    break;

                case agora.API_TYPE.SET_MAX_META_SIZE: {
                    const {size} = params;
                    agora.setMaxMetadataSize(size);
                }
                    break;

                case agora.API_TYPE.REGISTER_MEDIA_META_DATA_OBSERVER: {
                    const {type, useSdkDefault} = params;
                    agora.registerMediaMetadataObserver(null, type);
                }
                    break;

            }
        };
        agora.bridge.beginApiTest('/sdcard/Android/data/org.cocos2d.demo/case/apicase.json');
    },

    initAgora: function () {
        // PLEASE KEEP THIS appId IN SAFE PLACE
        // Get your own App ID at https://docs.agora.io/cn/Interactive%20Gaming/game_c?platform=Cocos%20Creator
        // After you entered the appId, remove ## outside of YOUR_APPID
        var appid = #YOUR_APPID;
        if (appid == "") {
            this.printLog("Please input appid!");
            return;
        }
        agora && agora.init(appid);
        this.initTest();
        this.btnInit.interactable = false;
        this.btnJoin.interactable = true;
        this.ebAppID.string = appid;
        this.ebAppID.enabled = false;

        this.printLog("Step 1: Init Agora Engine");
        this.printLog("Init agora, appid: " + appid);
        this.printCode(`agora && agora.init('${appid}');`);
        this.printLog("Init engine success!");
        this.printLog("\r\n\r\n");
        this.printLog("Step 2: Join Channel");
    },

    // step2: join Channel
    joinChannel: function () {
        if (this.joined) {
            agora && agora.leaveChannel();
            this.printCode(`agora && agora.leaveChannel();`);
        } else {
            var channel = this.ebChannel.string;
            if (channel == "") {
                this.printLog("Please input channel!");
                return;
            }
            agora && agora.joinChannel("", channel, "", 0);
            this.printCode(`agora && agora.joinChannel("", '${channel}', "", 0);`);
        }
    },

    updateMute: function () {
        this.localSprite.node.active = !this.muteLocal;
        this.disableLocalSprite.node.active = this.muteLocal;
        this.remoteSprite.node.active = !this.muteRemote;
        this.disableRemoteSprite.node.active = this.muteRemote;
    },

    btnLocalStream: function () {
        this.muteLocal = !this.muteLocal;
        this.updateMute();
        agora && agora.muteLocalAudioStream(this.muteLocal);
        this.printLog(this.muteLocal ? "mute" : "unmute" + " local audio");
        this.printCode(`agora && agora.muteLocalAudioStream(${this.muteLocal});`);
    },

    btnRemoteStream: function () {
        this.muteRemote = !this.muteRemote;
        this.updateMute();
        agora && agora.muteAllRemoteAudioStreams(this.muteRemote)
        this.printLog(this.muteRemote ? "mute" : "unmute" + " remote audio");
        this.printCode(`agora && agora.muteAllRemoteAudioStreams(${this.muteRemote});`);
    },

    switchLangCN: function () {
        this.lang = cc.sys.LANGUAGE_CHINESE;
        this.initMultiLang();
        this.updateLangBackground(true);
    },

    switchLangEN: function () {
        this.lang = cc.sys.LANGUAGE_ENGLISH;
        this.initMultiLang();
        this.updateLangBackground(false);
    },

    updateLangBackground: function (isCnLanguage) {
        if (isCnLanguage) {
            this.cnLanguageSprite.node.active = true;
            this.enLanguageSprite.node.active = false;
            this.cnLanguageLabel.node.color = new cc.Color(204, 204, 204, 255);
            this.enLanguageLabel.node.color = cc.Color.WHITE;
        } else {
            this.cnLanguageSprite.node.active = false;
            this.enLanguageSprite.node.active = true;
            this.enLanguageLabel.node.color = new cc.Color(204, 204, 204, 255);
            this.cnLanguageLabel.node.color = cc.Color.WHITE;
        }
    },

    exitBtnClick: function () {
        if (cc.sys.isBrowser) {
            cc.game.restart();
        } else if (cc.sys.isNative) {
            cc.game.end();
        }
    },

    printCode: function (code) {
        this.printLog("   ");
        this.printLog("---------- Sample code start ----------");
        this.printLog(code);
        this.printLog("---------- Sample code end   ----------");
        this.printLog("   ");
    },

    printLog: function (info) {
        var item = cc.instantiate(this.itemTemplate);
        this.logListView.content.addChild(item);
        item.getComponent('Item').updateItem(info);
        this.logListView.scrollToBottom(0.1);
    },

    onJoinChannelSuccess: function (channel, uid, elapsed) {
        // agora && agora.muteLocalAudioStream(this.muteLocal);
        // agora && agora.muteAllRemoteAudioStreams(this.muteRemote);
        this.btnLocal.interactable = true;
        this.btnRemote.interactable = true;
        this.joined = true;
        this.initMultiLang();
        this.printLog("Join channel success, channel: " + channel + " uid: " + uid + " elapsed: " + elapsed);
    },

    onLeaveChannel: function (stat) {
        this.printLog("Leave channel success");
        this.btnLocal.interactable = false;
        this.btnRemote.interactable = false;
        this.joined = false;
        this.initMultiLang();
    },

    onRejoinChannelSuccess: function (channel, uid, elapsed) {
        this.printLog("onRejoinChannelSuccess, channel: " + channel + " uid: " + uid + " elapsed: " + elapsed);
    },

    onWarning: function (warn, msg) {
        this.printLog("onWarning, warn: " + warn + " msg: " + msg);
    },

    onError: function (warn, msg) {
        this.printLog("onError, warn: " + warn + " msg: " + msg);
    },

    onAudioQuality: function (uid, quality, delay, lost) {
        cc.log("onAudioQuality, uid: " + uid + " quality: " + quality + " delay: " + delay + " lost: " + lost);
    },

    onAudioVolumeIndication: function (speakers, speakerNumber, totalVolume) {
        this.printLog("[js]onAudioVolumeIndication, speakerNumber: %d, totalVolume: %d!", speakerNumber, totalVolume);
        for (var i = 0; i < speakerNumber; i++) {
            if (speakers[i].uid == 0 && speakerNumber == 1) {
                this.printLog("[js]onAudioVolumeIndication, Local Speaker: [%d], uid: %d, volume: %d", i, speakers[i].uid, speakers[i].volume);
                return;
            } else {
                this.printLog("[js]onAudioVolumeIndication, Remote Speaker: [%d], uid: %d, volume: %d", i, speakers[i].uid, speakers[i].volume);
            }
        }
    },

    onNetworkQuality: function (uid, txQuality, rxQuality) {
        cc.log("onNetworkQuality, uid: " + uid + " txQuality: " + txQuality + " rxQuality: " + rxQuality);
    },

    onUserJoined: function (uid, elapsed) {
        this.printLog("onUserJoined, uid: " + uid + " elapsed: " + elapsed);
    },

    onUserOffline: function (uid, reason) {
        this.printLog("onUserOffline, uid: " + uid + " reason: " + reason);
    },

    onUserMuteAudio: function (uid, muted) {
        this.printLog("onUserMuteAudio, uid: " + uid + " muted: " + muted);
    },

    onAudioRoutingChanged: function (routing) {

    },

    onConnectionLost: function () {
        this.printLog("onConnectionLost");
    },

    onConnectionInterrupted: function () {
        this.printLog("onConnectionInterrupted");
    },

    onRequestToken: function () {
        this.printLog("onRequestToken");
    },

    onConnectionBanned: function () {
        this.printLog("onConnectionBanned");
    },

    onClientRoleChanged: function (oldRole, newRole) {
        this.printLog("onClientRoleChanged");
    },
});
