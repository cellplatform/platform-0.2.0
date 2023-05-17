import { t, rx } from './common';

/**
 * Tools for working with the WebRTC shared network state.
 */
export const WebRtcState = {
  /**
   * Initialize a new {props} lens.
   */
  init(doc: t.NetworkDocSharedRef) {
    let _disposed = false;
    const { dispose, dispose$ } = rx.disposable(doc.dispose$);
    dispose$.subscribe(() => (_disposed = true));

    const api: t.WebRtcState = {
      kind: 'WebRtc:State',
      doc,

      /**
       * Lifecycle.
       */
      dispose,
      dispose$,
      get disposed() {
        return _disposed;
      },
    };

    return api;
  },
};
