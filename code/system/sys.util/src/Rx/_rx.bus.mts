import * as t from 'sys.types';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { id } from '../Id/Id.mjs';
import { isEvent } from './Rx.event.mjs';
import { instance, busAsType, isBus } from './Rx.bus.util.mjs';
import { Pump } from './Rx.Pump.mjs';

type E = t.Event;

type BusFactory = <T extends E = E>(input?: Subject<any> | t.EventBus<any>) => t.EventBus<T>;
type Bus = BusFactory & {
  isBus(input: any): boolean;
  asType<T extends E>(bus: t.EventBus<any>): t.EventBus<T>;
  instance(bus: t.EventBus<any>): string;
  pump: typeof Pump;
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

  (res as any)._instance = `bus.${id.slug()}`; // NB: An instance ID for debugging sanity.

  return res;
};

/**
 * Export extended [bus] function.
 */

(factory as any).isBus = isBus;
(factory as any).asType = busAsType;
(factory as any).instance = instance;
(factory as any).pump = Pump;

export const bus = factory as Bus;
