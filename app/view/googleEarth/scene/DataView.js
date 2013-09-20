Ext.define('GECSW.view.googleEarth.scene.DataView', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @var GoogleEarth
     */
    ge: null,

    /**
     * 生成されたBBoxの情報
     * @var object
     */
    sceneKmlObjects: [],

    /**
     * 生成されたGroundOverlay用のBBOX Object
     * @var object
     */
    groundOverlayKmlObjects: [],

    /**
     * Sceneに該当する地域をマーキングするためのXMLテンプレート
     */
    linerRingTpl: null,

    /**
     * Sceneに該当する地域のオーバーレイ用のXMLテンプレート
     */
    groundOverlayTpl: null,

    /**
     * Scene画像のURIのテンプレート
     */
    sceneImageUriTpl: null,

    /**
     * このサービスのオーナー
     */
    ownerCt: null,

    constructor: function (config) {
        var me = this;

        this.mixins.observable.constructor.call(this, config);

        if (config)
            Ext.apply(me, config);

        me.linerRingTpl = new Ext.XTemplate(myConfig.linerRingTpl);
        me.groundOverlayTpl = new Ext.XTemplate(myConfig.groundOverlayTpl);
        me.sceneImageUriTpl = new Ext.XTemplate(myConfig.sceneImageUriTpl);

        me.addEvents({
            sceneplacemarkclick: true
        });

        me.enableBubble('sceneplacemarkclick');
    },

    getBubbleTarget: function(){
        return this.ownerCt; 
    },

    /**
     * SceneをGoogle Earth上に読み込む
     * @param records GECSW.model.scene.Modelのインスタンスの配列
     */
    loadScenesFromRecords: function (records) {
        this.resetGroundOverlay();
        this.resetScenes();

        var me = this;
        Ext.each(records, function(record){
            var data = record.getData();
            data.lineStyle = myConfig.scene.linerRing.lineStyle;
            data.polyStyle = myConfig.scene.linerRing.polyStyle;
            var textXml = me.linerRingTpl.apply(data);
            var kmlObject = me.ge.parseKml(textXml);
            me.sceneKmlObjects.push(kmlObject);
            me.ge.getFeatures().appendChild(kmlObject);

            google.earth.addEventListener(kmlObject, 'click', function(event){
                me.fireEvent('sceneplacemarkclick', event);
            });
        });
    },

    /**
     * GroundOverlayをGoogleEarth上に読み込む
     * @param record GECSW.model.scene.Modelのインスタンス
     */
    loadGroundOverlaysFromRecords: function (records) {
        var me = this;
        Ext.each(records, function(record){
            var data = {
                id: record.get('id'),
                fileName: record.get('thumbnail'),
                acquisitionDate: record.get('acquisitionDate'),
                north: record.getNorth(),
                south: record.getSouth(),
                east: record.getEast(),
                west: record.getWest(),
                bBoxCoordinates: record.getBBoxCoordinates(),
                service: myConfig.scene.icon.service,
                request: myConfig.scene.icon.request,
                crs: myConfig.scene.icon.crs,
                transparent: myConfig.scene.icon.transparent,
                format: myConfig.scene.icon.format,
                version: myConfig.scene.icon.version,
                image: myConfig.scene.icon.image
            };
            data.sceneImageUri = me.sceneImageUriTpl.apply(data);
            var textXml = me.groundOverlayTpl.apply(data);
            var kmlObject = me.ge.parseKml(textXml);
            me.groundOverlayKmlObjects.push(kmlObject);
            me.ge.getFeatures().appendChild(kmlObject);
        });
    },

    /**
     * Google Earth上に表示しているSceneを全て消す
     */
    resetScenes: function () {
        var me = this;

        if (me.sceneKmlObjects.length == 0)
            return;

        Ext.each(me.sceneKmlObjects, function(kmlObject){
	        google.earth.removeEventListener(kmlObject, 'click');
            me.ge.getFeatures().removeChild(kmlObject);
        });
        me.sceneKmlObjects = [];
    },

    /**
     * Google Earth上に表示されているGroundOverlayを消す
     */
    resetGroundOverlay: function () {
        var me = this;

        if (me.groundOverlayKmlObjects.length == 0)
            return;

        Ext.each(me.groundOverlayKmlObjects, function(kmlObject){
	        google.earth.removeEventListener(kmlObject, 'click');
            me.ge.getFeatures().removeChild(kmlObject);
        });

        me.groundOverlayKmlObjects = [];
    }
});
