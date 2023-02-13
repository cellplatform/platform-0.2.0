import type { t } from '../common.t';

type Id = string;
type Hostname = string;
type Semver = string;

export type PeerModule = { name: string; version: Semver };

export type PeerId = string;
export type PeerUri = string;
export type PeerConnectionId = string;
export type PeerProximity = 'local' | 'remote';

export type PeerMediaStreamInput = 'camera' | 'screen';
export type PeerGetMediaStream = (input: PeerMediaStreamInput) => Promise<PeerGetMediaStreamRes>;
export type PeerGetMediaStreamRes = {
  media: MediaStream | undefined;
  done(): Promise<void>; // Indicates the consumer of the stream is finished ("done") and it can be released.
};

/**
 * The local peer.
 */
export type Peer = t.Disposable & {
  readonly kind: 'local:peer';
  readonly id: Id;
  readonly signal: Hostname;
  readonly connections: PeerConnections;
  readonly connections$: t.Observable<PeerConnectionChanged>;
  readonly connectionsByPeer: PeerConnectionsByPeer[];
  readonly disposed: boolean;
  data(connectTo: Id, options?: { name?: string }): Promise<PeerDataConnection>;
  media(connectTo: Id, input: PeerMediaStreamInput): Promise<PeerMediaConnection>;
};

export type PeerConnection = PeerDataConnection | PeerMediaConnection;
export type PeerConnectionsByPeer = { peer: Id } & PeerConnections;
export type PeerConnections = {
  readonly length: number;
  readonly all: PeerConnection[];
  readonly data: PeerDataConnection[];
  readonly media: PeerMediaConnection[];
};

type Connection = t.Disposable & {
  readonly id: Id;
  readonly peer: { local: Id; remote: Id };
  readonly isOpen: boolean;
  readonly isDisposed: boolean;
};

/**
 * A [Data] connection with a remote peer.
 */
export type PeerDataConnection = Connection & {
  readonly kind: 'data';
  readonly metadata: t.PeerMetaData;
  readonly in$: t.Observable<t.PeerDataPayload>;
  send<E extends t.Event>(event: E): PeerDataPayload;
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
export type PeerMetaData = { name: string };
export type PeerMetaMedia = { input: PeerMediaStreamInput };

/**
 * Peer connection change info.
 */
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
