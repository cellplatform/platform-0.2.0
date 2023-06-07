import type { Observable } from 'rxjs';

export type UntilObservable = Observable<any> | (Observable<any> | undefined)[];
