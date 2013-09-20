Ext.define('GECSW.view.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.gecswviewport',
    requires: [
        'Ext.layout.container.*',
        'GECSW.view.help.Panel'
    ],

    layout: {
        type: 'border'
    },

    items: [
        {
            region: 'west',
            layout: 'accordion',
            split: true,
            width: 320,
            titleCollapse: false,
            animate: true,
            activeOnTop: true,
            items: [
                {
                    xtype: 'panel',
                    title: 'Search',
                    autoHeight: true,
                    layout: 'border',
                    items: [
                        {
                            xtype: 'scenessearchform',
                            region: 'north',
                            border: false,
                            frame: false,
                            autoHeight: true
                        },
                        {
                            xtype: 'scenessearchresult',
                            region: 'center',
                            border: false,
                            layout: 'fit'
                        }
                    ]
                },
                {
                    xtype: 'placemarkspanel'
                },
                {
                    xtype: 'layerspanel'
                },
                {
                    xtype: 'googleearthoptionspanel',
                    bodyStyle: {
                        padding: '12px'
                    }
                },
                {
                    xtype: 'helppanel',
                    bodyStyle: {
                        padding: '12px'
                    }
                }
            ]
        },
        {
            region: 'center',
            xtype: 'googleearthpanel'
        }
    ]
})
;
