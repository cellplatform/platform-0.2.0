import * as t from './types.mjs';
/**
 * Starts a timer.
 */
export declare function timer(start?: Date, options?: {
    round?: number;
}): t.ITimer;
/**
 * Retrieves the elapsed milliseconds from the given date.
 */
export declare function elapsed(from: t.DateInput, options?: {
    to?: t.DateInput;
    round?: number;
}): t.IDuration;
