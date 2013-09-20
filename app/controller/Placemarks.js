Ext.define('GECSW.controller.Placemarks', {
    extend: 'Ext.app.Controller',

    views: [
        'placemarks.Panel'
    ],

    refs: [
        {
            ref: 'GoogleEarthPanel',
            selector: 'googleearthpanel'
        },
        {
            ref: 'placemarksPanel',
            selector: 'placemarkspanel'
        }
    ],

    init: function () {
        var me = this;
        this.control({
            'placemarkspanel treepanel[itemId=kml-object-tree-panel]': {
                checkchange: me.onPlacemarkCheckChange
            },
            'placemarkspanel button[itemId=kml-url-load-button]': {
                click: me.onLoadKmlFromUrlButtonClick
            },
            'placemarkspanel form filefield': {
                fileselected: me.onFileSelected
            },
            'placemarkspanel form': {
                filedrop: me.onFileSelected
            }
        });
    },

    /**
     * Google Earthに新しいKMLがfetchされた際にコールされる
     * @param ge Instance of Google Earth
     * @param kmlObject
     * @access protected
     */
    onFetchKml: function (ge, url, kmlObject) {
        var node = GECSW.model.Placemark.createTreeNodeFromKmlObject(kmlObject);
        this.getPlacemarksPanel().getTree().appendToRootNode(node);
        this.getPlacemarksPanel().getLayout().setActiveItem('kml-object-tree-panel');
        
        this.getGoogleEarthPanel().loadPlacemarkFromTreeNode(node);
    },

    onLoadKmlFromUrlButtonClick: function () {
        var me    = this;
        var url   = this.getPlacemarksPanel().down('textarea[name=url]').getValue();
        var ge    = this.getGoogleEarthPanel().getGEInstance();
        var model = Ext.create('GECSW.model.Placemark');

        model.on({
            fetchkml: me.onFetchKml,
            fetchkmlfailure: function(ge, url) {
                me.getPlacemarksPanel().displayFetchFailureMessage();
            },
            single: true,
            scope: me
        });
        model.fetchKmlFromUrl(ge, url);
    },

    /**
     * Placemarkが記述されたKMLファイルが選択された際にコールされる
     */
    onFileSelected: function(field, files) {
        try {
            var me    = this;
            var ge    = this.getGoogleEarthPanel().getGEInstance();
            var model = Ext.create('GECSW.model.Placemark');
            model.on({
                fileloadend: function(m, kml, evt) {
                    var kmlObject =  GECSW.model.Placemark.parseKml(ge, kml);
                    if (kmlObject) {
                        var node = GECSW.model.Placemark.createTreeNodeFromKmlObject(kmlObject);
                        me.getPlacemarksPanel().getTree().appendToRootNode(node);
                        me.getGoogleEarthPanel().loadPlacemarkFromTreeNode(node);
                    }
                },
                fileloadcomplete: function(m, kml, evt) {
                    me.getPlacemarksPanel().getLayout().setActiveItem('kml-object-tree-panel');
                },
                scope: me
            });
            var node = model.loadFiles(files);
        } catch (e) {
            Ext.Msg.alert('KML/KMZ load error', e.message);
        }
    },

    /**
     * Placemarkのチェック状態が変更された際にコールされる
     */
    onPlacemarkCheckChange: function (node, checked, eOpts) {
        this.getPlacemarksPanel().getTree().cascadeCheckChange(node, checked, true);
    }
});
