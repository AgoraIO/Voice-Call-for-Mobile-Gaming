namespace agora {
    const isWeb = typeof AgoraRTC !== 'undefined'
    const event = new cc.EventTarget()

    declare class agoraCreator {
        callNativeMethod: (apiType: number, jsonParam?: string, extra?: any) => any

        callNativeMethodAudioEffect: (apiType: number, jsonParam?: string) => any

        /**
         * @internal
         */
        beginApiTest: (casePath: string) => void

        /**
         * @internal
         */
        handleAPICase: (apiType: number, paramsJson: string) => void

        /**
         * @internal
         */
        compareAndDumpApiTestResult: (casePath: string, dumpPath: string) => void

        /**
         * @internal
         */
        beginRtcEngineEventTest: (casePath: string) => void

        /**
         * @internal
         */
        logEngineEventCase: (eventType: string, paramsJson: string) => void

        /**
         * @internal
         */
        compareAndDumpRtcEngineEventTestResult: (casePath: string, dumpPath: string) => void

        /** Reports a warning during SDK runtime.

         In most cases, the application can ignore the warning reported by the SDK because the SDK can usually fix the issue and resume running. For example, when losing connection with the server, the SDK may report #WARN_LOOKUP_CHANNEL_TIMEOUT and automatically try to reconnect.

         @param warn Warning code: #WARN_CODE_TYPE.
         @param msg Pointer to the warning message.
         */
        onWarning: (warn: number, msg: string) => void

        /** Reports an error during SDK runtime.

         In most cases, the SDK cannot fix the issue and resume running. The SDK requires the application to take action or informs the user about the issue.

         For example, the SDK reports an #ERR_START_CALL error when failing to initialize a call. The application informs the user that the call initialization failed and invokes the \ref IRtcEngine::leaveChannel "leaveChannel" method to leave the channel.

         @param err Error code: #ERROR_CODE_TYPE.
         @param msg Pointer to the error message.
         */
        onError: (err: number, msg: string) => void

        /** Occurs when a user joins a channel.

         This callback notifies the application that a user joins a specified channel when the application calls the \ref IRtcEngine::joinChannel "joinChannel" method.

         The channel name assignment is based on @p channelName specified in the \ref IRtcEngine::joinChannel "joinChannel" method.

         If the @p uid is not specified in the *joinChannel* method, the server automatically assigns a @p uid.

         @param channel  Pointer to the channel name.
         @param  uid User ID of the user joining the channel.
         @param  elapsed Time elapsed (ms) from the user calling the \ref IRtcEngine::joinChannel "joinChannel" method until the SDK triggers this callback.
         */
        onJoinChannelSuccess: (channel: string, uid: number, elapsed: number) => void

        /** Occurs when a user rejoins the channel after disconnection due to network problems.

         When a user loses connection with the server because of network problems, the SDK automatically tries to reconnect and triggers this callback upon reconnection.

         @param channel Pointer to the channel name.
         @param uid User ID of the user rejoining the channel.
         @param elapsed Time elapsed (ms) from starting to reconnect until the SDK triggers this callback.
         */
        onRejoinChannelSuccess: (channel: string, uid: number, elapsed: number) => void

        /** Occurs when a user leaves the channel.

         This callback notifies the application that a user leaves the channel when the application calls the \ref IRtcEngine::leaveChannel "leaveChannel" method.

         The application retrieves information, such as the call duration and statistics.

         @param stats Pointer to the statistics of the call: RtcStats.
         */
        onLeaveChannel: (stats: RtcStats) => void

        /** Occurs when the user role switches in the live interactive streaming. For example, from a host to an audience or vice versa.

         This callback notifies the application of a user role switch when the application calls the \ref IRtcEngine::setClientRole "setClientRole" method.

         The SDK triggers this callback when the local user switches the user role by calling the \ref agora::rtc::IRtcEngine::setClientRole "setClientRole" method after joining the channel.
         @param oldRole Role that the user switches from: #CLIENT_ROLE_TYPE.
         @param newRole Role that the user switches to: #CLIENT_ROLE_TYPE.
         */
        onClientRoleChanged: (oldRole: CLIENT_ROLE_TYPE, newRole: CLIENT_ROLE_TYPE) => void

        /** Occurs when a remote user (`COMMUNICATION`)/ host (`LIVE_BROADCASTING`) joins the channel.

         - `COMMUNICATION` profile: This callback notifies the application that another user joins the channel. If other users are already in the channel, the SDK also reports to the application on the existing users.
         - `LIVE_BROADCASTING` profile: This callback notifies the application that the host joins the channel. If other hosts are already in the channel, the SDK also reports to the application on the existing hosts. We recommend limiting the number of hosts to 17.

         The SDK triggers this callback under one of the following circumstances:
         - A remote user/host joins the channel by calling the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
         - A remote user switches the user role to the host by calling the \ref agora::rtc::IRtcEngine::setClientRole "setClientRole" method after joining the channel.
         - A remote user/host rejoins the channel after a network interruption.
         - The host injects an online media stream into the channel by calling the \ref agora::rtc::IRtcEngine::addInjectStreamUrl "addInjectStreamUrl" method.

         @note In the `LIVE_BROADCASTING` profile:
         - The host receives this callback when another host joins the channel.
         - The audience in the channel receives this callback when a new host joins the channel.
         - When a web application joins the channel, the SDK triggers this callback as long as the web application publishes streams.

         @param uid User ID of the user or host joining the channel.
         @param elapsed Time delay (ms) from the local user calling the \ref IRtcEngine::joinChannel "joinChannel" method until the SDK triggers this callback.
         */
        onUserJoined: (uid: number, elapsed: number) => void

        /** Occurs when a remote user (`COMMUNICATION`)/ host (`LIVE_BROADCASTING`) leaves the channel.

         Reasons why the user is offline:

         - Leave the channel: When the user/host leaves the channel, the user/host sends a goodbye message. When the message is received, the SDK assumes that the user/host leaves the channel.
         - Drop offline: When no data packet of the user or host is received for a certain period of time, the SDK assumes that the user/host drops offline. Unreliable network connections may lead to false detections, so we recommend using the Agora RTM SDK for more reliable offline detection.

         @param uid User ID of the user leaving the channel or going offline.
         @param reason Reason why the user is offline: #USER_OFFLINE_REASON_TYPE.
         */
        onUserOffline: (uid: number, reason: USER_OFFLINE_REASON_TYPE) => void

        /** Reports the last mile network quality of the local user once every two seconds before the user joins the channel.

         Last mile refers to the connection between the local device and Agora's edge server. After the application calls the \ref IRtcEngine::enableLastmileTest "enableLastmileTest" method, this callback reports once every two seconds the uplink and downlink last mile network conditions of the local user before the user joins the channel.

         @param quality The last mile network quality: #QUALITY_TYPE.
         */
        onLastmileQuality: (quality: number) => void

        /** Reports the last-mile network probe result.

         The SDK triggers this callback within 30 seconds after the app calls the \ref agora::rtc::IRtcEngine::startLastmileProbeTest "startLastmileProbeTest" method.

         @param result The uplink and downlink last-mile network probe test result. See LastmileProbeResult.
         */
        onLastmileProbeResult: (result: LastmileProbeResult) => void

        /** **DEPRECATED** Occurs when the connection between the SDK and the server is interrupted.

         Deprecated as of v2.3.2. Replaced by the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged(CONNECTION_STATE_RECONNECTING, CONNECTION_CHANGED_INTERRUPTED)" callback.

         The SDK triggers this callback when it loses connection with the server for more than four seconds after the connection is established.

         After triggering this callback, the SDK tries reconnecting to the server. You can use this callback to implement pop-up reminders.

         This callback is different from \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost":
         - The SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted" callback when it loses connection with the server for more than four seconds after it successfully joins the channel.
         - The SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost" callback when it loses connection with the server for more than 10 seconds, whether or not it joins the channel.

         If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK stops rejoining the channel.

         */
        onConnectionInterrupted: () => void

        /** Occurs when the SDK cannot reconnect to Agora's edge server 10 seconds after its connection to the server is interrupted.

         The SDK triggers this callback when it cannot connect to the server 10 seconds after calling the \ref IRtcEngine::joinChannel "joinChannel" method, whether or not it is in the channel.

         This callback is different from \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted":

         - The SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted" callback when it loses connection with the server for more than four seconds after it successfully joins the channel.
         - The SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost" callback when it loses connection with the server for more than 10 seconds, whether or not it joins the channel.

         If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK stops rejoining the channel.

         */
        onConnectionLost: () => void

        /** **DEPRECATED** Deprecated as of v2.3.2. Replaced by the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged(CONNECTION_STATE_FAILED, CONNECTION_CHANGED_BANNED_BY_SERVER)" callback.

         Occurs when your connection is banned by the Agora Server.
         */
        onConnectionBanned: () => void

        /** Occurs when a method is executed by the SDK.

         @param err The error code (#ERROR_CODE_TYPE) returned by the SDK when a method call fails. If the SDK returns 0, then the method call is successful.
         @param api Pointer to the method executed by the SDK.
         @param result Pointer to the result of the method call.
         */
        onApiCallExecuted: (err: number, api: string, result: string) => void

        /** Occurs when the token expires.

         After a token is specified by calling the \ref IRtcEngine::joinChannel "joinChannel" method, if the SDK losses connection with the Agora server due to network issues, the token may expire after a certain period of time and a new token may be required to reconnect to the server.

         This callback notifies the app to generate a new token and call joinChannel to rejoin the channel with the new token.
         */
        onRequestToken: () => void

        /** Occurs when the token expires in 30 seconds.

         The user becomes offline if the token used in the \ref IRtcEngine::joinChannel "joinChannel" method expires. The SDK triggers this callback 30 seconds before the token expires to remind the application to get a new token. Upon receiving this callback, generate a new token on the server and call the \ref IRtcEngine::renewToken "renewToken" method to pass the new token to the SDK.

         @param token Pointer to the token that expires in 30 seconds.
         */
        onTokenPrivilegeWillExpire: (token: string) => void

        /** **DEPRECATED** Reports the statistics of the audio stream from each remote user/host.

         Deprecated as of v2.3.2. Use the \ref agora::rtc::IRtcEngineEventHandler::onRemoteAudioStats "onRemoteAudioStats" callback instead.

         The SDK triggers this callback once every two seconds to report the audio quality of each remote user/host sending an audio stream. If a channel has multiple users/hosts sending audio streams, the SDK triggers this callback as many times.

         @param uid User ID of the speaker.
         @param quality Audio quality of the user: #QUALITY_TYPE.
         @param delay Time delay (ms) of sending the audio packet from the sender to the receiver, including the time delay of audio sampling pre-processing, transmission, and the jitter buffer.
         @param lost Packet loss rate (%) of the audio packet sent from the sender to the receiver.
         */
        onAudioQuality: (uid: number, quality: number, delay: number, lost: number) => void

        /** Reports the statistics of the current call.

         The SDK triggers this callback once every two seconds after the user joins the channel.

         @param stats Statistics of the IRtcEngine: RtcStats.
         */
        onRtcStats: (stats: RtcStats) => void

        /** Reports the last mile network quality of each user in the channel once every two seconds.

         Last mile refers to the connection between the local device and Agora's edge server. This callback reports once every two seconds the last mile network conditions of each user in the channel. If a channel includes multiple users, the SDK triggers this callback as many times.

         @param uid User ID. The network quality of the user with this @p uid is reported. If @p uid is 0, the local network quality is reported.
         @param txQuality Uplink transmission quality rating of the user in terms of the transmission bitrate, packet loss rate, average RTT (Round-Trip Time), and jitter of the uplink network. @p txQuality is a quality rating helping you understand how well the current uplink network conditions can support the selected VideoEncoderConfiguration. For example, a 1000 Kbps uplink network may be adequate for video frames with a resolution of 640 * 480 and a frame rate of 15 fps in the `LIVE_BROADCASTING` profile, but may be inadequate for resolutions higher than 1280 * 720. See #QUALITY_TYPE.
         @param rxQuality Downlink network quality rating of the user in terms of the packet loss rate, average RTT, and jitter of the downlink network. See #QUALITY_TYPE.
         */
        onNetworkQuality: (uid: number, txQuality: number, rxQuality: number) => void

        /** Reports the statistics of the local video stream.
         *
         * The SDK triggers this callback once every two seconds for each
         * user/host. If there are multiple users/hosts in the channel, the SDK
         * triggers this callback as many times.
         *
         * @note
         * If you have called the
         * \ref agora::rtc::IRtcEngine::enableDualStreamMode "enableDualStreamMode"
         * method, the \ref onLocalVideoStats() "onLocalVideoStats" callback
         * reports the statistics of the high-video
         * stream (high bitrate, and high-resolution video stream).
         *
         * @param stats Statistics of the local video stream. See LocalVideoStats.
         */
        onLocalVideoStats: (stats: LocalVideoStats) => void

        /** Reports the statistics of the video stream from each remote user/host.
         *
         * The SDK triggers this callback once every two seconds for each remote
         * user/host. If a channel includes multiple remote users, the SDK
         * triggers this callback as many times.
         *
         * @param stats Statistics of the remote video stream. See
         * RemoteVideoStats.
         */
        onRemoteVideoStats: (stats: RemoteVideoStats) => void

        /** Reports the statistics of the local audio stream.
         *
         * The SDK triggers this callback once every two seconds.
         *
         * @param stats The statistics of the local audio stream.
         * See LocalAudioStats.
         */
        onLocalAudioStats: (stats: LocalAudioStats) => void

        /** Reports the statistics of the audio stream from each remote user/host.

         This callback replaces the \ref agora::rtc::IRtcEngineEventHandler::onAudioQuality "onAudioQuality" callback.

         The SDK triggers this callback once every two seconds for each remote user/host. If a channel includes multiple remote users, the SDK triggers this callback as many times.

         @param stats Pointer to the statistics of the received remote audio streams. See RemoteAudioStats.
         */
        onRemoteAudioStats: (stats: RemoteAudioStats) => void

        /** Occurs when the local audio state changes.
         * This callback indicates the state change of the local audio stream,
         * including the state of the audio recording and encoding, and allows
         * you to troubleshoot issues when exceptions occur.
         *
         * @note
         * When the state is #LOCAL_AUDIO_STREAM_STATE_FAILED (3), see the `error`
         * parameter for details.
         *
         * @param state State of the local audio. See #LOCAL_AUDIO_STREAM_STATE.
         * @param error The error information of the local audio.
         * See #LOCAL_AUDIO_STREAM_ERROR.
         */
        onLocalAudioStateChanged: (state: LOCAL_AUDIO_STREAM_STATE, error: LOCAL_AUDIO_STREAM_ERROR) => void

        /** Occurs when the remote audio state changes.

         This callback indicates the state change of the remote audio stream.
         @note This callback does not work properly when the number of users (in the `COMMUNICATION` profile) or hosts (in the `LIVE_BROADCASTING` profile) in the channel exceeds 17.

         @param uid ID of the remote user whose audio state changes.
         @param state State of the remote audio. See #REMOTE_AUDIO_STATE.
         @param reason The reason of the remote audio state change.
         See #REMOTE_AUDIO_STATE_REASON.
         @param elapsed Time elapsed (ms) from the local user calling the
         \ref IRtcEngine::joinChannel "joinChannel" method until the SDK
         triggers this callback.
         */
        onRemoteAudioStateChanged: (uid: number, state: REMOTE_AUDIO_STATE, reason: REMOTE_AUDIO_STATE_REASON, elapsed: number) => void

        /** Occurs when the audio publishing state changes.
         *
         * @since v3.1.0
         *
         * This callback indicates the publishing state change of the local audio stream.
         *
         * @param channel The channel name.
         * @param oldState The previous publishing state. For details, see #STREAM_PUBLISH_STATE.
         * @param newState The current publishing state. For details, see #STREAM_PUBLISH_STATE.
         * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
         */
        onAudioPublishStateChanged: (channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number) => void

        /** Occurs when the video publishing state changes.
         *
         * @since v3.1.0
         *
         * This callback indicates the publishing state change of the local video stream.
         *
         * @param channel The channel name.
         * @param oldState The previous publishing state. For details, see #STREAM_PUBLISH_STATE.
         * @param newState The current publishing state. For details, see #STREAM_PUBLISH_STATE.
         * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
         */
        onVideoPublishStateChanged: (channel: string, oldState: STREAM_PUBLISH_STATE, newState: STREAM_PUBLISH_STATE, elapseSinceLastState: number) => void

        /** Occurs when the audio subscribing state changes.
         *
         * @since v3.1.0
         *
         * This callback indicates the subscribing state change of a remote audio stream.
         *
         * @param channel The channel name.
         * @param uid The ID of the remote user.
         * @param oldState The previous subscribing state. For details, see #STREAM_SUBSCRIBE_STATE.
         * @param newState The current subscribing state. For details, see #STREAM_SUBSCRIBE_STATE.
         * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
         */
        onAudioSubscribeStateChanged: (channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number) => void

        /** Occurs when the audio subscribing state changes.
         *
         * @since v3.1.0
         *
         * This callback indicates the subscribing state change of a remote video stream.
         *
         * @param channel The channel name.
         * @param uid The ID of the remote user.
         * @param oldState The previous subscribing state. For details, see #STREAM_SUBSCRIBE_STATE.
         * @param newState The current subscribing state. For details, see #STREAM_SUBSCRIBE_STATE.
         * @param elapseSinceLastState The time elapsed (ms) from the previous state to the current state.
         */
        onVideoSubscribeStateChanged: (channel: string, uid: number, oldState: STREAM_SUBSCRIBE_STATE, newState: STREAM_SUBSCRIBE_STATE, elapseSinceLastState: number) => void

        /** Reports which users are speaking, the speakers' volume and whether the local user is speaking.

         This callback reports the IDs and volumes of the loudest speakers (at most 3 users) at the moment in the channel, and whether the local user is speaking.

         By default, this callback is disabled. You can enable it by calling the \ref IRtcEngine::enableAudioVolumeIndication(int, int, bool) "enableAudioVolumeIndication" method.
         Once enabled, this callback is triggered at the set interval, regardless of whether a user speaks or not.

         The SDK triggers two independent `onAudioVolumeIndication` callbacks at one time, which separately report the volume information of the local user and all the remote speakers.
         For more information, see the detailed parameter descriptions.

         @note
         - To enable the voice activity detection of the local user, ensure that you set `report_vad`(true) in the `enableAudioVolumeIndication` method.
         - Calling the \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method affects the SDK's behavior:
         - If the local user calls the \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method, the SDK stops triggering the local user's callback.
         - 20 seconds after a remote speaker calls the *muteLocalAudioStream* method, the remote speakers' callback excludes this remote user's information; 20 seconds after all remote users call the *muteLocalAudioStream* method, the SDK stops triggering the remote speakers' callback.
         - An empty @p speakers array in the *onAudioVolumeIndication* callback suggests that no remote user is speaking at the moment.

         @param speakers A pointer to AudioVolumeInfo:
         - In the local user's callback, this struct contains the following members:
         - `uid` = 0,
         - `volume` = `totalVolume`, which reports the sum of the voice volume and audio-mixing volume of the local user, and
         - `vad`, which reports the voice activity status of the local user.
         - In the remote speakers' callback, this array contains the following members:
         - `uid` of the remote speaker,
         - `volume`, which reports the sum of the voice volume and audio-mixing volume of each remote speaker, and
         - `vad` = 0.

         An empty speakers array in the callback indicates that no remote user is speaking at the moment.
         @param speakerNumber Total number of speakers. The value range is [0, 3].
         - In the local user’s callback, `speakerNumber` = 1, regardless of whether the local user speaks or not.
         - In the remote speakers' callback, the callback reports the IDs and volumes of the three loudest speakers when there are more than three remote users in the channel, and `speakerNumber` = 3.
         @param totalVolume Total volume after audio mixing. The value ranges between 0 (lowest volume) and 255 (highest volume).
         - In the local user’s callback, `totalVolume` is the sum of the voice volume and audio-mixing volume of the local user.
         - In the remote speakers' callback, `totalVolume` is the sum of the voice volume and audio-mixing volume of all the remote speakers.
         */
        onAudioVolumeIndication: (speakers: AudioVolumeInfo[], speakerNumber: number, totalVolume: number) => void

        /** Reports which user is the loudest speaker.

         If the user enables the audio volume indication by calling the \ref IRtcEngine::enableAudioVolumeIndication(int, int, bool) "enableAudioVolumeIndication" method, this callback returns the @p uid of the active speaker detected by the audio volume detection module of the SDK.

         @note
         - To receive this callback, you need to call the \ref IRtcEngine::enableAudioVolumeIndication(int, int, bool) "enableAudioVolumeIndication" method.
         - This callback returns the user ID of the user with the highest voice volume during a period of time, instead of at the moment.

         @param uid User ID of the active speaker. A @p uid of 0 represents the local user.
         */
        onActiveSpeaker: (uid: number) => void

        /** **DEPRECATED** Occurs when the video stops playing.

         The application can use this callback to change the configuration of the view (for example, displaying other pictures in the view) after the video stops playing.

         Deprecated as of v2.4.1. Use LOCAL_VIDEO_STREAM_STATE_STOPPED(0) in the \ref agora::rtc::IRtcEngineEventHandler::onLocalVideoStateChanged "onLocalVideoStateChanged" callback instead.
         */
        onVideoStopped: () => void

        /** Occurs when the first local video frame is displayed/rendered on the local video view.

         @param width Width (px) of the first local video frame.
         @param height Height (px) of the first local video frame.
         @param elapsed Time elapsed (ms) from the local user calling the \ref IRtcEngine::joinChannel "joinChannel" method until the SDK triggers this callback.
         If you call the \ref IRtcEngine::startPreview "startPreview" method  before calling the *joinChannel* method, then @p elapsed is the time elapsed from calling the *startPreview* method until the SDK triggers this callback.
         */
        onFirstLocalVideoFrame: (width: number, height: number, elapsed: number) => void

        /** Occurs when the first video frame is published.
         *
         * @since v3.1.0
         *
         * The SDK triggers this callback under one of the following circumstances:
         * - The local client enables the video module and calls \ref IRtcEngine::joinChannel "joinChannel" successfully.
         * - The local client calls \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" and \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(false)" in sequence.
         * - The local client calls \ref IRtcEngine::disableVideo "disableVideo" and \ref IRtcEngine::enableVideo "enableVideo" in sequence.
         *
         * @param elapsed The time elapsed (ms) from the local client calling \ref IRtcEngine::joinChannel "joinChannel" until the SDK triggers this callback.
         */
        onFirstLocalVideoFramePublished: (elapsed: number) => void

        /** Occurs when the first remote video frame is received and decoded.
         *
         * @deprecated v2.9.0
         *
         * This callback is deprecated and replaced by the
         * \ref onRemoteVideoStateChanged() "onRemoteVideoStateChanged" callback
         * with the following parameters:
         * - #REMOTE_VIDEO_STATE_STARTING (1)
         * - #REMOTE_VIDEO_STATE_DECODING (2)
         *
         * This callback is triggered in either of the following scenarios:
         *
         * - The remote user joins the channel and sends the video stream.
         * - The remote user stops sending the video stream and re-sends it after
         * 15 seconds. Reasons for such an interruption include:
         *  - The remote user leaves the channel.
         *  - The remote user drops offline.
         *  - The remote user calls the
         * \ref agora::rtc::IRtcEngine::muteLocalVideoStream "muteLocalVideoStream"
         *  method to stop sending the video stream.
         *  - The remote user calls the
         * \ref agora::rtc::IRtcEngine::disableVideo "disableVideo" method to
         * disable video.
         *
         * The application can configure the user view settings in this callback.
         *
         * @param uid User ID of the remote user sending the video stream.
         * @param width Width (px) of the video stream.
         * @param height Height (px) of the video stream.
         * @param elapsed Time elapsed (ms) from the local user calling the
         * \ref IRtcEngine::joinChannel "joinChannel" method until the SDK
         * triggers this callback.
         */
        onFirstRemoteVideoDecoded: (uid: number, width: number, height: number, elapsed: number) => void

        /** Occurs when the first remote video frame is rendered.
         *
         The SDK triggers this callback when the first frame of the remote video is displayed in the user's video window. The application can retrieve the time elapsed from a user joining the channel until the first video frame is displayed.

         @param uid User ID of the remote user sending the video stream.
         @param width Width (px) of the video frame.
         @param height Height (px) of the video stream.
         @param elapsed Time elapsed (ms) from the local user calling the \ref IRtcEngine::joinChannel "joinChannel" method until the SDK triggers this callback.
         */
        onFirstRemoteVideoFrame: (uid: number, width: number, height: number, elapsed: number) => void

        /** @deprecated This method is deprecated from v3.0.0, use the \ref agora::rtc::IRtcEngineEventHandler::onRemoteAudioStateChanged "onRemoteAudioStateChanged" callback instead.

         Occurs when a remote user's audio stream playback pauses/resumes.

         The SDK triggers this callback when the remote user stops or resumes sending the audio stream by calling the \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method.

         @note This callback does not work properly when the number of users (in the `COMMUNICATION` profile) or hosts (in the `LIVE_BROADCASTING` profile) in the channel exceeds 17.

         @param uid User ID of the remote user.
         @param muted Whether the remote user's audio stream is muted/unmuted:
         - true: Muted.
         - false: Unmuted.
         */
        onUserMuteAudio: (uid: number, muted: boolean) => void

        /** Occurs when a remote user's video stream playback pauses/resumes.
         *
         * You can also use the
         * \ref onRemoteVideoStateChanged() "onRemoteVideoStateChanged" callback
         * with the following parameters:
         * - #REMOTE_VIDEO_STATE_STOPPED (0) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5).
         * - #REMOTE_VIDEO_STATE_DECODING (2) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6).
         *
         * The SDK triggers this callback when the remote user stops or resumes
         * sending the video stream by calling the
         * \ref agora::rtc::IRtcEngine::muteLocalVideoStream
         * "muteLocalVideoStream" method.
         *
         * @note This callback does not work properly when the number of users (in the `COMMUNICATION` profile) or hosts (in the `LIVE_BROADCASTING` profile) in the channel exceeds 17.
         *
         * @param uid User ID of the remote user.
         * @param muted Whether the remote user's video stream playback is
         * paused/resumed:
         * - true: Paused.
         * - false: Resumed.
         */
        onUserMuteVideo: (uid: number, muted: boolean) => void

        /** Occurs when a specific remote user enables/disables the video
         * module.
         *
         * @deprecated v2.9.0
         *
         * This callback is deprecated and replaced by the
         * \ref onRemoteVideoStateChanged() "onRemoteVideoStateChanged" callback
         * with the following parameters:
         * - #REMOTE_VIDEO_STATE_STOPPED (0) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5).
         * - #REMOTE_VIDEO_STATE_DECODING (2) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6).
         *
         * Once the video module is disabled, the remote user can only use a
         * voice call. The remote user cannot send or receive any video from
         * other users.
         *
         * The SDK triggers this callback when the remote user enables or disables
         * the video module by calling the
         * \ref agora::rtc::IRtcEngine::enableVideo "enableVideo" or
         * \ref agora::rtc::IRtcEngine::disableVideo "disableVideo" method.
         *
         * @note This callback returns invalid when the number of users in a
         * channel exceeds 20.
         *
         * @param uid User ID of the remote user.
         * @param enabled Whether the remote user enables/disables the video
         * module:
         * - true: Enable. The remote user can enter a video session.
         * - false: Disable. The remote user can only enter a voice session, and
         * cannot send or receive any video stream.
         */
        onUserEnableVideo: (uid: number, enabled: boolean) => void

        /** Occurs when the audio device state changes.

         This callback notifies the application that the system's audio device state is changed. For example, a headset is unplugged from the device.

         @param deviceId Pointer to the device ID.
         @param deviceType Device type: #MEDIA_DEVICE_TYPE.
         @param deviceState Device state: #MEDIA_DEVICE_STATE_TYPE.
         */
        onAudioDeviceStateChanged: (deviceId: string, deviceType: MEDIA_DEVICE_TYPE, deviceState: MEDIA_DEVICE_STATE_TYPE) => void

        /** Occurs when the volume of the playback device, microphone, or application changes.

         @param deviceType Device type: #MEDIA_DEVICE_TYPE.
         @param volume Volume of the device. The value ranges between 0 and 255.
         @param muted
         - true: The audio device is muted.
         - false: The audio device is not muted.
         */
        onAudioDeviceVolumeChanged: (deviceType: MEDIA_DEVICE_TYPE, volume: number, muted: boolean) => void

        /** **DEPRECATED** Occurs when the camera turns on and is ready to capture the video.

         If the camera fails to turn on, fix the error reported in the \ref IRtcEngineEventHandler::onError "onError" callback.

         Deprecated as of v2.4.1. Use #LOCAL_VIDEO_STREAM_STATE_CAPTURING (1) in the \ref agora::rtc::IRtcEngineEventHandler::onLocalVideoStateChanged "onLocalVideoStateChanged" callback instead.
         */
        onCameraReady: () => void

        /** Occurs when the camera focus area changes.

         The SDK triggers this callback when the local user changes the camera focus position by calling the setCameraFocusPositionInPreview method.

         @note This callback is for Android and iOS only.

         @param x x coordinate of the changed camera focus area.
         @param y y coordinate of the changed camera focus area.
         @param width Width of the changed camera focus area.
         @param height Height of the changed camera focus area.
         */
        onCameraFocusAreaChanged: (x: number, y: number, width: number, height: number) => void

        /**
         * Reports the face detection result of the local user. Applies to Android and iOS only.
         * @since v3.0.1
         *
         * Once you enable face detection by calling \ref IRtcEngine::enableFaceDetection "enableFaceDetection"(true), you can get the following information on the local user in real-time:
         * - The width and height of the local video.
         * - The position of the human face in the local video.
         * - The distance between the human face and the device screen. This value is based on the fitting calculation of the local video size and the position of the human face.
         *
         * @note
         * - If the SDK does not detect a face, it reduces the frequency of this callback to reduce power consumption on the local device.
         * - The SDK stops triggering this callback when a human face is in close proximity to the screen.
         * - On Android, the `distance` value reported in this callback may be slightly different from the actual distance. Therefore, Agora does not recommend using it for
         * accurate calculation.
         * @param imageWidth The width (px) of the local video.
         * @param imageHeight The height (px) of the local video.
         * @param vecRectangle The position and size of the human face on the local video:
         * - `x`: The x coordinate (px) of the human face in the local video. Taking the top left corner of the captured video as the origin,
         * the x coordinate represents the relative lateral displacement of the top left corner of the human face to the origin.
         * - `y`: The y coordinate (px) of the human face in the local video. Taking the top left corner of the captured video as the origin,
         * the y coordinate represents the relative longitudinal displacement of the top left corner of the human face to the origin.
         * - `width`: The width (px) of the human face in the captured video.
         * - `height`: The height (px) of the human face in the captured video.
         * @param vecDistance The distance (cm) between the human face and the screen.
         * @param numFaces The number of faces detected. If the value is 0, it means that no human face is detected.
         */
        onFacePositionChanged: (imageWidth: number, imageHeight: number, vecRectangle: Rectangle[], vecDistance: number[], numFaces: number) => void

        /** Occurs when the camera exposure area changes.

         The SDK triggers this callback when the local user changes the camera exposure position by calling the setCameraExposurePosition method.

         @note This callback is for Android and iOS only.

         @param x x coordinate of the changed camera exposure area.
         @param y y coordinate of the changed camera exposure area.
         @param width Width of the changed camera exposure area.
         @param height Height of the changed camera exposure area.
         */
        onCameraExposureAreaChanged: (x: number, y: number, width: number, height: number) => void

        /** Occurs when the audio mixing file playback finishes.

         **DEPRECATED**  use onAudioMixingStateChanged instead.

         You can start an audio mixing file playback by calling the \ref IRtcEngine::startAudioMixing "startAudioMixing" method. The SDK triggers this callback when the audio mixing file playback finishes.

         If the *startAudioMixing* method call fails, an error code returns in the \ref IRtcEngineEventHandler::onError "onError" callback.

         */
        onAudioMixingFinished: () => void

        /** Occurs when the state of the local user's audio mixing file changes.

         When you call the \ref IRtcEngine::startAudioMixing "startAudioMixing" method and the state of audio mixing file changes, the SDK triggers this callback.
         - When the audio mixing file plays, pauses playing, or stops playing, this callback returns 710, 711, or 713 in @p state, and 0 in @p errorCode.
         - When exceptions occur during playback, this callback returns 714 in @p state and an error in @p errorCode.
         - If the local audio mixing file does not exist, or if the SDK does not support the file format or cannot access the music file URL, the SDK returns WARN_AUDIO_MIXING_OPEN_ERROR = 701.

         @param state The state code. See #AUDIO_MIXING_STATE_TYPE.
         @param errorCode The error code. See #AUDIO_MIXING_ERROR_TYPE.
         */
        onAudioMixingStateChanged: (state: AUDIO_MIXING_STATE_TYPE, errorCode: AUDIO_MIXING_ERROR_TYPE) => void

        /** Occurs when a remote user starts audio mixing.

         When a remote user calls \ref IRtcEngine::startAudioMixing "startAudioMixing" to play the background music, the SDK reports this callback.
         */
        onRemoteAudioMixingBegin: () => void

        /** Occurs when a remote user finishes audio mixing.
         */
        onRemoteAudioMixingEnd: () => void

        /** Occurs when the local audio effect playback finishes.

         The SDK triggers this callback when the local audio effect file playback finishes.

         @param soundId ID of the local audio effect. Each local audio effect has a unique ID.
         */
        onAudioEffectFinished: (soundId: number) => void

        /**
         Occurs when the SDK decodes the first remote audio frame for playback.

         @deprecated v3.0.0

         This callback is deprecated. Use `onRemoteAudioStateChanged` instead.

         This callback is triggered in either of the following scenarios:

         - The remote user joins the channel and sends the audio stream.
         - The remote user stops sending the audio stream and re-sends it after 15 seconds. Reasons for such an interruption include:
         - The remote user leaves channel.
         - The remote user drops offline.
         - The remote user calls the \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" method to stop sending the local audio stream.
         - The remote user calls the \ref agora::rtc::IRtcEngine::disableAudio "disableAudio" method to disable audio.

         @param uid User ID of the remote user sending the audio stream.
         @param elapsed Time elapsed (ms) from the local user calling the \ref IRtcEngine::joinChannel "joinChannel" method until the SDK triggers this callback.
         */
        onFirstRemoteAudioDecoded: (uid: number, elapsed: number) => void

        /** Occurs when the video device state changes.

         @note On a Windows device with an external camera for video capturing, the video disables once the external camera is unplugged.

         @param deviceId Pointer to the device ID of the video device that changes state.
         @param deviceType Device type: #MEDIA_DEVICE_TYPE.
         @param deviceState Device state: #MEDIA_DEVICE_STATE_TYPE.
         */
        onVideoDeviceStateChanged: (deviceId: string, deviceType: MEDIA_DEVICE_TYPE, deviceState: MEDIA_DEVICE_STATE_TYPE) => void

        /** Occurs when the local video stream state changes.

         This callback indicates the state of the local video stream, including camera capturing and video encoding, and allows you to troubleshoot issues when exceptions occur.

         @note For some device models, the SDK will not trigger this callback when the state of the local video changes while the local video capturing device is in use, so you have to make your own timeout judgment.

         @param localVideoState State type #LOCAL_VIDEO_STREAM_STATE. When the state is LOCAL_VIDEO_STREAM_STATE_FAILED (3), see the `error` parameter for details.
         @param error The detailed error information: #LOCAL_VIDEO_STREAM_ERROR.
         */
        onLocalVideoStateChanged: (localVideoState: LOCAL_VIDEO_STREAM_STATE, error: LOCAL_VIDEO_STREAM_ERROR) => void

        /** Occurs when the video size or rotation of a specified user changes.

         @param uid User ID of the remote user or local user (0) whose video size or rotation changes.
         @param width New width (pixels) of the video.
         @param height New height (pixels) of the video.
         @param rotation New rotation of the video [0 to 360).
         */
        onVideoSizeChanged: (uid: number, width: number, height: number, rotation: number) => void

        /** Occurs when the remote video state changes.
         @note This callback does not work properly when the number of users (in the `COMMUNICATION` profile) or hosts (in the `LIVE_BROADCASTING` profile) in the channel exceeds 17.

         @param uid ID of the remote user whose video state changes.
         @param state State of the remote video. See #REMOTE_VIDEO_STATE.
         @param reason The reason of the remote video state change. See
         #REMOTE_VIDEO_STATE_REASON.
         @param elapsed Time elapsed (ms) from the local user calling the
         \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method until the
         SDK triggers this callback.
         */
        onRemoteVideoStateChanged: (uid: number, state: REMOTE_VIDEO_STATE, reason: REMOTE_VIDEO_STATE_REASON, elapsed: number) => void

        /** Occurs when a specified remote user enables/disables the local video
         * capturing function.
         *
         * @deprecated v2.9.0
         *
         * This callback is deprecated and replaced by the
         * \ref onRemoteVideoStateChanged() "onRemoteVideoStateChanged" callback
         * with the following parameters:
         * - #REMOTE_VIDEO_STATE_STOPPED (0) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5).
         * - #REMOTE_VIDEO_STATE_DECODING (2) and
         * #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6).
         *
         * This callback is only applicable to the scenario when the user only
         * wants to watch the remote video without sending any video stream to the
         * other user.
         *
         * The SDK triggers this callback when the remote user resumes or stops
         * capturing the video stream by calling the
         * \ref agora::rtc::IRtcEngine::enableLocalVideo "enableLocalVideo" method.
         *
         * @param uid User ID of the remote user.
         * @param enabled Whether the specified remote user enables/disables the
         * local video capturing function:
         * - true: Enable. Other users in the channel can see the video of this
         * remote user.
         * - false: Disable. Other users in the channel can no longer receive the
         * video stream from this remote user, while this remote user can still
         * receive the video streams from other users.
         */
        onUserEnableLocalVideo: (uid: number, enabled: boolean) => void

        /** Occurs when the local user receives the data stream from the remote user within five seconds.

         The SDK triggers this callback when the local user receives the stream message that the remote user sends by calling the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         @param uid User ID of the remote user sending the message.
         @param streamId Stream ID.
         @param data Pointer to the data received by the local user.
         @param length Length of the data in bytes.
         */
        onStreamMessage: (uid: number, streamId: number, data: Uint8Array, length: number) => void

        /** Occurs when the local user does not receive the data stream from the remote user within five seconds.

         The SDK triggers this callback when the local user fails to receive the stream message that the remote user sends by calling the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         @param uid User ID of the remote user sending the message.
         @param streamId Stream ID.
         @param code Error code: #ERROR_CODE_TYPE.
         @param missed Number of lost messages.
         @param cached Number of incoming cached messages when the data stream is interrupted.
         */
        onStreamMessageError: (uid: number, streamId: number, code: number, missed: number, cached: number) => void

        /** Occurs when the media engine loads.*/
        onMediaEngineLoadSuccess: () => void
        /** Occurs when the media engine call starts.*/
        onMediaEngineStartCallSuccess: () => void

        /** Occurs when the state of the media stream relay changes.
         *
         * The SDK returns the state of the current media relay with any error
         * message.
         *
         * @param state The state code in #CHANNEL_MEDIA_RELAY_STATE.
         * @param code The error code in #CHANNEL_MEDIA_RELAY_ERROR.
         */
        onChannelMediaRelayStateChanged: (state: CHANNEL_MEDIA_RELAY_STATE, code: CHANNEL_MEDIA_RELAY_ERROR) => void

        /** Reports events during the media stream relay.
         *
         * @param code The event code in #CHANNEL_MEDIA_RELAY_EVENT.
         */
        onChannelMediaRelayEvent: (code: CHANNEL_MEDIA_RELAY_EVENT) => void

        /** Occurs when the engine sends the first local audio frame.

         @deprecated Deprecated as of v3.1.0. Use the \ref IRtcEngineEventHandler::onFirstLocalAudioFramePublished "onFirstLocalAudioFramePublished" callback instead.

         @param elapsed Time elapsed (ms) from the local user calling \ref IRtcEngine::joinChannel "joinChannel" until the SDK triggers this callback.
         */
        onFirstLocalAudioFrame: (elapsed: number) => void

        /** Occurs when the first audio frame is published.
         *
         * @since v3.1.0
         *
         * The SDK triggers this callback under one of the following circumstances:
         * - The local client enables the audio module and calls \ref IRtcEngine::joinChannel "joinChannel" successfully.
         * - The local client calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" and \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(false)" in sequence.
         * - The local client calls \ref IRtcEngine::disableAudio "disableAudio" and \ref IRtcEngine::enableAudio "enableAudio" in sequence.
         *
         * @param elapsed The time elapsed (ms) from the local client calling \ref IRtcEngine::joinChannel "joinChannel" until the SDK triggers this callback.
         */
        onFirstLocalAudioFramePublished: (elapsed: number) => void

        /** Occurs when the engine receives the first audio frame from a specific remote user.

         @deprecated v3.0.0

         This callback is deprecated. Use `onRemoteAudioStateChanged` instead.

         @param uid User ID of the remote user.
         @param elapsed Time elapsed (ms) from the remote user calling \ref IRtcEngine::joinChannel "joinChannel" until the SDK triggers this callback.
         */
        onFirstRemoteAudioFrame: (uid: number, elapsed: number) => void

        /**
         Occurs when the state of the RTMP streaming changes.

         The SDK triggers this callback to report the result of the local user calling the \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" or \ref agora::rtc::IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" method.

         This callback indicates the state of the RTMP streaming. When exceptions occur, you can troubleshoot issues by referring to the detailed error descriptions in the *errCode* parameter.

         @param url The RTMP URL address.
         @param state The RTMP streaming state. See: #RTMP_STREAM_PUBLISH_STATE.
         @param errCode The detailed error information for streaming. See: #RTMP_STREAM_PUBLISH_ERROR.
         */
        onRtmpStreamingStateChanged: (url: string, state: RTMP_STREAM_PUBLISH_STATE, errCode: RTMP_STREAM_PUBLISH_ERROR) => void

        /** Reports events during the RTMP streaming.
         *
         * @since v3.1.0
         *
         * @param url The RTMP streaming URL.
         * @param eventCode The event code. See #RTMP_STREAMING_EVENT
         */
        onRtmpStreamingEvent: (url: string, eventCode: RTMP_STREAMING_EVENT) => void

        /** @deprecated This method is deprecated, use the \ref agora::rtc::IRtcEngineEventHandler::onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" callback instead.

         Reports the result of calling the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method. (CDN live only.)

         @param url The RTMP URL address.
         @param error Error code: #ERROR_CODE_TYPE. Main errors include:
         - #ERR_OK (0): The publishing succeeds.
         - #ERR_FAILED (1): The publishing fails.
         - #ERR_INVALID_ARGUMENT (2): Invalid argument used. If, for example, you did not call \ref agora::rtc::IRtcEngine::setLiveTranscoding "setLiveTranscoding" to configure LiveTranscoding before calling \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl", the SDK reports #ERR_INVALID_ARGUMENT.
         - #ERR_TIMEDOUT (10): The publishing timed out.
         - #ERR_ALREADY_IN_USE (19): The chosen URL address is already in use for CDN live streaming.
         - #ERR_RESOURCE_LIMITED (22): The backend system does not have enough resources for the CDN live streaming.
         - #ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH (130): You cannot publish an encrypted stream.
         - #ERR_PUBLISH_STREAM_CDN_ERROR (151)
         - #ERR_PUBLISH_STREAM_NUM_REACH_LIMIT (152)
         - #ERR_PUBLISH_STREAM_NOT_AUTHORIZED (153)
         - #ERR_PUBLISH_STREAM_INTERNAL_SERVER_ERROR (154)
         - #ERR_PUBLISH_STREAM_FORMAT_NOT_SUPPORTED (156)
         */
        onStreamPublished: (url: string, error: number) => void

        /** @deprecated This method is deprecated, use the \ref agora::rtc::IRtcEngineEventHandler::onRtmpStreamingStateChanged "onRtmpStreamingStateChanged" callback instead.

         Reports the result of calling the \ref agora::rtc::IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" method. (CDN live only.)

         This callback indicates whether you have successfully removed an RTMP stream from the CDN.

         @param url The RTMP URL address.
         */
        onStreamUnpublished: (url: string) => void

        /** Occurs when the publisher's transcoding is updated.
         *
         * When the `LiveTranscoding` class in the \ref agora::rtc::IRtcEngine::setLiveTranscoding "setLiveTranscoding" method updates, the SDK triggers the `onTranscodingUpdated` callback to report the update information to the local host.
         *
         * @note If you call the `setLiveTranscoding` method to set the LiveTranscoding class for the first time, the SDK does not trigger the `onTranscodingUpdated` callback.
         *
         */
        onTranscodingUpdated: () => void

        /** Occurs when a voice or video stream URL address is added to the live interactive streaming.

         @param url Pointer to the URL address of the externally injected stream.
         @param uid User ID.
         @param status State of the externally injected stream: #INJECT_STREAM_STATUS.
         */
        onStreamInjectedStatus: (url: string, uid: number, status: INJECT_STREAM_STATUS) => void

        /** Occurs when the local audio route changes.

         The SDK triggers this callback when the local audio route switches to an earpiece, speakerphone, headset, or Bluetooth device.

         @note This callback is for Android and iOS only.

         @param routing Audio output routing. See: #AUDIO_ROUTE_TYPE.
         */
        onAudioRouteChanged: (routing: AUDIO_ROUTE_TYPE) => void

        /** Occurs when the published media stream falls back to an audio-only stream due to poor network conditions or switches back to the video after the network conditions improve.

         If you call \ref IRtcEngine::setLocalPublishFallbackOption "setLocalPublishFallbackOption" and set *option* as #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK triggers this callback when the
         published stream falls back to audio-only mode due to poor uplink conditions, or when the audio stream switches back to the video after the uplink network condition improves.
         @note If the local stream fallbacks to the audio-only stream, the remote user receives the \ref IRtcEngineEventHandler::onUserMuteVideo "onUserMuteVideo" callback.

         @param isFallbackOrRecover Whether the published stream falls back to audio-only or switches back to the video:
         - true: The published stream falls back to audio-only due to poor network conditions.
         - false: The published stream switches back to the video after the network conditions improve.
         */
        onLocalPublishFallbackToAudioOnly: (isFallbackOrRecover: boolean) => void

        /** Occurs when the remote media stream falls back to audio-only stream
         * due to poor network conditions or switches back to the video stream
         * after the network conditions improve.
         *
         * If you call
         * \ref IRtcEngine::setRemoteSubscribeFallbackOption
         * "setRemoteSubscribeFallbackOption" and set
         * @p option as #STREAM_FALLBACK_OPTION_AUDIO_ONLY, the SDK triggers this
         * callback when the remote media stream falls back to audio-only mode due
         * to poor uplink conditions, or when the remote media stream switches
         * back to the video after the uplink network condition improves.
         *
         * @note Once the remote media stream switches to the low stream due to
         * poor network conditions, you can monitor the stream switch between a
         * high and low stream in the RemoteVideoStats callback.
         *
         * @param uid ID of the remote user sending the stream.
         * @param isFallbackOrRecover Whether the remotely subscribed media stream
         * falls back to audio-only or switches back to the video:
         * - true: The remotely subscribed media stream falls back to audio-only
         * due to poor network conditions.
         * - false: The remotely subscribed media stream switches back to the
         * video stream after the network conditions improved.
         */
        onRemoteSubscribeFallbackToAudioOnly: (uid: number, isFallbackOrRecover: boolean) => void

        /** Reports the transport-layer statistics of each remote audio stream.
         *
         * @deprecated
         * This callback is deprecated and replaced by the
         * \ref onRemoteAudioStats() "onRemoteAudioStats" callback.
         *
         * This callback reports the transport-layer statistics, such as the
         * packet loss rate and network time delay, once every two seconds after
         * the local user receives an audio packet from a remote user.
         *
         * @param uid  User ID of the remote user sending the audio packet.
         * @param delay Network time delay (ms) from the remote user sending the
         * audio packet to the local user.
         * @param lost Packet loss rate (%) of the audio packet sent from the
         * remote user.
         * @param rxKBitRate  Received bitrate (Kbps) of the audio packet sent
         * from the remote user.
         */
        onRemoteAudioTransportStats: (uid: number, delay: number, lost: number, rxKBitRate: number) => void

        /** Reports the transport-layer statistics of each remote video stream.
         *
         * @deprecated
         * This callback is deprecated and replaced by the
         * \ref onRemoteVideoStats() "onRemoteVideoStats" callback.
         *
         * This callback reports the transport-layer statistics, such as the
         * packet loss rate and network time delay, once every two seconds after
         * the local user receives a video packet from a remote user.
         *
         * @param uid User ID of the remote user sending the video packet.
         * @param delay Network time delay (ms) from the remote user sending the
         * video packet to the local user.
         * @param lost Packet loss rate (%) of the video packet sent from the
         * remote user.
         * @param rxKBitRate Received bitrate (Kbps) of the video packet sent
         * from the remote user.
         */
        onRemoteVideoTransportStats: (uid: number, delay: number, lost: number, rxKBitRate: number) => void

        /** Occurs when the microphone is enabled/disabled.
         *
         * @deprecated v2.9.0
         *
         * The \ref onMicrophoneEnabled() "onMicrophoneEnabled" callback is
         * deprecated. Use #LOCAL_AUDIO_STREAM_STATE_STOPPED (0) or
         * #LOCAL_AUDIO_STREAM_STATE_RECORDING (1) in the
         * \ref onLocalAudioStateChanged() "onLocalAudioStateChanged" callback
         * instead.
         *
         * The SDK triggers this callback when the local user resumes or stops
         * capturing the local audio stream by calling the
         * \ref agora::rtc::IRtcEngine::enableLocalAudio "enbaleLocalAudio" method.
         *
         * @param enabled Whether the microphone is enabled/disabled:
         * - true: Enabled.
         * - false: Disabled.
         */
        onMicrophoneEnabled: (enabled: boolean) => void

        /** Occurs when the connection state between the SDK and the server changes.

         @param state See #CONNECTION_STATE_TYPE.
         @param reason See #CONNECTION_CHANGED_REASON_TYPE.
         */
        onConnectionStateChanged: (state: CONNECTION_STATE_TYPE, reason: CONNECTION_CHANGED_REASON_TYPE) => void

        /** Occurs when the local network type changes.

         When the network connection is interrupted, this callback indicates whether the interruption is caused by a network type change or poor network conditions.

         @param type See #NETWORK_TYPE.
         */
        onNetworkTypeChanged: (type: NETWORK_TYPE) => void

        /** Occurs when the local user successfully registers a user account by calling the \ref agora::rtc::IRtcEngine::registerLocalUserAccount "registerLocalUserAccount" method or joins a channel by calling the \ref agora::rtc::IRtcEngine::joinChannelWithUserAccount "joinChannelWithUserAccount" method.This callback reports the user ID and user account of the local user.

         @param uid The ID of the local user.
         @param userAccount The user account of the local user.
         */
        onLocalUserRegistered: (uid: number, userAccount: string) => void

        /** Occurs when the SDK gets the user ID and user account of the remote user.

         After a remote user joins the channel, the SDK gets the UID and user account of the remote user,
         caches them in a mapping table object (`userInfo`), and triggers this callback on the local client.

         @param uid The ID of the remote user.
         @param info The `UserInfo` object that contains the user ID and user account of the remote user.
         */
        onUserInfoUpdated: (uid: number, info: UserInfo) => void

        /** Occurs when the local user receives the metadata.

         @param metadata The received Metadata.
         */
        onMetadataReceived: (metadata: Metadata) => void
    }

    let bridge: agoraCreator
    let client: AgoraRTC.Client
    let localStream: AgoraRTC.Stream
    let remoteStreams = new Map<string | number, AgoraRTC.Stream>()

    if (!isWeb) {
        bridge = new agoraCreator()
    }

    function initNativeEvent() {
        bridge.onWarning = function (warn, msg) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onWarning', JSON.stringify({warn, msg}))
            }
            event.emit('warning', warn, msg)
        }
        bridge.onError = function (err, msg) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onError', JSON.stringify({err, msg}))
            }
            event.emit('error', err, msg)
        }
        bridge.onJoinChannelSuccess = function (channel, uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onJoinChannelSuccess', JSON.stringify({channel, uid, elapsed}))
            }
            event.emit('join-channel-success', channel, uid, elapsed)
            event.emit('joinChannelSuccess', channel, uid, elapsed)
        }
        bridge.onRejoinChannelSuccess = function (channel, uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRejoinChannelSuccess', JSON.stringify({channel, uid, elapsed}))
            }
            event.emit('rejoin-channel-success', channel, uid, elapsed)
            event.emit('rejoinChannelSuccess', channel, uid, elapsed)
        }
        bridge.onLeaveChannel = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLeaveChannel', JSON.stringify({stats}))
            }
            event.emit('leave-channel', stats)
            event.emit('leaveChannel', stats)
        }
        bridge.onClientRoleChanged = function (oldRole, newRole) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onClientRoleChanged', JSON.stringify({oldRole, newRole}))
            }
            event.emit('client-role-changed', oldRole, newRole)
            event.emit('clientRoleChanged', oldRole, newRole)
        }
        bridge.onUserJoined = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserJoined', JSON.stringify({uid, elapsed}))
            }
            event.emit('user-joined', uid, elapsed)
            event.emit('userJoined', uid, elapsed)
        }
        bridge.onUserOffline = function (uid, reason) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserOffline', JSON.stringify({uid, reason}))
            }
            event.emit('user-offline', uid, reason)
            event.emit('userOffline', uid, reason)
        }
        bridge.onLastmileQuality = function (quality) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLastmileQuality', JSON.stringify({quality}))
            }
            event.emit('lastmileQuality', quality)
        }
        bridge.onLastmileProbeResult = function (result) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLastmileProbeResult', JSON.stringify({result}))
            }
            event.emit('lastmileProbeResult', result)
        }
        bridge.onConnectionInterrupted = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionInterrupted', JSON.stringify({}))
            }
            event.emit('connection-interrupted')
            event.emit('connectionInterrupted')
        }
        bridge.onConnectionLost = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionLost', JSON.stringify({}))
            }
            event.emit('connection-lost')
            event.emit('connectionLost')
        }
        bridge.onConnectionBanned = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionBanned', JSON.stringify({}))
            }
            event.emit('connection-banned')
            event.emit('connectionBanned')
        }
        bridge.onApiCallExecuted = function (err, api, result) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onApiCallExecuted', JSON.stringify({err, api, result}))
            }
            event.emit('apiCallExecuted', err, api, result)
        }
        bridge.onRequestToken = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRequestToken', JSON.stringify({}))
            }
            event.emit('request-token')
            event.emit('requestToken')
        }
        bridge.onTokenPrivilegeWillExpire = function (token) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onTokenPrivilegeWillExpire', JSON.stringify({token}))
            }
            event.emit('tokenPrivilegeWillExpire', token)
        }
        bridge.onAudioQuality = function (uid, quality, delay, lost) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioQuality', JSON.stringify({uid, quality, delay, lost}))
            }
            event.emit('audio-quality', uid, quality, delay, lost)
            event.emit('audioQuality', uid, quality, delay, lost)
        }
        bridge.onRtcStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtcStats', JSON.stringify({stats}))
            }
            event.emit('rtcStats', stats)
        }
        bridge.onNetworkQuality = function (uid, txQuality, rxQuality) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onNetworkQuality', JSON.stringify({uid, txQuality, rxQuality}))
            }
            event.emit('network-quality', uid, txQuality, rxQuality)
            event.emit('networkQuality', uid, txQuality, rxQuality)
        }
        bridge.onLocalVideoStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalVideoStats', JSON.stringify({stats}))
            }
            event.emit('localVideoStats', stats)
        }
        bridge.onRemoteVideoStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoStats', JSON.stringify({stats}))
            }
            event.emit('remoteVideoStats', stats)
        }
        bridge.onLocalAudioStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalAudioStats', JSON.stringify({stats}))
            }
            event.emit('localAudioStats', stats)
        }
        bridge.onRemoteAudioStats = function (stats) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioStats', JSON.stringify({stats}))
            }
            event.emit('remoteAudioStats', stats)
        }
        bridge.onLocalAudioStateChanged = function (state, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalAudioStateChanged', JSON.stringify({state, error}))
            }
            event.emit('localAudioStateChanged', state, error)
        }
        bridge.onRemoteAudioStateChanged = function (uid, state, reason, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioStateChanged', JSON.stringify({uid, state, reason, elapsed}))
            }
            event.emit('remoteAudioStateChanged', uid, state, reason, elapsed)
        }
        bridge.onAudioPublishStateChanged = function (channel, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioPublishStateChanged', JSON.stringify({
                    channel,
                    oldState,
                    newState,
                    elapseSinceLastState
                }))
            }
            event.emit('audioPublishStateChanged', channel, oldState, newState, elapseSinceLastState)
        }
        bridge.onVideoPublishStateChanged = function (channel, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoPublishStateChanged', JSON.stringify({
                    channel,
                    oldState,
                    newState,
                    elapseSinceLastState
                }))
            }
            event.emit('videoPublishStateChanged', channel, oldState, newState, elapseSinceLastState)
        }
        bridge.onAudioSubscribeStateChanged = function (channel, uid, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioSubscribeStateChanged', JSON.stringify({
                    channel,
                    oldState,
                    newState,
                    elapseSinceLastState
                }))
            }
            event.emit('audioSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState)
        }
        bridge.onVideoSubscribeStateChanged = function (channel, uid, oldState, newState, elapseSinceLastState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoSubscribeStateChanged', JSON.stringify({
                    channel,
                    oldState,
                    newState,
                    elapseSinceLastState
                }))
            }
            event.emit('videoSubscribeStateChanged', channel, uid, oldState, newState, elapseSinceLastState)
        }
        bridge.onAudioVolumeIndication = function (speakers, speakerNumber, totalVolume) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioVolumeIndication', JSON.stringify({
                    speakers,
                    speakerNumber,
                    totalVolume
                }))
            }
            event.emit('audio-volume-indication', speakers, speakerNumber, totalVolume)
            event.emit('audioVolumeIndication', speakers, speakerNumber, totalVolume)
        }
        bridge.onActiveSpeaker = function (uid) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onActiveSpeaker', JSON.stringify({uid}))
            }
            event.emit('activeSpeaker', uid)
        }
        bridge.onVideoStopped = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoStopped', JSON.stringify({}))
            }
            event.emit('videoStopped')
        }
        bridge.onFirstLocalVideoFrame = function (width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalVideoFrame', JSON.stringify({width, height, elapsed}))
            }
            event.emit('firstLocalVideoFrame', width, height, elapsed)
        }
        bridge.onFirstLocalVideoFramePublished = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalVideoFramePublished', JSON.stringify({elapsed}))
            }
            event.emit('firstLocalVideoFramePublished', elapsed)
        }
        bridge.onFirstRemoteVideoDecoded = function (uid, width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteVideoDecoded', JSON.stringify({uid, width, height, elapsed}))
            }
            event.emit('firstRemoteVideoDecoded', uid, width, height, elapsed)
        }
        bridge.onFirstRemoteVideoFrame = function (uid, width, height, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteVideoFrame', JSON.stringify({uid, width, height, elapsed}))
            }
            event.emit('firstRemoteVideoFrame', uid, width, height, elapsed)
        }
        bridge.onUserMuteAudio = function (uid, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserMuteAudio', JSON.stringify({uid, muted}))
            }
            event.emit('user-mute-audio', uid, muted)
            event.emit('userMuteAudio', uid, muted)
        }
        bridge.onUserMuteVideo = function (uid, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserMuteVideo', JSON.stringify({uid, muted}))
            }
            event.emit('userMuteVideo', uid, muted)
        }
        bridge.onUserEnableVideo = function (uid, enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserEnableVideo', JSON.stringify({uid, enabled}))
            }
            event.emit('userEnableVideo', uid, enabled)
        }
        bridge.onAudioDeviceStateChanged = function (deviceId, deviceType, deviceState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioDeviceStateChanged', JSON.stringify({
                    deviceId,
                    deviceType,
                    deviceState
                }))
            }
            event.emit('audioDeviceStateChanged', deviceId, deviceType, deviceState)
        }
        bridge.onAudioDeviceVolumeChanged = function (deviceType, volume, muted) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioDeviceVolumeChanged', JSON.stringify({deviceType, volume, muted}))
            }
            event.emit('audioDeviceVolumeChanged', deviceType, volume, muted)
        }
        bridge.onCameraReady = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraReady', JSON.stringify({}))
            }
            event.emit('cameraReady')
        }
        bridge.onCameraFocusAreaChanged = function (x, y, width, height) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraFocusAreaChanged', JSON.stringify({x, y, width, height}))
            }
            event.emit('cameraFocusAreaChanged', x, y, width, height)
        }
        bridge.onFacePositionChanged = function (imageWidth, imageHeight, vecRectangle, vecDistance, numFaces) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFacePositionChanged', JSON.stringify({
                    imageWidth,
                    imageHeight,
                    vecRectangle,
                    vecDistance,
                    numFaces
                }))
            }
            event.emit('facePositionChanged', imageWidth, imageHeight, vecRectangle, vecDistance, numFaces)
        }
        bridge.onCameraExposureAreaChanged = function (x, y, width, height) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onCameraExposureAreaChanged', JSON.stringify({x, y, width, height}))
            }
            event.emit('cameraExposureAreaChanged', x, y, width, height)
        }
        bridge.onAudioMixingFinished = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioMixingFinished', JSON.stringify({}))
            }
            event.emit('audioMixingFinished')
        }
        bridge.onAudioMixingStateChanged = function (state, errorCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioMixingStateChanged', JSON.stringify({state, errorCode}))
            }
            event.emit('audioMixingStateChanged', state, errorCode)
        }
        bridge.onRemoteAudioMixingBegin = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioMixingBegin', JSON.stringify({}))
            }
            event.emit('remoteAudioMixingBegin')
        }
        bridge.onRemoteAudioMixingEnd = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioMixingEnd', JSON.stringify({}))
            }
            event.emit('remoteAudioMixingEnd')
        }
        bridge.onAudioEffectFinished = function (soundId) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioEffectFinished', JSON.stringify({soundId}))
            }
            event.emit('audioEffectFinished', soundId)
        }
        bridge.onFirstRemoteAudioDecoded = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteAudioDecoded', JSON.stringify({uid, elapsed}))
            }
            event.emit('firstRemoteAudioDecoded', uid, elapsed)
        }
        bridge.onVideoDeviceStateChanged = function (deviceId, deviceType, deviceState) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoDeviceStateChanged', JSON.stringify({
                    deviceId,
                    deviceType,
                    deviceState
                }))
            }
            event.emit('videoDeviceStateChanged', deviceId, deviceType, deviceState)
        }
        bridge.onLocalVideoStateChanged = function (localVideoState, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalVideoStateChanged', JSON.stringify({localVideoState, error}))
            }
            event.emit('localVideoStateChanged', localVideoState, error)
        }
        bridge.onVideoSizeChanged = function (uid, width, height, rotation) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onVideoSizeChanged', JSON.stringify({uid, width, height, rotation}))
            }
            event.emit('videoSizeChanged', uid, width, height, rotation)
        }
        bridge.onRemoteVideoStateChanged = function (uid, state, reason, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoStateChanged', JSON.stringify({uid, state, reason, elapsed}))
            }
            event.emit('remoteVideoStateChanged', uid, state, reason, elapsed)
        }
        bridge.onUserEnableLocalVideo = function (uid, enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserEnableLocalVideo', JSON.stringify({uid, enabled}))
            }
            event.emit('userEnableLocalVideo', uid, enabled)
        }
        bridge.onStreamMessage = function (uid, streamId, data, length) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamMessage', JSON.stringify({
                    uid,
                    streamId,
                    data: String.fromCharCode.apply(null, data),
                    length
                }))
            }
            event.emit('streamMessage', uid, streamId, data, length)
        }
        bridge.onStreamMessageError = function (uid, streamId, code, missed, cached) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamMessageError', JSON.stringify({uid, streamId, code, missed, cached}))
            }
            event.emit('streamMessageError', uid, streamId, code, missed, cached)
        }
        bridge.onMediaEngineLoadSuccess = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMediaEngineLoadSuccess', JSON.stringify({}))
            }
            event.emit('mediaEngineLoadSuccess')
        }
        bridge.onMediaEngineStartCallSuccess = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMediaEngineStartCallSuccess', JSON.stringify({}))
            }
            event.emit('mediaEngineStartCallSuccess')
        }
        bridge.onChannelMediaRelayStateChanged = function (state, code) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onChannelMediaRelayStateChanged', JSON.stringify({state, code}))
            }
            event.emit('channelMediaRelayStateChanged', state, code)
        }
        bridge.onChannelMediaRelayEvent = function (code) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onChannelMediaRelayEvent', JSON.stringify({code}))
            }
            event.emit('channelMediaRelayEvent', code)
        }
        bridge.onFirstLocalAudioFrame = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalAudioFrame', JSON.stringify({elapsed}))
            }
            event.emit('firstLocalAudioFrame', elapsed)
        }
        bridge.onFirstLocalAudioFramePublished = function (elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstLocalAudioFramePublished', JSON.stringify({elapsed}))
            }
            event.emit('firstLocalAudioFramePublished', elapsed)
        }
        bridge.onFirstRemoteAudioFrame = function (uid, elapsed) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onFirstRemoteAudioFrame', JSON.stringify({uid, elapsed}))
            }
            event.emit('firstRemoteAudioFrame', uid, elapsed)
        }
        bridge.onRtmpStreamingStateChanged = function (url, state, errCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtmpStreamingStateChanged', JSON.stringify({url, state, errCode}))
            }
            event.emit('rtmpStreamingStateChanged', url, state, errCode)
        }
        bridge.onRtmpStreamingEvent = function (url, eventCode) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRtmpStreamingEvent', JSON.stringify({url, eventCode}))
            }
            event.emit('rtmpStreamingEvent', url, eventCode)
        }
        bridge.onStreamPublished = function (url, error) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamPublished', JSON.stringify({url, error}))
            }
            event.emit('streamPublished', url, error)
        }
        bridge.onStreamUnpublished = function (url) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamUnpublished', JSON.stringify({url}))
            }
            event.emit('streamUnpublished', url)
        }
        bridge.onTranscodingUpdated = function () {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onTranscodingUpdated', JSON.stringify({}))
            }
            event.emit('transcodingUpdated')
        }
        bridge.onStreamInjectedStatus = function (url, uid, status) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onStreamInjectedStatus', JSON.stringify({url, uid, status}))
            }
            event.emit('streamInjectedStatus', url, uid, status)
        }
        bridge.onAudioRouteChanged = function (routing) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onAudioRouteChanged', JSON.stringify({routing}))
            }
            event.emit('audio-routing-changed', routing)
            event.emit('audioRouteChanged', routing)
        }
        bridge.onLocalPublishFallbackToAudioOnly = function (isFallbackOrRecover) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalPublishFallbackToAudioOnly', JSON.stringify({isFallbackOrRecover}))
            }
            event.emit('localPublishFallbackToAudioOnly', isFallbackOrRecover)
        }
        bridge.onRemoteSubscribeFallbackToAudioOnly = function (uid, isFallbackOrRecover) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteSubscribeFallbackToAudioOnly', JSON.stringify({
                    uid,
                    isFallbackOrRecover
                }))
            }
            event.emit('remoteSubscribeFallbackToAudioOnly', uid, isFallbackOrRecover)
        }
        bridge.onRemoteAudioTransportStats = function (uid, delay, lost, rxKBitRate) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteAudioTransportStats', JSON.stringify({uid, delay, lost, rxKBitRate}))
            }
            event.emit('remoteAudioTransportStats', uid, delay, lost, rxKBitRate)
        }
        bridge.onRemoteVideoTransportStats = function (uid, delay, lost, rxKBitRate) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onRemoteVideoTransportStats', JSON.stringify({uid, delay, lost, rxKBitRate}))
            }
            event.emit('remoteVideoTransportStats', uid, delay, lost, rxKBitRate)
        }
        bridge.onMicrophoneEnabled = function (enabled) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMicrophoneEnabled', JSON.stringify({enabled}))
            }
            event.emit('microphoneEnabled', enabled)
        }
        bridge.onConnectionStateChanged = function (state, reason) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onConnectionStateChanged', JSON.stringify({state, reason}))
            }
            event.emit('connectionStateChanged', state, reason)
        }
        bridge.onNetworkTypeChanged = function (type) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onNetworkTypeChanged', JSON.stringify({type}))
            }
            event.emit('networkTypeChanged', type)
        }
        bridge.onLocalUserRegistered = function (uid, userAccount) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onLocalUserRegistered', JSON.stringify({uid, userAccount}))
            }
            event.emit('localUserRegistered', uid, userAccount)
        }
        bridge.onUserInfoUpdated = function (uid, info) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onUserInfoUpdated', JSON.stringify({uid, info}))
            }
            event.emit('userInfoUpdated', uid, info)
        }
        bridge.onMetadataReceived = function ({uid, size, buffer, timeStampMs}) {
            if (bridge.logEngineEventCase) {
                bridge.logEngineEventCase('onMetadataReceived', JSON.stringify({
                    uid,
                    size,
                    buffer: String.fromCharCode.apply(null, buffer),
                    timeStampMs
                }))
            }
            event.emit('metadataReceived', {uid, size, buffer, timeStampMs})
        }
    }

    function initWebEvent() {
        client.on('first-audio-frame-decode', (evt: { stream: AgoraRTC.Stream }) => {
            event.emit('firstRemoteAudioDecoded', evt.stream.getId(), 0)
        })
        client.on('first-video-frame-decode', (evt: { stream: AgoraRTC.Stream }) => {
            evt.stream.getStats((stats) => {
                event.emit('firstRemoteVideoDecoded', evt.stream.getId(), (stats as AgoraRTC.RemoteStreamStats).videoReceiveResolutionWidth, (stats as AgoraRTC.RemoteStreamStats).videoReceiveResolutionHeight, 0)
            })
        })
        client.on('stream-published', (evt: { stream: AgoraRTC.Stream }) => {
            event.emit('firstLocalAudioFramePublished', 0)
            event.emit('firstLocalVideoFramePublished', 0)
        })
        client.on('stream-unpublished', (evt: { stream: AgoraRTC.Stream, options: { streamType: REMOTE_VIDEO_STREAM_TYPE } }) => {
            event.emit('localAudioStateChanged', LOCAL_AUDIO_STREAM_STATE.LOCAL_AUDIO_STREAM_STATE_STOPPED, LOCAL_AUDIO_STREAM_ERROR.LOCAL_AUDIO_STREAM_ERROR_OK)
            event.emit('localVideoStateChanged', LOCAL_VIDEO_STREAM_STATE.LOCAL_VIDEO_STREAM_STATE_STOPPED, LOCAL_VIDEO_STREAM_ERROR.LOCAL_VIDEO_STREAM_ERROR_OK)
        })
        client.on('stream-added', (evt: { stream: AgoraRTC.Stream }) => {
            client.subscribe(evt.stream)
            remoteStreams.set(evt.stream.getId(), evt.stream)

            event.emit('remoteAudioStateChanged', evt.stream.getId(), REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STARTING, REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_INTERNAL, 0)
            event.emit('remoteVideoStateChanged', evt.stream.getId(), REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STARTING, REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_INTERNAL, 0)
        })
        client.on('stream-removed', (evt: { uid: string, stream: AgoraRTC.Stream }) => {
            client.unsubscribe(evt.stream)
            remoteStreams.delete(evt.stream.getId())

            event.emit('remoteAudioStateChanged', evt.stream.getId(), REMOTE_AUDIO_STATE.REMOTE_AUDIO_STATE_STOPPED, REMOTE_AUDIO_STATE_REASON.REMOTE_AUDIO_REASON_INTERNAL, 0)
            event.emit('remoteVideoStateChanged', evt.stream.getId(), REMOTE_VIDEO_STATE.REMOTE_VIDEO_STATE_STOPPED, REMOTE_VIDEO_STATE_REASON.REMOTE_VIDEO_STATE_REASON_INTERNAL, 0)
        })
        client.on('stream-subscribed', (evt: { stream: AgoraRTC.Stream }) => {
            evt.stream.play('Cocos2dGameContainer');

            event.emit('audioSubscribeStateChanged', undefined, evt.stream.getId(), STREAM_SUBSCRIBE_STATE.SUB_STATE_IDLE, STREAM_SUBSCRIBE_STATE.SUB_STATE_SUBSCRIBED, 0)
            event.emit('videoSubscribeStateChanged', undefined, evt.stream.getId(), STREAM_SUBSCRIBE_STATE.SUB_STATE_IDLE, STREAM_SUBSCRIBE_STATE.SUB_STATE_SUBSCRIBED, 0)
        })
        client.on('peer-online', (evt) => {
            event.emit('user-joined', evt.uid, 0)
            event.emit('userJoined', evt.uid, 0)
        })
        client.on('peer-leave', (evt) => {
            event.emit('user-offline', evt.uid, evt.reason, 0)
            event.emit('userOffline', evt.uid, evt.reason, 0)
        })
        client.on('mute-audio', (evt: { uid: string }) => {
            event.emit('user-mute-audio', evt.uid, true)
            event.emit('userMuteAudio', evt.uid, true)
        })
        client.on('unmute-audio', (evt: { uid: string }) => {
            event.emit('user-mute-audio', evt.uid, false)
            event.emit('userMuteAudio', evt.uid, false)
        })
        client.on('mute-video', (evt: { uid: string }) => {
            event.emit('userMuteVideo', evt.uid, true)
        })
        client.on('unmute-video', (evt: { uid: string }) => {
            event.emit('userMuteVideo', evt.uid, false)
        })
        client.on('crypt-error', (evt: { cryptType: string }) => {
        })
        client.on('client-banned', (evt: { uid: string, attr: string }) => {
            event.emit('connection-banned')
            event.emit('connectionBanned')
        })
        client.on('active-speaker', (evt: { uid: string }) => {
            event.emit('activeSpeaker', evt.uid)
        })
        client.on('volume-indicator', (evt: { attr: { uid: string, level: number }[] }) => {
            const speakers = []
            let sumVolume = 0
            evt.attr.forEach(function ({uid, level}, index) {
                speakers.push({uid, volume: level})
                sumVolume += level
            });
            event.emit('audio-volume-indication', speakers, speakers.length, sumVolume / speakers.length)
            event.emit('audioVolumeIndication', speakers, speakers.length, sumVolume / speakers.length)
        })
        client.on('liveStreamingStarted', (evt: { url: string }) => {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_RUNNING, null)
        })
        client.on('liveStreamingFailed', (evt: { url: string }) => {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_FAILURE, null)
        })
        client.on('liveStreamingStopped', (evt: { url: string }) => {
            event.emit('rtmpStreamingStateChanged', evt.url, RTMP_STREAM_PUBLISH_STATE.RTMP_STREAM_PUBLISH_STATE_IDLE, null)
        })
        client.on('liveTranscodingUpdated', (evt: { reason: string }) => {
            event.emit('transcodingUpdated')
        })
        client.on('streamInjectedStatus', (evt: { url: string, uid: string, status: INJECT_STREAM_STATUS }) => {
            event.emit('streamInjectedStatus', evt.url, evt.uid, evt.status)
        })
        client.on('onTokenPrivilegeWillExpire', (evt) => {
            event.emit('tokenPrivilegeWillExpire')
        })
        client.on('onTokenPrivilegeDidExpire', (evt) => {
        })
        client.on('error', (evt) => {
            event.emit('error', ERROR_CODE_TYPE.ERR_FAILED, evt.reason)
        })
        client.on('network-type-changed', (evt: { networkType: string }) => {
            event.emit('networkTypeChanged', evt.networkType)
        })
        client.on('recording-device-changed', (evt: { device: MediaDeviceInfo, state: string, initAt: number }) => {
            event.emit('recordingDeviceChanged', evt.state, evt.device)
        })
        client.on('playout-device-changed', (evt: { device: MediaDeviceInfo, state: string, initAt: number }) => {
            event.emit('playoutDeviceChanged', evt.state, evt.device)
        })
        client.on('camera-changed', (evt: { device: MediaDeviceInfo, state: string, initAt: number }) => {
        })
        client.on('stream-type-changed', (evt: { uid: string, streamType: number }) => {
        })
        client.on('connection-state-change', (evt) => {
            const state = {
                'DISCONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED,
                'CONNECTING': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING,
                'CONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED,
                'DISCONNECTING': undefined,
            }
            if (state[evt.curState] !== undefined) {
                event.emit('connectionStateChanged', state[evt.curState], null)
            }
        })
        client.on('stream-reconnect-start', (evt) => {
        })
        client.on('stream-reconnect-end', (evt) => {
        })
        client.on('client-role-changed', (evt) => {
            event.emit('client-role-changed', null, evt.role)
            event.emit('clientRoleChanged', null, evt.role)
        })
        client.on('reconnect', () => {
            event.emit('connectionStateChanged', CONNECTION_STATE_TYPE.CONNECTION_STATE_RECONNECTING, null)
        })
        client.on('connected', () => {
            event.emit('connectionStateChanged', CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED, null)
        })
        client.on('network-quality', (stats) => {
            event.emit('networkQuality', 0, stats.uplinkNetworkQuality, stats.downlinkNetworkQuality)
        })
        client.on('stream-fallback', (evt) => {
            event.emit('remoteSubscribeFallbackToAudioOnly', evt.uid, evt.attr === 1)
        })
        client.on('stream-updated', (evt) => {
            // TODO
        })
        client.on('exception', (evt) => {
            event.emit('warning', evt.code, evt.msg)
        })
        client.on('enable-local-video', (evt) => {
            event.emit('userEnableVideo', evt.uid, true)
        })
        client.on('disable-local-video', (evt) => {
            event.emit('userEnableVideo', evt.uid, false)
        })
        client.on('channel-media-relay-event', (evt) => {
            event.emit('channelMediaRelayEvent', evt.code)
        })
        client.on('channel-media-relay-state', (evt) => {
            event.emit('channelMediaRelayStateChanged', evt.state, evt.code)
        })
    }

    function callNativeMethod(apiType: API_TYPE, param: {} = {}, extra?: any): any {
        return bridge.callNativeMethod(apiType, JSON.stringify(param), extra)
    }

    function callNativeMethodAudioEffect(apiType: API_TYPE_AUDIO_EFFECT, param: {} = {}): any {
        return bridge.callNativeMethodAudioEffect(apiType, JSON.stringify(param))
    }

    export function init(appId: string) {
        initWithAreaCode(appId, AREA_CODE.AREA_CODE_GLOBAL)
    }

    export function initWithAreaCode(appId: string, areaCode: AREA_CODE) {
        if (isWeb) {
            const areas = {
                [AREA_CODE.AREA_CODE_CN]: AgoraRTC.AREAS.CHINA,
                [AREA_CODE.AREA_CODE_NA]: AgoraRTC.AREAS.NORTH_AMERICA,
                [AREA_CODE.AREA_CODE_EUR]: AgoraRTC.AREAS.EUROPE,
                [AREA_CODE.AREA_CODE_AS]: AgoraRTC.AREAS.ASIA,
                [AREA_CODE.AREA_CODE_JAPAN]: AgoraRTC.AREAS.JAPAN,
                [AREA_CODE.AREA_CODE_INDIA]: AgoraRTC.AREAS.INDIA,
                [AREA_CODE.AREA_CODE_GLOBAL]: AgoraRTC.AREAS.GLOBAL,
            }
            const config: AgoraRTC.ClientConfig = {
                codec: 'h264',
                mode: 'live',
                areaCode: [areas[areaCode]]
            }
            client = AgoraRTC.createClient(config)
            initWebEvent()
            client.init(appId)
        } else {
            initNativeEvent()
            callNativeMethod(API_TYPE.INITIALIZE, {appId, areaCode})
        }
    }

    export function on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T {
        return event.on(type, callback, target, useCapture)
    }

    export function off(type: string, callback?: Function, target?: any) {
        event.off(type, callback, target)
    }

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
    export function setChannelProfile(profile: CHANNEL_PROFILE_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_CHANNEL_PROFILE, {profile})
    }

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
    export function setClientRole(role: CLIENT_ROLE_TYPE): number {
        if (isWeb) {
            const roles = new Map<CLIENT_ROLE_TYPE, 'audience' | 'host'>([
                [CLIENT_ROLE_TYPE.CLIENT_ROLE_AUDIENCE, 'audience'],
                [CLIENT_ROLE_TYPE.CLIENT_ROLE_BROADCASTER, 'host'],
            ])
            client.setClientRole(roles.get(role))
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.SET_CLIENT_ROLE, {role})
    }

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
    export function joinChannel(token: string, channelId: string, info: string = '', uid: number = 0): number {
        if (isWeb) {
            client.join(token, channelId, uid, (uid) => {
                const spec: AgoraRTC.StreamSpec = {streamID: uid, audio: true, video: true, screen: false}
                localStream = AgoraRTC.createStream(spec)
                localStream.init(() => {
                    localStream.play('Cocos2dGameContainer')
                    client.publish(localStream)
                })

                event.emit('join-channel-success', channelId, uid, 0);
                event.emit('joinChannelSuccess', channelId, uid, 0)
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.JOIN_CHANNEL, {token, channelId, info, uid})
    }

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
    export function switchChannel(token: string, channelId: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SWITCH_CHANNEL, {token, channelId})
    }

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
    export function leaveChannel(): number {
        if (isWeb) {
            client.leave(() => {
                event.emit('leave-channel', null)
                event.emit('leaveChannel', null)
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.LEAVE_CHANNEL)
    }

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
    export function renewToken(token: string): number {
        if (isWeb) {
            client.renewToken(token)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.RE_NEW_TOKEN, {token})
    }

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
    export function registerLocalUserAccount(appId: string, userAccount: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.REGISTER_LOCAL_USER_ACCOUNT, {appId, userAccount})
    }

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
    export function joinChannelWithUserAccount(token: string, channelId: string, userAccount: string): number {
        if (isWeb) {
            client.join(token, channelId, userAccount, (uid) => {
                const spec: AgoraRTC.StreamSpec = {streamID: uid, audio: true, video: true, screen: false}
                localStream = AgoraRTC.createStream(spec)
                localStream.init(() => {
                    localStream.play('Cocos2dGameContainer')
                    client.publish(localStream)
                })

                event.emit('join-channel-success', channelId, uid, 0)
                event.emit('joinChannelSuccess', channelId, uid, 0)
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.JOIN_CHANNEL_WITH_USER_ACCOUNT, {token, channelId, userAccount})
    }

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
    export function getUserInfoByUserAccount(userAccount: string): UserInfo {
        if (isWeb) {
            return null
        }
        return callNativeMethod(API_TYPE.GET_USER_INFO_BY_USER_ACCOUNT, {userAccount})
    }

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
    export function getUserInfoByUid(uid: number): UserInfo {
        if (isWeb) {
            return null
        }
        return callNativeMethod(API_TYPE.GET_USER_INFO_BY_UID, {uid})
    }

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
    export function startEchoTest(intervalInSeconds?: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        if (intervalInSeconds === undefined) {
            return callNativeMethod(API_TYPE.START_ECHO_TEST)
        }
        return callNativeMethod(API_TYPE.START_ECHO_TEST_2, {intervalInSeconds})
    }

    /** Stops the audio call test.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function stopEchoTest(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.STOP_ECHO_TEST)
    }

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
    export function enableVideo(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_VIDEO)
    }

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
    export function disableVideo(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.DISABLE_VIDEO)
    }

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
    export function setVideoProfile(profile: VIDEO_PROFILE_TYPE, swapWidthAndHeight: boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                const profiles = {
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_120P]: '120p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_120P_3]: '120p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P]: '180p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P_3]: '180p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_180P_4]: '180p_4',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P]: '240p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P_3]: '240p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_240P_4]: '240p_4',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P]: '360p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_3]: '360p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_4]: '360p_4',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_6]: '360p_6',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_7]: '360p_7',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_8]: '360p_8',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_9]: '360p_9',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_10]: '360p_10',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_360P_11]: '360p_11',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P]: '480p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_3]: '480p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_4]: '480p_4',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_6]: '480p_6',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_8]: '480p_8',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_9]: '480p_9',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_480P_10]: '480p_10',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P]: '720p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_3]: '720p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_5]: '720p_5',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_720P_6]: '720p_6',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P]: '1080p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P_3]: '1080p_3',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1080P_5]: '1080p_5',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1440P]: '1440p_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_1440P_2]: '1440p_2',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_4K]: '4K_1',
                    [VIDEO_PROFILE_TYPE.VIDEO_PROFILE_LANDSCAPE_4K_3]: '4K_3',
                }
                if (profiles[profile] === undefined) {
                    return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
                } else {
                    localStream.setVideoProfile(profiles[profile])
                    return ERROR_CODE_TYPE.ERR_OK
                }
            }
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_PROFILE, {profile, swapWidthAndHeight})
    }

    /** Sets the video encoder configuration.

     Each video encoder configuration corresponds to a set of video parameters, including the resolution, frame rate, bitrate, and video orientation.

     The parameters specified in this method are the maximum values under ideal network conditions. If the video engine cannot render the video using the specified parameters due to poor network conditions, the parameters further down the list are considered until a successful configuration is found.

     @note If you do not need to set the video encoder configuration after joining the channel, you can call this method before the \ref IRtcEngine::enableVideo "enableVideo" method to reduce the render time of the first video frame.

     @param config Sets the local video encoder configuration. See VideoEncoderConfiguration.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setVideoEncoderConfiguration(config: VideoEncoderConfiguration): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                const configuration: AgoraRTC.VideoEncoderConfiguration = {
                    resolution: {width: config.dimensions.width, height: config.dimensions.height},
                    frameRate: {max: config.frameRate, min: config.minFrameRate},
                    bitrate: {max: config.bitrate, min: config.minBitrate}
                }
                localStream.setVideoEncoderConfiguration(configuration)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_ENCODER_CONFIGURATION, {config})
    }

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
    export function setCameraCapturerConfiguration(config: CameraCapturerConfiguration): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_CAMERA_CAPTURER_CONFIGURATION, {config})
    }

    /** Starts the local video preview before joining the channel.

     Before calling this method, you must:

     - Call the \ref IRtcEngine::setupLocalVideo "setupLocalVideo" method to set up the local preview window and configure the attributes.
     - Call the \ref IRtcEngine::enableVideo "enableVideo" method to enable video.

     @note Once the startPreview method is called to start the local video preview, if you leave the channel by calling the \ref IRtcEngine::leaveChannel "leaveChannel" method, the local video preview remains until you call the \ref IRtcEngine::stopPreview "stopPreview" method to disable it.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function startPreview(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.START_PREVIEW)
    }

    /** Prioritizes a remote user's stream.

     Use this method with the \ref IRtcEngine::setRemoteSubscribeFallbackOption "setRemoteSubscribeFallbackOption" method. If the fallback function is enabled for a subscribed stream, the SDK ensures the high-priority user gets the best possible stream quality.

     @note The Agora SDK supports setting @p userPriority as high for one user only.

     @param  uid  The ID of the remote user.
     @param  userPriority Sets the priority of the remote user. See #PRIORITY_TYPE.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setRemoteUserPriority(uid: number, userPriority: PRIORITY_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_USER_PRIORITY, {uid, userPriority})
    }

    /** Stops the local video preview and disables video.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function stopPreview(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.STOP_PREVIEW)
    }

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
    export function enableAudio(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_AUDIO)
    }

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
    export function enableLocalAudio(enabled: boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (enabled) {
                    localStream.enableAudio()
                } else {
                    localStream.disableAudio()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.ENABLE_LOCAL_AUDIO, {enabled})
    }

    /** Disables the audio module.

     @note
     - This method affects the internal engine and can be called after the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method. You can call this method either before or after joining a channel.
     - This method resets the internal engine and takes some time to take effect. We recommend using the \ref agora::rtc::IRtcEngine::enableLocalAudio "enableLocalAudio" and \ref agora::rtc::IRtcEngine::muteLocalAudioStream "muteLocalAudioStream" methods to capture, process, and send the local audio streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function disableAudio(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.DISABLE_AUDIO)
    }

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
    export function setAudioProfile(profile: AUDIO_PROFILE_TYPE, scenario: AUDIO_SCENARIO_TYPE): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                const profiles = {
                    [AUDIO_PROFILE_TYPE.AUDIO_PROFILE_SPEECH_STANDARD]: 'speech_standard',
                    [AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_STANDARD]: 'music_standard',
                    [AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_STANDARD_STEREO]: 'standard_stereo',
                    [AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_HIGH_QUALITY]: 'high_quality',
                    [AUDIO_PROFILE_TYPE.AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO]: 'high_quality_stereo',
                }
                if (profiles[profile] === undefined) {
                    return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
                } else {
                    localStream.setAudioProfile(profiles[profile])
                    return ERROR_CODE_TYPE.ERR_OK
                }
            }
        }
        return callNativeMethod(API_TYPE.SET_AUDIO_PROFILE, {profile, scenario})
    }

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
    export function muteLocalAudioStream(mute: boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (mute) {
                    localStream.muteAudio()
                } else {
                    localStream.unmuteAudio()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.MUTE_LOCAL_AUDIO_STREAM, {mute})
    }

    /** Stops/Resumes receiving all remote users' audio streams.

     @param mute Sets whether to receive/stop receiving all remote users' audio streams.
     - true: Stops receiving all remote users' audio streams.
     - false: (Default) Receives all remote users' audio streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function muteAllRemoteAudioStreams(mute: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.MUTE_ALL_REMOTE_AUDIO_STREAMS, {mute})
    }

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
    export function setDefaultMuteAllRemoteAudioStreams(mute: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS, {mute})
    }

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
    export function adjustUserPlaybackSignalVolume(uid: number, volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ADJUST_USER_PLAYBACK_SIGNAL_VOLUME, {uid, volume})
    }

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
    export function muteRemoteAudioStream(userId: number, mute: boolean): number {
        if (isWeb) {
            const stream = remoteStreams.get(userId)
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (mute) {
                    stream.muteAudio()
                } else {
                    stream.unmuteAudio()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.MUTE_REMOTE_AUDIO_STREAM, {userId, mute})
    }

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
    export function muteLocalVideoStream(mute: boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (mute) {
                    localStream.muteVideo()
                } else {
                    localStream.unmuteVideo()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.MUTE_LOCAL_VIDEO_STREAM, {mute})
    }

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
    export function enableLocalVideo(enabled: boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (enabled) {
                    localStream.enableVideo()
                } else {
                    localStream.disableVideo()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.ENABLE_LOCAL_VIDEO, {enabled})
    }

    /** Stops/Resumes receiving all video stream from a specified remote user.

     @param  mute Sets whether to receive/stop receiving all remote users' video streams:
     - true: Stop receiving all remote users' video streams.
     - false: (Default) Receive all remote users' video streams.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function muteAllRemoteVideoStreams(mute: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.MUTE_ALL_REMOTE_VIDEO_STREAMS, {mute})
    }

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
    export function setDefaultMuteAllRemoteVideoStreams(mute: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS, {mute})
    }

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
    export function muteRemoteVideoStream(userId: number, mute: boolean): number {
        if (isWeb) {
            const stream = remoteStreams.get(userId)
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                if (mute) {
                    stream.muteVideo()
                } else {
                    stream.unmuteVideo()
                }
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.MUTE_REMOTE_VIDEO_STREAM, {userId, mute})
    }

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
    export function setRemoteVideoStreamType(userId: number, streamType: REMOTE_VIDEO_STREAM_TYPE): number {
        if (isWeb) {
            const stream = remoteStreams.get(userId)
            if (stream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                client.setRemoteVideoStreamType(stream, streamType)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_VIDEO_STREAM_TYPE, {userId, streamType})
    }

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
    export function setRemoteDefaultVideoStreamType(streamType: REMOTE_VIDEO_STREAM_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE, {streamType})
    }

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
    export function enableAudioVolumeIndication(interval: number, smooth: number, report_vad: boolean): number {
        if (isWeb) {
            client.enableAudioVolumeIndicator()
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.ENABLE_AUDIO_VOLUME_INDICATION, {interval, smooth, report_vad})
    }

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
    export function startAudioRecording(filePath: string, quality: AUDIO_RECORDING_QUALITY_TYPE, sampleRate?: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        if (sampleRate === undefined) {
            return callNativeMethod(API_TYPE.START_AUDIO_RECORDING, {filePath, quality})
        }
        return callNativeMethod(API_TYPE.START_AUDIO_RECORDING2, {filePath, sampleRate, quality})
    }

    /** Stops an audio recording on the client.

     You can call this method before calling the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method else, the recording automatically stops when the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method is called.

     @return
         - 0: Success
     - < 0: Failure.
     */
    export function stopAudioRecording(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.STOP_AUDIO_RECORDING)
    }

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
    export function startAudioMixing(filePath: string, loopback: boolean, replace: boolean, cycle: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.startAudioMixing({filePath, cycle, loop: loopback, playTime: 0, replace})
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.START_AUDIO_MIXING, {
            filePath,
            loopback,
            replace,
            cycle
        })
    }

    /** Stops playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function stopAudioMixing(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.stopAudioMixing()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_AUDIO_MIXING)
    }

    /** Pauses playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function pauseAudioMixing(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.pauseAudioMixing()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_AUDIO_MIXING)
    }

    /** Resumes playing and mixing the music file.

     Call this method when you are in a channel.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function resumeAudioMixing(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.resumeAudioMixing()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_AUDIO_MIXING)
    }

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
    export function setHighQualityAudioParameters(fullband: boolean, stereo: boolean, fullBitrate: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_HIGH_QUALITY_AUDIO_PARAMETERS, {
            fullband,
            stereo,
            fullBitrate
        })
    }

    /** Adjusts the volume during audio mixing.

     Call this method when you are in a channel.

     @note Calling this method does not affect the volume of audio effect file playback invoked by the \ref agora::rtc::IRtcEngine::playEffect "playEffect" method.

     @param volume Audio mixing volume. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function adjustAudioMixingVolume(volume: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.adjustAudioMixingVolume(volume)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_VOLUME, {volume})
    }

    /** Adjusts the audio mixing volume for local playback.

     @note Call this method when you are in a channel.

     @param volume Audio mixing volume for local playback. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function adjustAudioMixingPlayoutVolume(volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME, {volume})
    }

    /** Retrieves the audio mixing volume for local playback.

     This method helps troubleshoot audio volume related issues.

     @note Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing volume, if this method call succeeds. The value range is [0,100].
     - < 0: Failure.
     */
    export function getAudioMixingPlayoutVolume(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PLAYOUT_VOLUME)
    }

    /** Adjusts the audio mixing volume for publishing (for remote users).

     @note Call this method when you are in a channel.

     @param volume Audio mixing volume for publishing. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function adjustAudioMixingPublishVolume(volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ADJUST_AUDIO_MIXING_PUBLISH_VOLUME, {volume})
    }

    /** Retrieves the audio mixing volume for publishing.

     This method helps troubleshoot audio volume related issues.

     @note Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing volume for publishing, if this method call succeeds. The value range is [0,100].
     - < 0: Failure.
     */
    export function getAudioMixingPublishVolume(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_PUBLISH_VOLUME)
    }

    /** Retrieves the duration (ms) of the music file.

     Call this method when you are in a channel.

     @return
         - &ge; 0: The audio mixing duration, if this method call succeeds.
     - < 0: Failure.
     */
    export function getAudioMixingDuration(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                return <number>localStream.getAudioMixingDuration()
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_DURATION)
    }

    /** Retrieves the playback position (ms) of the music file.

     Call this method when you are in a channel.

     @return
         - &ge; 0: The current playback position of the audio mixing, if this method call succeeds.
     - < 0: Failure.
     */
    export function getAudioMixingCurrentPosition(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                return <number>localStream.getAudioMixingCurrentPosition()
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_AUDIO_MIXING_CURRENT_POSITION)
    }

    /** Sets the playback position of the music file to a different starting position (the default plays from the beginning).

     @param pos The playback starting position (ms) of the music file.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setAudioMixingPosition(pos: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.setAudioMixingPosition(pos)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_POSITION, {pos})
    }

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
    export function setAudioMixingPitch(pitch: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_AUDIO_MIXING_PITCH, {pitch})
    }

    /** Retrieves the volume of the audio effects.

     The value ranges between 0.0 and 100.0.

     @return
         - &ge; 0: Volume of the audio effects, if this method call succeeds.

     - < 0: Failure.
     */
    export function getEffectsVolume(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                return localStream.getEffectsVolume()[0].volume
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.GET_EFFECTS_VOLUME)
    }

    /** Sets the volume of the audio effects.

     @param volume Sets the volume of the audio effects. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setEffectsVolume(volume: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.setEffectsVolume(volume)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EFFECTS_VOLUME, {volume})
    }

    /** Sets the volume of a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @param volume Sets the volume of the specified audio effect. The value ranges between 0 and 100 (default).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setVolumeOfEffect(soundId: number, volume: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.setVolumeOfEffect(soundId, volume)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_VOLUME_OF_EFFECT, {soundId, volume})
    }

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
    export function enableFaceDetection(enabled: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_FACE_DETECTION, {enabled})
    }

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
    export function playEffect(soundId: number, filePath: string, loopCount: number, pitch: number, pan: number, gain: number, publish: Boolean): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.playEffect({soundId, filePath, cycle: loopCount})
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PLAY_EFFECT, {
            soundId,
            filePath,
            loopCount,
            pitch,
            pan,
            gain,
            publish
        })
    }

    /** Stops playing a specified audio effect.

     @param soundId ID of the audio effect to stop playing. Each audio effect has a unique ID.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function stopEffect(soundId: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.stopEffect(soundId)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_EFFECT, {soundId})
    }

    /** Stops playing all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function stopAllEffects(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.stopAllEffects()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.STOP_ALL_EFFECTS)
    }

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
    export function preloadEffect(soundId: number, filePath: string): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.playEffect({filePath, soundId})
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PRE_LOAD_EFFECT, {soundId, filePath})
    }

    /** Releases a specified preloaded audio effect from the memory.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function unloadEffect(soundId: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.unloadEffect(soundId)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.UN_LOAD_EFFECT, {soundId})
    }

    /** Pauses a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function pauseEffect(soundId: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.pauseEffect(soundId)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_EFFECT, {soundId})
    }

    /** Pauses all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function pauseAllEffects(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.pauseAllEffects()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.PAUSE_ALL_EFFECTS)
    }

    /** Resumes playing a specified audio effect.

     @param soundId ID of the audio effect. Each audio effect has a unique ID.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function resumeEffect(soundId: number): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.resumeEffect(soundId)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_EFFECT, {soundId})
    }

    /** Resumes playing all audio effects.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function resumeAllEffects(): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.resumeAllEffects()
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.RESUME_ALL_EFFECTS)
    }

    /** Enables/Disables stereo panning for remote users.

     Ensure that you call this method before joinChannel to enable stereo panning for remote users so that the local user can track the position of a remote user by calling \ref agora::rtc::IRtcEngine::setRemoteVoicePosition "setRemoteVoicePosition".

     @param enabled Sets whether or not to enable stereo panning for remote users:
     - true: enables stereo panning.
     - false: disables stereo panning.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function enableSoundPositionIndication(enabled: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.ENABLE_SOUND_POSITION_INDICATION, {enabled})
    }

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
    export function setRemoteVoicePosition(uid: number, pan: number, gain: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_VOICE_POSITIONN, {uid, pan, gain})
    }

    /** Changes the voice pitch of the local speaker.

     @param pitch Sets the voice pitch. The value ranges between 0.5 and 2.0. The lower the value, the lower the voice pitch. The default value is 1.0 (no change to the local voice pitch).
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setLocalVoicePitch(pitch: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_CHANGER, {pitch})
    }

    /** Sets the local voice equalization effect.

     @param bandFrequency Sets the band frequency. The value ranges between 0 and 9, representing the respective 10-band center frequencies of the voice effects, including 31, 62, 125, 500, 1k, 2k, 4k, 8k, and 16k Hz. See #AUDIO_EQUALIZATION_BAND_FREQUENCY.
     @param bandGain  Sets the gain of each band in dB. The value ranges between -15 and 15.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setLocalVoiceEqualization(bandFrequency: AUDIO_EQUALIZATION_BAND_FREQUENCY, bandGain: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_EQUALIZATION, {
            bandFrequency,
            bandGain
        })
    }

    /**  Sets the local voice reverberation.

     v2.4.0 adds the \ref agora::rtc::IRtcEngine::setLocalVoiceReverbPreset "setLocalVoiceReverbPreset" method, a more user-friendly method for setting the local voice reverberation. You can use this method to set the local reverberation effect, such as pop music, R&B, rock music, and hip-hop.

     @param reverbKey Sets the reverberation key. See #AUDIO_REVERB_TYPE.
     @param value Sets the value of the reverberation key.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setLocalVoiceReverb(reverbKey: AUDIO_REVERB_TYPE, value: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB, {reverbKey, value})
    }

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
    export function setLocalVoiceChanger(voiceChanger: VOICE_CHANGER_PRESET): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_CHANGER, {voiceChanger})
    }

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
    export function setLocalVoiceReverbPreset(reverbPreset: AUDIO_REVERB_PRESET): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_LOCAL_VOICE_REVERB_PRESET, {reverbPreset})
    }

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
    export function setLogFile(filePath: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILE, {filePath})
    }

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
    export function setLogFilter(filter: LOG_FILTER_TYPE): number {
        if (isWeb) {
            const levels = {
                [LOG_FILTER_TYPE.LOG_FILTER_DEBUG]: 0,
                [LOG_FILTER_TYPE.LOG_FILTER_INFO]: 1,
                [LOG_FILTER_TYPE.LOG_FILTER_WARN]: 2,
                [LOG_FILTER_TYPE.LOG_FILTER_ERROR]: 3,
                [LOG_FILTER_TYPE.LOG_FILTER_OFF]: 4,
            }
            if (levels[filter] === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
            } else {
                AgoraRTC.Logger.setLogLevel(levels[filter])
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILTER, {filter})
    }

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
    export function setLogFileSize(fileSizeInKBytes: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_LOG_FILE_SIZE, {fileSizeInKBytes})
    }

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
    export function setLocalRenderMode(renderMode: RENDER_MODE_TYPE, mirrorMode?: VIDEO_MIRROR_MODE_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        if (mirrorMode === undefined) {
            return callNativeMethod(API_TYPE.SET_LOCAL_RENDER_MODE, {renderMode})
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_RENDER_MODE_2, {renderMode, mirrorMode})
    }

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
    export function setRemoteRenderMode(userId: number, renderMode: RENDER_MODE_TYPE, mirrorMode?: VIDEO_MIRROR_MODE_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        if (mirrorMode === undefined) {
            return callNativeMethod(API_TYPE.SET_REMOTE_RENDER_MODE, {userId, renderMode})
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_RENDER_MODE_2, {userId, renderMode, mirrorMode})
    }

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
    export function setLocalVideoMirrorMode(mirrorMode: VIDEO_MIRROR_MODE_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_VIDEO_MIRROR_MODE, {mirrorMode})
    }

    /** Sets the stream mode to the single-stream (default) or dual-stream mode. (`LIVE_BROADCASTING` only.)

     If the dual-stream mode is enabled, the receiver can choose to receive the high stream (high-resolution and high-bitrate video stream), or the low stream (low-resolution and low-bitrate video stream).

     @param enabled Sets the stream mode:
     - true: Dual-stream mode.
     - false: Single-stream mode.
     */
    export function enableDualStreamMode(enabled: boolean): number {
        if (isWeb) {
            if (enabled) {
                client.enableDualStream()
            } else {
                client.disableDualStream()
            }
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.ENABLE_DUAL_STREAM_MODE, {enabled})
    }

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
    export function setExternalAudioSource(enabled: boolean, sampleRate: number, channels: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SOURCE, {
            enabled,
            sampleRate,
            channels
        })
    }

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
    export function setExternalAudioSink(enabled: boolean, sampleRate: number, channels: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_EXTERNAL_AUDIO_SINK, {
            enabled,
            sampleRate,
            channels
        })
    }

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
    export function setRecordingAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_RECORDING_AUDIO_FRAME_PARAMETERS, {
            sampleRate,
            channel,
            mode,
            samplesPerCall
        })
    }

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
    export function setPlaybackAudioFrameParameters(sampleRate: number, channel: number, mode: RAW_AUDIO_FRAME_OP_MODE_TYPE, samplesPerCall: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_PLAYBACK_AUDIO_FRAME_PARAMETERS, {
            sampleRate,
            channel,
            mode,
            samplesPerCall
        })
    }

    /** Sets the mixed audio format for the \ref agora::media::IAudioFrameObserver::onMixedAudioFrame "onMixedAudioFrame" callback.


     @param sampleRate Sets the sample rate (@p samplesPerSec) returned in the *onMixedAudioFrame* callback, which can be set as 8000, 16000, 32000, 44100, or 48000 Hz.
     @param samplesPerCall Sets the number of samples (`samples`) returned in the *onMixedAudioFrame* callback. `samplesPerCall` is usually set as 1024 for RTMP streaming.

     @note The SDK triggers the `onMixedAudioFrame` callback according to the sample interval. Ensure that the sample interval ≥ 0.01 (s). And, Sample interval (sec) = `samplePerCall`/(`sampleRate` × `channels`).

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setMixedAudioFrameParameters(sampleRate: number, samplesPerCall: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethodAudioEffect(API_TYPE_AUDIO_EFFECT.SET_MIXED_AUDIO_FRAME_PARAMETERS, {
            sampleRate,
            samplesPerCall
        })
    }

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
    export function adjustRecordingSignalVolume(volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ADJUST_RECORDING_SIGNAL_VOLUME, {volume})
    }

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
    export function adjustPlaybackSignalVolume(volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ADJUST_PLAYBACK_SIGNAL_VOLUME, {volume})
    }

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
    export function enableWebSdkInteroperability(enabled: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_WEB_SDK_INTEROPER_ABILITY, {enabled})
    }

    /** **DEPRECATED** Sets the preferences for the high-quality video. (`LIVE_BROADCASTING` only).

     This method is deprecated as of v2.4.0.

     @param preferFrameRateOverImageQuality Sets the video quality preference:
     - true: Frame rate over image quality.
     - false: (Default) Image quality over frame rate.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setVideoQualityParameters(preferFrameRateOverImageQuality: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_VIDEO_QUALITY_PARAMETERS, {preferFrameRateOverImageQuality})
    }

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
    export function setLocalPublishFallbackOption(option: STREAM_FALLBACK_OPTIONS): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_LOCAL_PUBLISH_FALLBACK_OPTION, {option})
    }

    /** Sets the fallback option for the remotely subscribed video stream based on the network conditions.

     The default setting for `option` is #STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW (1), where the remotely subscribed video stream falls back to the low-stream video (low resolution and low bitrate) under poor downlink network conditions.

     If `option` is set as #STREAM_FALLBACK_OPTION_AUDIO_ONLY (2), the SDK automatically switches the video from a high-stream to a low-stream, or disables the video when the downlink network conditions cannot support both audio and video to guarantee the quality of the audio. The SDK monitors the network quality and restores the video stream when the network conditions improve.

     When the remotely subscribed video stream falls back to audio only or when the audio-only stream switches back to the video stream, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onRemoteSubscribeFallbackToAudioOnly "onRemoteSubscribeFallbackToAudioOnly" callback.

     @param  option  Sets the fallback option for the remotely subscribed video stream. See #STREAM_FALLBACK_OPTIONS.
     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setRemoteSubscribeFallbackOption(option: STREAM_FALLBACK_OPTIONS): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION, {option})
    }

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
    export function switchCamera(direction?: CAMERA_DIRECTION): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        if (direction === undefined) {
            return callNativeMethod(API_TYPE.SWITCH_CAMERA)
        }
        return callNativeMethod(API_TYPE.SWITCH_CAMERA_2, {direction})
    }

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
    export function setDefaultAudioRouteToSpeakerphone(defaultToSpeaker: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE, {defaultToSpeaker})
    }

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
    export function setEnableSpeakerphone(speakerOn: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_ENABLE_SPEAKER_PHONE, {speakerOn})
    }

    /** Enables in-ear monitoring (for Android and iOS only).
     @param enabled Determines whether to enable in-ear monitoring.
     - true: Enable.
     - false: (Default) Disable.

     * @return
        - 0: Success.
     - < 0: Failure.
     */
    export function enableInEarMonitoring(enabled: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_IN_EAR_MONITORING, {enabled})
    }

    /** Sets the volume of the in-ear monitor.

     @param volume Sets the volume of the in-ear monitor. The value ranges between 0 and 100 (default).

     @note This method is for Android and iOS only.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setInEarMonitoringVolume(volume: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_IN_EAR_MONITORING_VOLUME, {volume})
    }

    /** Checks whether the speakerphone is enabled.

     @note This method is for Android and iOS only.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function isSpeakerphoneEnabled(): boolean {
        if (isWeb) {
            return false
        }
        return callNativeMethod(API_TYPE.IS_SPEAKER_PHONE_ENABLED)
    }

    /** Retrieves the current call ID.

     When a user joins a channel on a client, a @p callId is generated to identify the call from the client. Feedback methods, such as \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain", must be called after the call ends to submit feedback to the SDK.

     The \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain" methods require the @p callId parameter retrieved from the *getCallId* method during a call. @p callId is passed as an argument into the \ref IRtcEngine::rate "rate" and \ref IRtcEngine::complain "complain" methods after the call ends.

     @param callId Pointer to the current call ID.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function getCallId(): string {
        if (isWeb) {
            return null
        }
        return callNativeMethod(API_TYPE.GET_CALL_ID)
    }

    /** Allows a user to rate a call after the call ends.

     @param callId Pointer to the ID of the call, retrieved from the \ref IRtcEngine::getCallId "getCallId" method.
     @param rating  Rating of the call. The value is between 1 (lowest score) and 5 (highest score). If you set a value out of this range, the #ERR_INVALID_ARGUMENT (2) error returns.
     @param description (Optional) Pointer to the description of the rating, with a string length of less than 800 bytes.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function rate(callId: string, rating: number, description?: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.RATE, {callId, rating, description})
    }

    /** Allows a user to complain about the call quality after a call ends.

     @param callId Pointer to the ID of the call, retrieved from the \ref IRtcEngine::getCallId "getCallId" method.
     @param description (Optional) Pointer to the description of the complaint, with a string length of less than 800 bytes.

     @return
         - 0: Success.
     - < 0: Failure.

     */
    export function complain(callId: string, description: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.COMPLAIN, {callId, description})
    }

    /** Retrieves the SDK version number.

     @param build Pointer to the build number.
     @return The version of the current SDK in the string format. For example, 2.3.1.
     */
    export function getVersion(): string {
        if (isWeb) {
            return AgoraRTC.VERSION
        }
        return callNativeMethod(API_TYPE.GET_VERSION)
    }

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
    export function enableLastmileTest(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_LAST_MILE_TEST)
    }

    /** Disables the network connection quality test.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function disableLastmileTest(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.DISABLE_LAST_MILE_TEST)
    }

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
    export function startLastmileProbeTest(config: LastmileProbeConfig): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.START_LAST_MILE_PROBE_TEST, {config})
    }

    /** Stops the last-mile network probe test. */
    export function stopLastmileProbeTest(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.STOP_LAST_MILE_PROBE_TEST)
    }

    /** Retrieves the warning or error description.

     @param code Warning code or error code returned in the \ref agora::rtc::IRtcEngineEventHandler::onWarning "onWarning" or \ref agora::rtc::IRtcEngineEventHandler::onError "onError" callback.

     @return #WARN_CODE_TYPE or #ERROR_CODE_TYPE.
     */
    export function getErrorDescription(code: number): string {
        if (isWeb) {
            return null
        }
        return callNativeMethod(API_TYPE.GET_ERROR_DESCRIPTION, {code})
    }

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
    export function setEncryptionSecret(secret: string): number {
        if (isWeb) {
            client.setEncryptionSecret(secret)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.SET_ENCRYPTION_SECTRT, {secret})
    }

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
    export function setEncryptionMode(encryptionMode: 'aes-128-xts' | 'aes-128-ecb' | 'aes-256-xts'): number {
        if (isWeb) {
            client.setEncryptionMode(encryptionMode)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.SET_ENCRYPTION_MODE, {encryptionMode})
    }

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
    export function enableEncryption(enabled: boolean, config: EncryptionConfig): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ENABLE_ENCRYPTION, {enabled, config})
    }

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
    export function registerPacketObserver(observer: any): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.REGISTER_PACKET_OBSERVER, {observer})
    }

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
    export function createDataStream(streamId: number, reliable: boolean, ordered: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.CREATE_DATA_STREAM, {streamId, reliable, ordered})
    }

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
    export function sendStreamMessage(streamId: number, data: Uint8Array, length: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SEND_STREAM_MESSAGE, {streamId, length}, data)
    }

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
    export function addPublishStreamUrl(url: string, transcodingEnabled: boolean): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ADD_PUBLISH_STREAM_URL, {url, transcodingEnabled})
    }

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
    export function removePublishStreamUrl(url: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.REMOVE_PUBLISH_STREAM_URL, {url})
    }

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
    export function setLiveTranscoding(transcoding: LiveTranscoding): number {
        if (isWeb) {
            const coding: AgoraRTC.LiveTranscoding = {
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
            }
            client.setLiveTranscoding(coding)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.SET_LIVE_TRANSCODING, {transcoding})
    }

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
    export function addVideoWatermark(watermarkUrl: string, options: WatermarkOptions): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.ADD_VIDEO_WATER_MARK_2, {watermarkUrl, options})
    }

    /** Removes the watermark image from the video stream added by the \ref agora::rtc::IRtcEngine::addVideoWatermark(const char* watermarkUrl, const WatermarkOptions& options) "addVideoWatermark" method.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function clearVideoWatermarks(): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.CLEAR_VIDEO_WATER_MARKS)
    }

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
    export function setBeautyEffectOptions(enabled: boolean, options: BeautyOptions): number {
        if (isWeb) {
            if (localStream === undefined) {
                return ERROR_CODE_TYPE.ERR_NOT_INITIALIZED
            } else {
                localStream.setBeautyEffectOptions(enabled, options)
                return ERROR_CODE_TYPE.ERR_OK
            }
        }
        return callNativeMethod(API_TYPE.SET_BEAUTY_EFFECT_OPTIONS, {enabled, options})
    }

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
    export function addInjectStreamUrl(url: string, config: InjectStreamConfig): number {
        if (isWeb) {
            client.addInjectStreamUrl(url, config)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.ADD_INJECT_STREAM_URL, {url, config})
    }

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
    export function startChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number {
        if (isWeb) {
            // @ts-ignore
            const config = new AgoraRTC.ChannelMediaRelayConfiguration()
            config.setSrcChannelInfo(configuration.srcInfo)
            configuration.destInfos.map((value) => {
                config.setDestChannelInfo(value.channelName, value)
            })
            client.startChannelMediaRelay(config, () => {
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.START_CHANNEL_MEDIA_RELAY, {configuration})
    }

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
    export function updateChannelMediaRelay(configuration: ChannelMediaRelayConfiguration): number {
        if (isWeb) {
            // @ts-ignore
            const config = new AgoraRTC.ChannelMediaRelayConfiguration()
            config.setSrcChannelInfo(configuration.srcInfo)
            configuration.destInfos.map((value) => {
                config.setDestChannelInfo(value.channelName, value)
            })
            client.updateChannelMediaRelay(config, () => {
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.UPDATE_CHANNEL_MEDIA_RELAY, {configuration})
    }

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
    export function stopChannelMediaRelay(): number {
        if (isWeb) {
            client.stopChannelMediaRelay(() => {
            })
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.STOP_CHANNEL_MEDIA_RELAY)
    }

    /** Removes the voice or video stream URL address from the live streaming.

     This method removes the URL address (added by the \ref IRtcEngine::addInjectStreamUrl "addInjectStreamUrl" method) from the live streaming.

     @note If this method is called successfully, the SDK triggers the \ref IRtcEngineEventHandler::onUserOffline "onUserOffline" callback and returns a stream uid of 666.

     @param url Pointer to the URL address of the injected stream to be removed.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function removeInjectStreamUrl(url: string): number {
        if (isWeb) {
            client.removeInjectStreamUrl(url)
            return ERROR_CODE_TYPE.ERR_OK
        }
        return callNativeMethod(API_TYPE.REMOVE_INJECT_STREAM_URL, {url})
    }

    /** Agora supports reporting and analyzing customized messages.
     *
     * @since v3.1.0
     *
     * This function is in the beta stage with a free trial. The ability provided in its beta test version is reporting a maximum of 10 message pieces within 6 seconds, with each message piece not exceeding 256 bytes.
     * To try out this function, contact [support@agora.io](mailto:support@agora.io) and discuss the format of customized messages with us.
     */
    export function sendCustomReportMessage(id: string, category: string, event: string, label: string, value: number): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SEND_CUSTOM_REPORT_MESSAGE, {id, category, event, label, value})
    }

    /** Gets the current connection state of the SDK.

     @return #CONNECTION_STATE_TYPE.
     */
    export function getConnectionState(): CONNECTION_STATE_TYPE {
        if (isWeb) {
            const state = {
                'DISCONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_DISCONNECTED,
                'CONNECTING': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTING,
                'CONNECTED': CONNECTION_STATE_TYPE.CONNECTION_STATE_CONNECTED,
                'DISCONNECTING': undefined,
            }
            return state[client.getConnectionState()]
        }
        return callNativeMethod(API_TYPE.GET_CONNECTION_STATE)
    }

    export function sendMetadata({uid, size, buffer, timeStampMs}: Metadata) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SEND_METADATA, {uid, size, timeStampMs}, buffer)
    }

    export function setMaxMetadataSize(size: number) {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_MAX_META_SIZE, {size})
    }

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
    export function registerMediaMetadataObserver(type: METADATA_TYPE): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.REGISTER_MEDIA_META_DATA_OBSERVER, {type})
    }

    /** Provides technical preview functionalities or special customizations by configuring the SDK with JSON options.

     The JSON options are not public by default. Agora is working on making commonly used JSON options public in a standard way.

     @param parameters Sets the parameter as a JSON string in the specified format.

     @return
         - 0: Success.
     - < 0: Failure.
     */
    export function setParameters(parameters: string): number {
        if (isWeb) {
            return ERROR_CODE_TYPE.ERR_NOT_SUPPORTED
        }
        return callNativeMethod(API_TYPE.SET_PARAMETERS, {parameters})
    }

    /**
     * @internal
     */
    enum API_TYPE {
        INITIALIZE = 0,
        RELEASE = 1,
        SET_CHANNEL_PROFILE = 2,
        SET_CLIENT_ROLE = 3,
        JOIN_CHANNEL = 4,
        SWITCH_CHANNEL = 5,
        LEAVE_CHANNEL = 6,
        RE_NEW_TOKEN = 7,
        REGISTER_LOCAL_USER_ACCOUNT = 8,
        JOIN_CHANNEL_WITH_USER_ACCOUNT = 9,
        GET_USER_INFO_BY_USER_ACCOUNT = 10,
        GET_USER_INFO_BY_UID = 11,
        START_ECHO_TEST = 12,
        START_ECHO_TEST_2 = 13,
        STOP_ECHO_TEST = 14,
        ENABLE_VIDEO = 15,
        DISABLE_VIDEO = 16,
        SET_VIDEO_PROFILE = 17,
        SET_VIDEO_ENCODER_CONFIGURATION = 18,
        SET_CAMERA_CAPTURER_CONFIGURATION = 19,
        SET_UP_LOCAL_VIDEO = 20,
        SET_UP_REMOTE_VIDEO = 21,
        START_PREVIEW = 22,
        SET_REMOTE_USER_PRIORITY = 23,
        STOP_PREVIEW = 24,
        ENABLE_AUDIO = 25,
        ENABLE_LOCAL_AUDIO = 26,
        DISABLE_AUDIO = 27,
        SET_AUDIO_PROFILE = 28,
        MUTE_LOCAL_AUDIO_STREAM = 29,
        MUTE_ALL_REMOTE_AUDIO_STREAMS = 30,
        SET_DEFAULT_MUTE_ALL_REMOTE_AUDIO_STREAMS = 31,
        ADJUST_USER_PLAYBACK_SIGNAL_VOLUME = 32,
        MUTE_REMOTE_AUDIO_STREAM = 33,
        MUTE_LOCAL_VIDEO_STREAM = 34,
        ENABLE_LOCAL_VIDEO = 35,
        MUTE_ALL_REMOTE_VIDEO_STREAMS = 36,
        SET_DEFAULT_MUTE_ALL_REMOTE_VIDEO_STREAMS = 37,
        MUTE_REMOTE_VIDEO_STREAM = 38,
        SET_REMOTE_VIDEO_STREAM_TYPE = 39,
        SET_REMOTE_DEFAULT_VIDEO_STREAM_TYPE = 40,
        ENABLE_AUDIO_VOLUME_INDICATION = 41,
        START_AUDIO_RECORDING = 42,
        START_AUDIO_RECORDING2 = 43,
        STOP_AUDIO_RECORDING = 44,
        ENABLE_FACE_DETECTION = 62,
        SET_REMOTE_VOICE_POSITIONN = 73,
        SET_LOG_FILE = 79,
        SET_LOG_FILTER = 80,
        SET_LOG_FILE_SIZE = 81,
        SET_LOCAL_RENDER_MODE = 82,
        SET_LOCAL_RENDER_MODE_2 = 83,
        SET_REMOTE_RENDER_MODE = 84,
        SET_REMOTE_RENDER_MODE_2 = 85,
        SET_LOCAL_VIDEO_MIRROR_MODE = 86,
        ENABLE_DUAL_STREAM_MODE = 87,
        ADJUST_RECORDING_SIGNAL_VOLUME = 93,
        ADJUST_PLAYBACK_SIGNAL_VOLUME = 94,
        ENABLE_WEB_SDK_INTEROPER_ABILITY = 95,
        SET_VIDEO_QUALITY_PARAMETERS = 96,
        SET_LOCAL_PUBLISH_FALLBACK_OPTION = 97,
        SET_REMOTE_SUBSCRIBE_FALLBACK_OPTION = 98,
        SWITCH_CAMERA = 99,
        SWITCH_CAMERA_2 = 100,
        SET_DEFAULT_AUDIO_ROUTE_SPEAKER_PHONE = 101,
        SET_ENABLE_SPEAKER_PHONE = 102,
        ENABLE_IN_EAR_MONITORING = 103,
        SET_IN_EAR_MONITORING_VOLUME = 104,
        IS_SPEAKER_PHONE_ENABLED = 105,
        SET_AUDIO_SESSION_OPERATION_RESTRICTION = 106,
        ENABLE_LOOP_BACK_RECORDING = 107,
        START_SCREEN_CAPTURE_BY_DISPLAY_ID = 108,
        START_SCREEN_CAPTURE_BY_SCREEN_RECT = 109,
        START_SCREEN_CAPTURE_BY_WINDOW_ID = 110,
        SET_SCREEN_CAPTURE_CONTENT_HINT = 111,
        UPDATE_SCREEN_CAPTURE_PARAMETERS = 112,
        UPDATE_SCREEN_CAPTURE_REGION = 113,
        STOP_SCREEN_CAPTURE = 114,
        GET_CALL_ID = 117,
        RATE = 118,
        COMPLAIN = 119,
        GET_VERSION = 120,
        ENABLE_LAST_MILE_TEST = 121,
        DISABLE_LAST_MILE_TEST = 122,
        START_LAST_MILE_PROBE_TEST = 123,
        STOP_LAST_MILE_PROBE_TEST = 124,
        GET_ERROR_DESCRIPTION = 125,
        SET_ENCRYPTION_SECTRT = 126,
        SET_ENCRYPTION_MODE = 127,
        REGISTER_PACKET_OBSERVER = 128,
        CREATE_DATA_STREAM = 129,
        SEND_STREAM_MESSAGE = 130,
        ADD_PUBLISH_STREAM_URL = 131,
        REMOVE_PUBLISH_STREAM_URL = 132,
        SET_LIVE_TRANSCODING = 133,
        ADD_VIDEO_WATER_MARK = 134,
        ADD_VIDEO_WATER_MARK_2 = 135,
        CLEAR_VIDEO_WATER_MARKS = 136,
        SET_BEAUTY_EFFECT_OPTIONS = 137,
        ADD_INJECT_STREAM_URL = 138,
        START_CHANNEL_MEDIA_RELAY = 139,
        UPDATE_CHANNEL_MEDIA_RELAY = 140,
        STOP_CHANNEL_MEDIA_RELAY = 141,
        REMOVE_INJECT_STREAM_URL = 142,
        GET_CONNECTION_STATE = 143,
        REGISTER_MEDIA_META_DATA_OBSERVER = 144,
        SET_PARAMETERS = 145,
        SET_PLAYBACK_DEVICE_VOLUME = 146,
        PUBLISH = 147,
        UNPUBLISH = 148,
        CHANNEL_ID = 149,
        SEND_METADATA = 150,
        SET_MAX_META_SIZE = 151,
        PUSH_AUDIO_FRAME = 152,
        PUSH_AUDIO_FRAME_2 = 153,
        PULL_AUDIO_FRAME = 154,
        SET_EXTERN_VIDEO_SOURCE = 155,
        PUSH_VIDEO_FRAME = 156,
        ENABLE_ENCRYPTION = 157,
        SEND_CUSTOM_REPORT_MESSAGE = 158,
    }

    /**
     * @internal
     */
    enum API_TYPE_AUDIO_EFFECT {
        START_AUDIO_MIXING = 45,
        STOP_AUDIO_MIXING = 46,
        PAUSE_AUDIO_MIXING = 47,
        RESUME_AUDIO_MIXING = 48,
        SET_HIGH_QUALITY_AUDIO_PARAMETERS = 49,
        ADJUST_AUDIO_MIXING_VOLUME = 50,
        ADJUST_AUDIO_MIXING_PLAYOUT_VOLUME = 51,
        GET_AUDIO_MIXING_PLAYOUT_VOLUME = 52,
        ADJUST_AUDIO_MIXING_PUBLISH_VOLUME = 53,
        GET_AUDIO_MIXING_PUBLISH_VOLUME = 54,
        GET_AUDIO_MIXING_DURATION = 55,
        GET_AUDIO_MIXING_CURRENT_POSITION = 56,
        SET_AUDIO_MIXING_POSITION = 57,
        SET_AUDIO_MIXING_PITCH = 58,
        GET_EFFECTS_VOLUME = 59,
        SET_EFFECTS_VOLUME = 60,
        SET_VOLUME_OF_EFFECT = 61,
        PLAY_EFFECT = 63,
        STOP_EFFECT = 64,
        STOP_ALL_EFFECTS = 65,
        PRE_LOAD_EFFECT = 66,
        UN_LOAD_EFFECT = 67,
        PAUSE_EFFECT = 68,
        PAUSE_ALL_EFFECTS = 69,
        RESUME_EFFECT = 70,
        RESUME_ALL_EFFECTS = 71,
        ENABLE_SOUND_POSITION_INDICATION = 72,
        SET_LOCAL_VOICE_PITCH = 74,
        SET_LOCAL_VOICE_EQUALIZATION = 75,
        SET_LOCAL_VOICE_REVERB = 76,
        SET_LOCAL_VOICE_CHANGER = 77,
        SET_LOCAL_VOICE_REVERB_PRESET = 78,
        SET_EXTERNAL_AUDIO_SOURCE = 88,
        SET_EXTERNAL_AUDIO_SINK = 89,
        SET_RECORDING_AUDIO_FRAME_PARAMETERS = 90,
        SET_PLAYBACK_AUDIO_FRAME_PARAMETERS = 91,
        SET_MIXED_AUDIO_FRAME_PARAMETERS = 92,
    }

    /** Media device states.
     */
    export enum MEDIA_DEVICE_STATE_TYPE {
        /** 1: The device is active.
         */
        MEDIA_DEVICE_STATE_ACTIVE = 1,
        /** 2: The device is disabled.
         */
        MEDIA_DEVICE_STATE_DISABLED = 2,
        /** 4: The device is not present.
         */
        MEDIA_DEVICE_STATE_NOT_PRESENT = 4,
        /** 8: The device is unplugged.
         */
        MEDIA_DEVICE_STATE_UNPLUGGED = 8
    }

    /** Media device types.
     */
    export enum MEDIA_DEVICE_TYPE {
        /** -1: Unknown device type.
         */
        UNKNOWN_AUDIO_DEVICE = -1,
        /** 0: Audio playback device.
         */
        AUDIO_PLAYOUT_DEVICE = 0,
        /** 1: Audio recording device.
         */
        AUDIO_RECORDING_DEVICE = 1,
        /** 2: Video renderer.
         */
        VIDEO_RENDER_DEVICE = 2,
        /** 3: Video capturer.
         */
        VIDEO_CAPTURE_DEVICE = 3,
        /** 4: Application audio playback device.
         */
        AUDIO_APPLICATION_PLAYOUT_DEVICE = 4,
    }

    /** The states of the local user's audio mixing file.
     */
    export enum AUDIO_MIXING_STATE_TYPE {
        /** 710: The audio mixing file is playing.
         */
        AUDIO_MIXING_STATE_PLAYING = 710,
        /** 711: The audio mixing file pauses playing.
         */
        AUDIO_MIXING_STATE_PAUSED = 711,
        /** 713: The audio mixing file stops playing.
         */
        AUDIO_MIXING_STATE_STOPPED = 713,
        /** 714: An exception occurs when playing the audio mixing file. See #AUDIO_MIXING_ERROR_TYPE.
         */
        AUDIO_MIXING_STATE_FAILED = 714,
    }

    /** The error codes of the local user's audio mixing file.
     */
    export enum AUDIO_MIXING_ERROR_TYPE {
        /** 701: The SDK cannot open the audio mixing file.
         */
        AUDIO_MIXING_ERROR_CAN_NOT_OPEN = 701,
        /** 702: The SDK opens the audio mixing file too frequently.
         */
        AUDIO_MIXING_ERROR_TOO_FREQUENT_CALL = 702,
        /** 703: The audio mixing file playback is interrupted.
         */
        AUDIO_MIXING_ERROR_INTERRUPTED_EOF = 703,
        /** 0: The SDK can open the audio mixing file.
         */
        AUDIO_MIXING_ERROR_OK = 0,
    }

    /** Local video state types
     */
    export enum LOCAL_VIDEO_STREAM_STATE {
        /** 0: Initial state */
        LOCAL_VIDEO_STREAM_STATE_STOPPED = 0,
        /** 1: The local video capturing device starts successfully.
         *
         * The SDK also reports this state when you share a maximized window by calling \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId".
         */
        LOCAL_VIDEO_STREAM_STATE_CAPTURING = 1,
        /** 2: The first video frame is successfully encoded. */
        LOCAL_VIDEO_STREAM_STATE_ENCODING = 2,
        /** 3: The local video fails to start. */
        LOCAL_VIDEO_STREAM_STATE_FAILED = 3
    }

    /** Local video state error codes
     */
    export enum LOCAL_VIDEO_STREAM_ERROR {
        /** 0: The local video is normal. */
        LOCAL_VIDEO_STREAM_ERROR_OK = 0,
        /** 1: No specified reason for the local video failure. */
        LOCAL_VIDEO_STREAM_ERROR_FAILURE = 1,
        /** 2: No permission to use the local video capturing device. */
        LOCAL_VIDEO_STREAM_ERROR_DEVICE_NO_PERMISSION = 2,
        /** 3: The local video capturing device is in use. */
        LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY = 3,
        /** 4: The local video capture fails. Check whether the capturing device is working properly. */
        LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE = 4,
        /** 5: The local video encoding fails. */
        LOCAL_VIDEO_STREAM_ERROR_ENCODE_FAILURE = 5,
        /** 11: The shared window is minimized when you call \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId" to share a window.
         */
        LOCAL_VIDEO_STREAM_ERROR_SCREEN_CAPTURE_WINDOW_MINIMIZED = 11,
    }

    /** Local audio state types.
     */
    export enum LOCAL_AUDIO_STREAM_STATE {
        /** 0: The local audio is in the initial state.
         */
        LOCAL_AUDIO_STREAM_STATE_STOPPED = 0,
        /** 1: The recording device starts successfully.
         */
        LOCAL_AUDIO_STREAM_STATE_RECORDING = 1,
        /** 2: The first audio frame encodes successfully.
         */
        LOCAL_AUDIO_STREAM_STATE_ENCODING = 2,
        /** 3: The local audio fails to start.
         */
        LOCAL_AUDIO_STREAM_STATE_FAILED = 3
    }

    /** Local audio state error codes.
     */
    export enum LOCAL_AUDIO_STREAM_ERROR {
        /** 0: The local audio is normal.
         */
        LOCAL_AUDIO_STREAM_ERROR_OK = 0,
        /** 1: No specified reason for the local audio failure.
         */
        LOCAL_AUDIO_STREAM_ERROR_FAILURE = 1,
        /** 2: No permission to use the local audio device.
         */
        LOCAL_AUDIO_STREAM_ERROR_DEVICE_NO_PERMISSION = 2,
        /** 3: The microphone is in use.
         */
        LOCAL_AUDIO_STREAM_ERROR_DEVICE_BUSY = 3,
        /** 4: The local audio recording fails. Check whether the recording device
         * is working properly.
         */
        LOCAL_AUDIO_STREAM_ERROR_RECORD_FAILURE = 4,
        /** 5: The local audio encoding fails.
         */
        LOCAL_AUDIO_STREAM_ERROR_ENCODE_FAILURE = 5
    }

    /** Audio recording qualities.
     */
    export enum AUDIO_RECORDING_QUALITY_TYPE {
        /** 0: Low quality. The sample rate is 32 kHz, and the file size is around
         * 1.2 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_LOW = 0,
        /** 1: Medium quality. The sample rate is 32 kHz, and the file size is
         * around 2 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_MEDIUM = 1,
        /** 2: High quality. The sample rate is 32 kHz, and the file size is
         * around 3.75 MB after 10 minutes of recording.
         */
        AUDIO_RECORDING_QUALITY_HIGH = 2,
    }

    /** Network quality types. */
    export enum QUALITY_TYPE {
        /** 0: The network quality is unknown. */
        QUALITY_UNKNOWN = 0,
        /**  1: The network quality is excellent. */
        QUALITY_EXCELLENT = 1,
        /** 2: The network quality is quite good, but the bitrate may be slightly lower than excellent. */
        QUALITY_GOOD = 2,
        /** 3: Users can feel the communication slightly impaired. */
        QUALITY_POOR = 3,
        /** 4: Users cannot communicate smoothly. */
        QUALITY_BAD = 4,
        /** 5: The network is so bad that users can barely communicate. */
        QUALITY_VBAD = 5,
        /** 6: The network is down and users cannot communicate at all. */
        QUALITY_DOWN = 6,
        /** 7: Users cannot detect the network quality. (Not in use.) */
        QUALITY_UNSUPPORTED = 7,
        /** 8: Detecting the network quality. */
        QUALITY_DETECTING = 8,
    }

    /** Video display modes. */
    export enum RENDER_MODE_TYPE {
        /**
         1: Uniformly scale the video until it fills the visible boundaries (cropped). One dimension of the video may have clipped contents.
         */
        RENDER_MODE_HIDDEN = 1,
        /**
         2: Uniformly scale the video until one of its dimension fits the boundary (zoomed to fit). Areas that are not filled due to disparity in the aspect ratio are filled with black.
         */
        RENDER_MODE_FIT = 2,
        /** **DEPRECATED** 3: This mode is deprecated.
         */
        RENDER_MODE_ADAPTIVE = 3,
        /**
         4: The fill mode. In this mode, the SDK stretches or zooms the video to fill the display window.
         */
        RENDER_MODE_FILL = 4,
    }

    /** Video mirror modes. */
    export enum VIDEO_MIRROR_MODE_TYPE {
        /** 0: (Default) The SDK enables the mirror mode.
         */
        VIDEO_MIRROR_MODE_AUTO = 0,//determined by SDK
        /** 1: Enable mirror mode. */
        VIDEO_MIRROR_MODE_ENABLED = 1,//enabled mirror
        /** 2: Disable mirror mode. */
        VIDEO_MIRROR_MODE_DISABLED = 2,//disable mirror
    }

    /** **DEPRECATED** Video profiles. */
    export enum VIDEO_PROFILE_TYPE {
        /** 0: 160 * 120, frame rate 15 fps, bitrate 65 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_120P = 0,
        /** 2: 120 * 120, frame rate 15 fps, bitrate 50 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_120P_3 = 2,
        /** 10: 320*180, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_180P = 10,
        /** 12: 180 * 180, frame rate 15 fps, bitrate 100 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_180P_3 = 12,
        /** 13: 240 * 180, frame rate 15 fps, bitrate 120 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_180P_4 = 13,
        /** 20: 320 * 240, frame rate 15 fps, bitrate 200 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_240P = 20,
        /** 22: 240 * 240, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_240P_3 = 22,
        /** 23: 424 * 240, frame rate 15 fps, bitrate 220 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_240P_4 = 23,
        /** 30: 640 * 360, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P = 30,
        /** 32: 360 * 360, frame rate 15 fps, bitrate 260 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P_3 = 32,
        /** 33: 640 * 360, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P_4 = 33,
        /** 35: 360 * 360, frame rate 30 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P_6 = 35,
        /** 36: 480 * 360, frame rate 15 fps, bitrate 320 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P_7 = 36,
        /** 37: 480 * 360, frame rate 30 fps, bitrate 490 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_360P_8 = 37,
        /** 38: 640 * 360, frame rate 15 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_LANDSCAPE_360P_9 = 38,
        /** 39: 640 * 360, frame rate 24 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_LANDSCAPE_360P_10 = 39,
        /** 100: 640 * 360, frame rate 24 fps, bitrate 1000 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_LANDSCAPE_360P_11 = 100,
        /** 40: 640 * 480, frame rate 15 fps, bitrate 500 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P = 40,
        /** 42: 480 * 480, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_3 = 42,
        /** 43: 640 * 480, frame rate 30 fps, bitrate 750 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_4 = 43,
        /** 45: 480 * 480, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_6 = 45,
        /** 47: 848 * 480, frame rate 15 fps, bitrate 610 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_8 = 47,
        /** 48: 848 * 480, frame rate 30 fps, bitrate 930 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_9 = 48,
        /** 49: 640 * 480, frame rate 10 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_480P_10 = 49,
        /** 50: 1280 * 720, frame rate 15 fps, bitrate 1130 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_720P = 50,
        /** 52: 1280 * 720, frame rate 30 fps, bitrate 1710 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_720P_3 = 52,
        /** 54: 960 * 720, frame rate 15 fps, bitrate 910 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_720P_5 = 54,
        /** 55: 960 * 720, frame rate 30 fps, bitrate 1380 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_720P_6 = 55,
        /** 60: 1920 * 1080, frame rate 15 fps, bitrate 2080 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_1080P = 60,
        /** 62: 1920 * 1080, frame rate 30 fps, bitrate 3150 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_1080P_3 = 62,
        /** 64: 1920 * 1080, frame rate 60 fps, bitrate 4780 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_1080P_5 = 64,
        /** 66: 2560 * 1440, frame rate 30 fps, bitrate 4850 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_1440P = 66,
        /** 67: 2560 * 1440, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_1440P_2 = 67,
        /** 70: 3840 * 2160, frame rate 30 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_4K = 70,
        /** 72: 3840 * 2160, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_LANDSCAPE_4K_3 = 72,
        /** 1000: 120 * 160, frame rate 15 fps, bitrate 65 Kbps. */
        VIDEO_PROFILE_PORTRAIT_120P = 1000,
        /** 1002: 120 * 120, frame rate 15 fps, bitrate 50 Kbps. */
        VIDEO_PROFILE_PORTRAIT_120P_3 = 1002,
        /** 1010: 180 * 320, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_PORTRAIT_180P = 1010,
        /** 1012: 180 * 180, frame rate 15 fps, bitrate 100 Kbps. */
        VIDEO_PROFILE_PORTRAIT_180P_3 = 1012,
        /** 1013: 180 * 240, frame rate 15 fps, bitrate 120 Kbps. */
        VIDEO_PROFILE_PORTRAIT_180P_4 = 1013,
        /** 1020: 240 * 320, frame rate 15 fps, bitrate 200 Kbps. */
        VIDEO_PROFILE_PORTRAIT_240P = 1020,
        /** 1022: 240 * 240, frame rate 15 fps, bitrate 140 Kbps. */
        VIDEO_PROFILE_PORTRAIT_240P_3 = 1022,
        /** 1023: 240 * 424, frame rate 15 fps, bitrate 220 Kbps. */
        VIDEO_PROFILE_PORTRAIT_240P_4 = 1023,
        /** 1030: 360 * 640, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P = 1030,
        /** 1032: 360 * 360, frame rate 15 fps, bitrate 260 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P_3 = 1032,
        /** 1033: 360 * 640, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P_4 = 1033,
        /** 1035: 360 * 360, frame rate 30 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P_6 = 1035,
        /** 1036: 360 * 480, frame rate 15 fps, bitrate 320 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P_7 = 1036,
        /** 1037: 360 * 480, frame rate 30 fps, bitrate 490 Kbps. */
        VIDEO_PROFILE_PORTRAIT_360P_8 = 1037,
        /** 1038: 360 * 640, frame rate 15 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_PORTRAIT_360P_9 = 1038,
        /** 1039: 360 * 640, frame rate 24 fps, bitrate 800 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_PORTRAIT_360P_10 = 1039,
        /** 1100: 360 * 640, frame rate 24 fps, bitrate 1000 Kbps.
         @note `LIVE_BROADCASTING` profile only.
         */
        VIDEO_PROFILE_PORTRAIT_360P_11 = 1100,
        /** 1040: 480 * 640, frame rate 15 fps, bitrate 500 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P = 1040,
        /** 1042: 480 * 480, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_3 = 1042,
        /** 1043: 480 * 640, frame rate 30 fps, bitrate 750 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_4 = 1043,
        /** 1045: 480 * 480, frame rate 30 fps, bitrate 600 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_6 = 1045,
        /** 1047: 480 * 848, frame rate 15 fps, bitrate 610 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_8 = 1047,
        /** 1048: 480 * 848, frame rate 30 fps, bitrate 930 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_9 = 1048,
        /** 1049: 480 * 640, frame rate 10 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_PORTRAIT_480P_10 = 1049,
        /** 1050: 720 * 1280, frame rate 15 fps, bitrate 1130 Kbps. */
        VIDEO_PROFILE_PORTRAIT_720P = 1050,
        /** 1052: 720 * 1280, frame rate 30 fps, bitrate 1710 Kbps. */
        VIDEO_PROFILE_PORTRAIT_720P_3 = 1052,
        /** 1054: 720 * 960, frame rate 15 fps, bitrate 910 Kbps. */
        VIDEO_PROFILE_PORTRAIT_720P_5 = 1054,
        /** 1055: 720 * 960, frame rate 30 fps, bitrate 1380 Kbps. */
        VIDEO_PROFILE_PORTRAIT_720P_6 = 1055,
        /** 1060: 1080 * 1920, frame rate 15 fps, bitrate 2080 Kbps. */
        VIDEO_PROFILE_PORTRAIT_1080P = 1060,
        /** 1062: 1080 * 1920, frame rate 30 fps, bitrate 3150 Kbps. */
        VIDEO_PROFILE_PORTRAIT_1080P_3 = 1062,
        /** 1064: 1080 * 1920, frame rate 60 fps, bitrate 4780 Kbps. */
        VIDEO_PROFILE_PORTRAIT_1080P_5 = 1064,
        /** 1066: 1440 * 2560, frame rate 30 fps, bitrate 4850 Kbps. */
        VIDEO_PROFILE_PORTRAIT_1440P = 1066,
        /** 1067: 1440 * 2560, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_PORTRAIT_1440P_2 = 1067,
        /** 1070: 2160 * 3840, frame rate 30 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_PORTRAIT_4K = 1070,
        /** 1072: 2160 * 3840, frame rate 60 fps, bitrate 6500 Kbps. */
        VIDEO_PROFILE_PORTRAIT_4K_3 = 1072,
        /** Default 640 * 360, frame rate 15 fps, bitrate 400 Kbps. */
        VIDEO_PROFILE_DEFAULT = VIDEO_PROFILE_LANDSCAPE_360P,
    }

    /** Audio profiles.

     Sets the sample rate, bitrate, encoding mode, and the number of channels:*/
    export enum AUDIO_PROFILE_TYPE // sample rate, bit rate, mono/stereo, speech/music codec
    {
        /**
         0: Default audio profile:
         - For the interactive streaming profile: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
         - For the `COMMUNICATION` profile:
         - Windows: A sample rate of 16 KHz, music encoding, mono, and a bitrate of up to 16 Kbps.
         - Android/macOS/iOS: A sample rate of 32 KHz, music encoding, mono, and a bitrate of up to 18 Kbps.
         */
        AUDIO_PROFILE_DEFAULT = 0, // use default settings
        /**
         1: A sample rate of 32 KHz, audio encoding, mono, and a bitrate of up to 18 Kbps.
         */
        AUDIO_PROFILE_SPEECH_STANDARD = 1, // 32Khz, 18Kbps, mono, speech
        /**
         2: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 64 Kbps.
         */
        AUDIO_PROFILE_MUSIC_STANDARD = 2, // 48Khz, 48Kbps, mono, music
        /**
         3: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 80 Kbps.
         */
        AUDIO_PROFILE_MUSIC_STANDARD_STEREO = 3, // 48Khz, 56Kbps, stereo, music
        /**
         4: A sample rate of 48 KHz, music encoding, mono, and a bitrate of up to 96 Kbps.
         */
        AUDIO_PROFILE_MUSIC_HIGH_QUALITY = 4, // 48Khz, 128Kbps, mono, music
        /**
         5: A sample rate of 48 KHz, music encoding, stereo, and a bitrate of up to 128 Kbps.
         */
        AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO = 5, // 48Khz, 192Kbps, stereo, music
        /**
         6: A sample rate of 16 KHz, audio encoding, mono, and Acoustic Echo Cancellation (AES) enabled.
         */
        AUDIO_PROFILE_IOT = 6,
        AUDIO_PROFILE_NUM = 7,
    }

    /** Audio application scenarios.
     */
    export enum AUDIO_SCENARIO_TYPE // set a suitable scenario for your app type
    {
        /** 0: Default. */
        AUDIO_SCENARIO_DEFAULT = 0,
        /** 1: Entertainment scenario, supporting voice during gameplay. */
        AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT = 1,
        /** 2: Education scenario, prioritizing smoothness and stability. */
        AUDIO_SCENARIO_EDUCATION = 2,
        /** 3: Live gaming scenario, enabling the gaming audio effects in the speaker mode in the interactive live streaming scenario. Choose this scenario for high-fidelity music playback. */
        AUDIO_SCENARIO_GAME_STREAMING = 3,
        /** 4: Showroom scenario, optimizing the audio quality with external professional equipment. */
        AUDIO_SCENARIO_SHOWROOM = 4,
        /** 5: Gaming scenario. */
        AUDIO_SCENARIO_CHATROOM_GAMING = 5,
        /** 6: Applicable to the IoT scenario. */
        AUDIO_SCENARIO_IOT = 6,
        AUDIO_SCENARIO_NUM = 7,
    }

    /** The channel profile.
     */
    export enum CHANNEL_PROFILE_TYPE {
        /** (Default) Communication. This profile applies to scenarios such as an audio call or video call,
         * where all users can publish and subscribe to streams.
         */
        CHANNEL_PROFILE_COMMUNICATION = 0,
        /** Live streaming. In this profile, uses have roles, namely, host and audience (default).
         * A host both publishes and subscribes to streams, while an audience subscribes to streams only.
         * This profile applies to scenarios such as a chat room or interactive video streaming.
         */
        CHANNEL_PROFILE_LIVE_BROADCASTING = 1,
        /** 2: Gaming. This profile uses a codec with a lower bitrate and consumes less power. Applies to the gaming scenario, where all game players can talk freely.
         */
        CHANNEL_PROFILE_GAME = 2,
    }

    /** Client roles in the live interactive streaming. */
    export enum CLIENT_ROLE_TYPE {
        /** 1: Host. A host can both send and receive streams. */
        CLIENT_ROLE_BROADCASTER = 1,
        /** 2: Audience, the default role. An audience can only receive streams. */
        CLIENT_ROLE_AUDIENCE = 2,
    }

    /** Reasons for a user being offline. */
    export enum USER_OFFLINE_REASON_TYPE {
        /** 0: The user quits the call. */
        USER_OFFLINE_QUIT = 0,
        /** 1: The SDK times out and the user drops offline because no data packet is received within a certain period of time. If the user quits the call and the message is not passed to the SDK (due to an unreliable channel), the SDK assumes the user dropped offline. */
        USER_OFFLINE_DROPPED = 1,
        /** 2: (`LIVE_BROADCASTING` only.) The client role switched from the host to the audience. */
        USER_OFFLINE_BECOME_AUDIENCE = 2,
    }

    /**
     States of the RTMP streaming.
     */
    export enum RTMP_STREAM_PUBLISH_STATE {
        /** The RTMP streaming has not started or has ended. This state is also triggered after you remove an RTMP address from the CDN by calling removePublishStreamUrl.
         */
        RTMP_STREAM_PUBLISH_STATE_IDLE = 0,
        /** The SDK is connecting to Agora's streaming server and the RTMP server. This state is triggered after you call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method.
         */
        RTMP_STREAM_PUBLISH_STATE_CONNECTING = 1,
        /** The RTMP streaming publishes. The SDK successfully publishes the RTMP streaming and returns this state.
         */
        RTMP_STREAM_PUBLISH_STATE_RUNNING = 2,
        /** The RTMP streaming is recovering. When exceptions occur to the CDN, or the streaming is interrupted, the SDK tries to resume RTMP streaming and returns this state.

         - If the SDK successfully resumes the streaming, #RTMP_STREAM_PUBLISH_STATE_RUNNING (2) returns.
         - If the streaming does not resume within 60 seconds or server errors occur, #RTMP_STREAM_PUBLISH_STATE_FAILURE (4) returns. You can also reconnect to the server by calling the \ref IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" and \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" methods.
         */
        RTMP_STREAM_PUBLISH_STATE_RECOVERING = 3,
        /** The RTMP streaming fails. See the errCode parameter for the detailed error information. You can also call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the RTMP streaming again.
         */
        RTMP_STREAM_PUBLISH_STATE_FAILURE = 4,
    }

    /**
     Error codes of the RTMP streaming.
     */
    export enum RTMP_STREAM_PUBLISH_ERROR {
        /** The RTMP streaming publishes successfully. */
        RTMP_STREAM_PUBLISH_ERROR_OK = 0,
        /** Invalid argument used. If, for example, you do not call the \ref IRtcEngine::setLiveTranscoding "setLiveTranscoding" method to configure the LiveTranscoding parameters before calling the addPublishStreamUrl method, the SDK returns this error. Check whether you set the parameters in the *setLiveTranscoding* method properly. */
        RTMP_STREAM_PUBLISH_ERROR_INVALID_ARGUMENT = 1,
        /** The RTMP streaming is encrypted and cannot be published. */
        RTMP_STREAM_PUBLISH_ERROR_ENCRYPTED_STREAM_NOT_ALLOWED = 2,
        /** Timeout for the RTMP streaming. Call the \ref IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method to publish the streaming again. */
        RTMP_STREAM_PUBLISH_ERROR_CONNECTION_TIMEOUT = 3,
        /** An error occurs in Agora's streaming server. Call the addPublishStreamUrl method to publish the streaming again. */
        RTMP_STREAM_PUBLISH_ERROR_INTERNAL_SERVER_ERROR = 4,
        /** An error occurs in the RTMP server. */
        RTMP_STREAM_PUBLISH_ERROR_RTMP_SERVER_ERROR = 5,
        /** The RTMP streaming publishes too frequently. */
        RTMP_STREAM_PUBLISH_ERROR_TOO_OFTEN = 6,
        /** The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones. */
        RTMP_STREAM_PUBLISH_ERROR_REACH_LIMIT = 7,
        /** The host manipulates other hosts' URLs. Check your app logic. */
        RTMP_STREAM_PUBLISH_ERROR_NOT_AUTHORIZED = 8,
        /** Agora's server fails to find the RTMP streaming. */
        RTMP_STREAM_PUBLISH_ERROR_STREAM_NOT_FOUND = 9,
        /** The format of the RTMP streaming URL is not supported. Check whether the URL format is correct. */
        RTMP_STREAM_PUBLISH_ERROR_FORMAT_NOT_SUPPORTED = 10,
    }

    /** Events during the RTMP streaming. */
    export enum RTMP_STREAMING_EVENT {
        /** An error occurs when you add a background image or a watermark image to the RTMP stream.
         */
        RTMP_STREAMING_EVENT_FAILED_LOAD_IMAGE = 1,
    }

    /** States of importing an external video stream in the live interactive streaming. */
    export enum INJECT_STREAM_STATUS {
        /** 0: The external video stream imported successfully. */
        INJECT_STREAM_STATUS_START_SUCCESS = 0,
        /** 1: The external video stream already exists. */
        INJECT_STREAM_STATUS_START_ALREADY_EXISTS = 1,
        /** 2: The external video stream to be imported is unauthorized. */
        INJECT_STREAM_STATUS_START_UNAUTHORIZED = 2,
        /** 3: Import external video stream timeout. */
        INJECT_STREAM_STATUS_START_TIMEDOUT = 3,
        /** 4: Import external video stream failed. */
        INJECT_STREAM_STATUS_START_FAILED = 4,
        /** 5: The external video stream stopped importing successfully. */
        INJECT_STREAM_STATUS_STOP_SUCCESS = 5,
        /** 6: No external video stream is found. */
        INJECT_STREAM_STATUS_STOP_NOT_FOUND = 6,
        /** 7: The external video stream to be stopped importing is unauthorized. */
        INJECT_STREAM_STATUS_STOP_UNAUTHORIZED = 7,
        /** 8: Stop importing external video stream timeout. */
        INJECT_STREAM_STATUS_STOP_TIMEDOUT = 8,
        /** 9: Stop importing external video stream failed. */
        INJECT_STREAM_STATUS_STOP_FAILED = 9,
        /** 10: The external video stream is corrupted. */
        INJECT_STREAM_STATUS_BROKEN = 10,
    }

    /** Remote video stream types. */
    export enum REMOTE_VIDEO_STREAM_TYPE {
        /** 0: High-stream video. */
        REMOTE_VIDEO_STREAM_HIGH = 0,
        /** 1: Low-stream video. */
        REMOTE_VIDEO_STREAM_LOW = 1,
    }

    /** The use mode of the audio data in the \ref media::IAudioFrameObserver::onRecordAudioFrame "onRecordAudioFrame" or \ref media::IAudioFrameObserver::onPlaybackAudioFrame "onPlaybackAudioFrame" callback.
     */
    export enum RAW_AUDIO_FRAME_OP_MODE_TYPE {
        /** 0: Read-only mode: Users only read the \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame" data without modifying anything. For example, when users acquire the data with the Agora SDK, then push the RTMP streams. */
        RAW_AUDIO_FRAME_OP_MODE_READ_ONLY = 0,
        /** 1: Write-only mode: Users replace the \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame" data with their own data and pass the data to the SDK for encoding. For example, when users acquire the data. */
        RAW_AUDIO_FRAME_OP_MODE_WRITE_ONLY = 1,
        /** 2: Read and write mode: Users read the data from \ref agora::media::IAudioFrameObserver::AudioFrame "AudioFrame", modify it, and then play it. For example, when users have their own sound-effect processing module and perform some voice pre-processing, such as a voice change. */
        RAW_AUDIO_FRAME_OP_MODE_READ_WRITE = 2,
    }

    /** Audio-sample rates. */
    export enum AUDIO_SAMPLE_RATE_TYPE {
        /** 32000: 32 kHz */
        AUDIO_SAMPLE_RATE_32000 = 32000,
        /** 44100: 44.1 kHz */
        AUDIO_SAMPLE_RATE_44100 = 44100,
        /** 48000: 48 kHz */
        AUDIO_SAMPLE_RATE_48000 = 48000,
    }

    /** Video codec profile types. */
    export enum VIDEO_CODEC_PROFILE_TYPE {
        /** 66: Baseline video codec profile. Generally used in video calls on mobile phones. */
        VIDEO_CODEC_PROFILE_BASELINE = 66,
        /** 77: Main video codec profile. Generally used in mainstream electronics such as MP4 players, portable video players, PSP, and iPads. */
        VIDEO_CODEC_PROFILE_MAIN = 77,
        /** 100: (Default) High video codec profile. Generally used in high-resolution live streaming or television. */
        VIDEO_CODEC_PROFILE_HIGH = 100,
    }

    /** Video codec types */
    export enum VIDEO_CODEC_TYPE {
        /** Standard VP8 */
        VIDEO_CODEC_VP8 = 1,
        /** Standard H264 */
        VIDEO_CODEC_H264 = 2,
        /** Enhanced VP8 */
        VIDEO_CODEC_EVP = 3,
        /** Enhanced H264 */
        VIDEO_CODEC_E264 = 4,
    }

    /** Audio equalization band frequencies. */
    export enum AUDIO_EQUALIZATION_BAND_FREQUENCY {
        /** 0: 31 Hz */
        AUDIO_EQUALIZATION_BAND_31 = 0,
        /** 1: 62 Hz */
        AUDIO_EQUALIZATION_BAND_62 = 1,
        /** 2: 125 Hz */
        AUDIO_EQUALIZATION_BAND_125 = 2,
        /** 3: 250 Hz */
        AUDIO_EQUALIZATION_BAND_250 = 3,
        /** 4: 500 Hz */
        AUDIO_EQUALIZATION_BAND_500 = 4,
        /** 5: 1 kHz */
        AUDIO_EQUALIZATION_BAND_1K = 5,
        /** 6: 2 kHz */
        AUDIO_EQUALIZATION_BAND_2K = 6,
        /** 7: 4 kHz */
        AUDIO_EQUALIZATION_BAND_4K = 7,
        /** 8: 8 kHz */
        AUDIO_EQUALIZATION_BAND_8K = 8,
        /** 9: 16 kHz */
        AUDIO_EQUALIZATION_BAND_16K = 9,
    }

    /** Audio reverberation types. */
    export enum AUDIO_REVERB_TYPE {
        /** 0: The level of the dry signal (db). The value is between -20 and 10. */
        AUDIO_REVERB_DRY_LEVEL = 0, // (dB, [-20,10]), the level of the dry signal
        /** 1: The level of the early reflection signal (wet signal) (dB). The value is between -20 and 10. */
        AUDIO_REVERB_WET_LEVEL = 1, // (dB, [-20,10]), the level of the early reflection signal (wet signal)
        /** 2: The room size of the reflection. The value is between 0 and 100. */
        AUDIO_REVERB_ROOM_SIZE = 2, // ([0,100]), the room size of the reflection
        /** 3: The length of the initial delay of the wet signal (ms). The value is between 0 and 200. */
        AUDIO_REVERB_WET_DELAY = 3, // (ms, [0,200]), the length of the initial delay of the wet signal in ms
        /** 4: The reverberation strength. The value is between 0 and 100. */
        AUDIO_REVERB_STRENGTH = 4, // ([0,100]), the strength of the reverberation
    }

    /**
     * Local voice changer options.
     */
    export enum VOICE_CHANGER_PRESET {
        /**
         * The original voice (no local voice change).
         */
        VOICE_CHANGER_OFF = 0x00000000, //Turn off the voice changer
        /**
         * The voice of an old man.
         */
        VOICE_CHANGER_OLDMAN = 0x00000001,
        /**
         * The voice of a little boy.
         */
        VOICE_CHANGER_BABYBOY = 0x00000002,
        /**
         * The voice of a little girl.
         */
        VOICE_CHANGER_BABYGIRL = 0x00000003,
        /**
         * The voice of Zhu Bajie, a character in Journey to the West who has a voice like that of a growling bear.
         */
        VOICE_CHANGER_ZHUBAJIE = 0x00000004,
        /**
         * The ethereal voice.
         */
        VOICE_CHANGER_ETHEREAL = 0x00000005,
        /**
         * The voice of Hulk.
         */
        VOICE_CHANGER_HULK = 0x00000006,
        /**
         * A more vigorous voice.
         */
        VOICE_BEAUTY_VIGOROUS = 0x00100001,//7,
        /**
         * A deeper voice.
         */
        VOICE_BEAUTY_DEEP = 0x00100002,
        /**
         * A mellower voice.
         */
        VOICE_BEAUTY_MELLOW = 0x00100003,
        /**
         * Falsetto.
         */
        VOICE_BEAUTY_FALSETTO = 0x00100004,
        /**
         * A fuller voice.
         */
        VOICE_BEAUTY_FULL = 0x00100005,
        /**
         * A clearer voice.
         */
        VOICE_BEAUTY_CLEAR = 0x00100006,
        /**
         * A more resounding voice.
         */
        VOICE_BEAUTY_RESOUNDING = 0x00100007,
        /**
         * A more ringing voice.
         */
        VOICE_BEAUTY_RINGING = 0x00100008,
        /**
         * A more spatially resonant voice.
         */
        VOICE_BEAUTY_SPACIAL = 0x00100009,
        /**
         * (For male only) A more magnetic voice. Do not use it when the speaker is a female; otherwise, voice distortion occurs.
         */
        GENERAL_BEAUTY_VOICE_MALE_MAGNETIC = 0x00200001,
        /**
         * (For female only) A fresher voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
         */
        GENERAL_BEAUTY_VOICE_FEMALE_FRESH = 0x00200002,
        /**
         *    (For female only) A more vital voice. Do not use it when the speaker is a male; otherwise, voice distortion occurs.
         */
        GENERAL_BEAUTY_VOICE_FEMALE_VITALITY = 0x00200003
    }

    /** Local voice reverberation presets. */
    export enum AUDIO_REVERB_PRESET {
        /**
         * Turn off local voice reverberation, that is, to use the original voice.
         */
        AUDIO_REVERB_OFF = 0x00000000, // Turn off audio reverb
        /**
         * The reverberation style typical of a KTV venue (enhanced).
         */
        AUDIO_REVERB_FX_KTV = 0x00100001,
        /**
         * The reverberation style typical of a concert hall (enhanced).
         */
        AUDIO_REVERB_FX_VOCAL_CONCERT = 0x00100002,
        /**
         * The reverberation style typical of an uncle's voice.
         */
        AUDIO_REVERB_FX_UNCLE = 0x00100003,
        /**
         * The reverberation style typical of a little sister's voice.
         */
        AUDIO_REVERB_FX_SISTER = 0x00100004,
        /**
         * The reverberation style typical of a recording studio (enhanced).
         */
        AUDIO_REVERB_FX_STUDIO = 0x00100005,
        /**
         * The reverberation style typical of popular music (enhanced).
         */
        AUDIO_REVERB_FX_POPULAR = 0x00100006,
        /**
         * The reverberation style typical of R&B music (enhanced).
         */
        AUDIO_REVERB_FX_RNB = 0x00100007,
        /**
         * The reverberation style typical of the vintage phonograph.
         */
        AUDIO_REVERB_FX_PHONOGRAPH = 0x00100008,
        /**
         * The reverberation style typical of popular music.
         */
        AUDIO_REVERB_POPULAR = 0x00000001,
        /**
         * The reverberation style typical of R&B music.
         */
        AUDIO_REVERB_RNB = 0x00000002,
        /**
         * The reverberation style typical of rock music.
         */
        AUDIO_REVERB_ROCK = 0x00000003,
        /**
         * The reverberation style typical of hip-hop music.
         */
        AUDIO_REVERB_HIPHOP = 0x00000004,
        /**
         * The reverberation style typical of a concert hall.
         */
        AUDIO_REVERB_VOCAL_CONCERT = 0x00000005,
        /**
         * The reverberation style typical of a KTV venue.
         */
        AUDIO_REVERB_KTV = 0x00000006,
        /**
         * The reverberation style typical of a recording studio.
         */
        AUDIO_REVERB_STUDIO = 0x00000007,
        /**
         * The reverberation of the virtual stereo. The virtual stereo is an effect that renders the monophonic
         * audio as the stereo audio, so that all users in the channel can hear the stereo voice effect.
         * To achieve better virtual stereo reverberation, Agora recommends setting `profile` in `setAudioProfile`
         * as `AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO(5)`.
         */
        AUDIO_VIRTUAL_STEREO = 0x00200001
    }

    /** Audio codec profile types. The default value is LC_ACC. */
    export enum AUDIO_CODEC_PROFILE_TYPE {
        /** 0: LC-AAC, which is the low-complexity audio codec type. */
        AUDIO_CODEC_PROFILE_LC_AAC = 0,
        /** 1: HE-AAC, which is the high-efficiency audio codec type. */
        AUDIO_CODEC_PROFILE_HE_AAC = 1,
    }

    /** Remote audio states.
     */
    export enum REMOTE_AUDIO_STATE {
        /** 0: The remote audio is in the default state, probably due to
         * #REMOTE_AUDIO_REASON_LOCAL_MUTED (3),
         * #REMOTE_AUDIO_REASON_REMOTE_MUTED (5), or
         * #REMOTE_AUDIO_REASON_REMOTE_OFFLINE (7).
         */
        REMOTE_AUDIO_STATE_STOPPED = 0,  // Default state, audio is started or remote user disabled/muted audio stream
        /** 1: The first remote audio packet is received.
         */
        REMOTE_AUDIO_STATE_STARTING = 1,  // The first audio frame packet has been received
        /** 2: The remote audio stream is decoded and plays normally, probably
         * due to #REMOTE_AUDIO_REASON_NETWORK_RECOVERY (2),
         * #REMOTE_AUDIO_REASON_LOCAL_UNMUTED (4), or
         * #REMOTE_AUDIO_REASON_REMOTE_UNMUTED (6).
         */
        REMOTE_AUDIO_STATE_DECODING = 2,  // The first remote audio frame has been decoded or fronzen state ends
        /** 3: The remote audio is frozen, probably due to
         * #REMOTE_AUDIO_REASON_NETWORK_CONGESTION (1).
         */
        REMOTE_AUDIO_STATE_FROZEN = 3,    // Remote audio is frozen, probably due to network issue
        /** 4: The remote audio fails to start, probably due to
         * #REMOTE_AUDIO_REASON_INTERNAL (0).
         */
        REMOTE_AUDIO_STATE_FAILED = 4,    // Remote audio play failed
    }

    /** Remote audio state reasons.
     */
    export enum REMOTE_AUDIO_STATE_REASON {
        /** 0: Internal reasons.
         */
        REMOTE_AUDIO_REASON_INTERNAL = 0,
        /** 1: Network congestion.
         */
        REMOTE_AUDIO_REASON_NETWORK_CONGESTION = 1,
        /** 2: Network recovery.
         */
        REMOTE_AUDIO_REASON_NETWORK_RECOVERY = 2,
        /** 3: The local user stops receiving the remote audio stream or
         * disables the audio module.
         */
        REMOTE_AUDIO_REASON_LOCAL_MUTED = 3,
        /** 4: The local user resumes receiving the remote audio stream or
         * enables the audio module.
         */
        REMOTE_AUDIO_REASON_LOCAL_UNMUTED = 4,
        /** 5: The remote user stops sending the audio stream or disables the
         * audio module.
         */
        REMOTE_AUDIO_REASON_REMOTE_MUTED = 5,
        /** 6: The remote user resumes sending the audio stream or enables the
         * audio module.
         */
        REMOTE_AUDIO_REASON_REMOTE_UNMUTED = 6,
        /** 7: The remote user leaves the channel.
         */
        REMOTE_AUDIO_REASON_REMOTE_OFFLINE = 7,
    }

    /** The state of the remote video. */
    export enum REMOTE_VIDEO_STATE {
        /** 0: The remote video is in the default state, probably due to #REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED (3), #REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED (5), or #REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE (7).
         */
        REMOTE_VIDEO_STATE_STOPPED = 0,

        /** 1: The first remote video packet is received.
         */
        REMOTE_VIDEO_STATE_STARTING = 1,

        /** 2: The remote video stream is decoded and plays normally, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY (2), #REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED (4), #REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED (6), or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY (9).
         */
        REMOTE_VIDEO_STATE_DECODING = 2,

        /** 3: The remote video is frozen, probably due to #REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION (1) or #REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK (8).
         */
        REMOTE_VIDEO_STATE_FROZEN = 3,

        /** 4: The remote video fails to start, probably due to #REMOTE_VIDEO_STATE_REASON_INTERNAL (0).
         */
        REMOTE_VIDEO_STATE_FAILED = 4
    }

    /** The publishing state.
     */
    export enum STREAM_PUBLISH_STATE {
        /** 0: The initial publishing state after joining the channel.
         */
        PUB_STATE_IDLE = 0,
        /** 1: Fails to publish the local stream. Possible reasons:
         * - The local user calls \ref IRtcEngine::muteLocalAudioStream "muteLocalAudioStream(true)" or \ref IRtcEngine::muteLocalVideoStream "muteLocalVideoStream(true)" to stop sending local streams.
         * - The local user calls \ref IRtcEngine::disableAudio "disableAudio" or \ref IRtcEngine::disableVideo "disableVideo" to disable the entire audio or video module.
         * - The local user calls \ref IRtcEngine::enableLocalAudio "enableLocalAudio(false)" or \ref IRtcEngine::enableLocalVideo "enableLocalVideo(false)" to disable the local audio sampling or video capturing.
         * - The role of the local user is `AUDIENCE`.
         */
        PUB_STATE_NO_PUBLISHED = 1,
        /** 2: Publishing.
         */
        PUB_STATE_PUBLISHING = 2,
        /** 3: Publishes successfully.
         */
        PUB_STATE_PUBLISHED = 3
    }

    /** The subscribing state.
     */
    export enum STREAM_SUBSCRIBE_STATE {
        /** 0: The initial subscribing state after joining the channel.
         */
        SUB_STATE_IDLE = 0,
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
        SUB_STATE_NO_SUBSCRIBED = 1,
        /** 2: Subscribing.
         */
        SUB_STATE_SUBSCRIBING = 2,
        /** 3: Subscribes to and receives the remote stream successfully.
         */
        SUB_STATE_SUBSCRIBED = 3
    }

    /** The reason for the remote video state change. */
    export enum REMOTE_VIDEO_STATE_REASON {
        /** 0: Internal reasons.
         */
        REMOTE_VIDEO_STATE_REASON_INTERNAL = 0,

        /** 1: Network congestion.
         */
        REMOTE_VIDEO_STATE_REASON_NETWORK_CONGESTION = 1,

        /** 2: Network recovery.
         */
        REMOTE_VIDEO_STATE_REASON_NETWORK_RECOVERY = 2,

        /** 3: The local user stops receiving the remote video stream or disables the video module.
         */
        REMOTE_VIDEO_STATE_REASON_LOCAL_MUTED = 3,

        /** 4: The local user resumes receiving the remote video stream or enables the video module.
         */
        REMOTE_VIDEO_STATE_REASON_LOCAL_UNMUTED = 4,

        /** 5: The remote user stops sending the video stream or disables the video module.
         */
        REMOTE_VIDEO_STATE_REASON_REMOTE_MUTED = 5,

        /** 6: The remote user resumes sending the video stream or enables the video module.
         */
        REMOTE_VIDEO_STATE_REASON_REMOTE_UNMUTED = 6,

        /** 7: The remote user leaves the channel.
         */
        REMOTE_VIDEO_STATE_REASON_REMOTE_OFFLINE = 7,

        /** 8: The remote audio-and-video stream falls back to the audio-only stream due to poor network conditions.
         */
        REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK = 8,

        /** 9: The remote audio-only stream switches back to the audio-and-video stream after the network conditions improve.
         */
        REMOTE_VIDEO_STATE_REASON_AUDIO_FALLBACK_RECOVERY = 9
    }

    /** Video frame rates. */
    export enum FRAME_RATE {
        /** 1: 1 fps */
        FRAME_RATE_FPS_1 = 1,
        /** 7: 7 fps */
        FRAME_RATE_FPS_7 = 7,
        /** 10: 10 fps */
        FRAME_RATE_FPS_10 = 10,
        /** 15: 15 fps */
        FRAME_RATE_FPS_15 = 15,
        /** 24: 24 fps */
        FRAME_RATE_FPS_24 = 24,
        /** 30: 30 fps */
        FRAME_RATE_FPS_30 = 30,
        /** 60: 60 fps (Windows and macOS only) */
        FRAME_RATE_FPS_60 = 60,
    }

    /** Video output orientation modes.
     */
    export enum ORIENTATION_MODE {
        /** 0: (Default) Adaptive mode.

         The video encoder adapts to the orientation mode of the video input device.

         - If the width of the captured video from the SDK is greater than the height, the encoder sends the video in landscape mode. The encoder also sends the rotational information of the video, and the receiver uses the rotational information to rotate the received video.
         - When you use a custom video source, the output video from the encoder inherits the orientation of the original video. If the original video is in portrait mode, the output video from the encoder is also in portrait mode. The encoder also sends the rotational information of the video to the receiver.
         */
        ORIENTATION_MODE_ADAPTIVE = 0,
        /** 1: Landscape mode.

         The video encoder always sends the video in landscape mode. The video encoder rotates the original video before sending it and the rotational infomation is 0. This mode applies to scenarios involving CDN live streaming.
         */
        ORIENTATION_MODE_FIXED_LANDSCAPE = 1,
        /** 2: Portrait mode.

         The video encoder always sends the video in portrait mode. The video encoder rotates the original video before sending it and the rotational infomation is 0. This mode applies to scenarios involving CDN live streaming.
         */
        ORIENTATION_MODE_FIXED_PORTRAIT = 2,
    }

    /** Video degradation preferences when the bandwidth is a constraint. */
    export enum DEGRADATION_PREFERENCE {
        /** 0: (Default) Degrade the frame rate in order to maintain the video quality. */
        MAINTAIN_QUALITY = 0,
        /** 1: Degrade the video quality in order to maintain the frame rate. */
        MAINTAIN_FRAMERATE = 1,
        /** 2: (For future use) Maintain a balance between the frame rate and video quality. */
        MAINTAIN_BALANCED = 2,
    }

    /** Stream fallback options. */
    export enum STREAM_FALLBACK_OPTIONS {
        /** 0: No fallback behavior for the local/remote video stream when the uplink/downlink network conditions are poor. The quality of the stream is not guaranteed. */
        STREAM_FALLBACK_OPTION_DISABLED = 0,
        /** 1: Under poor downlink network conditions, the remote video stream, to which you subscribe, falls back to the low-stream (low resolution and low bitrate) video. You can set this option only in the \ref IRtcEngine::setRemoteSubscribeFallbackOption "setRemoteSubscribeFallbackOption" method. Nothing happens when you set this in the \ref IRtcEngine::setLocalPublishFallbackOption "setLocalPublishFallbackOption" method. */
        STREAM_FALLBACK_OPTION_VIDEO_STREAM_LOW = 1,
        /** 2: Under poor uplink network conditions, the published video stream falls back to audio only.

         Under poor downlink network conditions, the remote video stream, to which you subscribe, first falls back to the low-stream (low resolution and low bitrate) video; and then to an audio-only stream if the network conditions worsen.*/
        STREAM_FALLBACK_OPTION_AUDIO_ONLY = 2,
    }

    /** Camera capturer configuration.
     */
    export enum CAPTURER_OUTPUT_PREFERENCE {
        /** 0: (Default) self-adapts the camera output parameters to the system performance and network conditions to balance CPU consumption and video preview quality.
         */
        CAPTURER_OUTPUT_PREFERENCE_AUTO = 0,
        /** 1: Prioritizes the system performance. The SDK chooses the dimension and frame rate of the local camera capture closest to those set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration".
         */
        CAPTURER_OUTPUT_PREFERENCE_PERFORMANCE = 1,
        /** 2: Prioritizes the local preview quality. The SDK chooses higher camera output parameters to improve the local video preview quality. This option requires extra CPU and RAM usage for video pre-processing.
         */
        CAPTURER_OUTPUT_PREFERENCE_PREVIEW = 2,
    }

    /** The priority of the remote user.
     */
    export enum PRIORITY_TYPE {
        /** 50: The user's priority is high.
         */
        PRIORITY_HIGH = 50,
        /** 100: (Default) The user's priority is normal.
         */
        PRIORITY_NORMAL = 100,
    }

    /** Connection states. */
    export enum CONNECTION_STATE_TYPE {
        /** 1: The SDK is disconnected from Agora's edge server.

         - This is the initial state before calling the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
         - The SDK also enters this state when the application calls the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method.
         */
        CONNECTION_STATE_DISCONNECTED = 1,
        /** 2: The SDK is connecting to Agora's edge server.

         - When the application calls the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method, the SDK starts to establish a connection to the specified channel, triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, and switches to the #CONNECTION_STATE_CONNECTING state.
         - When the SDK successfully joins the channel, it triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_CONNECTED state.
         - After the SDK joins the channel and when it finishes initializing the media engine, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onJoinChannelSuccess "onJoinChannelSuccess" callback.
         */
        CONNECTION_STATE_CONNECTING = 2,
        /** 3: The SDK is connected to Agora's edge server and has joined a channel. You can now publish or subscribe to a media stream in the channel.

         If the connection to the channel is lost because, for example, if the network is down or switched, the SDK automatically tries to reconnect and triggers:
         - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionInterrupted "onConnectionInterrupted" callback (deprecated).
         - The \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback and switches to the #CONNECTION_STATE_RECONNECTING state.
         */
        CONNECTION_STATE_CONNECTED = 3,
        /** 4: The SDK keeps rejoining the channel after being disconnected from a joined channel because of network issues.

         - If the SDK cannot rejoin the channel within 10 seconds after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionLost "onConnectionLost" callback, stays in the #CONNECTION_STATE_RECONNECTING state, and keeps rejoining the channel.
         - If the SDK fails to rejoin the channel 20 minutes after being disconnected from Agora's edge server, the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback, switches to the #CONNECTION_STATE_FAILED state, and stops rejoining the channel.
         */
        CONNECTION_STATE_RECONNECTING = 4,
        /** 5: The SDK fails to connect to Agora's edge server or join the channel.

         You must call the \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to leave this state, and call the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method again to rejoin the channel.

         If the SDK is banned from joining the channel by Agora's edge server (through the RESTful API), the SDK triggers the \ref agora::rtc::IRtcEngineEventHandler::onConnectionBanned "onConnectionBanned" (deprecated) and \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callbacks.
         */
        CONNECTION_STATE_FAILED = 5,
    }

    /** Reasons for a connection state change. */
    export enum CONNECTION_CHANGED_REASON_TYPE {
        /** 0: The SDK is connecting to Agora's edge server. */
        CONNECTION_CHANGED_CONNECTING = 0,
        /** 1: The SDK has joined the channel successfully. */
        CONNECTION_CHANGED_JOIN_SUCCESS = 1,
        /** 2: The connection between the SDK and Agora's edge server is interrupted. */
        CONNECTION_CHANGED_INTERRUPTED = 2,
        /** 3: The connection between the SDK and Agora's edge server is banned by Agora's edge server. */
        CONNECTION_CHANGED_BANNED_BY_SERVER = 3,
        /** 4: The SDK fails to join the channel for more than 20 minutes and stops reconnecting to the channel. */
        CONNECTION_CHANGED_JOIN_FAILED = 4,
        /** 5: The SDK has left the channel. */
        CONNECTION_CHANGED_LEAVE_CHANNEL = 5,
        /** 6: The connection failed since Appid is not valid. */
        CONNECTION_CHANGED_INVALID_APP_ID = 6,
        /** 7: The connection failed since channel name is not valid. */
        CONNECTION_CHANGED_INVALID_CHANNEL_NAME = 7,
        /** 8: The connection failed since token is not valid, possibly because:

         - The App Certificate for the project is enabled in Console, but you do not use Token when joining the channel. If you enable the App Certificate, you must use a token to join the channel.
         - The uid that you specify in the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method is different from the uid that you pass for generating the token.
         */
        CONNECTION_CHANGED_INVALID_TOKEN = 8,
        /** 9: The connection failed since token is expired. */
        CONNECTION_CHANGED_TOKEN_EXPIRED = 9,
        /** 10: The connection is rejected by server. */
        CONNECTION_CHANGED_REJECTED_BY_SERVER = 10,
        /** 11: The connection changed to reconnecting since SDK has set a proxy server. */
        CONNECTION_CHANGED_SETTING_PROXY_SERVER = 11,
        /** 12: When SDK is in connection failed, the renew token operation will make it connecting. */
        CONNECTION_CHANGED_RENEW_TOKEN = 12,
        /** 13: The IP Address of SDK client has changed. i.e., Network type or IP/Port changed by network operator might change client IP address. */
        CONNECTION_CHANGED_CLIENT_IP_ADDRESS_CHANGED = 13,
        /** 14: Timeout for the keep-alive of the connection between the SDK and Agora's edge server. The connection state changes to CONNECTION_STATE_RECONNECTING(4). */
        CONNECTION_CHANGED_KEEP_ALIVE_TIMEOUT = 14,
    }

    /** Network type. */
    export enum NETWORK_TYPE {
        /** -1: The network type is unknown. */
        NETWORK_TYPE_UNKNOWN = -1,
        /** 0: The SDK disconnects from the network. */
        NETWORK_TYPE_DISCONNECTED = 0,
        /** 1: The network type is LAN. */
        NETWORK_TYPE_LAN = 1,
        /** 2: The network type is Wi-Fi(including hotspots). */
        NETWORK_TYPE_WIFI = 2,
        /** 3: The network type is mobile 2G. */
        NETWORK_TYPE_MOBILE_2G = 3,
        /** 4: The network type is mobile 3G. */
        NETWORK_TYPE_MOBILE_3G = 4,
        /** 5: The network type is mobile 4G. */
        NETWORK_TYPE_MOBILE_4G = 5,
    }

    /** States of the last-mile network probe test. */
    export enum LASTMILE_PROBE_RESULT_STATE {
        /** 1: The last-mile network probe test is complete. */
        LASTMILE_PROBE_RESULT_COMPLETE = 1,
        /** 2: The last-mile network probe test is incomplete and the bandwidth estimation is not available, probably due to limited test resources. */
        LASTMILE_PROBE_RESULT_INCOMPLETE_NO_BWE = 2,
        /** 3: The last-mile network probe test is not carried out, probably due to poor network conditions. */
        LASTMILE_PROBE_RESULT_UNAVAILABLE = 3
    }

    /** Audio output routing. */
    export enum AUDIO_ROUTE_TYPE {
        /** Default.
         */
        AUDIO_ROUTE_DEFAULT = -1,
        /** Headset.
         */
        AUDIO_ROUTE_HEADSET = 0,
        /** Earpiece.
         */
        AUDIO_ROUTE_EARPIECE = 1,
        /** Headset with no microphone.
         */
        AUDIO_ROUTE_HEADSET_NO_MIC = 2,
        /** Speakerphone.
         */
        AUDIO_ROUTE_SPEAKERPHONE = 3,
        /** Loudspeaker.
         */
        AUDIO_ROUTE_LOUDSPEAKER = 4,
        /** Bluetooth headset.
         */
        AUDIO_ROUTE_BLUETOOTH = 5,
        /** USB peripheral.
         */
        AUDIO_ROUTE_USB = 6,
        /** HDMI peripheral.
         */
        AUDIO_ROUTE_HDMI = 7,
        /** DisplayPort peripheral.
         */
        AUDIO_ROUTE_DISPLAYPORT = 8,
        /** Apple AirPlay.
         */
        AUDIO_ROUTE_AIRPLAY = 9,
    }

    /** Audio session restriction. */
    export enum AUDIO_SESSION_OPERATION_RESTRICTION {
        /** No restriction, the SDK has full control of the audio session operations. */
        AUDIO_SESSION_OPERATION_RESTRICTION_NONE = 0,
        /** The SDK does not change the audio session category. */
        AUDIO_SESSION_OPERATION_RESTRICTION_SET_CATEGORY = 1,
        /** The SDK does not change any setting of the audio session (category, mode, categoryOptions). */
        AUDIO_SESSION_OPERATION_RESTRICTION_CONFIGURE_SESSION = 1 << 1,
        /** The SDK keeps the audio session active when leaving a channel. */
        AUDIO_SESSION_OPERATION_RESTRICTION_DEACTIVATE_SESSION = 1 << 2,
        /** The SDK does not configure the audio session anymore. */
        AUDIO_SESSION_OPERATION_RESTRICTION_ALL = 1 << 7,
    }

    export enum CAMERA_DIRECTION {
        /** The rear camera. */
        CAMERA_REAR = 0,
        /** The front camera. */
        CAMERA_FRONT = 1,
    }

    /** Quality change of the local video in terms of target frame rate and target bit rate since last count.
     */
    export enum QUALITY_ADAPT_INDICATION {
        /** The quality of the local video stays the same. */
        ADAPT_NONE = 0,
        /** The quality improves because the network bandwidth increases. */
        ADAPT_UP_BANDWIDTH = 1,
        /** The quality worsens because the network bandwidth decreases. */
        ADAPT_DOWN_BANDWIDTH = 2,
    }

    /** The error code in CHANNEL_MEDIA_RELAY_ERROR. */
    export enum CHANNEL_MEDIA_RELAY_ERROR {
        /** 0: The state is normal.
         */
        RELAY_OK = 0,
        /** 1: An error occurs in the server response.
         */
        RELAY_ERROR_SERVER_ERROR_RESPONSE = 1,
        /** 2: No server response. You can call the
         * \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" method to
         * leave the channel.
         */
        RELAY_ERROR_SERVER_NO_RESPONSE = 2,
        /** 3: The SDK fails to access the service, probably due to limited
         * resources of the server.
         */
        RELAY_ERROR_NO_RESOURCE_AVAILABLE = 3,
        /** 4: Fails to send the relay request.
         */
        RELAY_ERROR_FAILED_JOIN_SRC = 4,
        /** 5: Fails to accept the relay request.
         */
        RELAY_ERROR_FAILED_JOIN_DEST = 5,
        /** 6: The server fails to receive the media stream.
         */
        RELAY_ERROR_FAILED_PACKET_RECEIVED_FROM_SRC = 6,
        /** 7: The server fails to send the media stream.
         */
        RELAY_ERROR_FAILED_PACKET_SENT_TO_DEST = 7,
        /** 8: The SDK disconnects from the server due to poor network
         * connections. You can call the \ref agora::rtc::IRtcEngine::leaveChannel
         * "leaveChannel" method to leave the channel.
         */
        RELAY_ERROR_SERVER_CONNECTION_LOST = 8,
        /** 9: An internal error occurs in the server.
         */
        RELAY_ERROR_INTERNAL_ERROR = 9,
        /** 10: The token of the source channel has expired.
         */
        RELAY_ERROR_SRC_TOKEN_EXPIRED = 10,
        /** 11: The token of the destination channel has expired.
         */
        RELAY_ERROR_DEST_TOKEN_EXPIRED = 11,
    }

    /** The event code in CHANNEL_MEDIA_RELAY_EVENT. */
    export enum CHANNEL_MEDIA_RELAY_EVENT {
        /** 0: The user disconnects from the server due to poor network
         * connections.
         */
        RELAY_EVENT_NETWORK_DISCONNECTED = 0,
        /** 1: The network reconnects.
         */
        RELAY_EVENT_NETWORK_CONNECTED = 1,
        /** 2: The user joins the source channel.
         */
        RELAY_EVENT_PACKET_JOINED_SRC_CHANNEL = 2,
        /** 3: The user joins the destination channel.
         */
        RELAY_EVENT_PACKET_JOINED_DEST_CHANNEL = 3,
        /** 4: The SDK starts relaying the media stream to the destination channel.
         */
        RELAY_EVENT_PACKET_SENT_TO_DEST_CHANNEL = 4,
        /** 5: The server receives the video stream from the source channel.
         */
        RELAY_EVENT_PACKET_RECEIVED_VIDEO_FROM_SRC = 5,
        /** 6: The server receives the audio stream from the source channel.
         */
        RELAY_EVENT_PACKET_RECEIVED_AUDIO_FROM_SRC = 6,
        /** 7: The destination channel is updated.
         */
        RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL = 7,
        /** 8: The destination channel update fails due to internal reasons.
         */
        RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_REFUSED = 8,
        /** 9: The destination channel does not change, which means that the
         * destination channel fails to be updated.
         */
        RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_NOT_CHANGE = 9,
        /** 10: The destination channel name is NULL.
         */
        RELAY_EVENT_PACKET_UPDATE_DEST_CHANNEL_IS_NULL = 10,
        /** 11: The video profile is sent to the server.
         */
        RELAY_EVENT_VIDEO_PROFILE_UPDATE = 11,
    }

    /** The state code in CHANNEL_MEDIA_RELAY_STATE. */
    export enum CHANNEL_MEDIA_RELAY_STATE {
        /** 0: The SDK is initializing.
         */
        RELAY_STATE_IDLE = 0,
        /** 1: The SDK tries to relay the media stream to the destination channel.
         */
        RELAY_STATE_CONNECTING = 1,
        /** 2: The SDK successfully relays the media stream to the destination
         * channel.
         */
        RELAY_STATE_RUNNING = 2,
        /** 3: A failure occurs. See the details in code.
         */
        RELAY_STATE_FAILURE = 3,
    }

    /** (Recommended) The standard bitrate set in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method.

     In this mode, the bitrates differ between the live interactive streaming and communication profiles:

     - `COMMUNICATION` profile: The video bitrate is the same as the base bitrate.
     - `LIVE_BROADCASTING` profile: The video bitrate is twice the base bitrate.

     */
    const STANDARD_BITRATE = 0

    /** The compatible bitrate set in the \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration" method.

     The bitrate remains the same regardless of the channel profile. If you choose this mode in the `LIVE_BROADCASTING` profile, the video frame rate may be lower than the set value.
     */
    const COMPATIBLE_BITRATE = -1

    /** Use the default minimum bitrate.
     */
    const DEFAULT_MIN_BITRATE = -1

    /**  **DEPRECATED** Lifecycle of the CDN live video stream.
     */
    export enum RTMP_STREAM_LIFE_CYCLE_TYPE {
        /** Bind to the channel lifecycle. If all hosts leave the channel, the CDN live streaming stops after 30 seconds.
         */
        RTMP_STREAM_LIFE_CYCLE_BIND2CHANNEL = 1,
        /** Bind to the owner of the RTMP stream. If the owner leaves the channel, the CDN live streaming stops immediately.
         */
        RTMP_STREAM_LIFE_CYCLE_BIND2OWNER = 2,
    }

    /** Content hints for screen sharing.
     */
    export enum VideoContentHint {
        /** (Default) No content hint.
         */
        CONTENT_HINT_NONE,
        /** Motion-intensive content. Choose this option if you prefer smoothness or when you are sharing a video clip, movie, or video game.
         */
        CONTENT_HINT_MOTION,
        /** Motionless content. Choose this option if you prefer sharpness or when you are sharing a picture, PowerPoint slide, or text.
         */
        CONTENT_HINT_DETAILS
    }

    /**
     * IP areas.
     */
    export enum AREA_CODE {
        /**
         * Mainland China.
         */
        AREA_CODE_CN = (1 << 0),
        /**
         * North America.
         */
        AREA_CODE_NA = (1 << 1),
        /**
         * Europe.
         */
        AREA_CODE_EUR = (1 << 2),
        /**
         * Asia, excluding Mainland China.
         */
        AREA_CODE_AS = (1 << 3),
        /**
         * Japan.
         */
        AREA_CODE_JAPAN = (1 << 4),
        /**
         * India.
         */
        AREA_CODE_INDIA = (1 << 5),
        /**
         * (Default) Global.
         */
        AREA_CODE_GLOBAL = (0xFFFFFFFF)
    }

    export enum ENCRYPTION_CONFIG {
        /**
         * - 1: Force set master key and mode;
         * - 0: Not force set, checking whether encryption plugin exists
         */
        ENCRYPTION_FORCE_SETTING = (1 << 0),
        /**
         * - 1: Force not encrypting packet;
         * - 0: Not force encrypting;
         */
        ENCRYPTION_FORCE_DISABLE_PACKET = (1 << 1)
    }

    /** Encryption mode. */
    export enum ENCRYPTION_MODE {
        /** 1: (Default) 128-bit AES encryption, XTS mode. */
        AES_128_XTS = 1,
        /** 2: 128-bit AES encryption, ECB mode. */
        AES_128_ECB = 2,
        /** 3: 256-bit AES encryption, XTS mode. */
        AES_256_XTS = 3,
        /** 4: 128-bit SM4 encryption, ECB mode. */
        SM4_128_ECB = 4,
        /** Enumerator boundary. */
        MODE_END,
    }

    /** Error code. */
    export enum ERROR_CODE_TYPE {
        /** 0: No error occurs.
         */
        ERR_OK = 0,
        //1~1000
        /** 1: A general error occurs (no specified reason).
         */
        ERR_FAILED = 1,
        /** 2: An invalid parameter is used. For example, the specific channel name includes illegal characters.
         */
        ERR_INVALID_ARGUMENT = 2,
        /** 3: The SDK module is not ready. Possible solutions:

         - Check the audio device.
         - Check the completeness of the application.
         - Re-initialize the RTC engine.
         */
        ERR_NOT_READY = 3,
        /** 4: The SDK does not support this function.
         */
        ERR_NOT_SUPPORTED = 4,
        /** 5: The request is rejected.
         */
        ERR_REFUSED = 5,
        /** 6: The buffer size is not big enough to store the returned data.
         */
        ERR_BUFFER_TOO_SMALL = 6,
        /** 7: The SDK is not initialized before calling this method.
         */
        ERR_NOT_INITIALIZED = 7,
        /** 9: No permission exists. Check if the user has granted access to the audio or video device.
         */
        ERR_NO_PERMISSION = 9,
        /** 10: An API method timeout occurs. Some API methods require the SDK to return the execution result, and this error occurs if the request takes too long (more than 10 seconds) for the SDK to process.
         */
        ERR_TIMEDOUT = 10,
        /** 11: The request is canceled. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERR_CANCELED = 11,
        /** 12: The method is called too often. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERR_TOO_OFTEN = 12,
        /** 13: The SDK fails to bind to the network socket. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERR_BIND_SOCKET = 13,
        /** 14: The network is unavailable. This is for internal SDK use only, and it does not return to the application through any method or callback.
         */
        ERR_NET_DOWN = 14,
        /** 15: No network buffers are available. This is for internal SDK internal use only, and it does not return to the application through any method or callback.
         */
        ERR_NET_NOBUFS = 15,
        /** 17: The request to join the channel is rejected.
         *
         * - This error usually occurs when the user is already in the channel, and still calls the method to join the channel, for example, \ref agora::rtc::IRtcEngine::joinChannel "joinChannel".
         * - This error usually occurs when the user tries to join a channel during a call test (\ref agora::rtc::IRtcEngine::startEchoTest "startEchoTest"). Once you call \ref agora::rtc::IRtcEngine::startEchoTest "startEchoTest", you need to call \ref agora::rtc::IRtcEngine::stopEchoTest "stopEchoTest" before joining a channel.
         */
        ERR_JOIN_CHANNEL_REJECTED = 17,
        /** 18: The request to leave the channel is rejected.

         This error usually occurs:

         - When the user has left the channel and still calls \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" to leave the channel. In this case, stop calling \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel".
         - When the user has not joined the channel and still calls \ref agora::rtc::IRtcEngine::leaveChannel "leaveChannel" to leave the channel. In this case, no extra operation is needed.
         */
        ERR_LEAVE_CHANNEL_REJECTED = 18,
        /** 19: Resources are occupied and cannot be reused.
         */
        ERR_ALREADY_IN_USE = 19,
        /** 20: The SDK gives up the request due to too many requests.
         */
        ERR_ABORTED = 20,
        /** 21: In Windows, specific firewall settings can cause the SDK to fail to initialize and crash.
         */
        ERR_INIT_NET_ENGINE = 21,
        /** 22: The application uses too much of the system resources and the SDK fails to allocate the resources.
         */
        ERR_RESOURCE_LIMITED = 22,
        /** 101: The specified App ID is invalid. Please try to rejoin the channel with a valid App ID.
         */
        ERR_INVALID_APP_ID = 101,
        /** 102: The specified channel name is invalid. Please try to rejoin the channel with a valid channel name.
         */
        ERR_INVALID_CHANNEL_NAME = 102,
        /** 103: Fails to get server resources in the specified region. Please try to specify another region when calling \ref agora::rtc::IRtcEngine::initialize "initialize".
         */
        ERR_NO_SERVER_RESOURCES = 103,
        /** **DEPRECATED** 109: Deprecated as of v2.4.1. Use CONNECTION_CHANGED_TOKEN_EXPIRED(9) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.

         The token expired due to one of the following reasons:

         - Authorized Timestamp expired: The timestamp is represented by the number of seconds elapsed since 1/1/1970. The user can use the Token to access the Agora service within 24 hours after the Token is generated. If the user does not access the Agora service after 24 hours, this Token is no longer valid.
         - Call Expiration Timestamp expired: The timestamp is the exact time when a user can no longer use the Agora service (for example, when a user is forced to leave an ongoing call). When a value is set for the Call Expiration Timestamp, it does not mean that the token will expire, but that the user will be banned from the channel.
         */
        ERR_TOKEN_EXPIRED = 109,
        /** **DEPRECATED** 110: Deprecated as of v2.4.1. Use CONNECTION_CHANGED_INVALID_TOKEN(8) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.

         The token is invalid due to one of the following reasons:

         - The App Certificate for the project is enabled in Console, but the user is still using the App ID. Once the App Certificate is enabled, the user must use a token.
         - The uid is mandatory, and users must set the same uid as the one set in the \ref agora::rtc::IRtcEngine::joinChannel "joinChannel" method.
         */
        ERR_INVALID_TOKEN = 110,
        /** 111: The internet connection is interrupted. This applies to the Agora Web SDK only.
         */
        ERR_CONNECTION_INTERRUPTED = 111, // only used in web sdk
        /** 112: The internet connection is lost. This applies to the Agora Web SDK only.
         */
        ERR_CONNECTION_LOST = 112, // only used in web sdk
        /** 113: The user is not in the channel when calling the method.
         */
        ERR_NOT_IN_CHANNEL = 113,
        /** 114: The size of the sent data is over 1024 bytes when the user calls the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         */
        ERR_SIZE_TOO_LARGE = 114,
        /** 115: The bitrate of the sent data exceeds the limit of 6 Kbps when the user calls the \ref agora::rtc::IRtcEngine::sendStreamMessage "sendStreamMessage" method.
         */
        ERR_BITRATE_LIMIT = 115,
        /** 116: Too many data streams (over 5 streams) are created when the user calls the \ref agora::rtc::IRtcEngine::createDataStream "createDataStream" method.
         */
        ERR_TOO_MANY_DATA_STREAMS = 116,
        /** 117: The data stream transmission timed out.
         */
        ERR_STREAM_MESSAGE_TIMEOUT = 117,
        /** 119: Switching roles fail. Please try to rejoin the channel.
         */
        ERR_SET_CLIENT_ROLE_NOT_AUTHORIZED = 119,
        /** 120: Decryption fails. The user may have used a different encryption password to join the channel. Check your settings or try rejoining the channel.
         */
        ERR_DECRYPTION_FAILED = 120,
        /** 123: The client is banned by the server.
         */
        ERR_CLIENT_IS_BANNED_BY_SERVER = 123,
        /** 124: Incorrect watermark file parameter.
         */
        ERR_WATERMARK_PARAM = 124,
        /** 125: Incorrect watermark file path.
         */
        ERR_WATERMARK_PATH = 125,
        /** 126: Incorrect watermark file format.
         */
        ERR_WATERMARK_PNG = 126,
        /** 127: Incorrect watermark file information.
         */
        ERR_WATERMARKR_INFO = 127,
        /** 128: Incorrect watermark file data format.
         */
        ERR_WATERMARK_ARGB = 128,
        /** 129: An error occurs in reading the watermark file.
         */
        ERR_WATERMARK_READ = 129,
        /** 130: Encryption is enabled when the user calls the \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" method (CDN live streaming does not support encrypted streams).
         */
        ERR_ENCRYPTED_STREAM_NOT_ALLOWED_PUBLISH = 130,
        /** 134: The user account is invalid. */
        ERR_INVALID_USER_ACCOUNT = 134,

        /** 151: CDN related errors. Remove the original URL address and add a new one by calling the \ref agora::rtc::IRtcEngine::removePublishStreamUrl "removePublishStreamUrl" and \ref agora::rtc::IRtcEngine::addPublishStreamUrl "addPublishStreamUrl" methods.
         */
        ERR_PUBLISH_STREAM_CDN_ERROR = 151,
        /** 152: The host publishes more than 10 URLs. Delete the unnecessary URLs before adding new ones.
         */
        ERR_PUBLISH_STREAM_NUM_REACH_LIMIT = 152,
        /** 153: The host manipulates other hosts' URLs. Check your app logic.
         */
        ERR_PUBLISH_STREAM_NOT_AUTHORIZED = 153,
        /** 154: An error occurs in Agora's streaming server. Call the addPublishStreamUrl method to publish the streaming again.
         */
        ERR_PUBLISH_STREAM_INTERNAL_SERVER_ERROR = 154,
        /** 155: The server fails to find the stream.
         */
        ERR_PUBLISH_STREAM_NOT_FOUND = 155,
        /** 156: The format of the RTMP stream URL is not supported. Check whether the URL format is correct.
         */
        ERR_PUBLISH_STREAM_FORMAT_NOT_SUPPORTED = 156,

        //signaling: 400~600
        ERR_LOGOUT_OTHER = 400,  //
        ERR_LOGOUT_USER = 401,  // logout by user
        ERR_LOGOUT_NET = 402,  // network failure
        ERR_LOGOUT_KICKED = 403,  // login in other device
        ERR_LOGOUT_PACKET = 404,  //
        ERR_LOGOUT_TOKEN_EXPIRED = 405,  // token expired
        ERR_LOGOUT_OLDVERSION = 406,  //
        ERR_LOGOUT_TOKEN_WRONG = 407,
        ERR_LOGOUT_ALREADY_LOGOUT = 408,
        ERR_LOGIN_OTHER = 420,
        ERR_LOGIN_NET = 421,
        ERR_LOGIN_FAILED = 422,
        ERR_LOGIN_CANCELED = 423,
        ERR_LOGIN_TOKEN_EXPIRED = 424,
        ERR_LOGIN_OLD_VERSION = 425,
        ERR_LOGIN_TOKEN_WRONG = 426,
        ERR_LOGIN_TOKEN_KICKED = 427,
        ERR_LOGIN_ALREADY_LOGIN = 428,
        ERR_JOIN_CHANNEL_OTHER = 440,
        ERR_SEND_MESSAGE_OTHER = 440,
        ERR_SEND_MESSAGE_TIMEOUT = 441,
        ERR_QUERY_USERNUM_OTHER = 450,
        ERR_QUERY_USERNUM_TIMEOUT = 451,
        ERR_QUERY_USERNUM_BYUSER = 452,
        ERR_LEAVE_CHANNEL_OTHER = 460,
        ERR_LEAVE_CHANNEL_KICKED = 461,
        ERR_LEAVE_CHANNEL_BYUSER = 462,
        ERR_LEAVE_CHANNEL_LOGOUT = 463,
        ERR_LEAVE_CHANNEL_DISCONNECTED = 464,
        ERR_INVITE_OTHER = 470,
        ERR_INVITE_REINVITE = 471,
        ERR_INVITE_NET = 472,
        ERR_INVITE_PEER_OFFLINE = 473,
        ERR_INVITE_TIMEOUT = 474,
        ERR_INVITE_CANT_RECV = 475,


        //1001~2000
        /** 1001: Fails to load the media engine.
         */
        ERR_LOAD_MEDIA_ENGINE = 1001,
        /** 1002: Fails to start the call after enabling the media engine.
         */
        ERR_START_CALL = 1002,
        /** **DEPRECATED** 1003: Fails to start the camera.

         Deprecated as of v2.4.1. Use LOCAL_VIDEO_STREAM_ERROR_CAPTURE_FAILURE(4) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        ERR_START_CAMERA = 1003,
        /** 1004: Fails to start the video rendering module.
         */
        ERR_START_VIDEO_RENDER = 1004,
        /** 1005: A general error occurs in the Audio Device Module (no specified reason). Check if the audio device is used by another application, or try rejoining the channel.
         */
        ERR_ADM_GENERAL_ERROR = 1005,
        /** 1006: Audio Device Module: An error occurs in using the Java resources.
         */
        ERR_ADM_JAVA_RESOURCE = 1006,
        /** 1007: Audio Device Module: An error occurs in setting the sampling frequency.
         */
        ERR_ADM_SAMPLE_RATE = 1007,
        /** 1008: Audio Device Module: An error occurs in initializing the playback device.
         */
        ERR_ADM_INIT_PLAYOUT = 1008,
        /** 1009: Audio Device Module: An error occurs in starting the playback device.
         */
        ERR_ADM_START_PLAYOUT = 1009,
        /** 1010: Audio Device Module: An error occurs in stopping the playback device.
         */
        ERR_ADM_STOP_PLAYOUT = 1010,
        /** 1011: Audio Device Module: An error occurs in initializing the recording device.
         */
        ERR_ADM_INIT_RECORDING = 1011,
        /** 1012: Audio Device Module: An error occurs in starting the recording device.
         */
        ERR_ADM_START_RECORDING = 1012,
        /** 1013: Audio Device Module: An error occurs in stopping the recording device.
         */
        ERR_ADM_STOP_RECORDING = 1013,
        /** 1015: Audio Device Module: A playback error occurs. Check your playback device and try rejoining the channel.
         */
        ERR_ADM_RUNTIME_PLAYOUT_ERROR = 1015,
        /** 1017: Audio Device Module: A recording error occurs.
         */
        ERR_ADM_RUNTIME_RECORDING_ERROR = 1017,
        /** 1018: Audio Device Module: Fails to record.
         */
        ERR_ADM_RECORD_AUDIO_FAILED = 1018,
        /** 1022: Audio Device Module: An error occurs in initializing the
         * loopback device.
         */
        ERR_ADM_INIT_LOOPBACK = 1022,
        /** 1023: Audio Device Module: An error occurs in starting the loopback
         * device.
         */
        ERR_ADM_START_LOOPBACK = 1023,
        /** 1027: Audio Device Module: No recording permission exists. Check if the
         *  recording permission is granted.
         */
        ERR_ADM_NO_PERMISSION = 1027,
        /** 1033: Audio device module: The device is occupied.
         */
        ERR_ADM_RECORD_AUDIO_IS_ACTIVE = 1033,
        /** 1101: Audio device module: A fatal exception occurs.
         */
        ERR_ADM_ANDROID_JNI_JAVA_RESOURCE = 1101,
        /** 1108: Audio device module: The recording frequency is lower than 50.
         * 0 indicates that the recording is not yet started. We recommend
         * checking your recording permission.
         */
        ERR_ADM_ANDROID_JNI_NO_RECORD_FREQUENCY = 1108,
        /** 1109: The playback frequency is lower than 50. 0 indicates that the
         * playback is not yet started. We recommend checking if you have created
         * too many AudioTrack instances.
         */
        ERR_ADM_ANDROID_JNI_NO_PLAYBACK_FREQUENCY = 1109,
        /** 1111: Audio device module: AudioRecord fails to start up. A ROM system
         * error occurs. We recommend the following options to debug:
         * - Restart your App.
         * - Restart your cellphone.
         * - Check your recording permission.
         */
        ERR_ADM_ANDROID_JNI_JAVA_START_RECORD = 1111,
        /** 1112: Audio device module: AudioTrack fails to start up. A ROM system
         * error occurs. We recommend the following options to debug:
         * - Restart your App.
         * - Restart your cellphone.
         * - Check your playback permission.
         */
        ERR_ADM_ANDROID_JNI_JAVA_START_PLAYBACK = 1112,
        /** 1115: Audio device module: AudioRecord returns error. The SDK will
         * automatically restart AudioRecord. */
        ERR_ADM_ANDROID_JNI_JAVA_RECORD_ERROR = 1115,
        /** **DEPRECATED** */
        ERR_ADM_ANDROID_OPENSL_CREATE_ENGINE = 1151,
        /** **DEPRECATED** */
        ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_RECORDER = 1153,
        /** **DEPRECATED** */
        ERR_ADM_ANDROID_OPENSL_START_RECORDER_THREAD = 1156,
        /** **DEPRECATED** */
        ERR_ADM_ANDROID_OPENSL_CREATE_AUDIO_PLAYER = 1157,
        /** **DEPRECATED** */
        ERR_ADM_ANDROID_OPENSL_START_PLAYER_THREAD = 1160,
        /** 1201: Audio device module: The current device does not support audio
         * input, possibly because you have mistakenly configured the audio session
         *  category, or because some other app is occupying the input device. We
         * recommend terminating all background apps and re-joining the channel. */
        ERR_ADM_IOS_INPUT_NOT_AVAILABLE = 1201,
        /** 1206: Audio device module: Cannot activate the Audio Session.*/
        ERR_ADM_IOS_ACTIVATE_SESSION_FAIL = 1206,
        /** 1210: Audio device module: Fails to initialize the audio device,
         * normally because the audio device parameters are wrongly set.*/
        ERR_ADM_IOS_VPIO_INIT_FAIL = 1210,
        /** 1213: Audio device module: Fails to re-initialize the audio device,
         * normally because the audio device parameters are wrongly set.*/
        ERR_ADM_IOS_VPIO_REINIT_FAIL = 1213,
        /** 1214: Fails to re-start up the Audio Unit, possibly because the audio
         * session category is not compatible with the settings of the Audio Unit.
         */
        ERR_ADM_IOS_VPIO_RESTART_FAIL = 1214,
        /// @cond
        ERR_ADM_IOS_SET_RENDER_CALLBACK_FAIL = 1219,
        /// @endcond
        /** **DEPRECATED** */
        ERR_ADM_IOS_SESSION_SAMPLERATR_ZERO = 1221,
        /** 1301: Audio device module: An audio driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system.*/
        ERR_ADM_WIN_CORE_INIT = 1301,
        /** 1303: Audio device module: A recording driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERR_ADM_WIN_CORE_INIT_RECORDING = 1303,
        /** 1306: Audio device module: A playout driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERR_ADM_WIN_CORE_INIT_PLAYOUT = 1306,
        /** 1307: Audio device module: No audio device is available. Solutions:
         * Plug in a proper audio device. */
        ERR_ADM_WIN_CORE_INIT_PLAYOUT_NULL = 1307,
        /** 1309: Audio device module: An audio driver abnomality or a
         * compatibility issue occurs. Solutions: Disable and restart the audio
         * device, or reboot the system. */
        ERR_ADM_WIN_CORE_START_RECORDING = 1309,
        /** 1311: Audio device module: Insufficient system memory or poor device
         * performance. Solutions: Reboot the system or replace the device.
         */
        ERR_ADM_WIN_CORE_CREATE_REC_THREAD = 1311,
        /** 1314: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver.*/
        ERR_ADM_WIN_CORE_CAPTURE_NOT_STARTUP = 1314,
        /** 1319: Audio device module: Insufficient system memory or poor device
         * performance. Solutions: Reboot the system or replace the device. */
        ERR_ADM_WIN_CORE_CREATE_RENDER_THREAD = 1319,
        /** 1320: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Replace the device. */
        ERR_ADM_WIN_CORE_RENDER_NOT_STARTUP = 1320,
        /** 1322: Audio device module: No audio sampling device is available.
         * Solutions: Plug in a proper recording device. */
        ERR_ADM_WIN_CORE_NO_RECORDING_DEVICE = 1322,
        /** 1323: Audio device module: No audio playout device is available.
         * Solutions: Plug in a proper playback device.*/
        ERR_ADM_WIN_CORE_NO_PLAYOUT_DEVICE = 1323,
        /** 1351: Audio device module: An audio driver abnormality or a
         * compatibility issue occurs. Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_INIT = 1351,
        /** 1353: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_INIT_RECORDING = 1353,
        /** 1354: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_INIT_MICROPHONE = 1354,
        /** 1355: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_INIT_PLAYOUT = 1355,
        /** 1356: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_INIT_SPEAKER = 1356,
        /** 1357: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver. */
        ERR_ADM_WIN_WAVE_START_RECORDING = 1357,
        /** 1358: Audio device module: An audio driver abnormality occurs.
         * Solutions:
         * - Disable and then re-enable the audio device.
         * - Reboot the system.
         * - Upgrade your audio card driver.*/
        ERR_ADM_WIN_WAVE_START_PLAYOUT = 1358,
        /** 1359: Audio Device Module: No recording device exists.
         */
        ERR_ADM_NO_RECORDING_DEVICE = 1359,
        /** 1360: Audio Device Module: No playback device exists.
         */
        ERR_ADM_NO_PLAYOUT_DEVICE = 1360,

        // VDM error code starts from 1500
        /** 1501: Video Device Module: The camera is unauthorized.
         */
        ERR_VDM_CAMERA_NOT_AUTHORIZED = 1501,

        // VDM error code starts from 1500
        /** **DEPRECATED** 1502: Video Device Module: The camera in use.

         Deprecated as of v2.4.1. Use LOCAL_VIDEO_STREAM_ERROR_DEVICE_BUSY(3) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        ERR_VDM_WIN_DEVICE_IN_USE = 1502,

        // VCM error code starts from 1600
        /** 1600: Video Device Module: An unknown error occurs.
         */
        ERR_VCM_UNKNOWN_ERROR = 1600,
        /** 1601: Video Device Module: An error occurs in initializing the video encoder.
         */
        ERR_VCM_ENCODER_INIT_ERROR = 1601,
        /** 1602: Video Device Module: An error occurs in encoding.
         */
        ERR_VCM_ENCODER_ENCODE_ERROR = 1602,
        /** 1603: Video Device Module: An error occurs in setting the video encoder.
         */
        ERR_VCM_ENCODER_SET_ERROR = 1603,
    }

    /** The contrast level, used with the @p lightening parameter.
     */
    export enum LIGHTENING_CONTRAST_LEVEL {
        /** Low contrast level. */
        LIGHTENING_CONTRAST_LOW = 0,
        /** (Default) Normal contrast level. */
        LIGHTENING_CONTRAST_NORMAL,
        /** High contrast level. */
        LIGHTENING_CONTRAST_HIGH
    }

    /** Output log filter level. */
    export enum LOG_FILTER_TYPE {
        /** 0: Do not output any log information. */
        LOG_FILTER_OFF = 0,
        /** 0x080f: Output all log information.
         Set your log filter as debug if you want to get the most complete log file.      */
        LOG_FILTER_DEBUG = 0x080f,
        /** 0x000f: Output CRITICAL, ERROR, WARNING, and INFO level log information.
         We recommend setting your log filter as this level.
         */
        LOG_FILTER_INFO = 0x000f,
        /** 0x000e: Outputs CRITICAL, ERROR, and WARNING level log information.
         */
        LOG_FILTER_WARN = 0x000e,
        /** 0x000c: Outputs CRITICAL and ERROR level log information. */
        LOG_FILTER_ERROR = 0x000c,
        /** 0x0008: Outputs CRITICAL level log information. */
        LOG_FILTER_CRITICAL = 0x0008,
        /// @cond
        LOG_FILTER_MASK = 0x80f,
        /// @endcond
    }

    /** Metadata type of the observer.
     @note We only support video metadata for now.
     */
    export enum METADATA_TYPE {
        /** -1: the metadata type is unknown.
         */
        UNKNOWN_METADATA = -1,
        /** 0: the metadata type is video.
         */
        VIDEO_METADATA = 0,
    }

    /** The video pixel format.
     */
    export enum VIDEO_PIXEL_FORMAT {
        /** 0: The video pixel format is unknown.
         */
        VIDEO_PIXEL_UNKNOWN = 0,
        /** 1: The video pixel format is I420.
         */
        VIDEO_PIXEL_I420 = 1,
        /** 2: The video pixel format is BGRA.
         */
        VIDEO_PIXEL_BGRA = 2,
        /** 3: The video pixel format is NV21.
         */
        VIDEO_PIXEL_NV21 = 3,
        /** 4: The video pixel format is RGBA.
         */
        VIDEO_PIXEL_RGBA = 4,
        /** 5: The video pixel format is IMC2.
         */
        VIDEO_PIXEL_IMC2 = 5,
        /** 7: The video pixel format is ARGB.
         */
        VIDEO_PIXEL_ARGB = 7,
        /** 8: The video pixel format is NV12.
         */
        VIDEO_PIXEL_NV12 = 8,
        /** 16: The video pixel format is I422.
         */
        VIDEO_PIXEL_I422 = 16,
    }

    /** Warning code.
     */
    export enum WARN_CODE_TYPE {
        /** 8: The specified view is invalid. Specify a view when using the video call function.
         */
        WARN_INVALID_VIEW = 8,
        /** 16: Failed to initialize the video function, possibly caused by a lack of resources. The users cannot see the video while the voice communication is not affected.
         */
        WARN_INIT_VIDEO = 16,
        /** 20: The request is pending, usually due to some module not being ready, and the SDK postponed processing the request.
         */
        WARN_PENDING = 20,
        /** 103: No channel resources are available. Maybe because the server cannot allocate any channel resource.
         */
        WARN_NO_AVAILABLE_CHANNEL = 103,
        /** 104: A timeout occurs when looking up the channel. When joining a channel, the SDK looks up the specified channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.
         */
        WARN_LOOKUP_CHANNEL_TIMEOUT = 104,
        /** **DEPRECATED** 105: The server rejects the request to look up the channel. The server cannot process this request or the request is illegal.

         Deprecated as of v2.4.1. Use CONNECTION_CHANGED_REJECTED_BY_SERVER(10) in the \ref agora::rtc::IRtcEngineEventHandler::onConnectionStateChanged "onConnectionStateChanged" callback instead.
         */
        WARN_LOOKUP_CHANNEL_REJECTED = 105,
        /** 106: A timeout occurs when opening the channel. Once the specific channel is found, the SDK opens the channel. This warning usually occurs when the network condition is too poor for the SDK to connect to the server.
         */
        WARN_OPEN_CHANNEL_TIMEOUT = 106,
        /** 107: The server rejects the request to open the channel. The server cannot process this request or the request is illegal.
         */
        WARN_OPEN_CHANNEL_REJECTED = 107,

        // sdk: 100~1000
        /** 111: A timeout occurs when switching to the live video.
         */
        WARN_SWITCH_LIVE_VIDEO_TIMEOUT = 111,
        /** 118: A timeout occurs when setting the client role in the live interactive streaming profile.
         */
        WARN_SET_CLIENT_ROLE_TIMEOUT = 118,
        /** 121: The ticket to open the channel is invalid.
         */
        WARN_OPEN_CHANNEL_INVALID_TICKET = 121,
        /** 122: Try connecting to another server.
         */
        WARN_OPEN_CHANNEL_TRY_NEXT_VOS = 122,
        /** 131: The channel connection cannot be recovered. */
        WARN_CHANNEL_CONNECTION_UNRECOVERABLE = 131,
        WARN_CHANNEL_CONNECTION_IP_CHANGED = 132,
        WARN_CHANNEL_CONNECTION_PORT_CHANGED = 133,
        /** 701: An error occurs in opening the audio mixing file.
         */
        WARN_AUDIO_MIXING_OPEN_ERROR = 701,
        /** 1014: Audio Device Module: A warning occurs in the playback device.
         */
        WARN_ADM_RUNTIME_PLAYOUT_WARNING = 1014,
        /** 1016: Audio Device Module: a warning occurs in the recording device.
         */
        WARN_ADM_RUNTIME_RECORDING_WARNING = 1016,
        /** 1019: Audio Device Module: no valid audio data is recorded.
         */
        WARN_ADM_RECORD_AUDIO_SILENCE = 1019,
        /** 1020: Audio device module: The audio playback frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.
         */
        WARN_ADM_PLAYOUT_MALFUNCTION = 1020,
        /** 1021: Audio device module: the audio recording frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.
         */
        WARN_ADM_RECORD_MALFUNCTION = 1021,
        /** 1025: The audio playback or recording is interrupted by system events (such as a phone call).
         */
        WARN_ADM_CALL_INTERRUPTION = 1025,
        /** 1029: During a call, the audio session category should be set to
         * AVAudioSessionCategoryPlayAndRecord, and RtcEngine monitors this value.
         * If the audio session category is set to other values, this warning code
         * is triggered and RtcEngine will forcefully set it back to
         * AVAudioSessionCategoryPlayAndRecord.
         */
        WARN_ADM_IOS_CATEGORY_NOT_PLAYANDRECORD = 1029,
        /** 1031: Audio Device Module: The recorded audio voice is too low.
         */
        WARN_ADM_RECORD_AUDIO_LOWLEVEL = 1031,
        /** 1032: Audio Device Module: The playback audio voice is too low.
         */
        WARN_ADM_PLAYOUT_AUDIO_LOWLEVEL = 1032,
        /** 1033: Audio device module: The audio recording device is occupied.
         */
        WARN_ADM_RECORD_AUDIO_IS_ACTIVE = 1033,
        /** 1040: Audio device module: An exception occurs with the audio drive.
         * Solutions:
         * - Disable or re-enable the audio device.
         * - Re-enable your device.
         * - Update the sound card drive.
         */
        WARN_ADM_WINDOWS_NO_DATA_READY_EVENT = 1040,
        /** 1042: Audio device module: The audio recording device is different from the audio playback device,
         * which may cause echoes problem. Agora recommends using the same audio device to record and playback
         * audio.
         */
        WARN_ADM_INCONSISTENT_AUDIO_DEVICE = 1042,
        /** 1051: (Communication profile only) Audio processing module: A howling sound is detected when recording the audio data.
         */
        WARN_APM_HOWLING = 1051,
        /** 1052: Audio Device Module: The device is in the glitch state.
         */
        WARN_ADM_GLITCH_STATE = 1052,
        /** 1053: Audio Processing Module: A residual echo is detected, which may be caused by the belated scheduling of system threads or the signal overflow.
         */
        WARN_APM_RESIDUAL_ECHO = 1053,
        /// @cond
        WARN_ADM_WIN_CORE_NO_RECORDING_DEVICE = 1322,
        /// @endcond
        /** 1323: Audio device module: No available playback device.
         * Solution: Plug in the audio device.
         */
        WARN_ADM_WIN_CORE_NO_PLAYOUT_DEVICE = 1323,
        /** Audio device module: The capture device is released improperly.
         * Solutions:
         * - Disable or re-enable the audio device.
         * - Re-enable your device.
         * - Update the sound card drive.
         */
        WARN_ADM_WIN_CORE_IMPROPER_CAPTURE_RELEASE = 1324,
        /** 1610: Super-resolution warning: The original video dimensions of the remote user exceed 640 * 480.
         */
        WARN_SUPER_RESOLUTION_STREAM_OVER_LIMITATION = 1610,
        /** 1611: Super-resolution warning: Another user is using super resolution.
         */
        WARN_SUPER_RESOLUTION_USER_COUNT_OVER_LIMITATION = 1611,
        /** 1612: The device is not supported.
         */
        WARN_SUPER_RESOLUTION_DEVICE_NOT_SUPPORTED = 1612,
        /// @cond
        WARN_RTM_LOGIN_TIMEOUT = 2005,
        WARN_RTM_KEEP_ALIVE_TIMEOUT = 2009
        /// @endcond
    }

    /** The uplink or downlink last-mile network probe test result. */
    export interface LastmileProbeOneWayResult {
        /** The packet loss rate (%). */
        packetLossRate: number
        /** The network jitter (ms). */
        jitter: number
        /* The estimated available bandwidth (bps). */
        availableBandwidth: number
    }

    /** The uplink and downlink last-mile network probe test result. */
    export interface LastmileProbeResult {
        /** The state of the probe test. */
        state: LASTMILE_PROBE_RESULT_STATE
        /** The uplink last-mile network probe test result. */
        uplinkReport: LastmileProbeOneWayResult
        /** The downlink last-mile network probe test result. */
        downlinkReport: LastmileProbeOneWayResult
        /** The round-trip delay time (ms). */
        rtt: number
    }

    /** Configurations of the last-mile network probe test. */
    export interface LastmileProbeConfig {
        /** Sets whether or not to test the uplink network. Some users, for example, the audience in a `LIVE_BROADCASTING` channel, do not need such a test:
         - true: test.
         - false: do not test. */
        probeUplink: boolean
        /** Sets whether or not to test the downlink network:
         - true: test.
         - false: do not test. */
        probeDownlink: boolean
        /** The expected maximum sending bitrate (bps) of the local user. The value ranges between 100000 and 5000000. We recommend setting this parameter according to the bitrate value set by \ref IRtcEngine::setVideoEncoderConfiguration "setVideoEncoderConfiguration". */
        expectedUplinkBitrate: number
        /** The expected maximum receiving bitrate (bps) of the local user. The value ranges between 100000 and 5000000. */
        expectedDownlinkBitrate: number
    }

    /** Properties of the audio volume information.

     An array containing the user ID and volume information for each speaker.
     */
    export interface AudioVolumeInfo {
        /**
         User ID of the speaker. The uid of the local user is 0.
         */
        uid: number
        /** The volume of the speaker. The volume ranges between 0 (lowest volume) and 255 (highest volume).
         */
        volume: number
        /** Voice activity status of the local user.
         * - 0: The local user is not speaking.
         * - 1: The local user is speaking.
         *
         * @note
         * - The `vad` parameter cannot report the voice activity status of the remote users. In the remote users' callback, `vad` = 0.
         * - Ensure that you set `report_vad`(true) in the \ref agora::rtc::IRtcEngine::enableAudioVolumeIndication(int, int, bool) "enableAudioVolumeIndication" method to enable the voice activity detection of the local user.
         */
        vad: number
        /** The channel ID, which indicates which channel the speaker is in.
         */
        channelId: string
    }

    /** Statistics of the channel.
     */
    export interface RtcStats {
        /**
         Call duration (s), represented by an aggregate value.
         */
        duration: number
        /**
         Total number of bytes transmitted, represented by an aggregate value.
         */
        txBytes: number
        /**
         Total number of bytes received, represented by an aggregate value.
         */
        rxBytes: number
        /** Total number of audio bytes sent (bytes), represented
         * by an aggregate value.
         */
        txAudioBytes: number
        /** Total number of video bytes sent (bytes), represented
         * by an aggregate value.
         */
        txVideoBytes: number
        /** Total number of audio bytes received (bytes) before
         * network countermeasures, represented by an aggregate value.
         */
        rxAudioBytes: number
        /** Total number of video bytes received (bytes),
         * represented by an aggregate value.
         */
        rxVideoBytes: number

        /**
         Transmission bitrate (Kbps), represented by an instantaneous value.
         */
        txKBitRate: number
        /**
         Receive bitrate (Kbps), represented by an instantaneous value.
         */
        rxKBitRate: number
        /**
         Audio receive bitrate (Kbps), represented by an instantaneous value.
         */
        rxAudioKBitRate: number
        /**
         Audio transmission bitrate (Kbps), represented by an instantaneous value.
         */
        txAudioKBitRate: number
        /**
         Video receive bitrate (Kbps), represented by an instantaneous value.
         */
        rxVideoKBitRate: number
        /**
         Video transmission bitrate (Kbps), represented by an instantaneous value.
         */
        txVideoKBitRate: number
        /** Client-server latency (ms)
         */
        lastmileDelay: number
        /** The packet loss rate (%) from the local client to Agora's edge server,
         * before using the anti-packet-loss method.
         */
        txPacketLossRate: number
        /** The packet loss rate (%) from Agora's edge server to the local client,
         * before using the anti-packet-loss method.
         */
        rxPacketLossRate: number
        /** Number of users in the channel.

         - `COMMUNICATION` profile: The number of users in the channel.
         - `LIVE_BROADCASTING` profile:

         -  If the local user is an audience: The number of users in the channel = The number of hosts in the channel + 1.
         -  If the user is a host: The number of users in the channel = The number of hosts in the channel.
         */
        userCount: number
        /**
         Application CPU usage (%).
         */
        cpuAppUsage: number
        /**
         System CPU usage (%).

         In the multi-kernel environment, this member represents the average CPU usage.
         The value **=** 100 **-** System Idle Progress in Task Manager (%).
         */
        cpuTotalUsage: number
        /** The round-trip time delay from the client to the local router.
         */
        gatewayRtt: number
        /**
         The memory usage ratio of the app (%).
         @note This value is for reference only. Due to system limitations, you may not get the value of this member.
         */
        memoryAppUsageRatio: number
        /**
         The memory usage ratio of the system (%).
         @note This value is for reference only. Due to system limitations, you may not get the value of this member.
         */
        memoryTotalUsageRatio: number
        /**
         The memory usage of the app (KB).
         @note This value is for reference only. Due to system limitations, you may not get the value of this member.
         */
        memoryAppUsageInKbytes: number
    }

    /** Statistics of the local video stream.
     */
    export interface LocalVideoStats {
        /** Bitrate (Kbps) sent in the reported interval, which does not include
         * the bitrate of the retransmission video after packet loss.
         */
        sentBitrate: number
        /** Frame rate (fps) sent in the reported interval, which does not include
         * the frame rate of the retransmission video after packet loss.
         */
        sentFrameRate: number
        /** The encoder output frame rate (fps) of the local video.
         */
        encoderOutputFrameRate: number
        /** The render output frame rate (fps) of the local video.
         */
        rendererOutputFrameRate: number
        /** The target bitrate (Kbps) of the current encoder. This value is estimated by the SDK based on the current network conditions.
         */
        targetBitrate: number
        /** The target frame rate (fps) of the current encoder.
         */
        targetFrameRate: number
        /** Quality change of the local video in terms of target frame rate and
         * target bit rate in this reported interval. See #QUALITY_ADAPT_INDICATION.
         */
        qualityAdaptIndication: QUALITY_ADAPT_INDICATION
        /** The encoding bitrate (Kbps), which does not include the bitrate of the
         * re-transmission video after packet loss.
         */
        encodedBitrate: number
        /** The width of the encoding frame (px).
         */
        encodedFrameWidth: number
        /** The height of the encoding frame (px).
         */
        encodedFrameHeight: number
        /** The value of the sent frames, represented by an aggregate value.
         */
        encodedFrameCount: number
        /** The codec type of the local video:
         * - VIDEO_CODEC_VP8 = 1: VP8.
         * - VIDEO_CODEC_H264 = 2: (Default) H.264.
         */
        codecType: VIDEO_CODEC_TYPE
        /** The video packet loss rate (%) from the local client to the Agora edge server before applying the anti-packet loss strategies.
         */
        txPacketLossRate: number
        /** The capture frame rate (fps) of the local video.
         */
        captureFrameRate: number
    }

    /** Statistics of the remote video stream.
     */
    export interface RemoteVideoStats {
        /**
         User ID of the remote user sending the video streams.
         */
        uid: number
        /** **DEPRECATED** Time delay (ms).
         *
         * In scenarios where audio and video is synchronized, you can use the value of
         * `networkTransportDelay` and `jitterBufferDelay` in `RemoteAudioStats` to know the delay statistics of the remote video.
         */
        delay: number
        /** Width (pixels) of the video stream.
         */
        width: number
        /**
         Height (pixels) of the video stream.
         */
        height: number
        /**
         Bitrate (Kbps) received since the last count.
         */
        receivedBitrate: number
        /** The decoder output frame rate (fps) of the remote video.
         */
        decoderOutputFrameRate: number
        /** The render output frame rate (fps) of the remote video.
         */
        rendererOutputFrameRate: number
        /** Packet loss rate (%) of the remote video stream after using the anti-packet-loss method.
         */
        packetLossRate: number
        /** The type of the remote video stream: #REMOTE_VIDEO_STREAM_TYPE
         */
        rxStreamType: REMOTE_VIDEO_STREAM_TYPE
        /**
         The total freeze time (ms) of the remote video stream after the remote user joins the channel.
         In a video session where the frame rate is set to no less than 5 fps, video freeze occurs when
         the time interval between two adjacent renderable video frames is more than 500 ms.
         */
        totalFrozenTime: number
        /**
         The total video freeze time as a percentage (%) of the total time when the video is available.
         */
        frozenRate: number
        /**
         The total time (ms) when the remote user in the Communication profile or the remote
         broadcaster in the Live-broadcast profile neither stops sending the video stream nor
         disables the video module after joining the channel.

         @since v3.0.1
         */
        totalActiveTime: number
        /**
         * The total publish duration (ms) of the remote video stream.
         */
        publishDuration: number
    }

    /** Audio statistics of the local user */
    export interface LocalAudioStats {
        /** The number of channels.
         */
        numChannels: number
        /** The sample rate (Hz).
         */
        sentSampleRate: number
        /** The average sending bitrate (Kbps).
         */
        sentBitrate: number
        /** The audio packet loss rate (%) from the local client to the Agora edge server before applying the anti-packet loss strategies.
         */
        txPacketLossRate: number
    }

    /** Audio statistics of a remote user */
    export interface RemoteAudioStats {
        /** User ID of the remote user sending the audio streams.
         *
         */
        uid: number
        /** Audio quality received by the user: #QUALITY_TYPE.
         */
        quality: number
        /** Network delay (ms) from the sender to the receiver.
         */
        networkTransportDelay: number
        /** Network delay (ms) from the receiver to the jitter buffer.
         */
        jitterBufferDelay: number
        /** The audio frame loss rate in the reported interval.
         */
        audioLossRate: number
        /** The number of channels.
         */
        numChannels: number
        /** The sample rate (Hz) of the received audio stream in the reported
         * interval.
         */
        receivedSampleRate: number
        /** The average bitrate (Kbps) of the received audio stream in the
         * reported interval. */
        receivedBitrate: number
        /** The total freeze time (ms) of the remote audio stream after the remote user joins the channel. In a session, audio freeze occurs when the audio frame loss rate reaches 4%.
         */
        totalFrozenTime: number
        /** The total audio freeze time as a percentage (%) of the total time when the audio is available. */
        frozenRate: number
        /** The total time (ms) when the remote user in the `COMMUNICATION` profile or the remote host in
         the `LIVE_BROADCASTING` profile neither stops sending the audio stream nor disables the audio module after joining the channel.
         */
        totalActiveTime: number
        /**
         * The total publish duration (ms) of the remote audio stream.
         */
        publishDuration: number
    }

    /**
     * Video dimensions.
     */
    export class VideoDimensions {
        /** Width (pixels) of the video. */
        width: number
        /** Height (pixels) of the video. */
        height: number

        constructor(width: number = 640, height: number = 480) {
            this.width = width
            this.height = height
        }
    }

    /** Video encoder configurations.
     */
    export class VideoEncoderConfiguration {
        /** The video frame dimensions (px) used to specify the video quality and measured by the total number of pixels along a frame's width and height: VideoDimensions. The default value is 640 x 360.
         */
        dimensions: VideoDimensions
        /** The frame rate of the video: #FRAME_RATE. The default value is 15.

         Note that we do not recommend setting this to a value greater than 30.
         */
        frameRate: FRAME_RATE
        /** The minimum frame rate of the video. The default value is -1.
         */
        minFrameRate: number
        /** The video encoding bitrate (Kbps).

         Choose one of the following options:

         - #STANDARD_BITRATE: (Recommended) The standard bitrate.
         - the `COMMUNICATION` profile: the encoding bitrate equals the base bitrate.
         - the `LIVE_BROADCASTING` profile: the encoding bitrate is twice the base bitrate.
         - #COMPATIBLE_BITRATE: The compatible bitrate: the bitrate stays the same regardless of the profile.

         the `COMMUNICATION` profile prioritizes smoothness, while the `LIVE_BROADCASTING` profile prioritizes video quality (requiring a higher bitrate). We recommend setting the bitrate mode as #STANDARD_BITRATE to address this difference.

         The following table lists the recommended video encoder configurations, where the base bitrate applies to the `COMMUNICATION` profile. Set your bitrate based on this table. If you set a bitrate beyond the proper range, the SDK automatically sets it to within the range.

         @note
         In the following table, **Base Bitrate** applies to the `COMMUNICATION` profile, and **Live Bitrate** applies to the `LIVE_BROADCASTING` profile.

         | Resolution             | Frame Rate (fps) | Base Bitrate (Kbps)                    | Live Bitrate (Kbps)                    |
         |------------------------|------------------|----------------------------------------|----------------------------------------|
         | 160 * 120              | 15               | 65                                     | 130                                    |
         | 120 * 120              | 15               | 50                                     | 100                                    |
         | 320 * 180              | 15               | 140                                    | 280                                    |
         | 180 * 180              | 15               | 100                                    | 200                                    |
         | 240 * 180              | 15               | 120                                    | 240                                    |
         | 320 * 240              | 15               | 200                                    | 400                                    |
         | 240 * 240              | 15               | 140                                    | 280                                    |
         | 424 * 240              | 15               | 220                                    | 440                                    |
         | 640 * 360              | 15               | 400                                    | 800                                    |
         | 360 * 360              | 15               | 260                                    | 520                                    |
         | 640 * 360              | 30               | 600                                    | 1200                                   |
         | 360 * 360              | 30               | 400                                    | 800                                    |
         | 480 * 360              | 15               | 320                                    | 640                                    |
         | 480 * 360              | 30               | 490                                    | 980                                    |
         | 640 * 480              | 15               | 500                                    | 1000                                   |
         | 480 * 480              | 15               | 400                                    | 800                                    |
         | 640 * 480              | 30               | 750                                    | 1500                                   |
         | 480 * 480              | 30               | 600                                    | 1200                                   |
         | 848 * 480              | 15               | 610                                    | 1220                                   |
         | 848 * 480              | 30               | 930                                    | 1860                                   |
         | 640 * 480              | 10               | 400                                    | 800                                    |
         | 1280 * 720             | 15               | 1130                                   | 2260                                   |
         | 1280 * 720             | 30               | 1710                                   | 3420                                   |
         | 960 * 720              | 15               | 910                                    | 1820                                   |
         | 960 * 720              | 30               | 1380                                   | 2760                                   |
         | 1920 * 1080            | 15               | 2080                                   | 4160                                   |
         | 1920 * 1080            | 30               | 3150                                   | 6300                                   |
         | 1920 * 1080            | 60               | 4780                                   | 6500                                   |
         | 2560 * 1440            | 30               | 4850                                   | 6500                                   |
         | 2560 * 1440            | 60               | 6500                                   | 6500                                   |
         | 3840 * 2160            | 30               | 6500                                   | 6500                                   |
         | 3840 * 2160            | 60               | 6500                                   | 6500                                   |

         */
        bitrate: number
        /** The minimum encoding bitrate (Kbps).

         The SDK automatically adjusts the encoding bitrate to adapt to the network conditions. Using a value greater than the default value forces the video encoder to output high-quality images but may cause more packet loss and hence sacrifice the smoothness of the video transmission. That said, unless you have special requirements for image quality, Agora does not recommend changing this value.

         @note This parameter applies only to the `LIVE_BROADCASTING` profile.
         */
        minBitrate: number
        /** The video orientation mode of the video: #ORIENTATION_MODE.
         */
        orientationMode: ORIENTATION_MODE
        /** The video encoding degradation preference under limited bandwidth: #DEGRADATION_PREFERENCE.
         */
        degradationPreference: DEGRADATION_PREFERENCE
        /** Sets the mirror mode of the published local video stream. It only affects the video that the remote user sees. See #VIDEO_MIRROR_MODE_TYPE

         @note: The SDK disables the mirror mode by default.
         */
        mirrorMode: VIDEO_MIRROR_MODE_TYPE

        constructor(
            dimensions: VideoDimensions = new VideoDimensions(),
            frameRate: FRAME_RATE = FRAME_RATE.FRAME_RATE_FPS_15,
            minFrameRate: number = -1,
            bitrate: number = STANDARD_BITRATE,
            minBitrate: number = DEFAULT_MIN_BITRATE,
            orientationMode: ORIENTATION_MODE = ORIENTATION_MODE.ORIENTATION_MODE_ADAPTIVE,
            degradationPreference: DEGRADATION_PREFERENCE = DEGRADATION_PREFERENCE.MAINTAIN_QUALITY,
            mirrorMode: VIDEO_MIRROR_MODE_TYPE = VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_AUTO
        ) {
            this.dimensions = dimensions
            this.frameRate = frameRate
            this.minFrameRate = minFrameRate
            this.bitrate = bitrate
            this.minBitrate = minBitrate
            this.orientationMode = orientationMode
            this.degradationPreference = degradationPreference
            this.mirrorMode = mirrorMode
        }
    }

    /** The video and audio properties of the user displaying the video in the CDN live. Agora supports a maximum of 17 transcoding users in a CDN streaming channel.
     */
    export class TranscodingUser {
        /** User ID of the user displaying the video in the CDN live.
         */
        uid: number

        /** Horizontal position (pixel) of the video frame relative to the top left corner.
         */
        x: number
        /** Vertical position (pixel) of the video frame relative to the top left corner.
         */
        y: number
        /** Width (pixel) of the video frame. The default value is 360.
         */
        width: number
        /** Height (pixel) of the video frame. The default value is 640.
         */
        height: number

        /** The layer index of the video frame. An integer. The value range is [0, 100].

         - 0: (Default) Bottom layer.
         - 100: Top layer.

         @note
         - If zOrder is beyond this range, the SDK reports #ERR_INVALID_ARGUMENT.
         - As of v2.3, the SDK supports zOrder = 0.
         */
        zOrder: number
        /** The transparency level of the user's video. The value ranges between 0 and 1.0:

         - 0: Completely transparent
         - 1.0: (Default) Opaque
         */
        alpha: number
        /** The audio channel of the sound. The default value is 0:

         - 0: (Default) Supports dual channels at most, depending on the upstream of the host.
         - 1: The audio stream of the host uses the FL audio channel. If the upstream of the host uses multiple audio channels, these channels are mixed into mono first.
         - 2: The audio stream of the host uses the FC audio channel. If the upstream of the host uses multiple audio channels, these channels are mixed into mono first.
         - 3: The audio stream of the host uses the FR audio channel. If the upstream of the host uses multiple audio channels, these channels are mixed into mono first.
         - 4: The audio stream of the host uses the BL audio channel. If the upstream of the host uses multiple audio channels, these channels are mixed into mono first.
         - 5: The audio stream of the host uses the BR audio channel. If the upstream of the host uses multiple audio channels, these channels are mixed into mono first.

         @note If your setting is not 0, you may need a specialized player.
         */
        audioChannel: number

        constructor(uid: number, x: number, y: number, width: number, height: number, zOrder: number, alpha: number = 1.0, audioChannel: number) {
            this.uid = uid
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.zOrder = zOrder
            this.alpha = alpha
            this.audioChannel = audioChannel
        }
    }

    /** Image properties.

     The properties of the watermark and background images.
     */
    export class RtcImage {
        /** HTTP/HTTPS URL address of the image on the live video. The maximum length of this parameter is 1024 bytes. */
        url: string
        /** Horizontal position of the image from the upper left of the live video. */
        x: number
        /** Vertical position of the image from the upper left of the live video. */
        y: number
        /** Width of the image on the live video. */
        width: number
        /** Height of the image on the live video. */
        height: number

        constructor(url: string, x: number, y: number, width: number, height: number) {
            this.url = url
            this.x = x
            this.y = y
            this.width = width
            this.height = height
        }
    }

    /** The configuration for advanced features of the RTMP streaming with transcoding.
     */
    export class LiveStreamAdvancedFeature {
        /** The advanced feature for high-quality video with a lower bitrate. */
        static LBHQ = "lbhq"
        /** The advanced feature for the optimized video encoder. */
        static VEO = "veo"

        /** The name of the advanced feature. It contains LBHQ and VEO.
         */
        featureName: string

        /** Whether to enable the advanced feature:
         * - true: Enable the advanced feature.
         * - false: (Default) Disable the advanced feature.
         */
        opened: boolean

        constructor(featureName: string, opened: boolean) {
            this.featureName = featureName
            this.opened = opened
        }
    }

    /** A struct for managing CDN live audio/video transcoding settings.
     */
    export class LiveTranscoding {
        /** The width of the video in pixels. The default value is 360.
         * - When pushing video streams to the CDN, ensure that `width` is at least 64; otherwise, the Agora server adjusts the value to 64.
         * - When pushing audio streams to the CDN, set `width` and `height` as 0.
         */
        width: number
        /** The height of the video in pixels. The default value is 640.
         * - When pushing video streams to the CDN, ensure that `height` is at least 64; otherwise, the Agora server adjusts the value to 64.
         * - When pushing audio streams to the CDN, set `width` and `height` as 0.
         */
        height: number
        /** Bitrate of the CDN live output video stream. The default value is 400 Kbps.

         Set this parameter according to the Video Bitrate Table. If you set a bitrate beyond the proper range, the SDK automatically adapts it to a value within the range.
         */
        videoBitrate: number
        /** Frame rate of the output video stream set for the CDN live streaming. The default value is 15 fps, and the value range is (0,30].

         @note The Agora server adjusts any value over 30 to 30.
         */
        videoFramerate: number

        /** **DEPRECATED** Latency mode:

         - true: Low latency with unassured quality.
         - false: (Default) High latency with assured quality.
         */
        lowLatency: boolean

        /** Video GOP in frames. The default value is 30 fps.
         */
        videoGop: number
        /** Self-defined video codec profile: #VIDEO_CODEC_PROFILE_TYPE.

         @note If you set this parameter to other values, Agora adjusts it to the default value of 100.
         */
        videoCodecProfile: VIDEO_CODEC_PROFILE_TYPE
        /** The background color in RGB hex value. Value only. Do not include a preceeding #. For example, 0xFFB6C1 (light pink). The default value is 0x000000 (black).
         */
        backgroundColor: number
        /** The number of users in the live interactive streaming.
         */
        userCount: number
        /** TranscodingUser
         */
        transcodingUsers: TranscodingUser[]
        /** Reserved property. Extra user-defined information to send SEI for the H.264/H.265 video stream to the CDN live client. Maximum length: 4096 Bytes.

         For more information on SEI frame, see [SEI-related questions](https://docs.agora.io/en/faq/sei).
         */
        transcodingExtraInfo: string

        /** **DEPRECATED** The metadata sent to the CDN live client defined by the RTMP or HTTP-FLV metadata.
         */
        metadata: string
        /** The watermark image added to the CDN live publishing stream.

         Ensure that the format of the image is PNG. Once a watermark image is added, the audience of the CDN live publishing stream can see the watermark image. See RtcImage.
         */
        watermark: RtcImage
        /** The background image added to the CDN live publishing stream.

         Once a background image is added, the audience of the CDN live publishing stream can see the background image. See RtcImage.
         */
        backgroundImage: RtcImage
        /** Self-defined audio-sample rate: #AUDIO_SAMPLE_RATE_TYPE.
         */
        audioSampleRate: AUDIO_SAMPLE_RATE_TYPE
        /** Bitrate of the CDN live audio output stream. The default value is 48 Kbps, and the highest value is 128.
         */
        audioBitrate: number
        /** The numbder of audio channels for the CDN live stream. Agora recommends choosing 1 (mono), or 2 (stereo) audio channels. Special players are required if you choose option 3, 4, or 5:

         - 1: (Default) Mono.
         - 2: Stereo.
         - 3: Three audio channels.
         - 4: Four audio channels.
         - 5: Five audio channels.
         */
        audioChannels: 1 | 2 | 3 | 4 | 5
        /** Self-defined audio codec profile: #AUDIO_CODEC_PROFILE_TYPE.
         */
        audioCodecProfile: AUDIO_CODEC_PROFILE_TYPE

        /** Advanced features of the RTMP streaming with transcoding. See LiveStreamAdvancedFeature.
         *
         * @since v3.1.0
         */
        advancedFeatures: LiveStreamAdvancedFeature

        /** The number of enabled advanced features. The default value is 0. */
        advancedFeatureCount: number

        constructor(
            width: number = 360,
            height: number = 640,
            videoBitrate: number = 400,
            videoFramerate: number = 15,
            lowLatency: boolean = false,
            videoGop: number = 30,
            videoCodecProfile: VIDEO_CODEC_PROFILE_TYPE = VIDEO_CODEC_PROFILE_TYPE.VIDEO_CODEC_PROFILE_HIGH,
            backgroundColor: number = 0x000000,
            userCount: number = 0,
            transcodingUsers: TranscodingUser[],
            transcodingExtraInfo: string,
            metadata: string,
            watermark: RtcImage,
            backgroundImage: RtcImage,
            audioSampleRate: AUDIO_SAMPLE_RATE_TYPE = AUDIO_SAMPLE_RATE_TYPE.AUDIO_SAMPLE_RATE_48000,
            audioBitrate: number = 48,
            audioChannels: 1 | 2 | 3 | 4 | 5 = 1,
            audioCodecProfile: AUDIO_CODEC_PROFILE_TYPE = AUDIO_CODEC_PROFILE_TYPE.AUDIO_CODEC_PROFILE_LC_AAC,
            advancedFeatures: LiveStreamAdvancedFeature,
            advancedFeatureCount: number = 0
        ) {
            this.width = width
            this.height = height
            this.videoBitrate = videoBitrate
            this.videoFramerate = videoFramerate
            this.lowLatency = lowLatency
            this.videoGop = videoGop
            this.videoCodecProfile = videoCodecProfile
            this.backgroundColor = backgroundColor
            this.userCount = userCount
            this.transcodingUsers = transcodingUsers
            this.transcodingExtraInfo = transcodingExtraInfo
            this.metadata = metadata
            this.watermark = watermark
            this.backgroundImage = backgroundImage
            this.audioSampleRate = audioSampleRate
            this.audioBitrate = audioBitrate
            this.audioChannels = audioChannels
            this.audioCodecProfile = audioCodecProfile
            this.advancedFeatures = advancedFeatures
            this.advancedFeatureCount = advancedFeatureCount
        }
    }

    /** Camera capturer configuration.
     */
    export class CameraCapturerConfiguration {
        /** Camera capturer preference settings. See: #CAPTURER_OUTPUT_PREFERENCE. */
        preference: CAPTURER_OUTPUT_PREFERENCE
        /** Camera direction settings (for Android/iOS only). See: #CAMERA_DIRECTION. */
        cameraDirection: CAMERA_DIRECTION

        constructor(preference: CAPTURER_OUTPUT_PREFERENCE, cameraDirection: CAMERA_DIRECTION) {
            this.preference = preference
            this.cameraDirection = cameraDirection
        }
    }

    /** Configuration of the injected media stream.
     */
    export class InjectStreamConfig {
        /** Width of the injected stream in the live interactive streaming. The default value is 0 (same width as the original stream).
         */
        width: number
        /** Height of the injected stream in the live interactive streaming. The default value is 0 (same height as the original stream).
         */
        height: number
        /** Video GOP (in frames) of the injected stream in the live interactive streaming. The default value is 30 fps.
         */
        videoGop: number
        /** Video frame rate of the injected stream in the live interactive streaming. The default value is 15 fps.
         */
        videoFramerate: number
        /** Video bitrate of the injected stream in the live interactive streaming. The default value is 400 Kbps.

         @note The setting of the video bitrate is closely linked to the resolution. If the video bitrate you set is beyond a reasonable range, the SDK sets it within a reasonable range.
         */
        videoBitrate: number
        /** Audio-sample rate of the injected stream in the live interactive streaming: #AUDIO_SAMPLE_RATE_TYPE. The default value is 48000 Hz.

         @note We recommend setting the default value.
         */
        audioSampleRate: AUDIO_SAMPLE_RATE_TYPE
        /** Audio bitrate of the injected stream in the live interactive streaming. The default value is 48.

         @note We recommend setting the default value.
         */
        audioBitrate: number
        /** Audio channels in the live interactive streaming.

         - 1: (Default) Mono
         - 2: Two-channel stereo

         @note We recommend setting the default value.
         */
        audioChannels: number

        constructor(
            width: number = 0,
            height: number = 0,
            videoGop: number = 30,
            videoFramerate: number = 15,
            videoBitrate: number = 400,
            audioSampleRate: AUDIO_SAMPLE_RATE_TYPE = AUDIO_SAMPLE_RATE_TYPE.AUDIO_SAMPLE_RATE_48000,
            audioBitrate: number = 48,
            audioChannels: number = 1) {
            this.width = width
            this.height = height
            this.videoGop = videoGop
            this.videoFramerate = videoFramerate
            this.videoBitrate = videoBitrate
            this.audioSampleRate = audioSampleRate
            this.audioBitrate = audioBitrate
            this.audioChannels = audioChannels
        }
    }

    /** The definition of ChannelMediaInfo.
     */
    export class ChannelMediaInfo {
        /** The channel name.
         */
        channelName: string
        /** The token that enables the user to join the channel.
         */
        token: string
        /** The user ID.
         */
        uid: number

        constructor(channelName: string, token: string, uid: number) {
            this.channelName = channelName
            this.token = token
            this.uid = uid
        }
    }

    /** The definition of ChannelMediaRelayConfiguration.
     */
    export class ChannelMediaRelayConfiguration {
        /** Pointer to the information of the source channel: ChannelMediaInfo. It contains the following members:
         * - `channelName`: The name of the source channel. The default value is `NULL`, which means the SDK applies the name of the current channel.
         * - `uid`: ID of the host whose media stream you want to relay. The default value is 0, which means the SDK generates a random UID. You must set it as 0.
         * - `token`: The token for joining the source channel. It is generated with the `channelName` and `uid` you set in `srcInfo`.
         *   - If you have not enabled the App Certificate, set this parameter as the default value `NULL`, which means the SDK applies the App ID.
         *   - If you have enabled the App Certificate, you must use the `token` generated with the `channelName` and `uid`, and the `uid` must be set as 0.
         */
        srcInfo: ChannelMediaInfo
        /** Pointer to the information of the destination channel: ChannelMediaInfo. It contains the following members:
         * - `channelName`: The name of the destination channel.
         * - `uid`: ID of the host in the destination channel. The value ranges from 0 to (2<sup>32</sup>-1). To avoid UID conflicts, this `uid` must be different from any other UIDs in the destination channel. The default value is 0, which means the SDK generates a random UID.
         * - `token`: The token for joining the destination channel. It is generated with the `channelName` and `uid` you set in `destInfos`.
         *   - If you have not enabled the App Certificate, set this parameter as the default value `NULL`, which means the SDK applies the App ID.
         *   - If you have enabled the App Certificate, you must use the `token` generated with the `channelName` and `uid`.
         */
        destInfos: ChannelMediaInfo[]
        /** The number of destination channels. The default value is 0, and the
         * value range is [0,4). Ensure that the value of this parameter
         * corresponds to the number of ChannelMediaInfo structs you define in
         * `destInfos`.
         */
        destCount: number

        constructor(srcInfo: ChannelMediaInfo, destInfos: ChannelMediaInfo[], destCount: number) {
            this.srcInfo = srcInfo
            this.destInfos = destInfos
            this.destCount = destCount
        }
    }

    /** The relative location of the region to the screen or window.
     */
    export class Rectangle {
        /** The horizontal offset from the top-left corner.
         */
        x: number
        /** The vertical offset from the top-left corner.
         */
        y: number
        /** The width of the region.
         */
        width: number
        /** The height of the region.
         */
        height: number

        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.x = x
            this.y = y
            this.width = width
            this.height = height
        }
    }

    /**  **DEPRECATED** Definition of the rectangular region. */
    export class Rect {
        /** Y-axis of the top line.
         */
        top: number
        /** X-axis of the left line.
         */
        left: number
        /** Y-axis of the bottom line.
         */
        bottom: number
        /** X-axis of the right line.
         */
        right: number

        constructor(top: number = 0, left: number = 0, bottom: number = 0, right: number = 0) {
            this.top = top
            this.left = left
            this.bottom = bottom
            this.right = right
        }
    }

    /** The options of the watermark image to be added. */
    export class WatermarkOptions {
        /** Sets whether or not the watermark image is visible in the local video preview:
         * - true: (Default) The watermark image is visible in preview.
         * - false: The watermark image is not visible in preview.
         */
        visibleInPreview: boolean
        /**
         * The watermark position in the landscape mode. See Rectangle.
         * For detailed information on the landscape mode, see the advanced guide *Video Rotation*.
         */
        positionInLandscapeMode: Rectangle
        /**
         * The watermark position in the portrait mode. See Rectangle.
         * For detailed information on the portrait mode, see the advanced guide *Video Rotation*.
         */
        positionInPortraitMode: Rectangle

        constructor(
            visibleInPreview: boolean = true,
            positionInLandscapeMode: Rectangle = new Rectangle(),
            positionInPortraitMode: Rectangle = new Rectangle()
        ) {
            this.visibleInPreview = visibleInPreview
            this.positionInLandscapeMode = positionInLandscapeMode
            this.positionInPortraitMode = positionInPortraitMode
        }
    }

    /** Screen sharing encoding parameters.
     */
    export class ScreenCaptureParameters {
        /** The maximum encoding dimensions of the shared region in terms of width * height.

         The default value is 1920 * 1080 pixels, that is, 2073600 pixels. Agora uses the value of this parameter to calculate the charges.

         If the aspect ratio is different between the encoding dimensions and screen dimensions, Agora applies the following algorithms for encoding. Suppose the encoding dimensions are 1920 x 1080:

         - If the value of the screen dimensions is lower than that of the encoding dimensions, for example, 1000 * 1000, the SDK uses 1000 * 1000 for encoding.
         - If the value of the screen dimensions is higher than that of the encoding dimensions, for example, 2000 * 1500, the SDK uses the maximum value under 1920 * 1080 with the aspect ratio of the screen dimension (4:3) for encoding, that is, 1440 * 1080.
         */
        dimensions: VideoDimensions
        /** The frame rate (fps) of the shared region.

         The default value is 5. We do not recommend setting this to a value greater than 15.
         */
        frameRate: number
        /** The bitrate (Kbps) of the shared region.

         The default value is 0 (the SDK works out a bitrate according to the dimensions of the current screen).
         */
        bitrate: number
        /** Sets whether or not to capture the mouse for screen sharing:

         - true: (Default) Capture the mouse.
         - false: Do not capture the mouse.
         */
        captureMouseCursor: boolean
        /** Whether to bring the window to the front when calling \ref IRtcEngine::startScreenCaptureByWindowId "startScreenCaptureByWindowId" to share the window:
         * - true: Bring the window to the front.
         * - false: (Default) Do not bring the window to the front.
         */
        windowFocus: boolean
        /** A list of IDs of windows to be blocked.
         *
         * When calling \ref IRtcEngine::startScreenCaptureByScreenRect "startScreenCaptureByScreenRect" to start screen sharing, you can use this parameter to block the specified windows.
         * When calling \ref IRtcEngine::updateScreenCaptureParameters "updateScreenCaptureParameters" to update the configuration for screen sharing, you can use this parameter to dynamically block the specified windows during screen sharing.
         */
        excludeWindowList: any[]
        /** The number of windows to be blocked.
         */
        excludeWindowCount: number

        constructor(
            dimensions: VideoDimensions = new VideoDimensions(1920, 1080),
            frameRate: number = 5,
            bitrate: number = STANDARD_BITRATE,
            captureMouseCursor: boolean = true,
            windowFocus: boolean = false,
            excludeWindowList: any[],
            excludeWindowCount: number = 0
        ) {
            this.dimensions = dimensions
            this.frameRate = frameRate
            this.bitrate = bitrate
            this.captureMouseCursor = captureMouseCursor
            this.windowFocus = windowFocus
            this.excludeWindowList = excludeWindowList
            this.excludeWindowCount = excludeWindowCount
        }
    }

    /** Video display settings of the VideoCanvas class.
     */
    export class VideoCanvas {
        /** Video display window (view).
         */
        view: any
        /** The rendering mode of the video view. See RENDER_MODE_TYPE
         */
        renderMode: number
        /** The unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:
         - All lowercase English letters: a to z.
         - All uppercase English letters: A to Z.
         - All numeric characters: 0 to 9.
         - The space character.
         - Punctuation characters and other symbols, including: "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".

         @note
         - The default value is the empty string "". Use the default value if the user joins the channel using the \ref IRtcEngine::joinChannel "joinChannel" method in the IRtcEngine class. The `VideoCanvas` struct defines the video canvas of the user in the channel.
         - If the user joins the channel using the \ref IRtcEngine::joinChannel "joinChannel" method in the IChannel class, set this parameter as the `channelId` of the `IChannel` object. The `VideoCanvas` struct defines the video canvas of the user in the channel with the specified channel ID.
         */
        channelId: string
        /** The user ID. */
        uid: number
        priv: any // private data (underlying video engine denotes it)
        /** The mirror mode of the video view. See VIDEO_MIRROR_MODE_TYPE
         @note
         - For the mirror mode of the local video view: If you use a front camera, the SDK enables the mirror mode by default; if you use a rear camera, the SDK disables the mirror mode by default.
         - For the mirror mode of the remote video view: The SDK disables the mirror mode by default.
         */
        mirrorMode: VIDEO_MIRROR_MODE_TYPE

        constructor(
            view: any,
            renderMode: number = RENDER_MODE_TYPE.RENDER_MODE_HIDDEN,
            channelId: string,
            uid: number = 0,
            priv: any,
            mirrorMode: VIDEO_MIRROR_MODE_TYPE = VIDEO_MIRROR_MODE_TYPE.VIDEO_MIRROR_MODE_AUTO
        ) {
            this.view = view
            this.renderMode = renderMode
            this.channelId = channelId
            this.uid = uid
            this.priv = priv
            this.mirrorMode = mirrorMode
        }
    }

    /** Image enhancement options.
     */
    export class BeautyOptions {
        /** The contrast level, used with the @p lightening parameter.
         */
        lighteningContrastLevel: LIGHTENING_CONTRAST_LEVEL

        /** The brightness level. The value ranges from 0.0 (original) to 1.0. */
        lighteningLevel: number

        /** The sharpness level. The value ranges between 0 (original) and 1. This parameter is usually used to remove blemishes.
         */
        smoothnessLevel: number

        /** The redness level. The value ranges between 0 (original) and 1. This parameter adjusts the red saturation level.
         */
        rednessLevel: number

        constructor(
            lighteningContrastLevel: LIGHTENING_CONTRAST_LEVEL = LIGHTENING_CONTRAST_LEVEL.LIGHTENING_CONTRAST_NORMAL,
            lighteningLevel: number = 0,
            smoothnessLevel: number = 0,
            rednessLevel: number = 0
        ) {
            this.lighteningContrastLevel = lighteningContrastLevel
            this.lighteningLevel = lighteningLevel
            this.smoothnessLevel = smoothnessLevel
            this.rednessLevel = rednessLevel
        }
    }

    /**
     * The UserInfo struct.
     */
    export interface UserInfo {
        /**
         * The user ID.
         */
        uid: number
        /**
         * The user account.
         */
        userAccount: string
    }

    /** Configurations of built-in encryption schemas. */
    export class EncryptionConfig {
        /**
         * Encryption mode. The default encryption mode is `AES_128_XTS`. See #ENCRYPTION_MODE.
         */
        encryptionMode: ENCRYPTION_MODE
        /**
         * Encryption key in string type.
         *
         * @note If you do not set an encryption key or set it as NULL, you cannot use the built-in encryption, and the SDK returns #ERR_INVALID_ARGUMENT (-2).
         */
        encryptionKey: string

        constructor(encryptionMode: ENCRYPTION_MODE = ENCRYPTION_MODE.AES_128_XTS, encryptionKey: string) {
            this.encryptionMode = encryptionMode
            this.encryptionKey = encryptionKey
        }
    }

    /** The channel media options. */
    export class ChannelMediaOptions {
        /** Determines whether to subscribe to audio streams when the user joins the channel:
         - true: (Default) Subscribe.
         - false: Do not subscribe.

         This member serves a similar function to the \ref agora::rtc::IChannel::muteAllRemoteAudioStreams "muteAllRemoteAudioStreams" method. After joining the channel,
         you can call the `muteAllRemoteAudioStreams` method to set whether to subscribe to audio streams in the channel.
         */
        autoSubscribeAudio: boolean
        /** Determines whether to subscribe to video streams when the user joins the channel:
         - true: (Default) Subscribe.
         - false: Do not subscribe.

         This member serves a similar function to the \ref agora::rtc::IChannel::muteAllRemoteVideoStreams "muteAllRemoteVideoStreams" method. After joining the channel,
         you can call the `muteAllRemoteVideoStreams` method to set whether to subscribe to video streams in the channel.
         */
        autoSubscribeVideo: boolean

        constructor(autoSubscribeAudio: boolean = true, autoSubscribeVideo: boolean = true) {
            this.autoSubscribeAudio = autoSubscribeAudio
            this.autoSubscribeVideo = autoSubscribeVideo
        }
    }

    export class Metadata {
        /** The User ID.

         - For the receiver: the ID of the user who sent the metadata.
         - For the sender: ignore it.
         */
        uid: number
        /** Buffer size of the sent or received Metadata.
         */
        size: number
        /** Buffer address of the sent or received Metadata.
         */
        buffer: Uint8Array
        /** Time statmp of the frame following the metadata.
         */
        timeStampMs: number

        constructor(uid: number, size: number, buffer: Uint8Array, timeStampMs: number) {
            this.uid = uid;
            this.size = size;
            this.buffer = buffer;
            this.timeStampMs = timeStampMs;
        }
    }
}

(window as any).agora = agora
