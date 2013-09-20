Ext.define('Ext.ux.view.HtmlPage', {

    extend: 'Ext.Panel',

    xtype: 'htmlpage',

    /**
     * @var boolean showイベントが発生した際に、自動的に読み込むフラグ
     */
    autoLoad: false,

    /**
     * @var boolean
     */
    autoScroll: true,

    /**
     * ロードするHTMLファイルのURL
     * 他ドメインから読み込む際はCORSを考慮すること
     * @var strint
     */
    url: null,

    listeners: {
        afterrender: {
            fn: function (cmp) {
                cmp.loadHtml();
            }
        },
        scope: this
    },

    /**
     * HTMLをロードする
     */
    loadHtml: function () {
        Ext.Ajax.request({
            url: this.url,
            success: function (rs) {
                this.update(rs.responseText);
            },
            scope: this
        });
    },

    /**
     * このPanelがロードされた際のハンドラ
     * @param container
     * @param eOpts
     */
    onAfterRendered: function (container, eOpts) {
       if (this.autoload)
            this.loadHtml();
    }
});
