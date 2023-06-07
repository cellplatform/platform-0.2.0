import { type t } from '../common.t';

/**
 * Listens to an observable and disposes of the object when fires.
 */
export function until(disposable: t.Disposable, until$?: t.UntilObservable): t.Disposable {
  if (until$) {
    const list = (Array.isArray(until$) ? until$ : [until$]).filter(Boolean) as t.Observable<any>[];
    list.forEach(($) => $.subscribe(disposable.dispose));
  }
  return disposable;
}
