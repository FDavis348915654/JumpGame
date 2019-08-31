/**
 * Created by Administrator on 2015/9/22.
 */

GameClient.PlayGameLayer = cc.Layer.extend({
    m_pWidget: null,
    m_curKidMaxY: 0,
    m_firstCountSign: true,
    m_posCamera: null, // cc.p
    m_cameraVY: 0,
    m_blockBatchNode: null, // cc.SpriteBatchNode
    m_bgBatchNode: null, // cc.SpriteBatchNode
    m_bgSideBatchNode: null, // cc.SpriteBatchNode
    m_spriteBg: null, // cc.Sprite
    m_spriteBg2: null, // cc.Sprite
    m_spriteBgSide: null, // cc.Sprite
    m_spriteBgSide2: null, // cc.Sprite
    m_kidPeter: null, // KidWM
    m_kidBrother: null, // KidWM
    m_kidTemp: null, // KidWM
    m_kidHeadList: null, // KidWM
    m_blockHeadList: null, // BlockWM
    m_itemHeadList: null, // ItemWM
    m_magma: null, // MagmaWM
    m_isPause: false,
    m_levelLogic: null, // LevelLogic
    m_fireballDuring: 0,
    m_mainLevel: 0,
    m_fireballRemainLevel: 0,
    m_fireballLevelCount: 0,
    m_bResetBlockData: false,
    m_lastResetLevel: 0,
    m_bGoToMainMenu: false,

    ctor: function () {
        this._super();

        this.m_posCamera = cc.p(0, 0);
        this.m_itemHeadList = null;
        this.m_firstCountSign = true;
        this.m_curKidMaxY = 0;
        GameClient.GameData.Share().m_gold = 0;
        GameClient.GameData.Share().m_score = 0;
        GameClient.GameData.Share().m_highScore = 0;
        GameClient.GameData.Share().m_superHighScore = 0;
        GameClient.GameData.Share().m_highLevel = 1;
        GameClient.GameData.Share().m_superHighLevel = 1;
        this.m_pWidget = null;
        this.m_cameraVY = 1.0;
        this.m_spriteBg = null;
        this.m_spriteBg2 = null;
        this.m_spriteBgSide = null;
        this.m_spriteBgSide2 = null;
        this.m_kidPeter = null;
        this.m_kidBrother = null;
        this.m_kidHeadList = null;
        this.m_blockHeadList = null;
        this.m_magma = null;
        this.m_blockBatchNode = null;
        this.m_bgBatchNode = null;
        this.m_bgSideBatchNode = null;

        this.m_isPause = false;
        this.m_bGoToMainMenu = false;

        this.m_levelLogic = null;

        //        this.MyInit();
        GameClient.Common.Share().LoadControlMode();
        // load batch node
        this.m_blockBatchNode = new cc.SpriteBatchNode(GameClient.GAME_BLOCK_PATH);
        this.addChild(this.m_blockBatchNode, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_BLOCK);
        this.m_bgBatchNode = new cc.SpriteBatchNode(GameClient.GAME_BACKGROUND_1_PATH);
        this.addChild(this.m_bgBatchNode, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_BG); // 0
        this.m_bgSideBatchNode = new cc.SpriteBatchNode(GameClient.GAME_BACKGROUNDSIDE_1_PATH); // side
        this.addChild(this.m_bgSideBatchNode, GameClient.OBJECT_Z_ORDER.OBJECT_Z_ORDER_BG_SIDE); // 1
        // load bg
        this.m_spriteBg = new cc.Sprite(GameClient.GAME_BACKGROUND_1_PATH);
        this.m_bgBatchNode.addChild(this.m_spriteBg);
        this.m_spriteBg.setAnchorPoint(cc.p(0.5, 0));
        this.m_spriteBg.setPosition(cc.p(GameClient.SCREEN_WIDTH / 2.0, 0));

        this.m_spriteBg2 = new cc.Sprite(GameClient.GAME_BACKGROUND_1_PATH);
        this.m_bgBatchNode.addChild(this.m_spriteBg2);
        this.m_spriteBg2.setAnchorPoint(cc.p(0.5, 0));
        this.m_spriteBg2.setPosition(cc.p(GameClient.SCREEN_WIDTH / 2.0, 0));
        this.m_spriteBg2.setVisible(false);

        this.m_spriteBgSide = new cc.Sprite(GameClient.GAME_BACKGROUNDSIDE_1_PATH);
        this.m_bgSideBatchNode.addChild(this.m_spriteBgSide);
        this.m_spriteBgSide.setAnchorPoint(cc.p(0.5, 0));
        this.m_spriteBgSide.setPosition(cc.p(GameClient.SCREEN_WIDTH / 2.0, 0));

        this.m_spriteBgSide2 = new cc.Sprite(GameClient.GAME_BACKGROUNDSIDE_1_PATH);
        this.m_bgSideBatchNode.addChild(this.m_spriteBgSide2);
        this.m_spriteBgSide2.setAnchorPoint(cc.p(0.5, 0));
        this.m_spriteBgSide2.setPosition(cc.p(GameClient.SCREEN_WIDTH / 2.0, 0));
        this.m_spriteBgSide2.setVisible(false);

        // load level data
        this.m_levelLogic = new GameClient.LevelLogic(this);
        this.m_levelLogic.SetLevelState(GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE);
        this.ResetLevelAIControlData();

        // load kid
        GameClient.GameData.Share().m_kidNum = 0;
        this.m_kidPeter = new GameClient.KidWM(this, 0); // 先载入第一个角色
        //m_kidPeter.onDeathFunc = (OnDeathFunc)(this.OnKidDeath);
        this.m_kidPeter.m_posGlobal.x = GameClient.SCREEN_WIDTH / 2;
        this.m_kidPeter.m_posGlobal.y = 150;
        this.AddKid(this.m_kidPeter);
        // 如果是双人模式
        if (GameClient.GameData.Share().m_gameMode == GameClient.GAME_MODE.GAME_MODE_DOUBLE) {
            this.m_kidPeter.m_posGlobal.x = GameClient.SCREEN_WIDTH / 2 - 50;
            this.m_kidPeter.m_posGlobal.y = 150;
            this.m_kidBrother = new GameClient.KidWM(this, 1);
            //m_kidBrother.onDeathFunc = (OnDeathFunc)(this.OnKidDeath);
            this.m_kidBrother.m_posGlobal.x = GameClient.SCREEN_WIDTH / 2 + 50;
            this.m_kidBrother.m_posGlobal.y = 150;
            this.AddKid(this.m_kidBrother);
            if (GameClient.GameData.Share().m_gameControlMode == GameClient.GAME_CONTROL_P1P2) {
                this.AddArrowPic("res/img/arrow.png", this.m_kidPeter.m_armature, cc.color(255, 0, 0), 120);
                this.AddArrowPic("res/img/arrow.png", this.m_kidBrother.m_armature, cc.color(0, 0, 255), 120);
            }
        }
        this.m_firstCountSign = true;

        // load magma
        this.m_magma = new GameClient.MagmaWM(this, 0);

        // load block
// 	BlockWM *block = null;
// 	float tempY = FIRST_BLOCK_Y;
//
// 	for (int i = 0; i < 1; i++) {
// 		block = BlockWM::CreateWM(this);
// 		AddBlock(block);
// 		block.SetBlockWidthScale(1);
// 		block.m_posGlobal.setPoint(240, tempY);
// 		tempY += 70;
// 	}

        var btnNode = null;
        var panel = null;

        // load ui data
        this.m_pWidget = GameClient.Common.Share().LoadUINodeAndLayout(null, "res/PlayGameScene_1.json");
        this.addChild(this.m_pWidget, 10);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnBack");
        btnNode.addClickEventListener(this.BtnBackCallback.bind(this));

        panel = ccui.helper.seekWidgetByName(this.m_pWidget, "panelPauseBg");
        panel.setVisible(false);

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnPause");
        btnNode.addClickEventListener(this.BtnPauseCallback.bind(this));

        btnNode = ccui.helper.seekWidgetByName(this.m_pWidget, "btnPauseBig");
        btnNode.addClickEventListener(this.BtnPauseCallback.bind(this));

        GameClient.Common.Share().LoadGameCountDataFromFile();
        this.SetLabelTextNum(GameClient.GameData.Share().m_score, GameClient.LABEL_SCORE_NUM);

        switch (GameClient.GameData.Share().m_gameMode) {
            case GameClient.GAME_MODE.GAME_MODE_SINGLE:
                this.SetLabelTextNum(GameClient.GameData.Share().m_highScore, GameClient.LABEL_HEIGSCORE_NUM);
                break;
            case GameClient.GAME_MODE.GAME_MODE_DOUBLE:
                this.SetLabelTextNum(GameClient.GameData.Share().m_superHighScore, GameClient.LABEL_HEIGSCORE_NUM);
                break;

            default:
                break;
        }

        // load sound
//        SimpleAudioEngine::sharedEngine().preloadEffect(SOUND_GAMEOVER);
//        SimpleAudioEngine::sharedEngine().preloadEffect(SOUND_JUMP);
//        SimpleAudioEngine::sharedEngine().preloadEffect(SOUND_GETGOLD);
//        SimpleAudioEngine::sharedEngine().preloadEffect(SOUND_BLOCKDEATH);
//        SimpleAudioEngine::sharedEngine().preloadEffect(SOUND_JUMPDOWN);

        this.scheduleUpdate();
    },

    onEnter: function () {
        this._super();

        var strInfo = GameClient.Common.Share().FormatStr("hello, welcome, my name is WM, QQ is %s%s%s%s.", 3489, "1", 5, "654");
//        cc.log("PlayGameLayer, m_kidNum: " + GameClient.GameData.Share().m_kidNum);
        cc.log(strInfo);
        this.AddTouchesEventListener();
        this.AddKeyboardEventListener();
    },

    onExit: function () {
//        this.MyDestroy();
        cc.log("PlayGameScene::MyDestroy()");
        this.CleanAllBlock();
        this.CleanAllItem();
        this.CleanAllKid();
        this.m_kidPeter = null;
        this.m_kidBrother = null;
        this.m_magma.Destroy();
        this.m_magma = null;
        this.m_levelLogic.Destroy();
        this.m_levelLogic = null;

        this._super();
    },

    update: function (dt) {
        this._super(dt);

        GameClient.GameData.Share().m_fpsRatio = dt * GameClient.GAME_FPS;
        if (GameClient.GameData.Share().m_fpsRatio > 2.0) {
            GameClient.GameData.Share().m_fpsRatio = 2.0;
        }

        if (!this.m_isPause) {
            this.UpdateCleanKid();
            this.UpdateCleanBlock();
            this.UpdateCleanItem();
            this.UpdateBackground(dt);
            this.UpdateLevel(dt);
            this.UpdateBlockList(dt);
            this.UpdateItemList(dt);
            this.UpdateKidList(dt);
            this.UpdateMagma(dt);
            this.UpdateCollide();
            this.UpdateScore();
        }

        if (!this.m_bGoToMainMenu && GameClient.GameData.Share().m_kidNum <= 0) {
            GameClient.Common.Share().ShowAd(GameClient.SHOW_AD_TIME);
            this.ChangeSceneToMainMenu(); // this function will set m_bGoToMainMenu true
        }
    },

    AddTouchesEventListener: function () {
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            swallowTouches: true,
            onTouchesBegan: this.onTouchesBegan.bind(this),
            onTouchesMoved: this.onTouchesMoved.bind(this),
            onTouchesEnded: this.onTouchesEnded.bind(this),
            onTouchesCancelled: this.onTouchesCancelled.bind(this)
        });
        cc.eventManager.addListener(this.touchListener, this);
    },

    AddKeyboardEventListener: function () {
        var thisNode = this;

        this.m_keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this)
        });
        cc.eventManager.addListener(this.m_keyboardListener, this);
    },

    onKeyPressed: function (keyCode, event) {
        switch (keyCode) {
            case cc.KEY.back:
//                        cc.warn("onKeyReleased(), cc.KEY.back");
                break;
            case cc.KEY.w:
//                cc.warn("onKeyPressed(), cc.KEY.w");
                if (this.m_kidPeter != null) {
                    this.m_kidPeter.Jump();
                }
                break;
            case cc.KEY.i:
//                cc.warn("onKeyPressed(), cc.KEY.i");
                if (this.m_kidBrother != null) {
                    this.m_kidBrother.Jump();
                }
                break;
            case cc.KEY.space:
//                cc.warn("onKeyPressed(), cc.KEY.space");
                break;

            default:
                break;
        }
    },

    onTouchesBegan: function (touches, event) {
        switch (GameClient.GameData.Share().m_gameMode) {
            case GameClient.GAME_MODE.GAME_MODE_SINGLE:
                if (this.m_kidPeter != null) {
                    this.m_kidPeter.Jump();
                }
                break;
            case GameClient.GAME_MODE.GAME_MODE_DOUBLE:
                if (this.m_kidPeter != null && this.m_kidBrother != null) {
                    var touch = touches[touches.length - 1];
                    var touchPoint = touch.getLocation();

                    var kidLeft = null;
                    var kidRight = null;

                    switch (GameClient.GameData.Share().m_gameControlMode) {
                        case GameClient.GAME_CONTROL_MODE.GAME_CONTROL_LEFTRIGHT:
                            if (this.m_kidPeter.m_posGlobal.x <= this.m_kidBrother.m_posGlobal.x) {
                                kidLeft = this.m_kidPeter;
                                kidRight = this.m_kidBrother;
                            }
                            else {
                                kidLeft = this.m_kidBrother;
                                kidRight = this.m_kidPeter;
                            }
                            if (touchPoint.x <= GameClient.SCREEN_WIDTH / 2) {
                                kidLeft.Jump();
                            }
                            else {
                                kidRight.Jump();
                            }
                            break;
                        case GameClient.GAME_CONTROL_MODE.GAME_CONTROL_P1P2:
                            if (touchPoint.x <= GameClient.SCREEN_WIDTH / 2) {
                                this.m_kidPeter.Jump();
                            }
                            else {
                                this.m_kidBrother.Jump();
                            }
                            break;
                        case GameClient.GAME_CONTROL_MODE.GAME_CONTROL_NOTJUMP:
                            if (this.m_kidPeter.m_posGlobal.y <= this.m_kidBrother.m_posGlobal.y) {
                                kidLeft = this.m_kidPeter;
                                kidRight = this.m_kidBrother;
                            }
                            else {
                                kidLeft = this.m_kidBrother;
                                kidRight = this.m_kidPeter;
                            }
                            if (kidLeft.GetKidState() == GameClient.KID_STATE.KID_STATE_STAND || kidLeft.GetKidState() == GameClient.KID_STATE.KID_STATE_WALK) {
                                kidLeft.Jump();
                            }
                            else {
                                kidRight.Jump();
                            }
                            break;

                        default:
                            break;
                    }
                }
                break;

            default:
                break;
        }
        return true;
    },

    onTouchesMoved: function (touches, event) {
        //
    },

    onTouchesEnded: function (touches, event) {
        //
    },

    onTouchesCancelled: function (touches, event) {
        //
    },

