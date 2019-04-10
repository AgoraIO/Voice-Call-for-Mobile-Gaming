var agoraCreator = require("agoraCreator");

cc.Class({
    extends: cc.Component,

    properties: {

        btnCreate: {
            default: null,
            type: cc.Button
        },

        btnDefaultSpeaker: {
            default: null,
            type: cc.Button
        },

        btnVolumeIndication: {
            default: null,
            type: cc.Button
        },

        btnJoin: {
            default: null,
            type: cc.Button
        },
 
        toggleContainer:{
            default:null,
            type:cc.ToggleContainer
        },

        toggle1:{
            default:null,
            type:cc.Toggle
        },

        toggle2:{
            default:null,
            type:cc.Toggle
        },

        toggle3:{
            default:null,
            type:cc.Toggle
        },

        cEditBox:{
            default:null,
            type: cc.EditBox
        },

        msgLabel: {
            default: null,
            type: cc.Label
        },

        sdkVer: {
            default: null,
            type: cc.Label
        },

        profileRole:0,

        bDefaultSpeakerphone:false,

    },

    // use this for initialization
    onLoad: function () {        
        this.updateUI(false);
        this.initEvent();
    },

    onDestroy () {
        this.removeEvent();
        console.log("Page Destory");
    },

    updateUI: function(bInited){
        this.btnJoin.interactable = bInited;
        this.btnDefaultSpeaker.interactable = bInited;
        this.btnVolumeIndication.interactable = bInited;
        
        this.toggle1.interactable = bInited;
        this.toggle2.interactable = bInited;
        this.toggle3.interactable = bInited;
    },

    initEvent:function(){              
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_tips,this.onEvent,this);
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_created,this.onEvent,this);
        cc.systemEvent.on(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent,this);
    },

    removeEvent:function(){    
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_tips,this.onEvent);
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_created,this.onEvent);
        cc.systemEvent.off(agoraCreator.AGORAEVT.evt_jSuccess,this.onEvent);
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
                this.msgLabel.string  = s;
                break;

            case agoraCreator.AGORAEVT.evt_created:
                this.msgLabel.string = "createEngine called ...";
                this.sdkVer.string =  "sdkVer: " + agoraCreator.agoraCreatorInst.getVersion();
                this.updateUI(true);
                break;
            case agoraCreator.AGORAEVT.evt_jSuccess:
                this.loadScene2();
                break;
        }
    },

    loadScene2:function() {
        cc.director.loadScene("scene2");
    },

    toggle1Func:function(){
        this.profileRole = 0;
        agoraCreator.agoraCreatorInst.setChannelProfile(this.profileRole);
        agoraCreator.addTips("setChannelProfile: " +  "communication "); 
    },

    toggle2Func:function(){
        this.profileRole = 1;
        agoraCreator.agoraCreatorInst.setChannelProfile(this.profileRole);
        agoraCreator.agoraCreatorInst.setClientRole(1);

        agoraCreator.addTips("setChannelProfile: " +  " Broadcast + Host "); 
    },

    toggle3Func:function(){
        this.profileRole = 2;
        agoraCreator.agoraCreatorInst.setChannelProfile(this.profileRole -1 );
        agoraCreator.agoraCreatorInst.setClientRole(this.profileRole);
        agoraCreator.addTips("setChannelProfile: " + " Broadcast + Audience "); 
    },

    setDefaultAudioRouteToSpeakerphone:function(){
        if(!this.bDefaultSpeakerphone){
            this.bDefaultSpeakerphone = !this.bDefaultSpeakerphone;
            agoraCreator.addTips("setDefaultAudioRouteToSpeakerphone: " + this.bDefaultSpeakerphone);                
        } else {
            this.bDefaultSpeakerphone = !this.bDefaultSpeakerphone;
            agoraCreator.addTips("setDefaultAudioRouteToSpeakerphone: " + this.bDefaultSpeakerphone);            
        }
        agoraCreator.agoraCreatorInst.setDefaultAudioRouteToSpeakerphone(this.bDefaultSpeakerphone);
    },

    enableAudioVolumeIndication:function(){
        var interval = 800;
        var smooth = 3;
        agoraCreator.addTips("enableAudioVolumeIndication(" + interval +", "+ smooth + ")" );            
        agoraCreator.agoraCreatorInst.enableAudioVolumeIndication(800, 3);
    },

    createEngine: function (event, customEventData) {
        agoraCreator.createEngine("4c51ad802859440cbfb89eb75919d9ed");// input: APPID
        console.log("Debug, agoraCreator.createEngine ");
    },

    joinChannel: function (event, customEventData) {
        // this.msgLabel.string = "join agora Channel...";
        var channelId = this.cEditBox.string;

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
        agoraCreator.agoraCreatorInst.joinChannel(token, channelId, info, uid);
    },

    start(){
    },

    update(){

    }

});


