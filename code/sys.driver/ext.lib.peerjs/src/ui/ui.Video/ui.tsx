import { useEffect, useState } from 'react';
import { Color, DEFAULTS, Video, css, rx, type t } from './common';
import { Empty } from './ui.Empty';

export const View: React.FC<t.VideoProps> = (props) => {
  const { peer, muted = DEFAULTS.muted, stream, empty = DEFAULTS.empty } = props;
  const isEmpty = !stream?.active;

  /**
   * State
   */
  const [, setRedraw] = useState(0);
  const redraw = () => setRedraw((prev) => prev + 1);

  useEffect(() => {
    const events = peer?.events();
    events?.cmd.conn$.pipe(rx.debounceTime(10)).subscribe(redraw);
    return events?.dispose;
  }, [peer?.id]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({ position: 'relative', color: theme.fg }),
    video: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {stream && <Video stream={stream} muted={muted} style={styles.video} />}
      {isEmpty && empty && <Empty value={empty} theme={theme.name} />}
    </div>
  );
};
