import { useState, useEffect } from 'react';
import { css, type t, rx } from './common';
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
  const styles = {
    base: css({ position: 'relative', Flex: 'x-center-center' }),
  };

  const mediaButton = (kind: t.PeerConnectionMediaKind, style?: t.CssValue) => {
    return (
      <MediaButton
        mediaKind={kind}
        peer={peer}
        dataId={dataId}
        selected={selected}
        focused={focused}
        style={style}
      />
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      {mediaButton('media:video', { marginRight: 5 })}
      {mediaButton('media:screen')}
    </div>
  );
};
