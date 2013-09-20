Ext.define('GECSW.view.googleEarthOptions.Panel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.googleearthoptionspanel',

    title: 'Options',

    /**
     * Google Earthのオプション用のデータストア
     */
    store: null,

    initComponent: function() {
        this.store = Ext.StoreMgr.lookup('GoogleEarthOptions');
        this.buildContents();

        this.callParent(arguments);
    },

    buildContents: function() {
        var me = this;

        me.items = [];

        addItem = function(rec) {
            var field = Ext.create('Ext.form.field.Checkbox', {
                id: 'option-' + Ext.ux.util.Format.uncapitalize(rec.get('name'), '-'),
                name: rec.get('name'),
                boxLabel: rec.get('label'),
                checked: rec.get('value')
            });
            me.items.push(field);
        };

        me.store.each(addItem);
    }
});
