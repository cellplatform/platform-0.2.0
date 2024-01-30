import { NetworkConnection } from '../ui.NetworkConnection';
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
  const hidden = props.left.visible === false && props.right.visible === false;

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', overflow: 'hidden' }),
    connection: css({
      Absolute: [null, 0, 0, 0],
      display: hidden ? 'none' : undefined,
    }),
    stream: css({ Absolute: 0 }),
    mask: {
      base: css({
        Absolute: [null, 0, 0, 0],
        display: hidden ? 'none' : undefined,
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
    <PeerUI.Video stream={props.stream} muted={true} style={styles.stream} empty={''} />
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
