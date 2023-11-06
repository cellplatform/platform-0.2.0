import { useEffect } from 'react';
import { COLORS, Color, DEFAULTS, css, rx, type t } from './common';
import { Avatar } from './ui.Avatar';
import { useMediaStreams } from './use.MediaStreams';

export const View: React.FC<t.AvatarTrayProps> = (props) => {
  const { peer, size = DEFAULTS.size } = props;
  const { self, streams, streamids } = useMediaStreams(peer);
  const total = streams.length + (self ? 1 : 0);

  /**
   * Handlers
   */
  const handleClick = (selected?: MediaStream) => {
    if (!peer) return;
    props.onSelection?.({ peer, selected });
  };

  const handleClosed = (connid?: string) => {
    /**
     * TODO 🐷
     */
    console.log('handle Connection Closed', connid);
    // if (selected?.conn?.id === connid) {
    //   const first = streams[0];
    //   handleChange(first);
    // }
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
  }, [streamids, peer?.id]);

  /**
   * Render
   */
  if (total === 0 && !props.emptyMessage) return null;

  const styles = {
    base: css({
      minHeight: size,
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(${total}, auto)`,
      columnGap: '5px',
    }),
    emptyMessage: css({
      fontSize: 14,
      color: Color.alpha(COLORS.DARK, 0.2),
    }),
  };

  const avatar = (stream: MediaStream) => {
    return (
      <Avatar
        key={stream.id}
        size={props.size}
        muted={props.muted}
        stream={stream}
        onClick={() => handleClick(stream)}
      />
    );
  };

  const elSelf = self && avatar(self);
  const elOthers = streams.map((stream) => avatar(stream));

  const elEmpty = props.emptyMessage && total === 0 && (
    <div {...styles.emptyMessage}>{props.emptyMessage}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elSelf}
      {elOthers}
      {elEmpty}
    </div>
  );
};
