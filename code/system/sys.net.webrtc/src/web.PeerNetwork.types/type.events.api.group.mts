import { t } from './common';

/**
 * Event API for interacting with a group of networked peers.
 */
export type GroupEvents = t.Disposable & {
  $: t.Observable<t.GroupEvent>;
  connections: {
    req$: t.Observable<t.GroupConnectionsReq>;
    res$: t.Observable<t.GroupConnectionsRes>;
    get(targets?: t.PeerId[]): Promise<t.GroupPeerStatus>;
  };
  connect: {
    $: t.Observable<t.GroupConnect>;
    fire(target: t.PeerId, peer: t.PeerId, kind: t.PeerConnectionKind): Promise<void>;
  };
  refresh: {
    $: t.Observable<t.GroupRefresh>;
    fire(): Promise<void>;
  };
};
