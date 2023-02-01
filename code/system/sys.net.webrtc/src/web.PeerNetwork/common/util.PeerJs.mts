import { PeerJS, rx } from '../../common';

/**
 * Monitors errors on a PeerJS instance.
 */
export const PeerJsUtil = {
  error(peer: PeerJS) {
    const $ = new rx.Subject<{ type: string; message: string }>();

    const handler = (error: any) => {
      const { type, message } = error;
      $.next({ type, message });
    };

    peer.on('error', handler);

    return {
      $: $.asObservable(),
      dispose() {
        peer.off('error', handler);
        $.complete();
      },
    };
  },
};
