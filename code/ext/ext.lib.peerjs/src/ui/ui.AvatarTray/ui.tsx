import { DEFAULTS, css, type t } from './common';
import { Avatar } from './ui.Avatar';
import { useMediaStreams } from './use.MediaStreams';

export const View: React.FC<t.AvatarTrayProps> = (props) => {
  const { peer, size = DEFAULTS.size } = props;
  const { streams } = useMediaStreams(peer);

  if (streams.length === 0) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      minHeight: size,
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(${streams.length}, auto)`,
      columnGap: '5px',
    }),
  };

  const elVideos = streams.map(({ stream, conn }) => {
    return (
      <Avatar
        key={stream.id}
        size={props.size}
        muted={props.muted}
        stream={stream}
        onClick={() => props.onClick?.({ conn, stream })}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elVideos}</div>;
};
