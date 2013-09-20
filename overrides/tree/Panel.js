Ext.define('overrides.tree.Panel', {
    requires: 'Ext.tree.Panel'
}, function() {
    Ext.override(Ext.tree.Panel, {
    
        /**
         * Rootノードに新しいノードを追加
         * @param GECSW.model.Layer
         * @access public
         */
        appendToRootNode: function(node, expand) {
            var rootNode = this.getRootNode();
            rootNode.appendChild(node);
            this.fireEvent('nodeinsert', this, node, rootNode);

            if(expand) {
                rootNode.cascadeBy(function(n) {
                    if(n.get('checked'))
                        n.expand();
                });
            }
        },

        /**
         * 親ノードのチェック状態を子孫ノードに反映する
         */
        cascadeCheckChange: function(node, checked, expand) {
            var me = this;

            if (checked)
                me.fireEvent('nodecheckchange', node, checked);

            if (checked && expand)
                node.expand(true);

            node.cascadeBy(function (n) {
                n.set('checked', checked);
                me.fireEvent('nodecheckchange', n, checked);
            });
        }
    });
});
