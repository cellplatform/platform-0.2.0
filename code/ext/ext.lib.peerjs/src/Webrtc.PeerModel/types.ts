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
export type PeerModel = t.Lifecycle & {
  id: string;
  current: t.Peer;
  connect: { data(remotePeer: string): void };
  disconnect(id: string): void;
  events(dispose$?: t.UntilObservable): t.PeerModelEvents;
  purge(): void;
  get: {
    connection(id: string): t.PeerJsConn | undefined;
    dataConnection(id: string): t.PeerJsConnData | undefined;
    mediaConnection(id: string): t.PeerJsConnMedia | undefined;
  };
};

/**
 * Events API
 */
export type PeerModelEvents = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.Peer>>;
  readonly cmd: {
    readonly $: t.Observable<t.PeerModelCmd>;
    readonly conn$: t.Observable<t.PeerModelConn>;
    readonly data$: t.Observable<t.PeerModelData>;
  };
};

/**
 * Event Commands
 */
export type PeerModelCmd = PeerModelConnCmd | PeerModelDataCmd;

export type PeerModelConnCmd = { type: 'Peer:Conn'; payload: PeerModelConn };
export type PeerModelConn = {
  tx: string;
  action: 'start:out' | 'start:in' | 'close' | 'error' | 'total';
  connection?: { id: string; peer: { local: string; remote: string } };
  error?: Error;
};

export type PeerModelDataCmd = { type: 'Peer:Data'; payload: PeerModelData };
export type PeerModelData = {
  tx: string;
  connection: { id: string; peer: { local: string; remote: string } };
  data: unknown;
};
