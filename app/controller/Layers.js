Ext.define('GECSW.controller.Layers', {

    extend: 'Ext.app.Controller',

    views: [
        'googleEarth.Panel',
        'layers.Panel'
    ],

    models: ['Layer'],

    refs: [
        {
            ref: 'layersPanel',
            selector: 'layerspanel'
        }
    ],

    init: function () {
        var me = this;

        me.control({
            'googleearthpanel' : {
                googleearthreadysuccess: me.onGoogleEarthReadySuccess
            }
        });
    },

    /**
     * GoogleEarthのインスタンスの生成に成功した際のコールバック
     * @params ge Google Earthのインスタンス
     */
    onGoogleEarthReadySuccess: function (ge) {
        var node = GECSW.model.Layer.createTreeNodeFromKmlLayerRoot(ge.getLayerRoot());
        this.getLayersPanel().appendToRootNode(node);
    }
});
