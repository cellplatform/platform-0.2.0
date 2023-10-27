import { COLORS, type t } from './common';

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

  iconColor(props: t.MediaToolbarProps) {
    const { selected, focused } = props;
    if (selected && focused) return COLORS.WHITE;
    return COLORS.DARK;
  },

  iconOpacity(props: t.MediaToolbarButtonProps, state: { spinning?: boolean; over?: boolean }) {
    const { selected, focused } = props;
    const { spinning, over } = state;
    if (spinning) return 0.1;
    const hasConn = Wrangle.hasConnectionOfKind(props, props.mediaKind);
    if (hasConn || over) return selected && focused ? 1 : 0.7;
    return selected && focused ? 0.5 : 0.25;
  },
} as const;
