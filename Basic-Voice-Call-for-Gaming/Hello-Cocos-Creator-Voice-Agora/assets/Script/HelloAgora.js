var agoraCreator = require("agoraCreator");

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        lblroom: {
            default: null,
            type: cc.Label
        },

        channelName: {
            default: null,
            type: cc.EditBox
        },

        btnCreate: {
            default: null,
            type: cc.Button
        },

        btnDestory: {
            default: null,
            type: cc.Button
        },

        btnJoin: {
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

        // this.updateUI(false);
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

    initEvent:function(){              
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_tips,this.onEvent,this);
        // cc.systemEvent.on(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent,this);
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_lSuccess,this.onEvent,this);

    },

    removeEvent:function(){    
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_tips,this.onEvent);
        // cc.systemEvent.off(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent);
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_lSuccess,this.onEvent);
    },

    onEvent: function(event){
        let eventData = event.data;
        switch (event.type){
            case agoraCreator.AGORAEVT.evt_tips:
                cc.log("Debug: " +  event.data.msg);
                var s = event.data.msg
                if(event.data.error != 0){
                    s += "[errorcode]" + obj.error;
                }
                this.label.string  = s;
                break;

            case agoraCreator.AGORAEVT.evt_jSuccess:
                cc.log("Debug: " + agoraCreator.AGORAEVT.evt_jSuccess);
                // this.label.string  = s;
                // this.updateUI(true)
                break;

            case agoraCreator.AGORAEVT.evt_lSuccess:
                cc.log("Debug: " + agoraCreator.AGORAEVT.evt_lSuccess);
                // this.label.string  = s;     
                // this.updateUI(false)          
                cc.director.loadScene("scene1");
                break;
        }
    },

    adjustPlaybackSignalVolume:function (event, customEventData) {
        agoraCreator.agoraCreatorInst.adjustPlaybackSignalVolume(this.intRound(this.playbackSlider.progress));
        agoraCreator.addTips("adjustPlaybackSignalVolume: " + this.intRound(this.playbackSlider.progress));
    },

    adjustRecordingSignalVolume:function (event, customEventData) {
        agoraCreator.agoraCreatorInst.adjustRecordingSignalVolume(this.intRound(this.recordSlider.progress));
        agoraCreator.addTips("adjustRecordingSignalVolume: " + this.intRound(this.recordSlider.progress));
    },

    intRound:function(val){
        var val1 = Math.round(val*100)*4;  
        return val1;
    },

    enableLocalAudio:function (event, customEventData) {
        if(!this.bLocalAudio){
            this.bLocalAudio = !this.bLocalAudio;
            agoraCreator.addTips("enableLocalAudio: " + this.bLocalAudio);                
        } else {
            this.bLocalAudio = !this.bLocalAudio; 
            agoraCreator.addTips("enableLocalAudio: " + this.bLocalAudio);            
        }
        agoraCreator.agoraCreatorInst.enableLocalAudio(this.bLocalAudio);
        agoraCreator.addTips("enableLocalAudio: " + this.bLocalAudio);
    },

    btnDestoryClick: function (event, customEventData) {
         agoraCreator.agoraCreatorInst.leaveChannel();
         this.label.string = "destoryEngine called ...";
         cc.director.loadScene("scene1");
    },

    setEnableSpeakerphone: function (event, customEventData) {
        if(!this.bSpeakerPhone){
            this.bSpeakerPhone = !this.bSpeakerPhone;
            agoraCreator.addTips("enableLocalAudio: " + this.bSpeakerPhone);                
        } else {
            this.bSpeakerPhone = !this.bSpeakerPhone; 
            agoraCreator.addTips("enableLocalAudio: " + this.bSpeakerPhone);            
        }
        agoraCreator.agoraCreatorInst.setEnableSpeakerphone(this.bSpeakerPhone);
    },

    setEnableSpeakerphone: function (event, customEventData) {
        if(!this.bSpeakerPhone){
            this.bSpeakerPhone = !this.bSpeakerPhone;
            agoraCreator.addTips("enableLocalAudio: " + this.bSpeakerPhone);                
        } else {
            this.bSpeakerPhone = !this.bSpeakerPhone; 
            agoraCreator.addTips("enableLocalAudio: " + this.bSpeakerPhone);            
        }
        agoraCreator.agoraCreatorInst.setEnableSpeakerphone(this.bSpeakerPhone);
    },

    btnLeaveRoomClick: function (event, customEventData) {
        this.label.string ="LeaveChannel ...";
        agoraCreator.agoraCreatorInst.leaveChannel();
    },  

    btnMuteLocalClick: function (event, customEventData) {        
        if(!this.bMuteLocal){
            this.bMuteLocal = !this.bMuteLocal;
            agoraCreator.addTips("muteLocalAudioStream: " + this.bMuteLocal);                
        } else {
            this.bMuteLocal = !this.bMuteLocal; 
            agoraCreator.addTips("muteLocalAudioStream: " + this.bMuteLocal);            
        }
        agoraCreator.agoraCreatorInst.muteLocalAudioStream(this.bMuteLocal);
    },

    btnMuteRemoteClick: function (event, customEventData) {        
        if(!this.bMuteRemote){
            this.bMuteRemote = !this.bMuteRemote;
            agoraCreator.addTips("muteAllRemoteAudioStreams: " + this.bMuteRemote);                
        } else {
            this.bMuteRemote = !this.bMuteRemote; 
            agoraCreator.addTips("muteAllRemoteAudioStreams: " + this.bMuteRemote);            
        }
        agoraCreator.agoraCreatorInst.muteAllRemoteAudioStreams(this.bMuteRemote);
    },

    btnEnableAudioClick: function (event, customEventData) {
        agoraCreator.agoraCreatorInst.enableAudio();
        agoraCreator.addTips("enable Audio "); 
    },

    btnDisableAudioClick: function (event, customEventData) {
        agoraCreator.agoraCreatorInst.disableAudio();
        agoraCreator.addTips("disable Audio "); 
    },

    btnStartAudioMixClick: function (event, customEventData) {
        agoraCreator.agoraCreatorInst.startAudioMixing("https://mms.msstatic.com/music/PczYBajT2B.mp3", false,false, 1);
    },

    btnStopAudioMixClick: function (event, customEventData) {
        agoraCreator.agoraCreatorInst.stopAudioMixing();
    },
});
