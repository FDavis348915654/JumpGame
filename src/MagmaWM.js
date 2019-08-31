/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.MagmaWM = GameClient.ObjectWM.extend({
    m_beginY: 0,
    m_spriteFireLight: null, // cc.Sprite

    // @override
    ctor: function (boss, typeId) {
        this._super(boss, typeId);

        this.LoadMagmaDataFromFile();
        this.m_sprite = new cc.Sprite("res/img/fire.png");
        this.m_pBoss.addChild(this.m_sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_MAGMA);
        this.m_sprite.setAnchorPoint(cc.p(0.5, 1));
        this.m_posGlobal.x = GameClient.SCREEN_WIDTH / 2;
        this.m_posGlobal.y = this.m_beginY;

        this.m_spriteFireLight = new cc.Sprite("res/img/fire_light.png");
        this.m_pBoss.addChild(this.m_spriteFireLight, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_MAGMA);
        this.m_spriteFireLight.setAnchorPoint(cc.p(0.5, 0));

        { // make relative x y temp
            var x = 0;
            var y = 0;

            x = this.m_pBoss.GetRelativeX(this.m_posGlobal.x);
            y = this.m_pBoss.GetRelativeY(this.m_posGlobal.y);
            this.m_sprite.setPosition(cc.p(x, y));
            this.m_spriteFireLight.setPosition(cc.p(x, y));
        }
    },

    // @override
    Destroy: function () {
        this.m_spriteFireLight = null;
        this._super();
    },

    // @override
//    MyInit: function (typeId) {
//
//    },

    // @override
//    MyDestroy: function () {
//
//    },

    // @override
    UpdateWM: function (dt) {
        if (this.m_pBoss.GetCameraPos().y > this.m_posGlobal.y) {
            this.m_posGlobal.y += (this.m_vY * 1.0 * GameClient.GameData.Share().m_fpsRatio);
        }
        else {
            this.m_posGlobal.y += (this.m_vY * GameClient.GameData.Share().m_fpsRatio);
        }

        if (this.m_sprite != null && this.m_spriteFireLight != null) {
            var x = 0;
            var y = 0;

            x = this.m_pBoss.GetRelativeX(this.m_posGlobal.x);
            y = this.m_pBoss.GetRelativeY(this.m_posGlobal.y);
            this.m_sprite.setPosition(cc.p(x, y));
            this.m_spriteFireLight.setPosition(cc.p(x, y));
        }
    },
    
    LoadMagmaDataFromFile: function () {
        this.m_vY = GameClient.MAGMA_BASIC_V;
        this.m_beginY = -200;
    }
});

//GameClient.MagmaWM.CreateWM = function (boss, typeId) {
//    var objectWM = new GameClient.MagmaWM();
//
//    objectWM.m_pBoss = boss;
//    objectWM.MyInit(typeId);
//    return objectWM;
//};