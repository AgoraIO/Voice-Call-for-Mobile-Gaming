(function () {
    window.agora = new cc.EventTarget();
    agora.startTime = null;
    if ((typeof agoraCreator) !== "undefined") {
        if (agora.agoraCreatorInst == null) agora.agoraCreatorInst = new agoraCreator();
        agora.init = function (appid) {
            agora.agoraCreatorInst.initialize(appid);
            agora.agoraCreatorInst.onJoinChannelSuccess = function (channel, uid, elapsed) {
                agora.startTime = new Date();
                cc.log('Agora(Native platform) service start using time : ' + agora.startTime.toString());
                agora.emit('join-channel-success', channel, uid, elapsed);
            };
            agora.agoraCreatorInst.onRejoinChannelSuccess = function (channel, uid, elapsed) {
                agora.emit('rejoin-channel-success', channel, uid, elapsed);
            };
            agora.agoraCreatorInst.onWarning = function (warn, msg) {
                agora.emit('warning', warn, msg);
            };
            agora.agoraCreatorInst.onError = function (err, msg) {
                agora.emit('error', err, msg);
            };
            agora.agoraCreatorInst.onAudioQuality = function (uid, quality, delay, lost) {
                agora.emit('audio-quality', uid, quality, delay, lost);
            };
            agora.agoraCreatorInst.onAudioVolumeIndication = function (speakers, speakerNumber, totalVolume) {
                agora.emit('audio-volume-indication', speakers, speakerNumber, totalVolume);
            };
            agora.agoraCreatorInst.onLeaveChannel = function (stat) {
                var endTime = new Date();
                cc.log('Agora(Native platform) service stop use time : ' + endTime.toString());
                let usedTime = endTime - agora.startTime;
                cc.log('Agora(Native platform) service used time(s) ： ' + Math.floor(usedTime / 1000));
                agora.emit('leave-channel', stat);
            };
            agora.agoraCreatorInst.onNetworkQuality = function (uid, txQuality, rxQuality) {
                agora.emit('network-quality', uid, txQuality, rxQuality);
            };
            agora.agoraCreatorInst.onUserJoined = function (uid, elapsed) {
                agora.emit('user-joined', uid, elapsed);
            };
            agora.agoraCreatorInst.onUserOffline = function (uid, reason) {
                agora.emit('user-offline', uid, reason);
            };
            agora.agoraCreatorInst.onUserMuteAudio = function (uid, muted) {
                agora.emit('user-mute-audio', uid, muted);
            };
            agora.agoraCreatorInst.onAudioRoutingChanged = function (routing) {
                agora.emit('audio-routing-changed', routing);
            };
            agora.agoraCreatorInst.onConnectionLost = function () {
                agora.emit('connection-lost');
            };
            agora.agoraCreatorInst.onConnectionInterrupted = function () {
                agora.emit('connection-interrupted');
            };
            agora.agoraCreatorInst.onRequestToken = function () {
                agora.emit('request-token');
            };
            agora.agoraCreatorInst.onConnectionBanned = function () {
                agora.emit('connection-banned');
            };
            agora.agoraCreatorInst.onClientRoleChanged = function (oldRole, newRole) {
                agora.emit('client-role-changed', oldRole, newRole);
            };
        };
        agora.setChannelProfile = function (profile) {
            return agora.agoraCreatorInst.setChannelProfile(profile);
        };
        agora.setClientRole = function (role) {
            return agora.agoraCreatorInst.setClientRole(role);
        };
        agora.joinChannel = function (token, channelId, info, uid) {
            return agora.agoraCreatorInst.joinChannel(token, channelId, info, uid);
        };
        agora.leaveChannel = function () {
            return agora.agoraCreatorInst.leaveChannel();
        };
        agora.enableAudio = function () {
            return agora.agoraCreatorInst.enableAudio();
        };
        agora.disableAudio = function () {
            return agora.agoraCreatorInst.disableAudio();
        };
        agora.muteLocalAudioStream = function (mute) {
            return agora.agoraCreatorInst.muteLocalAudioStream(mute);
        };
        agora.enableLocalAudio = function (enabled) {
            return agora.agoraCreatorInst.enableLocalAudio(enabled);
        };
        agora.muteAllRemoteAudioStreams = function (mute) {
            return agora.agoraCreatorInst.muteAllRemoteAudioStreams(mute);
        };
        agora.muteRemoteAudioStream = function (uid, mute) {
            return agora.agoraCreatorInst.muteRemoteAudioStream(uid, mute);
        };
        agora.enableAudioVolumeIndication = function (interval, smooth) {
            return agora.agoraCreatorInst.enableAudioVolumeIndication(interval, smooth);
        };
        agora.adjustRecordingSignalVolume = function (volume) {
            return agora.agoraCreatorInst.adjustRecordingSignalVolume(volume);
        };
        agora.adjustPlaybackSignalVolume = function (volume) {
            return agora.agoraCreatorInst.adjustPlaybackSignalVolume(volume);
        };
        agora.setDefaultAudioRouteToSpeakerphone = function (bVal) { //？
            agora.agoraCreatorInst.setDefaultAudioRouteToSpeakerphone(bVal);
        };
        agora.setParameters = function (profile) { //？
            agora.agoraCreatorInst.setParameters(profile);
        };
        agora.getVersion = function () {
            return agora.agoraCreatorInst.getVersion();
        };
        agora.setLogFile = function (filePath) {
            return agora.agoraCreatorInst.setLogFile(filePath);
        };
        agora.setLogFilter = function (filter) {
            return agora.agoraCreatorInst.setLogFilter(filter);
        };
    }
    if ((typeof AgoraRTC) !== "undefined") {
        if (!AgoraRTC.checkSystemRequirements()) {
            alert("Your browser does not support WebRTC!");
        }
        if (agora.client == null) agora.client = AgoraRTC.createClient({
            mode: "live",
            codec: "h264"
        });
        agora.init = function (appid) {
            // initialize an array to manage remote streams
            // local stream is accessed via agora.stream
            agora.remoteStreams = [];
            agora.client.init(appid, () => {
                agora.emit("init-success");
                agora.client.on("volume-indicator", evt => {
                    var speakers = [];
                    var sumVolume = 0;
                    evt.attr.forEach(function (volume, index) {
                        speakers.push({ uid: volume.uid, volume: volume.level });
                        sumVolume += volume.level;
                    });
                    agora.emit('audio-volume-indication', speakers, speakers.length, sumVolume / speakers.length);
                });
                agora.client.on("peer-leave", function (evt) {
                    // agora.emit('leave-channel', evt);
                    if (evt.stream) {
                        var uid = evt.stream.getId();
                        evt.stream.stop();
                        agora.remoteStreams = agora.remoteStreams.filter(function (item) {
                            return item.getId() !== uid
                        });
                    }
                });
                agora.client.on("stream-added", function (evt) {
                    var stream = evt.stream;
                    agora.client.subscribe(stream, function (err) {
                        agora.emit('error', err, "Subscribe stream failed");
                    });
                    agora.emit('user-joined', stream.getId(), null);
                });
                agora.client.on('stream-subscribed', function (evt) {
                    var remoteStream = evt.stream;
                    console.log("Subscribe remote stream successfully: " + remoteStream.getId());
                    //add remote stream to list
                    agora.remoteStreams.push(remoteStream);
                    remoteStream.play('Cocos2dGameContainer');
                })
                agora.client.on("stream-removed", function (evt) {
                    if (evt.stream) {
                        var uid = evt.stream.getId();
                        evt.stream.stop();
                        // remove remote stream from list
                        agora.remoteStreams = agora.remoteStreams.filter(function (item) {
                            return item.getId() !== uid;
                        });
                        agora.emit('user-offline', stream.getId(), null);
                    }
                });
                agora.client.on("mute-audio", function (evt) {
                    agora.emit('user-mute-audio', evt.uid, true);
                });
                agora.client.on("unmute-audio", function (evt) {
                    agora.emit('user-mute-audio', evt.uid, false);
                });
                agora.client.on("recordingDeviceChanged", function (evt) {
                    agora.emit('recording-device-changed', evt.state, evt.device);
                });
                agora.client.on("onTokenPrivilegeWillExpire", function () {
                    agora.emit('request-token');
                });
                agora.client.on("client-banned", function (evt) {
                    agora.emit('connection-interrupted');
                });
                agora.client.on("client-role-changed", function (evt) {
                    agora.emit('client-role-changed', evt.role);
                });
                agora.client.on("error", err => {
                    agora.emit('error', err, err.reason);
                })
            }, err => {
                agora.emit("error", err, "client init failed!");
            });
        };
        agora.setChannelProfile = function (profile) {
            cc.log("web not support");
        };
        agora.setClientRole = function (role) {
            agora.stream.setClientRole(role);
        };
        agora.joinChannel = function (token, channelId, info, uid) {
            agora.client.join(token, channelId, uid, uid => {
                if (agora.stream == null) agora.stream = AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: false,
                    screen: false
                });
                agora.stream.init(function () {
                    console.log("getUserMedia successfully");
                    agora.stream.play('Cocos2dGameContainer');

                    agora.client.publish(agora.stream, function (err) {
                        console.log("Publish local stream error: " + err);
                    });

                    agora.client.on('stream-published', function (evt) {
                        console.log("Publish local stream successfully");
                    });
                }, function (err) {
                    console.log("getUserMedia failed", err);
                });
                console.log("create stream!");
                agora.startTime = new Date();
                cc.log('Agora(Web platform) service start using time : ' + agora.startTime.toString());
                agora.emit('join-channel-success', channelId, uid, null);
            }, err => {
                agora.emit("error", err, "join channel failed!");
            });
        };
        agora.leaveChannel = function () {
            agora.client.leave(() => {
                var endTime = new Date();
                cc.log('Agora(Web platform) service stop use time : ' + endTime.toString());
                let usedTime = endTime - agora.startTime;
                cc.log('Agora(Web platform) service used time(s) ： ' + Math.floor(usedTime / 1000));
                agora.emit('leave-channel', null);
                agora.stream.close();
                agora.stream = null;
            }, err => {
                agora.emit("error", err, "leave channel failed!");
            })
        };
        agora.enableAudio = function () {
            agora.stream.unmuteAudio();
        };
        agora.disableAudio = function () {
            agora.stream.muteAudio();
        };
        agora.muteLocalAudioStream = function (mute) {
            if (mute)
                agora.stream.disableAudio();
            else
                agora.stream.enableAudio();
        };
        agora.enableLocalAudio = function (enabled) {
            var localAudioTrack = agora.stream.getAudioTrack();
            if (enabled) agora.stream.addTrack(localAudioTrack);
            else agora.stream.removeTrack(localAudioTrack);
        };
        agora.muteAllRemoteAudioStreams = function (mute) {
            agora.remoteStreams.forEach(function (stream) {
                mute ? stream.muteAudio() : stream.unmuteAudio();
            })
        };
        agora.muteRemoteAudioStream = function (uid, mute) {
            agora.remoteStreams.forEach(function (stream) {
                if (uid === stream.getId()) {
                    mute ? stream.muteAudio() : stream.unmuteAudio();
                }
            })
        };
        agora.enableAudioVolumeIndication = function (interval, smooth) {
            agora.client.enableAudioVolumeIndicator();
        };
        agora.adjustRecordingSignalVolume = function (volume) {
            cc.log("web not support");
        };
        agora.adjustPlaybackSignalVolume = function (volume) {
            cc.log("web not support")
        };
        agora.setDefaultAudioRouteToSpeakerphone = function (bVal) {
            cc.log("web not support")
        };
        agora.setParameters = function (profile) {
            cc.log("web not support");
        };
        agora.getVersion = function () {
            return AgoraRTC.VERSION;
        };
        agora.setLogFile = function (filePath) {
            cc.log("web not support");
        };
        agora.setLogFilter = function (filter) {
            AgoraRTC.logger.setLogLevel(filter);
        };
    }
    if (((typeof agoraCreator) === "undefined") && ((typeof AgoraRTC) === "undefined")) {
        agora.init = function (appid) {};
        agora.setChannelProfile = function (profile) {};
        agora.setClientRole = function (role) {};
        agora.joinChannel = function (token, channelId, info, uid) {};
        agora.leaveChannel = function () {};
        agora.enableAudio = function () {};
        agora.disableAudio = function () {};
        agora.muteLocalAudioStream = function (mute) {};
        agora.enableLocalAudio = function (enabled) {};
        agora.muteAllRemoteAudioStreams = function (mute) {};
        agora.muteRemoteAudioStream = function (uid, mute) {};
        agora.enableAudioVolumeIndication = function (interval, smooth) {};
        agora.adjustRecordingSignalVolume = function (volume) {};
        agora.adjustPlaybackSignalVolume = function (volume) {};
        agora.setDefaultAudioRouteToSpeakerphone = function (bVal) {};
        agora.setParameters = function (profile) {};
        agora.getVersion = function () {};
        agora.setLogFile = function (filePath) {};
        agora.setLogFilter = function (filter) {};
    }
})();
