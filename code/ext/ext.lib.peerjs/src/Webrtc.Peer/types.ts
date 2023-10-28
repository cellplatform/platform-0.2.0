import type { t } from './common';

type Id = string;
type InitOptions = Partial<t.PeerJsCreateArgs> & {
  peerid?: Id;
  dispose$?: t.UntilObservable;
};

export type GetMedia = () => Promise<GetMediaResponse>;
export type GetMediaResponse = { stream?: MediaStream; error?: Error };

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
  kind: PeerConnectionKind;
  id: string;
  peer: { self: Id; remote: Id };
  open: boolean | null; // NB: null while initializing.
  direction: PeerConnectDirection;
  metadata: PeerConnectMetadata;
  stream?: { self?: MediaStream; remote?: MediaStream };
};
export type PeerConnectionsByPeer = { [peer: string]: PeerConnection[] };

export type PeerConnectionKind = PeerConnectionDataKind | PeerConnectionMediaKind;
export type PeerConnectionDataKind = 'data';
export type PeerConnectionMediaKind = 'media:video' | 'media:screen';

export type PeerConnectDirection = 'incoming' | 'outgoing';
export type PeerConnectMetadata = {
  kind: PeerConnectionKind | 'unknown';
  userAgent: string;
};

/**
 * Logical API over the peer state.
 */
export type PeerModel = t.Lifecycle & {
  readonly id: Id;
  readonly current: t.Peer;
  readonly get: PeerModelGet;
  readonly connect: {
    data(remoteid: Id): Promise<t.PeerConnectedData>;
    media(kind: t.PeerConnectionMediaKind, remoteid: Id): Promise<t.PeerConnectedMedia>;
  };
  dispatch: t.PeerModelDispatch;
  events(dispose$?: t.UntilObservable): t.PeerModelEvents;
  purge(): { changed: boolean; total: { before: number; after: number } };
  disconnect(id: Id): void;
};

export type PeerModelGet = {
  readonly conn: {
    readonly obj: PeerModelGetConnectionObject;
    readonly remotes: PeerConnectionsByPeer;
  };
  stream(kind: t.PeerConnectionMediaKind): Promise<t.GetMediaResponse>;
};

export type PeerModelGetConnectionObject = {
  (id: Id): t.PeerJsConn | undefined;
  data(id: Id): t.PeerJsConnData | undefined;
  media(id: Id): t.PeerJsConnMedia | undefined;
  video(id: Id): t.PeerJsConnMedia | undefined;
  screen(id: Id): t.PeerJsConnMedia | undefined;
};

export type PeerConnected = PeerConnectedData | PeerConnectedMedia;
export type PeerConnectedData = { id: Id; conn: t.PeerJsConnData; error?: string };
export type PeerConnectedMedia = { id: Id; error?: string };

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
    readonly error$: t.Observable<t.PeerModelErrorCmdArgs>;
  };
};

/**
 * Event Commands
 */
export type PeerModelDispatch = (cmd: PeerModelCmd) => void;

export type PeerModelCmd =
  | PeerModelConnCmd
  | PeerModelDataCmd
  | PeerModelPurgeCmd
  | PeerModelErrorCmd;

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

export type PeerModelErrorCmd = { type: 'Peer:Error'; payload: PeerModelErrorCmdArgs };
export type PeerModelErrorCmdArgs = { tx: string; message: string };
