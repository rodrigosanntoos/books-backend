"use strict";
exports.__esModule = true;
exports.LoggerContext = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var cls_1 = require("./../cls");
var LoggerContext = /** @class */ (function () {
    function LoggerContext() {
    }
    /**
     * Sets correlation id
     * The setted correlationId will be printed in every application log
     * @param correlationId: {string}
     */
    LoggerContext.setCorrelationId = function (correlationId) {
        cls_1.StorageContext.scope();
        cls_1.StorageContext.setContextValue('correlationId', correlationId, cls_1.ClsContextNamespace.LOGGER);
    };
    /**
     * Gets correlation id
     * @returns correlation id {string}
     */
    LoggerContext.getCorrelationId = function () {
        var value = cls_1.StorageContext.getContextValue('correlationId', cls_1.ClsContextNamespace.LOGGER);
        return value;
    };
    /**
     * Extra data
     * You can set some extra info to you log
     * For Example: You can specify the user loggedId so everytime your user has logged in just add the id here and a key then in every appliction log the user id will be logged
     * @param key: {string}
     * @param value: {string}
     */
    LoggerContext.setLogInfoData = function (key, value) {
        var data = LoggerContext.getLogInfoData();
        data[key] = value;
        cls_1.StorageContext.setContextValue('extraLogInfo', data, cls_1.ClsContextNamespace.LOGGER);
    };
    /**
     * Extra data
     * Returns the storaged extra log data
     */
    LoggerContext.getLogInfoData = function () {
        var data = cls_1.StorageContext.getContextValue('extraLogInfo', cls_1.ClsContextNamespace.LOGGER);
        return data || {};
    };
    return LoggerContext;
}());
exports.LoggerContext = LoggerContext;
