import { WebRTC } from '..';
import { AudioWaveform, Button, Color, COLORS, css, Icons, t, useSizeObserver } from './common';

export type RowBodyProps = {
  peerConnections: t.PeerConnectionSet;
  debug?: boolean;
  style?: t.CssValue;
  onConnectRequest?: t.OnPeerConnectRequestHandler;
};

export const RowBody: React.FC<RowBodyProps> = (props) => {
  const { peerConnections, debug } = props;
  const peerid = peerConnections.peer;
  const peerUri = WebRTC.Util.asUri(peerid);

  const media = peerConnections.media.find((item) => item.stream)?.stream;
  const video = media?.remote;
  const size = useSizeObserver();

  /**
   * [Handlers]
   */
  const startScreenShare = () => {
    /**
     * TODO 🐷
     * - [ ] Fire event through bus API (??)
     */
    props.onConnectRequest?.({
      peer: peerid,
      kind: 'media', // TODO - add concepts: "media:screen" | "media:camera"
    });
  };

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
      display: 'grid',
      placeItems: 'center',
      marginRight: 8,
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

  const elScreenShare = (
    <Button style={styles.btn} onClick={startScreenShare} tooltip={'Start Screenshare'}>
      <Icons.Screenshare size={22} />
    </Button>
  );

  const elPeerId = debug && <div {...styles.peerid}>{peerUri}</div>;

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {elScreenShare}
        {elScreenShare}
        {elScreenShare}
      </div>
      {elWaveform}
      {elPeerId}
    </div>
  );
};
