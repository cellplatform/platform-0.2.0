import { Disposable } from '@platform/types';
import { Observable, Subject } from 'rxjs';

import { Dispose } from '../dispose';

/**
 * Generates the base mechanism of an disposable observable.
 */
export function disposable(until$?: Observable<any> | Observable<any>[]): Disposable {
  return Dispose.create(until$);
}

/**
 * "Completes" a subject by running:
 *
 *  1. subject.next();
 *  2. subject.complete();
 *
 */
export function done(dispose$: Subject<void>) {
  Dispose.done(dispose$);
}
