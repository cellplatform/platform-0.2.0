import { rx, type t } from './common';

export function monitorAdapter(args: {
  adapter: t.WebrtcNetworkAdapter;
  dispose$?: t.UntilObservable;
  fire?: (e: t.WebrtcStoreMessageEvent) => void;
}) {
  const { fire, dispose$ = rx.subject() } = args;
  const message$ = args.adapter.message$.pipe(rx.takeUntil(dispose$));
  message$.subscribe((payload) =>
    fire?.({
      type: 'crdt:webrtc/Message',
      payload,
    }),
  );
}
