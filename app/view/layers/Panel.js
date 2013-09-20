Ext.define('GECSW.view.layers.Panel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.layerspanel',

    title: 'Layers',

    rootVisible: true,

    initComponent: function() {
        this.root = {
            text: 'Layers',
            iconCls: 'folder',
            expanded: true
        };

        this.callParent(arguments);
    }
});
