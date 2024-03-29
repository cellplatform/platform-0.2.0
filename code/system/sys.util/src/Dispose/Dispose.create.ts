import { Subject } from 'rxjs';
import { type t } from '../common';
import { done } from './Dispose.done';
import { until } from './Dispose.until';

/**
 * Creates a generic disposable interface that is typically
 * mixed into a wider interface of some kind.
 */
export function create(until$?: t.UntilObservable) {
  const dispose$ = new Subject<void>();
  const disposable: t.Disposable = {
    dispose$: dispose$.asObservable(),
    dispose() {
      done(dispose$);
    },
  };
  return until(disposable, until$);
}
