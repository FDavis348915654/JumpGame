/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.ItemFireBallWM = GameClient.ItemWM.extend({
    m_willDeleteTile: null,
    m_armature: null,

    ctor: function (boss, typeId) {
        this._super(boss, typeId);

        this.m_willDeleteTile = 0;
        this.m_armature = null;

        // my init
        var sprite = new cc.Sprite("res/img/fireball_single.png");

        this.m_pBoss.addChild(sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        sprite.setScale(0.8);
//        m_bodyRect = sprite->boundingBox();
        var bodyRect = sprite.getBoundingBox();

        this.m_bodyRect.x = bodyRect.x;
        this.m_bodyRect.y = bodyRect.y;
        this.m_bodyRect.width = bodyRect.width;
        this.m_bodyRect.height = bodyRect.height;
        sprite.removeFromParent(true);
        sprite = null;

        this.m_sprite = new cc.Sprite();
        this.m_pBoss.addChild(this.m_sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);

        // load armature
        ccs.armatureDataManager.addArmatureFileInfo("res/sprite/fireball/FireBallAnimation.ExportJson");
        this.m_armature = new ccs.Armature("FireBallAnimation");
        this.m_armature.setPosition(0, -8);
        this.m_sprite.addChild(this.m_armature, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        this.m_armature.getAnimation().play("normal", -1, -1);
    },

    Destroy: function () {
        if (this.m_sprite != null) {
            this.m_sprite.removeFromParent(true);
            this.m_sprite = null;
        }
        this._super();
    },

//    MyInit: function (typeId) {
//        this._super(typeId);
//
//    },

//    MyDestroy: function () {
//
//        this._super();
//    },

    UpdateWM: function (dt) {
        this._super(dt);
        switch (this.m_objState) {
            case GameClient.OBJECT_STATE.OBJECT_STATE_ALIVE:
                this.m_posGlobal.x += (this.m_vX * GameClient.GameData.Share().m_fpsRatio);
                this.m_posGlobal.y += (this.m_vY * GameClient.GameData.Share().m_fpsRatio);
                this.m_vX += (this.m_aX * GameClient.GameData.Share().m_fpsRatio);
                this.m_vY += (this.m_aY * GameClient.GameData.Share().m_fpsRatio);
                break;
            case GameClient.OBJECT_STATE.OBJECT_STATE_DEADTH:
                if (this.m_willDeleteTime < 0) {
                    this.SetWillDelete();
                }
                else {
                    this.m_willDeleteTime -= dt;
                }
                break;

            default:
                break;
        }
    },

    ItemHitKid: function (kid) {
        if (this.m_objState != GameClient.OBJECT_STATE.OBJECT_STATE_DEADTH && kid.GetKidState() != GameClient.KID_STATE.KID_STATE_DEAD) {
            kid.SetKidState(GameClient.KID_STATE.KID_STATE_DEAD);
            this.m_pBoss.OnKidDeath(kid);
            this.SetFireBallDeath(); // then play sound
        }
    },

    SetFireBallDeath: function () {
        if (this.m_objState != GameClient.OBJECT_STATE.OBJECT_STATE_DEADTH) {
            if (this.m_armature != null) {
                this.m_armature.getAnimation().play("death", -1, -1);
            }
            this.m_objState = GameClient.OBJECT_STATE.OBJECT_STATE_DEADTH;
            this.m_willDeleteTime = 0.5;

            if (GameClient.GameData.Share().m_bSound) {
                cc.audioEngine.playEffect(GameClient.SOUND_BLOCKDEATH);
            }
        }
    }
})