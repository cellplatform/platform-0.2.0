import { Observable } from 'rxjs';
export declare type Disposable = {
    dispose(): void;
    readonly dispose$: Observable<void>;
};
