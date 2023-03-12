import { useEffect, useState } from 'react';

import { Color, copyPeer, css, FC, MediaStream, Spinner, t, useMouseState } from '../common';
import { MediaControls } from './ui.MediaControls';
import { PeerCopied } from './ui.PeerCopied';
import { Footer } from './ui.Footer';

export type PeerVideoProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  mediaHeight?: number;
  muted?: boolean;
  spinning?: boolean;
  showPeer?: boolean;
  showConnect?: boolean;
  style?: t.CssValue;
  onMuteClick?(e: React.MouseEvent): void;
  onRemotePeerChanged?: t.PeerVideoRemoteChangedHandler;
  onConnectRequest?: t.PeerVideoConnectRequestHandler;
};

const DEFAULTS = {
  showPeer: true,
  showConnect: true,
};

const URL = {
  Rowan:
    'https://user-images.githubusercontent.com/185555/220252528-49154284-88e2-46aa-9544-2dff1c7a44a8.png',
};

const View: React.FC<PeerVideoProps> = (props) => {
  const {
    self,
    mediaHeight = 250,
    muted = false,
    showPeer = DEFAULTS.showPeer,
    showConnect = DEFAULTS.showConnect,
  } = props;
  const [showCopied, setShowCopied] = useState(false);
  const isSpinning = props.spinning ? true : !self;

  const mouse = useMouseState();

  // TEMP 🐷
  /**
   * TODO 🐷
   */
  const cameraConnection = self?.connections.media.find((conn) => conn.metadata.input === 'camera');

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const timer = setTimeout(() => setShowCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [showCopied]);

  /**
   * [Handlers]
   */
  const handlePeerCopied = () => {
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
      media: css({}),
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
    footer: css({}),
  };

  const elVideo = cameraConnection && (
    <MediaStream.Video
      stream={cameraConnection.stream.remote}
      muted={muted}
      height={mediaHeight}
      style={styles.video.media}
    />
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
        <div {...styles.video.bg} onClick={handlePeerCopied} />
        {elVideo}
        {elMediaControls}
        {elPeerCopied}
        {elSpinner}
      </div>
      <Footer
        style={styles.footer}
        self={self}
        remotePeer={props.remotePeer}
        showPeer={showPeer}
        showConnect={showConnect}
        isSpinning={props.spinning}
        onLocalPeerCopied={handlePeerCopied}
        onRemotePeerChanged={props.onRemotePeerChanged}
        onConnectRequest={props.onConnectRequest}
      />
    </div>
  );
};

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const PeerVideo = FC.decorate<PeerVideoProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PeerVideo' },
);
