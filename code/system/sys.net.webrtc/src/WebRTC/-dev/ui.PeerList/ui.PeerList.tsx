import { css, t } from '../common';
import { Row } from './ui.Row';

export type PeerListProps = {
  self: t.Peer;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const PeerList: React.FC<PeerListProps> = (props) => {
  const { self } = props;
  const peerConnections = self.connectionsByPeer;
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
          self={self.id}
          connections={connections}
          style={styles.row}
          onConnectRequest={props.onConnectRequest}
          onDisplayConnRequest={props.onDisplayConnRequest}
        />
      ))}
    </div>
  );
};
