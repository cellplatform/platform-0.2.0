import { useEffect, useRef, useState } from 'react';
import { rx, type t, Vimeo } from './common';

/**
 * TODO
 * - move to [sys.ui.media.Vimeo]
 *
 * Vimeo.usePlayer(...)
 */

export function usePlayer(vimeo?: t.VimeoInstance) {
  const busid = useRef(rx.bus.instance(vimeo?.bus));

  const [events, setEvents] = useState<t.VimeoEvents>();
  const [status, setStatus] = useState<t.VimeoStatus>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (vimeo) {
      const events = Vimeo.Events(vimeo, { dispose$ });
      setEvents(events);

      const status$ = events.status.$.pipe(rx.takeUntil(dispose$));
      events.status.get().then((res) => setStatus(res.status));
      status$.subscribe((e) => setStatus(e));
    }
    return dispose;
  }, [busid, vimeo?.id]);

  /**
   * API
   */
  const api: t.VimeoPlayer = {
    ready: Boolean(events),
    events,
    status,
    get playing() {
      return Boolean(status?.playing);
    },
    play() {
      events?.play.fire();
    },
    pause() {
      events?.pause.fire();
    },
    toggle() {
      const playing = api.playing;
      if (playing) api.pause();
      if (!playing) api.play();
    },
  };
  return api;
}
