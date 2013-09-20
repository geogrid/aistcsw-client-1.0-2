Ext.define('GECSW.model.Layer', {
    extend: 'Ext.data.TreeModel',
    fields: [
        'id',
        'text',
        'kml',
        'ckecked'
    ],
    statics: {
        /**
         * KmlLayerのインスタンスからGESCW.model.Layerのインスタンスを生成する
         * @param kmlLayer KmlLayerのインスタンス
         * @returns {*}
         */
        createNodeFromKmlLayer: function (kmlLayer) {
            var haystack = ['KmlLayer', 'KmlNetworkLink'];
            return record = Ext.create('GECSW.model.Layer', {
                id: kmlLayer.getId(),
                text: kmlLayer.getName(),
                checked: this.getVisibilityFromKmlLayer(kmlLayer),
                kml: kmlLayer,
                leaf: (Ext.Array.indexOf(haystack, kmlLayer.getType()) != -1 ? true : false)
            });
        },

        /**
         * KmlLayerのインスタンスからGECSW.model.Layerのインスタンスを生成する。
         * また、このインスタンスは子ノードも含む。
         * @param kmlLayer KmlLayerのインスタンス
         * @returns {*}
         */
        createTreeNodeFromKmlLayerRoot: function (kmlLayer) {
            var rootNode = this.createNodeFromKmlLayer(kmlLayer);
            if (kmlLayer.getFeatures().hasChildNodes()) {
                var childNodes = kmlLayer.getFeatures().getChildNodes();
                for (var i = 0; i < childNodes.getLength(); i++) {
                    var childNode = childNodes.item(i);
                    switch (childNode.getType()) {
                        case 'KmlFolder':
                        case 'KmlDocument':
                            rootNode.appendChild(this.createTreeNodeFromKmlLayerRoot(childNode));
                            break;
                        case 'KmlNetworkLink':
                        case 'KmlLayer':
                            rootNode.appendChild(this.createNodeFromKmlLayer(childNode));
                            break;
                    }
                }
            }
            return rootNode;
        },

        getVisibilityFromKmlLayer: function(kmlLayer) {
            if(kmlLayer.getName() == 'AIST') {
                return true;
            }

            return kmlLayer.getVisibility();
        }
    }
});
