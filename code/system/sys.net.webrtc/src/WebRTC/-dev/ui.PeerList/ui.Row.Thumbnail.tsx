import { useState } from 'react';
import { css, MediaStream, Spinner, t } from '../common';
import { PeerId } from '../ui.PeerId';

export type RowThumbnailProps = {
  peer: t.PeerId;
  stream?: MediaStream;
  proximity: t.PeerProximity;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const RowThumbnail: React.FC<RowThumbnailProps> = (props) => {
  const { stream, proximity } = props;

  const [ready, setReady] = useState(false);

  /**
   * [Render]
   */
  const thumbnailSize = 50;
  const styles = {
    base: css({
      position: 'relative',
      Size: thumbnailSize,
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
      width={thumbnailSize}
      height={thumbnailSize}
      borderRadius={3}
      onLoadedData={() => setReady(true)}
    />
  );

  const elPeerId = <PeerId peer={props.peer} fontSize={8} abbreviate={4} style={styles.peerId} />;

  return (
    <div {...css(styles.base, props.style)} title={props.proximity} onClick={props.onClick}>
      {elBackground}
      {elVideo}
      {elPeerId}
    </div>
  );
};
