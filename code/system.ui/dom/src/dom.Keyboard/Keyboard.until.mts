import { KeyboardMonitor as Monitor } from './Keyboard.Monitor.mjs';
import { rx, type t } from './common';

/**
 * Exposes keyboard functions that cease after a
 * dispose signal is received.
 */
export function until(until$?: t.UntilObservable) {
  const lifecycle = rx.lifecycle(until$);
  const { dispose, dispose$ } = lifecycle;

  const on: t.KeyboardMonitor['on'] = (...args: any) => {
    const listener = Monitor.on.apply(Monitor, args);
    dispose$.pipe(rx.take(1)).subscribe(() => listener.dispose());
    return listener;
  };

  const $ = Monitor.$.pipe(rx.takeUntil(dispose$));
  const down$ = $.pipe(rx.filter((e) => e.last?.stage === 'Down'));
  const up$ = $.pipe(rx.filter((e) => e.last?.stage === 'Up'));

  const api = {
    on,
    $,
    up$,
    down$,

    /**
     * Lifecycle
     */
    dispose$,
    dispose,
    get disposed() {
      return lifecycle.disposed;
    },
  } as const;
  return api;
}
