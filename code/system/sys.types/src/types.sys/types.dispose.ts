import type { t } from '../common';

export type Disposable = {
  dispose(): void;
  readonly dispose$: t.Observable<void>;
};

export type Lifecycle = Disposable & {
  readonly disposed: boolean;
};

export type UntilObservable = t.Observable<any> | (t.Observable<any> | undefined)[];
