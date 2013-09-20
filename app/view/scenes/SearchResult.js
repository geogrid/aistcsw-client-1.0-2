Ext.define('GECSW.view.scenes.SearchResult', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.scenessearchresult',

    requires: [
        'Ext.grid.column.Template'
    ],

    store : 'Scenes',

    hideHeaders: true,

    initComponent: function () {
        var me = this;
        var tpl = '<img src="' + myConfig.sceneImageUriTpl+ '" alt="{fileName}" width={image.width} height={image.height}/>'
        me.thumbnailImageTpl = new Ext.XTemplate(tpl);

        me.columns = [
           {
                header: 'Thumbnail',
                width: 64,
                align: 'center',
                renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    return me.thumbnailImageTpl.apply({
                        id: record.get('id'),
                        fileName: record.get('thumbnail'),
                        north: record.getNorth(),
                        south: record.getSouth(),
                        east: record.getEast(),
                        west: record.getWest(),
                        bBoxCoordinates: record.getBBoxCoordinates(),
                        service: myConfig.scene.icon.service,
                        request: myConfig.scene.icon.request,
                        crs: myConfig.scene.icon.crs,
                        transparent: myConfig.scene.icon.transparent,
                        format: myConfig.scene.icon.format,
                        version: myConfig.scene.icon.version,
                        image: myConfig.scene.icon.thumbnail
                    });
                }
            },
            {
                header: 'Data',
                flex: 1,
                dataIndex: 'acquisitionDate',
                renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    return Ext.String.format(
                        '{0}<br/>Path: {1}<br/>Row: {2}',
                        value,
                        record.get('path'),
                        record.get('row')
                    );
                }
            },
            {
                xtype:'actioncolumn',
                width:50,
                tdCls: 'my-scene-search-result',
                align: 'center',
                items: [{
                    icon: 'resources/images/download-16x16.png',
                    tooltip: 'Download',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        me.fireEvent('downloadclick', rec);
                    },
                    scope:me 
                }]
            }
        ];

        me.callParent(arguments);

        me.getStore().on({
            load: me.updateItemCountByStore,
            scope: me
        });
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
            '->',
            {
                xtype: 'tbtext',
                itemId: 'itemCount'
            }
        ]
    }],

    download: function(record) {
        location.href = myConfig.downloadScript + '/' + record.get('fileName');
    },

    displayPrepareDownloadFailureMessage: function() {
        var box = Ext.create('Ext.window.MessageBox')
        box.show({
            title: 'Error',
            icon: Ext.Msg.ERROR,
            msg: 'Download Error.<br/>Please Reload and try again..<br/>If same error occurs, contact administrator.',
            autoShow: true,
            buttons: Ext.Msg.YES
        });
    },

    updateItemCountByStore: function(store) {
        this.down('tbtext[itemId=itemCount]').setText(store.getCount() + ' scenes found.');
    }
});
