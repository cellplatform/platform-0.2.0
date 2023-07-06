import { type t, rx } from './common';
import { init, is } from './Events.init.mjs';

/**
 * Event API.
 */
export const WebRtcEvents = {
  is,
  init,

  client(bus: t.EventBus<any>, peer: t.PeerId | t.Peer, dispose$?: t.Observable<any>) {
    return init({ bus, peer, dispose$ });
  },

  factory(bus: t.EventBus<any>, peer: t.PeerId | t.Peer, dispose$?: t.Observable<any>) {
    const base$ = dispose$;
    return (dispose$?: t.Observable<any>) => {
      const lifecycle = rx.disposable([dispose$, base$]);
      return WebRtcEvents.client(bus, peer, lifecycle.dispose$);
    };
  },
} as const;
