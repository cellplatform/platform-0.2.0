import { useEffect, useState } from 'react';
import { Icons, css, Filesize, rx, type t, Value } from '../common';

export type SyncProps = {
  info?: t.WebRtcInfo;
  style?: t.CssValue;
};

export const Syncers: React.FC<SyncProps> = (props) => {
  const total = useSyncersTraffic(props.info);
  const { bytes, messages } = total;

  const size = Filesize(bytes, { round: 0 });
  const text = `${messages} ${Value.plural(messages, 'message', 'messages')}, ${size}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{messages > 0 ? text : 'none'}</div>
    </div>
  );
};

/**
 * Accumulate network traffic stats from all syncers.
 */
export function useSyncersTraffic(info?: t.WebRtcInfo) {
  const syncers = info?.syncers ?? [];
  const ids = syncers.map((item) => item.syncer.doc.id.doc);

  const [bytes, setBytes] = useState(0);
  const [messages, setMessages] = useState(0);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();

    const update = (count: number, bytes: number) => {
      setMessages(count);
      setBytes(bytes);
    };

    syncers.map(({ syncer }) => {
      syncer.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => update(e.count, e.bytes));
      update(syncer.count, syncer.bytes);
    });

    return dispose;
  }, [ids.join(':')]);

  return { messages, bytes };
}
