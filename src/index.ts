// Third-party Dependency
// Self Dependency
import RuaDva from './RuaDva'
import { Actions } from './Types'
import {
  dvaLite as getDvaLite,
  dva as getDva,
} from './dva'
// Rua Core Dependency
import { packager } from 'rua-core/lib'

/**
 * Note: IIFE used here
 *
 * @type {RuaDva}
 */
const dvaInstance: RuaDva = <RuaDva>packager.registerIfNotRegistered('rua-dva', new RuaDva())

/**
 * Rua Function
 *
 * @param dva
 * @returns {boolean}
 */
const ruaDva = dvaInstance.rua.bind(dvaInstance)

/**
 * Actions
 *
 * @type {Actions}
 */
const actions = dvaInstance.actions

/**
 * Dva lite version (no-router-version)
 * @type {(options: any) => any}
 */
const dvaLite = getDvaLite(ruaDva)

/**
 * Dva original version
 *
 * @type {(options: any) => any}
 */
const dva = getDva(ruaDva)

export {
  actions,
  dva,
  dvaLite,
}