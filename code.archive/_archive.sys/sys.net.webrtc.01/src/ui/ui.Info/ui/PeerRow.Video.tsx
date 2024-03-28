import { Color, COLORS, MediaStream, css, type t } from '../common';

const RADIUS = 3;

export type VideoThumbnailsProps = {
  peerid: t.PeerId;
  media?: t.PeerMediaConnection[];
  state?: t.NetworkStatePeer;
  isSelf?: boolean;
  style?: t.CssValue;
};

export const VideoThumbnails: React.FC<VideoThumbnailsProps> = (props) => {
  const { peerid, isSelf, state } = props;
  const media = Wrangle.media(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Flex: 'x-center-center',
      backgroundColor: Color.alpha(COLORS.DARK, 0.1),
      borderRadius: RADIUS,
    }),
  };

  const elThumbnails = media.map((conn, i) => {
    const key = `${conn.id}:${i}`;
    const stream = isSelf ? conn.stream.local : conn.stream.remote;
    const muted = Wrangle.muted(props, conn);
    const tooltip = `muted: ${muted}`; // TEMP 🐷
    return (
      <MediaStream.Video
        key={key}
        stream={stream}
        width={16}
        height={16}
        tooltip={tooltip}
        muted={muted}
        borderRadius={Wrangle.radius(i, media.length)}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elThumbnails}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  media(props: VideoThumbnailsProps) {
    const { media = [], peerid, isSelf } = props;
    const camera = media.filter((conn) => conn.metadata.input === 'camera');
    const screen = media.filter((conn) => conn.metadata.input === 'screen');
    let res = [...camera, ...screen];

    res = res.filter((conn) => {
      if (isSelf && !conn.stream.local) return false;
      if (!isSelf && !conn.stream.remote) return false;
      return true;
    });

    return res;
  },

  muted(props: VideoThumbnailsProps, conn: t.PeerMediaConnection) {
    const { state, isSelf } = props;
    if (conn.metadata.input === 'screen') return true;
    if (isSelf) return true; // NB: Do not cause feedback look into own mic.
    return !Boolean(state?.conns?.mic);
  },

  radius(index: number, total: number) {
    const is = {
      first: index === 0,
      last: index === total - 1,
    };
    return [
      is.first ? RADIUS : 0,
      is.last ? RADIUS : 0,
      is.last ? RADIUS : 0,
      is.first ? RADIUS : 0,
    ] as t.CssRadiusInput;
  },
};