//    MyInit: function () {
//
//    },

//    MyDestroy: function () {
//
//    },

    GetGlobalX: function (x) {
        return this.m_posCamera.x + x;
    },

    GetGlobalY: function (y) {
        return this.m_posCamera.y + y;
    },

    GetRelativeX: function (x) {
        return x - this.m_posCamera.x;
    },

    GetRelativeY: function (y) {
        return y - this.m_posCamera.y;
    },

    UpdateBlockList: function (dt) {
        var tempBlock = null;

        for (tempBlock = this.m_blockHeadList; tempBlock != null; tempBlock = tempBlock.m_nextObjectWM) {
            if (!tempBlock.IsWillDelete()) {
                tempBlock.UpdateWM(dt);
            }
        }
    },
    
    UpdateCleanBlock: function () {
        var tempBlock = null;
        var preBlock = null; // tempBlock = dynamic_cast<BlockWM *>(tempBlock.m_nextObjectWM)

        for (tempBlock = this.m_blockHeadList; tempBlock != null; ) {
            if (tempBlock.IsWillDelete()) {
                if (tempBlock.m_willDeleteCount > 0) {
                    tempBlock.m_willDeleteCount--;
                }
                else {
                    if (tempBlock == this.m_blockHeadList) {
                        this.m_blockHeadList = tempBlock.m_nextObjectWM;
                        tempBlock.Destroy();
                        tempBlock = this.m_blockHeadList;
                    }
                    else {
                        preBlock.m_nextObjectWM = tempBlock.m_nextObjectWM;
                        tempBlock.Destroy();
                        tempBlock = preBlock.m_nextObjectWM;
                    }
                }
            }
            else {
                preBlock = tempBlock;
                tempBlock = tempBlock.m_nextObjectWM;
            }
        }
    },

    CleanAllBlock: function () {
        var tempBlock = null;
        var nextBlock = null;

        for (tempBlock = this.m_blockHeadList; tempBlock != null; ) {
            nextBlock = tempBlock.m_nextObjectWM;
            tempBlock.Destroy();
            tempBlock = nextBlock;
        }
        tempBlock = null;
        nextBlock = null;
    },

    UpdateLevel: function (dt) {
        if (this.m_levelLogic != null) {
            this.m_levelLogic.UpdateLevelLogic(dt);

            // control fireball state
//            cc.log("m_fireballRemainLevel: " + this.m_fireballRemainLevel);
            if (this.m_fireballRemainLevel <= 0) {
                if (this.m_fireballDuring > 0) {
                    this.m_fireballDuring -= dt;
                }
                else {
                    // set some data
                    this.m_fireballRemainLevel += (35 + GameClient.Common.Share().GetRandInt(0, 8)); // every N levels have fire ball attack
                    this.m_fireballDuring = GameClient.Common.Share().GetRandFloat(0, 2, 1000); // set next fireball start prepare time
                    this.m_levelLogic.SetLevelState(GameClient.LEVEL_STATE.LEVEL_STATE_FIREBALL);

                    if (this.m_fireballLevelCount <= 0) {
                        this.m_levelLogic.SetCreateFireballDuring(GameClient.Common.Share().GetRandFloat(0.8, 1.5));
                        this.m_levelLogic.SetFireballStateCD(GameClient.Common.Share().GetRandFloat(6.0, 8.0));
                    }
                    else if (this.m_fireballLevelCount == 1){
                        this.m_levelLogic.SetCreateFireballDuring(GameClient.Common.Share().GetRandFloat(0.5, 0.5));
                        this.m_levelLogic.SetFireballStateCD(GameClient.Common.Share().GetRandFloat(6.0, 6.0));
                    }
                    else {
                        this.m_levelLogic.SetCreateFireballDuring(GameClient.Common.Share().GetRandFloat(1.0 - this.m_fireballLevelCount * 0.4, 2.0 - this.m_fireballLevelCount * 0.4));
                        this.m_levelLogic.SetFireballStateCD(GameClient.Common.Share().GetRandFloat(2.0 + this.m_fireballLevelCount * 2, 4.0 + this.m_fireballLevelCount * 2));
                    }
                    this.m_fireballLevelCount++;
                }
            }

            // reset block data control every 100 level
            if (GameClient.GameData.Share().m_level > this.m_lastResetLevel && !this.m_bResetBlockData && GameClient.GameData.Share().m_level % 100 == 0) {
                this.m_bResetBlockData = true;
                this.m_lastResetLevel = GameClient.GameData.Share().m_level;
            }
            if (this.m_bResetBlockData) {
                if (this.m_levelLogic.GetLevelState() == GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE) {
                    this.m_bResetBlockData = false;
                    this.m_levelLogic.ResetBlockData();
                }
            }
        }
    },

    AddBlock: function (block) {
        if (block != null) {
            block.m_nextObjectWM = this.m_blockHeadList;
            this.m_blockHeadList = block;
        }
    },

    UpdateCollide: function () {
        var kidTemp = null;

        { // kid and block collide
            var tempBlock = null;
            var blockCenterY = 0;
            var blockUpY = 0;
            var blockLeft = 0;
            var blockRight = 0;
            var kidDownY = 0;
            var kidLeft = 0;
            var kidRight = 0;

            for (kidTemp = this.m_kidHeadList; kidTemp != null; kidTemp = kidTemp.m_nextObjectWM) {
                if (kidTemp != null && !kidTemp.IsWillDelete() && kidTemp.m_vY <= 0.0 && kidTemp.GetKidState() != GameClient.KID_STATE.KID_STATE_DEAD) {
                    tempBlock = null;
                    blockCenterY = 0;
                    blockUpY = 0;
                    blockLeft = 0;
                    blockRight = 0;
                    kidDownY = 0;
                    kidLeft = 0;
                    kidRight = 0;

                    kidDownY = kidTemp.m_posGlobal.y - kidTemp.m_bodyRect.height / 2;

                    for (tempBlock = this.m_blockHeadList; tempBlock != null; tempBlock = tempBlock.m_nextObjectWM) {
                        if (!tempBlock.IsWillDelete()) {
                            blockCenterY = tempBlock.m_posGlobal.y;
                            blockUpY = tempBlock.m_posGlobal.y + tempBlock.m_bodyRect.height / 2;

                            // kid and block
                            if (kidDownY >= blockCenterY && kidDownY <= blockUpY) {
                                blockLeft = tempBlock.m_posGlobal.x - tempBlock.m_bodyRect.width / 2;
                                blockRight = tempBlock.m_posGlobal.x + tempBlock.m_bodyRect.width / 2;
                                kidLeft = kidTemp.m_posGlobal.x - kidTemp.m_bodyRect.width / 2;
                                kidRight = kidTemp.m_posGlobal.x + kidTemp.m_bodyRect.width / 2;
                                if (kidRight >= blockLeft && kidLeft <= blockRight) {
                                    kidTemp.m_posGlobal.y = blockUpY + kidTemp.m_bodyRect.height / 2;
                                    kidTemp.m_vY = 0;
                                    if (kidTemp.m_beginJudgeAir <= 0) {
                                        kidTemp.OnJumpDownInGround();
                                    }
                                    kidTemp.m_beginJudgeAir = 2;
                                    tempBlock.SetStandKid(kidTemp);
                                    //CCLOG("Set Stand Kid");
                                    break; // important warning, it will affect next judge
                                }
                            } // end if (kidDownY >= blockCenterY && kidDownY <= blockUpY)

                        }
                    }
                }
            }
        }

        { // kid and item collide
            var tempItem = null;

            for (kidTemp = this.m_kidHeadList; kidTemp != null; kidTemp = kidTemp.m_nextObjectWM) {
                if (kidTemp != null) {
                    tempItem = null;

                    for (tempItem = this.m_itemHeadList; tempItem != null; tempItem = tempItem.m_nextObjectWM) {
                        if (!tempItem.IsWillDelete()) {
                            if (GameClient.Common.Share().CollideRectAndRect(kidTemp.m_posGlobal.x, kidTemp.m_posGlobal.y, kidTemp.m_bodyRect.width, kidTemp.m_bodyRect.height,
                                    tempItem.m_posGlobal.x, tempItem.m_posGlobal.y, tempItem.m_bodyRect.width, tempItem.m_bodyRect.height)) {
                                tempItem.ItemHitKid(kidTemp);
                            }
                        }
                    }
                }
            }
        }


        { // magma and block collide
            var tempBlock = null;
            var blockUpY = 0;

            for (tempBlock = this.m_blockHeadList; tempBlock != null; tempBlock = tempBlock.m_nextObjectWM) {
                if (!tempBlock.IsWillDelete()) {
                    blockUpY = tempBlock.m_posGlobal.y + tempBlock.m_bodyRect.height / 2;
                    // magma and block
                    if (blockUpY < this.m_magma.m_posGlobal.y) {
                        // create some effcet
                        if (blockUpY > this.m_posCamera.y) {

                            //... play some sound

                        }
                        tempBlock.SetWillDelete();
                    }
                }
            }
        }

        { // magma and item collide
            var tempObj = null;
            var objUpY = 0;

            for (tempObj = this.m_itemHeadList; tempObj != null; tempObj = tempObj.m_nextObjectWM) {
                if (!tempObj.IsWillDelete()) {
                    objUpY = tempObj.m_posGlobal.y + tempObj.m_bodyRect.height / 2;
                    // magma and block
                    if (objUpY < this.m_magma.m_posGlobal.y) {
                        // create some effect
                        tempObj.SetWillDelete();
                    }
                }
            }
        }

        { // kid dead judge
            if (this.m_magma != null)
            {
                for (kidTemp = this.m_kidHeadList; kidTemp != null; kidTemp = kidTemp.m_nextObjectWM) {
                    if (kidTemp != null && !kidTemp.IsWillDelete() && kidTemp.GetKidState() != GameClient.KID_STATE.KID_STATE_DEAD && kidTemp.m_posGlobal.y < this.m_magma.m_posGlobal.y) {
                        //CCLOG("kid fall in the end. game over!");
                        if (GameClient.GameData.Share().m_bSound) {
                            cc.audioEngine.playEffect(GameClient.SOUND_GAMEOVER);
                        }
                        kidTemp.SetKidState(GameClient.KID_STATE.KID_STATE_DEAD);
                        this.OnKidDeath(kidTemp);
                    }
                }
            }
        }
        kidTemp = null;
    },

    UpdateBackground: function (dt) {
        var offsetY = 0;
        var bgHeight = 1;
        var bgMoveRatio = 0.7;

        // cout side
        bgHeight = this.m_spriteBg.getBoundingBox().height;
        offsetY = GameClient.Common.Share().ModeFloat(this.m_posCamera.y * bgMoveRatio, bgHeight);
        this.m_spriteBg.setPositionY(-offsetY);

        if (offsetY >= 0.0) {
            if (offsetY + GameClient.SCREEN_HEIGHT > bgHeight) {
                if (!this.m_spriteBg2.isVisible()) {
                    this.m_spriteBg2.setVisible(true);
                }
                this.m_spriteBg2.setPositionY(bgHeight - offsetY);
            }
            else {
                if (this.m_spriteBg2.isVisible()) {
                    this.m_spriteBg2.setVisible(false);
                }
            }
        }
        else {
            if (-offsetY > bgHeight) {
                this.m_spriteBg.setPositionY(-offsetY - bgHeight);
                if (this.m_spriteBg2.isVisible()) {
                    this.m_spriteBg2.setVisible(false);
                }
            }
            else {
                if (!this.m_spriteBg2.isVisible()) {
                    this.m_spriteBg2.setVisible(true);
                }
                this.m_spriteBg2.setPositionY(-offsetY - bgHeight);
            }
        }

        // cout cave
        bgHeight = this.m_spriteBgSide2.getBoundingBox().height;
        offsetY = GameClient.Common.Share().ModeFloat(this.m_posCamera.y, bgHeight);
        this.m_spriteBgSide.setPositionY(-offsetY);

        if (offsetY >= 0.0) {
            if (offsetY + GameClient.SCREEN_HEIGHT > bgHeight) {
                if (!this.m_spriteBgSide2.isVisible()) {
                    this.m_spriteBgSide2.setVisible(true);
                }
                this.m_spriteBgSide2.setPositionY(bgHeight - offsetY);
            }
            else {
                if (this.m_spriteBgSide2.isVisible()) {
                    this.m_spriteBgSide2.setVisible(false);
                }
            }
        }
        else {
            if (-offsetY > bgHeight) {
                this.m_spriteBgSide.setPositionY(-offsetY - bgHeight);
                if (this.m_spriteBgSide2.isVisible()) {
                    this.m_spriteBgSide2.setVisible(false);
                }
            }
            else {
                if (!this.m_spriteBgSide2.isVisible()) {
                    this.m_spriteBgSide2.setVisible(true);
                }
                this.m_spriteBgSide2.setPositionY(-offsetY - bgHeight);
            }
        }

        // camera follow kid
        if (this.m_kidPeter != null && this.m_kidBrother != null) {
            if (this.m_kidPeter.m_posGlobal.y <= this.m_kidBrother.m_posGlobal.y) {
                this.m_kidTemp = this.m_kidPeter;
            }
            else
            {
                this.m_kidTemp = this.m_kidBrother;
            }
        }
        else {
            this.m_kidTemp = this.m_kidPeter;
        }
        if (this.m_kidTemp != null) {
            if (this.m_posCamera.y < this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE) {
                this.m_posCamera.y += (this.m_cameraVY * GameClient.GameData.Share().m_fpsRatio);
                if (this.m_posCamera.y >= this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE) {
                    this.m_posCamera.y = this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE;
                }
            }
            else if (this.m_posCamera.y > this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE) {
                this.m_posCamera.y -= (this.m_cameraVY * 3 * GameClient.GameData.Share().m_fpsRatio); // 3 mul
                if (this.m_posCamera.y <= this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE) {
                    this.m_posCamera.y = this.m_kidTemp.m_posGlobal.y - GameClient.CAMERA_TO_KID_SPACE;
                }
            }
        }
    },

    ChangeSceneToMainMenu: function () {
        if (!this.m_bGoToMainMenu) {
            this.m_bGoToMainMenu = true;

            switch (GameClient.GameData.Share().m_gameMode) {
                case GameClient.GAME_MODE.GAME_MODE_SINGLE:
                    if (GameClient.GameData.Share().m_score > GameClient.GameData.Share().m_highScore) {
                        GameClient.GameData.Share().m_highScore = GameClient.GameData.Share().m_score;
                    }
                    if (GameClient.GameData.Share().m_level > GameClient.GameData.Share().m_highLevel) {
                        GameClient.GameData.Share().m_highLevel = GameClient.GameData.Share().m_level;
                    }
                    break;
                case GameClient.GAME_MODE.GAME_MODE_DOUBLE:
                    if (GameClient.GameData.Share().m_score > GameClient.GameData.Share().m_superHighScore) {
                        GameClient.GameData.Share().m_superHighScore = GameClient.GameData.Share().m_score;
                    }
                    if (GameClient.GameData.Share().m_level > GameClient.GameData.Share().m_superHighLevel) {
                        GameClient.GameData.Share().m_superHighLevel = GameClient.GameData.Share().m_level;
                    }
                    break;

                default:
                    break;
            }

            GameClient.Common.Share().SaveGameCountDataToFile();
            GameClient.Common.Share().ChangeScene(new GameClient.MainMenuScene(), 0.7);
        }
    },

    UpdateMagma: function (dt) {
        if (this.m_magma != null) {
            this.m_magma.UpdateWM(dt);
        }
    },

    GetCameraPos: function () {
        return this.m_posCamera;
    },

    SetLabelTextNum: function (num, labelName) {
        if (this.m_pWidget != null) {
            var label = ccui.helper.seekWidgetByName(this.m_pWidget, labelName);

            label.string = "" + num;
        }
    },

    UpdateScore: function () {
        this.m_kidTemp = null;
        if (GameClient.GameData.Share().m_gameMode == GameClient.GAME_MODE.GAME_MODE_SINGLE) {
            this.m_kidTemp = this.m_kidPeter;
        }
        else if (GameClient.GameData.Share().m_gameMode == GameClient.GAME_MODE.GAME_MODE_DOUBLE) {
            if (this.m_kidPeter != null && this.m_kidBrother != null) {
                if ((this.m_kidPeter.m_beginJudgeAir != 0 && this.m_kidPeter.m_vY <= 0.0) &&
                !(this.m_kidBrother.m_beginJudgeAir != 0 && this.m_kidBrother.m_vY <= 0.0)) {
                    this.m_kidTemp = this.m_kidPeter;
                }
            else if (!(this.m_kidPeter.m_beginJudgeAir != 0 && this.m_kidPeter.m_vY <= 0.0) &&
                (this.m_kidBrother.m_beginJudgeAir != 0 && this.m_kidBrother.m_vY <= 0.0)) {
                    this.m_kidTemp = this.m_kidBrother;
                }
            else {
                    if (this.m_kidPeter.m_posGlobal.y >= this.m_kidBrother.m_posGlobal.y) {
                        this.m_kidTemp = this.m_kidPeter;
                    }
                    else {
                        this.m_kidTemp = this.m_kidBrother;
                    }
                }
            }
            else {
                if (this.m_kidPeter != null) {
                    this.m_kidTemp = this.m_kidPeter;
                }
                else if (this.m_kidBrother != null) {
                    this.m_kidTemp = this.m_kidBrother;
                }
            }
        }

        if (this.m_kidTemp != null) {
            if (this.m_kidTemp.m_beginJudgeAir != 0 && this.m_kidTemp.m_vY <= 0.0) {
                if (this.m_firstCountSign) {
                    this.m_firstCountSign = false;
                    this.m_curKidMaxY = ~~this.m_kidTemp.m_posGlobal.y;
                }
                if (~~this.m_kidTemp.m_posGlobal.y > this.m_curKidMaxY) {
                    var addScore = ~~((this.m_kidTemp.m_posGlobal.y - this.m_curKidMaxY) * 0.7);

                    if (GameClient.GameData.Share().m_gameMode == GameClient.GAME_MODE.GAME_MODE_DOUBLE) {
                        addScore *= 2;
                    }
                    GameClient.GameData.Share().m_score += (addScore);
                    this.m_curKidMaxY = ~~this.m_kidTemp.m_posGlobal.y;
                    this.SetLabelTextNum(GameClient.GameData.Share().m_score, GameClient.LABEL_SCORE_NUM);
                    GameClient.GameData.Share().m_level++;
                    this.SetLabelTextNum(GameClient.GameData.Share().m_level, GameClient.LABEL_LEVEL_NUM);
                    this.OnUpdateLevel();
                }
            }
        }
    },

    AddItem: function (itemWM) {
        if (itemWM != null) {
            itemWM.m_nextObjectWM = this.m_itemHeadList;
            this.m_itemHeadList = itemWM;
        }
    },

    CleanAllItem: function () {
        var tempObj = null;
        var nextObj = null;

        for (tempObj = this.m_itemHeadList; tempObj != null; ) {
            nextObj = tempObj.m_nextObjectWM;
            tempObj.Destroy();
            tempObj = nextObj;
        }
        tempObj = null;
        nextObj = null;
    },

    UpdateCleanItem: function () {
        var tempObj = null;
        var preObj = null; // tempBlock = dynamic_cast<BlockWM *>(tempBlock.m_nextObjectWM)

        for (tempObj = this.m_itemHeadList; tempObj != null; ) {
            if (tempObj.IsWillDelete()) {
                if (tempObj.m_willDeleteCount > 0) {
                    tempObj.m_willDeleteCount--;
                }
                else {
                    if (tempObj == this.m_itemHeadList) {
                        this.m_itemHeadList = tempObj.m_nextObjectWM;
                        tempObj.Destroy();
                        tempObj = this.m_itemHeadList;
                    }
                    else {
                        preObj.m_nextObjectWM = tempObj.m_nextObjectWM;
                        tempObj.Destroy();
                        tempObj = preObj.m_nextObjectWM;
                    }
                }
            }
            else {
                preObj = tempObj;
                tempObj = tempObj.m_nextObjectWM;
            }
        }
    },

    UpdateItemList: function (dt) {
        var tempObj = null;

        for (tempObj = this.m_itemHeadList; tempObj != null; tempObj = tempObj.m_nextObjectWM) {
            if (!tempObj.IsWillDelete()) {
                tempObj.UpdateWM(dt);
            }
        }
    },

    BtnBackCallback: function (btnNode) {
        if (this.m_isPause) {
            this.BtnPauseCallback(null);
        }
        else {
            var panel = ccui.helper.seekWidgetByName(this.m_pWidget, "panelTop");

            if (panel != null && !panel.isVisible()) {
                this.ChangeSceneToMainMenu();
            }
        }
    },

    AddKid: function (kid) {
        if (kid != null) {
            kid.m_nextObjectWM = this.m_kidHeadList;
            this.m_kidHeadList = kid;
        }
    },

    UpdateKidList: function (dt) {
        var tempKid = null;

        for (tempKid = this.m_kidHeadList; tempKid != null; tempKid = tempKid.m_nextObjectWM) {
            if (!tempKid.IsWillDelete()) {
                tempKid.UpdateWM(dt);
            }
        }
    },

    UpdateCleanKid: function () {
        var tempKid = null;
        var preKid = null; // tempBlock = dynamic_cast<BlockWM *>(tempBlock.m_nextObjectWM)

        for (tempKid = this.m_kidHeadList; tempKid != null; ) {
            if (tempKid.IsWillDelete()) {
                if (tempKid.m_willDeleteCount > 0) {
                    tempKid.m_willDeleteCount--;
                }
                else {
                    if (tempKid == this.m_kidHeadList) {
                        this.m_kidHeadList = tempKid.m_nextObjectWM;
                        tempKid.Destroy();
                        tempKid = this.m_kidHeadList;
                    }
                    else {
                        preKid.m_nextObjectWM = tempKid.m_nextObjectWM;
                        tempKid.Destroy();
                        tempKid = preKid.m_nextObjectWM;
                    }
                }
            }
            else {
                preKid = tempKid;
                tempKid = tempKid.m_nextObjectWM;
            }
        }
    },

    CleanAllKid: function () {
        var tempKid = null;
        var nextKid = null;

        for (tempKid = this.m_kidHeadList; tempKid != null; ) {
            nextKid = tempKid.m_nextObjectWM;
            tempKid.Destroy();
            tempKid = nextKid;
        }
        GameClient.GameData.Share().m_kidNum = 0;
        tempKid = null;
        nextKid = null;
    },

    BtnPauseCallback: function (btnNode) {
        if (this.m_isPause) {
            var panel = ccui.helper.seekWidgetByName(this.m_pWidget, "panelPauseBg");

            panel.setVisible(false);
            this.m_isPause = false;
        }
        else {
            var panel = ccui.helper.seekWidgetByName(this.m_pWidget, "panelPauseBg");

            panel.setVisible(true);
            this.m_isPause = true;
        }
    },

    AddArrowPic: function (picPath, node, color, alpha) {
        var arrow = new cc.Sprite(picPath);

        if (arrow != null) {
            node.addChild(arrow);
            arrow.setColor(color);
            arrow.setOpacity(alpha);
            arrow.setPosition(cc.p(0, 30));
            arrow.setScale(0.6);
        }
    },

    OnKidDeath: function (pData) {
        cc.log("OnKidDeath()");
        var kidTemp = pData; // KidWM

        if (kidTemp == this.m_kidPeter || kidTemp == this.m_kidBrother) {
            if (kidTemp == this.m_kidPeter) {
                this.m_kidPeter = null;

            }
            else if (kidTemp == this.m_kidBrother) {
                this.m_kidBrother = null;
            }
            this.m_magma.m_vY = 0;
            if (GameClient.GameData.Share().m_kidNum > 1) {
                GameClient.GameData.Share().m_kidNum = 1;
            }
            { // show a top layer
                var panel = ccui.helper.seekWidgetByName(this.m_pWidget, "panelTop");

                if (panel != null) {
                    panel.setVisible(true);
                }
            }
        }
    },

    RemoveAndCleanSelfLabelTTFCallback: function (pSender) {
        var obj = pSender; // CCLabelTTF

        obj.removeFromParent(true);
    },

    ResetLevelAIControlData: function () {
        this.m_fireballDuring = GameClient.Common.Share().GetRandFloat(0, 2);
        this.m_fireballRemainLevel = 20;
        this.m_mainLevel = 0;
        this.m_fireballLevelCount = 0;
        this.m_bResetBlockData = false;
        this.m_lastResetLevel = 0;
    },
    
    OnUpdateLevel: function () {
        this.m_mainLevel++;
        if (this.m_levelLogic != null && this.m_levelLogic.GetLevelState() == GameClient.LEVEL_STATE.LEVEL_STATE_MAINUPDATE) {
            this.m_fireballRemainLevel--;
        }
    }
});

GameClient.PlayGameScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = null;

        layer = new GameClient.PlayGameLayer();
        this.addChild(layer, 5);
    }
});