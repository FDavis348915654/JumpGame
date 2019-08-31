/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.BlockWM = GameClient.ObjectWM.extend({
    m_standKidMap: null, // Dic<KidWM, KidWM>
    m_standKidOffsetXMap: null, // Dic<KidWM, Number>
    m_moveSign: false,
    m_moveVX: 0,

    // @override
    ctor: function (boss, typeId) {
        this._super(boss, typeId);

        this.m_moveSign = false;
        this.m_moveVX = 1;
        this.m_standKidMap = {};
        this.m_standKidOffsetXMap = {};

        this.m_sprite = new cc.Sprite(GameClient.GAME_BLOCK_PATH);
        this.m_pBoss.m_blockBatchNode.addChild(this.m_sprite);
        this.SetBlockWidthScale(1.8);
    },

    // @override
    Destroy: function () {
        this.m_standKidMap = null;
        this.m_standKidOffsetXMap = null;
        if (this.m_sprite != null) {
            this.m_sprite.removeFromParent(true);
            this.m_sprite = null;
        }

        this._super();
    },

//    MyInit: function (typeId) {
//        this.m_moveSign = false;
//        this.m_moveVX = 1;
//        this.m_standKidMap = {};
//        this.m_standKidOffsetXMap = {};
//
//        this.m_sprite = new cc.Sprite(GameClient.GAME_BLOCK_PATH);
//        this.m_pBoss.m_blockBatchNode.addChild(this.m_sprite);
//        this.SetBlockWidthScale(1.8);
//    },

//    MyDestroy: function () {
//        this.m_standKidMap = null;
//        this.m_standKidOffsetXMap = null;
//        if (this.m_sprite != null) {
//            this.m_sprite.removeFromParent(true);
//            this.m_sprite = null;
//        }
//    },

    UpdateWM: function (dt) {
        if (this.m_moveSign) {
            this.m_posGlobal.x += (this.m_moveVX * GameClient.GameData.Share().m_fpsRatio);
            if (this.m_moveVX > 0 && this.m_posGlobal.x + this.m_bodyRect.width / 2 >= GameClient.SCREEN_WIDTH) {
                this.m_moveVX *= -1.0;
                this.m_posGlobal.x = GameClient.SCREEN_WIDTH - this.m_bodyRect.width / 2;
            }
            else if (this.m_moveVX < 0 && this.m_posGlobal.x - this.m_bodyRect.width / 2 <= 0) {
                this.m_moveVX *= -1.0;
                this.m_posGlobal.x = this.m_bodyRect.width / 2;
            }
        }
        if (this.m_sprite != null) {
            var x = 0;
            var y = 0;

            x = this.m_pBoss.GetRelativeX(this.m_posGlobal.x);
            y = this.m_pBoss.GetRelativeY(this.m_posGlobal.y);
            this.m_sprite.setPosition(cc.p(x, y));
        }

        //...
        var offsetX = 0;
        var kid = null;

        for (var key in this.m_standKidMap) {
            kid = this.m_standKidMap[key];
            if (!kid.IsWillDelete()) {
                if (kid.m_beginJudgeAir > 0) {
                    offsetX = this.m_standKidOffsetXMap[kid];
                    if (offsetX != null) {
                        kid.m_posGlobal.x = this.m_posGlobal.x + offsetX;
                    }
                }
            }
            else {
                delete this.m_standKidMap[kid];
                delete this.m_standKidOffsetXMap[kid];
            }
        }
    },

    SetStandKid: function (kid) {
        if (kid == null) {
            return;
        }

        if (this.m_standKidMap[kid] == null) {
            this.m_standKidMap[kid] = kid;
        }
        kid.SetStandBlock(this);
        this.SetStandKidOffsetX(kid, kid.m_posGlobal.x - this.m_posGlobal.x);
    },

    RemoveKid: function (kid) {
        delete this.m_standKidMap[kid]
    },

    GetStandKidOffsetX: function (kid) {
        if (this.m_standKidOffsetXMap[kid] == null) { // tips: 0 == null is false
            return 0;
        }
        return this.m_standKidOffsetXMap[kid];
    },

    SetStandKidOffsetX: function (kid, offsetX) {
        this.m_standKidOffsetXMap[kid] = offsetX;
    },

    SetBlockWidthScale: function (scale) {
        if (this.m_sprite != null) {
            var bodyRect = null;

            this.m_sprite.setScaleX(scale);
            bodyRect = this.m_sprite.getBoundingBox();
            this.m_bodyRect.x = bodyRect.x;
            this.m_bodyRect.y = bodyRect.y;
            this.m_bodyRect.width = bodyRect.width;
            this.m_bodyRect.height = bodyRect.height;
        }
    },

    LoadBlockDataFromFile: function () {
        
    }
});