import { COLORS, Color, css, type t } from './common';
import { PeerCard } from './ui.PeerCard';

export type RootProps = {
  peerA: t.Peer;
  peerB: t.Peer;
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  const { peerA, peerB } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: 'auto auto auto',
    }),
    peer: css({ margin: 15 }),
    divider: css({
      width: 1,
      MarginX: 10,
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerCard peer={{ self: peerA, remote: peerB }} style={styles.peer} />
      <div {...styles.divider} />
      <PeerCard peer={{ self: peerB, remote: peerA }} style={styles.peer} />
    </div>
  );
};
