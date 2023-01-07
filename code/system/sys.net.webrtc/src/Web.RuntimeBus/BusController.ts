import { delay } from 'rxjs/operators';

import { BusEvents } from './BusEvents';
import { DEFAULT, rx, t, Module } from './common';

/**
 * Event controller.
 */
export function BusController(args: {
  instance: t.WebRuntimeInstance;
  netbus?: t.NetworkBus<any>;
  filter?: (e: t.WebRuntimeEvent) => boolean;
}) {
  const { netbus } = args;
  const instance = args.instance.id ?? DEFAULT.instance;

  const bus = rx.busAsType<t.WebRuntimeEvent>(args.instance.bus);
  const events = BusEvents({ instance: args.instance });

  /**
   * Info (Module)
   */
  events.info.req$.pipe(delay(0)).subscribe(async (e) => {
    const { tx } = e;
    const module = Module.info;
    const info: t.WebRuntimeInfo = { module };
    const exists = Boolean(info);
    bus.fire({
      type: 'sys.runtime.web/info:res',
      payload: { tx, instance, exists, info },
    });
  });

  /**
   * Netbus
   */
  events.netbus.req$.pipe(delay(0)).subscribe((e) => {
    const { tx } = e;
    const exists = Boolean(netbus);
    bus.fire({
      type: 'sys.runtime.web/netbus:res',
      payload: { tx, instance, exists, netbus },
    });
  });

  /**
   * API
   */
  return events;
}
