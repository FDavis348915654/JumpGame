/**
 * Created by Administrator on 2015/9/24.
 */

GameClient.LevelLogic = cc.Class.extend({
    m_blockCount: 0,
    m_preBlockMoveState: 0, // GameClient.OBJECT_MOVESTATE
    m_curBlockWScale: 0,
    m_curBlockPos: null, // cc.p
    m_blockSpace: 0,
    m_blockBasicY: 0,

    m_pBoss: null,
    m_isInit: false,
    m_levelState: 0, // GameClient.LEVEL_STATE
    m_nextLevelState: 0, // GameClient.LEVEL_STATE

    // block width and space level
    m_curBlockLevel: 0,
    // magma speed level
    m_curMagmaLevel: 0,

    // LEVEL_STATE_MAINUPDATE data
    m_lastRunY: 0,
    m_lastMagmaVY: 0,
    m_LevelYCount: 0,
    m_targetUpdateLevelY: 0,
    m_curMainLevelNum: 0,

    // LEVEL_STATE_FIREBALL data
    m_fireBallState: 0, // GameClient.LEVEL_FIREBALL_STATE
    m_createFireballDuring: 0,
    m_fireballStateCD: 0,
    m_createFireballDuringData: 0, // set data
    m_fireballStateCDData: 0, // set data

    ctor: function (boss) {
        this.m_pBoss = boss;
        this.m_curBlockPos = cc.p(0, 0);
        this.ResetLevel();
    },

    Destroy: function () {

        this.m_pBoss = null;
    },

    ResetLevel: function () {
        this.m_isInit = false;
        this.m_curBlockPos.x = GameClient.SCREEN_WIDTH / 2;
        this.m_curBlockPos.y = GameClient.FIRST_BLOCK_Y;
        this.m_blockSpace = GameClient.BLOCK_SPACE_Y_BASIC;
        this.m_curBlockWScale = GameClient.BLOCK_WIDTH_SCALE_BASIC;
        this.m_preBlockMoveState = GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND;
        this.m_blockCount = 0;
        this.m_levelState = GameClient.LEVEL_STATE.LEVEL_STATE_NONE;
        this.m_nextLevelState = GameClient.LEVEL_STATE.LEVEL_STATE_NONE;
        this.m_curBlockLevel = 0;
        this.m_curMagmaLevel = 0;
        this.m_lastRunY = 0;
        this.m_curMainLevelNum = 0;
        this.m_lastMagmaVY = 0;
        this.m_LevelYCount = 0;
        this.m_targetUpdateLevelY = GameClient.LEVEL_UPDATE_Y_BASIC;
        this.m_createFireballDuring = 0;
        this.m_fireBallState = GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_START;
        GameClient.GameData.Share().m_level = 1;
    },

    UpdateLevelLogic: function (dt) {
        if (this.m_pBoss != null) {
            if (!this.m_isInit) {
                this.m_isInit = this.FirstInit();
            }
            else {
                this.UpdateLevelState(dt);
                this.BasicBlockUpdate(dt);

                switch (this.m_levelState) {
                    case GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE:
                        this.UpdateMainLevel(dt);
                        break;
                    case GameClient.LEVEL_STATE.LEVEL_STATE_FIREBALL:
                        this.UpdateFireBallLevel(dt);
                        break;
                    case GameClient.LEVEL_STATE.LEVEL_STATE_TRANSFER:

                        break;

                    default:
                        break;
                }
            }
        }
    },

    // levelState is LEVEL_STATE
    SetLevelState: function (levelState) {
        this.m_nextLevelState = levelState;
    },

    GetLevelState: function () {
        return this.m_levelState;
    },

    ResetBlockData: function () {
        this.m_blockSpace = GameClient.BLOCK_SPACE_Y_BASIC;
        this.m_curBlockWScale = GameClient.BLOCK_WIDTH_SCALE_BASIC;
        this.m_curBlockLevel = 0;
    },

    SetCreateFireballDuring: function (during) {
        this.m_createFireballDuring = during;
    },

    SetFireballStateCD: function (cd) {
        this.m_fireballStateCDData = cd;
    },

    // moveState is OBJECT_MOVESTATE
    CreateAndAddBlock: function (globalPos, vX, scaleWidth, moveState) {
        if (this.m_pBoss != null) {
//            cc.log("CreateAndAddBlock(), y: " + globalPos.y);
            var pBossScene = this.m_pBoss; // PlayGameScene
            var block = new GameClient.BlockWM(this.m_pBoss, 0);

            pBossScene.AddBlock(block);
            block.SetBlockWidthScale(this.m_curBlockWScale);
            block.m_posGlobal.x = globalPos.x;
            block.m_posGlobal.y = globalPos.y;
            block.m_moveVX = vX;

            if (moveState == GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_MOVE) {
                block.m_moveSign = true;
            }

            return block;
        }
        return null;
    },

    BasicBlockUpdate: function (dt) {
        if (this.m_pBoss != null) {
            // this is the basic update block.
            var pBossScene = this.m_pBoss; // PlayGameScene
            var moveVX = 0;

            if (pBossScene.m_posCamera.y + GameClient.SCREEN_HEIGHT > this.m_curBlockPos.y) {
                var curMoveState = GameClient.Common.Share().GetRandInt(GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_MOVE, GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND); // OBJECT_MOVESTATE
                var block = null;

                switch (curMoveState) {
                    case GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_MOVE:
                        // create the block is the different pos
                        this.m_curBlockPos.x = GameClient.Common.Share().GetRandFloat(GameClient.BLOCK_BASIC_WIDTH * this.m_curBlockWScale / 2,
                                GameClient.SCREEN_WIDTH - GameClient.BLOCK_BASIC_WIDTH * this.m_curBlockWScale / 2);
                        if (GameClient.Common.Share().GetRandInt(0, 1) == 0) {
                            moveVX = GameClient.Common.Share().GetRandFloat(2.2, 3);
                        }
                        else {
                            moveVX = GameClient.Common.Share().GetRandFloat(-2.2, -3);
                        }
                        block = this.CreateAndAddBlock(this.m_curBlockPos, moveVX, this.m_curBlockWScale, curMoveState);
                        break;
                    case GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND:
                        if (this.m_preBlockMoveState == GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND) {
                            // create the block is the same pos
                            block = this.CreateAndAddBlock(this.m_curBlockPos, 0, this.m_curBlockWScale, curMoveState);
                        }
                        else {
                            // create the block is the different pos
                            this.m_curBlockPos.x = GameClient.Common.Share().GetRandFloat(GameClient.BLOCK_BASIC_WIDTH * this.m_curBlockWScale / 2,
                                    GameClient.SCREEN_WIDTH - GameClient.BLOCK_BASIC_WIDTH * this.m_curBlockWScale / 2, 1000);
                            block = this.CreateAndAddBlock(this.m_curBlockPos, 0, this.m_curBlockWScale, curMoveState);
                        }
                        break;

                    default:
                        break;
                }

                if (block != null && GameClient.Common.Share().GetRandInt(1, 5) <= 4) {
                    var itemWM = new GameClient.ItemGoldWM(pBossScene, GameClient.Common.Share().GetRandInt(1, 4));

                    pBossScene.AddItem(itemWM);
                    itemWM.SetPosGlobal(cc.p(block.m_posGlobal.x, block.m_posGlobal.y + GameClient.GOLD_HIGH));
                }

                this.m_preBlockMoveState = curMoveState;
                this.m_curBlockPos.y += this.m_blockSpace;
                this.m_blockCount++;
            }
        }
    },

    FirstInit: function () {
        if (this.m_pBoss != null) {
            var pBossScene = this.m_pBoss; // PlayGameScene

            this.m_lastMagmaVY = pBossScene.m_magma.m_vY;
            // create first block
            this.CreateAndAddBlock(this.m_curBlockPos, 0, this.m_curBlockWScale, GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND);
            this.m_preBlockMoveState = GameClient.OBJECT_MOVESTATE.OBJECT_MOVESTATE_STAND;
            this.m_curBlockPos.y += this.m_blockSpace;
            this.m_blockCount++;

            this.m_createFireballDuringData = GameClient.CREATE_FIREBALL_DURING;
            this.m_fireballStateCDData = 6;

            return true;
        }

        return false;
    },

    UpdateLevelState: function (dt) {
        if (this.m_pBoss != null) {
            if (this.m_levelState == this.m_nextLevelState) {
                return;
            }

            var pBossScene = this.m_pBoss; // PlayGameScene

            if (this.m_nextLevelState == GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE) {
                this.m_lastRunY = pBossScene.m_posCamera.y;
                pBossScene.m_magma.m_vY = this.m_lastMagmaVY;
            }
            else if (this.m_nextLevelState == GameClient.LEVEL_STATE.LEVEL_STATE_FIREBALL) {
                this.m_lastMagmaVY = pBossScene.m_magma.m_vY; // save temp data
                // set data
                GameClient.Common.Share().ShakeCamera(1.65);
                this.m_createFireballDuring = 1.8; // begin during is const
                this.m_fireballStateCD = this.m_fireballStateCDData;
                pBossScene.m_magma.m_vY *= 0.5;
                this.m_fireBallState = GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_START;
            }

            this.m_levelState = this.m_nextLevelState;
        }
    },

    UpdateMainLevel: function (dt) {
        var pBossScene = this.m_pBoss;
        var addY = pBossScene.m_posCamera.y - this.m_lastRunY;

        this.m_lastRunY = pBossScene.m_posCamera.y;
        this.m_LevelYCount += addY;

        if (this.m_LevelYCount > this.m_targetUpdateLevelY) {
            this.m_targetUpdateLevelY += GameClient.LEVEL_UPDATE_Y_SPACE;
            this.OnMainLevelUpgrade(); // add m_curMainLevelNum and so on
        }
    },

    UpdateFireBallLevel: function (dt) {
        var pBossScene = this.m_pBoss; // PlayGameScene

        switch (this.m_fireBallState) {
            case GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_START:
                if (this.m_createFireballDuring > 0) {
                    this.m_createFireballDuring -= dt;
                }
                else {
                    this.m_fireBallState = GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_DOING; // change state
                }
                break;
            case GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_DOING:
                if (this.m_createFireballDuring > 0) {
                    this.m_createFireballDuring -= dt;
                }
                else {
                    var itemWM = new GameClient.ItemFireBallWM(pBossScene, 0);
                    var localX = GameClient.Common.Share().GetRandFloat(0, GameClient.SCREEN_WIDTH, 1000);
                    var localY = GameClient.Common.Share().GetRandFloat(GameClient.SCREEN_HEIGHT - 200, GameClient.SCREEN_HEIGHT - 50, 1000);
                    var vX = 0;
                    var vY = 0;
                    var aY = 0;

                    GameClient.Common.Share().ShakeCamera(0.2);
                    if (localX < GameClient.SCREEN_WIDTH / 2) {
                        vX = GameClient.Common.Share().GetRandFloat(0.2, 2.5 * localX / (GameClient.SCREEN_WIDTH / 2) + 0.3, 1000);
                        localX = 0;
                    }
                    else {
                        vX = GameClient.Common.Share().GetRandFloat(-0.2, -2.5 * (localX - GameClient.SCREEN_WIDTH / 2) / (GameClient.SCREEN_WIDTH / 2) - 0.3, 1000);
                        localX = GameClient.SCREEN_WIDTH;
                    }
                    vY =  GameClient.Common.Share().GetRandFloat(1, 3, 1000);
                    aY = -0.03;

                    itemWM.m_vX = vX;
                    itemWM.m_vY = vY;
                    itemWM.m_aY = aY;

                    pBossScene.AddItem(itemWM);
                    itemWM.SetPosGlobal(cc.p(pBossScene.GetGlobalX(localX), pBossScene.GetGlobalY(localY)));

                    this.m_createFireballDuring = this.m_createFireballDuringData; // set next create fire ball again
                }

                if (this.m_fireballStateCD > 0) {
                    this.m_fireballStateCD -= dt;
                }
                else { // set data and change state
                    this.m_fireballStateCD = 1.5;
                    this.m_fireBallState = GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_END;
                }
                break;
            case GameClient.LEVEL_FIREBALL_STATE.LEVEL_FIREBALL_STATE_END:
                if (this.m_fireballStateCD > 0) {
                    this.m_fireballStateCD -= dt;
                }
                else {
                    this.SetLevelState(GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE);
                }
                break;

            default:
                break;
        }
    },

    OnMainLevelUpgrade: function () {
        var pBossScene = this.m_pBoss; // PlayGameScene
        var isShowUpdate = false;

        this.m_curMainLevelNum++;
        this.m_curBlockLevel++;
        this.m_curMagmaLevel++;

        if (this.m_curBlockLevel > 0 && this.m_curBlockLevel <= 3) {
            this.m_curBlockWScale += GameClient.BLOCK_WIDTH_SCALE_ADD;
            this.m_blockSpace += GameClient.BLOCK_SPACE_Y_ADD;
            isShowUpdate = true;
        }
        if (this.m_curMainLevelNum <= GameClient.LEVEL_MAX_NUM) {
            if (this.m_curMagmaLevel <= 8) {
                pBossScene.m_magma.m_vY += GameClient.MAGMA_V_ADD;
                isShowUpdate = true;
            }
        }
        if (isShowUpdate) {
            { // play some level up effects
                var label = new cc.LabelTTF("magma update!", "microsoft yahei", 24);

                label.setColor(cc.color(255, 100, 0));
                label.setPosition(GameClient.Common.Share().GetRandFloat(0 + 100, GameClient.SCREEN_WIDTH - 100), 0);
                pBossScene.addChild(label, 4);
                var actionDeleteSelf = cc.callFunc(this.RemoveAndCleanSelfLabelTTFCallback, pBossScene);
                var moveToWM = cc.moveTo(2.5, cc.p(GameClient.Common.Share().GetRandFloat(0 + 100, GameClient.SCREEN_WIDTH - 100, 1000), 700));
                var seqAction = cc.sequence(moveToWM, actionDeleteSelf);

                label.runAction(seqAction);
            }
        }
    },

    RemoveAndCleanSelfLabelTTFCallback: function (pSender) {
        var obj = pSender; // CCLabelTTF

        obj.removeFromParent(true);
    }
});