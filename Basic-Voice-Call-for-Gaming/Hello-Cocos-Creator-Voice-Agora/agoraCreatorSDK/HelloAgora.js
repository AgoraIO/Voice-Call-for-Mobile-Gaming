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

        //defaults, set visually when attaching this script to the Canvas
        text: 'Hello Agora Audio !',

        bMuteLocal:false,
        bMuteRemote:false,

    },

    // use this for initialization
    onLoad: function () {        

        this.initEvent();

        this.label.string = this.text;

        this.updateUI(false);
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
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent,this);
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_lSuccess,this.onEvent,this);

    },

    removeEvent:function(){    
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_tips,this.onEvent);
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent);
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
                this.updateUI(true)

                break;

            case agoraCreator.AGORAEVT.evt_lSuccess:
                cc.log("Debug: " + agoraCreator.AGORAEVT.evt_lSuccess);
                // this.label.string  = s;     
                this.updateUI(false)          

                break;

        }
    },

    // called every frame
    update: function (dt) {

    },

    btnCreateClick: function (event, customEventData) {
        agoraCreator.createEngine("YOUR APP ID"); // input: APPID
        this.label.string = "createEngine called ...";
    },

    btnJoinRoomClick: function (event, customEventData) {
        // agoraCreator.initagoraCreator("4c51ad802859440cbfb89eb75919d9ed"); // input: APPID
        this.label.string = "join agora Channel...";
        var channelId = this.channelName.string;

        if(channelId == ""){
            agoraCreator.addTips("channelId is null."); 
            cc.log("channelId is ''");
            return false;
        }else {
            cc.log("channelId: " + channelId);
        }

        //agoraCreator
        /*!
         *  @param  token   "" or token Value from App Server
         *  @param channelId   Channel name
         *  @param uid  user id, 0:SDK will generate it,or uid of app player's id
         *  @param  info   ""
         *  @return errCode
         */
        var token = "";
        var uid = 0;
        var info = "";
        if(agoraCreator.agoraCreatorInst == null){
            cc.log("agoraCreatorInst should be not null.");
            return false;
        }else {
            cc.log("agoraCreatorInst is not null.");
        }
        agoraCreator.agoraCreatorInst.setDefaultAudioRouteToSpeakerphone(true);

        agoraCreator.agoraCreatorInst.joinChannel(token, channelId, info, uid);
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

    btnSetSpeakerPhoneClick: function (event, customEventData) {
        if(!this.bMuteRemote){
            this.bMuteRemote = !this.bMuteRemote;
            agoraCreator.addTips("setEnableSpeakerphone: " + this.bMuteRemote);                
        } else {
            this.bMuteRemote = !this.bMuteRemote;
            agoraCreator.addTips("setEnableSpeakerphone: " + this.bMuteRemote);            
        }
        agoraCreator.agoraCreatorInst.setEnableSpeakerphone(this.bMuteRemote);
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
