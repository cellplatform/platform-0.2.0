import { useState } from 'react';
import { css, MediaStream, Spinner, t } from '../common';

export type RowThumbnailProps = {
  peerConnections: t.PeerConnectionsByPeer;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const RowThumbnail: React.FC<RowThumbnailProps> = (props) => {
  const { peerConnections } = props;

  const [ready, setReady] = useState(false);
  const media = peerConnections.media.find((item) => item.stream)?.stream;
  const video = media?.remote;

  /**
   * [Render]
   */
  const thumbnailSize = 40;
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
  };

  const elBackground = !ready && (
    <div {...styles.bg}>
      <Spinner.Orbit size={20} />
    </div>
  );

  const elVideo = video && (
    <MediaStream.Video
      style={styles.video}
      stream={video}
      muted={true}
      width={thumbnailSize}
      height={thumbnailSize}
      borderRadius={3}
      onLoadedData={() => setReady(true)}
    />
  );

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      {elBackground}
      {elVideo}
    </div>
  );
};
