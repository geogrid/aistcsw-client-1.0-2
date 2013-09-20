Ext.define('GECSW.store.Scenes', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.reader.Xml'],

    proxy: {
        type: 'ajax',
        url: 'response.xml',
        actionMethods: {read: 'POST'},
        reader: {
            type: 'xml',
            record: 'rim|RegistryPackage',
            root: 'csw\\:SearchResults'
        },
        headers: {
            'Content-Type': 'text/xml; charset=utf-8'
        }
    },
    'model': 'GECSW.model.scene.Model',
    'sorters': [{
      property: 'acquisitionDate',
      direction: 'DESC'
    }]
});
