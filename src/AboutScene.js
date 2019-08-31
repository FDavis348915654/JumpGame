/**
 * Created by Administrator on 2015/9/22.
 */

GameClient.AboutLayer = cc.Layer.extend({
    m_pWidget: null,
    m_isShowEgg: false,

    ctor: function () {
        this._super();
        var btnNode = null;
        var label = null;
        var strLabel = "";

        this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/AboutScene_1.json");
        this.addChild(this.m_pWidget);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnBack");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnBackCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnEasterEgg");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnEasterEggCallback.bind(this));
        }

        strLabel = GameClient.Common.Share().FormatStr(GameClient.Common.Share().GetString("aboutText"),
            GameClient.Common.Share().GetGameName(), GameClient.Common.Share().GetGameVersion());
        label = ccui.helper.seekWidgetByName(this.m_pWidget, "labelAboutDetail");
        label.string = strLabel;

        {
            var imgMyLogo = ccui.helper.seekWidgetByName(this.m_pWidget, "imgMyPic");

            if (imgMyLogo != null) {
                var delay_1 = cc.delayTime(0.3);
                var delay_2 = cc.delayTime(0.3);
                var scaleToBig_1 = cc.scaleTo(0.1, 1.2);
                var scaleToSmall_1 = cc.scaleTo(0.3, 1);
                var delay_3 = cc.delayTime(0.05);
                var scaleToBig_2 = cc.scaleTo(0.1, 1.2);
                var scaleToSmall_2 = cc.scaleTo(0.3, 1);
                var seq = cc.sequence(delay_1, scaleToBig_1, scaleToSmall_1, delay_3, scaleToBig_2, scaleToSmall_2, delay_2);
                var fore = seq.repeatForever();

                imgMyLogo.runAction(fore);
            }
        }

        this.scheduleUpdate();
    },

    onEnter: function () {
        this._super();

    },

    update: function (dt) {
        this._super(dt);

        if (this.m_isShowEgg) {
            var label = new cc.LabelTTF("Hello everyone!", "microsoft yahei", 24);
            var actionDeleteSelf = null;
            var moveToWM = null;
            var seqAction = null;

            label.setColor(cc.color(255, 100, 0));
            label.setPosition(GameClient.Common.Share().GetRandFloat(0 + 100, GameClient.SCREEN_WIDTH - 100), 0);
            this.addChild(label, 4);
            actionDeleteSelf = cc.callFunc(this.RemoveAndCleanSelfLabelTTFCallback, this);
            moveToWM = cc.moveTo(2, cc.p(GameClient.Common.Share().GetRandFloat(0 + 100, GameClient.SCREEN_WIDTH - 100),
                GameClient.Common.Share().GetRandFloat(GameClient.SCREEN_HEIGHT - 100, GameClient.SCREEN_HEIGHT - 50)));
            seqAction = cc.sequence(moveToWM, actionDeleteSelf);
            label.runAction(seqAction);
        }
    },

    BtnBackCallback: function (btnNode) {
        GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
    },

    BtnEasterEggCallback: function (btnNode) {
        this.m_isShowEgg = !this.m_isShowEgg;
    },

    RemoveAndCleanSelfLabelTTFCallback: function (pSender) {
        pSender.removeFromParent(true);
    }
});

GameClient.AboutScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.AboutLayer();
        this.addChild(layer, 5);
    }
});