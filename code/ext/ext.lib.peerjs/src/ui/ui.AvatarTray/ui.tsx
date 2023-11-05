import { useEffect, useState } from 'react';
import { Color, COLORS, DEFAULTS, Is, css, rx, type t } from './common';
import { Avatar } from './ui.Avatar';
import { useMediaStreams } from './use.MediaStreams';

export const View: React.FC<t.AvatarTrayProps> = (props) => {
  const { peer, size = DEFAULTS.size } = props;
  const { streams } = useMediaStreams(peer);
  const streamids = streams.map((s) => s.stream.id);
  const [selected, setSelected] = useState<t.AvatarTrayStream | undefined>();

  /**
   * Handlers
   */
  const handleChange = (selected?: t.AvatarTrayStream) => {
    setSelected(selected);
    props.onChange?.({ selected });
  };

  const handleClosed = (connid?: string) => {
    if (selected?.conn?.id === connid) {
      const first = streams[0];
      handleChange(first);
    }
  };

  /**
   * Listen
   */
  useEffect(() => {
    const events = peer?.events();

    type A = t.PeerModelConnAction;
    const action = (action: A) => events?.cmd.conn$.pipe(rx.filter((e) => e.action === action));
    action('closed')?.subscribe((e) => handleClosed(e.connection?.id));

    return events?.dispose;
  }, [streamids, selected?.stream.id, peer?.id]);

  /**
   * Render
   */
  if (streams.length === 0 && !props.emptyMessage) return null;

  const styles = {
    base: css({
      minHeight: size,
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(${streams.length}, auto)`,
      columnGap: '5px',
    }),
    emptyMessage: css({
      fontSize: 14,
      color: Color.alpha(COLORS.DARK, 0.2),
    }),
  };

  const elVideos = streams.map(({ conn, stream }) => {
    return (
      <Avatar
        key={stream.id}
        size={props.size}
        muted={props.muted}
        stream={stream}
        onClick={() => handleChange({ conn, stream })}
      />
    );
  });

  const elEmpty = props.emptyMessage && streams.length === 0 && (
    <div {...styles.emptyMessage}>{props.emptyMessage}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elVideos}
      {elEmpty}
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  stream(peer: t.PeerModel, selected?: string) {
    const connections = peer?.current.connections ?? [];

    if (selected) {
      const conn = connections.find((conn) => conn.id === selected);
      if (conn?.stream) return conn.stream.remote ?? conn.stream.self;
    }

    const first = connections.find((conn) => Is.kind.media(conn));
    return first?.stream?.remote ?? first?.stream?.self;
  },
} as const;
