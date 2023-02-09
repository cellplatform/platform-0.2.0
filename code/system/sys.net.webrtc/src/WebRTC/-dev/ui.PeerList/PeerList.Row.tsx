import { css, t } from '../common';
import { ActionBar } from './PeerList.Row-ActionBar';
import { RowBody } from './PeerList.Row-Body';
import { RowThumbnail } from './PeerList.Row-Thumbnail';

export type RowProps = {
  peerConnections: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
  onConnectRequest?: t.OnPeerConnectRequestHandler;
};

export const Row: React.FC<RowProps> = (props) => {
  const { peerConnections, debug = true } = props;

  /**
   * [Handlers]
   */
  const printDebug = () => {
    console.debug('peer(connections):', peerConnections);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      cursor: 'default',
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: '45px 15px 1fr 30px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <RowThumbnail peerConnections={peerConnections} onClick={printDebug} />
        <div className={'gap'} />
        <RowBody
          peerConnections={peerConnections}
          debug={debug}
          onConnectRequest={props.onConnectRequest}
        />
        <ActionBar peerConnections={peerConnections} />
      </div>
    </div>
  );
};
