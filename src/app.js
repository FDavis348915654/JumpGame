
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 0);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38); // "microsoft yahei"
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 1);

        // add "HelloWorld" splash screen"
//        this.sprite = new cc.Sprite(res.HelloWorld_png);
//        this.sprite.attr({
//            x: size.width / 2,
//            y: size.height / 2,
//            scale: 0.5,
//            rotation: 180
//        });
//        this.addChild(this.sprite, 0);
//
//        this.sprite.runAction(
//            cc.sequence(
//                cc.rotateTo(2, 0),
//                cc.scaleTo(2, 1, 1)
//            )
//        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );

        this.TestFunc();

        return true;
    },

    TestFunc: function () {
        { // 载入动画测试
            var displayNode = null;

            ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kid/KidAnimation.ExportJson");
            displayNode = new ccs.Armature("KidAnimation");
            displayNode.getAnimation().play("stand", -1, -1);
            this.addChild(displayNode, 2);
            displayNode.setPosition(cc.winSize.width / 2 - 150, cc.winSize.height / 2 - 200);
        }

        { // 载入场景测试
            var btnNode = null;
            var json = ccs.load("res/MainMenuScene_1.json"); // 载入 ui

            if (json == null) {
                return null;
            }
            var node = json.node;

            this.addChild(node, 1);
//            btnNode = ccui.helper.seekWidgetByName(node, "btnStart");
//            btnNode.setVisible(false);
        }

        {
            this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/MainMenuScene_1.json");
            this.addChild(this.m_pWidget);

            btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnStart");
            if (btnNode != null) {
                btnNode.addClickEventListener(this.BtnStartCallback.bind(this));
            }
        }

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

