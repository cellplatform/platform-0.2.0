import { useEffect, useRef, useState } from 'react';
import { Button, Color, COLORS, css, t, rx, Icons, MediaStream } from '../common';

export type PeerRowProps = {
  self: t.Peer;
  state: t.NetworkStatePeer;
  style?: t.CssValue;
};

export const PeerRow: React.FC<PeerRowProps> = (props) => {
  const { self, state } = props;
  const isSelf = self.id === state.id;

  const [muted, setMuted] = useState(false);

  const connections = self.connectionsByPeer.find((item) => {
    return item.peer.remote === state.id;
  });
  console.log('connections', connections);

  /**
   * Handlers
   */
  const connect = async () => {
    //
    console.log('connect');
    const res = self.media(state.id, 'camera');
    console.log('connect:res', res);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      flex: 1,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      height: 16,
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
    }),
    icon: css({ marginLeft: 10 }),
  };

  const iconColor = Color.alpha(COLORS.DARK, 0.8);
  const elIconDoc = <Icons.Network.Docs size={15} color={iconColor} style={styles.icon} />;

  // const camera = connections?.media.find((conn) => conn.metadata.input === 'camera');
  // const camera = Wrangle.camera(self, state.id);
  // const elMedia = camera?.stream && (
  //   // <MediaStream.Video width={15} height={15} stream={camera.stream.remote} />
  // );

  return (
    <div {...css(styles.base, props.style)}>
      <div>
        {isSelf && <div>Me</div>}
        {/* <div>{elMedia}</div> */}
      </div>
      <div>
        <div>{!isSelf && <Button onClick={connect}>Video</Button>}</div>
      </div>
      {elIconDoc}
    </div>
  );
};

/**
 * [Helpers]
 */
const Wrangle = {
  connections(self: t.Peer, peer: t.PeerId) {
    //
  },

  camera(self: t.Peer, peer: t.PeerId) {
    // const connections = self.connectionsByPeer.find((item) => {
    //   return item.peer.remote === state.id;
    // });
    // const isSelf = self.id === peer;
    // return self.connectionsByPeer.find((conn) => conn.metadata.input === 'camera');
    // return self.connectionsByPeer.find((conn) => conn.peer.);
  },
};
