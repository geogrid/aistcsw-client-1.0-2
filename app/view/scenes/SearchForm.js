Ext.define('GECSW.view.scenes.SearchForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.scenessearchform',

    requires: [
        'Ext.form.*'
    ],

    bodyStyle: {
        padding: '3px'
    },

    buttonAlign: 'right',

    defaults: {
        msgTarget: 'under'
    },

    initComponent: function () {
        this.items = [
            {
                xtype: 'datefield',
                fieldLabel: 'Begin Position',
                name: 'beginPosition',
                format: 'Y-m-d',
                value: '2013-05-30',
                allowBlank: false
            },
            {
                xtype: 'datefield',
                fieldLabel: 'End Position',
                name: 'endPosition',
                format: 'Y-m-d',
                value: Ext.util.Format.date(new Date(), 'Y-m-d'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Cloud Cover',
                name: 'cloudCoverPercentage',
                maxValue: 100,
                minValue: 0,
                value: 80,
                allowBlank: false
            },
            {
                xtype: 'checkboxgroup',
                columns: 1,
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                vertical: true,
                labelPad: 0,
                items: [{
                    xtype: 'checkbox',
                    boxLabel: 'BBox',
                    name: 'bbox-selection-mode'
                }]
            },
            {
                xtype: 'hidden',
                name: 'lng1',
                value: null
            },
            {
                xtype: 'hidden',
                name: 'lat1',
                value: null
            },
            {
                xtype: 'hidden',
                name: 'lng2',
                value: null
            },
            {
                xtype: 'hidden',
                name: 'lat2',
                value: null
            }
        ];

        this.buttons = [
            {
                text: 'Search',
                name: 'search'
            }
        ];

        this.callParent(arguments);
    },

    /**
     * 検索条件のエラーを表示
     */
    displaySearchConditionAlert: function(errors) {
        ErrorHelper.displayAlertForErrors('Search condition error.', errors);
    },

    markInvalid: function(errors) {
        var me = this;
        me.getForm().markInvalid(errors);

        Ext.each(errors.getByField('lng1'), function(error){
            me.down('checkboxgroup').markInvalid(error.message);
        });
    },

    /**
     * このform用のmodelを返す
     */
    getFormModel: function() {
        return Ext.create('GECSW.model.scene.Model', this.getValues());
    }
});
