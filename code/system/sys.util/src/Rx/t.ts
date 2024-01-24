import type { t } from '../common';

type E = t.Event;

/**
 * Event Bus
 */
export type BusFactory = <T extends E = E>(
  input?: t.Subject<any> | t.EventBus<any>,
) => t.EventBus<T>;

export type Bus = BusFactory & {
  isBus<T extends E = E>(input?: any): input is t.EventBus<T>;
  isObservable<T = any>(input?: any): input is t.Observable<T>;
  asType<T extends E>(bus: t.EventBus<any>): t.EventBus<T>;
  instance(bus?: t.EventBus<any>): string;
  connect<T extends E>(buses: t.EventBus<any>[], options?: t.BusConnectOptions): BusConnection<T>;
};

/**
 * 2-way Event Bus Connection
 */
export type BusConnection<E extends t.Event> = t.Disposable & {
  readonly isDisposed: boolean;
  readonly buses: t.EventBus<E>[];
};

export type BusConnectOptions = {
  async?: boolean;
  dispose$?: t.Observable<any>;
};
