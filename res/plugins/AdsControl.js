/**
 * Created by Davis on 2015/8/25.
 */

var AdsControl = AdsControl || {};
var myBanner = myBanner || undefined;
var close_myBanner = close_myBanner || undefined;
var myqp = myqp || undefined;

AdsControl.m_isShowBanner = false;

AdsControl.MyBanner = function () {
    if (!AdsControl.m_isShowBanner) {
        AdsControl.m_isShowBanner = true;
        if (myBanner != undefined) {
            try {
                myBanner();
            }
            catch (e) {
                console.warn("myBanner(), error");
            }
        }
    }
};

AdsControl.CloseMyBanner = function () {
    if (AdsControl.m_isShowBanner) {
        AdsControl.m_isShowBanner = false;
        if (close_myBanner != undefined) {
            try {
                close_myBanner();
            }
            catch (e) {
                console.warn("close_myBanner(), error");
            }
        }
    }
};

AdsControl.Myqp = function () {
    if (myqp != undefined) {
        try {
            myqp();
        }
        catch (e) {
            console.warn("myqp(), error");
        }
    }
};
