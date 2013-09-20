Ext.define('GECSW.store.GoogleEarthOptions', {
    extend: 'Ext.data.Store',
    fields: ['name', 'value', 'label'],
    data: [{
        name: 'setStatusBarVisibility',
        value: false,
        label: 'Status Bar',
        type: 'boolean'
    }, {
        name: 'setGridVisibility',
        value: false,
        label: 'Grid',
        type: 'boolean'
    }, {
        name: 'setOverviewMapVisibility',
        value: false,
        label: 'Overview Map',
        type: 'boolean'
    }, {
        name: 'setScaleLegendVisibility',
        value: false,
        label: 'Scale Legend',
        type: 'boolean'
    }, {
        name: 'setAtmosphereVisibility',
        value: true,
        label: 'Atmosphere',
        type: 'boolean'
    }]
});