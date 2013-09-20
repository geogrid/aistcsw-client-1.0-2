Ext.define('GECSW.model.scene.Model', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            mapping: '@id'
        },
        {
            name: 'acquisitionDate',
            mapping: function(rootNode) {
                var selector = 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::acquisitionDate] > rim|ValueList > rim|Value';
                var dateString = Ext.DomQuery.selectValue(selector, rootNode);
                var dt = Ext.Date.parse(dateString, 'c');
                return Ext.Date.format(dt, 'c');
            }
        },
        {
            name: 'beginPosition',
            mapping: 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::beginPosition] > rim|ValueList > rim|Value'
        },
        {
            name: 'endPosition',
            mapping: 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::endPosition] > rim|ValueList > rim|Value'
        },
        {
            name: 'thumbnail',
            mapping: 'rim|ExtrinsicObject[objectType=urn:ogc:def:objectType:OGC-CSW-ebRIM-EO::EOBrowseInformation] > rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::fileName] > rim|ValueList > rim|Value'
        },
        {
            name: 'fileName',
            mapping: function (rootNode) {
                var selector = 'rim|Association[associationType=urn:ogc:def:associationType:OGC-CSW-ebRIM-EO::HasProductInformation]';
                var productInformation = Ext.DomQuery.selectNode(selector, rootNode);
                selector = 'rim|ExtrinsicObject[objectType=urn:ogc:def:objectType:OGC-CSW-ebRIM-EO::EOProductInformation][id=' + productInformation.getAttribute('targetObject') + '] > rim|Slot > rim|ValueList > rim|Value';
                return Ext.DomQuery.selectValue(selector, rootNode);
            }
        },
        {
            name: 'path',
            mapping: 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::wrsLongitudeGrid] > rim|ValueList > rim|Value'
        },
        {
            name: 'row',
            mapping: 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::wrsLatitudeGrid] > rim|ValueList > rim|Value'
        },
        {
            name: 'multiExtentOf',
            mapping: function (rootNode) {
                var selector = 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::multiExtentOf] > rim|ValueList';
                return Ext.DomQuery.selectNode(selector, rootNode);
            }
        },
        {
            name: 'coordinates',
            mapping: function (rootNode) {
                var selector = 'rim|Slot[name=urn:ogc:def:slot:OGC-CSW-ebRIM-EO::multiExtentOf] > rim|ValueList';
                var node = Ext.DomQuery.selectNode(selector, rootNode);
                var text = node.textContent || node.text;
                return text.match(/(\d|\.)+/g);
            }
        },

        // 検索に使うが表示には使わないfield
        { name: 'cloudCoverPercentage' },
        { name: 'bbox-selection-mode' },
        { name: 'lng1' },
        { name: 'lat1' },
        { name: 'lng2' },
        { name: 'lat2' }
    ],

    validations: [
        { type: 'presence', field: 'beginPosition', message: 'Begin Postion is empty.' },
        { type: 'presence', field: 'endPosition', message: 'End Postion is empty.' },
        { type: 'presence', field: 'cloudCoverPercentage', message: 'Cloud Cover Percentage is emtpy.' },
        { type: 'presence', field: 'lng1', message: 'BBox must be specified.' }
    ],

    constructor: function() {
        this.callParent(arguments);
        this.enableBubble('preparedownloadsuccess');
        this.enableBubble('preparedownloadfailure');
    },

    /**
     * multiExtentOfの中から最大の緯度を返す
     * @returns {number}
     */
    getNorth: function () {
        var values = [-90].concat(Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 1);
        }));
        return Math.max.apply(null, values);
    },

    /**
     * multiExtentOfの中から最小の緯度を返す
     * @returns {number}
     */
    getSouth: function () {
        var values = [90].concat(Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 1);
        }));
        return Math.min.apply(null, values);
    },

    /**
     * multiExtentOfの中から最大の経度を返す
     * @returns {number}
     */
    getEast: function () {
        var values = [-180].concat(Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 0);
        }));
        return Math.max.apply(null, values);
    },

    /**
     * multiExtentOfの中から最小の経度を返す
     * @returns number
     */
    getWest: function () {
        var values = [180].concat(Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 0);
        }));
        return Math.min.apply(null, values);
    },

    /**
     * multiExtentOfからlat1,lng1,lat2,lng2形式の文字列を返す
     * @returns string
     */
    getBBoxCoordinates: function () {
        var x = Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 1);
        });

        var y = Ext.Array.filter(this.get('coordinates'), function (element, index) {
            return (index % 2 == 0);
        });

        return [Math.min.apply(this, x), Math.min.apply(this, y), Math.max.apply(this, x), Math.max.apply(this, y)].join(',');
    },

    getBubbleTarget: function() {
        if(this.store !== undefined)
            return this.store;

        return false;
    },

    /**
     * 検索用に値を返す。
     * @return Object
     * @access public
     */
    getSearchParameters: function() {
        var me = this;
        var data = me.getData();

        // endPositionを2012-12-01とした場合、サーバは2012-12-01 00:00:00として扱ってしまい、less thanになってしまう問題を回避するため。
        data['endPosition'] = Ext.Date.format(Ext.Date.add(Ext.Date.parse(data['endPosition'], 'Y-m-d'), Ext.Date.DAY, 1), 'Y-m-d');

        return data;
    }
});
