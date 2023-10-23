import { COLORS, Color, css, type t } from './common';
import { Peer } from './ui.Peer';

export type RootProps = {
  peerA: t.PeerJs;
  peerB: t.PeerJs;
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
      <Peer peer={{ self: peerA, remote: peerB }} style={styles.peer} />
      <div {...styles.divider} />
      <Peer peer={{ self: peerB, remote: peerA }} style={styles.peer} />
    </div>
  );
};
