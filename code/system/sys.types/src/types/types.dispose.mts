import { Observable } from 'rxjs';

export type Disposable = {
  dispose(): void;
  readonly dispose$: Observable<void>;
};

export type Lifecycle = Disposable & {
  readonly disposed: boolean;
};

export type UntilObservable = Observable<any> | (Observable<any> | undefined)[];
