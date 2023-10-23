import type { t } from './common';

type Id = string;
type InitOptions = Partial<t.PeerJsCreateArgs> & {
  peerid?: Id;
  dispose$?: t.UntilObservable;
};

/**
 * Entry API
 */
export type WebrtcPeerModel = {
  init(options?: InitOptions): t.PeerModel;
  wrap(peer: t.PeerJs, dispose$?: t.UntilObservable): t.PeerModel;
};

/**
 * Raw immutable model data.
 */
export type Peer = {
  open: boolean;
  connections: t.PeerConnection[];
  cmd?: t.PeerModelCmd; // Used to produce an event stream of commands.
};

/**
 * A single peer-connection details
 */
export type PeerConnection = {
  kind: 'data' | 'media';
  id: string;
  peer: { local: string; remote: string };
  open: boolean | null; // NB: null while initializing.
};

/**
 * Logical API over the peer state.
 */
export type PeerModel = t.Lifecycle & {
  id: string;
  current: t.Peer;
  events(dispose$?: t.UntilObservable): t.PeerModelEvents;
  purge(): void;
  disconnect(id: Id): void;
  connect: {
    data(remotePeer: Id): Promise<Id>;
  };
  get: {
    connection(id: Id): t.PeerJsConn | undefined;
    dataConnection(id: Id): t.PeerJsConnData | undefined;
    mediaConnection(id: Id): t.PeerJsConnMedia | undefined;
  };
};

/**
 * Stateful immutable model (JSON patch).
 */
export type PeerModelState = t.PatchState<t.Peer, t.PeerModelEvents>;
export type PeerConnectionId = { id: Id; peer: { local: Id; remote: Id } };

/**
 * Events API
 */
export type PeerModelEvents = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.Peer>>;
  readonly cmd: {
    readonly $: t.Observable<t.PeerModelCmd>;
    readonly data$: t.Observable<t.PeerModelData>;
    readonly conn$: t.Observable<t.PeerModelConn>;
  };
};

/**
 * Event Commands
 */
export type PeerModelCmd = PeerModelConnCmd | PeerModelDataCmd;

export type PeerModelConnCmd = { type: 'Peer:Connection'; payload: PeerModelConn };
export type PeerModelConnAction = 'start:out' | 'start:in' | 'ready' | 'close' | 'error' | 'purge';
export type PeerModelConn = {
  tx: string;
  action: PeerModelConnAction;
  connection?: PeerConnectionId;
  error?: Error;
};

export type PeerModelDataCmd<D extends unknown = unknown> = {
  type: 'Peer:Data';
  payload: PeerModelData<D>;
};
export type PeerModelData<D extends unknown = unknown> = {
  tx: string;
  connection: PeerConnectionId;
  data: D;
};
