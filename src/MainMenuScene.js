/**
 * Created by Administrator on 2015/9/21.
 */

GameClient.MainMenuLayer = cc.Layer.extend({
    m_pWidget: null,

    ctor: function () {
        this._super();
        var btnNode = null;
        var imgNode = null;
        var moveDown = null;
        var moveUp = null;
        var delayTime = null;
        var sequene = null;
        var repeat = null;

        GameClient.GameData.Share().m_isWillStartGame = false;

        this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/MainMenuScene_1.json");
        this.addChild(this.m_pWidget);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnStart");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnStartCallback.bind(this));
        }
        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnUpgrade");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnUpgradeCallback.bind(this));
        }
        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnSetting");
        if (btnNode != null) {
            btnNode.addClickEventListener(this.BtnSettingCallback.bind(this));
        }

        imgNode = ccui.helper.seekWidgetByName(this.m_pWidget, "imgFire");
        moveDown = cc.moveBy(3, cc.p(0, -15));
        moveUp = cc.moveBy(3, cc.p(0, 15));
        delayTime = cc.delayTime(1.6);
        sequene = cc.sequence(delayTime, moveDown, moveUp);
        repeat = sequene.repeatForever();
        imgNode.runAction(repeat);

        GameClient.Common.Share().LoadGameCountDataFromFile();
        this.SetLabelTextNum(GameClient.GameData.Share().m_highScore, GameClient.LABEL_HEIGSCORE_NUM);
        this.SetLabelTextNum(GameClient.GameData.Share().m_superHighScore, GameClient.LABEL_SUPERHEIGSCORE_NUM);

        this.SetLabelTextNum(GameClient.GameData.Share().m_highLevel, GameClient.LABEL_HEIGLEVEL_NUM);
        this.SetLabelTextNum(GameClient.GameData.Share().m_superHighLevel, GameClient.LABEL_SUPERHEIGLEVEL_NUM);

        this.SetLabelTextNum(GameClient.GameData.Share().m_level, GameClient.LABEL_LEVEL_NUM);

        if (GameClient.GameData.Share().m_gameMode == GameClient.GAME_MODE.GAME_MODE_SINGLE) {
            this.SetImgTexture(GameClient.MATCH_NORMAL_PATH, GameClient.IMG_MODE_NAME);
        }
        else {
            this.SetImgTexture(GameClient.MATCH_SUPERL_PATH, GameClient.IMG_MODE_NAME);
        }

        {
            var displayNode = null;

            ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kid/KidAnimation.ExportJson");
            displayNode = new ccs.Armature("KidAnimation");
            this.addChild(displayNode, 2);
            displayNode.getAnimation().play("stand", -1, -1);
            displayNode.setPosition(GameClient.SCREEN_WIDTH / 2, 600 + 30);
            displayNode.setScale(3);
        }
    },

    onEnter: function () {
        this._super();
        console.log("hel" + "lo, welc" + "ome, my name is WM, QQ is 3489" + "15654."); // 348915654
    },

    onExit: function () {
        GameClient.Common.Share().CloseAd();
        this._super();
    },

    // cocos 自带返回按钮响应，现已废弃
//    keyBackClicked: function () {
//
//    },

    SetLabelTextNum: function (num, labelName) {
        if (this.m_pWidget == null) {
            return;
        }
        this.SetLabelText("" + num, labelName);
    },
    
    SetLabelText: function (str, labelName) {
        if (this.m_pWidget == null) {
            return;
        }
        var label = ccui.helper.seekWidgetByName(this.m_pWidget, labelName);

        label.string = str;
    },
    
    SetImgTexture: function (filePath, imgName) { // imgName is widget name
        if (this.m_pWidget == null) {
            return;
        }

        var img = ccui.helper.seekWidgetByName(this.m_pWidget, imgName);
        var alpha = img.getOpacity();
        var color = img.getColor();
        var scale = img.getScale();

        img.loadTexture(filePath, ccui.Widget.LOCAL_TEXTURE);
        img.setColor(color);
        img.setOpacity(alpha);
        img.setScale(scale);
    },

    BtnStartCallback: function (btnNode) {
        GameClient.GameData.Share().m_gameMode = GameClient.GAME_MODE.GAME_MODE_SINGLE;
        GameClient.Common.Share().ChangeScene(new GameClient.PlayGameScene(), GameClient.CHANGE_SCENE_TIME);
    },

    BtnUpgradeCallback: function (btnNode) {
        GameClient.GameData.Share().m_gameMode = GameClient.GAME_MODE.GAME_MODE_DOUBLE;
        GameClient.GameData.Share().m_isWillStartGame = true;
        if (GameClient.Common.Share().IsFirstGame()) {
            GameClient.Common.Share().ChangeScene(new GameClient.TutorialScene(), GameClient.CHANGE_SCENE_TIME);
        }
        else {
            GameClient.Common.Share().ChangeScene(new GameClient.PlayGameScene(), GameClient.CHANGE_SCENE_TIME);
        }
    },

    BtnSettingCallback: function (btnNode) {
        GameClient.Common.Share().ChangeScene(new GameClient.SettingScene(), GameClient.CHANGE_SCENE_TIME);
    }
});

GameClient.MainMenuScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.MainMenuLayer();
        this.addChild(layer, 5);
    }
});