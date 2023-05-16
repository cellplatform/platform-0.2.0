import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, MediaStream, Button } from './common';

export type DevVideoProps = {
  self: t.Peer;
  peerid?: t.PeerId;
  style?: t.CssValue;
};

export const DevVideo: React.FC<DevVideoProps> = (props) => {
  const { self, peerid } = props;
  const isSelf = peerid === self.id;
  const isRemote = !isSelf;

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
    }),
    selected: css({
      Absolute: 0,
    }),
    thumbnails: css({
      Absolute: [null, 20, 20, 20],
      Flex: 'x-center-center',
    }),
    thumbnail: css({
      marginRight: 6,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      ':last-child': { marginRight: 0 },
      borderRadius: 5,
    }),
  };

  const elEmpty = <div {...styles.empty}>No video to display.</div>;

  if (conns.length === 0) {
    <div {...css(styles.base, props.style)}>{elEmpty}</div>;
  }

  const elThumbnails = conns.map((conn, i) => {
    const key = `${conn.id}:${i}`;
    const stream = isSelf ? conn.stream.local : conn.stream.remote;
    return (
      <Button style={styles.thumbnail} onClick={() => setSelected(conn)}>
        <MediaStream.Video
          key={key}
          stream={stream}
          width={46}
          height={46}
          muted={true}
          borderRadius={5}
        />
      </Button>
    );
  });

  const elSelected = stream && (
    <MediaStream.Video stream={stream} muted={true} style={styles.selected} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {!elSelected && elEmpty}
      {elSelected}
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
