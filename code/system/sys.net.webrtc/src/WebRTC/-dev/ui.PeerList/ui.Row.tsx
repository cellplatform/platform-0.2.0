import { css, t } from '../common';
import { ActionBar } from './ui.Row-ActionBar';
import { RowBody } from './ui.Row-Body';
import { RowThumbnail } from './ui.Row-Thumbnail';

export type RowProps = {
  self: t.PeerId;
  connections: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const Row: React.FC<RowProps> = (props) => {
  const { self, connections, debug = true } = props;

  const localPeer = self;
  const remotePeer = connections.peer;

  const localStream = Wrangle.media(connections, 'local');
  const remoteStream = Wrangle.media(connections, 'remote');

  /**
   * [Handlers]
   */
  const printDebug = () => {
    console.debug('peer(connections):', connections);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', cursor: 'default' }),
    body: css({
      display: 'grid',
      gridTemplateColumns: '45px 10px 1fr 10px 45px 30px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <RowThumbnail
          peer={localPeer}
          stream={localStream}
          proximity={'local'}
          onClick={printDebug}
        />
        <div />
        <RowBody
          debug={debug}
          peerConnections={connections}
          onConnectRequest={props.onConnectRequest}
          onDisplayConnRequest={props.onDisplayConnRequest}
        />
        <div />
        <RowThumbnail
          peer={remotePeer}
          stream={remoteStream}
          proximity={'remote'}
          onClick={printDebug}
        />
        <ActionBar peerConnections={connections} />
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
