"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Abstractions_1 = require("rua-core/lib/Abstractions");
var RuaDva = (function (_super) {
    __extends(RuaDva, _super);
    function RuaDva() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = {};
        _this.booted = false;
        _this.isRuaPackage = true;
        _this.actions = {};
        _this.dispatch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.store._store).dispatch.apply(_a, args);
            var _a;
        };
        _this.oldModelPath = '__rua_model';
        _this.oldUnmodelPath = '__rua_unmodel';
        _this.oldStartPath = '__rua_start';
        return _this;
    }
    RuaDva.prototype.saveDispatch = function (dispatch) {
        this.dispatch = dispatch;
    };
    RuaDva.prototype.saveDva = function (dva) {
        this.store = dva;
        this.store[this.oldModelPath] = undefined;
        this.store[this.oldUnmodelPath] = undefined;
        this.store[this.oldStartPath] = undefined;
    };
    RuaDva.prototype.registerExistingModels = function () {
        var models = this.store._models;
        for (var model in models) {
            if (Object.prototype.hasOwnProperty.call(models, model)) {
                this.registerModel(models[model]);
            }
        }
    };
    RuaDva.prototype.registerModel = function (model) {
        var namespace = model.namespace, reducers = model.reducers, effects = model.effects;
        this.actions[namespace] = __assign({}, this.registerActions(namespace, reducers), this.registerActions(namespace, effects));
    };
    RuaDva.prototype.registerActions = function (namespace, reducers) {
        var _this = this;
        var actions = {};
        var _loop_1 = function (reducer) {
            if (Object.prototype.hasOwnProperty.call(reducers, reducer)) {
                actions[reducer] = function (payload, extra) {
                    return _this.dispatch(__assign({ payload: payload, type: namespace + "/" + reducer }, extra));
                };
            }
        };
        for (var reducer in reducers) {
            _loop_1(reducer);
        }
        return actions;
    };
    RuaDva.prototype.unregisterActions = function (namespace) {
        delete this.actions[namespace];
        return !this.actions[namespace];
    };
    RuaDva.prototype.interceptModel = function () {
        var _this = this;
        this.store[this.oldModelPath] = this.store.model;
        this.store.model = function (model) {
            _this.registerModel(model);
            return _this.store[_this.oldModelPath](model);
        };
    };
    RuaDva.prototype.interceptUnmodel = function () {
        var _this = this;
        this.store[this.oldUnmodelPath] = this.store.unmodel;
        this.store.unmodel = function (model) {
            var originalOutput = _this.store.__rua_unmodel(model);
            _this.unregisterActions(model);
            return originalOutput;
        };
    };
    RuaDva.prototype.interceptStart = function () {
        var _this = this;
        this.store[this.oldStartPath] = this.store.start;
        this.store.start = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var originalOutput = (_a = _this.store)[_this.oldStartPath].apply(_a, params);
            _this.saveDispatch(_this.store._store.dispatch);
            return originalOutput;
            var _a;
        };
    };
    RuaDva.prototype.rua = function (dva) {
        RuaDva.validateDva(dva);
        this.saveDva(dva);
        this.registerExistingModels();
        this.interceptModel();
        this.interceptUnmodel();
        this.interceptStart();
        this.booted = true;
        return this.booted;
    };
    RuaDva.validateDva = function (dva) {
    };
    return RuaDva;
}(Abstractions_1.AbstractRuaPackage));
exports.default = RuaDva;
