import { useState } from 'react';
import { css, MediaStream, Spinner, type t, copyPeer } from '../common';
import { PeerId } from '../ui.PeerId';

export type RowThumbnailProps = {
  peer: t.PeerId;
  stream?: MediaStream;
  isSelf?: boolean;
  size?: number;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const RowThumbnail: React.FC<RowThumbnailProps> = (props) => {
  const { stream, size = 50, isSelf = false } = props;
  const [ready, setReady] = useState(false);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', Size: size }),
    bg: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }),
    video: css({}),
    peerId: css({
      Absolute: [null, 0, -12, 0],
      display: 'grid',
      placeItems: 'center',
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
      style={styles.peerId}
      peer={props.peer}
      prefix={isSelf ? 'me' : undefined}
      fontSize={8}
      abbreviate={4}
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
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      {elBackground}
      {elVideo}
      {elPeerId}
      {elBrain}
    </div>
  );
};
