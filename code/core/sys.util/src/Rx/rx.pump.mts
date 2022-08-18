import * as t from '@platform/types';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable } from './rx';

import { instance, isBus } from './rx.bus.util';
import { disposable } from './rx.disposable';

/**
 * An [EventPump] implementation.
 * Note:
 *    Event pumps allow a way of collapsing a rxjs (Observable) setup into
 *    pure functions for passing between libraries, where the rxjs library
 *    may differ. This provides a JS native way of bridging observables.
 */
export const Pump = {
  /**
   * Create a pump using the given bus as the subject.
   */
  create<E extends t.Event = t.Event>(
    bus: t.EventBus<any>,
    options: { dispose$?: Observable<any>; filter?: t.EventPumpFilter<E> } = {},
  ): t.EventPump<E> {
    if (!isBus(bus)) throw new Error('Not a valid event-bus');

    let disposed = false;
    const { dispose$ } = disposable(options.dispose$);
    dispose$.subscribe(() => (disposed = true));

    const allow = (direction: t.EventPumpDirection, event: E) => {
      return typeof options.filter !== 'function' ? true : options.filter({ direction, event });
    };

    return {
      id: Util.asPumpId(bus),
      in(fn) {
        bus.$.pipe(
          takeUntil(dispose$),
          filter((e) => allow('In', e)),
        ).subscribe(fn);
      },
      out(e) {
        if (disposed) return;
        if (!allow('Out', e)) return;
        bus.fire(e);
      },
    };
  },

  /**
   * Connect a pump to a bus, streaming the pumped events two-way (in/out)
   * through the connected bus.
   */
  connect<E extends t.Event = t.Event>(
    pump: t.EventPump<E>,
    options: { dispose$?: Observable<any>; filter?: t.EventPumpFilter<E> } = {},
  ) {
    const { dispose, dispose$ } = disposable(options.dispose$);
    dispose$.subscribe(() => (connection.alive = false));

    const allow = (direction: t.EventPumpDirection, event: E) => {
      return typeof options.filter !== 'function' ? true : options.filter({ direction, event });
    };

    const connection = {
      alive: true,
      dispose,
      dispose$,

      /**
       * Connect the pump to the given event-bus.
       */
      to(bus: t.EventBus<any>) {
        if (Util.asPumpId(bus) === pump.id) {
          const msg = `Cannot connect event-bus "${instance(bus)}" to a pump containing itself`;
          throw new Error(msg);
        }

        type T = { in?: E; out?: E };
        const ignore: T = {}; // NB: Prevent feedback loop.

        pump.in((e) => {
          if (e === ignore.out || !connection.alive) return;
          if (!allow('In', e)) return;

          ignore.in = e;
          bus.fire(e);
          ignore.in = undefined;
        });

        bus.$.pipe(
          takeUntil(dispose$),
          filter((e) => e !== ignore.in),
          filter((e) => allow('Out', e)),
        ).subscribe((e) => {
          ignore.out = e;
          pump.out(e);
          ignore.out = undefined;
        });

        return connection;
      },

      /**
       * Clone the connection providing a filter.
       */
      filter(fn: t.EventPumpFilter<E>) {
        const filter: t.EventPumpFilter<E> = (e) => {
          if (!fn(e)) return false;
          if (typeof options.filter === 'function' && !options.filter(e)) return false;
          return true;
        };
        return Pump.connect(pump, { dispose$, filter });
      },
    };

    return connection;
  },
};

/**
 * Helpers
 */
const Util = {
  asPumpId: (bus: t.EventBus) => `pump:${instance(bus)}`,
};
