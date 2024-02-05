import { useState } from 'react';
import { Button, COLORS, Color, MediaStream, css, type t } from './common';

export type DevMediaProps = {
  self: t.Peer;
  peerid?: t.PeerId;
  style?: t.CssValue;
};

export const DevMedia: React.FC<DevMediaProps> = (props) => {
  const { self, peerid } = props;
  const isSelf = peerid === self.id;

  const [selected, setSelected] = useState<t.PeerMediaConnection>();

  const conns =
    self.connectionsByPeer.find((item) =>
      [item.peer.local, item.peer.remote].includes(peerid ?? ''),
    )?.media ?? [];

  const stream = Wrangle.selectedStream(isSelf, conns, selected);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
    }),
    empty: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      opacity: 0.3,
      userSelect: 'none',
    }),
    selected: css({ Absolute: 0 }),
    thumbnails: css({
      Absolute: [null, 20, 20, 20],
      Flex: 'x-center-end',
    }),
    thumbnail: css({
      border: `solid 5px ${Color.alpha(COLORS.WHITE, 0.2)}`,
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      marginRight: 8,
      ':last-child': { marginRight: 0 },
      borderRadius: 8,
    }),
    fill: css({ Absolute: 0 }),
    player: css({ Absolute: [null, null, 20, 20] }),
  };

  const elEmpty = <div {...styles.empty}>No media to display.</div>;

  if (conns.length === 0) {
    return <div {...css(styles.base, props.style)}>{elEmpty}</div>;
  }

  const elThumbnails = conns.map((conn, i) => {
    const key = `${conn.id}:${i}`;
    const stream = isSelf ? conn.stream.local : conn.stream.remote;
    const size = 80;
    return (
      <Button key={key} style={styles.thumbnail} onClick={() => setSelected(conn)}>
        <MediaStream.Video
          stream={stream}
          width={size}
          height={size}
          muted={true}
          borderRadius={5}
        />
      </Button>
    );
  });

  const elVideo = stream && (
    <MediaStream.Video stream={stream} muted={true} style={styles.selected} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elVideo || elEmpty}
      <div {...styles.thumbnails}>{elThumbnails}</div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  selectedStream(
    isSelf: boolean,
    conns: t.PeerMediaConnection[],
    selected?: t.PeerMediaConnection,
  ) {
    const conn = selected ?? conns[0];
    if (!conn) return undefined;
    return isSelf ? conn.stream.local : conn.stream.remote;
  },
};
