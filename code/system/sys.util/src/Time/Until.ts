import { Subject, take, takeUntil } from 'rxjs';
import { create } from '../Dispose/Dispose.create';
import { delay as baseDelay } from './Delay';
import { type t } from './common';

/**
 * Exposes timer functions that cease after a
 * dispose signal is received.
 */
export function until(until$: t.UntilObservable) {
  let _disposed = false;
  const { dispose$ } = create(until$);
  dispose$.subscribe(() => (_disposed = true));

  /**
   * API
   */
  const api: t.TimeUntil = {
    /**
     * A more useful (promise based) timeout function.
     */
    delay<T = any>(msecs: number, callback?: () => T): t.TimeDelayPromise<T> {
      const done$ = new Subject<void>();
      const res = baseDelay(msecs, () => {
        done$.next();
        return callback?.() as T;
      });
      dispose$.pipe(takeUntil(done$), take(1)).subscribe(() => res.cancel());
      return res;
    },

    /**
     * Lifecycle
     */
    get disposed() {
      return _disposed;
    },
  } as const;

  return api;
}
