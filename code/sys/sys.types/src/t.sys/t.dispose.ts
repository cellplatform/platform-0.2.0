import type { t } from '../common';

export type Disposable = {
  readonly dispose$: t.Observable<void>;
  dispose(): void;
};

export type Lifecycle = Disposable & {
  readonly disposed: boolean;
};

/**
 * Utility Type: remove fields from composite object.
 */
export type OmitDisposable<T extends Disposable> = Omit<T, 'dispose' | 'dispose$'>;
export type OmitLifecycle<T extends Lifecycle> = Omit<T, 'dispose' | 'dispose$' | 'disposed'>;

/**
 * TakeUntil:
 *    Input of observable(s) that signal when
 *    another observable should end.
 */
type O = t.Observable<any>;
type OList = (O | OList | undefined)[];
export type UntilObservable = O | OList;
