import type * as rxjs from 'npm:rxjs';
import type { t } from '../common.ts';

type Event = { type: string; payload: unknown };

/**
 * Tools for working with Observables (via the [rxjs] library).
 */
export type RxLib = Rxjs & {
  readonly Is: RxIs;
  readonly distinctWhile: typeof rxjs.distinctUntilChanged;
  readonly noop$: rxjs.Subject<any>;
  subject<T = void>(): rxjs.Subject<T>;
  event<E extends Event>($: t.Observable<unknown>, type: E['type']): t.Observable<E>;
  payload<E extends Event>($: t.Observable<unknown>, type: E['type']): t.Observable<E['payload']>;
};

export type RxIs = {
  event(input: any, type?: string | { startsWith: string }): boolean;
};

/**
 * Default methods exported from the [rxjs] library.
 */
type Rxjs = {
  readonly animationFrameScheduler: typeof rxjs.animationFrameScheduler;
  readonly BehaviorSubject: typeof rxjs.BehaviorSubject;
  readonly firstValueFrom: typeof rxjs.firstValueFrom;
  readonly interval: typeof rxjs.interval;
  readonly lastValueFrom: typeof rxjs.lastValueFrom;
  readonly Observable: typeof rxjs.Observable;
  readonly observeOn: typeof rxjs.observeOn;
  readonly of: typeof rxjs.of;
  readonly scan: typeof rxjs.scan;
  readonly Subject: typeof rxjs.Subject;
  readonly timer: typeof rxjs.timer;
  readonly merge: typeof rxjs.merge;
  readonly takeUntil: typeof rxjs.takeUntil;
  readonly catchError: typeof rxjs.catchError;
  readonly debounceTime: typeof rxjs.debounceTime;
  readonly delay: typeof rxjs.delay;
  readonly filter: typeof rxjs.filter;
  readonly map: typeof rxjs.map;
  readonly mergeWith: typeof rxjs.mergeWith;
  readonly take: typeof rxjs.take;
  readonly tap: typeof rxjs.tap;
  readonly throttleTime: typeof rxjs.throttleTime;
  readonly timeout: typeof rxjs.timeout;
  readonly distinctUntilChanged: typeof rxjs.distinctUntilChanged;
};
