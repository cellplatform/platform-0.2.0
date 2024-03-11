import { take } from 'rxjs/operators';
import { type t } from './common';

/**
 * A more useful (promise based) timeout function.
 */
export function delay<T = any>(msecs: t.Msecs, callback?: () => T): t.TimeDelayPromise<T> {
  let timeout: NodeJS.Timeout | undefined;

  let resolver: any;
  const done = (result?: T) => {
    promise.result = result;
    if (resolver) {
      resolver(result);
    }
  };

  // Start the timeout within a promise.
  const promise: any = new Promise<void>((resolve, reject) => {
    resolver = resolve;
    timeout = setTimeout(() => {
      try {
        if (callback) {
          done(callback());
        } else {
          done();
        }
      } catch (error: any) {
        reject(error);
      }
    }, msecs);
  });

  // Add extended API to the promise.
  promise.id = timeout;
  promise.isCancelled = false;
  promise.result = undefined;
  promise.cancel = () => {
    if (!promise.isCancelled) {
      promise.isCancelled = true;
      if (timeout) clearTimeout(timeout);
      done();
    }
  };

  // Finish up.
  return promise as t.TimeDelayPromise;
}

/**
 * Pause for the given number of milliseconds with a promise.
 */
export const wait: t.TimeWait = (msecs) => {
  if (typeof msecs === 'object') {
    return new Promise<void>((resolve) => {
      msecs.pipe(take(1)).subscribe(() => resolve());
    });
  } else {
    return delay(msecs, () => false);
  }
};

/**
 * A start/stop action timer.
 */
export const action: t.TimeDelayActionFactory = (msecs) => {
  let timer: t.TimeDelayPromise | undefined;
  let startedAt = -1;
  let running = false;

  const getElapsed = () => {
    return startedAt < 0 ? -1 : new Date().getTime() - startedAt;
  };

  const handlers = new Set<{ action: t.TimeDelayActionAction; fn: t.TimeDelayActionHandler }>();
  const fire = (action: t.TimeDelayActionAction) => {
    const elapsed = getElapsed();
    handlers.forEach((e) => {
      if (e.action === action) e.fn({ action, elapsed });
    });
  };

  const complete = () => {
    if (!running) return;
    running = false;
    fire('complete');
    startedAt = -1;
  };
  const start = () => {
    if (!running) {
      fire('start');
      startedAt = new Date().getTime();
    } else {
      fire('restart');
    }
    running = true;
    timer?.cancel();
    timer = delay(msecs, complete);
  };
  const reset = () => {
    running = false;
    timer?.cancel();
    fire('reset');
    startedAt = -1;
  };

  const api = {
    get running() {
      return running;
    },
    get elapsed() {
      return getElapsed();
    },
    start,
    reset,
    complete,

    on(...input: any[]) {
      if (typeof input[0] === 'function') {
        const fn = input[0] as t.TimeDelayActionHandler;
        api.on('start', fn).on('restart', fn).on('reset', fn).on('complete', fn);
      } else {
        const action = input[0] as t.TimeDelayActionAction;
        const fn = input[1] as t.TimeDelayActionHandler;
        handlers.add({ action, fn });
      }

      return api;
    },
  };
  return api;
};
