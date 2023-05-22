import type { t } from '../common.t';

type Id = string;
type Hostname = string;
type Semver = string;

export type PeerModule = { name: string; version: Semver };

export type PeerId = string;
export type PeerUri = string;
export type PeerConnectionId = string;
export type PeerProximity = 'local' | 'remote';

export type PeerMediaStreamSource = 'camera' | 'screen';
export type PeerGetMediaStream = (input: PeerMediaStreamSource) => Promise<PeerGetMediaStreamRes>;
export type PeerGetMediaStreamRes = {
  media: MediaStream | undefined;
  done(): Promise<void>; // Indicates the consumer of the stream is finished ("done") and it can be released.
};

/**
 * The local peer.
 */
export type Peer = t.Disposable & {
  readonly kind: 'local:peer';
  readonly tx: Id; // Instance id.
  readonly id: Id; // Peer id (Public).
  readonly signal: Hostname;
  readonly connections: PeerConnections;
  readonly connections$: t.Observable<PeerConnectionChanged>;
  readonly connectionsByPeer: PeerConnectionsByPeer[];
  readonly error$: t.Observable<PeerError>;
  readonly disposed: boolean;
  data(connectTo: Id): Promise<PeerDataConnection>;
  media(connectTo: Id, input: PeerMediaStreamSource): Promise<PeerMediaConnection>;
};

export type PeerConnectionEndpoints = { local: Id; remote: Id };
export type PeerConnection = PeerDataConnection | PeerMediaConnection;
export type PeerConnectionsByPeer = { peer: PeerConnectionEndpoints } & PeerConnections;
export type PeerConnections = {
  readonly length: number;
  readonly all: PeerConnection[];
  readonly data: PeerDataConnection[];
  readonly media: PeerMediaConnection[];
};

type Connection = t.Disposable & {
  readonly id: Id;
  readonly peer: PeerConnectionEndpoints;
  readonly isOpen: boolean;
  readonly isDisposed: boolean;
};

/**
 * A [Data] connection with a remote peer.
 */
export type PeerDataConnection = Connection & {
  readonly kind: 'data';
  readonly metadata: t.PeerMetaData;
  readonly out$: t.Observable<t.PeerDataPayload>;
  readonly in$: t.Observable<t.PeerDataPayload>;
  send<E extends t.Event>(event: E): PeerDataPayload;
  bus<E extends t.Event>(): t.EventBus<E>;
};

export type PeerDataPayload = {
  source: { peer: Id; connection: Id };
  event: t.Event<any>;
};

/**
 * A [Media] connection with a remote peer.
 */
export type PeerMediaConnection = Connection & {
  readonly kind: 'media';
  readonly metadata: PeerMetaMedia;
  readonly stream: PeerMediaStreams;
};

export type PeerMediaStreams = { local?: MediaStream; remote?: MediaStream };

/**
 * Connection Metadata.
 */
export type PeerMeta = PeerMetaData | PeerMetaMedia;
export type PeerMetaData = {
  initiatedBy?: t.PeerId;
};
export type PeerMetaMedia = {
  input: PeerMediaStreamSource;
  initiatedBy?: t.PeerId;
};

/**
 * Peer connection change info.
 */
export type PeerConnectionKind = PeerConnectionChanged['kind'];
export type PeerConnectionChanged = PeerDataConnectionChanged | PeerMediaConnectionChanged;

type ConnectionChanged = {
  action: 'added' | 'removed';
  connections: PeerConnection[];
};

export type PeerDataConnectionChanged = ConnectionChanged & {
  kind: 'data';
  subject: PeerDataConnection;
};

export type PeerMediaConnectionChanged = ConnectionChanged & {
  kind: 'media';
  subject: PeerMediaConnection;
};

/**
 * Errors
 * ref: https://peerjs.com/docs/#peeron-error
 */
export type PeerErrorType =
  | 'unknown'
  | 'browser-incompatible' // (FATAL) The client's browser does not support some or all WebRTC features that you are trying to use.
  | 'disconnected' //         You've already disconnected this peer from the server and can no longer make any new connections on it.
  | 'invalid-id' //           (FATAL) The ID passed into the Peer constructor contains illegal characters.
  | 'invalid-key' //          (FATAL) The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
  | 'network' //              Lost or cannot establish a connection to the signalling server.
  | 'peer-unavailable' //     The peer you're trying to connect to does not exist.
  | 'ssl-unavailable' //      (FATAL) PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
  | 'server-error' //         (FATAL) Unable to reach the server.
  | 'socket-error' //         (FATAL) An error from the underlying socket.
  | 'socket-closed' //        (FATAL) The underlying socket closed unexpectedly.
  | 'unavailable-id' //       (sometimes FATAL) The ID passed into the Peer constructor is already taken (non-fatal).
  | 'webrtc'; //              Native WebRTC errors.

export type PeerError = {
  type: PeerErrorType;
  message: string;
  isFatal: boolean;
};
