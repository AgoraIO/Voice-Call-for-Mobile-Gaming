cc.Class({
    extends: cc.Component,

    properties: {
        logLable: cc.Label
    },

    onLoad: function () {
        var self = this;
    },

    updateItem: function (obj) {
        this.logLable.string = obj;
    }

});