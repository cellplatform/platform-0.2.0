import { Disposable } from 'sys.types';
import { Observable, Subject } from 'rxjs';
/**
 * Generates the base mechanism of an disposable observable.
 */
export declare function disposable(until$?: Observable<any> | Observable<any>[]): Disposable;
/**
 * "Completes" a subject by running:
 *
 *  1. subject.next();
 *  2. subject.complete();
 *
 */
export declare function done(dispose$: Subject<void>): void;
