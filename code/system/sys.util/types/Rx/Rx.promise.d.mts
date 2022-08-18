import { Observable, timeout } from 'rxjs';
import { Event } from 'sys.types';
declare type Milliseconds = number;
/**
 * Helpers for working with observables as promises.
 */
export declare const asPromise: {
    /**
     * Retrieves the first event from the given observable.
     */
    first<E extends Event<any>>(ob$: Observable<E["payload"]>, options?: {
        op?: string;
        timeout?: Milliseconds;
    }): Promise<{
        payload?: E["payload"] | undefined;
        error?: {
            code: 'timeout' | 'completed' | 'unknown';
            message: string;
        } | undefined;
    }>;
};
export {};
