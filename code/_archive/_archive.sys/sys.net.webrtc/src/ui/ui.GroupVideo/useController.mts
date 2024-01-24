import { useEffect, useState } from 'react';
import { Wrangle } from './Wrangle.mjs';
import { rx, type t } from './common';

/**
 * HOOK: Stateful behavior controller for the <GroupVideo> component.
 */
export function useController(args: { client?: t.WebRtcEvents; selected?: t.PeerId }) {
  const { client, selected } = args;

  const [media, setMedia] = useState<MediaStream>();
  const [count, setCount] = useState(0);
  const registerChange = () => setCount((prev) => prev + 1);

  /**
   * Monitor for connection changes.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (client && !client.disposed) {
      const $ = client.connections.changed.$.pipe(rx.takeUntil(dispose$));
      $.pipe(rx.debounceTime(50)).subscribe(registerChange);
    }
    return dispose;
  }, [client?.instance.id, client?.disposed, selected]);

  /**
   * Retrieve the selected media stream.
   */
  useEffect(() => {
    const life = rx.lifecycle();

    client?.info.get().then((info) => {
      if (life.disposed) return;
      setMedia(Wrangle.selectedStream(info?.peer, selected));
    });

    return life.dispose;
  }, [count, selected]);

  /**
   * API
   */
  return { media } as const;
}
