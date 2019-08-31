/**
 * Created by Administrator on 2015/9/22.
 */

GameClient.TutorialLayer = cc.Layer.extend({
    m_pWidget: null,

    ctor: function () {
        this._super();
        var btnNode = null;

        this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/TutorialScene_1.json");
        this.addChild(this.m_pWidget);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnBack");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnBackCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnNotJump");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnNotJumpCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnLeftRight");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnLeftRightCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnP1P2");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnP1P2Callback.bind(this));
        }
    },

    BtnBackCallback: function (btnNode) {
        if (GameClient.GameData.Share().m_isWillStartGame) {
            GameClient.Common.Share().ChangeScene(new GameClient.MainMenuScene(), GameClient.CHANGE_SCENE_TIME);
        }
        else {
            GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
        }
    },

    BtnNotJumpCallback: function (btnNode) {
        GameClient.Common.Share().SaveControlMode(GameClient.GAME_CONTROL_MODE.GAME_CONTROL_NOTJUMP);
        if (GameClient.Common.Share().IsFirstGame()) {
            GameClient.Common.Share().SetHaveFirstGameSign();
        }
        if (GameClient.GameData.Share().m_isWillStartGame) {
            GameClient.Common.Share().ChangeScene(new GameClient.PlayGameScene(), GameClient.CHANGE_SCENE_TIME);
        }
        else {
            GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
        }
    },

    BtnLeftRightCallback: function (btnNode) {
        GameClient.Common.Share().SaveControlMode(GameClient.GAME_CONTROL_MODE.GAME_CONTROL_LEFTRIGHT);
        if (GameClient.Common.Share().IsFirstGame()) {
            GameClient.Common.Share().SetHaveFirstGameSign();
        }
        if (GameClient.GameData.Share().m_isWillStartGame) {
            GameClient.Common.Share().ChangeScene(new GameClient.PlayGameScene(), GameClient.CHANGE_SCENE_TIME);
        }
        else {
            GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
        }
    },

    BtnP1P2Callback: function (btnNode) {
        GameClient.Common.Share().SaveControlMode(GameClient.GAME_CONTROL_MODE.GAME_CONTROL_P1P2);
        if (GameClient.Common.Share().IsFirstGame()) {
            GameClient.Common.Share().SetHaveFirstGameSign();
        }
        if (GameClient.GameData.Share().m_isWillStartGame) {
            GameClient.Common.Share().ChangeScene(new GameClient.PlayGameScene(), GameClient.CHANGE_SCENE_TIME);
        }
        else {
            GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
        }
    }
});

GameClient.TutorialScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.TutorialLayer();
        this.addChild(layer, 5);
    }
});