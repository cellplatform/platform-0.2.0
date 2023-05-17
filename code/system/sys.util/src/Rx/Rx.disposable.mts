import { Observable, Subject, take } from 'rxjs';
import type { t } from '../common.t';

import { Dispose } from '../Dispose';

type UntilObservable = Observable<any> | (Observable<any> | undefined)[];

/**
 * Generates the base mechanism of an disposable observable.
 */
export function disposable(until$?: UntilObservable): t.Disposable {
  return Dispose.create(until$);
}

/**
 * Generates a disposable observable that keeps track on the "is disposed" state.
 */
export function lifecycle(until$?: UntilObservable): t.Lifecycle {
  const { dispose, dispose$ } = disposable(until$);
  let _disposed = false;
  dispose$.pipe(take(1)).subscribe(() => (_disposed = true));
  return {
    dispose$,
    dispose,
    get disposed() {
      return _disposed;
    },
  };
}

/**
 * "Completes" a subject by running:
 *
 *  1. subject.next();
 *  2. subject.complete();
 *
 */
export function done(dispose$: Subject<void>) {
  Dispose.done(dispose$);
}
