import { COLORS, Color, css, type t } from './common';
import { Api } from './ui.Sample.Middle.Api';
import { usePeerMonitor } from './use.Peer.Monitor';

export type FooterProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const left = usePeerMonitor(props.left.network);
  const right = usePeerMonitor(props.right.network);
  const isConnected = left.isConnected && right.isConnected;

  /**
   * Render
   */
  const styles = {
    base: css({
      height: 60,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    middle: css({
      display: 'grid',
      alignContent: 'center',
      PaddingX: 8,
    }),
    connected: css({
      borderTop: `dashed 3px ${Color.alpha(COLORS.MAGENTA, 0.3)}`,
      opacity: isConnected ? 1 : 0,
      transition: `opacity 0.3s`,
    }),
  };

  const elMiddle = (
    <div {...styles.middle}>
      <div {...styles.connected} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Api edge={'Left'} bytes={left.bytes} />
      {elMiddle}
      <Api edge={'Right'} bytes={right.bytes} />
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  bytes(input: number) {
    return `${input} B`;
  },
} as const;
