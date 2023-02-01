import { t, Time, rx } from './common';
import { NetworkBus } from './NetworkBus.mjs';

/**
 * A mock network bus.
 * NOTE: useful for when an environment does not support the kind of
 *       bus being requested but an object needs to be returned.
 */
export function NetworkBusMock<E extends t.Event = t.Event>(
  options: { local?: t.NetworkBusUri; remotes?: t.NetworkBusUri[]; memorylog?: boolean } = {},
): t.NetworkBusMock<E> {
  const { memorylog } = options;
  const in$ = new rx.Subject<E>();

  const mock: t.NetworkBusMock<E>['mock'] = {
    fired: [],
    in: { $: in$, next: (e) => in$.next(e) },
    out: [],
    local: options.local ?? 'uri:me',
    remotes: [],
    remote(uri, netbus) {
      type R = t.NetworkBusMockRemote<E>;
      const item: R = { uri, bus: netbus ?? NetworkBusMock(), fired: [] };
      mock.remotes.push(item);
      item.bus.$.pipe(rx.filter(() => Boolean(memorylog))).subscribe((e) => item.fired.push(e));
      return item;
    },
  };

  const pump: t.NetworkPump<E> = {
    in: (fn) => mock.in.$.subscribe(fn),
    out(e) {
      mock.out.push(e);
      Time.delay(0, () => {
        // NB: simulate network latency (aka. "not" synchronous).
        mock.remotes
          .filter(({ uri }) => uri !== mock.local && e.targets.includes(uri))
          .forEach((remote) => remote.bus.target.local(e.event));
      });
    },
  };

  const netbus = NetworkBus<E>({
    pump,
    local: async () => mock.local,
    remotes: async () => mock.remotes.map(({ uri }) => uri),
  });

  if (options.memorylog) netbus.$.subscribe((e) => mock.fired.push(e));
  options.remotes?.forEach((uri) => mock.remote(uri));

  // Finish up.
  const api = { ...netbus, mock };
  (api as any)._instance = `${rx.bus.instance(api)}:mock`;
  return api;
}
