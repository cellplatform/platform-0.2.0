import { Observable, Subject } from 'rxjs';
import type { Disposable } from 'sys.types';

type UntilObservable = Observable<any> | (Observable<any> | undefined)[];

export const Dispose = {
  /**
   * Creates a generic disposable interface that is typically
   * mixed into a wider interface of some kind.
   */
  create(until$?: UntilObservable): Disposable {
    const dispose$ = new Subject<void>();
    const disposable: Disposable = {
      dispose$: dispose$.asObservable(),
      dispose() {
        Dispose.done(dispose$);
      },
    };
    return Dispose.until(disposable, until$);
  },

  /**
   * Listens to an observable and disposes of the object when fires.
   */
  until(disposable: Disposable, until$?: UntilObservable): Disposable {
    if (until$) {
      const list = (Array.isArray(until$) ? until$ : [until$]).filter(Boolean) as Observable<any>[];
      list.forEach(($) => $.subscribe(disposable.dispose));
    }
    return disposable;
  },

  /**
   * "Completes" a subject by running:
   *
   *    1. subject.next();
   *    2. subject.complete();
   *
   */
  done(dispose$?: Subject<void>) {
    dispose$?.next?.();
    dispose$?.complete?.();
  },
};
