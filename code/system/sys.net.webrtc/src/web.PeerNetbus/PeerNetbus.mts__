import { map } from 'rxjs/operators';
import { PeerEvents, NetworkBus, t, UriUtil } from './common';

/**
 * An [event-bus] distributed across a number of
 * peers using WebRTC data connection transport.
 */
export function PeerNetbus<E extends t.Event>(args: {
  self: t.PeerId;
  bus: t.EventBus<any>;
}): t.PeerNetbus<E> {
  const { self } = args;
  const events = PeerEvents(args.bus);
  const data = events.data(self);

  const pump: t.NetworkPump<E> = {
    in: (fn) => data.in$.pipe(map((e) => e.data as E)).subscribe(fn),
    out: (e) => data.send(e.event, { targets: e.targets }),
  };

  const netbus = NetworkBus<E>({
    pump,
    local: async () => UriUtil.peer.create(self),
    remotes: async () => {
      const uri = UriUtil.connection.create;
      return (_connections || []).map((conn) => uri(conn.kind, conn.peer.remote.id, conn.id));
    },
  });

  // Maintain a list of connections.
  let _connections: t.PeerConnectionStatus[];
  events.status(self).changed$.subscribe((e) => (_connections = e.peer.connections));
  events
    .status(self)
    .get()
    .then((e) => (_connections = e.peer?.connections || [])); // NB: Initial load of current connections.

  /**
   * API
   */
  const api: t.PeerNetbus<E> = {
    ...netbus,
    self,
    get connections() {
      return _connections || [];
    },
  };

  return api;
}
