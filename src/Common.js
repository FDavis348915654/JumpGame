/**
 * Created by Administrator on 2015/9/21.
 */

// 公共方法和变量
GameClient.Common = function () {
    var m_fileJsonObj = null; // 一个 json 对象，私有，配合 BeginFile() 等函数的使用
    var m_stirngsJsonObj = null;

    // 初始化，由单例调用
    this.OnInit = function () {

    };

    // 摧毁，由单例调用
    this.OnDestroy = function () {

    };

    // 这个函数在 js 下用不到
//    this.ChangeSceneClean = function () {
//
//    };

    // 数据统计相关操作 // 返回值用于检测是否初始化成功
    this.DataCountInit = function () {
        return DataCount.DataCountInit(['DCAB28E3F84B6C42CC893AF4FF1FF768', GameClient.GAME_VERSION]);
    };

//    MyClientGlobal.Com_Common.Share().DataCountOnEvent(["setNickName",
//        {"originName": strOriginName, "nickName": strNickName, "date": MyClientGlobal.Com_Common.Share().GetNowTimeStr()}]);
    // 数据统计，上报事件
    this.DataCountOnEvent = function (args) {
        DataCount.DataCountOnEvent(args);
    };

    this.GetNowTimeStr = function () {
        var date = new Date();
        var mouthStr = "";
        var dayStr = "";
        var hourStr = "";
        var minStr = "";
        var secondStr = "";

        if (date.getMonth() + 1 < 10) {
            mouthStr = "0" + (date.getMonth() + 1);
        }
        else {
            mouthStr = date.getMonth() + 1;
        }

        if (date.getDate() < 10) {
            dayStr = "0" + date.getDate();
        }
        else {
            dayStr = date.getDate();
        }

        if (date.getHours() < 10) {
            hourStr = "0" + date.getHours();
        }
        else {
            hourStr = date.getHours();
        }

        if (date.getMinutes() < 10) {
            minStr = "0" + date.getMinutes();
        }
        else {
            minStr = date.getMinutes();
        }

        if (date.getSeconds() < 10) {
            secondStr = "0" + date.getSeconds();
        }
        else {
            secondStr = date.getSeconds();
        }

        return "" + date.getFullYear() + "-" + mouthStr + "-" + dayStr +
            " " + hourStr + ":" + minStr + ":" + secondStr;
    };

    this.QuitGame = function () {
        cc.log("QuitGame()");
    };

    this.ModeFloat = function (num, mode) { // for example, 12 / 8 = 1 ... 4, cout 4
        if (mode != 0.0) {
            return num - mode * ~~(num / mode);
        }
        else {
            return 0;
        }
    };

    this.GetRandFloat = function (min, max) {
        return min + Math.random() * (max - min);
    };

    this.GetRandInt = function (min, max) {
        return min + ~~(Math.random() * (max - min));
    }

    this.CollideRectAndRect = function (centerX1, centerY1, w1, h1, centerX2, centerY2, w2, h2)
    {
        if ((centerY1 + h1 / 2 < centerY2 - h2 / 2) || (centerY1 - h1 / 2 > centerY2 + h2 / 2)) {
            return false;
        }
        else if ((centerX1 + w1 / 2 < centerX2 - w2 / 2) || (centerX1 - w1 / 2 > centerX2 + w2 / 2)) {
            return false;
        }
        else {
            return true;
        }
    };

    this.LoadGameCountDataFromFile = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        GameClient.GameData.Share().m_highScore = this.GetFileData(fileName, "m_highScore", 0);
        GameClient.GameData.Share().m_superHighScore = this.GetFileData(fileName, "m_superHighScore", 0);

        GameClient.GameData.Share().m_highLevel = this.GetFileData(fileName, "m_highLevel", 1);
        GameClient.GameData.Share().m_superHighLevel = this.GetFileData(fileName, "m_superHighLevel", 1);

        GameClient.GameData.Share().m_gold = this.GetFileData(fileName, "m_gold", 0);
    };

    this.SaveGameCountDataToFile = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        this.SetFileData(fileName, "m_highScore", GameClient.GameData.Share().m_highScore);
        this.SetFileData(fileName, "m_superHighScore", GameClient.GameData.Share().m_superHighScore);

        this.SetFileData(fileName, "m_highLevel", GameClient.GameData.Share().m_highLevel);
        this.SetFileData(fileName, "m_superHighLevel", GameClient.GameData.Share().m_superHighLevel);

        this.SetFileData(fileName, "m_gold", GameClient.GameData.Share().m_gold);
        this.EndFile(fileName);
    };

    this.GetString = function (key) {
        if (m_stirngsJsonObj == null) {
            m_stirngsJsonObj = cc.loader.getRes("res/strings.json");
        }
        return m_stirngsJsonObj[key];
    };

    this.LoadSoundSignFromFile = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        GameClient.GameData.Share().m_bSound = this.GetFileData(fileName, "m_bSound", GameClient.GameData.Share().m_bSound);
        return GameClient.GameData.Share().m_bSound;
    };

    this.SaveSoundSignToFile = function (soundSign) {
        var fileName = "count_1.info";

        GameClient.GameData.Share().m_bSound = soundSign;
        this.BeginFile(fileName);
        this.SetFileData(fileName, "m_bSound", GameClient.GameData.Share().m_bSound);
        this.EndFile(fileName);
    };

    this.ChangeScene = function (scene, during) {
        var transScene = null;

        transScene = new cc.TransitionFade(during, scene);
        cc.director.runScene(transScene);
    };

    this.IsFirstGame = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        return this.GetFileData(fileName, "bFirstGameSign", true);
    };

    this.SetHaveFirstGameSign = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        this.SetFileData(fileName, "bFirstGameSign", false);
        this.EndFile(fileName);
    };

    this.LoadControlMode = function () {
        var fileName = "count_1.info";

        this.BeginFile(fileName);
        GameClient.GameData.Share().m_gameControlMode = this.GetFileData(fileName, "m_gameControlMode", GameClient.GameData.Share().m_gameControlMode);
        cc.log("LoadControlMode(), m_gameControlMode: " + GameClient.GameData.Share().m_gameControlMode);
        return GameClient.GameData.Share().m_gameControlMode;
    };

    this.SaveControlMode = function (mode) {
        cc.log("SaveControlMode(), mode: " + mode);
        var fileName = "count_1.info";

        GameClient.GameData.Share().m_gameControlMode = mode;
        this.BeginFile(fileName);
        this.SetFileData(fileName, "m_gameControlMode", GameClient.GameData.Share().m_gameControlMode);
        this.EndFile(fileName);
    };

    this.InitAd = function () {

    };

    this.ShowAd = function (during) {
        this.ShareNotificationNode().ShowAd(during);
    };

    this.CloseAd = function () {
        this.ShareNotificationNode().CloseAd();
    };

    this.GetGameVersion = function () {
        return GameClient.GAME_VERSION;
    };

    this.GetGameName = function () {
        return "逃离火山";
    };

    this.GetGamePackageName = function () {
        return GameClient.PACKAGE_NAME;
    };

    this.ShakeCamera = function (during) {
//        this.ShakeCamera(during);
        this.ShareNotificationNode().ShakeCamera(during);
    };

    // 获得全局节点，全局节点不会因为切换场景而被移除
    this.ShareNotificationNode = function () { // 获得一个全局的节点
        var node = cc.director.getNotificationNode();

        if (node == null) {
            cc.log("first share notification node");
            node = new GameClient.NotificationNodeWM();
            cc.director.setNotificationNode(node);
            node.onEnter();
            node.setLocalZOrder(500);
        }

        return node;
    };

    // 设置 ccui 节点的布局，自动排版对齐，alignH 的 0、1、2 分别是左、中、右； alignV 的 0、1、2 分别是下、中、上
    this.LoadUINodeAndLayout = function (rootNode, resPath, enableActived, alignH, alignV) { // 加入一个 cocostudio 节点并按照编辑器编辑好的规则进行自适应
        ccui.helper.changeLayoutSystemActiveState(true);
        if (enableActived == undefined) {
            enableActived = false;
        }

        if (alignH == undefined) {
            alignH = 0;
        }
        if (alignV == undefined) {
            alignV = 0;
        }

        var json = ccs.load(resPath); // 载入 ui

        if (json == null) {
            return null;
        }
        var node = json.node;

        if (node == null) {
            return null;
        }

        if (rootNode != null) {
            rootNode.addChild(node);
        }
        node.m_alignH = alignH;
        node.m_alignV = alignV;

        // 先进行一遍自动对齐
        if (enableActived) {
            var winSize = cc.winSize;
            var posX = 0;
            var posY = 0;

            switch (node.m_alignH) {
                case 0:
                    posX = 0;
                    break;
                case 1:
                    posX = winSize.width / 2;
                    break;
                case 2:
                    posX = winSize.width;
                    break;

                default:
                    break;
            }
            switch (node.m_alignV) {
                case 0:
                    posY = 0;
                    break;
                case 1:
                    posY = winSize.height / 2;
                    break;
                case 2:
                    posY = winSize.height;
                    break;

                default:
                    break;
            }
            node.setContentSize(winSize.width, winSize.height);
            node.setPosition(posX, posY);
            ccui.helper.doLayout(node);

            node.schedule(function (dt) { // 加一个定时器，持续执行自动对齐
                var winSize = cc.winSize;
                var nodeSize = this.getContentSize();

                if (winSize.width != nodeSize.width || winSize.height != nodeSize.height) {
                    var posX = 0;
                    var posY = 0;

                    node.m_alignH = alignH;
                    node.m_alignV = alignV;
                    switch (node.m_alignH) {
                        case 0:
                            posX = 0;
                            break;
                        case 1:
                            posX = winSize.width / 2;
                            break;
                        case 2:
                            posX = winSize.width;
                            break;

                        default:
                            break;
                    }
                    switch (node.m_alignV) {
                        case 0:
                            posY = 0;
                            break;
                        case 1:
                            posY = winSize.height / 2;
                            break;
                        case 2:
                            posY = winSize.height;
                            break;

                        default:
                            break;
                    };
                    node.setContentSize(winSize.width, winSize.height);
                    node.setPosition(posX, posY);
                    ccui.helper.doLayout(node);
                }
            }, 2);
        }

        return node;
    };

    // 游戏数据相关操作
    this.BeginFile = function (fileName) {
        if (m_fileJsonObj == null) {
            m_fileJsonObj = JSON.parse('{}'); // JSON.parse(string) @return jsonData
        }

        if (!m_fileJsonObj[fileName]) {
            var jsonStr = cc.sys.localStorage.getItem("jsonFileStrData: " + fileName);

            if (!jsonStr) {
                jsonStr = '{}';
            }
            m_fileJsonObj[fileName] = JSON.parse(jsonStr);
        }
    };

    this.GetFileData = function (fileName, key, defaultData) { // defaultData 不能是对象
        var data = m_fileJsonObj[fileName][key];

        if (data === undefined) { // 这里要注意
            return defaultData;
        }
        else {
            return data;
        }
    };

    this.SetFileData = function (fileName, key, data) { // data 不能是对象
        m_fileJsonObj[fileName][key] = data;
    };

    this.RemoveFileData = function (fileName, key) {
        if (m_fileJsonObj[fileName] != null) { // 为了防止调用了 RemoveAllFileData() 之后再调用这个可能会出错的情况
            delete m_fileJsonObj[fileName][key];
        }
    }

    this.RemoveAllFileData = function (fileName) {
        delete m_fileJsonObj[fileName];
    };

    this.EndFile = function (fileName) {
        var jsonStr = JSON.stringify(m_fileJsonObj[fileName]); // JSON.stringify(jsonData) @return string

        cc.sys.localStorage.setItem("jsonFileStrData: " + fileName, jsonStr);
    };

    // 目前只能分割 %s
    this.FormatStr = function () {
        var str = arguments[0];
        var strList = str.split("%s");
        var strOut = "";

        for (var i = 0; i < strList.length; i++) {
            strOut += strList[i] + (arguments[i + 1] != undefined ? arguments[i + 1] : "");
        }
        return strOut;
    }
};

// 获得 Common 的单例
GameClient.Common.Share = function () { // 静态方法，获得 Common 的单例
    if (GameClient.Common.sm_share == null) {
        cc.log("Common, init");
        GameClient.Common.sm_share = new GameClient.Common();
        GameClient.Common.sm_share.OnInit();
    }

    return GameClient.Common.sm_share;
};

// 摧毁 Common 的单例，一般情况不必调用
GameClient.Common.Destroy = function () { // 静态方法，摧毁 Common 单例，目前这个方法可不调用
    if (GameClient.Common.sm_share != null) {
        cc.log("Common, destroy");
        GameClient.Common.sm_share.OnDestroy();
        GameClient.Common.sm_share = null;
    }
};