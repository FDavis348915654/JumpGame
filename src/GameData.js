/**
 * Created by Administrator on 2015/9/21.
 */

var GameClient = GameClient || {};

GameClient.GAME_VERSION = "v1.0f";
console.log("version: " + GameClient.GAME_VERSION);

/** @expose */
PlatformAccess.InitPlatform = PlatformAccess.InitPlatform;
/** @expose */
DataCount.DataCountInit = DataCount.DataCountInit;
/** @expose */
DataCount.DataCountOnEvent = DataCount.DataCountOnEvent;
/** @expose */
AdsControl.MyBanner = AdsControl.MyBanner;
/** @expose */
AdsControl.CloseMyBanner = AdsControl.CloseMyBanner;
/** @expose */
AdsControl.Myqp = AdsControl.Myqp;

GameClient.SCREEN_WIDTH = 480;
GameClient.SCREEN_HEIGHT = 800;

GameClient.OBJECT_STATE = {OBJECT_STATE_ALIVE: 0, OBJECT_STATE_DEADTH: 1};

GameClient.OBJECT_MOVESTATE = {OBJECT_MOVESTATE_MOVE: 0, OBJECT_MOVESTATE_STAND: 1};

GameClient.OBJECT_Z_ORDER = {
    OBJECT_Z_ORDER_BG: 0,
    OBJECT_Z_ORDER_BG_SIDE: 1,
    OBJECT_Z_ORDER_BLOCK: 2,
    OBJECT_Z_ORDER_KID: 3,
    OBJECT_Z_ORDER_MAGMA: 5
};

GameClient.GAME_MODE = {GAME_MODE_SINGLE: 0, GAME_MODE_DOUBLE: 1};

GameClient.GAME_CONTROL_MODE = { // only use in two player mode
    GAME_CONTROL_NOTJUMP: 0,
    GAME_CONTROL_LEFTRIGHT: 1,
    GAME_CONTROL_P1P2: 2
};

GameClient.GAME_SCENE = { // will use in back button callback
    GAME_SCENE_LOGO: 0,
    GAME_SCENE_MAINMENU: 1,
    GAME_SCENE_GAMEPLAY: 2,
    GAME_SCENE_SETTING: 3,
    GAME_SCENE_TUTORIAL: 4,
    GAME_SCENE_ABOUT: 5
};

GameClient.LEVEL_STATE = {
    LEVEL_STATE_NONE: 0,
    LEVEL_STATE_MAINUPDATE: 1,
    LEVEL_STATE_FIREBALL: 2,
    LEVEL_STATE_TRANSFER: 3 // use to play some effect
};

GameClient.LEVEL_FIREBALL_STATE = {
    LEVEL_FIREBALL_STATE_START: 0,
    LEVEL_FIREBALL_STATE_DOING: 1,
    LEVEL_FIREBALL_STATE_END: 2
};

GameClient.LABEL_GOLD_NUM = "labelGoldNum";
GameClient.LABEL_SCORE_NUM = "labelScoreNum";
GameClient.LABEL_HEIGSCORE_NUM = "labelHighScoreNum";
GameClient.LABEL_SUPERHEIGSCORE_NUM = "labelSuperHighScoreNum";
GameClient.LABEL_HEIGLEVEL_NUM = "labelLevelNum_normal";
GameClient.LABEL_SUPERHEIGLEVEL_NUM = "labelLevelNum_super";
GameClient.LABEL_LEVEL_NUM = "labelLevelNum";
GameClient.IMG_MODE_NAME = "imgModeName";

GameClient.MAGMA_BASIC_V = 0.80;
GameClient.MAGMA_V_ADD = 0.018;

GameClient.BLOCK_BASIC_WIDTH = 130.0;
GameClient.FIRST_BLOCK_Y = 100.0;
GameClient.GOLD_HIGH = 25.0;

GameClient.BLOCK_SPACE_Y_BASIC = 70;
GameClient.BLOCK_SPACE_Y_ADD = 2;

GameClient.LEVEL_UPDATE_Y_BASIC = 1200;
GameClient.LEVEL_UPDATE_Y_SPACE = 1300;
GameClient.LEVEL_MAX_NUM = 10;
GameClient.BLOCK_WIDTH_SCALE_BASIC = 1.5;
GameClient.BLOCK_WIDTH_SCALE_ADD = -0.25;

GameClient.CREATE_FIREBALL_DURING = 2.35;

GameClient.GAME_FPS = 60.0;

GameClient.GAME_BACKGROUND_1_PATH = "res/img/bg_cave_1.png";
GameClient.GAME_BACKGROUNDSIDE_1_PATH = "res/img/bg_side_1.png";
GameClient.GAME_BLOCK_PATH = "res/img/block_0.png";
GameClient.CAMERA_TO_KID_SPACE = 360.0;

GameClient.CHANGE_SCENE_TIME = 0.5;

GameClient.MATCH_NORMAL_PATH = "res/img/icon_start.png";
GameClient.MATCH_SUPERL_PATH = "res/img/icon_super.png";

GameClient.SOUND_GAMEOVER = "res/sound/sound_game_over.wav";
GameClient.SOUND_JUMP = "res/sound/sound_jump.wav";
GameClient.SOUND_GETGOLD = "res/sound/sound_get_gold.wav";
GameClient.SOUND_BLOCKDEATH = "res/sound/sound_block_death.wav";
GameClient.SOUND_JUMPDOWN = "res/sound/sound_jump_down.wav";

GameClient.SHOW_AD_TIME = 600.0;
GameClient.PACKAGE_NAME = "com.game.jumpgame";

GameClient.GameData = function () {
    this.m_gold = 0;
    this.m_score = 0;
    this.m_highScore = 0;
    this.m_superHighScore = 0;
    this.m_highLevel = 0;
    this.m_superHighLevel = 0;
    this.m_level = 1;
    this.m_bSound = true;

    this.m_fpsRatio = 1;
    this.m_kidNum = 0;

    this.m_isWillStartGame = false;

    this.m_gameMode = GameClient.GAME_MODE.GAME_MODE_SINGLE;
    this.m_gameControlMode = GameClient.GAME_CONTROL_MODE.GAME_CONTROL_NOTJUMP;

    // 初始化，由单例调用
    this.OnInit = function () {

    };

    // 摧毁，由单例调用
    this.OnDestroy = function () {

    };
};

// 获得 GameData 的单例
GameClient.GameData.Share = function () { // 静态方法，获得 GameData 的单例
    if (GameClient.GameData.sm_share == null) {
        cc.log("GameData, init");
        GameClient.GameData.sm_share = new GameClient.GameData();
        GameClient.GameData.sm_share.OnInit();
    }

    return GameClient.GameData.sm_share;
};

// 摧毁 GameData 的单例，一般情况不必调用
GameClient.GameData.Destroy = function () { // 静态方法，摧毁 GameData 单例，目前这个方法可不调用
    if (GameClient.GameData.sm_share != null) {
        cc.log("GameData, destroy");
        GameClient.GameData.sm_share.OnDestroy();
        GameClient.GameData.sm_share = null;
    }
};