import type { t } from '../common.t';

type E = t.Event;

/**
 * Event Bus
 */
export type BusFactory = <T extends E = E>(
  input?: t.Subject<any> | t.EventBus<any>,
) => t.EventBus<T>;

export type Bus = BusFactory & {
  isBus(input: any): boolean;
  asType<T extends E>(bus: t.EventBus<any>): t.EventBus<T>;
  instance(bus: t.EventBus<any>): string;
};
