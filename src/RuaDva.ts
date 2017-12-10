// Third-party Dependency
import invariant from 'invariant'

// Self Dependency
import { Actions } from './Types'

// Rua Core Dependency
import { IsPackage, CanBoot, HasStore } from 'rua-core/lib/Contracts'
import { Store } from 'rua-core/lib/Types'
import { AbstractPackage } from 'rua-core/lib/Abstractions'

class RuaDva extends AbstractPackage implements HasStore {

  public store: Store = {}

  public booted: boolean = false

  public actions: Actions = {}

  protected dispatch: any = dva => console.error('[Rua.js][dva]Dispatch method is not bound yet')

  protected actionsPath: string = '__rua_actions'

  protected originalModelPath: string = '__rua_model'

  protected originalUnmodelPath: string = '__rua_unmodel'

  protected originalStartPath: string = '__rua_start'

  /**
   * Verify dva instance
   *
   * @param dva
   */
  protected validateDva (dva: any) {
    // check model/start/unmodel method
    invariant(
      dva.model && dva.start && dva.unmodel,
      `[Rua.js][dva]Invalid dva is given.`
    )
  }

  /**
   * Store dva into 'rua-dva' instance
   *
   * @param {object} dva
   */
  protected storeDva = (dva: any) => {
    this.store = dva
  }

  protected registerExistingModels = () => {
    const models = this.store._models
    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        this.registerModel(models[model])
      }
    }
  }

  protected registerModel(model: any) {
    const { namespace, reducers, effects } = model
    this.store[this.actionsPath][namespace] = {
      ...this.registerActions(namespace, reducers),
      ...this.registerActions(namespace, effects),
    }
  }

  protected registerActions(namespace: string, reducers: any): object {
    let actions: Actions = {}
    for (const reducer in reducers) {
      if (Object.prototype.hasOwnProperty.call(reducers, reducer)) {
        actions[reducer] = (payload: object, extra: object): any => {
          return this.dispatch({
            type: `${namespace}/${reducer}`,
            payload,
            ...extra,
          });
        }
      }
    }

    return actions
  }

  protected unregisterActions(namespace) {

  }

  protected interceptModel(): any {
    // new location for original model method
    this.store[this.originalModelPath] = this.store.model
    // new model method for dva
    this.store.model = (model: any) => {
      this.registerModel(model)
      return this.store[this.originalModelPath](model)
    }
  }

  protected interceptUnmodel(): any {
    // todo: need finish
    // new location for original unmodel method
    this.store[this.originalUnmodelPath] = this.store.unmodel
    // new unmodel method for dva
    this.store.unmodel = (model: any) => this.store.__rua_unmodel(model)
  }

  protected interceptStart(): any {
    // todo: need finish
    // new location for original start method
    this.store[this.originalStartPath] = this.store.start
    // new start method for dva
    this.store.start = (...params: any[]) => {
      return this.store[this.originalStartPath](...params)
    }
  }


  public rua(): boolean {
    this.registerExistingModels()
    this.interceptModel()
    this.interceptUnmodel()
    this.interceptStart()
    this.booted = true
    return this.booted
  }
}


export default RuaDva