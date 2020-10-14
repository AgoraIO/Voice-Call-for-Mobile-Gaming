// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        texture: {
            default: null,
            type: cc.Texture2D
        },
        uid: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log('onLoad');
        this.texture = new cc.Texture2D();
        this.texture.initWithData(null, cc.Texture2D.PixelFormat.RGBA32F, this.node.width, this.node.height);
        agora.bindTextureId(this.texture.getImpl().getHandle(), this.uid);
        const frame = new cc.SpriteFrame();
        frame.setTexture(this.texture);
        this.getComponent(cc.Sprite).spriteFrame = frame;
        // this.getComponent(cc.Sprite).spriteFrame.setTexture(this.texture);
        console.log(this.getComponent(cc.Sprite).spriteFrame);
    },

    start() {

    },

    // update (dt) {},
});
