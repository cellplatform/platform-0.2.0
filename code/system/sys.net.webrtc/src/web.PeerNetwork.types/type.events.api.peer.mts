import { t } from './common';

type Id = string;
type Milliseconds = number;

/**
 * Event API for interacting with a network.
 */
export type PeerEvents = t.Disposable & {
  instance: { bus: Id };
  $: t.Observable<t.PeerEvent>;
  clone(dispose$?: t.Observable<any>): PeerEvents;

  create(
    signal: string,
    options?: { self?: t.PeerId; timeout?: Milliseconds },
  ): Promise<t.PeerLocalInitRes>;
  created(self: t.PeerId): {
    self: t.PeerId;
    $: t.Observable<t.PeerLocalInitRes>;
  };

  status(self: t.PeerId): {
    self: t.PeerId;
    req$: t.Observable<t.PeerLocalStatusReq>;
    res$: t.Observable<t.PeerLocalStatusRes>;
    changed$: t.Observable<t.PeerLocalStatusChanged>;
    get(): Promise<t.PeerLocalStatusRes>;
    object(): Promise<t.PeerStatusObject>;
    refresh(): void;
  };

  purge(self: t.PeerId): {
    self: t.PeerId;
    req$: t.Observable<t.PeerLocalPurgeReq>;
    res$: t.Observable<t.PeerLocalPurgeRes>;
    fire(select?: t.PeerLocalPurgeReq['select']): Promise<t.PeerLocalPurgeRes>;
  };

  media(self: t.PeerId): {
    self: t.PeerId;
    req$: t.Observable<t.PeerLocalMediaReq>;
    res$: t.Observable<t.PeerLocalMediaRes>;
    request(args: {
      kind: t.PeerConnectionKindMedia;
      constraints?: t.PeerLocalMediaReq['constraints'];
      tx?: string;
    }): Promise<t.PeerLocalMediaRes>;
    video(options?: {
      constraints?: t.PeerLocalMediaReq['constraints'];
      tx?: string;
    }): Promise<t.PeerLocalMediaRes>;
    screen(options?: {
      constraints?: t.PeerLocalMediaReq['constraints'];
      tx?: string;
    }): Promise<t.PeerLocalMediaRes>;
    respond(args: {
      tx: string;
      kind: t.PeerConnectionKindMedia;
      media?: MediaStream;
      error?: t.PeerError;
    }): void;
  };

  connection(
    self: t.PeerId,
    remote: t.PeerId,
  ): {
    self: t.PeerId;
    remote: t.PeerId;
    connected$: t.Observable<t.PeerConnectRes>;
    disconnected$: t.Observable<t.PeerDisconnectRes>;
    open: {
      data(options?: {
        isReliable?: boolean;
        parent?: t.PeerConnectionId;
      }): Promise<t.PeerConnectRes>;
      media(
        kind: t.PeerConnectMediaReq['kind'],
        options?: { constraints?: t.PeerMediaConstraints; parent?: t.PeerConnectionId },
      ): Promise<t.PeerConnectRes>;
    };
    close(connection: t.PeerConnectionId): Promise<t.PeerDisconnectRes>;
    isConnected(): Promise<boolean>;
  };

  connections(self: t.PeerId): {
    self: t.PeerId;
    connect: {
      req$: t.Observable<t.PeerConnectReq>;
      res$: t.Observable<t.PeerConnectRes>;
    };
    disconnect: {
      req$: t.Observable<t.PeerDisconnectReq>;
      res$: t.Observable<t.PeerDisconnectRes>;
    };
  };

  data(self: t.PeerId): {
    self: t.PeerId;
    in$: t.Observable<t.PeerDataIn>;
    out: {
      req$: t.Observable<t.PeerDataOutReq>;
      res$: t.Observable<t.PeerDataOutRes>;
    };
    send(data: any, options?: { targets?: t.PeerConnectionUriString[] }): Promise<t.PeerDataOutRes>;
  };

  remote: {
    exists: {
      req$: t.Observable<t.PeerRemoteExistsReq>;
      res$: t.Observable<t.PeerRemoteExistsRes>;
      get(args: {
        self: t.PeerId;
        remote: t.PeerId;
        timeout?: Milliseconds;
      }): Promise<t.PeerRemoteExistsRes>;
    };
  };
};
