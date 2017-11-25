// ===== 获取全局
const workspace = Function("return this")();

let actions = null;

/**
 * 让dva启用actions方法
 *
 * @param dva dva实例
 * @param verbose 是否启动废话模式
 * @returns {*}
 */
const ruaDva = (dva, verbose = false) => {
  // ===== 设置全局挂载点
  workspace.__rua_dva = dva;

  // ===== 检测dva实例是否正确传入
  if (!dva.model || !dva.start) {
    return console.error('[RUA-ERROR]Rua-Dva错误, 检查传入值, 请把dva实例rua进去');
  }

  // ===== 创建 actions 储存器
  dva.__rua_actions = {};

  // ===== 绑定 actions
  actions = dva.__rua_actions;

  // ===== 劫持 dva.model
  dva.__rua_model = dva.model;
  dva.model = (model) => {
    // 绑定 actions
    const { namespace: name, reducers, effects } = model;
    dva.__rua_actions[name] = { ...ruaReducers(reducers, dva, name), ...ruaReducers(effects, dva, name) };

    // 如果是verbose模式, 输出
    verbose && console.log(`[RUA-DVA]加载model: ${model.namespace}`);

    // 调用原来的dva.model
    return dva.__rua_model(model);
  };

  // ===== 劫持 dva.unmodel (未完成)
  dva.__rua_unmodel = dva.unmodel;
  dva.unmodel = (...p) => {
    // 调用原来的dva.unmodel
    return dva.__rua_unmodel(...p);
  };

  // ===== 劫持 dva.start
  dva.__rua_start = dva.start;
  dva.start = (el) => {
    // 调用原来的dva.start
    const output = dva.__rua_start(el);

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
  let actions = {};
  for (const reducer in reducers) {
    // if (Object.prototype.hasOwnProperty(reducers, reducer)) {
    actions[reducer] = (payload, extra) => {
      dva._store.dispatch({
        action: `${namespace}/${reducer}`,
        payload,
          ...extra,
    });
    };
    // }
  }

  console.log(actions);

  return actions;
}

export {
  ruaDva,
  actions,
};