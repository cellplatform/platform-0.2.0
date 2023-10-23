import type { t } from './common';

export type Peer = {
  open: boolean;
  connections: t.PeerConnection[];
  cmd?: t.PeerModelCmd; // Used to produce an event stream of commands.
};

export type PeerConnection = {
  kind: 'data' | 'media';
  id: string;
  peer: { local: string; remote: string };
  open: boolean;
};

/**
 * Logical API over the peer state.
 */
export type PeerModel = {
  id: string;
  current: t.Peer;
  connect: { data(remotePeer: string): void };
  disconnect(id: string): void;
  events(dispose$?: t.UntilObservable): t.PeerModelEvents;
  purge(): void;
};

/**
 * Events API
 */
export type PeerModelEvents = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.Peer>>;
  readonly cmd: {
    readonly $: t.Observable<t.PeerModelCmd>;
  };
};

/**
 * Event Commands
 */
export type PeerModelCmd = PeerModelConnCmd;

export type PeerModelConnCmd = { type: 'Peer:Connection'; payload: PeerModelConn };
export type PeerModelConn = { tx: string };
