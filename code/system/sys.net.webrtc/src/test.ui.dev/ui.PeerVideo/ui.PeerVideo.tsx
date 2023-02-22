import { useEffect, useState } from 'react';

import { Color, COLORS, css, Icons, MediaStream, t, useMouseState } from '../common';
import { PeerId } from '../ui.PeerId';
import { MediaControls } from './ui.MediaControls';
import { PeerCopied } from './ui.PeerCopied';
import { copyPeer } from '../util.mjs';

export type PeerVideoProps = {
  self: t.Peer;
  mediaHeight?: number;
  muted?: boolean;
  style?: t.CssValue;
  onMuteClick?(e: React.MouseEvent): void;
};

export const PeerVideo: React.FC<PeerVideoProps> = (props) => {
  const { self, mediaHeight = 250, muted = false } = props;

  const [showCopied, setShowCopied] = useState(false);

  // TEMP 🐷
  const cameraConnection = self.connections.media.find((conn) => conn.metadata.input === 'camera');

  const URL = {
    Allen:
      'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png',
    James:
      'https://user-images.githubusercontent.com/185555/220017460-0dfe4a43-aab5-46fc-8940-ea5a5813cff6.png',
    Rowan:
      'https://user-images.githubusercontent.com/185555/220252528-49154284-88e2-46aa-9544-2dff1c7a44a8.png',
  };

  /**
   * [Hooks]
   */
  const mouse = useMouseState();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const timer = setTimeout(() => setShowCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [showCopied]);

  /**
   * [Handlers]
   */
  const handleCopyPeer = () => {
    copyPeer(self.id);
    setShowCopied(true);
  };

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
        backgroundImage: `url(${URL.Rowan})`,
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

  const elPeerCopied = showCopied && <PeerCopied />;

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.video.base} onClick={handleCopyPeer}>
        {elBG}
        {elVideo}
        <MediaControls
          style={styles.controls}
          self={self}
          muted={muted}
          onMuteClick={props.onMuteClick}
        />
        {elPeerCopied}
      </div>
      <div {...styles.peer}>
        <PeerId peer={self.id} onClick={handleCopyPeer} />
      </div>
    </div>
  );
};
