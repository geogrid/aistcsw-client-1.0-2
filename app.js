/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
//
Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'GECSW',

    extend: 'GECSW.Application',

    autoCreateViewport: true,

    paths: {
        'Ext.ux' : 'ux'
    },

    requires: [
        'Ext.grid.column.Action',
        'overrides.data.Store',
        'overrides.tree.Panel',
        'Ext.ux.view.HtmlPage',
        'Ext.ux.util.Format',
        'Ext.ux.data.proxy.Ajax',
        'Ext.ux.upload.BrowseButton'
    ]
});
