import type { t } from './common.ts';

export type Disposable = {
  readonly dispose$: t.Observable<void>;
  dispose(): void;
};

export type Lifecycle = Disposable & { readonly disposed: boolean };
