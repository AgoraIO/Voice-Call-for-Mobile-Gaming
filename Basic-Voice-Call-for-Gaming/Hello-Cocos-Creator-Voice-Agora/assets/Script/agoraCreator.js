
var agoraCreator_module = {
    AGORAEVT: {
        evt_tips: "msgTips", //< Tips message > 
        evt_created: "msgCreated",
        evt_jSuccess:"joinSuccess",       
        evt_lSuccess:"leaveSuccess",     
 
        evt_rejSuccess:"reJoinSuccess",
        evt_Warning:"onWarning",
        evt_Error:"onError",
        evt_AudioQuality:"onAudioQuality",
        evt_AudioVolumeIndication:"onAudioVolumeIndication",
        evt_LeaveChannel:"onLeaveChannel",

        evt_RtcStats:"onRtcStats",
        evt_AudioDeviceStateChanged:"onAudioDeviceStateChanged",
        evt_AudioMixingFinished:"onAudioMixingFinished",
        evt_RemoteAudioMixingBegin:"onRemoteAudioMixingBegin",
        evt_RemoteAudioMixingEnd:"onRemoteAudioMixingEnd",
        evt_AudioEffectFinished:"onAudioEffectFinished",
        evt_NetworkQuality:"onNetworkQuality",
        evt_LastmileQuality:"onLastmileQuality",

        evt_UserJoined:"onUserJoined",
        evt_UserOffline:"onUserOffline",
        evt_UserMuteAudio:"onUserMuteAudio",
        evt_ApiCallExecuted:"onApiCallExecuted",
        evt_ConnectionLost:"onConnectionLost",
        evt_ConnectionInterrupted:"onConnectionInterrupted",
        evt_ConnectionBanned:"onConnectionBanned",
        evt_RequestToken:"onRequestToken",
        evt_FirstLocalAudioFrame:"onFirstLocalAudioFrame",
        evt_FirstRemoteAudioFrame:"onFirstRemoteAudioFrame",
        evt_ActiveSpeaker:"onActiveSpeaker",

        evt_ClientRoleChanged:"onClientRoleChanged",
        evt_AudioDeviceVolumeChanged:"onAudioDeviceVolumeChanged",
        evt_AudioRoutingChanged:"onAudioRoutingChanged",
        evt_MicrophoneEnabled:"onMicrophoneEnabled",

    },

    roomInput: null,
                          
    agoraCreatorInst: null,
        
    addTips:function(strTips, errcode)
    {
        var err = errcode != undefined? errcode: 0;
        let event = new cc.Event(this.AGORAEVT.evt_tips, true);
        var p = {
            msg: strTips,
            error: err,
        };
        event["data"] = p;
        cc.systemEvent.dispatchEvent(event);
    },

    createdNotify:function(errcode){
        var err = errcode != undefined? errcode: 0;
        let event = new cc.Event(this.AGORAEVT.evt_created, true);
        var p = {
            error: err,
        };
        event["data"] = p;
        cc.systemEvent.dispatchEvent(event);
    },

    jSuccessNotify:function(channel, uid, elapsed)
    {
        var event = new cc.Event(this.AGORAEVT.evt_jSuccess, true);
        var msg =  {
            channel: channel,
            uid : uid,
            elapsed : elapsed,
        };
        event["data"] = msg;
        cc.systemEvent.dispatchEvent(event);
    },

    lSuccessNotify:function(stats)
    {
        var event = new cc.Event(this.AGORAEVT.evt_lSuccess, true);
        var msg =  stats
        event["data"] = msg;
        cc.systemEvent.dispatchEvent(event);
    },
    
    createEngine:function(appid){

        if(this.agoraCreatorInst == null)
        {
            cc.log("[js] new agoraCreator()" )
            this.agoraCreatorInst = new agoraCreator();
        }
        var self = this;
        if(this.agoraCreatorInst != null)
        {
            
            var err = this.agoraCreatorInst.initialize(appid) 
            if(err){
                cc.log("[js] agoraCreatorInst.initialize() fail " )
                return;
            }
            self.createdNotify(err);

            this.agoraCreatorInst.onJoinChannelSuccess = function(channel,  uid, elapsed){
                cc.log("[js] onJoinChannelSuccess, channel:%s,uid :%d, elapsed : %d !", channel, uid, elapsed);    
              
                self.addTips(" Join Channel Successfully !");
                self.jSuccessNotify(channel,  uid, elapsed);
            };

            this.agoraCreatorInst.onLeaveChannel = function (stats){
                cc.log("[js]onLeaveChannel, stats.duration:%d,stats.txBytes :%d, stats.rxBytes : %d !", stats.duration, stats.txBytes, stats.rxBytes);
                self.addTips(" Leave Channel Successfully !");
                self.lSuccessNotify(stats);
            };

            this.agoraCreatorInst.onUserMuteAudio = function (userId,  muted){
                cc.log("[js]onUserMuteAudio, userId:%d, muted :%d !", userId, muted);
            };

            this.agoraCreatorInst.onAudioMixingFinished = function (){
                cc.log("[js]onAudioMixingFinished !");
            };

            this.agoraCreatorInst.onAudioVolumeIndication = function (speakers,  speakerNumber, totalVolume){
                cc.log("[js]onAudioVolumeIndication, speakerNumber:%d, totalVolume :%d !", speakerNumber, totalVolume);
                if (speakerNumber == 0) {
                    cc.log("[js] callback of Remote Speakers"); 
                }

                for (var i = 0;i <speakerNumber; i++) {
                    if (speakers[i].uid == 0 && speakerNumber == 1) {
                        cc.log("[js] Local Speaker[%d], uid:%d, volume : %d", i, speakers[i].uid, speakers[i].volume);
                        return;
                    }else{
                        cc.log("[js] Remote Speaker[%d], uid:%d, volume : %d", i, speakers[i].uid, speakers[i].volume);
                    }
                }
            };
        }
    },

    // destoryEngine:function(){
    //     if(this.agoraCreatorInst != null)
    //     {
    //         this.agoraCreatorInst.destoryEngine(); 
    //     }
    // },

}; 

module.exports = agoraCreator_module;
