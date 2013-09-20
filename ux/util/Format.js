Ext.define('Ext.ux.util.Format', {
    statics: {
        capitalize : function(string) {
            var words = string.split(/[ _-]+/g);
            var result = words[0];
            for (var i = 1; i < words.length; i++) {
                result += words[i].charAt(0).toUpperCase() + words[i].substr(1);
            }
            return result;
        },

        uncapitalize : function(string, delim) {
            if (delim === undefined) delim = ' ';
        
            return string.replace(/([A-Z])/g, "_____$1").split('_____').join(delim).toLowerCase();
        }
    }
});
