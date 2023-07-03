import { R, rx, type t } from './common';
import { filter } from './util.filter.mjs';

const noop$ = new rx.Subject<void>(); // no-operation observable.

/**
 * Determine if the given peer is alive.
 */
export async function isAlive(self: t.Peer, subject: t.PeerId) {
  // NB: If the subject is the local peer, then it is always alive unless disposed.
  if (self.id === subject) return !self.disposed;
  if (self.disposed) return false;

  // Check for existing connection to test.
  const data = self.connections.data.find((item) => item.peer.remote === subject);
  if (data) {
    return data.isOpen;
  }

  // Start (then stop) a transient test connection.
  try {
    const conn = await self.data(subject);
    const isAlive = conn.isOpen;
    conn.dispose();
    return isAlive;
  } catch (error) {
    return false;
  }
}

export const connections = {
  /**
   * Transform a set of connections into a API with convenient filter accessors.
   */
  toSet(input: t.PeerConnection[] | (() => t.PeerConnection[])): t.PeerConnections {
    const fn = typeof input === 'function' ? input : () => input;
    return {
      get length() {
        return fn().length;
      },
      get all() {
        return fn();
      },
      get data() {
        return filter.onDataConnection(fn());
      },
      get media() {
        return filter.onMediaConnection(fn());
      },
    };
  },

  /**
   * Transform a set of connections into a set of connections grouped by peer.
   */
  byPeer(local: t.PeerId, connections: t.PeerConnection[]): t.PeerConnectionsByPeer[] {
    const byPeer = R.groupBy((item) => item.peer.remote, connections);
    return Object.entries(byPeer).map(([remote, all = []]) => {
      const item: t.PeerConnectionsByPeer = {
        peer: { local, remote },
        length: all.length,
        all,
        get data() {
          return filter.onDataConnection(all);
        },
        get media() {
          return filter.onMediaConnection(all);
        },
      };
      return item;
    });
  },

  /**
   * Convenience API for observing changes to a set of connections.
   */
  changed(
    connections$: t.Observable<t.PeerConnectionChanged> | t.Peer,
    dispose$?: t.Observable<any>,
  ) {
    const { asKind, asAction } = Wrangle;
    const $ = Wrangle.asConnections$(connections$).pipe(rx.takeUntil(dispose$ ?? noop$));
    return {
      $,
      get added$() {
        return asAction($, 'added');
      },
      get removed$() {
        return asAction($, 'removed');
      },
      get data() {
        return {
          get $() {
            return asKind<t.PeerDataConnection>($, 'data');
          },
          get added$() {
            return asKind<t.PeerDataConnection>(asAction($, 'added'), 'data');
          },
          get removed$() {
            return asKind<t.PeerDataConnection>(asAction($, 'removed'), 'data');
          },
        };
      },
      get media() {
        return {
          get $() {
            return asKind<t.PeerMediaConnection>($, 'media');
          },
          get added$() {
            return asKind<t.PeerMediaConnection>(asAction($, 'added'), 'media');
          },
          get removed$() {
            return asKind<t.PeerMediaConnection>(asAction($, 'removed'), 'media');
          },
        };
      },
    };
  },
};

/**
 * [Helpers]
 */
const Wrangle = {
  asConnections$(input: t.Observable<t.PeerConnectionChanged> | t.Peer) {
    return rx.isObservable(input) ? input : input.connections$;
  },

  asKind<T extends t.PeerConnection>($: t.Observable<t.PeerConnectionChanged>, kind: T['kind']) {
    return $.pipe(
      rx.filter((e) => e.kind === kind),
      rx.map((e) => e.subject as T),
    );
  },

  asAction($: t.Observable<t.PeerConnectionChanged>, action: t.PeerConnectionChanged['action']) {
    return $.pipe(rx.filter((e) => e.action === action));
  },
};
