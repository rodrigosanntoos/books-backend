"use strict";
exports.__esModule = true;
exports.LoggerBuilder = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var winston_1 = require("winston");
var uuid_1 = require("uuid");
var environment_1 = require("./../env/environment");
var loger_context_1 = require("../log/loger-context");
var LoggerBuilder = /** @class */ (function () {
    function LoggerBuilder() {
    }
    /**
     * You can specify a custom json formatter function that will be called everytime before print a log
     * @param [customFormat]
     * @returns instance {Logger}
     */
    LoggerBuilder.getLogger = function (custom) {
        return process.env.NODE_ENV == environment_1.Environment.LOCAL
            ? LoggerBuilder.createLocalWinstonLogger(custom)
            : LoggerBuilder.createDefaultWinstonLogger(custom);
    };
    /**
     * Creates local winston logger
     * @returns local winston logger {Logger}
     */
    LoggerBuilder.createLocalWinstonLogger = function (custom) {
        if (custom === void 0) { custom = LoggerBuilder.defaultCustom; }
        return winston_1.createLogger({
            level: process.env.LOG_LEVEL || 'debug',
            format: winston_1.format.combine(winston_1.format.json(), LoggerBuilder.customJsonFormat(custom), winston_1.format.timestamp(), winston_1.format.prettyPrint()),
            transports: [new winston_1.transports.Console()]
        });
    };
    /**
     * Creates aws winston logger
     * @returns aws winston logger {Logger}
     */
    LoggerBuilder.createDefaultWinstonLogger = function (custom) {
        if (custom === void 0) { custom = LoggerBuilder.defaultCustom; }
        return winston_1.createLogger({
            level: process.env.LOG_LEVEL || 'debug',
            format: winston_1.format.combine(winston_1.format.timestamp(), LoggerBuilder.customJsonFormat(custom), winston_1.format.json()),
            transports: [new winston_1.transports.Console()]
        });
    };
    /**
     * Customs json format
     * @returns
     */
    LoggerBuilder.customJsonFormat = function (custom) {
        if (custom === void 0) { custom = LoggerBuilder.defaultCustom; }
        var customJson = winston_1.format(custom);
        return customJson();
    };
    LoggerBuilder.defaultCustom = function (info, opts) {
        if (opts.yell) {
            info.message = info.message.toUpperCase();
        }
        else if (opts.whisper) {
            info.message = info.message.toLowerCase();
        }
        info.level = info.level.toUpperCase();
        info.level = info.level.toUpperCase();
        info.correlationId = loger_context_1.LoggerContext.getCorrelationId() || uuid_1.v4();
        var extraData = loger_context_1.LoggerContext.getLogInfoData();
        if (extraData) {
            Object.keys(extraData).forEach(function (key) {
                info[key] = extraData[key];
            });
        }
        var text;
        for (var _i = 0, _a = info.message; _i < _a.length; _i++) {
            var item = _a[_i];
            if (typeof item == 'string') {
                text = "" + (!text ? item : text + " " + item);
            }
            else if (Array.isArray(item)) {
                var _loop_1 = function (arrayItem) {
                    if (arrayItem instanceof TypeError) {
                        text = "" + (!text ? item : text + " " + arrayItem.message);
                        info['stackError'] = arrayItem.stack;
                    }
                    else if (typeof arrayItem == 'string') {
                        text = "" + (!text ? arrayItem : text + " " + arrayItem);
                    }
                    else {
                        if (Object.keys(arrayItem).length > 0) {
                            Object.keys(arrayItem).forEach(function (key) {
                                info[key] = arrayItem[key] === null || arrayItem[key] === undefined ? '' : arrayItem[key];
                            });
                        }
                        else {
                            info['__data'] = arrayItem;
                        }
                    }
                };
                for (var _b = 0, item_1 = item; _b < item_1.length; _b++) {
                    var arrayItem = item_1[_b];
                    _loop_1(arrayItem);
                }
            }
        }
        delete info.message;
        info.message = text;
        return info;
    };
    return LoggerBuilder;
}());
exports.LoggerBuilder = LoggerBuilder;
