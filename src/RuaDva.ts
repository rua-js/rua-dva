// Third-party Dependency
// import invariant from 'invariant'

// Self Dependency
import { Actions } from './Types'

// Rua Core Dependency
import { HasStore } from 'rua-core/lib/Contracts'
import { Store } from 'rua-core/lib/Types'
import { AbstractPackage } from 'rua-core/lib/Abstractions'

class RuaDva extends AbstractPackage implements HasStore {

  public store: Store = {}

  public booted: boolean = false

  public actions: Actions = {}

  protected dispatch: any = () => console.error('[Rua.js][dva]Dispatch method is not bound yet')

  protected readonly originalModelPath: string = '__rua_model'

  protected readonly originalUnmodelPath: string = '__rua_unmodel'

  protected readonly originalStartPath: string = '__rua_start'


  // -------------------- getter, setter, checker -------------------
  public saveDispatch(dispatch: any): void {
    this.dispatch = dispatch
  }

  /**
   * Store dva into 'rua-dva' instance
   *
   * @param {object} dva
   */
  protected saveDva (dva: any): void {
    // save to store
    this.store = dva
    // initialize property
    this.store[this.originalModelPath] = undefined
    this.store[this.originalUnmodelPath] = undefined
    this.store[this.originalStartPath] = undefined
  }

  // --------------------    static functions     -------------------
  /**
   * Verify dva instance
   *
   * @param dva
   */
  protected static validateDva (dva: any): void {
    // check model/start/unmodel method
    // invariant(
    //   dva.model && dva.start && dva.unmodel,
    //   `[Rua.js][dva]Invalid dva is given.`
    // )
  }

  protected registerExistingModels (): void {
    const models = this.store._models
    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        this.registerModel(models[model])
      }
    }
  }

  protected registerModel(model: any): void {
    const { namespace, reducers, effects } = model
    this.actions[namespace] = {
      ...this.registerActions(namespace, reducers),
      ...this.registerActions(namespace, effects),
    }
  }

  protected registerActions(namespace: string, reducers: any): object {
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

  protected unregisterActions(namespace: string): boolean {
    delete this.actions[namespace]
    return !this.actions[namespace]
  }

  protected interceptModel(): void {
    // new location for original model method
    this.store[this.originalModelPath] = this.store.model
    // new model method for dva
    this.store.model = (model: any) => {
      this.registerModel(model)
      return this.store[this.originalModelPath](model)
    }
  }

  protected interceptUnmodel(): void {
    // new location for original unmodel method
    this.store[this.originalUnmodelPath] = this.store.unmodel
    // new unmodel method for dva
    this.store.unmodel = (model: any) => {
      const originalOutput = this.store.__rua_unmodel(model)
      // remove action
      this.unregisterActions(model)

      return originalOutput
    }
  }

  protected interceptStart(): void {
    // new location for original start method
    this.store[this.originalStartPath] = this.store.start
    // new start method for dva
    this.store.start = (...params: any[]) => {
      const originalOutput = this.store[this.originalStartPath](...params)
      // save dispatch function
      this.saveDispatch(this.store._store.dispatch)
      return originalOutput
    }
  }


  public rua(dva: any): boolean {
    RuaDva.validateDva(dva)
    this.saveDva(dva)
    this.registerExistingModels()
    this.interceptModel()
    this.interceptUnmodel()
    this.interceptStart()
    this.booted = true
    return this.booted
  }
}


export default RuaDva
