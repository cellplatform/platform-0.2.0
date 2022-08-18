import { Observable } from 'rxjs';
declare type Event = {
    type: string;
    payload: unknown;
};
/**
 * Filters on the given event.
 */
export declare function event<E extends Event>(ob$: Observable<unknown>, type: E['type']): Observable<E>;
/**
 * Filters on the given event returning the payload.
 */
export declare function payload<E extends Event>(ob$: Observable<unknown>, type: E['type']): Observable<E["payload"]>;
/**
 * Determine if the given object is the shape of
 * a standard [Event], eg:
 *
 *    {
 *      type: string,
 *      payload: { ... }
 *    }
 *
 */
export declare function isEvent(input: any, type?: string | {
    startsWith: string;
}): boolean;
export {};
