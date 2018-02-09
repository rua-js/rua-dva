// Third-party Dependency
// Self Dependency
import RuaDva from './RuaDva'
import { Actions } from './Types'
import {
  dvaLite as getDvaLite,
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
export const ruaDva = dvaInstance.rua

/**
 * Actions
 *
 * @type {Actions}
 */
export const actions = dvaInstance.actions

/**
 * Dva lite version (no-router-version)
 * @type {(options: any) => any}
 */
export const dvaLite = getDvaLite(ruaDva)
