import { rx, type t } from './common';

export function monitorAdapter(args: {
  adapter: t.WebrtcNetworkAdapter;
  dispose$?: t.UntilObservable;
  fire?: (e: t.WebrtcStoreMessageEvent) => void;
}) {
  const { adapter, fire } = args;
  const { dispose$ } = rx.disposable(args.dispose$);
  adapter.message$.pipe(rx.takeUntil(dispose$)).subscribe((payload) => {
    fire?.({
      type: 'crdt:webrtc/Message',
      payload,
    });
  });
}
