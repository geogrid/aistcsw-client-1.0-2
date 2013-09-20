Ext.define('GECSW.helper.ErrorHelper', {
    statics: {
        /**
         * @param Ext.data.Errors
         */
        displayAlertForErrors: function (title, errors) {
            var message = '';
            Ext.each(errors.items, function (rec, i) {
                message += rec.message + "<br>";
            });
            Ext.Msg.alert(title, message);
        }
    }
});

ErrorHelper = GECSW.helper.ErrorHelper;
