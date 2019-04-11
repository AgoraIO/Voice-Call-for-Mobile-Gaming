require("js-agora");
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
        
        agoraAppID:"YOUR_AGORA_APPID",
    },

    onLoad: function () {        
        this.updateUI(false);
        agora.on('join-channel-success',this.onJoinChannelSuccess, this);
    },

    onDestroy () {
        agora.off('join-channel-success',this.onJoinChannelSuccess);
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

    onJoinChannelSuccess:function(channel, uid, elapsed){
        cc.log("Join Channel Success, channel: " + channel + " uid: " + uid + " elapsed: " + elapsed);
        cc.director.loadScene("Scene2");
    },

    addTips:function(args){
         this.msgLabel.string  = args;
    },

    toggle1Func:function(){
        this.profileRole = 0;
        agora.setChannelProfile(this.profileRole);
        this.addTips("setChannelProfile: " +  "communication "); 
    },

    toggle2Func:function(){
        this.profileRole = 1;
        agora.setChannelProfile(this.profileRole);
        agora.setClientRole(1);

        this.addTips("setChannelProfile: " +  " Broadcast + Host "); 
    },

    toggle3Func:function(){
        this.profileRole = 2;
        agora.setChannelProfile(this.profileRole -1 );
        agora.setClientRole(this.profileRole);
        this.addTips("setChannelProfile: " + " Broadcast + Audience "); 
    },

    setDefaultAudioRouteToSpeakerphone:function(){
        if(!this.bDefaultSpeakerphone){
            this.bDefaultSpeakerphone = !this.bDefaultSpeakerphone;
            this.addTips("setDefaultAudioRouteToSpeakerphone: " + this.bDefaultSpeakerphone);                
        } else {
            this.bDefaultSpeakerphone = !this.bDefaultSpeakerphone;
            this.addTips("setDefaultAudioRouteToSpeakerphone: " + this.bDefaultSpeakerphone);            
        }
        agora.setDefaultAudioRouteToSpeakerphone(this.bDefaultSpeakerphone);
    },

    enableAudioVolumeIndication:function(){
        var interval = 800;
        var smooth = 3;
        this.addTips("enableAudioVolumeIndication(" + interval +", "+ smooth + ")" );            
        agora.enableAudioVolumeIndication(800, 3);
    },

    createEngine: function (event, customEventData) {
        // input: APPID. 
        console.log("Your private agoraAppID:", this.agoraAppID);
        agora.init(this.agoraAppID);
        this.sdkVer.string =  "sdkVer: " + agora.getVersion();
        this.updateUI(true);
    },

    joinChannel: function (event, customEventData) {
        // this.msgLabel.string = "join agora Channel...";
        var channelId = this.cEditBox.string;

        if(channelId == ""){
            this.addTips("channelId is null."); 
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
        if(agora == null){
            cc.log("agoraCreatorInst should be not null.");
            return false;
        }else {
            cc.log("agoraCreatorInst is not null.");
        }
        agora.joinChannel(token, channelId, info, uid);
    },

    start(){
    },

    update(){

    },

});