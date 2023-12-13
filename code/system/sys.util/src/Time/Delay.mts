import { take } from 'rxjs/operators';
import { type t } from './common.mjs';

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
export const action: t.TimeDelayActionFactory = (msecs, fn) => {
  let timer: t.TimeDelayPromise | undefined;
  let running = false;

  const stop = () => {
    running = false;
    timer?.cancel();
  };

  return {
    start() {
      stop();
      running = true;
      timer = delay(msecs, () => {
        running = false;
        fn({ action: 'complete' });
      });
    },
    reset() {
      stop();
      fn({ action: 'reset' });
    },
    get running() {
      return running;
    },
  } as const;
};
