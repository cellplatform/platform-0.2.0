import { firstValueFrom, Observable, of, timeout } from 'rxjs';
import { catchError, filter, map, take, takeUntil } from 'rxjs/operators';

import { cuid, rx, slug, t, UriUtil } from '../common';
import { EventNamespace } from './ns.mjs';

type Milliseconds = number;

/**
 * Helpers for working with the events model for a [PeerNetwork].
 */
export function PeerEvents(
  eventbus: t.EventBus<any>,
  options: { dispose$?: Observable<any> } = {},
): t.PeerEvents {
  const disposable = rx.disposable(options.dispose$);
  const { dispose, dispose$ } = disposable;
  const bus = rx.busAsType<t.PeerEvent>(eventbus);

  const clone = (dispose$?: t.Observable<any>) => {
    const events = PeerEvents(eventbus, { dispose$ });
    disposable?.dispose$.pipe(take(1)).subscribe(events.dispose);
    return events;
  };

  const bus$ = bus.$.pipe(
    takeUntil(dispose$),
    filter(EventNamespace.is.peer.base),
    map((e) => e as t.PeerEvent),
  );

  /**
   * CREATE
   */
  const create: t.PeerEvents['create'] = (signal, options = {}) => {
    const self = options.self || cuid();
    const { timeout } = options;
    const res = firstValueFrom(created(self).$);
    bus.fire({
      type: 'sys.net/peer/local/init:req',
      payload: { self, signal, timeout },
    });
    return res;
  };

  /**
   * CREATED
   */
  const created = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);
    const $ = rx
      .payload<t.PeerLocalInitResEvent>(bus$, 'sys.net/peer/local/init:res')
      .pipe(filter((e) => e.self === self));
    return { self, $ };
  };

  /**
   * STATUS
   */
  const status = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);

    const req$ = rx
      .payload<t.PeerLocalStatusReqEvent>(bus$, 'sys.net/peer/local/status:req')
      .pipe(filter((e) => e.self === self));
    const res$ = rx
      .payload<t.PeerLocalStatusResEvent>(bus$, 'sys.net/peer/local/status:res')
      .pipe(filter((e) => e.self === self));
    const changed$ = rx
      .payload<t.PeerLocalStatusChangedEvent>(bus$, 'sys.net/peer/local/status:changed')
      .pipe(filter((e) => e.self === self));

    const get = () => {
      const tx = slug();
      const res = firstValueFrom(res$.pipe(filter((e) => e.tx === tx)));
      bus.fire({ type: 'sys.net/peer/local/status:req', payload: { self, tx } });
      return res;
    };

    const refresh = () => {
      bus.fire({ type: 'sys.net/peer/local/status:refresh', payload: { self } });
    };

    const object = async (): Promise<t.PeerStatusObject> => {
      let _current = (await get()).peer as t.PeerStatus; // NB: Initial value.
      changed$.subscribe((e) => (_current = e.peer));
      return {
        $: changed$.pipe(map((e) => e.peer)),
        get current() {
          return _current;
        },
      };
    };

    return { self, get, object, refresh, req$, res$, changed$ };
  };

  /**
   * PURGE
   */
  const purge = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);

    const req$ = rx
      .payload<t.PeerLocalPurgeReqEvent>(bus$, 'sys.net/peer/local/purge:req')
      .pipe(filter((e) => e.self === self));
    const res$ = rx
      .payload<t.PeerLocalPurgeResEvent>(bus$, 'sys.net/peer/local/purge:res')
      .pipe(filter((e) => e.self === self));

    const fire = (select?: t.PeerLocalPurgeReq['select']) => {
      const tx = slug();
      const res = firstValueFrom(res$.pipe(filter((e) => e.tx === tx)));
      bus.fire({ type: 'sys.net/peer/local/purge:req', payload: { self, tx, select } });
      return res;
    };

    return { self, req$, res$, fire };
  };

  /**
   * LOCAL: Media
   */
  const media = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);

    const req$ = rx
      .payload<t.PeerLocalMediaReqEvent>(bus$, 'sys.net/peer/local/media:req')
      .pipe(filter((e) => e.self === self));
    const res$ = rx
      .payload<t.PeerLocalMediaResEvent>(bus$, 'sys.net/peer/local/media:res')
      .pipe(filter((e) => e.self === self));

    type Req = t.PeerLocalMediaReq;
    type C = Req['constraints'];
    type O = { constraints?: C; tx?: string };

    const video = async (options?: O) => request({ kind: 'media/video', ...options });
    const screen = async (options?: O) => request({ kind: 'media/screen', ...options });
    const request = async (args: {
      kind: t.PeerConnectionKindMedia;
      constraints?: C;
      tx?: string;
    }) => {
      const { kind, constraints } = args;
      const tx = args.tx || slug();
      const res = firstValueFrom(res$.pipe(filter((e) => e.tx === tx)));
      bus.fire({
        type: 'sys.net/peer/local/media:req',
        payload: { self, tx, kind, constraints },
      });
      return res;
    };

    const respond = (args: {
      tx: string;
      kind: t.PeerConnectionKindMedia;
      media?: MediaStream;
      error?: t.PeerError;
    }) => {
      const { tx, kind, media, error } = args;
      bus.fire({
        type: 'sys.net/peer/local/media:res',
        payload: { self, tx, kind, media, error },
      });
    };

    return { self, req$, res$, request, video, screen, respond };
  };

  /**
   * CONNECT (Outgoing)
   */
  const connection = (self: t.PeerId, remote: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);
    remote = UriUtil.peer.trimPrefix(remote);

    const connected$ = rx
      .payload<t.PeerConnectResEvent>(bus$, 'sys.net/peer/conn/connect:res')
      .pipe(filter((e) => e.self === self && e.remote === remote));

    const disconnected$ = rx
      .payload<t.PeerDisconnectResEvent>(bus$, 'sys.net/peer/conn/disconnect:res')
      .pipe(filter((e) => e.self === self));

    const open = {
      data(options: { isReliable?: boolean; parent?: t.PeerConnectionId } = {}) {
        const { isReliable, parent } = options;
        const tx = slug();
        const res = firstValueFrom(connected$.pipe(filter((e) => e.tx === tx)));
        bus.fire({
          type: 'sys.net/peer/conn/connect:req',
          payload: { self, tx, remote, kind: 'data', direction: 'outgoing', isReliable, parent },
        });
        return res;
      },

      media(
        kind: t.PeerConnectMediaReq['kind'],
        options: { constraints?: t.PeerMediaConstraints; parent?: t.PeerConnectionId } = {},
      ) {
        const { constraints, parent } = options;
        const tx = slug();
        const res = firstValueFrom(connected$.pipe(filter((e) => e.tx === tx)));
        bus.fire({
          type: 'sys.net/peer/conn/connect:req',
          payload: { self, tx, remote, kind, direction: 'outgoing', constraints, parent },
        });
        return res;
      },
    };

    const close = (connection: t.PeerConnectionId) => {
      const tx = slug();
      const res = firstValueFrom(disconnected$.pipe(filter((e) => e.tx === tx)));
      bus.fire({
        type: 'sys.net/peer/conn/disconnect:req',
        payload: { self, tx, remote, connection },
      });
      return res;
    };

    const isConnected = async () => {
      const current = (await status(self).get()).peer;
      if (!current) throw new Error(`Status could not be retrieved`);

      remote = UriUtil.peer.trimPrefix(remote);
      return current.connections
        .filter(({ kind }) => kind === 'data')
        .some(({ peer }) => peer.remote.id === remote);
    };

    return { self, remote, connected$, disconnected$, open, close, isConnected };
  };

  /**
   * Connections
   */
  const connections = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);

    const connect = {
      req$: rx
        .payload<t.PeerConnectReqEvent>(bus$, 'sys.net/peer/conn/connect:req')
        .pipe(filter((e) => e.self === self)),
      res$: rx.payload<t.PeerConnectResEvent>(bus$, 'sys.net/peer/conn/connect:res').pipe(
        filter((e) => e.self === self),
        filter((e) => !e.existing),
      ),
    };

    const disconnect = {
      req$: rx
        .payload<t.PeerDisconnectReqEvent>(bus$, 'sys.net/peer/conn/disconnect:req')
        .pipe(filter((e) => e.self === self)),
      res$: rx
        .payload<t.PeerDisconnectResEvent>(bus$, 'sys.net/peer/conn/disconnect:res')
        .pipe(filter((e) => e.self === self)),
    };

    return { self, connect, disconnect };
  };

  /**
   * Data stream
   */
  const data = (self: t.PeerId) => {
    self = UriUtil.peer.trimPrefix(self);

    const out = {
      req$: rx
        .payload<t.PeerDataOutReqEvent>(bus$, 'sys.net/peer/data/out:req')
        .pipe(filter((e) => e.self === self)),
      res$: rx
        .payload<t.PeerDataOutResEvent>(bus$, 'sys.net/peer/data/out:res')
        .pipe(filter((e) => e.self === self)),
    };

    const in$ = rx
      .payload<t.PeerDataInEvent>(bus$, 'sys.net/peer/data/in')
      .pipe(filter((e) => e.self === self));

    const send = (data: any, options: { targets?: t.PeerConnectionUriString[] } = {}) => {
      const { targets } = options;
      const tx = slug();
      const res = firstValueFrom(out.res$.pipe(filter((e) => e.tx === tx)));
      bus.fire({
        type: 'sys.net/peer/data/out:req',
        payload: { tx, self, data, targets },
      });
      return res;
    };

    return { self, out, in$, send };
  };

  /**
   * Investigate remote peers
   */
  const remote = {
    exists: {
      req$: rx.payload<t.PeerRemoteExistsReqEvent>(bus$, 'sys.net/peer/remote/exists:req'),
      res$: rx.payload<t.PeerRemoteExistsResEvent>(bus$, 'sys.net/peer/remote/exists:res'),
      async get(args: { self: t.PeerId; remote: t.PeerId; timeout?: Milliseconds }) {
        const self = UriUtil.peer.trimPrefix(args.self);
        const remotePeer = UriUtil.peer.trimPrefix(args.remote);

        const tx = slug();
        const msecs = args.timeout ?? 10000;
        const first = firstValueFrom(
          remote.exists.res$.pipe(
            filter((e) => e.tx === tx),
            timeout(msecs),
            catchError(() => of(`[remote.exists] timed out after ${msecs} msecs`)),
          ),
        );

        bus.fire({
          type: 'sys.net/peer/remote/exists:req',
          payload: { tx, self, remote: remotePeer },
        });

        const res = await first;
        if (typeof res !== 'string') return res;

        const fail: t.PeerRemoteExistsRes = {
          tx,
          self,
          remote: remotePeer,
          exists: false,
          error: res,
        };
        return fail;
      },
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus) },
    $: bus$,
    dispose,
    dispose$: dispose$.pipe(take(1)),
    clone,

    create,
    created,
    status,
    purge,
    media,
    connection,
    connections,
    data,
    remote,
  };
}
