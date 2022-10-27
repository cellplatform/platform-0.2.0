import { BusEvents } from './BusEvents.mjs';
import { Pkg, rx, t } from './common.mjs';

type Id = string;

/**
 * Event controller.
 */
export function BusController(args: {
  instance: { bus: t.EventBus<any>; id: Id };
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.StateEvents {
  const { filter } = args;

  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id;

  const events = BusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter,
  });
  const { dispose, dispose$ } = events;

  /**
   * Info (Module)
   */
  events.info.req$.subscribe(async (e) => {
    const { tx } = e;
    const { name = '', version = '' } = Pkg;
    const info: t.StateInfo = { module: { name, version } };
    bus.fire({
      type: 'app.state/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * API
   */
  return events;
}
