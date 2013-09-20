Ext.define('GECSW.controller.GoogleEarth', {
    extend: 'Ext.app.Controller',

    views: [
        'layers.Panel',
        'placemarks.Panel',
        'scenes.SearchForm',
        'scenes.SearchResult',
        'googleEarthOptions.Panel'
    ],

    refs: [{
        ref: 'GoogleEarthPanel',
        selector: 'googleearthpanel'
    }, {
        ref: 'GoogleEarthOptionsPanel',
        selector: 'googleearthoptionspanel'
    }, {
        ref: 'ScenesSearchResult',
        selector: 'scenessearchresult'
    }, {
        ref: 'PlacemarksPanel',
        selector: 'placemarkspanel'
    }, {
        ref: 'LayersPanel',
        selector: 'layerspanel'
    }],

    stores: [
        'GoogleEarthOptions',
        'Scenes'
    ],

    models: [
        'Layer'
    ],

    init: function () {
        var me = this;

        this.control({
            'scenessearchform checkbox[name=bbox-selection-mode]': {
                change: me.onSelectionBBoxEnabledChange
            },
            'scenessearchresult': {
                selectionchange: me.onSearchItemSelectionChange,
                deselect: me.onSearchItemDeselect,
                itemmouseenter: me.onSceneItemEnter,
                itemmouseleave: me.onSceneItemLeave
            },
            'layerspanel': {
                nodeinsert: me.onLayerNodeInsert,
                checkchange: me.onLayerCheckChange
            },
            'googleearthoptionspanel > checkbox': {
                change: me.onGoogleEarthOptionsPanelCheckboxChange
            },
            'placemarkspanel treepanel[itemId=kml-object-tree-panel]': {
                checkchange: me.onPlacemarkCheckChange,
                nodecheckchange: me.onPlacemarkNodeCheckChange
            }
        });
    },

    onGoogleEarthOptionsPanelCheckboxChange: function (checkbox, newValue, oldValue, eOpts) {
        this.getGoogleEarthPanel().setGoogleEarthOption(checkbox.getName(), newValue);
    },

    onLayerNodeInsert: function(panel, node, rootNode) {
        this.getGoogleEarthPanel().updateLayerVisibilityByNode(node);
    },

    onLayerCheckChange: function(node, checked, eOpts) {
        this.getGoogleEarthPanel().updateLayerVisibility(node, checked);
    },

    onPlacemarkCheckChange: function (node, checked, eOpts) {
        if(checked)
            this.getGoogleEarthPanel().flyToViewByKmlFeatureObject(node.get('kml'));
    },

    onPlacemarkNodeCheckChange: function (node, checked, eOpts) {
        node.get('kml').setVisibility(checked);
    },

    onSelectionBBoxEnabledChange: function (field) {
        this.getGoogleEarthPanel().setSelectionBBoxEnabled(field.getValue());
    },

    onSearchItemDeselect: function (gridview, record, eOpts) {
        this.getGoogleEarthPanel().hideSceneById(record.get('id'));;
    },

    onSearchItemSelectionChange: function (gridview, records, eOpts) {
        if(records.length > 0)
            this.getGoogleEarthPanel().showSceneById(records[0].get('id'));;
    },

    onSceneItemEnter: function (gridview, record, item, e, eOpts) {
        this.getGoogleEarthPanel().showSceneById(record.get('id'));;
    },

    onSceneItemLeave: function (gridview, record, item, e, eOpts) {
        if(!this.getScenesSearchResult().getSelectionModel().isSelected(record))
            this.getGoogleEarthPanel().hideSceneById(record.get('id'));;
    }
});
