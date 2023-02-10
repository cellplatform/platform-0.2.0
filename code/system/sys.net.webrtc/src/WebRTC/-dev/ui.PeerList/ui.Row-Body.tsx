import { AudioWaveform, Color, COLORS, css, t, useSizeObserver, WebRTC } from '../common';
import { ConnScreenshare } from './ui.Conn.Screenshare';

export type RowBodyProps = {
  peerConnections: t.PeerConnectionsByPeer;
  debug?: boolean;
  style?: t.CssValue;
  onConnectRequest?: t.PeerListConnectReqHandler;
  onDisplayConnRequest?: t.PeerListDisplayConnReqHandler;
};

export const RowBody: React.FC<RowBodyProps> = (props) => {
  const { peerConnections, debug } = props;
  const peerid = peerConnections.peer;
  const peerUri = WebRTC.Util.asUri(peerid);

  const media = peerConnections.media.find((item) => item.stream)?.stream;
  const video = media?.remote;
  const size = useSizeObserver();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
    }),
    body: css({
      Absolute: [5, 5, 7, 5],
      Flex: 'x-center-start',
    }),
    waveform: css({ Absolute: [null, 0, -7, 0] }),
    btn: css({
      marginRight: 8,
      ':last-child': { marginRight: 0 },
    }),
    peerid: css({
      Absolute: [null, null, -11, 0],
      fontSize: 7,
    }),
  };

  const elWaveform = video && size.ready && (
    <AudioWaveform
      style={styles.waveform}
      height={20}
      width={size.rect.width}
      stream={video}
      lineWidth={0.5}
      lineColor={Color.alpha(COLORS.CYAN, 0.8)}
    />
  );

  const elPeerId = debug && <div {...styles.peerid}>{peerUri}</div>;

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <ConnScreenshare
          style={styles.btn}
          peerConnections={peerConnections}
          onConnectRequest={props.onConnectRequest}
          onDisplayConnRequest={props.onDisplayConnRequest}
        />
      </div>
      {elWaveform}
      {elPeerId}
    </div>
  );
};
