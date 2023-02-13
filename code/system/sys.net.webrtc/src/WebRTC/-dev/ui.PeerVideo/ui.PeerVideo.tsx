import { Color, COLORS, css, Icons, MediaStream, t, useMouseState } from '../common';
import { PeerId } from '../ui.PeerId';
import { MediaControls } from './ui.MediaControls';

export type PeerVideoProps = {
  self: t.Peer;
  mediaHeight?: number;
  muted?: boolean;
  style?: t.CssValue;
};

export const PeerVideo: React.FC<PeerVideoProps> = (props) => {
  const { self, mediaHeight = 250, muted = false } = props;

  // TEMP 🐷
  const cameraConnection = self.connections.media.find((conn) => conn.metadata.input === 'camera');
  const PROFILE =
    'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png';

  /**
   * [Hooks]
   */
  const mouse = useMouseState();

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
    controls: css({
      Absolute: [10, 10, null, null],
      opacity: mouse.isOver || muted ? 1 : 0,
      transition: 'all 250ms ease',
    }),
  };

  const elBG = (
    <div {...styles.video.bg}>
      <Icons.Face.Caller size={80} opacity={0.2} />
    </div>
  );

  const elVideo = cameraConnection && (
    <MediaStream.Video stream={cameraConnection.stream.remote} muted={muted} height={mediaHeight} />
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.video.base}>
        {elBG}
        {elVideo}
        <MediaControls style={styles.controls} self={self} muted={muted} />
      </div>
      <div {...styles.peer}>
        <PeerId peer={self.id} />
      </div>
    </div>
  );
};
