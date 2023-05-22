import { useState } from 'react';
import { DevMediaImage } from './Dev.Media.Image';
import { Button, COLORS, Color, MediaStream, css, t } from './common';
import { DevVimeo } from './Dev.Media.Vimeo';
import { DevYoutube } from './Dev.Media.YouTube';

export type DevMediaProps = {
  bus: t.EventBus<any>;
  self: t.Peer;
  shared: t.TDevSharedPropsLens;
  peerid?: t.PeerId;
  style?: t.CssValue;
};

export const DevMedia: React.FC<DevMediaProps> = (props) => {
  const { self, peerid, bus } = props;
  const isSelf = peerid === self.id;
  const shared = props.shared.current;

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
    base: css({ position: 'relative', backgroundColor: COLORS.WHITE }),
    empty: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      opacity: 0.3,
    }),
    selected: css({ Absolute: 0 }),
    thumbnails: css({ Absolute: [null, 20, 20, 20], Flex: 'x-center-center' }),
    thumbnail: css({
      marginRight: 6,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      ':last-child': { marginRight: 0 },
      borderRadius: 5,
    }),
    fill: css({ Absolute: 0 }),
    player: css({ Absolute: [null, null, 20, 20] }),
  };

  const elEmpty = <div {...styles.empty}>No media to display.</div>;

  if (conns.length === 0) {
    <div {...css(styles.base, props.style)}>{elEmpty}</div>;
  }

  const elThumbnails = conns.map((conn, i) => {
    const key = `${conn.id}:${i}`;
    const stream = isSelf ? conn.stream.local : conn.stream.remote;
    return (
      <Button key={key} style={styles.thumbnail} onClick={() => setSelected(conn)}>
        <MediaStream.Video stream={stream} width={46} height={46} muted={true} borderRadius={5} />
      </Button>
    );
  });

  const elVimeo = stream && (
    <MediaStream.Video stream={stream} muted={true} style={styles.selected} />
  );

  const elYoutube = shared.youtubeId && (
    <DevYoutube bus={bus} shared={props.shared} style={styles.fill} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {!elVimeo && elEmpty}
      {elVimeo}
      {elYoutube}
      <DevMediaImage bus={bus} shared={props.shared} style={styles.fill} />
      <DevVimeo bus={bus} shared={props.shared} style={styles.player} />

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
