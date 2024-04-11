import { WebRtc } from '../../WebRtc';
import { AudioWaveform, Color, COLORS, css, type t, useSizeObserver } from '../common';
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
  const peerid = peerConnections.peer.remote;
  const peerUri = WebRtc.Util.asUri(peerid);

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
    waveform: css({ Absolute: [-30, -15, null, -15] }),
    btn: css({
      marginRight: 8,
      ':last-child': { marginRight: 0 },
    }),
  };

  const elWaveform = video && size.ready && (
    <AudioWaveform
      style={styles.waveform}
      height={20}
      width={size.rect.width + 30}
      stream={video}
      lineWidth={0.5}
      lineColor={Color.alpha(COLORS.MAGENTA, 1)}
    />
  );

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      {elWaveform}
      <div {...styles.body}>
        {false && ( // TEMP: Hidden for now.
          <ConnScreenshare
            style={styles.btn}
            peerConnections={peerConnections}
            onConnectRequest={props.onConnectRequest}
            onDisplayConnRequest={props.onDisplayConnRequest}
          />
        )}
      </div>
    </div>
  );
};
