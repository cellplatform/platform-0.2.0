import type { t } from '../common.t';

type Id = string;
type Hostname = string;
type Semver = string;

export type PeerId = string;
export type PeerModule = { name: string; version: Semver };

export type PeerGetMediaStream = () => Promise<PeerGetMediaStreamResponse>;
export type PeerGetMediaStreamResponse = {
  media: MediaStream | undefined;
  done(): Promise<void>;
};

/**
 * The local peer.
 */
export type Peer = t.Disposable & {
  readonly kind: 'local:peer';
  readonly id: Id;
  readonly signal: Hostname;
  readonly connections$: t.Observable<PeerConnectionChanged>;
  readonly connections: PeerConnection[];
  readonly dataConnections: PeerDataConnection[];
  readonly mediaConnections: PeerMediaConnection[];
  readonly connectionsByPeer: PeerConnectionSet[];
  readonly disposed: boolean;
  data(connectTo: Id): Promise<PeerDataConnection>;
  media(connectTo: Id): Promise<PeerMediaConnection>;
};

export type PeerConnection = PeerDataConnection | PeerMediaConnection;
export type PeerConnectionKind = PeerConnection['kind'];

export type PeerConnectionSet = {
  peer: Id;
  all: PeerConnection[];
  data: PeerDataConnection[];
  media: PeerMediaConnection[];
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
