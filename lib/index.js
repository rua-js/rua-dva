"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RuaDva_1 = require("./RuaDva");
var lib_1 = require("rua-core/lib");
var dvaInstance = (function () {
    if (lib_1.packager.hasPackage('rua-dva')) {
        return lib_1.packager.getPackage('rua-dva');
    }
    return lib_1.packager.registerIfNotRegistered('rua-dva', new RuaDva_1.default());
})();
var ruaDva = function (dva) {
    return dvaInstance.rua(dva);
};
exports.ruaDva = ruaDva;
var actions = dvaInstance.actions;
exports.actions = actions;
