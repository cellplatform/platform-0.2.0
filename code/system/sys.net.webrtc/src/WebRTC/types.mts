import type { t } from '../common.t';

type Id = string;
type Hostname = string;
type Semver = string;

export type PeerId = string;
export type PeerModule = { name: string; version: Semver };

/**
 * The local peer.
 */
export type Peer = t.Disposable & {
  readonly kind: 'local:peer';
  readonly id: Id;
  readonly signal: Hostname;
  readonly connections$: t.Observable<PeerConnectionChange>;
  readonly connections: PeerConnection[];
  readonly dataConnections: PeerDataConnection[];
  readonly mediaConnections: PeerMediaConnection[];
  readonly disposed: boolean;
  data(connectTo: Id): Promise<PeerDataConnection>;
  media(connectTo: Id, local: MediaStream): Promise<PeerMediaConnection>;
};

export type PeerConnection = PeerDataConnection | PeerMediaConnection;

type Connection = t.Disposable & {
  readonly id: Id;
  readonly peer: { local: Id; remote: Id };
  readonly open: boolean;
  readonly disposed: boolean;
};

/**
 * A [Data] connection with a remote peer.
 */
export type PeerDataConnection = Connection & {
  readonly kind: 'data';
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
  readonly stream: PeerMediaStreams;
};

export type PeerMediaStreams = { local: MediaStream; remote: MediaStream };

/**
 * Peer connection change
 */
export type PeerConnectionChange = PeerDataConnectionChange | PeerMediaConnectionChange;

type ConnectionChange = {
  action: 'added' | 'removed';
  connections: PeerConnection[];
};

export type PeerDataConnectionChange = ConnectionChange & {
  kind: 'data';
  subject: PeerDataConnection;
};

export type PeerMediaConnectionChange = ConnectionChange & {
  kind: 'media';
  subject: PeerMediaConnection;
};
