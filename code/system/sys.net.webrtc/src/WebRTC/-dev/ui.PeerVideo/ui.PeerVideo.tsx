import { Button, Color, COLORS, css, Icons, MediaStream, t, TextSyntax, WebRTC } from '../common';

export type PeerVideoProps = {
  self: t.Peer;
  mediaHeight?: number;
  muted?: boolean;
  style?: t.CssValue;
};

export const PeerVideo: React.FC<PeerVideoProps> = (props) => {
  const { self, mediaHeight = 250, muted = false } = props;
  const peerUri = WebRTC.Util.asUri(self.id);
  const peerid = WebRTC.Util.asId(self.id);

  // TEMP 🐷
  const media = self.connections.media[0]; // TEMP - from selection 🐷

  // TEMP 🐷
  const PROFILE =
    'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png';

  /**
   * [Handlers]
   */
  const copyPeer = () => navigator.clipboard.writeText(peerUri);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    video: {
      base: css({
        height: mediaHeight,
        position: 'relative',
        borderBottom: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
        backgroundImage: `url(${PROFILE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }),
      bg: css({
        Absolute: 0,
        pointerEvents: 'none',
        display: 'grid',
        placeItems: 'center',
      }),
    },
    peer: css({ display: 'grid', justifyContent: 'center', padding: 5 }),
  };

  const elPeer = (
    <Button onClick={copyPeer}>
      <TextSyntax text={peerUri} monospace={true} fontWeight={'bold'} fontSize={13} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.video.base}>
        <div {...styles.video.bg}>
          <Icons.Face.Caller size={80} opacity={0.2} />
        </div>
        {media && (
          <MediaStream.Video stream={media.stream.remote} muted={muted} height={mediaHeight} />
        )}
      </div>
      <div {...styles.peer}>{elPeer}</div>
    </div>
  );
};
