import { useEffect, useState } from 'react';

import {
  R,
  Color,
  copyPeer,
  css,
  FC,
  MediaStream,
  Spinner,
  type t,
  useMouseState,
  DEFAULTS,
  FIELDS,
} from './common';
import { MediaControls } from './ui.MediaControls';
import { PeerCopied } from './ui.PeerCopied';
import { PeerInput } from '../ui.PeerInput';

const URL = {
  Rowan:
    'https://user-images.githubusercontent.com/185555/220252528-49154284-88e2-46aa-9544-2dff1c7a44a8.png',
};

/**
 * Types
 */
export type PeerCardProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  muted?: boolean;
  spinning?: boolean;
  gap?: number;
  backgroundUrl?: string;
  footerVideo?: MediaStream;

  devPanelWidth?: number | null;
  devShowFooter?: boolean;

  style?: t.CssValue;
  fill?: boolean;

  fields?: t.PeerInputField[];
  onMuteClick?(e: React.MouseEvent): void;
  onRemotePeerChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};

/**
 * Component
 */
const View: React.FC<PeerCardProps> = (props) => {
  const { self, muted = DEFAULTS.muted, fields = DEFAULTS.fields } = props;
  const gap = R.clamp(0, Number.MAX_VALUE, props.gap ?? DEFAULTS.gap);
  const isSpinning = props.spinning ? true : !self;
  const [showCopied, setShowCopied] = useState(false);
  const mouse = useMouseState();

  /**
   * TODO 🐷
   */
  const cameraConnection = self?.connections.media.find((conn) => conn.metadata.input === 'camera');
  const stream = cameraConnection?.stream.remote;

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
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    video: {
      base: css({
        position: 'relative',
        backgroundImage: `url(${props.backgroundUrl || URL.Rowan})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: self ? gap : 0,
      }),
      bg: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
      mediaOuter: css({
        Absolute: 0,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }),
      media: css({ Absolute: 0 }),
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

  const elVideo = stream && (
    <div {...styles.video.mediaOuter}>
      <MediaStream.Video stream={stream} muted={muted} {...styles.video.media} />
    </div>
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
      <PeerInput
        style={styles.footer}
        fields={fields}
        self={self}
        remote={props.remotePeer}
        video={props.footerVideo}
        spinning={props.spinning}
        onLocalCopied={handlePeerCopied}
        onRemoteChanged={props.onRemotePeerChanged}
        onConnectRequest={props.onConnectRequest}
      />
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FIELDS: typeof FIELDS;
};
export const PeerCard = FC.decorate<PeerCardProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'PeerCard' },
);
