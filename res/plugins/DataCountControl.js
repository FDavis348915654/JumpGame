var DataCount = DataCount || {};
var DCAgent = DCAgent || undefined;

DataCount.DataCountInit = function (args) {
    if (DCAgent != undefined) {
        try {
            DCAgent.init({"appId": args[0], "appVer": args[1], "interval": 15, "excludes": [], "virus": false}, function () {
                console.log('data count has init.');
            });
            return true;
        }
        catch (e) {
            DCAgent = undefined;
            return false;
        }
    }
    DCAgent = undefined;
    return true;
};

DataCount.DataCountOnEvent = function (args) {
    if (DCAgent != undefined) {
        DCAgent.onEvent(args[0], 1, args[1]);
    }
};