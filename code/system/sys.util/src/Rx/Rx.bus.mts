import { slug } from '../Id/Id.mjs';
import { busAsType, instance, isBus } from './Rx.bus.util.mjs';
import { isEvent } from './Rx.event.mjs';
import { filter, Subject } from './Rx.lib.mjs';

import type { t } from '../common.t';

type E = t.Event;

/**
 * Factory for creating an event-bus.
 */
const factory: t.BusFactory = <T extends E = E>(input?: t.Subject<any> | t.EventBus<any>) => {
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
(factory as t.Bus).isBus = isBus;
(factory as t.Bus).asType = busAsType;
(factory as t.Bus).instance = instance;
export const bus = factory as t.Bus;
