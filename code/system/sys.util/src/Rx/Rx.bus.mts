import { slug } from '../Id/Id.mjs';
import { busAsType, instance, isBus } from './Rx.util.mjs';
import { isEvent } from './Rx.event.mjs';
import { filter, Subject } from './RxJs.lib.mjs';
import { BusConnect } from './Rx.BusConnect.mjs';
import { isObservable } from './Rx.util.mjs';

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
(factory as any).isBus = isBus;
(factory as any).isObservable = isObservable;
(factory as any).asType = busAsType;
(factory as any).instance = instance;
(factory as any).connect = BusConnect;

export const bus = factory as t.Bus;
