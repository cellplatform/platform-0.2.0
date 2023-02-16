import { slug } from '../Id/Id.mjs';
import { busAsType, instance, isBus } from './Rx.bus.util.mjs';
import { isEvent } from './Rx.event.mjs';
import { filter, Subject } from './Rx.lib.mjs';

import type { t } from '../common.t';

type E = t.Event;
type BusFactory = <T extends E = E>(input?: Subject<any> | t.EventBus<any>) => t.EventBus<T>;
type Bus = BusFactory & {
  isBus(input: any): boolean;
  asType<T extends E>(bus: t.EventBus<any>): t.EventBus<T>;
  instance(bus: t.EventBus<any>): string;
};

/**
 * Factory for creating an event-bus.
 */
const factory: BusFactory = <T extends E = E>(input?: Subject<any> | t.EventBus<any>) => {
  if (isBus(input)) return input as t.EventBus<T>;

  const subject$ = (input as Subject<any>) || new Subject<any>();

  const res: t.EventBus<T> = {
    $: subject$.pipe(filter((e) => isEvent(e))),
    fire: (e) => subject$.next(e),
  };

  (res as any)._instance = `bus.${slug()}`; // NB: An instance ID for debugging sanity.

  return res;
};

/**
 * Export extended [bus] function.
 */
(factory as Bus).isBus = isBus;
(factory as Bus).asType = busAsType;
(factory as Bus).instance = instance;
export const bus = factory as Bus;
