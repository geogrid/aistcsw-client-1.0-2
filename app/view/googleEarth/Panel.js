Ext.define('GECSW.view.googleEarth.Panel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.googleearthpanel',

    config: {
        /**
         * @var GECSW.store.GoogleEarthOptions
         */
        googleEarthOptionsStore: null,

        /**
         * @var GECSW.view.googleEarth.selection.BBox
         */
        selectionBBox: null,

        /**
         * @var GECSW.view.googleEarth.scene.DataView
         */
        sceneDataView: null
    },

    /**
     * @var GEPlugin
     */
    ge: null,

    /**
     * Google Earthを格納しているタグのID
     */
    googleEarthCtId: Ext.id(),

    /**
     * KMLObjectからPlacemarkを読み込む
     * @param string
     * @access public
     */
    loadPlacemarkFromTreeNode: function (node) {
        var me = this;

        node.cascadeBy(function(n) {
            me.ge.getFeatures().appendChild(n.get('kml'));
        });
    },

    getGEInstance: function() {
        return this.ge;
    },

    /**
     * kmlFeatureObjectが示すところへビューを移す。
     * ただし、LookAtが未指定の場合はGoogle Earthの仕様として動かない。
     * @param kmlObject
     */
    flyToViewByKmlFeatureObject: function (kmlFeatureObject) {
        var ge = this.ge;
        if (kmlFeatureObject.getAbstractView())
            ge.getView().setAbstractView(kmlFeatureObject.getAbstractView());
    },

    loadScenesFromRecords: function(records) {
        this.getSceneDataView().loadScenesFromRecords(records);
    },

    loadGroundOverlaysFromRecords: function (records) {
        this.getSceneDataView().loadGroundOverlaysFromRecords(records);
    },
    
    hideSceneById: function (id) {
        this.ge.getElementById(id).setVisibility(false);
    },

    resetScenes: function() {
        this.getSceneDataView().resetScenes();
    },

    showSceneById: function (id) {
        this.ge.getElementById(id).setVisibility(true);
    },

    /**
     * BBoxの選択モードを変更する
     * @param boolean
     */
    setSelectionBBoxEnabled: function (bool) {
        var me = this;
        me.ge.getOptions().setMouseNavigationEnabled(!bool);

        if(bool)
            me.getSelectionBBox().enable();
        else
            me.getSelectionBBox().disable();
    },

    /**
     * Google Earthのオプションを設定する
     * @access public
     */
    setGoogleEarthOption: function (optionName, value) {
        this.ge.getOptions()[optionName](value);
    },

    /**
     * レイヤーの可視状態を反映する
     * @param GECSW.model.Layer
     */
    updateLayerVisibility: function (node, visible) {
        node.get('kml').setVisibility(!!visible);
    },

    /**
     * レイヤーの可視状態を反映する
     * @param GECSW.model.Layer
     */
    updateLayerVisibilityByNode: function (node) {
        node.cascadeBy(function (n) {
            if (n.get('checked'))
                n.get('kml').setVisibility(true);
        });
    },

    /**
     * ビューをデフォルトの位置にする
     * @access protected
     */
    initAbstractViewLookAt: function () {
        var ge = this.ge;
        if (myConfig.lookAt) {
            var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_CLAMP_TO_GROUND);
            lookAt.setLatitude(myConfig.lookAt.latitude);
            lookAt.setLongitude(myConfig.lookAt.longitude);
            lookAt.setRange(myConfig.lookAt.range);
            ge.getView().setAbstractView(lookAt);
        }
    },

    /**
     * @access protected
     */
    initComponent: function () {
        var me = this;

        me.html = '<div id="' + me.googleEarthCtId + '" style="height:100%;width:100%;"></div>';

        me.callParent(arguments);

        this.on({
            afterrender: me.createGoogleEarthInstance,
            scope: me,
            single: true
        });

        var optionsStore = Ext.create('GECSW.store.GoogleEarthOptions');

        optionsStore.on({
            update: me.onGoogleEarthOptionUpdate,
            scope: me
        });
        me.setGoogleEarthOptionsStore(optionsStore);
    },

    /**
     * Google Earthのオプションを初期化する
     * @access protected
     */
    initGoogleEarthOptions: function () {
        var me = this;
        this.getGoogleEarthOptionsStore().each(function (rec) {
            me.setOption(rec.get('name'), rec.get('value'));
        });
    },

    /**
     * Google Earthの表示設定を初期化する
     * @access protected
     */
    initGoogleEarthVisibility: function () {
        var ge = this.ge;
        ge.getWindow().setVisibility(true);
        ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    },

    /**
     * SceneをGoogle Earth上に表示するViewを初期化する
     * @access protected
     */
    initSceneDataView: function () {
        var me = this;
        var dataView = Ext.create('GECSW.view.googleEarth.scene.DataView', {
            ge: me.ge,
            ownerCt: me
        });
        dataView.on({
            sceneplacemarkclick: function(event) {
                this.fireEvent('sceneplacemarkclick', event);
            },
            scope: me
        });
        me.setSceneDataView(dataView);
    },

    /**
     * @access protected
     */
    initSelectionBBox: function () {
        var me = this;
        var selBBox = Ext.create('GECSW.view.googleEarth.selection.BBox', {
            ge: me.ge,
            ownerCt: me 
        });

        selBBox.on({
            bboxupdate: function(bBoxData) { me.fireEvent('bboxupdate', bBoxData) },
            bboxclear: function(bBoxData) { me.fireEvent('bboxclear') },
            scope: me
        });

        me.setSelectionBBox(selBBox);
    },

    /**
     * @returns String Google Earthを格納しているタグのIDを返す
     */
    getGoogleEarthCtId: function () {
        return this.googleEarthCtId;
    },

    /**
     * Google Earthのインスタンスを生成
     * @return void
     * @access protected
     */
    createGoogleEarthInstance: function () {
        var me = this;
        var options = {};
        if (myConfig.database)
            options.database = myConfig.database;

        google.earth.createInstance(
            Ext.widget('googleearthpanel').googleEarthCtId,
            Ext.bind(me.onGoogleEarthReadySuccess, me),
            Ext.bind(me.onGoogleEarthReadyFailure, me),
            options
        );
    },

    /**
     * @access protected
     */
    onGoogleEarthOptionUpdate: function (store, record, operation, modifiedFieldNames, eOpts) {
        this.setGoogleEarthOption(record.get('name'), record.get('value'));
    },
    
    /**
     * Google Earthのインスタンスの生成に失敗した際に呼ばれるCallback用の関数
     * @access protected
     */
    onGoogleEarthReadyFailure: function (errorCode) {
        Ext.Msg.alert(Ext.String.format('Error({0})', errorCode), 'Google Earth failed to creaate instance.');
    },

    /**
     * Google Earthのインスタンスの生成に成功した際に呼ばれるCallback用の関数
     * @param instance Google Earthのインスタンス
     * @access protected
     */
    onGoogleEarthReadySuccess: function (instance) {
        this.ge = instance;
        this.initSelectionBBox();
        this.initSceneDataView();
        this.initGoogleEarthVisibility();
        this.initAbstractViewLookAt();

        this.fireEvent('googleearthreadysuccess', this.ge);
    }
});
