/**
 * Created by Administrator on 2015/9/23.
 */

GameClient.ItemWM = GameClient.ObjectWM.extend({
    ctor: function (boss, typeId) {
        this._super(boss, typeId);

    },

    Destroy: function () {

        this._super();
    },

    ItemHitKid: function (kid) {

    },

    UpdateWM: function (dt) {
        if (this.m_sprite != null) {
            var x = 0;
            var y = 0;

            x = this.m_pBoss.GetRelativeX(this.m_posGlobal.x);
            y = this.m_pBoss.GetRelativeY(this.m_posGlobal.y);
            this.m_sprite.setPosition(x, y);
        }
    }
});