"use strict";
exports.__esModule = true;
exports.StorageContext = void 0;
var logger_1 = require("../../logger");
var acl = require('async-local-storage');
acl.enable();
var LocalStorageContext = /** @class */ (function () {
    function LocalStorageContext() {
    }
    LocalStorageContext.prototype.scope = function () {
        try {
            acl.scope();
        }
        catch (err) {
            logger_1.Logger.warn("Error while creating new log scope");
        }
    };
    LocalStorageContext.prototype.setContext = function (namespace, context) {
        acl.set(namespace, context);
    };
    LocalStorageContext.prototype.getContext = function (namespace) {
        return acl.get(namespace) || {};
    };
    LocalStorageContext.prototype.setContextValue = function (key, value, namespace) {
        var context = acl.get(namespace) || {};
        context[key] = value;
        this.setContext(namespace, context);
    };
    LocalStorageContext.prototype.getContextValue = function (key, namespace) {
        var context = acl.get(namespace) || {};
        return context[key];
    };
    return LocalStorageContext;
}());
var StorageContext = new LocalStorageContext();
exports.StorageContext = StorageContext;
