import { css, t, COLORS, Color } from './common';
import { PeerRow } from './ui.PeerList.Row';

export type PeerListProps = {
  peer: t.Peer;
  style?: t.CssValue;
};

export const PeerList: React.FC<PeerListProps> = (props) => {
  const { peer } = props;
  const peers = peer.connectionsByPeer;
  if (peers.length === 0) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    list: css({ marginTop: 10 }),
    hrBottom: css({
      borderBottom: `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`,
      marginTop: 20,
      marginBottom: 20,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.list}>
        {peers.map((connections) => (
          <PeerRow key={connections.peer} connections={connections} />
        ))}
      </div>
      <div {...styles.hrBottom} />
    </div>
  );
};
