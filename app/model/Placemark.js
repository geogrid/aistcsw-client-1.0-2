Ext.define('GECSW.model.Placemark', {
    extend: 'Ext.data.TreeModel',
    fields: [
        'text',
        'name',
        'visibility',
        'description',
        'LookAt',
        'styleUrl',
        'Point',
        'kml'
    ],
    statics: {
        /**
         * kmlObjectからview.Placemarkで利用するノードを作成
         * @param kmlObject
         * @returns node GECSW.model.Placemark
         */
        createNodeFromKmlObject: function (kmlObject) {
            try {
                var node = Ext.create('GECSW.model.Placemark', {
                    text: kmlObject.getName(),
                    kml: kmlObject,
                    description: kmlObject.getDescription(),
                    styleUrl: kmlObject.getStyleUrl(),
                    checked: (kmlObject.getVisibility() ? true : false),
                    expanded: (kmlObject.getOpen() ? true : false),
                    iconCls: kmlObject.getType(),
                    leaf: ((kmlObject.getType() == 'KmlFolder' || kmlObject.getType() == 'KmlDocument') ? false : true)
                });
            } catch (e) {
                Ext.Msg.alert('KML/KMZ load error', e.message);
            }
            return node;
        },

        /**
         * kmlObjectからview.Placemarkで利用するノードを作成
         * ノードはツリー構造になるので、root nodeに全て追加してから返す
         * @param kmlObject
         * @returns node GECSW.model.Placemark
         */
        createTreeNodeFromKmlObject: function (kmlObject) {
            var rootNode = this.createNodeFromKmlObject(kmlObject);

            if (kmlObject.getFeatures().hasChildNodes()) {
                var kmlChildNodes = kmlObject.getFeatures().getChildNodes();
                for (var i = 0; i < kmlChildNodes.getLength(); i++) {
                    var kmlChildNode = kmlChildNodes.item(i);
                    var node = ('getFeatures' in kmlChildNode)
                        ? this.createTreeNodeFromKmlObject(kmlChildNode)
                        : this.createNodeFromKmlObject(kmlChildNode);

                    rootNode.appendChild(node);
                }
            }
            return rootNode;
        },

        /**
         * KMLをパースする
         * @param GEPlugin
         * @param string
         * @access public
         */
        parseKml: function (ge, str) {
            return ge.parseKml(str);
        }
    },

    fetchKmlFromUrl: function(ge, url) {
        var me = this;
        try {
            google.earth.fetchKml(ge, url, Ext.bind(function (kmlObject) {
                if(kmlObject)
                    me.fireEvent('fetchkml', ge, url, kmlObject);
                else
                    me.fireEvent('fetchkmlfailure', ge, url);
            }, me));
        } catch (e) {
            Ext.Msg.alert('Error', e);
        }
    },

    loadFiles: function(files) {
        var me = this;

        for(var i=0; i<files.length; i++) {
            if(files[i].name.match(/kml$/))
                me.loadKml(files[i]);
            else if(files[i].name.match(/kmz$/))
                me.loadKmz(files[i]);
        }
        me.fireEvent('fileloadcomplete', me);
    },

    loadKml: function(file) {
        var me     = this;
        var reader = new FileReader();

        reader.onloadend = function(evt) {
            var kml = evt.target.result;
            me.fireEvent('fileloadend', me, kml, evt);
        }

        reader.readAsBinaryString(file);
    },

    loadKmz: function(file) {
        var me     = this;
        var reader = new FileReader();

        reader.onloadend = function(evt) {
            var data = evt.target.result;
            var jsZip = new JSZip(data);

            Ext.each(jsZip.files, function(zip) {
                Ext.iterate(zip, function(name, kmlObject){
                    me.fireEvent('fileloadend', me, kmlObject.asText(), evt);
                });
            });
        }

        reader.readAsBinaryString(file);
    }
});
