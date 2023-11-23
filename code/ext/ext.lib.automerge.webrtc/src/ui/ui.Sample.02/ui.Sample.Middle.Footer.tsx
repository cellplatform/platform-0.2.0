import { COLORS, Color, css, type t } from './common';
import { ApiHandle } from './ui.Sample.Middle.ApiHandle';
import { usePeerMonitor } from './use.Peer.Monitor';
import { useTransmitMonitor } from './use.Transmit.Monitor';

export type FooterProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const left = usePeerMonitor(props.left.network);
  const right = usePeerMonitor(props.right.network);
  const isConnected = left.isConnected && right.isConnected;
  const { isTransmitting } = useTransmitMonitor(left.bytes + right.bytes);

  /**
   * Render
   */
  const COLOR = isTransmitting ? COLORS.MAGENTA : COLORS.DARK;
  const SECS = 0.5;
  const styles = {
    base: css({
      height: 60,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    middle: css({
      position: 'relative',
      display: 'grid',
      alignContent: 'center',
      PaddingX: 8,
    }),
    connectorLine: css({
      borderTop: `dashed 3px ${Color.alpha(COLOR, 0.3)}`,
      opacity: isConnected ? 1 : 0,
      transition: `opacity ${SECS}s, border-color ${SECS}s`,
    }),
    labelOuter: css({
      Absolute: [10, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
      opacity: isConnected ? 1 : 0,
      transition: `opacity ${SECS}s, border-color ${SECS}s`,
      userSelect: 'none',
    }),
    label: css({
      fontSize: 9,
      fontFamily: 'monospace',
      letterSpacing: -0.1,
      width: 60,
      textAlign: 'center',
      overflow: 'hidden',
      color: Color.alpha(COLOR, isTransmitting ? 0.65 : 0.3),
      transition: `border-color ${SECS}s, color ${SECS}s`,
      textDecoration: 'none',
      ':hover': { color: COLORS.BLUE },
    }),
  };

  const testUrl = new URL(location.href);
  testUrl.searchParams.set('dev', 'ext.lib.automerge.webrtc.tests');

  const elMiddle = (
    <div {...styles.middle}>
      <div {...styles.labelOuter}>
        <a href={testUrl.href} {...styles.label} rel={'noopener noreferrer'} target={'_blank'}>
          {'WebRTC/data'}
        </a>
      </div>
      <div {...styles.connectorLine} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <ApiHandle edge={props.left} bytes={left.bytes} />
      {elMiddle}
      <ApiHandle edge={props.right} bytes={right.bytes} />
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
