/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.MOVE_VX = 0.85;

GameClient.KID_STATE = {
    KID_STATE_STAND: 0,
    KID_STATE_WALK: 1,
    KID_STATE_JUMP_UP: 2,
    KID_STATE_JUMP_DOWN: 3,
    KID_STATE_DEAD: 4
};

GameClient.KID_STAND_NAME = "stand";
GameClient.KID_WALK_NAME = "walk";
GameClient.KID_JUMP_UP_NAME = "jumpUp";
GameClient.KID_JUMP_DOWN_NAME = "jumpDown";
GameClient.KID_DEAD_NAME = "dead";

GameClient.KidWM = GameClient.ObjectWM.extend({
    m_beginJudgeAir: 0,
    m_kidScale: 1,
    m_kidGravity: 0,
    m_kidWidthScale: 1,
    m_kidJumpV: 1,
    m_deleteTime: 0,
    m_armature: null,
    m_kidState: 0, // GameClient.KID_STATE
    m_nextKidState: 0, // GameClient.KID_STATE
    m_standBlock: null, // BlockWM
    m_bJump: false,

    // @override
    ctor: function (boss, typeId) {
        this._super(boss, typeId);

        this.m_armature = null;
        this.m_kidState = GameClient.KID_STATE.KID_STATE_STAND;
        this.m_nextKidState = GameClient.KID_STATE.KID_STATE_STAND;
        this.m_standBlock = null;
        this.m_beginJudgeAir = 0;
        this.m_kidScale = 1.0;
        this.m_kidGravity = 1.0;
        this.m_bJump = false;

        // init
        this.LoadKidDataFromFile();
        var sprite = new cc.Sprite("res/img/kid.png");

        this.m_pBoss.addChild(sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        sprite.setScale(this.m_kidScale);
        var bodyRect = sprite.getBoundingBox();

        this.m_bodyRect.x = bodyRect.x;
        this.m_bodyRect.y = bodyRect.y;
        this.m_bodyRect.width = bodyRect.width;
        this.m_bodyRect.height = bodyRect.height;
        this.m_bodyRect.width *= this.m_kidWidthScale;
        sprite.removeFromParent(true);
        sprite = null;

        this.m_sprite = new cc.Sprite();
        this.m_pBoss.addChild(this.m_sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        this.m_sprite.setScale(this.m_kidScale);
        this.m_aY = this.m_kidGravity;
        this.m_kidState = GameClient.KID_STATE.KID_STATE_STAND;

        switch (typeId) {
            case 1:
                ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kidB/KidBAnimation.ExportJson");
                this.m_armature = new ccs.Armature("KidBAnimation");
                break;

            default:
                ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kid/KidAnimation.ExportJson");
                this.m_armature = new ccs.Armature("KidAnimation");
                break;
        }

//        this.m_armature.setPosition(cc.winSize.width / 2 - 150, cc.winSize.height / 2 - 200);
        this.m_armature.setPosition(0, -8);
        this.m_sprite.addChild(this.m_armature, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
        this.m_armature.getAnimation().play("stand", -1, -1);

        GameClient.GameData.Share().m_kidNum++;
    },

    Destroy: function () {
        if (this.m_sprite != null) {
            this.m_sprite.removeFromParent(true);
            this.m_sprite = null;
        }
        GameClient.GameData.Share().m_kidNum--;

        this._super();
    },

    // @override
//    MyInit: function (typeId) {
//        this.m_armature = null;
//        this.m_kidState = GameClient.KID_STATE.KID_STATE_STAND;
//        this.m_nextKidState = GameClient.KID_STATE.KID_STATE_STAND;
//        this.m_standBlock = null;
//        this.m_beginJudgeAir = 0;
//        this.m_kidScale = 1.0;
//        this.m_kidGravity = 1.0;
//        this.m_bJump = false;
//
//        // init
//        this.LoadKidDataFromFile();
//        var sprite = new cc.Sprite("res/img/kid.png");
//
//        this.m_pBoss.addChild(sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
//        sprite.setScale(this.m_kidScale);
//        var bodyRect = sprite.getBoundingBox();
//
//        this.m_bodyRect.x = bodyRect.x;
//        this.m_bodyRect.y = bodyRect.y;
//        this.m_bodyRect.width = bodyRect.width;
//        this.m_bodyRect.height = bodyRect.height;
//        this.m_bodyRect.width *= this.m_kidWidthScale;
//        sprite.removeFromParent(true);
//        sprite = null;
//
//        this.m_sprite = new cc.Sprite();
//        this.m_pBoss.addChild(this.m_sprite, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
//        this.m_sprite.setScale(this.m_kidScale);
//        this.m_aY = this.m_kidGravity;
//        this.m_kidState = GameClient.KID_STATE.KID_STATE_STAND;
//
//        switch (typeId) {
//            case 1:
//                ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kidB/KidBAnimation.ExportJson");
//                this.m_armature = new ccs.Armature("KidBAnimation");
//                break;
//
//            default:
//                ccs.armatureDataManager.addArmatureFileInfo("res/sprite/kid/KidAnimation.ExportJson");
//                this.m_armature = new ccs.Armature("KidAnimation");
//                break;
//        }
//
//        this.m_armature.setPosition(cc.winSize.width / 2 - 150, cc.winSize.height / 2 - 200);
//        this.addChild(this.m_armature, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_KID);
//        this.m_armature.getAnimation().play("stand", -1, -1);
//
//        GameClient.GameData.Share().m_kidNum++;
//    },

    // @override
//    MyDestroy: function () {
//        if (this.m_sprite != null) {
//            this.m_sprite.removeFromParent(true);
//            this.m_sprite = null;
//        }
//        GameClient.GameData.Share().m_kidNum--;
//    },

    UpdateWM: function (dt) {
        this.UpdateArmatureByKidState();
        if (this.m_standBlock != null && this.m_standBlock.IsWillDelete()) {
            this.m_standBlock = null;
        }
        if (this.GetKidState() != GameClient.KID_STATE.KID_STATE_DEAD) {
            if (this.m_standBlock != null) { // in PlayGameScene::UpdateCollide() will SetStandKid() every loop so kid can follow the block // there is a problem, if kid in the air kid also can move left or right.
                if (this.m_standBlock.GetStandKidOffsetX(this) < -GameClient.MOVE_VX) {
                    this.m_posGlobal.x += (GameClient.MOVE_VX * GameClient.GameData.Share().m_fpsRatio);
                    this.SetKidState(GameClient.KID_STATE.KID_STATE_WALK);
                }
                else if (this.m_standBlock.GetStandKidOffsetX(this) > GameClient.MOVE_VX) {
                    this.m_posGlobal.x -= (GameClient.MOVE_VX * GameClient.GameData.Share().m_fpsRatio);
                    this.SetKidState(GameClient.KID_STATE.KID_STATE_WALK);
                }
                else {
                    this.m_standBlock.SetStandKidOffsetX(this, 0);
                    this.SetKidState(GameClient.KID_STATE.KID_STATE_STAND);
                }
                //CCLOG("offsetX = %f", m_standBlock->GetStandKidOffsetX(this));
            }
            this.m_posGlobal.x += (this.m_vX * GameClient.GameData.Share().m_fpsRatio);
            this.m_posGlobal.y += (this.m_vY * GameClient.GameData.Share().m_fpsRatio);
            this.m_vX += (this.m_aX * GameClient.GameData.Share().m_fpsRatio);
            this.m_vY += (this.m_aY * GameClient.GameData.Share().m_fpsRatio);
        }

        if (this.m_posGlobal.x < this.m_bodyRect.width / 2) {
            this.m_posGlobal.x = this.m_bodyRect.width / 2;
        }
        else if (this.m_posGlobal.x > GameClient.SCREEN_WIDTH - this.m_bodyRect.width / 2) {
            this.m_posGlobal.x = GameClient.SCREEN_WIDTH - this.m_bodyRect.width / 2;
        }
        this.UpdateSpritePos(); // global pos to screen pos

        if (this.GetKidState() != GameClient.KID_STATE.KID_STATE_DEAD && this.m_beginJudgeAir <= 0) {
            if (this.m_vY > 0) {
                this.SetKidState(GameClient.KID_STATE.KID_STATE_JUMP_UP);
            }
            else {
                this.SetKidState(GameClient.KID_STATE.KID_STATE_JUMP_DOWN);
            }
        }

        if (this.m_beginJudgeAir > 0) {
            this.m_beginJudgeAir -= 1;
        }

        if (this.GetKidState() == GameClient.KID_STATE.KID_STATE_DEAD) {
            if (this.m_deleteTime > 0) {
                this.m_deleteTime -= dt;
            }
            else {
                this.SetWillDelete();
            }
        }
    },

    Jump: function () {
        if (this.m_beginJudgeAir > 0 && this.m_vY <= 0.0) {
            if (GameClient.GameData.Share().m_bSound) {
                cc.audioEngine.playEffect(GameClient.SOUND_JUMP);
            }
            //CCLOG("Kid jump");
            this.m_vY = this.m_kidJumpV;
            this.m_bJump = true;
            this.DetachStandBlock();
            this.SetKidState(GameClient.KID_STATE.KID_STATE_JUMP_UP);
        }
    },

    OnJumpDownInGround: function () {
        if (this.m_bJump) {
            this.m_bJump = false;

            if (GameClient.GameData.Share().m_bSound) {
                cc.audioEngine.playEffect(GameClient.SOUND_JUMPDOWN);
            }
        }
    },

    SetStandBlock: function (block) {
        this.m_standBlock = block;
    },

    GetStandBlock: function () {
        return this.m_standBlock;
    },

    DetachStandBlock: function () {
        if (this.m_standBlock != null) {
            // this have a problem, the m_standBlock not set to null, so when UpdateWM() kid will move left or right in the air.
            this.m_standBlock.RemoveKid(this);
        }
    },

    // kidState is KID_STATE
    SetKidState: function (kidState) {
        this.m_nextKidState = kidState;
    },

    GetKidState: function () {
        return this.m_kidState;
    },

    // this.m_monsterRef.m_displayNodeRef.getAnimation().setMovementEventCallFunc(this.MovementEventCallback, this);
    SpiritMovementCallback: function (armature, movementType, movementID) {
        if (movementType == ccs.MovementEventType.complete) {
            if (movementID == GameClient.KID_DEAD_NAME) {
//                armature.setVisible(false); // 动作结束时会隐藏这个 kid
//                //((PlayGameScene *)m_pBoss)->ChangeSceneToMainMenu();
            }
        }
    },

    LoadKidDataFromFile: function () {
        this.m_kidScale = 1.5;
        this.m_kidWidthScale = 0.5;
        this.m_kidGravity = -0.16;
        this.m_kidJumpV = 5.2;
    },

    UpdateSpritePos: function () {
        if (this.m_sprite != null) {
            var x = this.m_pBoss.GetRelativeX(this.m_posGlobal.x);
            var y = this.m_pBoss.GetRelativeY(this.m_posGlobal.y);

            this.m_sprite.setPosition(x, y);
        }
    },

    UpdateArmatureByKidState: function () {
        if (this.m_nextKidState == this.m_kidState) {
            return;
        }

        if (this.m_armature != null) {
            if (this.m_nextKidState == GameClient.KID_STATE.KID_STATE_WALK) {
                this.m_armature.getAnimation().play(GameClient.KID_WALK_NAME, -1, -1);
                if (this.m_standBlock != null) {
                    if (this.m_standBlock.GetStandKidOffsetX(this) < 0) {
                        if (this.m_armature.getScaleX() > 0) {
                            this.m_armature.setScaleX(-1.0);
                        }
                    }
                    else {
                        if (this.m_armature.getScaleX() < 0) {
                            this.m_armature.setScaleX(1.0);
                        }
                    }
                }
            }
            else if (this.m_nextKidState == GameClient.KID_STATE.KID_STATE_STAND) {
                this.m_armature.getAnimation().play(GameClient.KID_STAND_NAME, -1, -1);
                if (this.m_armature.getScaleX() < 0) {
                    this.m_armature.setScaleX(1.0);
                }
            }
            else if (this.m_nextKidState == GameClient.KID_STATE.KID_STATE_JUMP_UP) {
                this.m_armature.getAnimation().play(GameClient.KID_JUMP_UP_NAME, -1, -1);
            }
            else if (this.m_nextKidState == GameClient.KID_STATE.KID_STATE_JUMP_DOWN) {
                this.m_armature.getAnimation().play(GameClient.KID_JUMP_DOWN_NAME, -1, -1);
            }
            else if (this.m_nextKidState == GameClient.KID_STATE.KID_STATE_DEAD) {
                this.DetachStandBlock();

                this.m_armature.getAnimation().play(GameClient.KID_DEAD_NAME, -1, -1);
                this.m_armature.getAnimation().setMovementEventCallFunc(this.SpiritMovementCallback, this);

                var moveUp1 = cc.moveBy(0.4, cc.p(0, 45));
                var moveUp2 = cc.moveBy(0.5, cc.p(0, 5));
                var moveDown2 = cc.moveBy(0.4, cc.p(0, -50));
                var moveDown3 = cc.moveBy(35, cc.p(0, 6000));
                var sequence = cc.sequence(moveUp1, moveUp2, moveDown2, moveDown3);

                this.m_armature.runAction(sequence);
                this.m_deleteTime = 3.2; // 2.3

// 			if (onDeathFunc != null) {
// 				onDeathFunc(this);
// 			}
            }
        }

        this.m_kidState = this.m_nextKidState;
    },

    // 由于 js 里面的字典的 key 只能是 string，考虑到能让 m_standKidMap 和 m_standKidOffsetXMap 继续使用，所以这里当这个类被变为 key 时会调用这个函数把这个类转成字符串
    toString: function () {
        return "" + this.m_id;
    }
});