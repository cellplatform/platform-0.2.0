import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Button, Icons } from './common';

export const View: React.FC<t.MediaToolbarProps> = (props) => {
  const { peer } = props;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  const startMedia = async (mediaKind: t.PeerConnectionMediaKind) => {
    const kind = Wrangle.toConnectionKind(mediaKind);
    const hasConn = Wrangle.hasConnectionOfKind(props, kind);
    const remoteid = Wrangle.remoteid(props);
    if (!hasConn && remoteid) await peer?.connect.media(mediaKind, remoteid);
  };

  const startVideo = () => {
    return startMedia('media:video');
  };

  const startScreenshare = () => {
    return startMedia('media:screen');
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    tmp: css({ fontSize: 11 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.tmp}>
        <Button onClick={startVideo}>{'🐷'}</Button>
        <Button onClick={startScreenshare}>{'🌼'}</Button>
      </div>
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  dataConnection(props: t.MediaToolbarProps) {
    if (!props.peer || !props.connid) return;
    return props.peer.current.connections.find((item) => item.id === props.connid);
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
