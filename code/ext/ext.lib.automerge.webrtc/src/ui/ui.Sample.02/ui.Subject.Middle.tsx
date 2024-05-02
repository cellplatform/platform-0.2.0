import { NetworkConnection } from '../ui.Network.Connection';
import { COLORS, Color, PeerUI, css, type t } from './common';

export type SampleMiddleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  stream?: MediaStream;
  style?: t.CssValue;
};

export const SampleMiddle: React.FC<SampleMiddleProps> = (props) => {
  const left = Wrangle.connectionEdge(props.left);
  const right = Wrangle.connectionEdge(props.right);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', overflow: 'hidden' }),
    connection: css({ Absolute: [null, 0, 0, 0] }),
    stream: css({ Absolute: 0 }),
    mask: {
      base: css({
        Absolute: [null, 0, 0, 0],
        backgroundColor: Color.alpha(COLORS.WHITE, 0.8),
        height: 76,
      }),
      divider: css({
        Absolute: [-10, 0, null, 0],
        height: 10,
        backdropFilter: 'blur(15px)',
        backgroundColor: Color.alpha(COLORS.WHITE, 0.2),
      }),
    },
  };

  const elStream = props.stream && (
    <PeerUI.Video stream={props.stream} muted={true} style={styles.stream} empty={null} />
  );

  const elMask = elStream && (
    <div {...styles.mask.base}>
      <div {...styles.mask.divider} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elStream}
      {elMask}
      <NetworkConnection left={left} right={right} style={styles.connection} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  connectionEdge(edge: t.SampleEdge): t.NetworkConnectionEdge {
    const { kind, network } = edge;
    return { kind, network };
  },
} as const;
