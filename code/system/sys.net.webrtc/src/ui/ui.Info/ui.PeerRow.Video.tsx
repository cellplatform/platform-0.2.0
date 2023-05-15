import { Color, COLORS, MediaStream, css, t } from './common';

export type VideoThumbnailsProps = {
  peerid: t.PeerId;
  media: t.PeerMediaConnection[];
  state?: t.NetworkStatePeer;
  isSelf?: boolean;
  style?: t.CssValue;
};

export const VideoThumbnails: React.FC<VideoThumbnailsProps> = (props) => {
  const { peerid, media, isSelf, state } = props;

  /**
   * [Render]
   */
  const borderRadius = 3;
  const styles = {
    base: css({
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      borderRadius,
    }),
  };

  const elThumbnails = media.map((item, i) => {
    const key = `${item.id}:${i}`;
    const stream = isSelf ? item.stream.local : item.stream.remote;
    const muted = !Boolean(state?.mic);
    const tooltip = `muted: ${muted}`; // TEMP 🐷

    return (
      <MediaStream.Video
        key={key}
        stream={stream}
        width={16}
        height={16}
        tooltip={tooltip}
        muted={muted}
        borderRadius={borderRadius}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elThumbnails}</div>;
};
