import { css, t } from '../common';
import { Row } from './ui.Row';

export type PeerListProps = {
  peer: t.Peer;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const PeerList: React.FC<PeerListProps> = (props) => {
  const { peer } = props;
  const peerConnections = peer.connectionsByPeer;

  if (peerConnections.length === 0) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    row: css({
      marginBottom: 15,
      ':last-child': { marginBottom: 0 },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {peerConnections.map((connections) => (
        <Row
          key={connections.peer}
          peerConnections={connections}
          style={styles.row}
          onConnectRequest={props.onConnectRequest}
          onDisplayConnRequest={props.onDisplayConnRequest}
        />
      ))}
    </div>
  );
};
