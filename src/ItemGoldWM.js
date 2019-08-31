/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.ItemGoldWM = GameClient.ItemWM.extend({
    ctor: function (boss, typeId) {
        this._super(boss, typeId);

        var resPath = "";

        // 临时的 id 和图片路径对应
        switch (typeId) {
            case 1:
                resPath = "res/img/red_bag.png";
                break;
            case 2:
                resPath = "res/img/gold.png";
                break;
            case 3:
                resPath = "res/img/diamond.png";
                break;

            default:
                resPath = "res/img/gold.png";
                break;
        }
        this.m_sprite = new cc.Sprite(resPath);
        this.m_pBoss.addChild(this.m_sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        var bodyRect = this.m_sprite.getBoundingBox();

        this.m_bodyRect.x = bodyRect.x;
        this.m_bodyRect.y = bodyRect.y;
        this.m_bodyRect.width = bodyRect.width;
        this.m_bodyRect.height = bodyRect.height;

        var scaleSmall = cc.scaleTo(0.5, 0.0, 1.0);
        var scaleBig = cc.scaleTo(0.5, 1.0, 1.0);
        var actionWM = cc.sequence(scaleSmall, scaleBig).repeatForever();

        this.m_sprite.runAction(actionWM);
    },

    Destroy: function () {
        if (this.m_sprite != null) {
            this.m_sprite.removeFromParent(true);
            this.m_sprite = null;
        }

        this._super();
    },

    ItemHitKid: function (kid) {
        if (GameClient.GameData.Share().m_bSound) {
            cc.audioEngine.playEffect(GameClient.SOUND_GETGOLD);
        }

        GameClient.GameData.Share().m_score += 10;
        this.m_pBoss.SetLabelTextNum(GameClient.GameData.Share().m_score, GameClient.LABEL_SCORE_NUM);
        this.SetWillDelete();
    }

//    MyInit: function (typeId) {
//        this._super(typeId);
//
//    },

//    MyDestroy: function () {
//        if (this.m_sprite != null) {
//            this.m_sprite.removeFromParent(true);
//            this.m_sprite = null;
//        }
//        this._super();
//    }
});