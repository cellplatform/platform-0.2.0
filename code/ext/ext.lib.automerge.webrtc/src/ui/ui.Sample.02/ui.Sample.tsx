import { useEffect, useState } from 'react';

import { COLORS, Color, css, rx, type t } from './common';
import { SampleEdge } from './ui.Sample.Edge';
import { SampleMiddle } from './ui.Sample.Middle';

export type SampleProps = {
  left: t.SampleEdge;
  right: t.SampleEdge;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { left, right } = props;

  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const total = (peer: t.PeerModel) => peer.current.connections.length;
    const update = () => {
      const isConnected = total(left.peer) > 0 && total(right.peer) > 0;
      setConnected(isConnected);
    };

    const monitor = (peer: t.PeerModel) => {
      const events = peer.events(dispose$);
      events.cmd.conn$.subscribe(() => update());
    };

    monitor(left.peer);
    monitor(right.peer);

    return dispose;
  }, [left.peer.id, right.peer.id]);

  /**
   * Render
   */
  const border = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '250px 1fr 250px',
    }),
    left: css({ borderRight: border }),
    right: css({ borderLeft: border }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SampleEdge name={'Left'} edge={left} style={styles.left} />
      <SampleMiddle isConnected={isConnected} />
      <SampleEdge name={'Right'} edge={right} style={styles.right} />
    </div>
  );
};
