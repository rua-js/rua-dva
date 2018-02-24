// Third-party Dependency
// Self Dependency
import { Actions } from './Types'
// Rua Core Dependency
import { HasStore } from 'rua-core/lib/Contracts'
import { Store } from 'rua-core/lib/Types'
import { AbstractRuaPackage } from 'rua-core/lib/Abstractions'

class RuaDva extends AbstractRuaPackage implements HasStore
{

  /**
   * The dva instance
   *
   * @type {object}
   */
  public store: Store = {}

  /**
   * RuaDva actions
   *
   * @type {object}
   */
  public actions: Actions = {}

  /**
   * Dispatch function of dva store
   *
   * @param args
   * @returns {any}
   */
  protected dispatch: Function = (...args: any[]) => this.store._store.dispatch(...args)

  /**
   * Old function of model
   *
   * @type {string}
   */
  protected readonly oldModelPath: string = '__rua_model'

  /**
   * Old function of unmodel
   *
   * @type {string}
   */
  protected readonly oldUnmodelPath: string = '__rua_unmodel'

  /**
   * Old function of start
   *
   * @type {string}
   */
  protected readonly oldStartPath: string = '__rua_start'


  // -------------------- getter, setter, checker -------------------

  // --------------------    static functions     -------------------
  /**
   * Verify dva instance
   *
   * @param dva
   */
  protected static validateDva(dva: any): void
  {
    // check model/start/unmodel method
    // invariant(
    //   dva.model && dva.start && dva.unmodel,
    //   `[Rua.js][dva]Invalid dva is given.`
    // )
  }

  /**
   * Save dispatch function
   *
   * @param dispatch
   */
  public saveDispatch(dispatch: Function): void
  {
    this.dispatch = dispatch
  }

  /**
   * Process dva instance
   *
   * @param dva
   * @returns {boolean}
   */
  public rua(dva: any): boolean
  {
    RuaDva.validateDva(dva)
    this.saveDva(dva)
    this.registerExistingModels()
    this.interceptModel()
    this.interceptUnmodel()
    this.interceptStart()
    this.booted = true
    return this.booted
  }

  /**
   * Store dva into 'rua-dva' instance
   *
   * @param {object} dva
   */
  protected saveDva(dva: any): void
  {
    // save to store
    this.store = dva
    // initialize property
    this.store[this.oldModelPath] = undefined
    this.store[this.oldUnmodelPath] = undefined
    this.store[this.oldStartPath] = undefined
  }

  /**
   * Register existing models in the dva instance
   *
   */
  protected registerExistingModels(): void
  {
    const models = this.store._models
    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        this.registerModel(models[model])
      }
    }
  }

  /**
   * Register a model to actions
   *
   * @param model
   */
  protected registerModel(model: any): void
  {
    const { namespace, reducers, effects } = model
    this.actions[namespace] = {
      ...this.registerActions(namespace, reducers),
      ...this.registerActions(namespace, effects),
    }
  }

  /**
   * Register an action to a model
   *
   * @param {string} namespace
   * @param reducers
   * @returns {object}
   */
  protected registerActions(namespace: string, reducers: any): object
  {
    const actions: Actions = {}
    for (const reducer in reducers) {
      if (Object.prototype.hasOwnProperty.call(reducers, reducer)) {
        actions[reducer] = (payload: object, extra: object): any => {
          return this.dispatch({
            payload,
            type: `${namespace}/${reducer}`,
            ...extra,
          })
        }
      }
    }

    return actions
  }

  /**
   * Unregister an action from a model
   *
   * @param {string} namespace
   * @returns {boolean}
   */
  protected unregisterActions(namespace: string): boolean
  {
    delete this.actions[namespace]
    return !this.actions[namespace]
  }

  /**
   * Hijack old model function. New model function can register actions automatically
   */
  protected interceptModel(): void
  {
    // new location for original model method
    this.store[this.oldModelPath] = this.store.model
    // new model method for dva
    this.store.model = (model: any) => {
      this.registerModel(model)
      return this.store[this.oldModelPath](model)
    }
  }

  /**
   * Hijack old unmodel function. New unmodel function can unregister actions automatically
   */
  protected interceptUnmodel(): void
  {
    // new location for original unmodel method
    this.store[this.oldUnmodelPath] = this.store.unmodel
    // new unmodel method for dva
    this.store.unmodel = (model: any) => {
      const originalOutput = this.store.__rua_unmodel(model)
      // remove action
      this.unregisterActions(model)

      return originalOutput
    }
  }

  /**
   * Hijack old start function in order to get the dispatch function of the store
   */
  protected interceptStart(): void
  {
    // new location for original start method
    this.store[this.oldStartPath] = this.store.start
    // new start method for dva
    this.store.start = (...params: any[]) => {
      const originalOutput = this.store[this.oldStartPath](...params)
      // save dispatch function
      this.saveDispatch(this.store._store.dispatch)
      return originalOutput
    }
  }
}


export default RuaDva
