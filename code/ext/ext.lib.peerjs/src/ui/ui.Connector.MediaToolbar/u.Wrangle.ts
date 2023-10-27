import { type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  dataConnection(props: t.MediaToolbarProps) {
    if (!props.peer || !props.dataId) return;
    return props.peer.current.connections.find((item) => item.id === props.dataId);
  },

  remoteid(props: t.MediaToolbarProps) {
    const data = Wrangle.dataConnection(props);
    return data?.peer.remote;
  },

  connections(props: t.MediaToolbarProps) {
    return props.peer?.current.connections ?? [];
  },

  hasConnectionOfKind(props: t.MediaToolbarProps, ...kinds: t.PeerConnectionKind[]) {
    const remoteid = Wrangle.remoteid(props);
    return Wrangle.connections(props)
      .filter((item) => item.peer.remote === remoteid)
      .some((item) => kinds.includes(item.kind));
  },

  toConnectionKind(media: t.PeerConnectionMediaKind): t.PeerConnectionKind {
    if (media === 'media:video') return 'media:video';
    if (media === 'media:screen') return 'media:screen';
    throw new Error(`Media kind '${media}' not supported.`);
  },
} as const;
