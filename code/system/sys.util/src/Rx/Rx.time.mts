import { type t } from '../common';
import { disposable } from './Rx.lifecycle.mjs';
import { Subject, take, takeUntil, filter } from './RxJs.lib.mjs';
import { Time } from '../Time';

type Milliseconds = number;

/**
 * Listen for an event within a given time threshold.
 */
export function withinTimeThreshold(
  $: t.Observable<any>,
  timeout: Milliseconds,
  options: { dispose$?: t.Observable<any> } = {},
) {
  /**
   * Start listening for next event.
   */
  const startListening = (timeout: number) => {
    const startedAt = Date.now();
    const res$ = new Subject<boolean>();

    const { dispose, dispose$ } = disposable(options.dispose$);
    const done = (result: boolean) => {
      res$.next(result);
      res$.complete();
      dispose();
    };

    $.pipe(takeUntil(dispose$), take(1)).subscribe((e) => {
      const elapsed = Date.now() - startedAt;
      if (elapsed < timeout) done(true);
    });

    Time.delay(timeout, () => done(false));
    return res$.asObservable();
  };

  /**
   * Response listener.
   */
  const res$ = new Subject<void>();
  $.subscribe((e) => {
    startListening(timeout)
      .pipe(takeUntil(dispose$), filter(Boolean))
      .subscribe(() => res$.next());
  });

  let _disposed = false;
  const { dispose, dispose$ } = disposable(options.dispose$);
  dispose$.subscribe(() => {
    res$.complete();
    _disposed = true;
  });
  return {
    $: res$.asObservable(),
    dispose,
    dispose$,
    get disposed() {
      return _disposed;
    },
  };
}
