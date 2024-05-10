import { slug } from '../Id';
import { busAsType, instance, isBus } from './Rx.util';
import { isEvent } from './Rx.event';
import { filter, Subject } from './RxJs.lib';
import { BusConnect } from './Rx.BusConnect';
import { isObservable } from './Rx.util';

import type { t } from '../common';

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
