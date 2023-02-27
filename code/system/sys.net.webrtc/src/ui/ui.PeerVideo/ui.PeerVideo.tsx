import { useEffect, useState } from 'react';

import { Color, copyPeer, css, MediaStream, t, useMouseState, Spinner } from '../common';
import { PeerId } from '../ui.PeerId';
import { MediaControls } from './ui.MediaControls';
import { PeerCopied } from './ui.PeerCopied';

export type PeerVideoProps = {
  self?: t.Peer;
  mediaHeight?: number;
  muted?: boolean;
  spinning?: boolean;
  style?: t.CssValue;
  onMuteClick?(e: React.MouseEvent): void;
};

const URL = {
  Allen:
    'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png',
  Rowan:
    'https://user-images.githubusercontent.com/185555/220252528-49154284-88e2-46aa-9544-2dff1c7a44a8.png',
};

export const PeerVideo: React.FC<PeerVideoProps> = (props) => {
  const { self, mediaHeight = 250, muted = false } = props;
  const [showCopied, setShowCopied] = useState(false);
  const isSpinning = props.spinning ? true : !self;

  const mouse = useMouseState();

  // TEMP 🐷
  const cameraConnection = self?.connections.media.find((conn) => conn.metadata.input === 'camera');

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
    if (!self) return;
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
        position: 'relative',
        height: mediaHeight,
        backgroundImage: `url(${URL.Rowan})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }),
      bg: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
    },

    peer: css({
      height: 28,
      boxSizing: 'border-box',
      display: 'grid',
      placeItems: 'center',
    }),
    controls: css({
      Absolute: [10, 10, null, null],
      opacity: mouse.isOver || muted ? 1 : 0,
      transition: 'all 250ms ease',
    }),
    spinner: css({
      Absolute: 0,
      backgroundColor: Color.format(0.6),
      backdropFilter: `blur(10px)`,
      pointerEvents: 'none',
      opacity: isSpinning ? 1 : 0,
      transition: 'all 400ms ease',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elVideo = cameraConnection && (
    <MediaStream.Video stream={cameraConnection.stream.remote} muted={muted} height={mediaHeight} />
  );

  const elPeerCopied = showCopied && <PeerCopied />;

  const elMediaControls = self && (
    <MediaControls
      style={styles.controls}
      self={self}
      muted={muted}
      onMuteClick={props.onMuteClick}
    />
  );

  const elSpinner = (
    <div {...styles.spinner}>
      <Spinner.Puff />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.video.base}>
        <div {...styles.video.bg} onClick={handleCopyPeer} />
        {elVideo}
        {elMediaControls}
        {elPeerCopied}
        {elSpinner}
      </div>
      <div {...styles.peer}>{self && <PeerId peer={self.id} onClick={handleCopyPeer} />}</div>
    </div>
  );
};
