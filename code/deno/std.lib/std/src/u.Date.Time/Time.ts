import { delay } from '@std/async';
import type { t } from '../common.ts';

/**
 * Helpers for working with time/delays.
 */
export const Time: t.TimeLib = {
  delay(...args: any[]) {
    type T = t.TimeDelayPromise;

    const { msecs, fn } = wrangle.delayArgs(args);
    const controller = new AbortController();
    const { signal } = controller;

    const cancel = () => controller.abort('delay cancelled');
    const is: t.DeepMutable<T['is']> = { completed: false, cancelled: false, done: false };

    const promise: any = new Promise<void>((resolve) => {
      const done = () => {
        is.done = true;
        is.cancelled = signal.aborted;
        resolve();
      };

      signal.onabort = done;
      const complete = () => {
        fn?.();
        is.completed = true;
        done();
      };

      delay(msecs, { signal }).then(complete).catch(done);
    });

    // Decorate the promise with extra time/delay controller fields.
    promise.cancel = cancel;
    promise.is = is;
    promise.timeout = msecs;
    return promise as T;
  },

  wait(msecs) {
    return Time.delay(msecs);
  },
};

/**
 * Helpers
 */
const wrangle = {
  delayArgs(input: any[]) {
    let msecs = 0;
    let fn: t.TimeDelayCallback | undefined;
    if (typeof input[0] === 'number') msecs = input[0];
    if (typeof input[0] === 'function') fn = input[0];
    if (typeof input[1] === 'function') fn = input[1];
    return { msecs, fn };
  },
} as const;
