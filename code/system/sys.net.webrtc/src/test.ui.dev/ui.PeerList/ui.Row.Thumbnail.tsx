import { useState } from 'react';
import { css, MediaStream, Spinner, t } from '../common';
import { PeerId } from '../ui.PeerId';
import { copyPeer } from '../util.mjs';

export type RowThumbnailProps = {
  peer: t.PeerId;
  stream?: MediaStream;
  size?: number;
  proximity: t.PeerProximity;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const RowThumbnail: React.FC<RowThumbnailProps> = (props) => {
  const { stream, proximity, size = 50 } = props;

  const [ready, setReady] = useState(false);

  /**
   * [Render]
   */
  // const thumbnailSize = 50;
  const styles = {
    base: css({
      position: 'relative',
      Size: size,
    }),
    bg: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }),
    video: css({}),
    peerId: css({
      Absolute: proximity === 'local' ? [null, null, -15, 0] : [null, 0, -15, null],
    }),

    brain: {
      base: css({
        Absolute: [-32, 0, null, 0],
        height: 22,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }),
      icon: css({ Size: 26 }),
    },
  };

  const elBackground = !ready && (
    <div {...styles.bg}>
      <Spinner.Orbit size={20} />
    </div>
  );

  const elVideo = stream && (
    <MediaStream.Video
      style={styles.video}
      stream={stream}
      muted={true}
      width={size}
      height={size}
      borderRadius={3}
      onLoadedData={() => setReady(true)}
    />
  );

  const elPeerId = (
    <PeerId
      peer={props.peer}
      fontSize={8}
      abbreviate={4}
      style={styles.peerId}
      onClick={() => copyPeer(props.peer)}
    />
  );

  const URL = {
    BRAIN:
      'https://user-images.githubusercontent.com/185555/219935439-de93ee61-cd18-485b-849d-eb9170eb62b0.png',
  };

  const elBrain = (
    <div {...styles.brain.base}>
      <img {...styles.brain.icon} src={URL.BRAIN} {...styles.brain.icon} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} title={props.proximity} onClick={props.onClick}>
      {elBackground}
      {elVideo}
      {elPeerId}
      {elBrain}
    </div>
  );
};
