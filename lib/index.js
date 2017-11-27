'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// ===== 获取全局
var workspace = Function("return this")();

var actions = null;

/**
 * 让dva启用actions方法
 *
 * @param dva dva实例
 * @param verbose 是否启动废话模式
 * @returns {*}
 */
var ruaDva = function ruaDva(dva) {
  var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  // ===== 设置全局挂载点
  workspace.__rua_dva = dva;

  // ===== 检测dva实例是否正确传入
  if (!dva.model || !dva.start) {
    return console.error('[RUA-ERROR]Rua-Dva错误, 检查传入值, 请把dva实例rua进去');
  }

  // ===== 创建 actions 储存器
  dva.__rua_actions = {};

  // ===== 绑定 actions
  exports.actions = actions = dva.__rua_actions;

  // ===== 劫持 dva.model
  dva.__rua_model = dva.model;
  dva.model = function (model) {
    // 绑定 actions
    var name = model.namespace,
        reducers = model.reducers,
        effects = model.effects;

    dva.__rua_actions[name] = _extends({}, ruaReducers(reducers, dva, name), ruaReducers(effects, dva, name));

    // 如果是verbose模式, 输出
    verbose && console.log('[RUA-DVA]\u52A0\u8F7Dmodel: ' + model.namespace);

    // 调用原来的dva.model
    return dva.__rua_model(model);
  };

  // ===== 劫持 dva.unmodel (未完成)
  dva.__rua_unmodel = dva.unmodel;
  dva.unmodel = function () {
    // 调用原来的dva.unmodel
    return dva.__rua_unmodel.apply(dva, arguments);
  };

  // ===== 劫持 dva.start
  dva.__rua_start = dva.start;
  dva.start = function (el) {
    // 调用原来的dva.start
    var output = dva.__rua_start(el);

    // 将dispatch暴露出来
    dva._dispatch = dva._store._dispatch;
    if (!dva.__rua_actions.dispatch) dva.__rua_actions.dispatch = dva._store._dispatch;

    return output;
  };

  // 如果是verbose模式, 输出
  verbose && console.log('[OK]Rua-Dva加载成功.');

  return dva;
};

/**
 * 将reducer或者effect转换成action
 *
 * @param reducers dva的reducer或effect
 * @param dva dva实例
 * @returns {{}}
 */
function ruaReducers(reducers, dva, namespace) {
  var actions = {};

  var _loop = function _loop(reducer) {
    // if (Object.prototype.hasOwnProperty(reducers, reducer)) {
    actions[reducer] = function (payload, extra) {
      dva._store.dispatch(_extends({
        type: namespace + '/' + reducer,
        payload: payload
      }, extra));
    };
    // }
  };

  for (var reducer in reducers) {
    _loop(reducer);
  }

  return actions;
}

exports.ruaDva = ruaDva;
exports.actions = actions;
