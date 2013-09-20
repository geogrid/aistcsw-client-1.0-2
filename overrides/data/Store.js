Ext.define('overrides.data.Store', {
    requires: 'Ext.data.Store'
}, function() {
    Ext.override(Ext.data.Store, {
        loadRawData : function(data, append) {
            var me      = this,
                result  = me.proxy.reader.read(data),
                records = result.records;
    
            if (result.success) {
                me.totalCount = result.total;
                me.loadRecords(records, append ? me.addRecordsOptions : undefined);
                me.fireEvent('load', me, records, true);
            }
        }
    
    });
});
