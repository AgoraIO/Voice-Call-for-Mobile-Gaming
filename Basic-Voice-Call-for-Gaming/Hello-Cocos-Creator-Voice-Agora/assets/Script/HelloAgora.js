require("js-agora");
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

       label2: {
            default: null,
            type: cc.Label
        },

        btnDestory: {
            default: null,
            type: cc.Button
        },

        btnLeave: {
            default: null,
            type: cc.Button
        },
        
        btnMuteLocal: {
            default: null,
            type: cc.Button
        },

        btnMuteRemote: {
            default: null,
            type: cc.Button
        },

        btnEnableAudio: {
            default: null,
            type: cc.Button
        },

        btnDisableAudio: {
            default: null,
            type: cc.Button
        },

        recordSlider:{
            default: null,
            type: cc.Slider 
        },

        playbackSlider:{
            default: null,
            type: cc.Slider
        },

        //defaults, set visually when attaching this script to the Canvas
        text: 'Hello Agora Audio !',

        bMuteLocal:false,
        bMuteRemote:false,
        bLocalAudio:true,
        bSpeakerPhone:false,
    },

    // use this for initialization
    onLoad: function () {        
        this.initEvent();
        this.label.string = this.text;
        this.label2.string = "Callback tips ";
        console.log("Page loaded ");
    },
    onDestroy () {
        this.removeEvent();
        console.log("Page Destory");
    },

    updateUI: function(bInited){
        this.btnJoin.interactable = !bInited;
        this.btnLeave.interactable = bInited;
        this.btnMuteLocal.interactable = bInited;
        this.btnMuteRemote.interactable = bInited;
        this.btnEnableAudio.interactable = bInited;
        this.btnDisableAudio.interactable = bInited;
    },

    // called every frame
    update: function (dt) {

    },

    addTips:function(args){
         this.label.string  = args;
    },

    callBackTips:function(args){
         this.label2.string  = args;
    },

    onWarning:function(warn, msg){
        this.label.string  = "warn:" + warn + "msg:" + msg;
    },

    initEvent:function(){              
        agora.on('rejoin-channel-success',this.onRejoinChannelSuccess,this);
        agora.on('warning',this.onWarning,this);
        agora.on('error',this.onError,this);
        agora.on('audio-quality',this.onAudioQuality,this);
        agora.on('audio-volume-indication',this.onAudioVolumeIndication,this);
        agora.on('leave-channel',this.onLeaveChannel,this);
        agora.on('network-quality',this.onNetworkQuality,this);

        agora.on('user-joined',this.onUserJoined,this);
        agora.on('user-offline',this.onUserOffline,this);
        agora.on('user-mute-audio',this.onUserMuteAudio,this);
        agora.on('audio-routing-changed',this.onAudioRoutingChanged,this);
        agora.on('connection-lost',this.onConnectionLost,this);
        agora.on('connection-interrupted',this.onConnectionInterrupted,this);
        agora.on('request-token',this.onRequestToken,this);

        agora.on('connection-banned',this.onConnectionBanned,this);
        agora.on('client-role-changed',this.onClientRoleChanged,this);
    },

    removeEvent:function(){    
        agora.off('rejoin-channel-success',this.onRejoinChannelSuccess);
        agora.off('warning',this.onWarning);
        agora.off('error',this.onError);
        agora.off('audio-quality',this.onAudioQuality);
        agora.off('audio-volume-indication',this.onAudioVolumeIndication);
        agora.off('leave-channel',this.onLeaveChannel);
        agora.off('network-quality',this.onNetworkQuality);

        agora.off('user-joined',this.onUserJoined);
        agora.off('user-offline',this.onUserOffline);
        agora.off('user-mute-audio',this.onUserMuteAudio);
        agora.off('audio-routing-changed',this.onAudioRoutingChanged);
        agora.off('connection-lost',this.onConnectionLost);
        agora.off('connection-interrupted',this.onConnectionInterrupted);
        agora.off('request-token',this.onRequestToken);

        agora.off('connection-banned',this.onConnectionBanned);
        agora.off('client-role-changed',this.onClientRoleChanged);
    },

    onRejoinChannelSuccess:function (channel, uid, elapsed) {
        this.label2.string = "onRejoinChannelSuccess, channel:" + channel + " uid:" + uid + " elapsed:" + elapsed;
    },

    onWarning:function (warn, msg) {
        this.label2.string ="onWarning, warn:" + warn + " msg:" + msg;
    },

    onError:function (warn, msg) {
       this.label2.string ="onError, warn:" + warn + " msg:" + msg;
    },

    onAudioQuality:function (uid, quality, delay, lost) {
        this.label2.string ="onAudioQuality, uid:" + uid + " quality:" + quality + " delay:" + delay + " lost:" + lost ;
    },

    onAudioVolumeIndication:function (speakers, speakerNumber, totalVolume) {
        cc.log("[js]onAudioVolumeIndication, speakerNumber:%d, totalVolume :%d !", speakerNumber, totalVolume);
        if (speakerNumber == 0) {
            cc.log("[js] callback of Remote Speakers, and without a word !"); 
        }
 
        for (var i = 0;i <speakerNumber; i++) {
            if (speakers[i].uid == 0 && speakerNumber == 1) {
                cc.log("[js] Local Speaker[%d], uid:%d, volume : %d", i, speakers[i].uid, speakers[i].volume);
                return;
            }else{
                cc.log("[js] Remote Speaker[%d], uid:%d, volume : %d", i, speakers[i].uid, speakers[i].volume);
            }
        }
    },

    onLeaveChannel:function (stat) {
        // this.label2.string = "onLeaveChannel ";
        this.callBackTips("onLeaveChannel ");
        cc.director.loadScene("scene1");
    },

    onNetworkQuality:function (uid, txQuality, rxQuality) {
        cc.log("onAudioQuality, uid:" + uid + " txQuality:" + txQuality + " rxQuality:" + rxQuality);
    },

    onUserJoined:function (uid, elapsed) {
        this.label2.string = "onUserJoined, uid :" + uid + " elapsed:" + elapsed;
    },

    onUserOffline:function (uid, reason) {
        this.label2.string = "onUserOffline, uid :" + uid + " reason:" + reason;
    },

    onUserMuteAudio:function (uid, muted) {
        this.label2.string = "onUserMuteAudio, uid :" + uid + " muted:" + muted;
    },

    onAudioRoutingChanged:function (routing) {
        this.label2.string = "onAudioRoutingChanged, routing :" + routing;
    },

    onConnectionLost:function () {
        this.label2.string = "onAudioRoutingChanged, routing :" + routing;
    },

    onConnectionInterrupted:function () {
        this.label2.string = "onConnectionInterrupted";
    },

   onRequestToken:function () {
        this.label2.string = "onRequestToken";
    },

    onConnectionBanned:function () {
        this.label2.string = "onConnectionBanned";
    },

    onClientRoleChanged:function (oldRole, newRole) {
        this.label2.string = "onClientRoleChanged";
    },

    adjustPlaybackSignalVolume:function (event, customEventData) {
        agora.adjustPlaybackSignalVolume(this.intRound(this.playbackSlider.progress));
        this.addTips("adjustPlaybackSignalVolume: " + this.intRound(this.playbackSlider.progress));
    },

    adjustRecordingSignalVolume:function (event, customEventData) {
        agora.adjustRecordingSignalVolume(this.intRound(this.recordSlider.progress));
        this.addTips("adjustRecordingSignalVolume: " + this.intRound(this.recordSlider.progress));
    },

    intRound:function(val){
        var val1 = Math.round(val*100)*4;  
        return val1;
    },

    enableLocalAudio:function (event, customEventData) {
        if(!this.bLocalAudio){
            this.bLocalAudio = !this.bLocalAudio;
            this.addTips("enableLocalAudio: " + this.bLocalAudio);                
        } else {
            this.bLocalAudio = !this.bLocalAudio; 
            this.addTips("enableLocalAudio: " + this.bLocalAudio);            
        }
        agora.enableLocalAudio(this.bLocalAudio);
        this.addTips("enableLocalAudio: " + this.bLocalAudio);
    },

    btnDestoryClick: function (event, customEventData) {
         agora.leaveChannel();
         this.label.string = "destoryEngine called ...";
         cc.director.loadScene("scene1");
    },

    setEnableSpeakerphone: function (event, customEventData) {
        if(!this.bSpeakerPhone){
            this.bSpeakerPhone = !this.bSpeakerPhone;
            this.addTips("enableLocalAudio: " + this.bSpeakerPhone);                
        } else {
            this.bSpeakerPhone = !this.bSpeakerPhone; 
            this.addTips("enableLocalAudio: " + this.bSpeakerPhone);            
        }
        agora.setEnableSpeakerphone(this.bSpeakerPhone);
    },

    setEnableSpeakerphone: function (event, customEventData) {
        if(!this.bSpeakerPhone){
            this.bSpeakerPhone = !this.bSpeakerPhone;
            this.addTips("enableLocalAudio: " + this.bSpeakerPhone);                
        } else {
            this.bSpeakerPhone = !this.bSpeakerPhone; 
            this.addTips("enableLocalAudio: " + this.bSpeakerPhone);            
        }
        agora.setEnableSpeakerphone(this.bSpeakerPhone);
    },

    btnLeaveRoomClick: function (event, customEventData) {
        this.label.string ="leaveChannel ...";
        agora.leaveChannel();
    },  

    btnMuteLocalClick: function (event, customEventData) {        
        if(!this.bMuteLocal){
            this.bMuteLocal = !this.bMuteLocal;
            this.addTips("muteLocalAudioStream: " + this.bMuteLocal);                
        } else {
            this.bMuteLocal = !this.bMuteLocal; 
            this.addTips("muteLocalAudioStream: " + this.bMuteLocal);            
        }
        agora.muteLocalAudioStream(this.bMuteLocal);
    },

    btnMuteRemoteClick: function (event, customEventData) {        
        if(!this.bMuteRemote){
            this.bMuteRemote = !this.bMuteRemote;
            this.addTips("muteAllRemoteAudioStreams: " + this.bMuteRemote);                
        } else {
            this.bMuteRemote = !this.bMuteRemote; 
            this.addTips("muteAllRemoteAudioStreams: " + this.bMuteRemote);            
        }
        agora.muteAllRemoteAudioStreams(this.bMuteRemote);
    },

    btnEnableAudioClick: function (event, customEventData) {
        agora.enableAudio();
        this.addTips("enable Audio "); 
    },

    btnDisableAudioClick: function (event, customEventData) {
        agora.disableAudio();
        this.addTips("disable Audio "); 
    },

    btnStartAudioMixClick: function (event, customEventData) {
        agora.startAudioMixing("https://mms.msstatic.com/music/PczYBajT2B.mp3", false,false, 1);
    },

    btnStopAudioMixClick: function (event, customEventData) {
        agora.stopAudioMixing();
    },
});
