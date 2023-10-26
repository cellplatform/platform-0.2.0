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
  peer: { self: Id; remote: Id };
  open: boolean | null; // NB: null while initializing.
};

/**
 * Logical API over the peer state.
 */
export type PeerModel = t.Lifecycle & {
  id: Id;
  current: t.Peer;
  events(dispose$?: t.UntilObservable): t.PeerModelEvents;
  purge(): { changed: boolean; total: { before: number; after: number } };
  disconnect(id: Id): void;
  connect: {
    data(remotePeer: Id): Promise<t.PeerConnectedData>;
  };
  get: {
    connection(id: Id): t.PeerJsConn | undefined;
    dataConnection(id: Id): t.PeerJsConnData | undefined;
    mediaConnection(id: Id): t.PeerJsConnMedia | undefined;
  };
};

export type PeerConnectedData = { id: Id; conn: t.PeerJsConnData; error?: string };

/**
 * Stateful immutable model (JSON patch).
 */
export type PeerModelState = t.PatchState<t.Peer, t.PeerModelEvents>;
export type PeerConnectionId = { id: Id; peer: { self: Id; remote: Id } };

/**
 * Events API
 */
export type PeerModelEvents = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.Peer>>;
  readonly cmd: {
    readonly $: t.Observable<t.PeerModelCmd>;
    readonly data$: t.Observable<t.PeerModelDataCmdArgs>;
    readonly conn$: t.Observable<t.PeerModelConnCmdArgs>;
    readonly purge$: t.Observable<t.PeerModelPurgeCmdArgs>;
  };
};

/**
 * Event Commands
 */
export type PeerModelCmd = PeerModelConnCmd | PeerModelDataCmd | PeerModelPurgeCmd;

export type PeerModelConnAction =
  | 'start:out'
  | 'start:in'
  | 'ready'
  | 'closed'
  | 'error'
  | 'purged';
export type PeerModelConnCmd = { type: 'Peer:Connection'; payload: PeerModelConnCmdArgs };
export type PeerModelConnCmdArgs = {
  tx: string;
  action: PeerModelConnAction;
  connection?: PeerConnectionId;
  error?: string;
};

export type PeerModelDataCmd<D extends unknown = unknown> = {
  type: 'Peer:Data';
  payload: PeerModelDataCmdArgs<D>;
};
export type PeerModelDataCmdArgs<D extends unknown = unknown> = {
  tx: string;
  connection: PeerConnectionId;
  data: D;
};

export type PeerModelPurgeCmd = { type: 'Peer:Purge'; payload: PeerModelPurgeCmdArgs };
export type PeerModelPurgeCmdArgs = { tx: string };
