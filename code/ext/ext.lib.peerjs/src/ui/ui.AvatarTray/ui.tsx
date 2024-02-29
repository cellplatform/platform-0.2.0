import { useEffect } from 'react';
import { COLORS, Color, DEFAULTS, css, rx, type t } from './common';
import { Avatar } from './ui.Avatar';
import { useMediaStreams } from './use.MediaStreams';

export const View: React.FC<t.AvatarTrayProps> = (props) => {
  const { peer, emptyMessage, size = DEFAULTS.size, gap = DEFAULTS.gap } = props;
  const { self, streams, streamids } = useMediaStreams(peer);
  const total = streams.length + (self ? 1 : 0);

  /**
   * Handlers
   */
  const handleClick = (selected?: MediaStream) => {
    if (peer) props.onSelection?.({ peer, total, selected });
  };

  const handleClosed = (connid?: string) => {
    /**
     * TODO 🐷
     */
    console.log(`TODO <${DEFAULTS.displayName}> handle Connection Closed`, connid);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = peer?.events();

    type A = t.PeerModelConnAction;
    const action = (action: A) => events?.cmd.conn$.pipe(rx.filter((e) => e.action === action));
    action('closed')?.subscribe((e) => handleClosed(e.connection?.id));

    return events?.dispose;
  }, [streamids, peer?.id]);

  useEffect(() => {
    if (peer) props.onTotalChanged?.({ total, peer });
  }, [total, peer?.id]);

  /**
   * Render
   */
  if (total === 0 && !props.emptyMessage) return null;

  const styles = {
    base: css({
      position: 'relative',
      minHeight: size,
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({ display: 'flex', flexWrap: 'wrap', gap: `${gap}px` }),
    empty: css({ fontSize: 14, color: Color.alpha(COLORS.DARK, 0.2) }),
  };

  const avatar = (stream: MediaStream, muted?: boolean) => {
    return (
      <Avatar
        key={stream.id}
        size={props.size}
        muted={muted}
        stream={stream}
        onClick={() => handleClick(stream)}
      />
    );
  };

  const elSelf = self && avatar(self, true);
  const elOthers = streams.map((stream) => avatar(stream, props.muted));
  const elEmpty = emptyMessage && total === 0 && <div {...styles.empty}>{emptyMessage}</div>;

  const elBody = !elEmpty && (
    <div {...styles.body}>
      {elSelf}
      {elOthers}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elBody}
      {elEmpty}
    </div>
  );
};
