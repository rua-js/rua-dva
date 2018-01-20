// Third-party Dependency
// import invariant from 'invariant'

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


export {
  ruaDva,
  actions,
}
