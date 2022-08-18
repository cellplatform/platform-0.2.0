import { Disposable } from 'sys.types';
import { Observable, Subject } from 'rxjs';
export declare const Dispose: {
    /**
     * Creates a generic disposable interface that is typically
     * mixed into a wider interface of some kind.
     */
    create(until$?: Observable<any> | Observable<any>[]): Disposable;
    /**
     * Listens to an observable and disposes of the object when fires.
     */
    until(disposable: Disposable, until$?: Observable<any> | Observable<any>[]): Disposable;
    /**
     * "Completes" a subject by running:
     *
     *    1. subject.next();
     *    2. subject.complete();
     *
     */
    done(dispose$?: Subject<void>): void;
};
