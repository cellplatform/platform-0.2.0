import { TimeHTMLAttributes, useEffect, useRef, useState } from 'react';
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
      const playing$ = events.status.playing$.pipe(rx.takeUntil(dispose$));

      events.status.get().then((res) => setStatus(res.status));
      status$.subscribe((e) => setStatus(e));

      // Resinde on complete
      playing$.pipe(rx.filter((e) => e.percent === 1)).subscribe((e) => {
        api.seek(0);
      });
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
    seek(seconds) {
      events?.seek.fire(seconds);
    },
  };
  return api;
}
