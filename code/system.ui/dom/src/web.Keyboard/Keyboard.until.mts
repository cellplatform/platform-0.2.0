import { KeyboardMonitor } from './Keyboard.Monitor.mjs';
import { rx, type t } from './common';

/**
 * Exposes keyboard functions that cease after a
 * dispose signal is received.
 */
export function until(until$?: t.UntilObservable) {
  const lifecycle = rx.lifecycle(until$);
  const { dispose$ } = lifecycle;

  const api = {
    get $() {
      return KeyboardMonitor.$.pipe(rx.takeUntil(dispose$));
    },

    get down$() {
      return api.$.pipe(rx.filter((e) => e.last?.stage === 'Down'));
    },

    get up$() {
      return api.$.pipe(rx.filter((e) => e.last?.stage === 'Up'));
    },

    get disposed() {
      return lifecycle.disposed;
    },
  } as const;

  return api;
}
