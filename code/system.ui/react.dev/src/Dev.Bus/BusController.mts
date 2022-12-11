import { DevBusEvents } from './BusEvents.mjs';
import { Pkg, rx, t } from './common';

type Id = string;

/**
 * Event controller.
 */
export function DevBusController(args: {
  instance: { bus: t.EventBus<any>; id: Id };
  filter?: (e: t.MyEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.MyEvents {
  const { filter } = args;

  const bus = rx.busAsType<t.MyEvent>(args.instance.bus);
  const instance = args.instance.id;

  const events = DevBusEvents({
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
    const info: t.MyInfo = { module: { name, version } };
    bus.fire({
      type: 'sys.dev/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * API
   */
  return events;
}
