Ext.define('GECSW.view.googleEarth.selection.BBox', {
    extend: 'Ext.Component',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @var KmlPlacemark
     */
    bBox: null,

    config: {
        /**
         * @var boolean
         */
        disabled: true
    },

    /**
     * @var GoogleEarth
     */
    ge: null,

    /**
     * マウスがダウン状態か否かを表すフラグ
     * @var boolean
     */
    mouseDown: false,

    /**
     * 生成されたBBoxの情報
     * @var object
     */
    bBoxData: null,

    /**
     * @var Ext.Component
     */
    ownerCt: null,

    constructor: function (config) {
        var me = this;

        if (config)
            Ext.apply(me, config);

        me.mixins.observable.constructor.call(me, config);

        var ge = me.ge;
        var bBoxPlacemark = ge.createPlacemark('');

        var polygon = ge.createPolygon('');
        polygon.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);

        bBoxPlacemark.setGeometry(polygon)
        bBoxPlacemark.setStyleSelector(ge.createStyle(''));

        var lineStyle = bBoxPlacemark.getStyleSelector().getLineStyle();
        lineStyle.setWidth(2);
        lineStyle.getColor().set('990000ff');

        var polyStyle = bBoxPlacemark.getStyleSelector().getPolyStyle();
        polyStyle.getColor().set('440000ff');
        ge.getFeatures().appendChild(bBoxPlacemark);

        me.bBox = bBoxPlacemark;

        google.earth.addEventListener(ge.getGlobe(), 'mousedown', Ext.bind(me.onMouseDown, me));
        google.earth.addEventListener(ge.getGlobe(), 'mousemove', Ext.bind(me.onMouseMove, me));
        google.earth.addEventListener(ge.getGlobe(), 'mouseup', Ext.bind(me.onMouseUp, me));

        me.addEvents('bboxupdate','bboxclear');

        me.enableBubble('bboxupdate');
//        me.enableBubble('bboxclear');
    },

    initBBox: function (lat, lng) {
        this.bBoxData = {
            lat1: lat,
            lng1: lng,
            lat2: lat,
            lng2: lng,
            enabled: false
        };
        this.drawBBox();
    },

    /**
     * BBoxで囲む範囲を描画する
     */
    drawBBox: function () {
        var ge = this.ge;
        var param = this.bBoxData;

        var outer = ge.createLinearRing('');
        outer.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);

        if (param.enabled) {
            outer.getCoordinates().pushLatLngAlt(param.lat1, param.lng1, 0);
            outer.getCoordinates().pushLatLngAlt(param.lat1, param.lng2, 0);
            outer.getCoordinates().pushLatLngAlt(param.lat2, param.lng2, 0);
            outer.getCoordinates().pushLatLngAlt(param.lat2, param.lng1, 0);
        }

        this.bBox.getGeometry().setOuterBoundary(outer);
    },

    /**
     * BBoxを更新する
     * @param lat latitude
     * @param lng longitude
     */
    updateBBox: function (lat, lng) {
        this.bBoxData.lat2 = lat;
        this.bBoxData.lng2 = lng;
        this.bBoxData.enabled = (this.bBoxData.lat1 != this.bBoxData.lat2 && this.bBoxData.lng1 != this.bBoxLng2);

        this.fireEvent('bboxupdate', this.bBoxData);

        this.drawBBox();
    },

    /**
     * BBoxの選択モードをenableにする
     * @param ge GoogleEarth
     * @param bBox KmlPlacemark
     * @param value boolean
     * @access protected
     */
    enable: function () {
        this.disabled = false;
    },

    /**
     * BBoxの選択モードをdisableにする
     * @param ge GoogleEarth
     * @param bBox KmlPlacemark
     * @param value boolean
     * @access protected
     */
    disable: function () {
        this.disabled = true;
    },

    getBubbleTarget: function () {
        return this.ownerCt;
    },

    /**
     * Mouseが押された時のコールバック
     * BBoxの選択が有効でない場合は何もしない。有効な際はBBoxの初期化を行う
     * @param event
     * @access protected
     */
    onMouseDown: function (event) {
        if (this.disabled === true)
            return this;

        this.initBBox(event.getLatitude(), event.getLongitude());
        this.mouseDown = true;
    },

    /**
     * Mouseが移動した際のコールバック
     * BBoxの選択が有効でない場合は何もしない。有効な際はBBoxの更新を行う
     * @param event
     * @access protected
     */
    onMouseMove: function (event) {
        if (this.disabled === true || this.mouseDown !== true)
            return this;
        this.updateBBox(event.getLatitude(), event.getLongitude());
    },

    /**
     * Mouseが押された状態から戻った際のコールバック
     * BBoxの選択が有効でない場合は何もしない。有効な際はBBoxの更新を行う
     * @param event
     * @access protected
     */
    onMouseUp: function (event) {
        if (this.disabled)
            return this;

        if (this.acceptClearBBox(event.getLatitude(), event.getLongitude())) {
            this.mouseDown = false;
            this.fireEvent('bboxclear');
            return this;
        }

        this.updateBBox(event.getLatitude(), event.getLongitude());
        this.mouseDown = false;
    },

    acceptClearBBox: function (lat, lng) {
        return (this.bBoxData.lat1 == lat && this.bBoxData.lng1 == lng);
    }
});
