/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.ObjectWM = cc.Class.extend({
    m_id: 0,
    m_pBoss: null,
    m_nextObjectWM: null,
    m_willDeleteCount: 0,
    m_willDeleteSign: false,
    m_bodyRect: null, // cc.Rect
    m_sprite: null, // cc.Sprite
    m_posGlobal: null, // cc.pos
    m_vX: 0,
    m_vY: 0,
    m_aX: 0,
    m_aY: 0,
    m_objState: 0, // GameClient.OBJECT_STATE

    // @override
    ctor: function (boss, typeId) {
        this.m_id = typeId;
        this.m_objState = GameClient.OBJECT_STATE.OBJECT_STATE_ALIVE;
        this.m_sprite = null;
        this.m_willDeleteCount = 0;
        this.m_willDeleteSign = false;
        this.m_nextObjectWM = null;
        this.m_pBoss = null;
        this.m_bodyRect = new cc.Rect(0, 0, 1, 1);
        this.m_posGlobal = cc.p(0, 0);
        this.m_vX = 0;
        this.m_vY = 0;
        this.m_aX = 0;
        this.m_aY = 0;

        this.m_pBoss = boss;
//        this.MyInit(typeId);
    },

    // @override
    Destroy: function () {
//        this.MyDestroy();
    },

    UpdateWM: function (dt) {

    },

//    MyInit: function (typeId) {
//
//    },

//    MyDestroy: function () {
//
//    },

    SetBoss: function (boss) {
        this.m_pBoss = boss;
    },
    
    GetBoss: function () {
        return this.m_pBoss;
    },

    IsWillDelete: function () {
        return this.m_willDeleteSign;
    },

    SetWillDelete: function () {
        if (!this.m_willDeleteSign) {
            this.m_willDeleteSign = true;
            this.m_willDeleteCount = 2;
        }
    },

    SetObjState: function (objState) {
        this.m_objState = objState;
    },
    
    GetObjState: function () {
        return this.m_objState;
    },
    
    SetPosGlobal: function (point) {
        this.m_posGlobal.x = point.x;
        this.m_posGlobal.y = point.y;
    },
    
    SetSprite: function (sprite) {
        this.m_sprite = sprite;
    }
});

//GameClient.ObjectWM.CreateWM = function (boss, typeId) {
//    var objectWM = new GameClient.ObjectWM();
//
//    objectWM.m_pBoss = boss;
//    objectWM.MyInit(typeId);
//    return objectWM;
//};