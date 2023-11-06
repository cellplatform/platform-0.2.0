import type { t } from '../common';

export type Disposable = {
  readonly dispose$: t.Observable<void>;
  dispose(): void;
};

export type Lifecycle = Disposable & { readonly disposed: boolean };

/**
 * TakeUntil:
 *    Input of observable(s) that signal when
 *    another observable should end.
 */
type O = t.Observable<any>;
type OList = (O | OList | undefined)[];
export type UntilObservable = O | OList;
