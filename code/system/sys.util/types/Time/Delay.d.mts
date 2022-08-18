import * as t from './types.mjs';
/**
 * A more useful (promise based) timeout function.
 */
export declare function delay<T = any>(msecs: number, callback?: () => T): t.TimeDelayPromise<T>;
/**
 * Pause for the given number of milliseconds with a promise.
 */
export declare const wait: t.TimeWait;
