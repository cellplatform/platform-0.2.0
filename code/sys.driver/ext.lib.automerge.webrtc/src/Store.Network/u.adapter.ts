import { rx, type t } from './common';

export function monitorAdapter(args: {
  adapter: t.PeerjsNetworkAdapter;
  dispose$?: t.UntilObservable;
  fire?: (e: t.WebrtcStoreMessageEvent) => void;
}) {
  const { adapter, fire } = args;
  const { dispose$ } = rx.disposable(args.dispose$);
  const detach = adapter.onData((payload) => fire?.({ type: 'crdt:net:webrtc/Message', payload }));
  dispose$.subscribe(() => detach());
}
