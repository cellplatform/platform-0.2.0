import { Crdt, t, rx } from './common';

/**
 * Tools for working with the WebRTC shared network state.
 */
export const WebRtcState = {
  /**
   * Initialize a new {props} lens.
   */
  init<N extends string = string>(doc: t.NetworkDocSharedRef) {
    const api: t.WebRtcState<N> = {
      kind: 'WebRtc:State',
      doc,

      /**
       * Retrieve a lens into the { props.[namespace] } object.
       */
      props<T extends {}>(namespace: N, initial: T) {
        return Crdt.lens<t.NetworkDocShared, T>(doc, (draft) => {
          const network = draft.network;
          const props = network.props || (network.props = {});
          const subject = props[namespace] || (props[namespace] = initial);
          return subject as T;
        });
      },
    };

    return api;
  },
};
