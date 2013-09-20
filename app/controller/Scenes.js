Ext.define('GECSW.controller.Scenes', {
    extend: 'Ext.app.Controller',
    views: [
        'googleEarth.Panel',
        'scenes.SearchForm',
        'scenes.SearchResult'
    ],
    refs: [
        {
            ref: 'GoogleEarthPanel',
            selector: 'googleearthpanel'
        },
        {
            ref: 'scenesSearchForm',
            selector: 'scenessearchform'
        },
        {
            ref: 'scenesSearchResult',
            selector: 'scenessearchresult'
        }
    ],

    stores: ['Scenes'],

    title: 'Search',

    /**
     * Ext.data.Errorsのインスタンス
     */
    errors: null,

    init: function () {
        var me = this;

        me.control({
            'googleearthpanel': {
                bboxclear: me.onSelectionBBoxClear,
                bboxupdate: me.onSelectionBBoxUpdate,
                sceneplacemarkclick: me.onScenePlacemarkClick
            },
            'scenessearchform button[name=search]': {
                click: me.onSearchButtonClick
            },
            'scenessearchresult': {
                downloadclick: me.onDownloadClick
            }
        });

        me.getScenesStore().on({
            load: me.onSceneDataChanged,
            scope: this
        });

        me.addEvents({
            sceneitementer: true,
            sceneitemleave: true,
            sceneitemclick: true
        });
    },

    onSelectionBBoxClear: function () {
        var values = {
            lat1: null,
            lat2: null,
            lng1: null,
            lng2: null 
        };
        this.getScenesSearchForm().getForm().setValues(values);
    },

    onSelectionBBoxUpdate: function (bBoxData) {
        var lat = [bBoxData.lat1, bBoxData.lat2];
        var lng = [bBoxData.lng1, bBoxData.lng2];
        var values = {
            lat1: Math.min.apply(null, lat),
            lat2: Math.max.apply(null, lat),
            lng1: Math.min.apply(null, lng),
            lng2: Math.max.apply(null, lng)
        };
        this.getScenesSearchForm().getForm().setValues(values);
    },

    /**
     * Search Buttonクリックのcallback
     */
    onSearchButtonClick: function (button, e, eOpts) {
        this.getScenesSearchForm().getForm().clearInvalid();

        if(this.acceptDoSearch()) {
            this.doSearch();
            return;
        }
        this.getScenesSearchForm().markInvalid(this.errors);
    },

    /**
     * 検索を実行するか判別する
     */
    acceptDoSearch: function() {
        this.errors = this.getScenesSearchForm().getFormModel().validate();

        return this.errors.isValid();
    },

    /**
     * 検索を実行する
     */
    doSearch: function() {
        if (!this.loadMask) {
            this.loadMask = new Ext.LoadMask({
                target: this.getScenesSearchResult(),
                msg: "Please wait..."
            });
        }
        this.loadMask.show();

        var queryTpl = new Ext.XTemplate(myConfig.queryTpl);

        Ext.Ajax.request({
            url: myConfig.proxy.url + '/' + myConfig.CSW.url,
            xmlData: queryTpl.apply(this.getScenesSearchForm().getFormModel().getSearchParameters()),
            success: function (response, options) {
                this.getScenesStore().loadRawData(response.responseXML);
                this.getScenesStore().sort();
            },
            failure: function (response, options) {
                Ext.Msg.alert(Ext.String.format('Error {0}', response.status), response.responseText);
            },
            callback: function (options, success, response) {
                this.loadMask.hide();
            },
            scope: this
        });
    },

    /**
     * Sceneがロードされた際のコールバック
     * @param store
     * @param records
     * @param successful
     * @param eOpts
     */
    onSceneDataChanged: function (store) {
        var view = this.getGoogleEarthPanel();
        view.resetScenes();
        view.loadScenesFromRecords(store.getRange());
        view.loadGroundOverlaysFromRecords(store.getRange());
    },

    onScenePlacemarkClick: function(event) {
        var record = this.getScenesStore().findRecord('id', event.getTarget().getId());
        if(record)
            this.getScenesSearchResult().getSelectionModel().select(record);
    },

    onDownloadClick: function(rec) {
        this.getScenesSearchResult().download(rec);
    }
});
