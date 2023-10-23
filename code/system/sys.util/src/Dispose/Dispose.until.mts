import { type t } from '../common';
import { flatten } from 'ramda';

/**
 * Listens to an observable and disposes of the object when fires.
 */
export function until(disposable: t.Disposable, until$?: t.UntilObservable): t.Disposable {
  if (until$) {
    const list = Wrangle.flatArray(until$);
    console.log('list', list);
    list.forEach(($) => $.subscribe(disposable.dispose));
  }
  return disposable;
}

/**
 * Helpers
 */
export const Wrangle = {
  flatArray($?: t.UntilObservable) {
    const list = Array.isArray($) ? $ : [$];
    return flatten(list).filter(Boolean) as t.Observable<any>[];
  },
} as const;
