import { firstValueFrom, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { Module, rx, slug, t } from '../common';
import { EventNamespace as ns } from './ns.mjs';

type P = t.GroupPeer;
type C = t.GroupPeerConnection;

/**
 * Helpers for working with group (mesh) related events.
 */
export function GroupEvents(eventbus: t.PeerNetbus<any>): t.GroupEvents {
  const module = Module.info;
  const netbus = eventbus as t.PeerNetbus<t.GroupEvent>;
  const source = netbus.self;
  const dispose$ = new Subject<void>();
  const dispose = () => dispose$.next();

  const event$ = netbus.$.pipe(
    takeUntil(dispose$),
    filter(ns.is.group.base),
    map((e) => e as t.GroupEvent),
  );

  const connections = {
    req$: rx.payload<t.GroupConnectionsReqEvent>(event$, 'sys.net/group/connections:req'),
    res$: rx.payload<t.GroupConnectionsResEvent>(event$, 'sys.net/group/connections:res'),

    /**
     * Calculate the entire group from available connections.
     */
    async get(targets?: t.PeerId[]): Promise<t.GroupPeerStatus> {
      const local: P = {
        peer: source,
        module,
        connections: netbus.connections.map(({ id, kind, parent }) => ({
          id,
          kind,
          parent,
        })),
      };

      const total = local.connections.filter(({ kind }) => kind === 'data').length;
      if (total === 0) return { local, remote: [], pending: [] };

      const tx = slug();
      const res = firstValueFrom(connections.res$.pipe(filter((e) => e.tx === tx)));
      netbus.target.local({
        type: 'sys.net/group/connections:req',
        payload: { source, targets, tx },
      });

      const remote = (await res).peers;
      const pending = toPending(local, remote);
      return { local, remote, pending };
    },
  };

  const connect = {
    $: rx.payload<t.GroupConnectEvent>(event$, 'sys.net/group/connect'),

    /**
     * TODO 🐷
     * clear up param names.
     */

    async fire(target: t.PeerId, peer: t.PeerId, kind: t.PeerConnectionKind) {
      await netbus.target.node(target).fire({
        type: 'sys.net/group/connect',
        payload: { source, target: { peer, kind } },
      });
      return;
    },
  };

  const refresh = {
    $: rx.payload<t.GroupRefreshEvent>(event$, 'sys.net/group/refresh'),
    async fire() {
      netbus.fire({
        type: 'sys.net/group/refresh',
        payload: { source },
      });
    },
  };

  return {
    $: event$,
    dispose$,
    dispose,
    connections,
    connect,
    refresh,
  };
}

/**
 * [Helpers]
 */

const isLocal = (local: P, id: t.PeerConnectionId) => local.connections.some((c) => c.id === id);

const toPending = (local: P, remote: P[]) => {
  const res: C[] = [];
  remote.forEach((item) => {
    const peer = item.peer;
    item.connections
      .filter((conn) => !isLocal(local, conn.id))
      .forEach(({ id, kind, parent }) => res.push({ peer, connection: id, kind, parent }));
  });
  return res;
};
