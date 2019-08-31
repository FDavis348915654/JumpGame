/**
 * Created by Administrator on 2015/9/21.
 */

GameClient.NotificationNodeWM = cc.Node.extend({
    m_adDuring: 0,
    m_bShowAd: false,

    m_bShake: false,
    m_shakeDuring: 0,
    m_shakeRange: 0,

    ctor: function () {
        this._super();

        this.m_adDuring = 0.0;
        this.m_bShowAd = false;
        this.m_shakeDuring = 0.0;
        this.m_shakeRange = 0;
        this.m_bShake = false;
        this.scheduleUpdate();
    },

    update: function (dt) {
        this._super(dt);
        // add some code
        this.UpdateShowAd(dt);
        this.UpdateShakeCamera(dt);
    },

    ShowAd: function (during) {
        this.m_bShowAd = true;
        this.m_adDuring = during;

        AdsControl.MyBanner();
    },
    
    CloseAd: function () {
        this.m_bShowAd = false;

        AdsControl.CloseMyBanner();
    },
    
    InitAd: function () {
        
    },

    // @private
    UpdateShowAd: function (dt) {
        if (this.m_bShowAd) {
            if (this.m_adDuring > 0.0) {
                this.m_adDuring -= dt;
            }
        else {
                this.CloseAd(); // CloseAd() have set m_bShowAd false
            }
        }
    },

    // @private
    UpdateShakeCamera: function (dt) {
        if (this.m_bShake) {
            if (this.m_shakeDuring > 0) {
                this.m_shakeDuring -= dt;
                if (cc.director.getRunningScene() != null) {
                    cc.director.getRunningScene().setPosition(GameClient.Common.Share().GetRandFloat(-this.m_shakeRange, this.m_shakeRange),
                        GameClient.Common.Share().GetRandFloat(-this.m_shakeRange, this.m_shakeRange));
                }
            }
            else
            {
                this.m_bShake = false;
                if (cc.director.getRunningScene() != null) {
                    cc.director.getRunningScene().setPosition(0, 0);
                }
            }
        }
    },
    
    ShakeCamera: function (during) {
        this.m_bShake = true;
        this.m_shakeDuring = during;
        this.m_shakeRange = 5;
    }
});