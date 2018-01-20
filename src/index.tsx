// Third-party Dependency
// import invariant from 'invariant'
import * as React from 'react'
// @ts-ignore
import { create } from 'dva-core'
import { Provider, connect } from 'react-redux'
// @ts-ignore
import global from 'global'

// Self Dependency
import RuaDva from './RuaDva'
import { Actions } from './Types'

// Rua Core Dependency
import { packager } from 'rua-core/lib'

/**
 * Note: IIFE used here
 *
 * @type {RuaDva}
 */
const dvaInstance: RuaDva = ((): any => {
  if (packager.hasPackage('rua-dva')) {
    return packager.getPackage('rua-dva')
  }

  return packager.registerIfNotRegistered('rua-dva', new RuaDva())
})()

/**
 * Rua Function
 *
 * @param dva
 * @returns {boolean}
 */
const ruaDva = (dva: any): boolean => {
  return dvaInstance.rua(dva)
}

/**
 * Actions
 *
 * @type {Actions}
 */
const actions = dvaInstance.actions

const dvaLite = (options: any) => {
  // create dva
  const app = create(options)
  // rua dva
  ruaDva(app)
  // avoid duplicate registration
  if (!global.registered) options.models.forEach((model: any) => app.model(model))
  global.registered = true
  // old start
  app.start()
  // store
  const store = app._store

  // new start
  app.start = (container: any) => () => (
    <Provider store={store}>
      {container}
    </Provider>
  )

  app.getStore = () => store

  return app
}


export {
  ruaDva,
  actions,
  dvaLite,
}
