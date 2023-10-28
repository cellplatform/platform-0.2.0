import { useEffect, useState } from 'react';
import { Wrangle } from './Wrangle';
import { Icons, css, type t } from './common';
import { MediaButton } from './ui.MediaButton';

export const View: React.FC<t.MediaToolbarProps> = (props) => {
  const { peer, dataId, selected, focused } = props;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const events = peer?.events();
    events?.cmd.conn$.subscribe(redraw);
    return events?.dispose;
  }, [peer?.id]);

  /**
   * [Render]
   */
  const iconColor = Wrangle.iconColor(props);
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'repeat(3, auto)',
    }),
  };

  const mediaButton = (kind: t.PeerConnectionMediaKind, marginRight?: number) => {
    return (
      <MediaButton
        kind={kind}
        peer={peer}
        dataId={dataId}
        selected={selected}
        focused={focused}
        style={{ marginRight }}
      />
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      {mediaButton('media:video', 5)}
      {mediaButton('media:screen', 6)}
      <Icons.Antenna size={15} color={iconColor} />
    </div>
  );
};
