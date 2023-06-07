import { type t } from '../common.t';

/**
 * "Completes" a subject by running:
 *
 *    1. subject.next();
 *    2. subject.complete();
 */
export function done(dispose$?: t.Subject<void>) {
  dispose$?.next?.();
  dispose$?.complete?.();
}
