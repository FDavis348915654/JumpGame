/**
 * Created by Administrator on 2015/9/21.
 */

GameClient.LogoLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var colorLayer = null;
        var sprite = null;
        var fadeIn = null;

        colorLayer = new cc.LayerColor(cc.color(255, 255, 255),
            cc.winSize.width, cc.winSize.height);
        this.addChild(colorLayer);

        sprite = new cc.Sprite("res/img/mylogo.png");
        this.addChild(sprite);
        sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        sprite.setOpacity(0);
        sprite.setScale(3.0);

        fadeIn = cc.fadeIn(0.8);
        sprite.runAction(fadeIn);

        GameClient.Common.Share().LoadSoundSignFromFile();
    },

    onEnter: function () {
        this._super();
        GameClient.Common.Share().InitAd();
//        GameClient.Common.Share().CloseAd();
        GameClient.Common.Share().ShowAd(GameClient.SHOW_AD_TIME);

        GameClient.Common.Share().DataCountInit();

//        GameClient.Common.Share().DataCountOnEvent(["hello",
//            {"hi": "hello world", "date": GameClient.Common.Share().GetNowTimeStr()}]);

        this.schedule(this.ChangeScene.bind(this), 2, 0);
    },

    ChangeScene: function (dt) {
        var bSign = false;

        if (GameClient.Common.Share().GetGamePackageName() == GameClient.PACKAGE_NAME) {
            bSign = true;
        }

        if (bSign) {
            GameClient.Common.Share().ChangeScene(new GameClient.MainMenuScene(), 0.5);
        }
        else {
            GameClient.Common.Share().QuitGame();
            return;
        }
    }
});

GameClient.LogoScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.LogoLayer();
        this.addChild(layer, 5);
    }
});