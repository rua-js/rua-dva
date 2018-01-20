import { Actions } from './Types';
import { HasStore } from 'rua-core/lib/Contracts';
import { Store } from 'rua-core/lib/Types';
import { AbstractRuaPackage } from 'rua-core/lib/Abstractions';
declare class RuaDva extends AbstractRuaPackage implements HasStore {
    store: Store;
    booted: boolean;
    isRuaPackage: boolean;
    actions: Actions;
    protected dispatch: any;
    protected readonly oldModelPath: string;
    protected readonly oldUnmodelPath: string;
    protected readonly oldStartPath: string;
    saveDispatch(dispatch: any): void;
    protected saveDva(dva: any): void;
    protected registerExistingModels(): void;
    protected registerModel(model: any): void;
    protected registerActions(namespace: string, reducers: any): object;
    protected unregisterActions(namespace: string): boolean;
    protected interceptModel(): void;
    protected interceptUnmodel(): void;
    protected interceptStart(): void;
    rua(dva: any): boolean;
    protected static validateDva(dva: any): void;
}
export default RuaDva;
