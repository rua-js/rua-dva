import { Actions } from './Types';
import { HasStore } from 'rua-core/lib/Contracts';
import { Store } from 'rua-core/lib/Types';
import { AbstractPackage } from 'rua-core/lib/Abstractions';
declare class RuaDva extends AbstractPackage implements HasStore {
    store: Store;
    booted: boolean;
    actions: Actions;
    protected dispatch: any;
    protected readonly originalModelPath: string;
    protected readonly originalUnmodelPath: string;
    protected readonly originalStartPath: string;
    saveDispatch(dispatch: any): void;
    protected saveDva(dva: any): void;
    protected static validateDva(dva: any): void;
    protected registerExistingModels(): void;
    protected registerModel(model: any): void;
    protected registerActions(namespace: string, reducers: any): object;
    protected unregisterActions(namespace: string): boolean;
    protected interceptModel(): void;
    protected interceptUnmodel(): void;
    protected interceptStart(): void;
    rua(dva: any): boolean;
}
export default RuaDva;
