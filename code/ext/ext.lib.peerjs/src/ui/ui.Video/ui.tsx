import { useEffect, useState } from 'react';
import { DEFAULTS, Video, css, type t } from './common';
import { Empty } from './ui.Empty';

export const View: React.FC<t.VideoProps> = (props) => {
  const { peer, muted = DEFAULTS.muted, stream } = props;
  const isEmpty = !stream?.active;

  /**
   * State
   */
  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

  useEffect(() => {
    const events = peer?.events();
    events?.cmd.conn$.subscribe(redraw);
    return events?.dispose;
  }, [peer?.id]);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative' }),
    video: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {stream && <Video stream={stream} muted={muted} style={styles.video} />}
      {isEmpty && <Empty value={props.empty} />}
    </div>
  );
};
