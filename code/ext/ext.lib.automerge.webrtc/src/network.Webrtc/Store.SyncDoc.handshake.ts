import { rx, type t } from './common';

type TResponse = {
  doc: { uri: string };
  error?: string;
};

export async function handshake(args: {
  conn: t.DataConnection;
  local: t.DocRefHandle<t.WebrtcSyncDoc>;
  peer: t.PeerModel;
  dispose$?: t.UntilObservable;
}) {
  return new Promise<TResponse>((resolve, reject) => {
    const { peer, conn, local } = args;
    const events = peer.events(args.dispose$);
    const data$ = events.cmd.data$.pipe(rx.map((e) => e.data));

    const done = (uri: string, error?: string) => {
      resolve({ doc: { uri }, error });
    };

    const uri = local.uri;
    const remote = conn.peer;
    const id = conn.connectionId;
    const stop = { in$: rx.subject(), out$: rx.subject() } as const;
    const send = (event: t.WebrtcSyncDocEvent) => conn.send(event);

    const setup$ = rx.payload<t.WebrtcSyncDocSetupEvent>(data$, 'webrtc:ephemeral/setup').pipe(
      rx.takeUntil(stop.in$),
      rx.filter((e) => e.conn.id == id),
      rx.filter((e) => e.peer.to === peer.id),
    );

    const confirmed$ = rx
      .payload<t.WebrtcSyncDocConfirmedEvent>(data$, 'webrtc:ephemeral/confirmed')
      .pipe(
        rx.filter((e) => e.conn.id == id),
        rx.filter((e) => e.peer.to === peer.id),
        rx.filter((e) => e.doc.uri === local.uri),
      );

    confirmed$.subscribe(() => stop.out$.next());
    setup$.subscribe((e) => {
      stop.in$.next();
      const uri = e.doc.uri;
      const id = e.conn.id;
      send({
        type: 'webrtc:ephemeral/confirmed',
        payload: { doc: { uri }, conn: { id }, peer: { from: peer.id, to: remote } },
      });
      done(uri);
    });

    rx.timer(0, 1000)
      .pipe(rx.takeUntil(stop.out$))
      .subscribe(() => {
        send({
          type: 'webrtc:ephemeral/setup',
          payload: { conn: { id }, doc: { uri }, peer: { from: peer.id, to: remote } },
        });
      });
  });
}
