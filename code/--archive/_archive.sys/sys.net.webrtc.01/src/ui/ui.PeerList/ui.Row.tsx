import { css, type t } from '../common';
import { ActionBar } from './ui.Row.ActionBar';
import { RowBody } from './ui.Row.Body';
import { RowThumbnail } from './ui.Row.Thumbnail';

export type RowProps = {
  self: t.PeerId;
  peer: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const Row: React.FC<RowProps> = (props) => {
  const { self, peer, debug = false } = props;

  const localPeer = self;
  const remotePeer = peer.peer;

  const localStream = Wrangle.media(peer, 'local');
  const remoteStream = Wrangle.media(peer, 'remote');

  /**
   * [Handlers]
   */
  const printDebug = () => {
    console.debug('peer(connections):', peer);
  };

  /**
   * [Render]
   */
  const thumbnailSize = 50;
  const styles = {
    base: css({ position: 'relative', cursor: 'default' }),
    body: css({
      display: 'grid',
      gridTemplateColumns: `${thumbnailSize}px 10px 1fr 10px ${thumbnailSize}px 30px`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <RowThumbnail
          isSelf={true}
          peer={localPeer}
          stream={localStream}
          size={thumbnailSize}
          onClick={printDebug}
        />
        <div />
        <RowBody
          debug={debug}
          peerConnections={peer}
          onConnectRequest={props.onConnectRequest}
          onDisplayConnRequest={props.onDisplayConnRequest}
        />
        <div />
        <RowThumbnail
          peer={remotePeer.remote}
          stream={remoteStream}
          size={thumbnailSize}
          onClick={printDebug}
        />
        <ActionBar peerConnections={peer} />
      </div>
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  media(connections: t.PeerConnectionsByPeer, proximity: t.PeerProximity): MediaStream | undefined {
    const media = connections.media.find((item) => item.stream)?.stream;
    if (!media) return;
    if (proximity === 'local') return media?.local;
    if (proximity === 'remote') return media?.remote;
    return undefined;
  },
};
