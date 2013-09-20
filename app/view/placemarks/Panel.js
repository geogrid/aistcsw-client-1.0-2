Ext.define('GECSW.view.placemarks.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.placemarkspanel',

    title: 'KML',

    layout: 'card',

    defaults: {
        border: false,
        frame: false
    },

    initComponent: function () {
        var me         = this;
        var uploadForm = me.createUploadFormPanel();

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            items: [{
                text: 'Load KML/KMZ',
                menu: {
                    items: me.createMenuItems()
                }
            }]
        });

        me.items = [{
            xtype: 'treepanel',
            itemId: 'kml-object-tree-panel',
            rootVisible: true,
            root: {
                text: 'KML Documents',
                iconCls: 'folder',
                expanded: true
            }
        }, {
            xtype: 'form',
            itemId: 'url-form-panel',
            autoHeight: true,
            frame: false,
            border: false,
            padding: 5,
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textarea',
                fieldLabel: 'URL',
                name: 'url',
                value: 'http://code.google.com/apis/kml/documentation/KML_Samples.kml',
                width: '100%',
                height: 96
            }],
            buttons: [{
                text: 'Cancel',
                handler: me.onCancelButtonClick,
                scope: me
            },{
                text: 'Load',
                itemId: 'kml-url-load-button',
                scope: me
            }]
        }, uploadForm];

        this.callParent(arguments);
        
        this.addEvents('nodecheckchange');
    },

    createUploadFormPanel: function() {
        var me       = this;
        var dh       = Ext.DomHelper;
        var dropZone = new Ext.dom.Element(dh.createDom({
            tag: 'div',
            id: Ext.id(),
            cls: 'my-dropzone',
            style: 'height:200px;width:100%;padding:5px;',
            html : 'Drop your kml file(s).'
        }));

        var uploadForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            itemId: 'file-form-panel',
            autoHeight: true,
            frame: false,
            border: false,
            padding: 5,
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                contentEl: dropZone
            }],
            buttons: [{
                text: 'Cancel',
                handler: me.onCancelButtonClick,
                scope: me
            }]
        });

        dropZone.on({
            dragover: function(e, t, eOpts) {
                e.stopPropagation();
                e.preventDefault();
                e.browserEvent.dataTransfer.dropEffect = 'copy'; 
            },
            drop: function(e, t, eOpts) {
                e.stopPropagation();
                e.preventDefault();
                uploadForm.fireEvent('filedrop', me, e.browserEvent.dataTransfer.files);
            }
        });

        return uploadForm;
    },

    createMenuItems: function() {
        var me = this;
        var items = [{
            text: 'Load From URL',
            handler: Ext.bind(me.onLoadFromUrlMenuClick, me)
        }];

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            items.push({
                text: 'Load From Local File',
                handler: Ext.bind(me.onLoadFromLocalFileMenuClick, me)
            });
        }

        return items;
    },

    displayFetchFailureMessage: function(ge, url) {
        Ext.Msg.alert('error', 'Failed to fetch kml.');
    },

    getTree: function() {
        return this.getComponent('kml-object-tree-panel');
    },

    onCancelButtonClick: function(button) {
        this.getLayout().setActiveItem('kml-object-tree-panel');
    },

    onLoadButtonClick: function(button) {
        this.getLayout().setActiveItem('kml-object-tree-panel');
    },

    onLoadFromUrlMenuClick: function() {
        this.getLayout().setActiveItem('url-form-panel');
    },

    onLoadFromLocalFileMenuClick: function() {
        this.getLayout().setActiveItem('file-form-panel');
    }
});
