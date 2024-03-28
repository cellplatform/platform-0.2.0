import { useEffect, useRef, useState } from 'react';
import { Button, Color, COLORS, css, Icons, type t } from '../common';

export type ConnScreenshareProps = {
  peerConnections: t.PeerConnectionsByPeer;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const ConnScreenshare: React.FC<ConnScreenshareProps> = (props) => {
  const { peerConnections } = props;
  const peer = peerConnections.peer.remote;
  const screenConn = peerConnections.media.find((item) => item.metadata.input === 'screen');

  const [isOver, setOver] = useState(false);

  /**
   * [Handlers]
   */
  const onClick = () => {
    if (!screenConn) {
      props.onConnectRequest?.({ peer, kind: 'media:screen' });
    }
    if (screenConn) {
      const connection = screenConn.id;
      props.onDisplayConnRequest?.({ connection });
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    btn: css({
      display: 'grid',
      placeItems: 'center',
      color: Wrangle.iconColor(props, isOver),
    }),
  };

  const elButton = (
    <Button
      style={styles.btn}
      onClick={onClick}
      onMouse={(e) => setOver(e.isOver)}
      tooltip={Wrangle.tooltip(props)}
    >
      <Icons.Screenshare.Start size={22} />
    </Button>
  );

  return <div {...css(styles.base, props.style)}>{elButton}</div>;
};

/**
 * Helpers
 */

const Wrangle = {
  hasScreenshare(props: ConnScreenshareProps) {
    return props.peerConnections.media.find((item) => item.metadata.input === 'screen');
  },
  iconColor(props: ConnScreenshareProps, isOver: boolean) {
    const hasScreenshare = Wrangle.hasScreenshare(props);
    if (hasScreenshare) return COLORS.DARK;
    return isOver ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.5);
  },
  tooltip(props: ConnScreenshareProps) {
    const hasScreenshare = Wrangle.hasScreenshare(props);
    if (!hasScreenshare) return 'Start Screenshare';
    return 'Display Screenshare';
  },
};
