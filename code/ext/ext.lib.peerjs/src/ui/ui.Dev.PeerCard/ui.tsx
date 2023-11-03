import { useEffect, useState } from 'react';
import { COLORS, Color, ObjectView, css, rx, type t } from './common';
import { Connections } from './ui.Connections';
import { PeerActions } from './ui.PeerActions';
import { Title } from './ui.Title';

export const View: React.FC<t.DevPeerCardProps> = (props) => {
  const self = props.peer.self;
  const total = self?.current.connections.length ?? 0;

  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = self.events();
    events.$.subscribe(redraw);

    events.cmd.data$.subscribe((e) => {
      const peer = e.connection.peer;
      console.info('🌸 data', e.data, `from "${peer.remote}" to "${peer.self}"`);
    });

    events.cmd.conn$.pipe(rx.filter((e) => Boolean(e.error))).subscribe((e) => {
      console.info('conn$.error:', e.error);
    });

    return events.dispose;
  }, []);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      width: 300,
      fontSize: 14,
    }),
    section: css({
      marginTop: 8,
      paddingTop: 8,
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Title peer={props.peer} prefix={props.prefix} />

      <PeerActions peer={props.peer} style={styles.section} />

      {total > 0 && <Connections peer={props.peer} style={styles.section} />}

      <div {...styles.section}>
        <ObjectView data={self?.current} fontSize={10} expand={1} />
      </div>
    </div>
  );
};
