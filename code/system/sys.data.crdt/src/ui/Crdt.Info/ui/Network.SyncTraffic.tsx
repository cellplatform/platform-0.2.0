import { useEffect, useState } from 'react';
import { css, Filesize, rx, t, Value } from '../common';

export type SyncProps = {
  syncDoc: t.CrdtDocSync<any>;
  style?: t.CssValue;
};

export const SyncTraffic: React.FC<SyncProps> = (props) => {
  const { syncDoc } = props;
  const [bytes, setBytes] = useState(0);
  const [count, setCount] = useState(0);
  const size = Filesize(bytes, { round: 0 });
  const text = `${count} ${Value.plural(count, 'message', 'messages')}, ${size}`;

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    syncDoc.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
      setCount(e.count);
      setBytes(e.bytes);
    });

    setCount(syncDoc.count);
    setBytes(syncDoc.bytes);

    return dispose;
  }, [syncDoc.doc.id.doc]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{count > 0 ? text : 'none'}</div>
    </div>
  );
};
