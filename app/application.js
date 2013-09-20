Ext.define('GECSW.Application', {
    name: 'GECSW',

    extend: 'Ext.app.Application',

    views: [
        'scenes.SearchForm',
        'scenes.SearchResult',
        'placemarks.Panel',
        'layers.Panel',
        'googleEarthOptions.Panel',
        'googleEarth.Panel',
        'googleEarth.selection.BBox',
        'googleEarth.scene.DataView'
    ],

    refs: [{
        ref: 'viewport',
        selector: 'gecswviewport'
    }],


    controllers: [
        'Scenes',
        'Placemarks',
        'Layers',
        'GoogleEarthOptions',
        'GoogleEarth'
    ],

    models: [
        'Placemark',
        'Layer',
        'scene.Model'
    ],

    stores: [
        'GoogleEarthOptions',
        'Scenes'
    ],

    requires: [
        'Ext.data.reader.Xml',
        'GECSW.helper.ErrorHelper',

        'Ext.grid.column.Action',
        'overrides.data.Store',
        'overrides.tree.Panel',
        'Ext.ux.view.HtmlPage',
        'Ext.ux.util.Format',
        'Ext.ux.data.proxy.Ajax'
    ]
});
