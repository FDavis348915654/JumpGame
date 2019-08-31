/**
 * Created by Administrator on 2015/9/22.
 */

GameClient.SettingLayer = cc.Layer.extend({
    m_pWidget: null,

    ctor: function () {
        this._super();
        var btnNode = null;

        this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/SettingScene_1.json");
        this.addChild(this.m_pWidget);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnBack");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnBackCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnAbout");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnAboutCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnSound");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnSoundCallback.bind(this));
        }

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnControl");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnControlCallback.bind(this));
        }

        this.SetSoundPicBySoundSign();

        {
            var displayNode = null;

            btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnBack");
            ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kid/KidAnimation.ExportJson");
            displayNode = new ccs.Armature("KidAnimation");
            this.addChild(displayNode, 10);
            displayNode.getAnimation().play("stand", -1, -1);
            displayNode.setPosition(btnNode.x, btnNode.y + btnNode.getBoundingBox().height / 2 + 18);
            displayNode.setScale(2);
        }
    },

    BtnBackCallback: function (btnNode) {
        GameClient.Common.Share().ChangeScene(new GameClient.MainMenuScene(), GameClient.CHANGE_SCENE_TIME);
    },

    BtnAboutCallback: function (btnNode) {
        GameClient.Common.Share().ChangeScene(new GameClient.AboutScene(), GameClient.CHANGE_SCENE_TIME);
    },

    BtnSoundCallback: function (btnNode) {
        GameClient.GameData.Share().m_bSound = !GameClient.GameData.Share().m_bSound;
        this.SetSoundPicBySoundSign();
        GameClient.Common.Share().SaveSoundSignToFile(GameClient.GameData.Share().m_bSound);
    },

    BtnControlCallback: function (btnNode) {
//        GameClient.GameData.Share().m_isWillStartGame = false;
        GameClient.Common.Share().ChangeScene(new GameClient.TutorialScene(), GameClient.CHANGE_SCENE_TIME);
    },

    SetSoundPicBySoundSign: function () {
        var btnNode = null;

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnSound");
        if (GameClient.GameData.Share().m_bSound) {
            btnNode.loadTextureNormal("res/img/btn_sound_n_on.png", this._normalTexType);
        }
        else {
            btnNode.loadTextureNormal("res/img/btn_sound_n_off.png", this._normalTexType);
        }
    }
});

GameClient.SettingScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.SettingLayer();
        this.addChild(layer, 5);
    }
});